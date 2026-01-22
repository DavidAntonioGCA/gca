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
  forcePhone10Digits(document.getElementById('telefono'));
forcePhone10Digits(document.getElementById('cotizar-telefono'));


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
const API_DEFAULT = 'https://gcanetworks.com/api/contacto';
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
const validatePhone10 = (phone) => /^\d{10}$/.test(phone);

const forcePhone10Digits = (inputEl) => {
  if (!inputEl) return;
  inputEl.addEventListener('input', () => {
    inputEl.value = inputEl.value.replace(/\D/g, '').slice(0, 10);
  });
};

// esto muestra mensajes bonitos (rojo/verde)
const setStatus = (el, msg, ok) => {
  if (!el) return;
  el.textContent = msg;
  el.style.color = ok ? '' : 'red';
};


  // Manejador de envío de formulario de contacto (sección contacto en index)
  const form = document.getElementById('contact-form');
  if (form) {
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const statusEl = document.getElementById('form-status');

  const nombre = form.querySelector('[name="nombre"]')?.value.trim();
  const negocio = form.querySelector('[name="negocio"]')?.value.trim();
  const email = form.querySelector('[name="email"]')?.value.trim();
  const telefono = form.querySelector('[name="telefono"]')?.value.trim();

  if (!nombre || !negocio || !email || !telefono) {
    setStatus(statusEl, 'Por favor, completa los campos obligatorios.', false);
    return;
  }
  if (!validateEmail(email)) {
    setStatus(statusEl, 'Correo no válido.', false);
    return;
  }
  if (!validatePhone10(telefono)) {
    setStatus(statusEl, 'El teléfono debe tener exactamente 10 dígitos (solo números).', false);
    return;
  }

  setStatus(statusEl, 'Enviando...', true);

  try {
    const API_URL = form.getAttribute('action') || API_DEFAULT;
    const formData = new FormData(form);

    const response = await fetch(API_URL, { method: 'POST', body: formData });
    const data = await response.json().catch(() => null);

    if (response.ok && data?.ok) {
      form.reset();
      setStatus(statusEl, data.message || '✅ Enviado correctamente.', true);
    } else {
      setStatus(statusEl, data?.message || 'Hubo un problema. Intenta más tarde.', false);
      console.error('Error:', data);
    }
  } catch (err) {
    setStatus(statusEl, 'Hubo un problema. Intenta más tarde.', false);
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

  const nombre = cotizarFormEl.querySelector('[name="nombre"]')?.value.trim();
  const email = cotizarFormEl.querySelector('[name="email"]')?.value.trim();
  const telefono = cotizarFormEl.querySelector('[name="telefono"]')?.value.trim();

  if (!nombre || !email || !telefono) {
    setStatus(statusEl, 'Por favor, completa los campos obligatorios.', false);
    return;
  }
  if (!validateEmail(email)) {
    setStatus(statusEl, 'Correo no válido.', false);
    return;
  }
  if (!validatePhone10(telefono)) {
    setStatus(statusEl, 'El teléfono debe tener exactamente 10 dígitos.', false);
    return;
  }

  setStatus(statusEl, 'Enviando...', true);

  try {
    const API_URL = cotizarFormEl.getAttribute('action') || API_DEFAULT;
    const formData = new FormData(cotizarFormEl);

    const response = await fetch(API_URL, { method: 'POST', body: formData });
    const data = await response.json().catch(() => null);

    if (response.ok && data?.ok) {
      cotizarFormEl.reset();
      setStatus(statusEl, data.message || '✅ Enviado correctamente.', true);
    } else {
      setStatus(statusEl, data?.message || 'Hubo un problema. Intenta más tarde.', false);
      console.error('Error:', data);
    }
  } catch (err) {
    setStatus(statusEl, 'Hubo un problema. Intenta más tarde.', false);
    console.error(err);
  }
});

  }
});
