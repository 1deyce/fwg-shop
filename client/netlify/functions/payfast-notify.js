import { connectLambda, getStore } from "@netlify/blobs";
import { downloadLinksFor } from "./_lib/catalog.js";
import { sendDownloadEmail } from "./_lib/email.js";
import {
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

    const links = downloadLinksFor(order.ids);
    await orders.setJSON(data.m_payment_id, { ...order, fulfilled: true });

    try {
        await sendDownloadEmail({ to: order.email, name: order.name, links });
    } catch (err) {
        console.error("Email send failed, will retry on next ITN:", err);
        await orders.setJSON(data.m_payment_id, { ...order, fulfilled: false });
        return { statusCode: 500, body: "Email send failed" };
    }

    console.log("Order fulfilled:", data.m_payment_id);
    return ok();
};
