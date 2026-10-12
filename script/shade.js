(function (T) {
  const { $, state, openShade, closeShade, setFlag, on } = T.screen;
  const tiles = $("tiles");
  const btns = {};

  T.tiles.forEach((t) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "tile";
    const ico = document.createElement("span"); ico.className = "ico";
    const img = document.createElement("img"); img.src = t.img; img.alt = "";
    ico.append(img);
    const l = document.createElement("span"); l.textContent = t.label;
    b.append(ico, l);
    b.addEventListener("click", () => setFlag(t.key, !state.flags[t.key]));
    btns[t.key] = b;
    tiles.append(b);
  });

  function sync() {
    for (const [k, b] of Object.entries(btns)) b.setAttribute("aria-pressed", String(!!state.flags[k]));
    $("led").classList.toggle("on", !!state.flags.flashlight);
    $("btn-light").setAttribute("aria-pressed", String(!!state.flags.flashlight));
  }
  on((type) => { if (type === "flags") sync(); });
  sync();

  $("btn-light").addEventListener("click", () => setFlag("flashlight", !state.flags.flashlight));
  const camBtn = $("btn-camera");
  camBtn.addEventListener("click", () => $("cam").classList.toggle("on"));

  $("status").addEventListener("click", () => (state.shade ? closeShade() : openShade()));
  $("shade-close").addEventListener("click", closeShade);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && state.shade) closeShade(); });

  $("shade").addEventListener("click", (e) => { if (e.target === $("shade")) closeShade(); });

  $("brightness").addEventListener("input", (e) => $("screen").style.setProperty("--brightness", e.target.value / 100));
})(window.Tecno);
