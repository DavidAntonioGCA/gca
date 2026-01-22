document.addEventListener('DOMContentLoaded', () => {
  // Toggle de navegación para móviles
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', (!expanded).toString());
      navLinks.classList.toggle('is-open');
    });
  }

  // Inicializar Swiper solo si existe en la página
  if (typeof Swiper !== 'undefined') {
    const swiperEl = document.querySelector('.swiper');
    if (swiperEl) {
      // eslint-disable-next-line no-undef
      new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        },
      });
    }
  }

  // Manejador de envío de formulario de contacto (sección contacto en index)
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const statusEl = document.getElementById('form-status');
      // Validación básica de campos obligatorios
      const requiredFields = ['nombre', 'negocio', 'email', 'telefono'];
      let valid = true;
      requiredFields.forEach((name) => {
        const input = form.querySelector(`[name="${name}"]`);
        if (!input || !input.value.trim()) {
          valid = false;
        }
      });
      if (!valid) {
        statusEl.textContent = 'Por favor, completa los campos obligatorios.';
        statusEl.style.color = 'red';
        return;
      }
      statusEl.textContent = 'Enviando...';
      statusEl.style.color = '';
      try {
        const API_URL = form.getAttribute('action') || 'https://gcanetworks.com/api/contacto';
        const formData = new FormData(form);
        const response = await fetch(API_URL, {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          form.reset();
          statusEl.textContent = '¡Gracias! Pronto nos pondremos en contacto.';
          statusEl.style.color = '';
        } else {
          const errorMsg = await response.text();
          statusEl.textContent = 'Hubo un error al enviar. Por favor, intenta más tarde.';
          statusEl.style.color = 'red';
          console.error('Error al enviar el formulario:', errorMsg);
        }
      } catch (err) {
        statusEl.textContent = 'Hubo un error al enviar. Por favor, intenta más tarde.';
        statusEl.style.color = 'red';
        console.error(err);
      }
    });
  }
  
  // Funcionalidad del modal "Cotizar"
  const cotizarModal = document.getElementById('cotizar-modal');
  const cotizarFormEl = document.getElementById('cotizar-form');
  if (cotizarModal && cotizarFormEl) {
    const cotizarButtons = document.querySelectorAll('.cotizar-btn');
    const closeBtn = cotizarModal.querySelector('.modal-close');
    const overlay = cotizarModal.querySelector('.modal-overlay');
    let lastFocusedElement;

    const openCotizarModal = (name, price) => {
      // Guardar el elemento activo para devolver el foco al cerrar
      lastFocusedElement = document.activeElement;
      // Actualizar título y campo oculto con paquete seleccionado
      const titleEl = document.getElementById('cotizar-title');
      const packageField = cotizarFormEl.querySelector('[name="paquete"]');
      if (titleEl) {
        titleEl.textContent = `Cotizar ${name} - ${price}`;
      }
      if (packageField) {
        packageField.value = `${name} - ${price}`;
      }
      // Mostrar modal
      cotizarModal.classList.add('open');
      cotizarModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Deshabilitar scroll de fondo
      // Enfocar el primer campo del formulario (Nombre)
      const nameInput = document.getElementById('cotizar-nombre');
      if (nameInput) nameInput.focus();
      // Limpiar mensaje de estado previo (si lo hubiera)
      const statusEl = document.getElementById('cotizar-status');
      if (statusEl) statusEl.textContent = '';
    };

    const closeCotizarModal = () => {
      cotizarModal.classList.remove('open');
      cotizarModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocusedElement) lastFocusedElement.focus(); // Devolver foco al botón que abrió
    };

    // Asignar evento de click a todos los botones "Cotizar"
    cotizarButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.card');
        if (card) {
          // Obtener nombre del paquete y precio desde la tarjeta
          const packName = card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : '';
          const priceText = card.querySelector('p strong') ? card.querySelector('p strong').textContent.trim() : '';
          openCotizarModal(packName, priceText);
        }
      });
    });

    // Eventos para cerrar el modal (clic en "X" o en el overlay)
    if (closeBtn) {
      closeBtn.addEventListener('click', closeCotizarModal);
    }
    if (overlay) {
      overlay.addEventListener('click', closeCotizarModal);
    }
    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && cotizarModal.classList.contains('open')) {
        closeCotizarModal();
      }
    });

    // Manejador de envío del formulario de cotización
    cotizarFormEl.addEventListener('submit', async (e) => {
      e.preventDefault();
      const statusEl = document.getElementById('cotizar-status');
      // Validación de campos requeridos (nombre, email, teléfono)
      const requiredFields = ['nombre', 'email', 'telefono'];
      let valid = true;
      requiredFields.forEach((name) => {
        const input = cotizarFormEl.querySelector(`[name="${name}"]`);
        if (!input || !input.value.trim()) {
          valid = false;
        }
      });
      if (!valid) {
        if (statusEl) {
          statusEl.textContent = 'Por favor, completa los campos obligatorios.';
          statusEl.style.color = 'red';
        }
        return;
      }
      if (statusEl) {
        statusEl.textContent = 'Enviando...';
        statusEl.style.color = '';
      }
      try {
        const API_URL = cotizarFormEl.getAttribute('action') || 'https://gcanetworks.com/api/contacto';
        const formData = new FormData(cotizarFormEl);
        const response = await fetch(API_URL, {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          cotizarFormEl.reset();
          if (statusEl) {
            statusEl.textContent = '¡Gracias! Pronto nos pondremos en contacto.';
            statusEl.style.color = '';
          }
        } else {
          const errorMsg = await response.text();
          if (statusEl) {
            statusEl.textContent = 'Hubo un error al enviar. Por favor, intenta más tarde.';
            statusEl.style.color = 'red';
          }
          console.error('Error al enviar el formulario:', errorMsg);
        }
      } catch (err) {
        if (statusEl) {
          statusEl.textContent = 'Hubo un error al enviar. Por favor, intenta más tarde.';
          statusEl.style.color = 'red';
        }
        console.error(err);
      }
    });
  }
});
