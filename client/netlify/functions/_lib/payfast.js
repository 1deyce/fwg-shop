import crypto from "node:crypto";

const SANDBOX = process.env.PAYFAST_SANDBOX !== "false";

export const PAYFAST_PROCESS_URL = SANDBOX
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";

const PAYFAST_VALIDATE_URL = SANDBOX
    ? "https://sandbox.payfast.co.za/eng/query/validate"
    : "https://www.payfast.co.za/eng/query/validate";

function pfEncode(value) {
    return encodeURIComponent(String(value).trim())
        .replace(/%20/g, "+")
        .replace(
            /[!'()*~]/g,
            (char) => "%" + char.charCodeAt(0).toString(16).toUpperCase(),
        );
}

function buildParamString(pairs, passphrase) {
    let str = pairs
        .filter(([key, value]) => key !== "signature" && value !== "" && value != null)
        .map(([key, value]) => `${key}=${pfEncode(value)}`)
        .join("&");
    if (passphrase) {
        str += `&passphrase=${pfEncode(passphrase)}`;
    }
    return str;
}

export function md5(str) {
    return crypto.createHash("md5").update(str).digest("hex");
}

export function signFields(orderedFields, passphrase) {
    return md5(buildParamString(Object.entries(orderedFields), passphrase));
}

export function verifySignature(orderedPairs, passphrase) {
    const posted = orderedPairs.find(([key]) => key === "signature")?.[1];
    if (!posted) return false;
    const expected = md5(buildParamString(orderedPairs, passphrase));
    return posted === expected;
}

export function parseOrderedForm(body) {
    return [...new URLSearchParams(body).entries()];
}

export async function validateWithPayfast(rawBody) {
    const res = await fetch(PAYFAST_VALIDATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: rawBody,
    });
    const text = (await res.text()).trim();
    return text === "VALID";
}

export { SANDBOX };
