document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // NAVEGACIÓN SPA (Cambio de Vistas)
  // ==========================================================================
  const navLinks = document.querySelectorAll('.nav a');
  const views = document.querySelectorAll('.view');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('data-target');

      // 1. Ocultar todas las vistas
      views.forEach(view => view.classList.remove('active-view'));

      // 2. Mostrar solo la vista seleccionada
      const targetView = document.getElementById(targetId);
      if (targetView) {
        targetView.classList.add('active-view');
      }

      // 3. Cambiar el indicador visual del menú superior
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // ==========================================================================
  // LÓGICA DEL CARRUSEL DE NOTICIAS
  // ==========================================================================
  const track = document.getElementById('carouselTrack');
  
  // Solo iniciar el carrusel si el elemento existe en el DOM
  if (track) {
    const slides = Array.from(track.children);
    const nextButton = document.getElementById('nextBtn');
    const prevButton = document.getElementById('prevBtn');
    const dotsNav = document.getElementById('carouselNav');
    const dots = Array.from(dotsNav.children);

    let currentIndex = 0;

    const moveToSlide = (index) => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('current-slide', i === index));
      currentIndex = index;
    };

    nextButton.addEventListener('click', () => {
      const nextIndex = (currentIndex + 1) % slides.length;
      moveToSlide(nextIndex);
    });

    prevButton.addEventListener('click', () => {
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      moveToSlide(prevIndex);
    });

    dotsNav.addEventListener('click', (e) => {
      const targetDot = e.target.closest('button');
      if (!targetDot) return;
      
      const targetIndex = dots.indexOf(targetDot);
      if (targetIndex !== -1) moveToSlide(targetIndex);
    });
  }
});