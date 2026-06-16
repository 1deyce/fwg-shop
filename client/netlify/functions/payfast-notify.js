import { connectLambda, getStore } from "@netlify/blobs";
import { filesFor } from "./_lib/catalog.js";
import { sendDownloadEmail } from "./_lib/email.js";
import {
    SANDBOX,
    parseOrderedForm,
    validateWithPayfast,
    verifySignature,
} from "./_lib/payfast.js";

const ok = () => ({ statusCode: 200, body: "OK" });

export const handler = async (event) => {
    connectLambda(event);

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method not allowed" };
    }

    const rawBody = event.isBase64Encoded
        ? Buffer.from(event.body || "", "base64").toString("utf8")
        : event.body || "";

    const pairs = parseOrderedForm(rawBody);
    const data = Object.fromEntries(pairs);
    const passphrase = process.env.PAYFAST_PASSPHRASE;

    if (!verifySignature(pairs, passphrase)) {
        console.warn("ITN rejected: bad signature", data.m_payment_id);
        return ok();
    }

    if (!(await validateWithPayfast(rawBody))) {
        console.warn("ITN rejected: PayFast validation failed", data.m_payment_id);
        return ok();
    }

    if (data.payment_status !== "COMPLETE") {
        console.log("ITN ignored: status", data.payment_status, data.m_payment_id);
        return ok();
    }

    const orders = getStore("orders");
    const order = await orders.get(data.m_payment_id, { type: "json" });

    if (!order) {
        console.warn("ITN ignored: unknown m_payment_id", data.m_payment_id);
        return ok();
    }
    if (order.fulfilled) {
        console.log("ITN ignored: already fulfilled", data.m_payment_id);
        return ok();
    }

    const expected = Number(order.amount).toFixed(2);
    const paid = Number(data.amount_gross).toFixed(2);
    if (expected !== paid) {
        console.warn(`ITN rejected: amount mismatch (expected ${expected}, got ${paid})`);
        return ok();
    }

    let attachments;
    try {
        const products = getStore("products");
        attachments = [];
        for (const { file } of filesFor(order.ids)) {
            const buf = await products.get(file, { type: "arrayBuffer" });
            if (!buf) {
                throw new Error(`Product file missing from blobs: ${file}`);
            }
            attachments.push({
                filename: file,
                contentBase64: Buffer.from(buf).toString("base64"),
            });
        }
    } catch (err) {
        console.error("Could not load product files, will retry on next ITN:", err);
        return { statusCode: 500, body: "Product files unavailable" };
    }

    // In sandbox, redirect the email to the merchant so test orders (and any
    // purchase attempts) land in your inbox. In live mode, BCC the merchant so
    // there's a record of every real order.
    const notifyEmail = process.env.ORDER_NOTIFY_EMAIL;
    const recipient = SANDBOX ? notifyEmail : order.email;
    if (!recipient) {
        console.error("No recipient: set ORDER_NOTIFY_EMAIL (required in sandbox)");
        await orders.setJSON(data.m_payment_id, { ...order, fulfilled: false });
        return { statusCode: 500, body: "Email recipient not configured" };
    }

    await orders.setJSON(data.m_payment_id, { ...order, fulfilled: true });

    try {
        await sendDownloadEmail({
            to: recipient,
            name: order.name,
            attachments,
            bcc: SANDBOX ? undefined : notifyEmail,
            sandbox: SANDBOX,
            customerEmail: order.email,
        });
    } catch (err) {
        console.error("Email send failed, will retry on next ITN:", err);
        await orders.setJSON(data.m_payment_id, { ...order, fulfilled: false });
        return { statusCode: 500, body: "Email send failed" };
    }

    console.log("Order fulfilled:", data.m_payment_id);
    return ok();
};
