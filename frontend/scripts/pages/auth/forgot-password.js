document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".auth-form");
  const emailInput = form.querySelector('input[type="email"]');
  const submitBtn = form.querySelector(".submit-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email) {
      showMessage("Please enter your email.", "error");
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    try {
      const response = await fetch(
        "https://planthub.mhmud.com/api/password/forget",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const result = await response.json();
      if (response.ok && result.message) {
        showMessage("OTP sent! Redirecting...", "success");
        // Save email to localStorage for reset-password page
        localStorage.setItem("resetEmail", email);
        setTimeout(() => (window.location.href = "reset-password.html"), 1500);
      } else {
        showMessage(result.message || "Failed to send reset link.", "error");
      }
    } catch (err) {
      showMessage("Network error. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Reset Link";
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
