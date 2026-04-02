
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    initHeroSlider();
    initBackToTop();
    initDestinationFilters();
    initTestimonialSlider();
    initCounters();
    initAnimations();
    window.addEventListener('load', function() {
      const preloader = document.querySelector('.preloader');
      if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(function() {
          preloader.style.display = 'none';
        }, 500);
      }
    });
  });

  function initHeader() {
    const header = document.getElementById('header');
    const navbar = header.querySelector('.navbar');

    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
        navbar.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
        navbar.classList.remove('scrolled');
      }
    });
    window.dispatchEvent(new Event('scroll'));
  }
  function initHeroSlider() {
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length === 0) return;

    let currentSlide = 0;
    const slideInterval = setInterval(nextSlide, 5000);

    function nextSlide() {
      heroSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
    }
    const fadeElements = document.querySelectorAll('.hero-content .fade-in');
    fadeElements.forEach(function(element) {
      element.classList.add('fade-in');
    });
  }
  function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        backToTop.classList.add('active');
      } else {
        backToTop.classList.remove('active');
      }
    });

    backToTop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  function initDestinationFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length === 0) return;

    filterButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        filterButtons.forEach(function(btn) {
          btn.classList.remove('active');
        });
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');
        const items = document.querySelectorAll('.destination-item');

        items.forEach(function(item) {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
  function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');

    if (testimonials.length === 0) return;

    let currentTestimonial = 0;

    function showTestimonial(index) {
      testimonials.forEach(function(testimonial) {
        testimonial.classList.remove('active');
      });
      dots.forEach(function(dot) {
        dot.classList.remove('active');
      });
      testimonials[index].classList.add('active');
      dots[index].classList.add('active');
    }
    dots.forEach(function(dot, index) {
      dot.addEventListener('click', function() {
        currentTestimonial = index;
        showTestimonial(currentTestimonial);
      });
    });
    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
      });
    }

    setInterval(function() {
      if (document.visibilityState === 'visible') {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
      }
    }, 7000);
  }

  function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    let counted = false;

    function startCounting() {
      if (counted) return;

      counters.forEach(function(counter) {
        const target = +counter.getAttribute('data-count');
        let count = 0;
        const increment = target / 100;

        const updateCount = () => {
          if (count < target) {
            count += increment;
            counter.innerText = Math.ceil(count);
            setTimeout(updateCount, 20);
          } else {
            counter.innerText = target;
          }
        };

        updateCount();
      });

      counted = true;
    }
    const counterSection = document.querySelector('#achievements') || document.querySelector('#statistics');
    if (counterSection) {
      const observer = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
          startCounting();
        }
      }, { threshold: 0.3 });

      observer.observe(counterSection);
    }
  }

  function initAnimations() {
    const animatedElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .zoom-in');
    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(function(element) {
      observer.observe(element);
    });
  }
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });

})();