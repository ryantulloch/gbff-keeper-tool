(function() {
  'use strict';

  // ============================================
  // ULTRA-SMOOTH ACCORDION SYSTEM
  // Spring physics + Transform-only animations
  // Optimized for 60fps on mobile devices
  // ============================================

  // Performance constants
  const MOBILE_BREAKPOINT = 768;
  const ANIMATION_FPS = 60;
  const FRAME_TIME = 1000 / ANIMATION_FPS;
  const HAPTIC_DURATION = 5; // Reduced from 10ms for quicker response

  // Spring physics parameters
  const SPRING = {
    stiffness: 0.15,
    damping: 0.85,
    mass: 1,
    precision: 0.001
  };

  // Feature detection
  const supportsHaptic = 'vibrate' in navigator;
  const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;

  // Performance monitoring
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 60;

  // Utilities
  const isMobile = () => window.innerWidth < MOBILE_BREAKPOINT;
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  // ============================================
  // SPRING PHYSICS ENGINE
  // ============================================
  
  class SpringAnimation {
    constructor(initialValue = 0) {
      this.value = initialValue;
      this.target = initialValue;
      this.velocity = 0;
      this.animationId = null;
      this.onUpdate = null;
      this.onComplete = null;
    }

    setTarget(target, immediate = false) {
      this.target = target;
      
      if (immediate || prefersReducedMotion) {
        this.value = target;
        this.velocity = 0;
        if (this.onUpdate) this.onUpdate(this.value);
        if (this.onComplete) this.onComplete();
        return;
      }

      this.animate();
    }

    animate() {
      if (this.animationId) return;

      const step = () => {
        // Spring physics calculation
        const displacement = this.target - this.value;
        const springForce = displacement * SPRING.stiffness;
        const dampingForce = -this.velocity * SPRING.damping;
        const acceleration = (springForce + dampingForce) / SPRING.mass;
        
        this.velocity += acceleration;
        this.value += this.velocity;

        // Check if animation is complete
        if (Math.abs(this.velocity) < SPRING.precision && 
            Math.abs(displacement) < SPRING.precision) {
          this.value = this.target;
          this.velocity = 0;
          
          if (this.onUpdate) this.onUpdate(this.value);
          if (this.onComplete) this.onComplete();
          
          cancelAnimationFrame(this.animationId);
          this.animationId = null;
          return;
        }

        if (this.onUpdate) this.onUpdate(this.value);
        this.animationId = requestAnimationFrame(step);
      };

      this.animationId = requestAnimationFrame(step);
    }

    stop() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }
  }

  // ============================================
  // ACCORDION CONTROLLER
  // ============================================

  class AccordionController {
    constructor(panel, button, chevron) {
      this.panel = panel;
      this.button = button;
      this.chevron = chevron;
      this.isOpen = false;
      this.isAnimating = false;
      
      // Spring animations for smooth transitions
      this.scaleAnimation = new SpringAnimation(0);
      this.opacityAnimation = new SpringAnimation(0);
      this.chevronAnimation = new SpringAnimation(0);
      
      // Cached measurements
      this.contentHeight = 0;
      this.lastWidth = window.innerWidth;
      
      this.init();
    }

    init() {
      // Set initial state
      this.measureContent();
      this.setupAnimations();
      this.setupStyles();
      this.setupEventListeners();
      this.setAriaAttributes();
    }

    measureContent() {
      // Temporarily show content to measure height
      const originalStyles = {
        height: this.panel.style.height,
        opacity: this.panel.style.opacity,
        transform: this.panel.style.transform,
        display: this.panel.style.display
      };

      this.panel.style.height = 'auto';
      this.panel.style.opacity = '1';
      this.panel.style.transform = 'none';
      this.panel.style.display = 'block';
      
      this.contentHeight = this.panel.scrollHeight;
      
      // Restore original styles
      Object.assign(this.panel.style, originalStyles);
    }

    setupAnimations() {
      // Scale animation (for height)
      this.scaleAnimation.onUpdate = (value) => {
        if (!this.panel) return;
        
        // Use transform for GPU acceleration
        this.panel.style.transform = `scaleY(${value})`;
        this.panel.style.maxHeight = `${this.contentHeight * value}px`;
      };

      // Opacity animation
      this.opacityAnimation.onUpdate = (value) => {
        if (!this.panel) return;
        this.panel.style.opacity = value;
      };

      // Chevron rotation animation
      this.chevronAnimation.onUpdate = (value) => {
        if (!this.chevron) return;
        this.chevron.style.transform = `rotate(${value * 180}deg)`;
      };

      // Animation complete callback
      const onAnimationComplete = () => {
        this.isAnimating = false;
        
        if (this.isOpen) {
          // When open, allow content to be naturally sized
          this.panel.style.height = 'auto';
          this.panel.style.maxHeight = 'none';
          this.panel.style.transform = 'none';
        } else {
          // When closed, ensure it's fully hidden
          this.panel.style.display = 'none';
        }
      };

      this.scaleAnimation.onComplete = onAnimationComplete;
    }

    setupStyles() {
      // Optimize panel for animations
      Object.assign(this.panel.style, {
        transformOrigin: 'top',
        willChange: 'auto',
        contain: 'layout style paint',
        overflow: 'hidden',
        height: '0',
        opacity: '0',
        transform: 'scaleY(0)',
        display: 'none'
      });

      // Optimize chevron
      if (this.chevron) {
        Object.assign(this.chevron.style, {
          transformOrigin: 'center',
          willChange: 'auto',
          transition: 'none'
        });
      }

      // Optimize button
      this.button.style.touchAction = 'manipulation';
      this.button.style.webkitTapHighlightColor = 'transparent';
    }

    setupEventListeners() {
      // Enhanced touch handling
      if (supportsTouch) {
        let touchStartY = 0;
        let touchStartTime = 0;

        this.button.addEventListener('touchstart', (e) => {
          touchStartY = e.touches[0].clientY;
          touchStartTime = performance.now();
          
          // Immediate visual feedback
          this.button.classList.add('touch-active');
          
          // Ultra-quick haptic feedback
          if (supportsHaptic && !prefersReducedMotion) {
            navigator.vibrate(HAPTIC_DURATION);
          }
        }, { passive: true });

        this.button.addEventListener('touchend', (e) => {
          const touchEndY = e.changedTouches[0].clientY;
          const touchDuration = performance.now() - touchStartTime;
          const touchDistance = Math.abs(touchEndY - touchStartY);
          
          // Remove visual feedback
          this.button.classList.remove('touch-active');
          
          // Only toggle if it's a tap (not a scroll)
          if (touchDuration < 300 && touchDistance < 10) {
            e.preventDefault();
            this.toggle();
          }
        }, { passive: false });

        this.button.addEventListener('touchcancel', () => {
          this.button.classList.remove('touch-active');
        }, { passive: true });
      }

      // Click handling for desktop
      this.button.addEventListener('click', (e) => {
        if (!supportsTouch) {
          e.preventDefault();
          this.toggle();
        }
      });

      // Keyboard accessibility
      this.button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle();
        }
      });

      // Handle window resize efficiently
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          const currentWidth = window.innerWidth;
          
          // Only recalculate if width actually changed
          if (Math.abs(currentWidth - this.lastWidth) > 50) {
            this.lastWidth = currentWidth;
            this.measureContent();
            
            // If open, adjust to new content height
            if (this.isOpen) {
              this.panel.style.height = 'auto';
              this.panel.style.maxHeight = 'none';
            }
          }
        }, 250);
      }, { passive: true });
    }

    setAriaAttributes() {
      this.button.setAttribute('aria-expanded', this.isOpen);
      this.button.setAttribute('aria-controls', this.panel.id);
      this.panel.setAttribute('aria-hidden', !this.isOpen);
      this.panel.setAttribute('role', 'region');
      this.panel.setAttribute('aria-labelledby', this.button.id);
    }

    toggle() {
      if (this.isAnimating) return;
      
      this.isOpen = !this.isOpen;
      this.isAnimating = true;
      
      // Update ARIA
      this.setAriaAttributes();
      
      // Trigger animations
      if (this.isOpen) {
        this.open();
      } else {
        this.close();
      }
    }

    open() {
      // Prepare panel for animation
      this.panel.style.display = 'block';
      this.panel.style.height = '0';
      
      // Ensure content is measured
      if (this.contentHeight === 0) {
        this.measureContent();
      }
      
      // Add will-change for animation
      this.panel.style.willChange = 'transform, opacity, max-height';
      
      // Force reflow
      void this.panel.offsetHeight;
      
      // Start spring animations
      this.scaleAnimation.setTarget(1);
      this.opacityAnimation.setTarget(1);
      this.chevronAnimation.setTarget(1);
      
      // Remove will-change after animation
      setTimeout(() => {
        if (this.panel) {
          this.panel.style.willChange = 'auto';
        }
      }, 500);
    }

    close() {
      // Add will-change for animation
      this.panel.style.willChange = 'transform, opacity, max-height';
      
      // Start spring animations
      this.scaleAnimation.setTarget(0);
      this.opacityAnimation.setTarget(0);
      this.chevronAnimation.setTarget(0);
      
      // Remove will-change after animation
      setTimeout(() => {
        if (this.panel) {
          this.panel.style.willChange = 'auto';
        }
      }, 500);
    }

    destroy() {
      // Clean up animations
      this.scaleAnimation.stop();
      this.opacityAnimation.stop();
      this.chevronAnimation.stop();
    }
  }

  // ============================================
  // PUBLIC API
  // ============================================

  // Store accordion instances
  const accordions = new Map();

  // Initialize accordion
  function initAccordion(panelId, buttonId, chevronId) {
    const panel = document.getElementById(panelId);
    const button = document.getElementById(buttonId);
    const chevron = document.getElementById(chevronId);
    
    if (!panel || !button) {
      console.warn(`Accordion elements not found: ${panelId}, ${buttonId}`);
      return;
    }
    
    // Create and store accordion instance
    const accordion = new AccordionController(panel, button, chevron);
    accordions.set(panelId, accordion);
    
    return accordion;
  }

  // Toggle accordion by ID
  function toggleAccordion(panelId) {
    const accordion = accordions.get(panelId);
    if (accordion) {
      accordion.toggle();
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  // Initialize instructions accordion
  window.initInstructionsAccordion = function() {
    const accordion = initAccordion('instructionsContent', 'instructionsButton', 'instructionsToggle');
    
    if (accordion) {
      // Also initialize commissioner accordion
      initAccordion('commissionerContent', 'commissionerButton', 'commissionerToggle');
      console.log('✨ Ultra-smooth accordion system initialized');
    }
  };

  // Public toggle functions
  window.smoothAccordionToggle = function(panel, button, chevron) {
    if (!panel || !button) return;
    
    // Get or create accordion instance
    let accordion = accordions.get(panel.id);
    if (!accordion) {
      accordion = new AccordionController(panel, button, chevron);
      accordions.set(panel.id, accordion);
    }
    
    accordion.toggle();
  };

  // Legacy support for direct function calls
  window.toggleInstructions = function() {
    toggleAccordion('instructionsContent');
  };

  window.toggleCommissionerControls = function() {
    toggleAccordion('commissionerContent');
  };

  // ============================================
  // PERFORMANCE MONITORING (Dev Only)
  // ============================================

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    function monitorFPS() {
      const now = performance.now();
      const delta = now - lastTime;
      
      if (delta >= 1000) {
        fps = Math.round((frameCount * 1000) / delta);
        frameCount = 0;
        lastTime = now;
        
        // Log if FPS drops below threshold
        if (fps < 55) {
          console.warn(`⚠️ FPS dropped to ${fps}`);
        }
      }
      
      frameCount++;
      requestAnimationFrame(monitorFPS);
    }
    
    // Start monitoring
    requestAnimationFrame(monitorFPS);
  }

})();