const API_URL = 'http://localhost:3000/api';

// ==========================================================================
// 1. PETICIONES API (Backend MySQL)
// ==========================================================================

/**
 * Carga integrantes desde MySQL y los renderiza en #equipo .team-grid
 */
async function obtenerMiembros() {
  const contenedor = document.querySelector('#equipo .team-grid');
  if (!contenedor) return;

  try {
    const respuesta = await fetch(`${API_URL}/miembros`);
    if (!respuesta.ok) throw new Error('Error al consultar miembros');

    const miembros = await respuesta.json();

    if (!Array.isArray(miembros) || miembros.length === 0) {
      contenedor.innerHTML = '<p>No hay integrantes registrados.</p>';
      return;
    }

    contenedor.innerHTML = miembros.map(m => `
      <div class="team-card">
        <img src="${m.imagen_url || 'images/equipo/usuario.png'}" alt="${m.nombre || 'Miembro'}" class="member-photo">
        <h3 class="member-name">${m.nombre || 'Sin nombre'}</h3>
        <span class="member-role">${m.rol || ''}</span>
        <p class="member-bio">${m.biografia || 'Sin biografía disponible.'}</p>
        <div class="member-socials">
          ${m.cv_lattes ? `<a href="${m.cv_lattes}" target="_blank" rel="noopener noreferrer">CV Lattes</a>` : ''}
          ${m.orcid ? `<a href="${m.orcid}" target="_blank" rel="noopener noreferrer">ORCID</a>` : ''}
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Error al obtener miembros:', error);
    contenedor.innerHTML = '<p class="error-msg">Error al cargar la información del equipo.</p>';
  }
}

/**
 * Carga proyectos desde MySQL, los renderiza y activa la paginación dinámica
 */
async function obtenerProyectos() {
  const contenedor = document.querySelector('#proyectos .projects-list');
  if (!contenedor) return;

  try {
    const respuesta = await fetch(`${API_URL}/proyectos`);
    if (!respuesta.ok) throw new Error('Error al consultar proyectos');

    const proyectos = await respuesta.json();

    if (!Array.isArray(proyectos) || proyectos.length === 0) {
      contenedor.innerHTML = '<p>No hay proyectos publicados por el momento.</p>';
      return;
    }

    // Inyección en la estructura de tarjetas HTML
    contenedor.innerHTML = proyectos.map(p => `
      <article class="project-card">
        <div class="box_art_proyectos">
          <img src="${p.imagen_url || 'images/test_article_2.png'}" alt="${p.titulo}" class="img_art_proyectos">
        </div>
        <div class="datos_proyecto">
          <div class="status_proyecto">
            <p>Estado: ${p.estado || 'Publicado'}</p>
          </div>
          <div class="title_proyecto">
            <h3>${p.titulo}</h3>
          </div>
          <div class="investigadores_proyecto">
            <p1>Investigadores:</p1>
            <p>${p.investigadores || 'Integrantes CoSMo'}</p>
          </div>
          <div class="resumen_proyecto">
            <p1>Resumen del proyecto:</p1>
            <p>${p.resumen || 'Sin resumen disponible.'}</p>
          </div>
          ${p.doi_url ? `
            <div class="doi_proyecto">
              <p1>DOI / Link: </p1><a href="${p.doi_url}" target="_blank" rel="noopener noreferrer">${p.doi_url}</a>
            </div>
          ` : ''}
        </div>  
      </article>
    `).join('');

    // Iniciar la paginación tras inyectar la data en el DOM
    inicializarPaginacionProyectos();

  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    contenedor.innerHTML = '<p class="error-msg">Error al cargar los proyectos.</p>';
  }
}

// ==========================================================================
// 2. SISTEMA DE PAGINACIÓN DE PROYECTOS
// ==========================================================================
function inicializarPaginacionProyectos() {
  const projectsContainer = document.querySelector('#proyectos .projects-list');
  if (!projectsContainer) return;

  const cards = Array.from(projectsContainer.querySelectorAll('.project-card'));
  if (cards.length === 0) return;

  const itemsPerPage = 3;
  let currentPage = 1;
  const totalPages = Math.ceil(cards.length / itemsPerPage);

  const prevBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const numbersContainer = document.getElementById('paginationNumbers');

  const displayPage = (page) => {
    currentPage = page;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    cards.forEach((card, index) => {
      card.style.display = (index >= start && index < end) ? 'grid' : 'none';
    });

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;

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

  // Clonar botones para evitar listener duplicados al re-ejecutar el fetch
  if (prevBtn) {
    const newPrev = prevBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrev, prevBtn);
    newPrev.addEventListener('click', () => {
      if (currentPage > 1) displayPage(currentPage - 1);
    });
  }

  if (nextPageBtn) {
    const newNext = nextPageBtn.cloneNode(true);
    nextPageBtn.parentNode.replaceChild(newNext, nextPageBtn);
    newNext.addEventListener('click', () => {
      if (currentPage < totalPages) displayPage(currentPage + 1);
    });
  }

  displayPage(1);
}

// ==========================================================================
// 3. EVENTOS Y NAVEGACIÓN DE LA SPA
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {

  // NAVEGACIÓN SPA
  const navLinks = document.querySelectorAll('.nav a');
  const views = document.querySelectorAll('.view');

  const switchView = (targetId) => {
    let targetFound = false;

    views.forEach(view => {
      if (view.id === targetId) {
        view.classList.add('active-view');
        targetFound = true;
      } else {
        view.classList.remove('active-view');
      }
    });

    if (!targetFound && views.length > 0) {
      document.getElementById('inicio')?.classList.add('active-view');
      targetId = 'inicio';
    }

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-target') === targetId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      history.pushState(null, '', `#${targetId}`);
      switchView(targetId);
    });
  });

  window.addEventListener('popstate', () => {
    const hashTarget = window.location.hash.replace('#', '') || 'inicio';
    switchView(hashTarget);
  });

  const initialHash = window.location.hash.replace('#', '') || 'inicio';
  switchView(initialHash);

  // CARRUSEL
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

    nextButton?.addEventListener('click', () => moveToSlide((currentIndex + 1) % slides.length));
    prevButton?.addEventListener('click', () => moveToSlide((currentIndex - 1 + slides.length) % slides.length));

    dotsNav?.addEventListener('click', (e) => {
      const targetDot = e.target.closest('button');
      if (!targetDot) return;
      const targetIndex = dots.indexOf(targetDot);
      if (targetIndex !== -1) moveToSlide(targetIndex);
    });
  }

  // FORMULARIO DE CONTACTO
  const contactContainer = document.querySelector('.form_contact');
  if (contactContainer) {
    const submitBtn = contactContainer.querySelector('.btn_submit_contact');
    const inputs = contactContainer.querySelectorAll('input');

    submitBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      let isFormValid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isFormValid = false;
          input.style.borderColor = '#ef4444';
        } else {
          input.style.borderColor = '#4b5563';
        }
      });

      if (!isFormValid) {
        alert('Por favor, completa todos los campos del formulario.');
        return;
      }

      alert('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.');
      inputs.forEach(input => input.value = '');
    });
  }

  // CARGA INICIAL DE DATOS DESDE LA BD
  obtenerMiembros();
  obtenerProyectos();
});