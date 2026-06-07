export async function sendDownloadEmail({ to, name, links }) {
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (!serviceId || !templateId || !publicKey || !privateKey) {
        throw new Error("EmailJS is not fully configured (see .env.example)");
    }

    const message =
        `Thank you for your order! To access your items, please click the link(s) below:\n\n` +
        links.map((link) => `- ${link.name}: ${link.url}`).join("\n");

    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            accessToken: privateKey,
            template_params: {
                to_email: to,
                to_name: name,
                from_name: "Shop FWG",
                message,
            },
        }),
    });

    if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new Error(`EmailJS send failed (${res.status}): ${detail}`);
    }
}
