# kaspa-bets-pay

Static payment redirect page for the [Kaspa Bets](https://t.me/KBetsFriends_bot) Telegram bot.

Telegram inline buttons only accept `http(s)://` and `tg://` links, so a button cannot open a
`kaspa:` / `kaspatest:` payment URI directly. The bot links to this page instead, and the page
immediately hands the payment URI to the wallet installed on the device (e.g. Kaspium).

**Live page:** https://heziyaffe.github.io/kaspa-bets-pay/

## Usage

```
https://heziyaffe.github.io/kaspa-bets-pay/?to=<address>&amount=<KAS>&label=<optional text>
```

| Parameter | Required | Rules |
|-----------|----------|-------|
| `to`      | yes | `kaspa:` or `kaspatest:` address, bech32 charset, 61-63 payload chars |
| `amount`  | yes | positive decimal KAS, up to 8 decimals |
| `label`   | no  | shown on the page only (max 80 chars, rendered as plain text) |

The legacy form `?uri=kaspatest:<address>?amount=<KAS>` is also accepted.

The page redirects to `<address>?amount=<KAS>`. If no wallet handles it, the page stays open with:

- an **Open in wallet** button,
- **Copy address** / **Copy amount** buttons,
- a QR code of the payment URI,
- a note that testnet needs Kaspium with a testnet-10 (TN10) node added.

Invalid or missing parameters show an error and nothing is opened.

## Privacy and security

- Pure static HTML/CSS/JS, served by GitHub Pages. No backend, no analytics, no cookies.
- No third-party requests: the QR library is vendored (`vendor/qrcode.js`, MIT, Kazuhiko Arase).
- Strict Content-Security-Policy (`default-src 'none'`), `no-referrer`, `noindex`.
- Only a strictly validated Kaspa payment URI is ever opened.

## Development

Open `index.html` through any static server, e.g. `python3 -m http.server`, then visit
`http://localhost:8000/?to=kaspatest:...&amount=1.5`.

## License

MIT, see [LICENSE](LICENSE).
