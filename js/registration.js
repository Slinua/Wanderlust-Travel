(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    initRegistrationForm();
    initLoginForm();
  });

  function initRegistrationForm() {
    const registrationForm = document.getElementById('registrationForm');
    if (!registrationForm) return;
    const formSteps = registrationForm.querySelectorAll('.form-step');
    const progressBar = registrationForm.querySelector('.progress-bar');
    const nextButtons = registrationForm.querySelectorAll('.next-step');
    const prevButtons = registrationForm.querySelectorAll('.prev-step');
    
    let currentStep = 0;

    nextButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        if (validateCurrentStep(currentStep)) {
          goToNextStep();
        }
      });
    });
    prevButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        goToPrevStep();
      });
    });
    registrationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (validateCurrentStep(currentStep)) {
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        setTimeout(function() {
          registrationForm.style.display = 'none';
          document.getElementById('registrationSuccess').style.display = 'block';
        }, 2000);
      }
    });
    function goToNextStep() {
      formSteps[currentStep].classList.remove('active');
      currentStep++;
      formSteps[currentStep].classList.add('active');
      updateProgressBar();
    }
    function goToPrevStep() {
      formSteps[currentStep].classList.remove('active');
      currentStep--;
      formSteps[currentStep].classList.add('active');
      updateProgressBar();
    }
    function updateProgressBar() {
      const progressPercentage = ((currentStep + 1) / formSteps.length) * 100;
      progressBar.style.width = progressPercentage + '%';
      progressBar.setAttribute('aria-valuenow', progressPercentage);
      progressBar.textContent = 'Step ' + (currentStep + 1) + ' of ' + formSteps.length;
    }
    function validateCurrentStep(step) {
      const currentFormStep = formSteps[step];
      const requiredFields = currentFormStep.querySelectorAll('input[required], select[required], textarea[required]');
      let isValid = true;
      const errorMessages = currentFormStep.querySelectorAll('.error-message');
      errorMessages.forEach(function(errorMsg) {
        errorMsg.remove();
      });
      requiredFields.forEach(function(field) {
        field.classList.remove('is-invalid');
        if (field.value.trim() === '') {
          isValid = false;
          showFieldError(field, '此字段为必填项');
        }
        if (field.type === 'email' && field.value.trim() !== '') {
          if (!isValidEmail(field.value.trim())) {
            isValid = false;
            showFieldError(field, '请输入有效的电子邮件地址');
          }
        }
        if (step === 0 && field.id === 'password') {
          const strength = calculatePasswordStrength(field.value);
          if (strength < 2) {
            isValid = false;
            showFieldError(field, '密码太弱。请包括大写字母、数字和特殊字符');
          }
        }
        if (step === 0 && field.id === 'confirmPassword') {
          const password = document.getElementById('password').value;
          if (field.value !== password) {
            isValid = false;
            showFieldError(field, '密码不匹配');
          }
        }
        if (field.type === 'checkbox' && !field.checked) {
          isValid = false;
          showFieldError(field, '您必须接受条款和条件');
        }
      });
      
      return isValid;
    }
    function showFieldError(field, message) {
      field.classList.add('is-invalid');
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message text-danger mt-1 small';
      errorDiv.textContent = message;
      
      const parentElement = field.parentElement;
      parentElement.appendChild(errorDiv);
      
      field.addEventListener('focus', function() {
        field.classList.remove('is-invalid');
        const errorMsg = parentElement.querySelector('.error-message');
        if (errorMsg) {
          errorMsg.remove();
        }
      });
    }
  }
  function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      let isValid = true;
      const errorMessages = loginForm.querySelectorAll('.error-message');
      errorMessages.forEach(function(errorMsg) {
        errorMsg.remove();
      });
      if (email === '') {
        isValid = false;
        showLoginError('loginEmail', '需要邮箱');
      } else if (!isValidEmail(email)) {
        isValid = false;
        showLoginError('loginEmail', '请输入有效的电子邮件地址');
      }
      if (password === '') {
        isValid = false;
        showLoginError('loginPassword', '需要密码');
      }
      
      if (isValid) {
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        setTimeout(function() {
          const loginModal = document.getElementById('loginModal');
          const bsModal = bootstrap.Modal.getInstance(loginModal);
          bsModal.hide();
          loginForm.reset();
          submitButton.disabled = false;
          submitButton.innerHTML = 'Login';
          alert('Login successful!');
        }, 2000);
      }
    });
    function showLoginError(fieldId, message) {
      const field = document.getElementById(fieldId);
      field.classList.add('is-invalid');
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message text-danger mt-1 small';
      errorDiv.textContent = message;
      
      const parentElement = field.parentElement;
      parentElement.appendChild(errorDiv);
      
      field.addEventListener('focus', function() {
        field.classList.remove('is-invalid');
        const errorMsg = parentElement.querySelector('.error-message');
        if (errorMsg) {
          errorMsg.remove();
        }
      });
    }
  }
  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  function calculatePasswordStrength(password) {
    if (password.length === 0) {
      return 0;
    }
    
    let strength = 0;
    if (password.length >= 8) {
      strength += 1;
    }
    if (/[A-Z]/.test(password)) {
      strength += 1;
    }
    
    if (/[0-9]/.test(password)) {
      strength += 1;
    }
    
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 1;
    }
    
    return Math.min(strength, 4);
  }

})();