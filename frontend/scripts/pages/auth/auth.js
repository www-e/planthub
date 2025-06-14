// **********************************************
// 1. تحديد الـ Base URL للـ API بتاعك
// **********************************************
// استبدل هذا بـ الـ Base URL الحقيقي للباك إند بتاعك
// مثال: const BASE_URL = 'http://localhost:8000';
// أو: const BASE_URL = 'https://api.yourdomain.com';
const BASE_URL = "http://localhost:5000"; // ******* **مهم: غير هذا الـ URL بالـ URL الفعلي لـ API بتاعك** *******

// **********************************************
// 2. دالة registerUser - للتواصل مع API التسجيل
// **********************************************
async function registerUser(userData) {
  try {
    const response = await fetch(`https://planthub.mhmud.com/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const responseData = await response.json();

    if (response.ok) {
      // لو الـ status code كان 2xx (مثل 201 Created)
      console.log("User registered successfully:", responseData);
      // هنا ممكن تحفظ الـ token والـ user data لو هتحتاجها بعدين، لكن حالياً هنحول لصفحة تسجيل الدخول
      localStorage.setItem("userToken", responseData.token);
      localStorage.setItem("userData", JSON.stringify(responseData.user));
      return { success: true, data: responseData };
    } else {
      // لو الـ status code مش 2xx (مثل 500 Internal Server Error, 400 Bad Request)
      console.error(
        "Failed to register user:",
        responseData.error || responseData.message
      );
      return {
        success: false,
        error:
          responseData.error ||
          responseData.message ||
          "Unknown registration error",
      };
    }
  } catch (error) {
    console.error("Error during user registration:", error);
    // ده بيظهر لو فيه مشكلة في الشبكة أو السيرفر مش متاح
    return {
      success: false,
      error: "Network error or server unreachable. Please try again.",
    };
  }
}

// **********************************************
// 3. معالجة الـ DOM والـ Event Listeners (تُنفذ بعد تحميل الصفحة)
// **********************************************
document.addEventListener("DOMContentLoaded", () => {
  // توجيه إظهار/إخفاء كلمة المرور
  const togglePasswordButtons = document.querySelectorAll(".toggle-password");
  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.previousElementSibling;
      const type =
        input.getAttribute("type") === "password" ? "text" : "password";
      input.setAttribute("type", type);
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
    });
  });

  // معالجة إرسال الفورم (منع الإرسال الافتراضي وتطبيق التحقق الخاص بنا)
  const forms = document.querySelectorAll(".auth-form");
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // منع الـ submit الافتراضي للصفحة
      validateForm(this);
    });
  });

  // animations عند التركيز على حقول الإدخال
  const inputs = document.querySelectorAll(".input-group input");
  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", () => {
      input.parentElement.classList.remove("focused");
      if (input.value.length > 0) {
        input.parentElement.classList.add("filled");
      } else {
        input.parentElement.classList.remove("filled");
      }
    });
  });

  // تهيئة animations قائمة الميزات
  initializeFeaturesList();
  // تهيئة تحسينات التعامل مع الفورم على الموبايل
  initializeMobileFormHandling();
});

// **********************************************
// 4. دالة validateForm - للتحقق من صحة بيانات الفورم
// **********************************************
function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll("input[required]");

  inputs.forEach((input) => {
    removeError(input); // إزالة أي أخطاء سابقة

    if (!input.value.trim()) {
      showError(input, "This field is required");
      isValid = false;
      return;
    }

    if (input.type === "email" && !isValidEmail(input.value)) {
      showError(input, "Please enter a valid email address");
      isValid = false;
      return;
    }

    // التحقق من طول كلمة المرور
    if (input.id === "password" && input.value.length < 8) {
      showError(input, "Password must be at least 8 characters long");
      isValid = false;
      return;
    }
  });

  // التحقق من تطابق كلمات المرور في فورم التسجيل
  if (form.closest(".signup-page")) {
    const passwordInput = form.querySelector("#password");
    const confirmPasswordInput = form.querySelector("#confirm-password");

    if (
      passwordInput &&
      confirmPasswordInput &&
      passwordInput.value !== confirmPasswordInput.value
    ) {
      showError(confirmPasswordInput, "Passwords do not match");
      isValid = false;
    }

    // التحقق من الموافقة على الشروط والأحكام
    const termsCheckbox = form.querySelector("#terms-checkbox");
    if (termsCheckbox && !termsCheckbox.checked) {
      showError(
        termsCheckbox,
        "You must agree to the terms and privacy policy"
      );
      isValid = false;
    }
  }

  if (isValid) {
    // لو كل التحققات نجحت، بنستدعي دالة إرسال البيانات للـ API
    (async () => {
      await handleSubmitForm(form);
    })();
  }
}

// **********************************************
// 5. دالة handleSubmitForm - لجمع البيانات وإرسالها للـ API والتعامل مع الاستجابة
// **********************************************
async function handleSubmitForm(form) {
  const submitButton = form.querySelector(".submit-btn");
  const originalText = submitButton.textContent;

  // عرض الـ loading animation على زر الإرسال
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';

  // جمع بيانات الفورم من حقول الإدخال باستخدام الـ IDs
  const fullName = document.getElementById("full-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const currentLocation = document
    .getElementById("current-location")
    .value.trim();

  const userData = {
    name: fullName,
    email: email,
    password: password,
    phone: phone,
    address: address,
    current_location: currentLocation,
  };

  // استدعاء دالة تسجيل المستخدم
  const result = await registerUser(userData);

  // التعامل مع استجابة الـ API (نجاح أو فشل)
  if (result.success) {
    submitButton.innerHTML = '<i class="fas fa-check"></i>'; // عرض أيقونة نجاح

    // إزالة أي رسائل خطأ سابقة من الـ API
    const apiErrorDiv = form.querySelector(".api-error");
    if (apiErrorDiv) {
      apiErrorDiv.remove();
    }

    // تأخير بسيط قبل التحويل لتمكين المستخدم من رؤية رسالة النجاح
    setTimeout(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      form.reset(); // تنظيف حقول الفورم

      // ** تحويل المستخدم إلى صفحة تسجيل الدخول **
      // تأكد أن المسار 'signin.html' صحيح بالنسبة لمشروعك
      window.location.href = "/frontend/pages/home/home.html";
    }, 1500); // 1.5 ثانية تأخير
  } else {
    // في حالة وجود خطأ في التسجيل
    submitButton.innerHTML = '<i class="fas fa-times"></i>'; // عرض أيقونة فشل

    // عرض رسالة الخطأ القادمة من الـ API للمستخدم
    let apiErrorDiv = form.querySelector(".api-error");
    if (!apiErrorDiv) {
      // إذا لم تكن رسالة الخطأ موجودة بالفعل، قم بإنشائها
      apiErrorDiv = document.createElement("div");
      apiErrorDiv.className = "error-message api-error";
      form.insertBefore(apiErrorDiv, form.firstChild); // إضافة رسالة الخطأ في بداية الفورم
    }
    apiErrorDiv.textContent = result.error; // تحديث نص رسالة الخطأ

    setTimeout(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }, 2500); // تأخير أطول لعرض رسالة الخطأ
  }
}

// **********************************************
// 6. دوال مساعدة (لإظهار/إزالة الأخطاء، التحقق من الإيميل، تحسينات الـ UI)
// **********************************************
function showError(input, message) {
  const inputGroup = input.parentElement;
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;

  if (!inputGroup.querySelector(".error-message")) {
    inputGroup.appendChild(errorDiv);
  }

  inputGroup.classList.add("error");
  inputGroup.classList.add("shake"); // إضافة تأثير اهتزاز
  setTimeout(() => {
    inputGroup.classList.remove("shake");
  }, 500);
}

function removeError(input) {
  const inputGroup = input.parentElement;
  const errorMessage = inputGroup.querySelector(".error-message");

  if (errorMessage) {
    errorMessage.remove();
  }
  inputGroup.classList.remove("error");
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function initializeFeaturesList() {
  // تستهدف العناصر ذات الفئة 'feature-item'
  const featureItems = document.querySelectorAll(".feature-item");

  featureItems.forEach((item, index) => {
    item.style.animationDelay = `${(index + 1) * 0.1}s`; // تأخير متدرج للـ animation

    // معالجة أحداث الماوس
    item.addEventListener("mouseenter", () => animateFeatureIcon(item, true));
    item.addEventListener("mouseleave", () => animateFeatureIcon(item, false));

    // معالجة أحداث اللمس (للتوافق مع الأجهزة اللوحية والموبايل)
    item.addEventListener("touchstart", (e) => {
      e.preventDefault();
      animateFeatureIcon(item, true);
    });

    item.addEventListener("touchend", () => {
      animateFeatureIcon(item, false);
    });
  });
}

function animateFeatureIcon(item, active) {
  const icon = item.querySelector("i");
  if (active) {
    icon.style.transform = "scale(1.2) rotate(5deg)";
    item.style.transform = "translateX(10px)";
  } else {
    icon.style.transform = "scale(1) rotate(0deg)";
    item.style.transform = "translateX(0)";
  }
}

function initializeMobileFormHandling() {
  const inputs = document.querySelectorAll("input");

  inputs.forEach((input) => {
    input.addEventListener("touchstart", () => {
      input.style.backgroundColor = "rgba(46, 204, 113, 0.05)";
    });

    input.addEventListener("touchend", () => {
      input.style.backgroundColor = "";
    });
  });

  if (window.innerWidth <= 768) {
    // تحسينات خاصة بالشاشات الصغيرة
    inputs.forEach((input) => {
      input.addEventListener("focus", () => {
        setTimeout(() => {
          input.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      });
    });
  }
}