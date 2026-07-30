document.addEventListener('DOMContentLoaded', function() {
  // Create refraction overlay
  const refractionOverlay = document.createElement('div');
  refractionOverlay.className = 'refraction-overlay';
  document.body.appendChild(refractionOverlay);

  // Create multiple light spots for the effect
  for (let i = 0; i < 5; i++) {
    const lightSpot = document.createElement('div');
    lightSpot.className = 'light-spot';
    lightSpot.style.setProperty('--size', `${Math.random() * 100 + 50}px`);
    lightSpot.style.setProperty('--x', `${Math.random() * 100}%`);
    lightSpot.style.setProperty('--y', `${Math.random() * 100}%`);
    lightSpot.style.setProperty('--opacity', Math.random() * 0.2 + 0.1);
    lightSpot.style.animation = `float ${Math.random() * 10 + 10}s infinite ease-in-out ${Math.random() * 5}s`;
    refractionOverlay.appendChild(lightSpot);
  }

  // Update light positions based on mouse movement
  document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    // Update CSS variables for light position
    document.documentElement.style.setProperty('--mouse-x', x);
    document.documentElement.style.setProperty('--mouse-y', y);
    
    // Create ripple effect on mouse move
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    refractionOverlay.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 1000);
  });
});
