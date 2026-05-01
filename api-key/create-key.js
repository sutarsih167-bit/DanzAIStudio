document.addEventListener("DOMContentLoaded", () => {

  const nameInput = document.querySelector('input[placeholder="Enter Name API"]');
  const descInput = document.querySelector('select'); // dropdown duration
  const apiInput = document.querySelector('.api-key-box input');
  const generateBtn = document.querySelector('.api-key-box button');
  const saveBtn = document.querySelector('.save');

  const BASE_URL = "http://192.168.1.3:3000";

  let sudahGenerate = false;

  /* GENERATE API */
  generateBtn.addEventListener("click", async () => {

    const name = nameInput.value.trim();
    const duration = descInput.value;

    if (!name) {
      alert("Isi nama API dulu!");
      return;
    }

    if (sudahGenerate) {
      alert("Harus Save dulu sebelum generate lagi!");
      return;
    }

    try {

      const res = await fetch(`${BASE_URL}/create-key`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          duration: duration
        })
      });

      const data = await res.json();

      if (!data.apiKey) {
        alert("Gagal generate!");
        return;
      }

      apiInput.value = data.apiKey;

      sudahGenerate = true;
      generateBtn.disabled = true;
      generateBtn.style.opacity = "0.5";

    } catch (err) {
      alert("Gagal konek ke server ❌");
    }

  });

  apiInput.addEventListener("click", () => {
    if (!apiInput.value) return;

    navigator.clipboard.writeText(apiInput.value);
  });

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

    if (desc === "10 DAY") expired = now + 10 * 86400000;
    if (desc === "20 DAY") expired = now + 20 * 86400000;
    if (desc === "30 DAY") expired = now + 30 * 86400000;
    if (desc === "50 DAY") expired = now + 50 * 86400000;
    if (desc === "PERMANENT") expired = "PERMANENT";

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

    window.location.href = "list.html";

  });

});