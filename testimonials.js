/**
 * HOTEL PASHUPATI - VERIFIED GOOGLE REVIEWS AUTO-SLIDING CAROUSEL
 * Features:
 * - One Card at a Time Auto-Sliding Engine
 * - Smooth Touch Swipe & Drag Support
 * - Pause on Mouse Hover / Resume on Leave
 * - Dot Indicator & Arrow Button Controls
 */

class TestimonialCarousel {
  constructor() {
    this.carousel = document.querySelector('.testimonial-carousel');
    if (!this.carousel) return;

    this.slides = document.querySelector('.testimonial-slides');
    this.cards = document.querySelectorAll('.testimonial-card');
    this.dotsContainer = document.querySelector('.testimonial-dots');
    this.prevBtn = document.querySelector('.testimonial-nav-btn.prev');
    this.nextBtn = document.querySelector('.testimonial-nav-btn.next');
    
    this.currentIndex = 0;
    this.isAnimating = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.autoSlideInterval = null;
    this.autoSlideDelay = 4500; // 4.5 seconds auto slide

    this.init();
  }

  init() {
    if (!this.carousel || !this.cards.length) return;

    // Dynamically create indicator dots for all 14 review slides
    if (this.dotsContainer) {
      this.dotsContainer.innerHTML = '';
      this.cards.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to review slide ${index + 1}`);
        dot.addEventListener('click', () => this.goToSlide(index));
        this.dotsContainer.appendChild(dot);
      });
      this.dots = this.dotsContainer.querySelectorAll('.dot');
    }

    // Set initial active state
    this.updateActiveState();
    
    // Start auto-slide motion engine
    this.startAutoSlide();

    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prevSlide();
        this.resetAutoSlide();
      });
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.nextSlide();
        this.resetAutoSlide();
      });
    }

    // Touch events for mobile swiping
    this.carousel.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.pauseAutoSlide();
    }, { passive: true });

    this.carousel.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].clientX;
      this.handleSwipe();
      this.resumeAutoSlide();
    }, { passive: true });

    // Pause auto-slide on mouse hover
    this.carousel.addEventListener('mouseenter', () => this.pauseAutoSlide());
    this.carousel.addEventListener('mouseleave', () => this.resumeAutoSlide());
  }

  goToSlide(index) {
    if (this.isAnimating || index < 0 || index >= this.cards.length) return;
    
    this.isAnimating = true;
    this.currentIndex = index;

    // Smooth transform slide shift
    if (this.slides) {
      this.slides.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      this.slides.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }

    this.updateActiveState();

    setTimeout(() => {
      this.isAnimating = false;
    }, 600);
  }

  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.cards.length;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
    this.goToSlide(prevIndex);
  }

  updateActiveState() {
    // Update active dot
    if (this.dots) {
      this.dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.currentIndex);
      });
    }
  }

  handleSwipe() {
    const swipeThreshold = 40;
    const swipeDistance = this.touchEndX - this.touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        this.prevSlide();
      } else {
        this.nextSlide();
      }
    }
  }

  startAutoSlide() {
    this.pauseAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoSlideDelay);
  }

  pauseAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  resumeAutoSlide() {
    if (!this.autoSlideInterval) {
      this.startAutoSlide();
    }
  }

  resetAutoSlide() {
    this.pauseAutoSlide();
    this.startAutoSlide();
  }
}

// Initialize the auto-sliding carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new TestimonialCarousel();
});
