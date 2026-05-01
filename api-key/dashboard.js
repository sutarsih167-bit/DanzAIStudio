document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (!menuBtn || !sidebar || !overlay) {
    console.error("Elemen tidak ditemukan (cek id HTML)");
    return;
  }

  function openSidebar() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  }

  function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  }

  function toggleSidebar() {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  }

  menuBtn.addEventListener("click", toggleSidebar);

  overlay.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSidebar();
  });

  document.querySelectorAll("#sidebar a").forEach(link => {
    link.addEventListener("click", closeSidebar);
  });

  let startX = 0;
  let currentX = 0;

  document.addEventListener("touchstart",
    (e) => {
      startX = e.touches[0].clientX;
    });

  document.addEventListener("touchmove",
    (e) => {
      currentX = e.touches[0].clientX;
    });

  document.addEventListener("touchend",
    () => {
      const diff = currentX - startX;

      if (startX < 50 && diff > 80) {
        openSidebar();
      }

      if (diff < -80) {
        closeSidebar();
      }
    });

});