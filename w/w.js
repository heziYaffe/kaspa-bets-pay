// Fill the win page from the query string. Everything is written with textContent; the bot link is validated.
(function () {
  var p = new URLSearchParams(location.search);
  var a = p.get("a") || "", s = p.get("s") || "", q = p.get("q") || "", b = p.get("b") || "";
  if (/^\d{1,9}(\.\d{1,8})?$/.test(a)) {
    document.getElementById("amount").textContent = "+" + a + " tKAS";
    document.title = "I won " + a + " tKAS on Kaspa Bets";
  }
  if (q) { var qe = document.getElementById("q"); qe.textContent = q.slice(0, 200); qe.hidden = false; }
  if (s) { var se = document.getElementById("side"); se.textContent = "Picked: " + s.slice(0, 40); se.hidden = false; }
  if (/^[A-Za-z][A-Za-z0-9_]{3,31}$/.test(b)) document.getElementById("go").href = "https://t.me/" + b;
})();
