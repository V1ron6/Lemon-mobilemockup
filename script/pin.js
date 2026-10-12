(function (T) {
  const { $, state, go } = T.screen;
  const { pin: PIN, maxAttempts, lockoutSeconds, demoHint } = T.config;
  const msg = $("pin-msg"), dots = $("dots"), keys = $("keys");
  const dotEls = [...dots.children];
  let entry = "", attempts = 0, lockUntil = 0, timer = null, busy = false;

  const setMsg = (text, err) => { msg.textContent = text; msg.classList.toggle("err", !!err); };
  const paint = () => dotEls.forEach((d, i) => d.classList.toggle("on", i < entry.length));
  const setKeysDisabled = (v) => keys.querySelectorAll("button[data-k], #pin-del").forEach((b) => (b.disabled = v));

  function reset() {
    entry = ""; busy = false;
    dots.className = "dots";
    paint();
    if (Date.now() < lockUntil) startLockout();
    else { setKeysDisabled(false); setMsg("Enter your PIN"); }
    $("pin-hint").textContent = demoHint ? `Demo PIN: ${PIN}` : "";
  }

  function startLockout() {
    setKeysDisabled(true);
    clearInterval(timer);
    const update = () => {
      const left = Math.ceil((lockUntil - Date.now()) / 1000);
      if (left <= 0) {
        clearInterval(timer);
        attempts = 0; entry = ""; paint();
        dots.className = "dots";
        setKeysDisabled(false);
        setMsg("Enter your PIN");
      } else setMsg(`Too many attempts. Try again in ${left}s`, true);
    };
    update();
    timer = setInterval(update, 500);
  }

  function press(d) {
    if (busy || entry.length >= PIN.length || Date.now() < lockUntil) return;
    entry += d; paint();
    if (entry.length === PIN.length) { busy = true; setTimeout(check, 140); }
  }
  function del() { if (!busy && Date.now() >= lockUntil) { entry = entry.slice(0, -1); paint(); } }

  function check() {
    if (entry === PIN) {
      dots.classList.add("ok");
      setMsg("Welcome back");
      attempts = 0;
      setTimeout(() => go("home"), 280);
      return;
    }
    attempts++;
    dots.classList.add("bad", "shake");
    if (attempts >= maxAttempts) {
      lockUntil = Date.now() + lockoutSeconds * 1000;
      setTimeout(() => { entry = ""; paint(); startLockout(); busy = false; }, 350);
    } else {
      setMsg(`Wrong PIN · ${maxAttempts - attempts} ${maxAttempts - attempts === 1 ? "try" : "tries"} left`, true);
      setTimeout(() => { entry = ""; busy = false; dots.className = "dots"; paint(); }, 450);
    }
  }

  keys.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.k) press(b.dataset.k);
  });
  $("pin-del").addEventListener("click", del);
  $("pin-cancel").addEventListener("click", () => go("lock"));
  $("btn-unlock").addEventListener("click", () => go("pin"));

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const v = state.view;
    if (v === "lock" && (e.key === "Enter" || /^\d$/.test(e.key)) && !e.target.closest("button")) { go("pin"); if (/^\d$/.test(e.key)) press(e.key); }
    else if (v === "pin") {
      if (/^\d$/.test(e.key)) press(e.key);
      else if (e.key === "Backspace") del();
      else if (e.key === "Escape") go("lock");
    }
  });

  T.screen.on((type, view) => { if (type === "view" && view === "pin") reset(); });
})(window.Tecno);
