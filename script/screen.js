(function (T) {
  const $ = (id) => document.getElementById(id);
  const screen = $("screen");
  const views = { lock: $("view-lock"), pin: $("view-pin"), home: $("view-home"), app: $("view-app") };

  const state = { view: "lock", shade: false, flags: {}, listeners: [] };
  T.tiles.forEach((t) => (state.flags[t.key] = t.on));

  function go(view) {
    if (!views[view]) return;
    closeShade();
    state.view = view;
    screen.dataset.view = view;
    for (const [name, el] of Object.entries(views)) el.hidden = name !== view;
    emit("view", view);
  }

  function openShade() {
    if (state.view === "pin") return;
    state.shade = true;
    screen.classList.add("shade-open");
    $("shade").inert = false;
    $("shade").setAttribute("aria-hidden", "false");
    $("status").setAttribute("aria-expanded", "true");
  }
  function closeShade() {
    state.shade = false;
    screen.classList.remove("shade-open");
    $("shade").inert = true;
    $("shade").setAttribute("aria-hidden", "true");
    $("status").setAttribute("aria-expanded", "false");
  }

  function setFlag(key, value) {
    if (state.flags[key] === value) return;
    state.flags[key] = value;

    if (key === "airplane" && value) { state.flags.wifi = false; state.flags.bluetooth = false; state.flags.hotspot = false; }

    if (["wifi", "bluetooth"].includes(key) && value) state.flags.airplane = false;
    emit("flags", state.flags);
  }

  const emit = (type, data) => state.listeners.forEach((fn) => fn(type, data));
  const on = (fn) => state.listeners.push(fn);

  T.screen = { $, state, go, openShade, closeShade, setFlag, on };
})(window.Tecno);
