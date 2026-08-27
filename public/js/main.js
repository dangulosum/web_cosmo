document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // NAVEGACIÓN SPA (Cambio de Vistas & Soporte Hash)
  // ==========================================================================
  const navLinks = document.querySelectorAll('.nav a');
  const views = document.querySelectorAll('.view');

  const switchView = (targetId) => {
    let targetFound = false;

    // 1. Alternar visibilidad de secciones
    views.forEach(view => {
      if (view.id === targetId) {
        view.classList.add('active-view');
        targetFound = true;
      } else {
        view.classList.remove('active-view');
      }
    });

    // En caso de un ID no válido, vuelve por defecto a "inicio"
    if (!targetFound && views.length > 0) {
      document.getElementById('inicio')?.classList.add('active-view');
      targetId = 'inicio';
    }

    // 2. Actualizar estado activo en la navegación
    navLinks.forEach(link => {
      const linkTarget = link.getAttribute('data-target');
      if (linkTarget === targetId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // 3. Resetear scroll al tope de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manejador de clics en el menú de navegación
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      
      // Actualiza la URL en el navegador sin recargar la página
      history.pushState(null, '', `#${targetId}`);
      switchView(targetId);
    });
  });

  // Escucha cambios en el historial (Botones Atrás/Adelante del navegador)
  window.addEventListener('popstate', () => {
    const hashTarget = window.location.hash.replace('#', '') || 'inicio';
    switchView(hashTarget);
  });

  // Carga inicial basada en la URL actual
  const initialHash = window.location.hash.replace('#', '') || 'inicio';
  switchView(initialHash);


  // ==========================================================================
  // LÓGICA DEL CARRUSEL DE NOTICIAS
  // ==========================================================================
  const track = document.getElementById('carouselTrack');
  
  if (track) {
    const slides = Array.from(track.children);
    const nextButton = document.getElementById('nextBtn');
    const prevButton = document.getElementById('prevBtn');
    const dotsNav = document.getElementById('carouselNav');
    const dots = dotsNav ? Array.from(dotsNav.children) : [];

    let currentIndex = 0;

    const moveToSlide = (index) => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('current-slide', i === index));
      currentIndex = index;
    };

    nextButton?.addEventListener('click', () => {
      const nextIndex = (currentIndex + 1) % slides.length;
      moveToSlide(nextIndex);
    });

    prevButton?.addEventListener('click', () => {
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      moveToSlide(prevIndex);
    });

    dotsNav?.addEventListener('click', (e) => {
      const targetDot = e.target.closest('button');
      if (!targetDot) return;
      
      const targetIndex = dots.indexOf(targetDot);
      if (targetIndex !== -1) moveToSlide(targetIndex);
    });
  }


  // ==========================================================================
  // FORMULARIO DE CONTACTO
  // ==========================================================================
  const contactContainer = document.querySelector('.form_contact');

  if (contactContainer) {
    // Si la estructura HTML no usa <form>, interceptamos el botón directamente
    const submitBtn = contactContainer.querySelector('.btn_submit_contact');
    const inputs = contactContainer.querySelectorAll('input');

    submitBtn?.addEventListener('click', (e) => {
      e.preventDefault();

      let isFormValid = true;

      // Validación simple de campos vacíos
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isFormValid = false;
          input.style.borderColor = '#ef4444'; // Borde rojo si está vacío
        } else {
          input.style.borderColor = '#4b5563';
        }
      });

      if (!isFormValid) {
        alert('Por favor, completa todos los campos del formulario.');
        return;
      }

      // Mensaje de éxito y reseteo
      alert('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.');
      inputs.forEach(input => input.value = '');
    });
  }

});

// ==========================================================================
// PAGINACIÓN DE PROYECTOS
// ==========================================================================
const projectsContainer = document.querySelector('.projects-list');

if (projectsContainer) {
  const cards = Array.from(projectsContainer.querySelectorAll('.project-card'));
  const itemsPerPage = 3; // Modifica a 5 según tu preferencia
  let currentPage = 1;
  const totalPages = Math.ceil(cards.length / itemsPerPage);

  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');
  const numbersContainer = document.getElementById('paginationNumbers');

  const displayPage = (page) => {
    currentPage = page;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    // Mostrar solo las tarjetas de la página actual
    cards.forEach((card, index) => {
      card.style.display = (index >= start && index < end) ? 'grid' : 'none';
    });

    // Actualizar estado de botones Anterior / Siguiente
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;

    // Renderizar números de página
    renderPageNumbers();
  };

  const renderPageNumbers = () => {
    if (!numbersContainer) return;
    numbersContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.classList.add('pagination-number');
      if (i === currentPage) btn.classList.add('active');
      btn.textContent = i;
      btn.addEventListener('click', () => {
        displayPage(i);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      numbersContainer.appendChild(btn);
    }
  };

  prevBtn?.addEventListener('click', () => {
    if (currentPage > 1) {
      displayPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  nextBtn?.addEventListener('click', () => {
    if (currentPage < totalPages) {
      displayPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Inicializar primera página
  displayPage(1);
}