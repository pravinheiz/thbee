// Advanced Athbee Landing Page JavaScript - FIXED VERSION
// Modern ES6+ with sophisticated interactions and animations

// Firebase Configuration (placeholder - replace with actual config)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase with error handling
let db = null;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
} catch (error) {
  console.warn('Firebase not properly configured. Form will use demo mode.');
}

// Theme Management System
class ThemeManager {
  constructor() {
    this.theme = this.getStoredTheme() || 'dark';
    this.toggleButton = document.getElementById('theme-toggle');
    
    this.init();
  }
  
  getStoredTheme() {
    try {
      return localStorage.getItem('theme');
    } catch (e) {
      return null;
    }
  }
  
  init() {
    this.setTheme(this.theme);
    this.bindEvents();
  }
  
  bindEvents() {
    if (this.toggleButton) {
      this.toggleButton.addEventListener('click', () => this.toggle());
    }
  }
  
  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('Could not save theme preference');
    }
  }
  
  toggle() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    
    // Add smooth transition effect
    this.toggleButton.style.transform = 'rotate(180deg)';
    setTimeout(() => {
      this.toggleButton.style.transform = '';
    }, 300);
  }
}

// Advanced Scroll Animation Observer
class ScrollAnimationObserver {
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        threshold: [0.1, 0.3, 0.7],
        rootMargin: '0px 0px -50px 0px'
      }
    );
    
    this.init();
  }
  
  init() {
    this.observeElements();
    this.initParallaxEffects();
  }
  
  observeElements() {
    const elements = document.querySelectorAll('.fade-in, .timeline-step, .feature-card, .trust-stat');
    elements.forEach((el, index) => {
      el.style.transitionDelay = `${index * 0.1}s`;
      this.observer.observe(el);
    });
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Trigger counter animations
        if (entry.target.querySelector('[data-count]')) {
          this.animateCounters(entry.target);
        }
        
        // Unobserve after animation
        this.observer.unobserve(entry.target);
      }
    });
  }
  
  animateCounters(container) {
    const counters = container.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000;
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * easeOutCubic);
        
        counter.textContent = current.toLocaleString();
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    });
  }
  
  initParallaxEffects() {
    let ticking = false;
    
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.hero-background');
      
      parallaxElements.forEach(element => {
        const speed = 0.5;
        const transform = `translateY(${scrolled * speed}px)`;
        element.style.transform = transform;
      });
      
      ticking = false;
    };
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', requestTick, { passive: true });
  }
}

// Advanced Multi-Step Form Handler - FIXED
class AdvancedWaitlistForm {
  constructor() {
    this.form = document.getElementById('waitlist-form');
    this.currentStep = 1;
    this.totalSteps = 3;
    this.formData = {};
    this.messageElement = document.getElementById('form-message');
    this.submittedEmails = new Set();
    
    this.init();
  }
  
  init() {
    if (!this.form) return;
    
    this.bindEvents();
    this.setupValidation();
    this.updateStepDisplay(); // Initialize step display
  }
  
  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    const inputs = this.form.querySelectorAll('input[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearValidation(input));
    });
    
    // Bind next/prev buttons
    const nextButtons = this.form.querySelectorAll('.btn-next');
    const backButtons = this.form.querySelectorAll('.btn-back');
    
    nextButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.nextStep();
      });
    });
    
    backButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.prevStep();
      });
    });
  }
  
  setupValidation() {
    this.validationRules = {
      name: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s]+$/,
        message: 'Please enter a valid name (letters and spaces only, minimum 2 characters)'
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
      },
      experience: {
        required: true,
        message: 'Please select your trading experience level'
      }
    };
  }
  
  validateField(field) {
    const fieldName = field.name;
    const rules = this.validationRules[fieldName];
    const validation = field.parentElement.querySelector('.form-validation');
    
    if (!rules || !validation) return true;
    
    let isValid = true;
    let message = '';
    
    // Required check
    if (rules.required && !field.value.trim()) {
      isValid = false;
      message = `${field.placeholder || fieldName} is required`;
    }
    
    // Pattern check
    if (isValid && rules.pattern && !rules.pattern.test(field.value)) {
      isValid = false;
      message = rules.message;
    }
    
    // Min length check
    if (isValid && rules.minLength && field.value.length < rules.minLength) {
      isValid = false;
      message = `Minimum ${rules.minLength} characters required`;
    }
    
    // Update validation UI
    if (isValid) {
      validation.textContent = '✓ Looks good!';
      validation.className = 'form-validation success';
      field.classList.remove('error');
      field.classList.add('success');
    } else {
      validation.textContent = message;
      validation.className = 'form-validation error';
      field.classList.remove('success');
      field.classList.add('error');
    }
    
    return isValid;
  }
  
  clearValidation(field) {
    const validation = field.parentElement.querySelector('.form-validation');
    if (validation) {
      validation.textContent = '';
      validation.className = 'form-validation';
    }
    field.classList.remove('error', 'success');
  }
  
  validateCurrentStep() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
    const requiredFields = currentStepElement.querySelectorAll('input[required]');
    const radioGroups = currentStepElement.querySelectorAll('input[name="experience"]');
    
    let isValid = true;
    
    // Validate regular required fields
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    // Validate radio groups
    if (radioGroups.length > 0) {
      const isChecked = Array.from(radioGroups).some(radio => radio.checked);
      if (!isChecked) {
        isValid = false;
        this.showToast('Please select your trading experience', 'error');
      }
    }
    
    return isValid;
  }
  
  nextStep() {
    console.log('NextStep called, current step:', this.currentStep);
    
    if (!this.validateCurrentStep()) {
      console.log('Validation failed');
      return;
    }
    
    // Store current step data
    this.storeCurrentStepData();
    
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      console.log('Moving to step:', this.currentStep);
      this.updateStepDisplay();
      this.animateStepTransition();
    }
  }
  
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepDisplay();
      this.animateStepTransition();
    }
  }
  
  storeCurrentStepData() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
    const inputs = currentStepElement.querySelectorAll('input');
    
    inputs.forEach(input => {
      if (input.type === 'radio') {
        if (input.checked) {
          this.formData[input.name] = input.value;
        }
      } else {
        this.formData[input.name] = input.value;
      }
    });
    
    console.log('Stored form data:', this.formData);
  }
  
  updateStepDisplay() {
    // Update progress indicators
    document.querySelectorAll('.progress-step').forEach((step, index) => {
      const stepNumber = index + 1;
      if (stepNumber <= this.currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
    
    // Show/hide form steps
    document.querySelectorAll('.form-step').forEach(step => {
      const stepNumber = parseInt(step.getAttribute('data-step'));
      if (stepNumber === this.currentStep) {
        step.classList.add('active');
        step.style.display = 'block';
      } else {
        step.classList.remove('active');
        step.style.display = 'none';
      }
    });
    
    console.log('Updated step display to:', this.currentStep);
  }
  
  animateStepTransition() {
    const activeStep = document.querySelector('.form-step.active');
    if (activeStep) {
      activeStep.style.opacity = '0';
      activeStep.style.transform = 'translateX(20px)';
      
      setTimeout(() => {
        activeStep.style.opacity = '1';
        activeStep.style.transform = 'translateX(0)';
      }, 150);
    }
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateCurrentStep()) return;
    
    // Store final step data
    this.storeCurrentStepData();
    
    const { name, email, experience } = this.formData;
    
    // Check for duplicate submissions
    if (this.submittedEmails.has(email)) {
      this.showMessage('You are already on our waitlist!', 'error');
      return;
    }
    
    // Show loading state
    this.setLoadingState(true);
    
    try {
      const submissionData = {
        name,
        email,
        experience,
        timestamp: new Date().toISOString(),
        source: 'landing_page_advanced',
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        formVersion: 'v2.0'
      };
      
      if (db) {
        // Real Firebase submission
        await db.collection('waitlist').add({
          ...submissionData,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        this.showSuccessAnimation();
        this.showMessage('🎉 Welcome to Athbee! You\'ve been added to our early access list.', 'success');
      } else {
        // Demo mode
        await this.simulateSubmission();
        this.showSuccessAnimation();
        this.showMessage('🎉 Welcome to Athbee! You\'ve been added to our early access list. (Demo Mode)', 'success');
      }
      
      // Track successful submission
      this.submittedEmails.add(email);
      
      // Reset form after delay
      setTimeout(() => {
        this.resetForm();
      }, 3000);
      
      // Analytics tracking
      this.trackConversion(submissionData);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      this.showMessage('Something went wrong. Please try again later.', 'error');
    } finally {
      this.setLoadingState(false);
    }
  }
  
  async simulateSubmission() {
    return new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  setLoadingState(loading) {
    const submitButton = this.form.querySelector('.btn-submit');
    const buttonText = submitButton?.querySelector('.btn-text');
    const buttonLoader = submitButton?.querySelector('.btn-loader');
    
    if (submitButton) {
      submitButton.disabled = loading;
      
      if (loading) {
        buttonText?.classList.add('hidden');
        buttonLoader?.classList.remove('hidden');
      } else {
        buttonText?.classList.remove('hidden');
        buttonLoader?.classList.add('hidden');
      }
    }
  }
  
  showSuccessAnimation() {
    const confirmationIcon = document.querySelector('.confirmation-icon');
    if (confirmationIcon) {
      confirmationIcon.style.animation = 'pulse 0.6s ease-in-out';
      setTimeout(() => {
        confirmationIcon.style.animation = '';
      }, 600);
    }
  }
  
  showMessage(message, type) {
    if (this.messageElement) {
      this.messageElement.textContent = message;
      this.messageElement.className = `form-message ${type}`;
      this.messageElement.classList.remove('hidden');
      
      // Auto-hide after 8 seconds
      setTimeout(() => {
        this.messageElement.classList.add('hidden');
      }, 8000);
    }
    
    // Also show toast notification
    this.showToast(message, type);
  }
  
  resetForm() {
    this.form.reset();
    this.currentStep = 1;
    this.updateStepDisplay();
    this.formData = {};
    
    // Clear all validations
    const validations = this.form.querySelectorAll('.form-validation');
    validations.forEach(v => {
      v.textContent = '';
      v.className = 'form-validation';
    });
    
    const fields = this.form.querySelectorAll('input');
    fields.forEach(f => f.classList.remove('error', 'success'));
  }
  
  trackConversion(data) {
    console.log('Waitlist conversion tracked:', data);
    
    // Real analytics integration would go here
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        event_category: 'waitlist',
        event_label: 'advanced_form',
        value: 1
      });
    }
  }
  
  showToast(message, type = 'info') {
    const toast = new Toast(message, type);
    toast.show();
  }
}

// Demo Section Handler - FIXED
class DemoHandler {
  constructor() {
    this.currentTab = 'news';
    this.tabs = document.querySelectorAll('.demo-tab');
    this.panels = document.querySelectorAll('.demo-panel');
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.startLiveDemo();
    this.initializeTabs(); // Initialize tab states
  }
  
  initializeTabs() {
    // Ensure first tab is active
    if (this.tabs.length > 0) {
      this.switchTab('news');
    }
  }
  
  bindEvents() {
    this.tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = e.target.getAttribute('data-tab');
        console.log('Tab clicked:', tabName);
        this.switchTab(tabName);
      });
    });
  }
  
  switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    this.currentTab = tabName;
    
    // Update tab states
    this.tabs.forEach(tab => {
      if (tab.getAttribute('data-tab') === tabName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // Update panel states
    this.panels.forEach(panel => {
      if (panel.id === `${tabName}-panel`) {
        panel.classList.add('active');
        panel.style.display = 'block';
      } else {
        panel.classList.remove('active');
        panel.style.display = 'none';
      }
    });
    
    // Animate panel transition
    setTimeout(() => {
      this.animatePanelTransition();
    }, 50);
  }
  
  animatePanelTransition() {
    const activePanel = document.querySelector('.demo-panel.active');
    if (activePanel) {
      activePanel.style.opacity = '0';
      activePanel.style.transform = 'translateY(10px)';
      
      setTimeout(() => {
        activePanel.style.opacity = '1';
        activePanel.style.transform = 'translateY(0)';
      }, 150);
    }
  }
  
  startLiveDemo() {
    // Simulate live data updates in demo
    setInterval(() => {
      this.updateDemoData();
    }, 5000);
  }
  
  updateDemoData() {
    // Update sentiment percentages
    const sentimentBars = document.querySelectorAll('.sentiment-bar');
    sentimentBars.forEach(bar => {
      const randomWidth = Math.floor(Math.random() * 30) + 20;
      bar.style.width = `${randomWidth}%`;
      
      const label = bar.querySelector('.bar-label');
      if (label) {
        const sentimentType = label.textContent.split(' ')[0];
        label.textContent = `${sentimentType} ${randomWidth}%`;
      }
    });
    
    // Update news timestamps
    const timestamps = document.querySelectorAll('.news-time');
    timestamps.forEach((timestamp, index) => {
      const minutes = Math.floor(Math.random() * 30) + 1;
      timestamp.textContent = `${minutes} minutes ago`;
    });
  }
}

// Testimonial Carousel Handler
class TestimonialCarousel {
  constructor() {
    this.currentIndex = 0;
    this.testimonials = document.querySelectorAll('.testimonial-card');
    this.dots = document.querySelectorAll('.dot');
    this.autoplayInterval = null;
    
    this.init();
  }
  
  init() {
    if (this.testimonials.length === 0) return;
    
    this.bindEvents();
    this.startAutoplay();
  }
  
  bindEvents() {
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
      carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });
      
      carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        this.handleSwipe(startX, endX);
      }, { passive: true });
    }
  }
  
  handleSwipe(startX, endX) {
    const diff = startX - endX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }
  
  goToSlide(index) {
    this.currentIndex = index;
    this.updateDisplay();
    this.resetAutoplay();
  }
  
  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    this.updateDisplay();
  }
  
  prevSlide() {
    this.currentIndex = this.currentIndex === 0 ? this.testimonials.length - 1 : this.currentIndex - 1;
    this.updateDisplay();
  }
  
  updateDisplay() {
    // Update testimonial cards
    this.testimonials.forEach((testimonial, index) => {
      if (index === this.currentIndex) {
        testimonial.classList.add('active');
      } else {
        testimonial.classList.remove('active');
      }
    });
    
    // Update dots
    this.dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
  
  resetAutoplay() {
    clearInterval(this.autoplayInterval);
    this.startAutoplay();
  }
}

// Modal Handler - FIXED
class ModalHandler {
  constructor() {
    this.activeModal = null;
    this.bindEvents();
  }
  
  bindEvents() {
    // Close modal on backdrop click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        this.closeModal();
      }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeModal();
      }
    });
    
    // Close button clicks
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-close')) {
        this.closeModal();
      }
    });
  }
  
  openModal(modalId) {
    console.log('Opening modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
      this.activeModal = modal;
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      
      // Focus management
      const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
    } else {
      console.error('Modal not found:', modalId);
    }
  }
  
  closeModal() {
    if (this.activeModal) {
      this.activeModal.classList.add('hidden');
      document.body.style.overflow = '';
      this.activeModal = null;
    }
  }
}

// Toast Notification System
class Toast {
  constructor(message, type = 'info', duration = 5000) {
    this.message = message;
    this.type = type;
    this.duration = duration;
    this.element = null;
  }
  
  show() {
    this.create();
    this.animate();
    this.autoRemove();
  }
  
  create() {
    this.element = document.createElement('div');
    this.element.className = `toast ${this.type}`;
    this.element.innerHTML = `
      <div class="toast-content">
        <span class="toast-message">${this.message}</span>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    `;
    
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    container.appendChild(this.element);
  }
  
  animate() {
    if (this.element) {
      // Trigger show animation
      setTimeout(() => {
        this.element.classList.add('show');
      }, 100);
    }
  }
  
  autoRemove() {
    setTimeout(() => {
      if (this.element) {
        this.element.classList.remove('show');
        setTimeout(() => {
          if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
          }
        }, 300);
      }
    }, this.duration);
  }
}

// Smooth Scroll Utilities - FIXED
class SmoothScroll {
  static scrollTo(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (element) {
      const targetPosition = element.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      return true;
    }
    return false;
  }
  
  static scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// Global Functions for HTML onclick handlers - FIXED
function scrollToWaitlist() {
  console.log('scrollToWaitlist called');
  const success = SmoothScroll.scrollTo('waitlist', 80);
  
  if (success) {
    // Focus on first form field after scroll
    setTimeout(() => {
      const firstInput = document.querySelector('#waitlist input[type="text"], #waitlist input[type="email"]');
      if (firstInput) {
        firstInput.focus();
        console.log('Focused on first input');
      }
    }, 1000);
  } else {
    console.error('Could not find waitlist element');
  }
}

function nextStep() {
  console.log('Global nextStep called');
  if (window.waitlistForm) {
    window.waitlistForm.nextStep();
  } else {
    console.error('waitlistForm not available');
  }
}

function prevStep() {
  console.log('Global prevStep called');
  if (window.waitlistForm) {
    window.waitlistForm.prevStep();
  } else {
    console.error('waitlistForm not available');
  }
}

function showTestimonial(index) {
  if (window.testimonialCarousel) {
    window.testimonialCarousel.goToSlide(index);
  }
}

function openDemo() {
  console.log('openDemo called');
  if (window.modalHandler) {
    window.modalHandler.openModal('demo-modal');
  } else {
    console.error('modalHandler not available');
  }
}

function closeDemo() {
  console.log('closeDemo called');
  if (window.modalHandler) {
    window.modalHandler.closeModal();
  } else {
    console.error('modalHandler not available');
  }
}

// Enhanced Card Interactions
class CardInteractions {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupTiltEffects();
    this.setupHoverEffects();
  }
  
  setupTiltEffects() {
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        this.handleTilt(e, card);
      });
      
      card.addEventListener('mouseleave', () => {
        this.resetTilt(card);
      });
    });
  }
  
  handleTilt(e, card) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateX = (mouseY / rect.height) * -10;
    const rotateY = (mouseX / rect.width) * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
  }
  
  resetTilt(card) {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  }
  
  setupHoverEffects() {
    const hoverCards = document.querySelectorAll('.feature-card, .step-card, .trust-badge');
    
    hoverCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }
}

// Performance Optimization
class PerformanceOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    this.lazyLoadImages();
    this.optimizeAnimations();
  }
  
  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  optimizeAnimations() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      document.documentElement.style.setProperty('--animation-duration', '0.2s');
    }
    
    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.01s');
    }
  }
}

// Newsletter Form Handler
class NewsletterForm {
  constructor() {
    this.form = document.getElementById('newsletter-form');
    this.init();
  }
  
  init() {
    if (!this.form) return;
    
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this.form);
    const email = formData.get('email')?.trim();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      new Toast('Please enter a valid email address', 'error').show();
      return;
    }
    
    try {
      // Simulate newsletter subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      new Toast('Successfully subscribed to newsletter!', 'success').show();
      this.form.reset();
      
    } catch (error) {
      new Toast('Failed to subscribe. Please try again.', 'error').show();
    }
  }
}

// Application Initialization
class AthbeeApp {
  constructor() {
    this.init();
  }
  
  async init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }
  
  initializeComponents() {
    console.log('🚀 Initializing Athbee Advanced Landing Page...');
    
    try {
      // Initialize core systems
      this.themeManager = new ThemeManager();
      this.scrollObserver = new ScrollAnimationObserver();
      this.modalHandler = new ModalHandler();
      
      // Initialize form handlers
      this.waitlistForm = new AdvancedWaitlistForm();
      this.newsletterForm = new NewsletterForm();
      
      // Initialize interactive components
      this.demoHandler = new DemoHandler();
      this.testimonialCarousel = new TestimonialCarousel();
      this.cardInteractions = new CardInteractions();
      
      // Initialize optimizations
      this.performanceOptimizer = new PerformanceOptimizer();
      
      // Make components globally available
      window.waitlistForm = this.waitlistForm;
      window.testimonialCarousel = this.testimonialCarousel;
      window.modalHandler = this.modalHandler;
      window.demoHandler = this.demoHandler;
      
      this.setupGlobalEventHandlers();
      
      console.log('✅ Athbee app initialized successfully!');
      
    } catch (error) {
      console.error('❌ Error initializing Athbee app:', error);
    }
  }
  
  setupGlobalEventHandlers() {
    // Handle smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        SmoothScroll.scrollTo(targetId, 80);
      });
    });
    
    // Handle CTA button clicks
    document.querySelectorAll('.hero-cta').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToWaitlist();
      });
    });
    
    // Handle demo button clicks
    document.querySelectorAll('.demo-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        openDemo();
      });
    });
    
    // Handle scroll-to-top functionality
    let scrollTopButton = null;
    
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 500) {
        if (!scrollTopButton) {
          scrollTopButton = this.createScrollTopButton();
        }
        scrollTopButton.style.opacity = '1';
        scrollTopButton.style.pointerEvents = 'auto';
      } else if (scrollTopButton) {
        scrollTopButton.style.opacity = '0';
        scrollTopButton.style.pointerEvents = 'none';
      }
    }, { passive: true });
    
    // Handle offline/online status
    window.addEventListener('online', () => {
      new Toast('Connection restored', 'success').show();
    });
    
    window.addEventListener('offline', () => {
      new Toast('Connection lost - some features may not work', 'error').show();
    });
    
    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
      // ESC to close modals and clear form messages
      if (e.key === 'Escape') {
        this.modalHandler.closeModal();
        
        const messages = document.querySelectorAll('.form-message:not(.hidden)');
        messages.forEach(msg => msg.classList.add('hidden'));
      }
      
      // Space/Enter on CTA buttons
      if ((e.key === ' ' || e.key === 'Enter') && e.target.classList.contains('hero-cta')) {
        e.preventDefault();
        scrollToWaitlist();
      }
    });
  }
  
  createScrollTopButton() {
    const button = document.createElement('button');
    button.className = 'scroll-top-button';
    button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    `;
    button.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 50px;
      height: 50px;
      border: none;
      border-radius: 50%;
      background: var(--gradient-primary);
      color: white;
      cursor: pointer;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s ease;
      z-index: 999;
      box-shadow: var(--shadow-premium);
    `;
    
    button.addEventListener('click', SmoothScroll.scrollToTop);
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(button);
    return button;
  }
}

// Initialize the application
const athbeeApp = new AthbeeApp();

// Export for testing and debugging
window.AthbeeApp = {
  athbeeApp,
  ThemeManager,
  AdvancedWaitlistForm,
  DemoHandler,
  TestimonialCarousel,
  Toast,
  SmoothScroll
};