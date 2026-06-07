import crypto from "node:crypto";
import { connectLambda, getStore } from "@netlify/blobs";
import { priceCart } from "./_lib/catalog.js";
import { PAYFAST_PROCESS_URL, signFields } from "./_lib/payfast.js";

const json = (statusCode, body) => ({
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
});

export const handler = async (event) => {
    connectLambda(event);

    if (event.httpMethod !== "POST") {
        return json(405, { error: "Method not allowed" });
    }

    let payload;
    try {
        payload = JSON.parse(event.body || "{}");
    } catch {
        return json(400, { error: "Invalid JSON" });
    }

    const name = (payload.name || "").trim();
    const email = (payload.email || "").trim();
    const ids = (payload.items || []).map((item) =>
        typeof item === "object" ? item.id : item,
    );

    if (!name || !email) {
        return json(400, { error: "Name and email are required" });
    }

    let cart;
    try {
        cart = priceCart(ids);
    } catch {
        return json(400, { error: "Your cart is empty or contains invalid items" });
    }

    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
    const passphrase = process.env.PAYFAST_PASSPHRASE;
    const siteUrl = process.env.URL || process.env.SITE_URL;

    if (!merchantId || !merchantKey || !siteUrl) {
        return json(500, { error: "Payment is not configured on the server" });
    }

    const mPaymentId = crypto.randomUUID();
    const amount = cart.total.toFixed(2);
    const itemName =
        cart.items.length === 1
            ? cart.items[0].name
            : `Shop FWG order (${cart.items.length} items)`;

    const fields = {
        merchant_id: merchantId,
        merchant_key: merchantKey,
        return_url: `${siteUrl}/checkout-success`,
        cancel_url: `${siteUrl}/store`,
        notify_url: `${siteUrl}/.netlify/functions/payfast-notify`,
        name_first: name,
        email_address: email,
        m_payment_id: mPaymentId,
        amount,
        item_name: itemName.slice(0, 100),
        custom_str1: cart.items.map((item) => item.id).join(","),
    };

    fields.signature = signFields(fields, passphrase);

    const orders = getStore("orders");
    await orders.setJSON(mPaymentId, {
        amount: cart.total,
        ids: cart.items.map((item) => item.id),
        email,
        name,
        fulfilled: false,
        createdAt: new Date().toISOString(),
    });

    return json(200, { url: PAYFAST_PROCESS_URL, fields });
};
