/* Kaspa Bets payment redirect. Static; reads the query string only and never sends data anywhere. */
(function () {
  "use strict";

  // Address: network prefix + bech32 payload (charset excludes 1, b, i, o). P2PK = 61 chars, ECDSA/P2SH = 63.
  var ADDR_RE = /^(kaspa|kaspatest):[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{61,63}$/;
  // Amount in KAS: positive decimal, at most 8 decimals (1 sompi), at most 11 integer digits.
  var AMOUNT_RE = /^(0|[1-9]\d{0,10})(\.\d{1,8})?$/;
  var MAX_LABEL = 80;

  // Ready for future use (local time display). Not called, not sent anywhere.
  function getBrowserTimeZone() {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || null; } catch (e) { return null; }
  }
  window.kaspaBetsPay = { getBrowserTimeZone: getBrowserTimeZone };

  function $(id) { return document.getElementById(id); }

  function parse() {
    var p = new URLSearchParams(location.search);
    var to = (p.get("to") || "").trim().toLowerCase();
    var amount = (p.get("amount") || "").trim();
    var label = (p.get("label") || "").trim();
    // Backward compatible: ?uri=kaspatest:...?amount=...
    var uri = (p.get("uri") || "").trim();
    if (!to && uri) {
      var m = /^([a-z]+:[a-z0-9]+)\?amount=([0-9.]+)$/i.exec(uri);
      if (m) { to = m[1].toLowerCase(); amount = m[2]; }
    }
    if (!ADDR_RE.test(to) || !AMOUNT_RE.test(amount) || !(parseFloat(amount) > 0)) return null;
    label = label.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, MAX_LABEL);
    return { to: to, amount: amount, label: label, net: to.split(":")[0] };
  }

  function copy(text, what) {
    function done() { $("toast").textContent = what + " copied"; setTimeout(function () { $("toast").textContent = ""; }, 2000); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { legacyCopy(text); done(); });
    } else { legacyCopy(text); done(); }
  }
  function legacyCopy(text) {
    var t = document.createElement("textarea");
    t.value = text; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.opacity = "0";
    document.body.appendChild(t); t.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    document.body.removeChild(t);
  }

  var d = parse();
  if (!d) { $("error").hidden = false; return; }

  var payUri = d.to + "?amount=" + d.amount;
  var testnet = d.net === "kaspatest";

  $("pay").hidden = false;
  $("net").textContent = testnet ? "Kaspa testnet-10" : "Kaspa mainnet";
  if (testnet) { $("net").className += " test"; $("testnet-note").hidden = false; }
  if (d.label) { $("label").textContent = d.label; $("label").hidden = false; }
  $("amount").textContent = d.amount;
  $("unit").textContent = testnet ? "tKAS" : "KAS";
  $("addr").textContent = d.to;
  $("open").href = payUri;
  $("copy-addr").addEventListener("click", function () { copy(d.to, "Address"); });
  $("copy-amount").addEventListener("click", function () { copy(d.amount, "Amount"); });

  if (typeof qrcode === "function") {
    var qr = qrcode(0, "M");
    qr.addData(payUri);
    qr.make();
    $("qr").innerHTML = qr.createSvgTag({ cellSize: 4, margin: 4, scalable: true, title: "Kaspa payment QR code" });
  }

  // Hand the payment URI to the wallet right away; the page stays as a fallback if nothing handles it.
  setTimeout(function () { location.href = payUri; }, 250);
})();
