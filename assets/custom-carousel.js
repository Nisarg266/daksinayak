document.addEventListener('DOMContentLoaded', function () {

  document.querySelectorAll('.custom-carousel').forEach(carousel => {

    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const wrapper = carousel.querySelector('.carousel-wrapper');

    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');

    let index = 0;
    
    // Auto-Scroll Variables
    let autoPlayInterval;
    const autoPlayDelay = 4000; // 4 seconds

    // Drag vars
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;
    let animationID;

    // Prevent default image drag behavior
    carousel.querySelectorAll('img').forEach(img => {
      img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    function getSlideWidth() {
      return wrapper.offsetWidth;
    }

    function setPosition() {
      currentTranslate = -index * getSlideWidth();
      prevTranslate = currentTranslate;
      track.style.transform = `translateX(${currentTranslate}px)`;
      updateButtons();
    }

    function updateButtons() {
      prevBtn.style.opacity = index === 0 ? '0.5' : '1';
      nextBtn.style.opacity = index === slides.length - 1 ? '0.5' : '1';
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === slides.length - 1;
    }
    
    /* ------------------
       AUTO PLAY LOGIC
    ------------------ */

    function startAutoPlay() {
      stopAutoPlay(); // clear existing to avoid duplicates
      autoPlayInterval = setInterval(() => {
        if (index < slides.length - 1) {
          index++;
        } else {
          index = 0; // Loop back to start
        }
        track.style.transition = 'transform 0.4s ease';
        setPosition();
      }, autoPlayDelay);
    }

    function stopAutoPlay() {
      clearInterval(autoPlayInterval);
    }

    /* ------------------
       ARROWS
    ------------------ */

    nextBtn.addEventListener('click', () => {
      if (index < slides.length - 1) {
        index++;
        track.style.transition = 'transform 0.4s ease';
        setPosition();
        startAutoPlay(); // Restart timer on click
      }
    });

    prevBtn.addEventListener('click', () => {
      if (index > 0) {
        index--;
        track.style.transition = 'transform 0.4s ease';
        setPosition();
        startAutoPlay(); // Restart timer on click
      }
    });

    /* ------------------
       DRAG / SWIPE
    ------------------ */

    function touchStart(e) {
      stopAutoPlay(); // Pause while dragging
      track.style.transition = 'none';

      startX = getX(e);
      isDragging = true;
      
      animationID = requestAnimationFrame(animation);
      wrapper.classList.add('grabbing');
    }

    function touchMove(e) {
      if (!isDragging) return;
      
      const currentX = getX(e);
      let diff = currentX - startX; 

      if (index === 0 && diff > 0) {
        diff = diff * 0.1; 
      } 
      else if (index === slides.length - 1 && diff < 0) {
        diff = diff * 0.1;
      }
      
      currentTranslate = prevTranslate + diff;
    }

    function touchEnd() {
      cancelAnimationFrame(animationID);
      isDragging = false;
      wrapper.classList.remove('grabbing');

      const movedBy = currentTranslate - prevTranslate;

      if (movedBy < -100 && index < slides.length - 1) {
        index++;
      }

      if (movedBy > 100 && index > 0) {
        index--;
      }

      track.style.transition = 'transform 0.4s ease';
      setPosition();
      startAutoPlay(); // Resume auto play after drag
    }

    function getX(e) {
      return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    function animation() {
      track.style.transform = `translateX(${currentTranslate}px)`;
      if (isDragging) {
        requestAnimationFrame(animation);
      }
    }

    /* ------------------
       EVENTS
    ------------------ */

    // Touch
    wrapper.addEventListener('touchstart', touchStart);
    wrapper.addEventListener('touchmove', touchMove);
    wrapper.addEventListener('touchend', touchEnd);

    // Mouse Drag
    wrapper.addEventListener('mousedown', touchStart);
    wrapper.addEventListener('mousemove', touchMove);
    wrapper.addEventListener('mouseup', touchEnd);
    wrapper.addEventListener('mouseleave', touchEnd); 
    
    // Hover Pause (Pause when mouse enters carousel, resume when leaves)
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Resize
    window.addEventListener('resize', () => {
        track.style.transition = 'none';
        setPosition();
    });

    // Init
    setPosition();
    startAutoPlay(); // Start timer on load

  });

});