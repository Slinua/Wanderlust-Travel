(function() {
  'use strict';
  document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initPasswordToggle();
    initPasswordStrength();
    initFormSteps();
  });
  function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formMessage = contactForm.querySelector('.form-message');
      formMessage.style.display = 'none';
      formMessage.classList.remove('success', 'error');
      const name = contactForm.querySelector('#name').value.trim();
      const email = contactForm.querySelector('#email').value.trim();
      const subject = contactForm.querySelector('#subject').value.trim();
      const message = contactForm.querySelector('#message').value.trim();
      const privacy = contactForm.querySelector('#privacy').checked;
      if (name === '' || email === '' || subject === '' || message === '' || !privacy) {
        formMessage.innerHTML = '请填写所有必填字段并同意隐私政策。';
        formMessage.classList.add('error');
        formMessage.style.display = 'block';
        return;
      }
      if (!isValidEmail(email)) {
        formMessage.innerHTML = '请输入有效的电子邮件地址。';
        formMessage.classList.add('error');
        formMessage.style.display = 'block';
        return;
      }
      const submitButton = contactForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      setTimeout(function() {
        formMessage.innerHTML = '您的消息已成功发送。我们会尽快回复您！';
        formMessage.classList.add('success');
        formMessage.style.display = 'block';
        contactForm.reset();
        submitButton.disabled = false;
        submitButton.innerHTML = '发送消息';
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 2000);
    });
  }
  function initPasswordToggle() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(function(toggle) {
      toggle.addEventListener('click', function() {
        const passwordField = this.previousElementSibling;
        const icon = this.querySelector('i');
        
        if (passwordField.type === 'password') {
          passwordField.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          passwordField.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      });
    });
  }
  function initPasswordStrength() {
    const passwordField = document.getElementById('password');
    if (!passwordField) return;
    
    const strengthMeter = document.querySelector('.strength-meter-fill');
    const strengthText = document.querySelector('.strength-text');
    
    passwordField.addEventListener('input', function() {
      const password = this.value;
      const strength = calculatePasswordStrength(password);
      strengthMeter.setAttribute('data-strength', strength);
      if (password === '') {
        strengthText.textContent = '';
      } else if (strength === 1) {
        strengthText.textContent = '弱';
        strengthText.style.color = 'var(--error-color)';
      } else if (strength === 2) {
        strengthText.textContent = '公平';
        strengthText.style.color = 'var(--warning-color)';
      } else if (strength === 3) {
        strengthText.textContent = '好';
        strengthText.style.color = 'var(--primary-color)';
      } else if (strength === 4) {
        strengthText.textContent = '强';
        strengthText.style.color = 'var(--success-color)';
      }
    });
    
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
  }
  function initFormSteps() {
    const registrationForm = document.getElementById('registrationForm');
    if (!registrationForm) return;
    
    const formSteps = registrationForm.querySelectorAll('.form-step');
    const progress = registrationForm.querySelector('.progress-bar');
    const nextButtons = registrationForm.querySelectorAll('.next-step');
    const prevButtons = registrationForm.querySelectorAll('.prev-step');
    
    let currentStep = 0;
    nextButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        if (validateStep(currentStep)) {
          formSteps[currentStep].classList.remove('active');
          currentStep++;
          formSteps[currentStep].classList.add('active');
          updateProgress();
        }
      });
    });
    prevButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        formSteps[currentStep].classList.remove('active');
        currentStep--;
        formSteps[currentStep].classList.add('active');
        updateProgress();
      });
    });
    registrationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (validateStep(currentStep)) {
        const submitButton = registrationForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        setTimeout(function() {
          registrationForm.style.display = 'none';
          document.getElementById('registrationSuccess').style.display = 'block';
        }, 2000);
      }
    });
    function updateProgress() {
      const percentage = ((currentStep + 1) / formSteps.length) * 100;
      progress.style.width = percentage + '%';
      progress.setAttribute('aria-valuenow', percentage);
      progress.textContent = '步 ' + (currentStep + 1) + ' of ' + formSteps.length;
    }
    function validateStep(step) {
      const currentFormStep = formSteps[step];
      const inputs = currentFormStep.querySelectorAll('input[required], select[required], textarea[required]');
      let isValid = true;
      
      inputs.forEach(function(input) {
        if (input.value.trim() === '') {
          isValid = false;
          input.classList.add('is-invalid');
        } else {
          input.classList.remove('is-invalid');
        }
        
        if (input.type === 'email' && !isValidEmail(input.value.trim())) {
          isValid = false;
          input.classList.add('is-invalid');
        }
        
        if (input.type === 'checkbox' && !input.checked) {
          isValid = false;
          input.classList.add('is-invalid');
        }
      });
      if (step === 0 && document.getElementById('password') && document.getElementById('confirmPassword')) {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
          isValid = false;
          document.getElementById('confirmPassword').classList.add('is-invalid');
          alert('密码不匹配。');
        }
        
        if (calculatePasswordStrength(password) < 2) {
          isValid = false;
          document.getElementById('password').classList.add('is-invalid');
          alert('密码太弱。请使用更强的密码。');
        }
      }
      
      if (!isValid) {
        alert('请正确填写所有必填字段。');
      }
      
      return isValid;
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
  }
  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

})();