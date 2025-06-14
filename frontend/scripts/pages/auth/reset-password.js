document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".reset-password-form");
  const [otpInput, passwordInput] = form.querySelectorAll("input");
  const submitBtn = form.querySelector(".submit-btn");
  const emailInfo = document.getElementById("emailInfo");
  const userEmail = document.getElementById("userEmail");

  // Get saved email from localStorage
  const savedEmail = localStorage.getItem("resetEmail");
  if (!savedEmail) {
    showMessage("No email found. Please request a reset link first.", "error");
    form
      .querySelectorAll("input, button")
      .forEach((el) => (el.disabled = true));
    emailInfo.style.display = "none";
    return;
  } else {
    userEmail.textContent = savedEmail;
    emailInfo.style.display = "flex";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const otp = otpInput.value.trim();
    const newPassword = passwordInput.value.trim();

    if (!otp || !newPassword) {
      showMessage("All fields are required.", "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Resetting...";

    try {
      const response = await fetch(
        "https://planthub.mhmud.com/api/password/reset",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: savedEmail,
            otp,
            password: newPassword,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.message) {
        showMessage(result.message, "success");
        setTimeout(() => (window.location.href = "signin.html"), 2000);
      } else {
        showMessage(result.message || "Reset failed.", "error");
      }
    } catch (err) {
      showMessage("Network error. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Reset Password";
    }
  });

  function showMessage(msg, type) {
    let el = document.createElement("div");
    el.className = `reset-message ${type}`;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
});
