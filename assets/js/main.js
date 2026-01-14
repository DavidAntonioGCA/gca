/*
  Funciones de interacción para GCA Networks

  Este script controla el menú de navegación móvil, inicializa el componente
  Swiper en la página de inicio y gestiona el envío del formulario de
  contacto. Se ejecuta una vez que el DOM está listo gracias al uso del
  atributo `defer` en la etiqueta <script>.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Toggle de navegación para móviles
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', (!expanded).toString());
      navLinks.classList.toggle('open');
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

  // Manejador de envío de formulario de contacto
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
        // Reemplaza `API_URL` con el endpoint real que utilizas para procesar el formulario.
        // Si ya tienes la acción definida en el atributo `action` del formulario, este
        // valor se tomará automáticamente; de lo contrario, puedes especificar aquí
        // la URL de tu API o servicio de terceros (p. ej. Formspree, n8n, etc.).
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
});