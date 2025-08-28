(function() {
  'use strict';

  const MD_BREAKPOINT = 768;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => window.innerWidth < MD_BREAKPOINT;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }
  
  function getAnimationDuration(h) {
    // Enhanced duration calculation - faster on mobile for better UX
    const baseTime = isMobile() ? 160 : 180;
    const multiplier = isMobile() ? 0.25 : 0.35;
    const maxTime = isMobile() ? 350 : 420;
    return clamp(baseTime + h * multiplier, 220, maxTime);
  }

  function ensurePanelBaseStyles(panel) {
    panel.style.overflow = 'hidden';
    panel.style.willChange = 'height, opacity, transform';
    panel.style.transform = 'translateZ(0)';
    panel.style.contain = 'layout style paint';
    panel.style.backfaceVisibility = 'hidden';
  }

  function resetPanelStyles(panel) {
    panel.style.height = '';
    panel.style.overflow = '';
    panel.style.willChange = '';
    panel.style.transform = '';
    panel.style.contain = '';
    panel.style.backfaceVisibility = '';
    panel.style.opacity = '';
  }

  function setAria(button, panel, open) {
    if (button) {
      button.setAttribute('aria-expanded', String(open));
      // Enhanced mobile accessibility - dynamic labels based on button content
      const buttonText = button.querySelector('span') ? button.querySelector('span').textContent : 'section';
      button.setAttribute('aria-label',
        open ? `Collapse ${buttonText}` : `Expand ${buttonText}`
      );
    }
    if (panel) {
      panel.dataset.open = open ? 'true' : 'false';
      panel.setAttribute('aria-hidden', String(!open));
    }
  }

  function enhancedChevronRotation(chevron, open) {
    if (!chevron) return;
    
    // Remove existing rotation classes
    chevron.classList.remove('rotate-0', 'rotate-180');
    
    // Add smooth rotation with better mobile performance
    if (open) {
      chevron.style.transform = 'rotate(180deg)';
      chevron.classList.add('rotate-180');
    } else {
      chevron.style.transform = 'rotate(0deg)';
      chevron.classList.add('rotate-0');
    }
  }

  function addButtonFeedback(button, isExpanding) {
    if (!button) return;
    
    // Enhanced visual feedback for mobile
    if (isExpanding) {
      button.classList.add('bg-slate-100/70');
    } else {
      button.classList.remove('bg-slate-100/70');
    }
  }

  async function expand(panel, button) {
    ensurePanelBaseStyles(panel);
    const endHeight = panel.scrollHeight;
    const duration = getAnimationDuration(endHeight);

    addButtonFeedback(button, true);

    if (prefersReduced) {
      panel.style.height = 'auto';
      panel.style.opacity = '1';
      return;
    }

    // Enhanced animation keyframes with opacity and slight scale for mobile
    const keyframes = isMobile() ? [
      {
        height: '0px',
        opacity: '0',
        transform: 'translateZ(0) scaleY(0.95)'
      },
      {
        height: endHeight + 'px',
        opacity: '1',
        transform: 'translateZ(0) scaleY(1)'
      }
    ] : [
      { height: '0px', opacity: '0' },
      { height: endHeight + 'px', opacity: '1' }
    ];

    panel.style.height = '0px';
    panel.style.opacity = '0';
    if (isMobile()) panel.style.transform = 'translateZ(0) scaleY(0.95)';
    void panel.offsetHeight; // reflow

    const anim = panel.animate(keyframes, {
      duration,
      easing: isMobile() ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards'
    });
    
    panel._accAnim = anim;

    try {
      await anim.finished;
      panel.style.height = 'auto';
      panel.style.opacity = '1';
      if (isMobile()) panel.style.transform = 'translateZ(0) scaleY(1)';
    } catch {
      /* canceled */
    }

    panel._accAnim = null;
  }

  async function collapse(panel, button) {
    ensurePanelBaseStyles(panel);
    const startHeight = panel.offsetHeight || panel.scrollHeight;
    const duration = getAnimationDuration(startHeight);

    addButtonFeedback(button, false);

    if (prefersReduced) {
      panel.style.height = '0px';
      panel.style.opacity = '0';
      return;
    }

    // Enhanced animation keyframes with opacity and slight scale for mobile
    const keyframes = isMobile() ? [
      {
        height: startHeight + 'px',
        opacity: '1',
        transform: 'translateZ(0) scaleY(1)'
      },
      {
        height: '0px',
        opacity: '0',
        transform: 'translateZ(0) scaleY(0.95)'
      }
    ] : [
      { height: startHeight + 'px', opacity: '1' },
      { height: '0px', opacity: '0' }
    ];

    panel.style.height = startHeight + 'px';
    panel.style.opacity = '1';
    if (isMobile()) panel.style.transform = 'translateZ(0) scaleY(1)';
    void panel.offsetHeight; // reflow

    const anim = panel.animate(keyframes, {
      duration,
      easing: isMobile() ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards'
    });
    
    panel._accAnim = anim;

    try {
      await anim.finished;
      panel.style.height = '0px';
      panel.style.opacity = '0';
      if (isMobile()) panel.style.transform = 'translateZ(0) scaleY(0.95)';
    } catch {
      /* canceled */
    }

    panel._accAnim = null;
  }

  // Enhanced mobile touch handling
  function addTouchFeedback(button) {
    if (!isTouch || !button) return;

    let touchTimeout;
    
    button.addEventListener('touchstart', () => {
      button.classList.add('scale-[0.98]', 'bg-slate-100/50');
      clearTimeout(touchTimeout);
    }, { passive: true });

    button.addEventListener('touchend', () => {
      touchTimeout = setTimeout(() => {
        button.classList.remove('scale-[0.98]', 'bg-slate-100/50');
      }, 150);
    }, { passive: true });

    button.addEventListener('touchcancel', () => {
      button.classList.remove('scale-[0.98]', 'bg-slate-100/50');
      clearTimeout(touchTimeout);
    }, { passive: true });
  }

  // Public: called by toggleInstructions()
  window.smoothAccordionToggle = async function(panel, button, chevron) {
    if (!panel) return;

    // Prevent double-clicks on mobile
    if (panel._isAnimating) return;
    panel._isAnimating = true;

    if (panel._accAnim) {
      try { panel._accAnim.cancel(); } catch {}
      panel._accAnim = null;
    }

    const isOpen = panel.dataset.open === 'true';
    
    // Enhanced haptic feedback on mobile
    if (isTouch && 'vibrate' in navigator) {
      navigator.vibrate(10); // Subtle haptic feedback
    }

    if (isOpen) {
      setAria(button, panel, false);
      enhancedChevronRotation(chevron, false);
      await collapse(panel, button);
    } else {
      setAria(button, panel, true);
      enhancedChevronRotation(chevron, true);
      await expand(panel, button);
    }

    panel._isAnimating = false;
  };

  // Public: initialize on page load
  window.initInstructionsAccordion = function() {
    const panel = document.getElementById('instructionsContent');
    const button = document.getElementById('instructionsButton');
    const chevron = document.getElementById('instructionsToggle');
    if (!panel || !button) return;

    // Enhanced initialization
    setAria(button, panel, false);
    enhancedChevronRotation(chevron, false);
    ensurePanelBaseStyles(panel);
    panel.style.height = '0px';
    panel.style.opacity = '0';
    panel.dataset._initialized = 'true';
    panel._isAnimating = false;

    // Add touch feedback for mobile
    addTouchFeedback(button);

    // Enhanced keyboard navigation
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleInstructions();
      }
    });

    // Initialize commissioner controls accordion as well
    initCommissionerAccordion();

    // Responsive behavior - adjust animations on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Handle instructions panel
        if (panel._accAnim) {
          panel._accAnim.cancel();
          panel._accAnim = null;
        }
        // Re-calculate height if open
        if (panel.dataset.open === 'true') {
          panel.style.height = 'auto';
        }
        
        // Also handle commissioner panel
        const commissionerPanel = document.getElementById('commissionerContent');
        if (commissionerPanel && commissionerPanel._accAnim) {
          commissionerPanel._accAnim.cancel();
          commissionerPanel._accAnim = null;
        }
        if (commissionerPanel && commissionerPanel.dataset.open === 'true') {
          commissionerPanel.style.height = 'auto';
        }
      }, 150);
    }, { passive: true });

    console.log('✨ Enhanced Instructions Accordion initialized with mobile optimizations');
  };

  // Initialize commissioner controls accordion
  function initCommissionerAccordion() {
    const panel = document.getElementById('commissionerContent');
    const button = document.getElementById('commissionerButton');
    const chevron = document.getElementById('commissionerToggle');
    if (!panel || !button) return;

    // Enhanced initialization
    setAria(button, panel, false);
    enhancedChevronRotation(chevron, false);
    ensurePanelBaseStyles(panel);
    panel.style.height = '0px';
    panel.style.opacity = '0';
    panel.dataset._initialized = 'true';
    panel._isAnimating = false;

    // Add touch feedback for mobile
    addTouchFeedback(button);

    // Enhanced keyboard navigation
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCommissionerControls();
      }
    });

    console.log('✨ Enhanced Commissioner Accordion initialized');
  }

})();