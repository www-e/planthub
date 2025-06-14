// **********************************************
// 1. تحديد الـ Base URL للـ API بتاعك
// **********************************************
const BASE_URL = 'http://localhost:5000'; // ******* **مهم: غير هذا الـ URL بالـ URL الفعلي لـ API بتاعك** *******

// **********************************************
// 2. دالة loginUser - للتواصل مع API تسجيل الدخول
// **********************************************
async function loginUser(credentials) {
    try {
        const response = await fetch(`https://planthub.mhmud.com/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const responseData = await response.json();

        if (response.ok) { // لو الـ status code كان 200 OK
            console.log('Login successful:', responseData);
            // حفظ التوكن وبيانات المستخدم في Local Storage
            localStorage.setItem('userToken', responseData.token);
            localStorage.setItem('userData', JSON.stringify(responseData.user));
            return { success: true, data: responseData };
        } else { // لو الـ status code مش 200 (مثل 401 Unauthorized)
            console.error('Login failed:', responseData.message);
            return { success: false, error: responseData.message || 'Unknown login error' };
        }
    } catch (error) {
        console.error('Error during user login:', error);
        return { success: false, error: 'Network error or server unreachable. Please try again.' };
    }
}

// **********************************************
// 3. معالجة الـ DOM والـ Event Listeners لصفحة تسجيل الدخول
// **********************************************
document.addEventListener('DOMContentLoaded', () => {
    // توجيه إظهار/إخفاء كلمة المرور
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // معالجة إرسال فورم تسجيل الدخول
    const signinForm = document.getElementById('signin-form'); 
    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault(); // منع الإرسال الافتراضي
            handleSignInForm(this);
        });
    }

    // animations عند التركيز على حقول الإدخال
    const inputs = document.querySelectorAll('.input-group input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            if (input.value.length > 0) {
                input.parentElement.classList.add('filled');
            } else {
                input.parentElement.classList.remove('filled');
            }
        });
    });

    // تهيئة animations قائمة الميزات (لو موجودة في صفحة تسجيل الدخول)
    // تأكد أن هذه الدالة 'initializeFeaturesList' معرفة إما هنا أو في ملف JS آخر يتم تضمينه
    if (typeof initializeFeaturesList === 'function') {
        initializeFeaturesList();
    }
    
    // تهيئة تحسينات التعامل مع الفورم على الموبايل
    // تأكد أن هذه الدالة 'initializeMobileFormHandling' معرفة إما هنا أو في ملف JS آخر يتم تضمينه
    if (typeof initializeMobileFormHandling === 'function') {
        initializeMobileFormHandling();
    }
});

// **********************************************
// 4. دالة handleSignInForm - لجمع البيانات وإرسالها لـ API تسجيل الدخول
// **********************************************
async function handleSignInForm(form) {
    const submitButton = document.getElementById('signin-submit-btn'); 
    const originalText = submitButton.textContent;
    
    // إزالة أي رسائل خطأ سابقة
    const existingErrorDiv = form.querySelector('.api-error');
    if (existingErrorDiv) {
        existingErrorDiv.remove();
    }

    // عرض الـ loading animation
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';

    const emailInput = document.getElementById('signin-email');
    const passwordInput = document.getElementById('signin-password');

    let isValid = true;

    // تحقق بسيط من الحقول
    // تأكد أن دالة 'showError' و 'removeError' و 'isValidEmail' معرفة
    if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email');
        isValid = false;
    } else {
        removeError(emailInput);
    }

    if (!passwordInput.value.trim()) {
        showError(passwordInput, 'Password is required');
        isValid = false;
    } else {
        removeError(passwordInput);
    }

    if (!isValid) {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        return; // توقف لو فيه أخطاء في التحقق المبدئي
    }

    const credentials = {
        email: emailInput.value.trim(),
        password: passwordInput.value
    };

    // استدعاء دالة تسجيل الدخول
    const result = await loginUser(credentials);
    console.log(result)

    // التعامل مع استجابة الـ API
    if (result.success) {
        submitButton.innerHTML = '<i class="fas fa-check"></i>'; // أيقونة نجاح
        localStorage.setItem('userdata', JSON.stringify())
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            form.reset(); // تنظيف الفورم
        
            // ** تحويل المستخدم إلى صفحة الـ Dashboard أو الرئيسية بعد تسجيل الدخول الناجح **
            window.location.href = '/frontend/pages/home/home.html'; // **مهم: غير هذا المسار للصفحة الرئيسية بعد تسجيل الدخول**
        }, 1500); // 1.5 ثانية تأخير قبل التحويل

    } else {
        submitButton.innerHTML = '<i class="fas fa-times"></i>'; // أيقونة خطأ
        // عرض رسالة الخطأ للمستخدم
        let apiErrorDiv = form.querySelector('.api-error');
        if (!apiErrorDiv) {
            apiErrorDiv = document.createElement('div');
            apiErrorDiv.className = 'error-message api-error';
            form.insertBefore(apiErrorDiv, form.firstChild); 
        }
        apiErrorDiv.textContent = result.error; // تحديث نص رسالة الخطأ
        
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2500); // تأخير أطول لعرض رسالة الخطأ
    }
}

// **********************************************
// 5. الدوال المساعدة (يمكن أن تكون في ملف auth.js أو هنا حسب تنظيم مشروعك)
// **********************************************

// لعرض رسالة خطأ تحت حقل الإدخال
function showError(input, message) {
    const inputGroup = input.parentElement;
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    if (!inputGroup.querySelector('.error-message')) {
        inputGroup.appendChild(errorDiv);
    }
    
    inputGroup.classList.add('error');
    inputGroup.classList.add('shake'); // إضافة تأثير اهتزاز
    setTimeout(() => {
        inputGroup.classList.remove('shake');
    }, 500);
}

// لإزالة رسالة الخطأ
function removeError(input) {
    const inputGroup = input.parentElement;
    const errorMessage = inputGroup.querySelector('.error-message');
    
    if (errorMessage) {
        errorMessage.remove();
    }
    inputGroup.classList.remove('error');
}

// للتحقق من صحة صيغة الإيميل
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// تهيئة animations لقائمة الميزات (إذا كانت موجودة في هذه الصفحة)
function initializeFeaturesList() {
    const featureItems = document.querySelectorAll('.feature-item'); 
    featureItems.forEach((item, index) => {
        item.style.animationDelay = `${(index + 1) * 0.1}s`;
        item.addEventListener('mouseenter', () => animateFeatureIcon(item, true));
        item.addEventListener('mouseleave', () => animateFeatureIcon(item, false));
        item.addEventListener('touchstart', (e) => { e.preventDefault(); animateFeatureIcon(item, true); });
        item.addEventListener('touchend', () => { animateFeatureIcon(item, false); });
    });
}

// تطبيق animation على أيقونة الميزة
function animateFeatureIcon(item, active) {
    const icon = item.querySelector('i');
    if (active) {
        icon.style.transform = 'scale(1.2) rotate(5deg)';
        item.style.transform = 'translateX(10px)';
    } else {
        icon.style.transform = 'scale(1) rotate(0deg)';
        item.style.transform = 'translateX(0)';
    }
}

// تحسينات التعامل مع الفورم على الموبايل
function initializeMobileFormHandling() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('touchstart', () => {
            input.style.backgroundColor = 'rgba(46, 204, 113, 0.05)';
        });
        input.addEventListener('touchend', () => {
            input.style.backgroundColor = '';
        });
    });

    if (window.innerWidth <= 768) {
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        });
    }
}