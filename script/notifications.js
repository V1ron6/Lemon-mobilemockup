(function (T) {
  const { $ } = T.screen;
  const list = $("notifications"), head = $("notif-head");
  let items = T.notifications.slice();

  const ago = (m) => (m < 1 ? "now" : m < 60 ? `${m}m` : `${Math.floor(m / 60)}h`);

  function render() {
    list.replaceChildren(
      ...items.map((n, i) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "notif";
        btn.style.animationDelay = i * 50 + "ms";
        btn.setAttribute("aria-label", `Dismiss notification from ${n.sender}: ${n.content}`);
        const body = document.createElement("span");
        const s = document.createElement("span"); s.className = "sender"; s.textContent = n.sender;
        const m = document.createElement("div"); m.className = "msg"; m.textContent = n.content;
        body.append(s, m);
        const t = document.createElement("time"); t.textContent = ago(n.ago);
        btn.append(body, t);
        btn.addEventListener("click", () => dismiss(n.id, btn));
        li.append(btn);
        return li;
      })
    );
    head.hidden = items.length === 0;
  }

  function dismiss(id, el) {
    el.classList.add("out");
    setTimeout(() => { items = items.filter((n) => n.id !== id); render(); }, 220);
  }

  $("notif-clear").addEventListener("click", () => { items = []; render(); });
  render();
})(window.Tecno);
