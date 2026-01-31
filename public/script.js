const API = "/api";


let currentTab = "login";

function switchTab(tab) {
  currentTab = tab;

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const slider = document.getElementById("tabSlider");
  const tabs = document.querySelectorAll(".tab");

  tabs.forEach(t => t.classList.remove("active"));

  if (tab === "login") {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    slider.classList.remove("register");
    tabs[0].classList.add("active");
  } else {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    slider.classList.add("register");
    tabs[1].classList.add("active");
  }

  clearMessage();
}

function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

function showMessage(text, isSuccess = false) {
  const msg = document.getElementById("message");
  msg.innerText = text;
  msg.classList.add("show");
  msg.classList.remove("success", "error");
  msg.classList.add(isSuccess ? "success" : "error");
}

function clearMessage() {
  const msg = document.getElementById("message");
  msg.innerText = "";
  msg.classList.remove("show", "success", "error");
}

async function register() {
  clearMessage();

  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const confirmPassword =
    document.getElementById("regConfirmPassword")?.value.trim();

  if (!email || !password || !confirmPassword) {
    showMessage("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    showMessage("Passwords do not match");
    return;
  }

  try {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      showMessage(data.message || "Registration successful", true);

      setTimeout(() => {
        if (typeof switchTab === "function") switchTab("login");
        document.getElementById("loginEmail").value = email;
      }, 1200);
    } else {
      showMessage(data.message || "Registration failed");
    }
  } catch (err) {
    showMessage("Server error. Please try again later.");
  }
}

async function login() {
  clearMessage();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    showMessage("Please enter email and password");
    return;
  }

  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      showMessage("Login successful! Redirecting...", true);

      localStorage.setItem("email", email);

      setTimeout(() => {
        window.location.href = "portfolio.html";
      }, 1000);
    } else {
      showMessage(data.message || "Invalid credentials");
    }
  } catch (err) {
    showMessage("Unable to connect to server");
  }
}
