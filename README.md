# fwg-shop

A simple shop for digital products — no user accounts, checkout by name + email,
products delivered by email after payment. Hosted on Netlify (static React app +
serverless functions), payments via PayFast.

## How it works

```
Browser (React)                Netlify Functions               PayFast
  Cart → POST create-payment ───▶ price cart server-side,
                                  sign fields, save pending
                                  order (Netlify Blobs)
  ◀── { url, fields } ───────────
  auto-submit form ─────────────────────────────────────────▶ hosted payment page
                                                                customer pays
  ◀──────────────────── redirect to /checkout-success ────────
                                  payfast-notify (ITN) ◀─────── server-to-server
                                  verify signature + amount,
                                  email download link
```

Prices and download links live **only** on the server (function env vars), and
the download email is sent **only** after PayFast confirms the payment via the
ITN webhook — so neither can be obtained without paying.

## Project layout

- `client/` — Vite + React app (the storefront)
- `client/netlify/functions/` — serverless functions
  - `create-payment.js` — builds the signed PayFast redirect
  - `payfast-notify.js` — ITN webhook; verifies payment and sends the email
  - `_lib/` — shared catalog, PayFast signing, and email helpers
- `netlify.toml` — build + functions config

## Setup

1. `cd client && npm install`
2. Copy `client/.env.example` to `client/.env` and fill in the values.
3. Set the same variables in the Netlify dashboard
   (**Site config → Environment variables**) for production.

## Local development

```
cd client
npm install -g netlify-cli   # once
netlify dev                  # runs Vite + functions together
```

`netlify dev` serves the app and the functions on one origin so the
`/.netlify/functions/...` calls work locally. For PayFast ITN to reach your
machine you'll need a public tunnel (e.g. `netlify dev --live`).

## Going live

- Set `PAYFAST_SANDBOX=false` and switch to live PayFast credentials.
- Confirm the PayFast passphrase matches the one set in your PayFast dashboard
  (the signature will fail if they differ).
- Add new products in **both** `client/src/utils/products.js` (display) and
  `client/netlify/functions/_lib/catalog.js` (price + download URL).
