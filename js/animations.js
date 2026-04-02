

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    initParallaxEffect();
    initImageHoverEffects();
    initScrollAnimations();
    initHoverAnimations();
  });

  function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset;
      
      parallaxElements.forEach(function(element) {
        const speed = element.dataset.speed || 0.5;
        const offset = element.offsetTop;
        const height = element.offsetHeight;
        
        if (scrollTop + window.innerHeight > offset && scrollTop < offset + height) {
          const yPos = (scrollTop - offset) * speed;
          element.style.transform = `translateY(${yPos}px)`;
        }
      });
    });
  }


  function initImageHoverEffects() {
    const hoverCards = document.querySelectorAll('.destination-card, .team-member, .news-card');
    
    hoverCards.forEach(function(card) {
      card.addEventListener('mouseenter', function() {
        this.classList.add('hover');
      });
      
      card.addEventListener('mouseleave', function() {
        this.classList.remove('hover');
      });
    });
  }

  function initScrollAnimations() {
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    
    if (elementsToAnimate.length === 0) return;
    
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animationClass = element.dataset.animation || 'fadeIn';
          const delay = element.dataset.delay || 0;
          
          setTimeout(function() {
            element.classList.add(animationClass, 'animated');
          }, delay);
          
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.2 });
    
    elementsToAnimate.forEach(function(element) {
      observer.observe(element);
    });

    const featuresSection = document.querySelector('#why-choose');
    if (featuresSection) {
      const featureBoxes = featuresSection.querySelectorAll('.feature-box');
      featureBoxes.forEach(function(box, index) {
        box.classList.add('animate-on-scroll');
        box.dataset.animation = 'fadeInUp';
        box.dataset.delay = index * 100;
      });
    }

    const destinationSection = document.querySelector('#featured-destinations');
    if (destinationSection) {
      const destinationCards = destinationSection.querySelectorAll('.destination-card');
      destinationCards.forEach(function(card, index) {
        card.classList.add('animate-on-scroll');
        card.dataset.animation = 'fadeInUp';
        card.dataset.delay = index * 100;
      });
    }

    const newsSection = document.querySelector('#latest-news');
    if (newsSection) {
      const newsCards = newsSection.querySelectorAll('.news-card');
      newsCards.forEach(function(card, index) {
        card.classList.add('animate-on-scroll');
        card.dataset.animation = 'fadeInUp';
        card.dataset.delay = index * 100;
      });
    }
  }


  function initHoverAnimations() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(function(button) {
      button.addEventListener('mouseenter', function(e) {
        const x = e.clientX - this.getBoundingClientRect().left;
        const y = e.clientY - this.getBoundingClientRect().top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('btn-ripple');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.appendChild(ripple);
        
        setTimeout(function() {
          ripple.remove();
        }, 600);
      });
    });
    const featureBoxes = document.querySelectorAll('.feature-box');
    featureBoxes.forEach(function(box) {
      box.addEventListener('mouseenter', function() {
        this.classList.add('pulse');
      });
      
      box.addEventListener('mouseleave', function() {
        this.classList.remove('pulse');
      });
    });

    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(function(link) {
      link.addEventListener('mouseenter', function() {
        this.classList.add('bounce');
      });
      
      link.addEventListener('mouseleave', function() {
        this.classList.remove('bounce');
      });
    });
  }

  const animationClasses = {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 }
    },
    fadeInUp: {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    },
    fadeInDown: {
      from: { opacity: 0, transform: 'translateY(-20px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    },
    fadeInLeft: {
      from: { opacity: 0, transform: 'translateX(-20px)' },
      to: { opacity: 1, transform: 'translateX(0)' }
    },
    fadeInRight: {
      from: { opacity: 0, transform: 'translateX(20px)' },
      to: { opacity: 1, transform: 'translateX(0)' }
    },
    zoomIn: {
      from: { opacity: 0, transform: 'scale(0.9)' },
      to: { opacity: 1, transform: 'scale(1)' }
    },
    pulse: {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.05)' },
      '100%': { transform: 'scale(1)' }
    },
    bounce: {
      '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
      '40%': { transform: 'translateY(-10px)' },
      '60%': { transform: 'translateY(-5px)' }
    }
  };

  function addKeyframes() {
    let style = document.createElement('style');
    let keyframes = '';
    
    for (const [animationName, keyframeObj] of Object.entries(animationClasses)) {
      keyframes += `@keyframes ${animationName} {`;
      
      for (const [key, value] of Object.entries(keyframeObj)) {
        keyframes += `${key} {`;
        
        for (const [prop, propValue] of Object.entries(value)) {
          keyframes += `${prop}: ${propValue};`;
        }
        
        keyframes += `}`;
      }
      
      keyframes += `}`;
      
      keyframes += `.${animationName} {`;
      keyframes += `animation: ${animationName} 0.8s ease forwards;`;
      keyframes += `}`;
    }
    
    style.innerHTML = keyframes;
    document.head.appendChild(style);
  }
  addKeyframes();

})();