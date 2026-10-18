/* Password gate. Add <script src="gate.js"></script> (plus the hide-style line) to every page. */
(function () {
  var SALT = "maxton-gate-v1";
  var HASH = "c26c3937885cec4099db477fb805485ea0dd582e9e806ca940701fd5e26ef04e"; // PBKDF2 hash, not the password
  var ITER = 200000, KEY = "maxton_gate_ok";

  function hex(buf){return Array.from(new Uint8Array(buf)).map(function(b){return b.toString(16).padStart(2,"0")}).join("");}
  async function derive(pw){
    var enc = new TextEncoder();
    var k = await crypto.subtle.importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveBits"]);
    var bits = await crypto.subtle.deriveBits({name:"PBKDF2", salt:enc.encode(SALT), iterations:ITER, hash:"SHA-256"}, k, 256);
    return hex(bits);
  }
  function unlock(){
    var h = document.getElementById("gate-hide"); if (h) h.remove();
    var o = document.getElementById("gate-overlay"); if (o) o.remove();
  }
  var ok = false;
  try { ok = sessionStorage.getItem(KEY) === HASH; } catch(e){}
  if (ok) { document.addEventListener("DOMContentLoaded", unlock); var h0=document.getElementById("gate-hide"); if(h0) h0.remove(); return; }

  var css = document.createElement("style");
  css.textContent =
    "#gate-overlay{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;background:#F8C3D3;font-family:'Bricolage Grotesque',-apple-system,Helvetica,Arial,sans-serif;padding:20px}" +
    "#gate-box{background:#fff;color:#5B2A3E;padding:32px 28px;max-width:340px;width:100%;text-align:center;box-shadow:0 12px 40px rgba(150,60,100,.28);border-radius:6px}" +
    "#gate-box h2{margin:0 0 6px;font-size:22px;letter-spacing:.04em}#gate-box p{margin:0 0 18px;font-size:14px;color:#7A5565}" +
    "#gate-box input{width:100%;padding:12px;font-size:16px;border:1.5px solid #5B2A3E;border-radius:4px;outline:none;text-align:center;box-sizing:border-box}" +
    "#gate-box button{margin-top:14px;width:100%;padding:12px;font-size:13px;letter-spacing:.18em;text-transform:uppercase;background:#5B2A3E;color:#fff;border:0;border-radius:4px;cursor:pointer}" +
    "#gate-err{min-height:18px;margin-top:10px;font-size:13px;color:#E0457B}" +
    "@keyframes gshake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}.gshake{animation:gshake .3s}";
  document.head.appendChild(css);

  function build(){
    var o = document.createElement("div"); o.id = "gate-overlay";
    o.innerHTML = '<div id="gate-box"><h2>Password</h2><p>Enter the password to continue</p>' +
      '<input id="gate-pw" type="password" autocomplete="off" autofocus placeholder="••••••••">' +
      '<button id="gate-go" type="button">Enter</button><div id="gate-err"></div></div>';
    document.documentElement.appendChild(o);
    var pw = o.querySelector("#gate-pw"), err = o.querySelector("#gate-err"), box = o.querySelector("#gate-box");
    async function submit(){
      var v = pw.value; if (!v) return;
      var d = await derive(v);
      if (d === HASH) { try { sessionStorage.setItem(KEY, HASH); } catch(e){} unlock(); }
      else { err.textContent = "Wrong password"; pw.value = ""; box.classList.remove("gshake"); void box.offsetWidth; box.classList.add("gshake"); }
    }
    o.querySelector("#gate-go").addEventListener("click", submit);
    pw.addEventListener("keydown", function(e){ if (e.key === "Enter") submit(); });
    pw.focus();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
