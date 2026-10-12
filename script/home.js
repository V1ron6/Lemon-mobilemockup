(function (T) {
  const { $, state, go, on } = T.screen;
  const grid = $("grid"), dock = $("dock"), body = $("app-body");
  let cleanup = null;

  function tile(app) {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button"; b.className = "app-tile"; b.dataset.app = app.id;
    b.setAttribute("aria-label", app.name);
    const ico = document.createElement("span"); ico.className = "ico";
    const img = document.createElement("img"); img.src = app.img; img.alt = ""; img.loading = "lazy";
    ico.append(img);
    const label = document.createElement("span"); label.textContent = app.name;
    b.append(ico, label);
    b.addEventListener("click", () => open(app));
    li.append(b);
    return li;
  }
  T.apps.forEach((a) => (a.dock ? dock : grid).append(tile(a)));

  const builders = {
    calculator(root) {
      root.innerHTML = `<div class="calc"><output aria-live="polite">0</output><div class="calc-keys">
        <button class="fn" data-a="clear">AC</button><button class="fn" data-a="sign">±</button><button class="fn" data-a="pct">%</button><button class="op" data-o="/">÷</button>
        <button data-d="7">7</button><button data-d="8">8</button><button data-d="9">9</button><button class="op" data-o="*">×</button>
        <button data-d="4">4</button><button data-d="5">5</button><button data-d="6">6</button><button class="op" data-o="-">−</button>
        <button data-d="1">1</button><button data-d="2">2</button><button data-d="3">3</button><button class="op" data-o="+">+</button>
        <button class="zero" data-d="0">0</button><button data-d=".">.</button><button class="eq" data-a="eq">=</button></div></div>`;
      const out = root.querySelector("output");
      let cur = "0", acc = null, op = null, fresh = true;
      const ops = { "+": (a, b) => a + b, "-": (a, b) => a - b, "*": (a, b) => a * b, "/": (a, b) => (b === 0 ? NaN : a / b) };
      const show = (v) => { out.textContent = Number.isNaN(+v) ? "Error" : String(+(+v).toPrecision(10)).replace(/^-0$/, "0"); };
      const commit = () => { if (op !== null && !fresh) { acc = ops[op](acc, +cur); cur = String(acc); show(cur); } else if (acc === null) acc = +cur; };
      root.addEventListener("click", (e) => {
        const b = e.target.closest("button"); if (!b) return;
        if (b.dataset.d !== undefined) {
          const d = b.dataset.d;
          if (fresh) { cur = d === "." ? "0." : d; fresh = false; }
          else if (d !== "." || !cur.includes(".")) cur = cur === "0" && d !== "." ? d : cur + d;
          if (cur.length > 12) cur = cur.slice(0, 12);
          out.textContent = cur;
        } else if (b.dataset.o) { commit(); op = b.dataset.o; acc = +cur; fresh = true; }
        else if (b.dataset.a === "eq") { commit(); op = null; acc = null; fresh = true; }
        else if (b.dataset.a === "clear") { cur = "0"; acc = null; op = null; fresh = true; show(0); }
        else if (b.dataset.a === "sign") { cur = String(-+cur); show(cur); }
        else if (b.dataset.a === "pct") { cur = String(+cur / 100); show(cur); fresh = true; }
      });
    },
    clock(root) {
      const draw = () => {
        const n = new Date();
        root.innerHTML = `<div class="big-clock">${n.toLocaleTimeString([], { hour12: false })}<small>${n.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</small></div>`;
      };
      draw();
      const t = setInterval(draw, 1000);
      return () => clearInterval(t);
    },
    camera(root) {
      const cam = $("cam"); cam.classList.add("on");
      root.innerHTML = `<div class="empty"><strong>Viewfinder</strong><span>Camera sensor is on — see the light at the top.</span></div>`;
      return () => cam.classList.remove("on");
    },
  };

  function open(app) {
    if (cleanup) { cleanup(); cleanup = null; }
    $("app-title").textContent = app.name;
    $("app-icon").src = app.img;
    body.replaceChildren();
    if (builders[app.id]) cleanup = builders[app.id](body) || null;
    else {
      const d = document.createElement("div"); d.className = "empty";
      const s = document.createElement("strong"); s.textContent = app.name;
      const p = document.createElement("span"); p.textContent = "Coming soon";
      d.append(s, p); body.append(d);
    }
    go("app");
    const v = $("view-app"); v.classList.remove("opening"); void v.offsetWidth; v.classList.add("opening");
  }

  on((type, view) => { if (type === "view" && view !== "app" && cleanup) { cleanup(); cleanup = null; } });

  $("nav-home").addEventListener("click", () => {
    if (state.shade) return T.screen.closeShade();
    if (state.view === "app") go("home");
    else if (state.view === "home") $("view-home").querySelector(".grid-wrap").scrollTo({ top: 0, behavior: "smooth" });
  });
  $("nav-lock").addEventListener("click", () => go("lock"));
})(window.Tecno);
