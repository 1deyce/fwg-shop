// Sends the purchase email via Resend (https://resend.com), with the product
// file(s) attached directly. `attachments` is an array of
// { filename, contentBase64 }.
//
// In sandbox mode the caller redirects `to` to the merchant; `sandbox` +
// `customerEmail` let us tag the subject and show who the order was for.
export async function sendDownloadEmail({
    to,
    name,
    attachments,
    bcc,
    sandbox = false,
    customerEmail,
}) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;

    if (!apiKey || !from) {
        throw new Error("Resend is not configured (set RESEND_API_KEY and EMAIL_FROM)");
    }
    if (!attachments || attachments.length === 0) {
        throw new Error("No product files to attach");
    }

    const greeting = name ? `Hi ${name},` : "Hi,";
    const noun = attachments.length === 1 ? "guide is" : "guides are";

    const html = sandbox
        ? `<p><strong>[SANDBOX]</strong> Test order — this would normally go to ` +
          `${customerEmail || "the customer"}.</p>` +
          `<p>Name: ${name || "(none)"}<br/>The ${noun} attached.</p>`
        : `<p>${greeting}</p>` +
          `<p>Thank you for your order! Your ${noun} attached to this email.</p>` +
          `<p>Enjoy,<br/>Shop FWG</p>`;

    const subject = sandbox
        ? `[SANDBOX] Shop FWG order — ${customerEmail || "unknown"}`
        : "Your Shop FWG order";

    const payload = {
        from,
        to: [to],
        subject,
        html,
        attachments: attachments.map((a) => ({
            filename: a.filename,
            content: a.contentBase64,
        })),
    };
    if (bcc) {
        payload.bcc = [bcc];
    }

    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new Error(`Resend send failed (${res.status}): ${detail}`);
    }
}
