document.addEventListener("DOMContentLoaded", () => {

  const nameInput = document.getElementById("name");
  const descInput = document.getElementById("desc");
  const apiInput = document.getElementById("apiKey");
  const generateBtn = document.getElementById("generateBtn");
  const saveBtn = document.getElementById("saveBtn");

  const BASE_URL = "https://danzaistudio.up.railway.app";

  let sudahGenerate = false;

  // 🔍 CEK ELEMENT
  if (!nameInput || !descInput || !apiInput || !generateBtn || !saveBtn) {
    console.error("❌ Ada element HTML yang tidak ditemukan!");
    return;
  }

  /* =========================
     GENERATE API
  ========================= */
  generateBtn.addEventListener("click", async () => {

    const name = nameInput.value.trim();
    const duration = descInput.value;

    console.log("KIRIM:", name, duration);

    if (!name) {
      alert("Isi nama API dulu!");
      return;
    }

    if (!duration) {
      alert("Pilih durasi dulu!");
      return;
    }

    if (sudahGenerate) {
      alert("Save dulu sebelum generate lagi!");
      return;
    }

    try {

      const res = await fetch(`${BASE_URL}/create-key`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, duration })
      });

      if (!res.ok) {
        throw new Error("Server error: " + res.status);
      }

      const data = await res.json();

      console.log("RESP:", data);

      if (data.error) {
        alert(data.error);
        return;
      }

      if (!data.apiKey) {
        alert("Gagal generate!");
        return;
      }

      apiInput.value = data.apiKey;

      sudahGenerate = true;
      generateBtn.disabled = true;
      generateBtn.style.opacity = "0.5";

    } catch (err) {
      console.error(err);
      alert("Gagal konek ke server ❌");
    }

  });

  /* =========================
     COPY API
  ========================= */
  apiInput.addEventListener("click", () => {
    if (!apiInput.value) return;

    navigator.clipboard.writeText(apiInput.value);
    alert("API berhasil di copy!");
  });

  /* =========================
     SAVE LOCAL
  ========================= */
  saveBtn.addEventListener("click", () => {

    const name = nameInput.value.trim();
    const desc = descInput.value;
    const key = apiInput.value.trim();

    if (!name || !desc || !key) {
      alert("Isi semua dulu!");
      return;
    }

    const now = Date.now();
    let expired = null;

    const map = {
      "10 DAY": 10,
      "20 DAY": 20,
      "30 DAY": 30,
      "50 DAY": 50
    };

    if (map[desc]) {
      expired = now + map[desc] * 86400000;
    } else {
      expired = "PERMANENT";
    }

    const data = {
      name,
      desc,
      key,
      created: new Date().toLocaleString(),
      expired
    };

    let apiList = JSON.parse(localStorage.getItem("apiKeys")) || [];
    apiList.push(data);

    localStorage.setItem("apiKeys", JSON.stringify(apiList));

    alert("API Key berhasil disimpan!");

    window.location.href = "./list.html";

  });

});