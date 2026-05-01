const apiListEl = document.getElementById("apiList");
const emptyState = document.getElementById("emptyState");

let apiKeys = JSON.parse(localStorage.getItem("apiKeys")) || [];

function render() {
  if (!apiListEl || !emptyState) return;

  apiListEl.innerHTML = "";

  if (apiKeys.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  apiKeys.forEach((item, index) => {
    const safeKey = item.key || "";
    const last4 = safeKey.slice(-4);

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
    <div class="top">
    <span class="key">••••${last4}</span>

    <div style="position:relative;">
    <span class="menu" data-i="${index}">⋮</span>

    <div class="dropdown" id="menu-${index}">
    <div data-action="rename" data-i="${index}">Rename Key</div>
    <div data-action="delete" data-i="${index}">Delete Key</div>
    </div>
    </div>
    </div>

    <p>${item.name || "-"}</p>

    <div class="info">
    <div><b>Api Key</b> <span>${safeKey}</span></div>
    <div><b>Created</b> <span>${item.created || "-"}</span></div>
    </div>
    `;

    apiListEl.appendChild(card);
  });
}

function toggleMenu(i) {
  document.querySelectorAll(".dropdown").forEach(el => {
    el.style.display = "none";
  });

  const menu = document.getElementById(`menu-${i}`);
  if (menu) menu.style.display = "flex";
}

function renameKey(i) {
  const newName = prompt("Masukkan nama baru:");
  if (!newName) return;

  apiKeys[i].name = newName;
  save();
}

function deleteKey(i) {
  if (!confirm("Hapus API Key ini?")) return;

  apiKeys.splice(i, 1);
  save();
}

function save() {
  localStorage.setItem("apiKeys", JSON.stringify(apiKeys));
  render();
}

function goCreate() {
  window.location.href = "create-key.html";
}

document.addEventListener("click", (e) => {
  const menuBtn = e.target.closest(".menu");
  const actionBtn = e.target.closest("[data-action]");

  if (menuBtn) {
    e.stopPropagation();
    const i = menuBtn.getAttribute("data-i");
    toggleMenu(i);
    return;
  }

  if (actionBtn) {
    e.stopPropagation();
    const i = actionBtn.getAttribute("data-i");
    const action = actionBtn.getAttribute("data-action");

    if (action === "rename") renameKey(i);
    if (action === "delete") deleteKey(i);
    return;
  }

  document.querySelectorAll(".dropdown").forEach(el => {
    el.style.display = "none";
  });
});

render();