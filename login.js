function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "admin" && pass === "1234") {

    localStorage.setItem("login", "true");

    window.location.href = "dashboard/dashboard.html";
  } else {
    alert("Username atau Password Salah")
  }
}