// Light bending and interactive effects
document.addEventListener('DOMContentLoaded', function() {
  // Add scroll-based animations
  window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
      const scrollPosition = window.scrollY;
      hero.style.transform = `translateY(${scrollPosition * 0.2}px)`;
    }
  });

  // Mouse move light effect
  document.addEventListener('mousemove', function(e) {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    // Update CSS variables for light position
    document.documentElement.style.setProperty('--mouse-x', x);
    document.documentElement.style.setProperty('--mouse-y', y);
    
    // Add light reflection to cards on mouse move
    const cards = document.querySelectorAll('.card, .hero');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardX = (e.clientX - rect.left) / rect.width;
      const cardY = (e.clientY - rect.top) / rect.height;
      
      card.style.setProperty('--card-light-x', cardX);
      card.style.setProperty('--card-light-y', cardY);
    });
  });

  // Add hover effect to all cards
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    // Add light reflection on card
    const lightReflection = document.createElement('div');
    lightReflection.className = 'light-reflection';
    card.appendChild(lightReflection);
    
    // Add subtle tilt effect
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const angleX = (y - centerY) / 20;
      const angleY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.02)`;
      
      // Update light reflection position
      lightReflection.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, transparent 70%)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      lightReflection.style.background = 'transparent';
    });
  });

  // Add subtle animation to hero section
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.transition = 'transform 0.5s ease-out';
  }
});
