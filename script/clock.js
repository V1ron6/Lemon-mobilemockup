(function (T) {
  const { $, state, on } = T.screen;
  const hour = $("hour"), date = $("date"), shadeTime = $("shade-time");
  const fmtTime = new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const fmtDate = new Intl.DateTimeFormat([], { weekday: "long", month: "long", day: "numeric" });

  function tick() {
    const now = new Date();
    const t = fmtTime.format(now);
    hour.textContent = t;
    shadeTime.textContent = t;
    date.textContent = fmtDate.format(now);
    T.clockText = { time: t, date: date.textContent };

    setTimeout(tick, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 50);
  }

  function renderStatus() {
    const f = state.flags;
    $("st-wifi").hidden = !f.wifi;
    $("st-bt").hidden = !f.bluetooth;
    $("st-dnd").hidden = !f.dnd;
    $("carrier").textContent = f.airplane ? "Airplane mode" : T.config.carrier;
  }
  on((type) => { if (type === "flags") renderStatus(); });

  function setBattery(pct, charging) {
    pct = Math.round(pct);
    $("battery").style.setProperty("--lvl", pct);
    $("battery").classList.toggle("low", pct <= 20 && !charging);
    $("battery").setAttribute("aria-label", `Battery ${pct}%${charging ? ", charging" : ""}`);
    $("battery-pct").textContent = pct + "%";
  }
  setBattery(100, false);
  if (navigator.getBattery) {
    navigator.getBattery().then((b) => {
      const upd = () => setBattery(b.level * 100, b.charging);
      upd();
      b.addEventListener("levelchange", upd);
      b.addEventListener("chargingchange", upd);
    }).catch(() => {});
  }

  tick();
  renderStatus();
})(window.Tecno);
