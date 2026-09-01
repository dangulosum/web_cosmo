const API_URL = 'http://localhost:3000/api';

// ==========================================================================
// 1. PETICIONES API (Backend MySQL)
// ==========================================================================

/**
 * Carga integrantes desde MySQL y los renderiza en #equipo .team-grid
 */

// LÓGICA MENÚ HAMBURGUESA
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    // Abrir / Cerrar el menú al pulsar el ícono sandwich
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('nav-open');
    });

    // Cerrar el menú automáticamente al hacer clic en un enlace
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('nav-open');
      });
    });
  }

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

/**
 * Carga Áreas de Investigación desde MySQL
 */
async function cargarAreasPesquisa() {
  const container = document.querySelector('.grid-areas');
  if (!container) return;

  try {
    const response = await fetch(`${API_URL}/areas`);
    if (!response.ok) throw new Error('Error al consultar áreas');

    const areas = await response.json();

    container.innerHTML = '';

    if (!Array.isArray(areas) || areas.length === 0) {
      container.innerHTML = '<p>No hay áreas de investigación disponibles en este momento.</p>';
      return;
    }

    areas.forEach(area => {
      const rutaImagen = area.img_area.startsWith('http') || area.img_area.startsWith('images/')
        ? area.img_area
        : `images/${area.img_area}`;

      const card = document.createElement('div');
      card.className = 'area-card';

      card.innerHTML = `
        <div class="area-icon">
          <img src="${rutaImagen}" alt="${area.area_pesquisa}">
        </div>
        <h3>${area.area_pesquisa}</h3>
        <p>${area.description_area || 'Sin descripción disponible.'}</p>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error cargando las áreas de investigación:', error);
  }
}

async function obtenerProyectoDestacado() {
  const contImg = document.getElementById('destacado-img');
  const contTitulo = document.getElementById('destacado-titulo');
  const contAutores = document.getElementById('destacado-autores');
  const contIndexacion = document.getElementById('destacado-indexacion');
  const contResumen = document.getElementById('destacado-resumen');
  const btnVer = document.getElementById('btn-ver-destacado');

  if (!contTitulo) return;

  try {
    const respuesta = await fetch(`${API_URL}/proyectos`);
    if (!respuesta.ok) throw new Error('Error al consultar proyectos para el destacado');

    const proyectos = await respuesta.json();

    if (!Array.isArray(proyectos) || proyectos.length === 0) return;

    // 1. Obtener el índice dentro del array completo para calcular su página
    const indiceDestacado = proyectos.findIndex(p => p.destacado === 1 || p.destacado === "1" || p.destacado === true);

    if (indiceDestacado !== -1) {
      const destacado = proyectos[indiceDestacado];

      // 2. Rellenar los datos en la interfaz
      if (contImg) contImg.src = destacado.imagen_url || destacado.imagen || 'images/test_article_2.png';
      contTitulo.textContent = destacado.titulo || 'Sin título';
      if (contAutores) contAutores.textContent = `Autores: ${destacado.investigadores || destacado.autores || 'N/A'}`;
      if (contIndexacion) contIndexacion.textContent = destacado.index_impacto || 'N/A';
      if (contResumen) contResumen.textContent = destacado.resumen || 'Sin resumen disponible.';

      // 3. Calcular la página donde está ubicado (asumiendo 3 ítems por página)
      const itemsPerPage = 3;
      const paginaObjetivo = Math.floor(indiceDestacado / itemsPerPage) + 1;

      // 4. Redirección precisa al hacer clic
      if (btnVer) {
        btnVer.onclick = () => {
          // Cambiar a la vista de Proyectos mediante la navegación SPA
          const proyectosLink = document.querySelector('.nav a[data-target="proyectos"]');
          if (proyectosLink) proyectosLink.click();

          // Esperar un breve instante a que la vista Proyectos cargue los botones de la paginación
          setTimeout(() => {
            const botonesPagina = document.querySelectorAll('#paginationNumbers .pagination-number');
            
            // Buscar el botón numérico correspondiente y simular el clic
            botonesPagina.forEach(btn => {
              if (parseInt(btn.textContent.trim()) === paginaObjetivo) {
                btn.click();
              }
            });
          }, 50);
        };
      }
    } else {
      console.warn('No se encontró ningún proyecto con destacado = 1');
    }
  } catch (error) {
    console.error('Error al cargar la publicación destacada:', error);
  }
}

// ==========================================================================
// 2. SISTEMA DE PAGINACIÓN DE PROYECTOS (CORREGIDO)
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

    // Búsqueda en el DOM al momento de actualizar el estado de los botones
    const activePrevBtn = document.getElementById('prevPageBtn');
    const activeNextBtn = document.getElementById('nextPageBtn');

    if (activePrevBtn) activePrevBtn.disabled = currentPage === 1;
    if (activeNextBtn) activeNextBtn.disabled = currentPage === totalPages || totalPages === 0;

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

  // Asignación limpia de listeners reemplazando nodos sin romper referencias
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
    let autoplayTimer = null;
    const INTERVALO_TIEMPO = 4000;

    const moveToSlide = (index) => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('current-slide', i === index));
      currentIndex = index;
    };

    const nextSlide = () => {
      const nextIndex = (currentIndex + 1) % slides.length;
      moveToSlide(nextIndex);
    };

    const prevSlide = () => {
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      moveToSlide(prevIndex);
    };

    const startAutoplay = () => {
      if (!autoplayTimer) {
        autoplayTimer = setInterval(nextSlide, INTERVALO_TIEMPO);
      }
    };

    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    nextButton?.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });

    prevButton?.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });

    dotsNav?.addEventListener('click', (e) => {
      const targetDot = e.target.closest('button');
      if (!targetDot) return;
      const targetIndex = dots.indexOf(targetDot);
      if (targetIndex !== -1) {
        moveToSlide(targetIndex);
        resetAutoplay();
      }
    });

    const carouselContainer = track.parentElement;
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', stopAutoplay);
      carouselContainer.addEventListener('mouseleave', startAutoplay);
    }

    startAutoplay();
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

  // CARGA INICIAL DE DATOS
  obtenerMiembros();
  obtenerProyectos();
  cargarAreasPesquisa();
  obtenerProyectoDestacado();
});