// Debug helper for TailwindPlus Elements initialization
// This file helps diagnose issues with the custom web components

document.addEventListener('DOMContentLoaded', () => {
  console.log('[Debug] DOM Content Loaded');
  
  // Check if customElements API is available
  if (!window.customElements) {
    console.error('[Debug] Custom Elements API not available!');
    return;
  }
  
  // Monitor when el-select is defined
  let checkCount = 0;
  const maxChecks = 30; // 3 seconds max
  
  const checkInterval = setInterval(() => {
    checkCount++;
    
    const elSelect = customElements.get('el-select');
    const elOptions = customElements.get('el-options');
    const elOption = customElements.get('el-option');
    
    if (elSelect && elOptions && elOption) {
      console.log(`[Debug] ✅ TailwindPlus Elements ready after ${checkCount * 100}ms`);
      console.log('[Debug] Components defined:', {
        'el-select': !!elSelect,
        'el-options': !!elOptions,
        'el-option': !!elOption
      });
      clearInterval(checkInterval);
      
      // Check if our dropdown is in the DOM
      const teamSelect = document.getElementById('team-select');
      if (teamSelect) {
        console.log('[Debug] Team select element found:', teamSelect);
        console.log('[Debug] Team select tag:', teamSelect.tagName);
        console.log('[Debug] Has el-options child:', !!teamSelect.querySelector('el-options'));
      } else {
        console.warn('[Debug] Team select element not found in DOM');
      }
    } else if (checkCount >= maxChecks) {
      console.error('[Debug] ❌ TailwindPlus Elements not loaded after 3 seconds');
      console.log('[Debug] Components status:', {
        'el-select': !!elSelect,
        'el-options': !!elOptions,
        'el-option': !!elOption
      });
      clearInterval(checkInterval);
    } else {
      // Still waiting
      if (checkCount % 5 === 0) { // Log every 500ms
        console.log(`[Debug] Waiting for TailwindPlus Elements... ${checkCount * 100}ms`);
      }
    }
  }, 100);
});