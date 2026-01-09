/* GCA Networks - main.js (vanilla) */

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);

  // ---------- Mobile nav ----------
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    // Cerrar al click en un link (móvil)
    navLinks.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      if (navLinks.classList.contains("is-open")) {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ---------- Swiper init (si existe) ----------
  // Inicializa cada .swiper con sus controles internos, sin chocar entre secciones.
  if (window.Swiper) {
    document.querySelectorAll(".swiper").forEach((el) => {
      const next = el.querySelector(".swiper-button-next");
      const prev = el.querySelector(".swiper-button-prev");
      const pag = el.querySelector(".swiper-pagination");

      // Si no tiene wrapper, no hacemos nada
      if (!el.querySelector(".swiper-wrapper")) return;

      // eslint-disable-next-line no-new
      new Swiper(el, {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        pagination: { el: pag, clickable: true },
        navigation: { nextEl: next, prevEl: prev },
        breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
      });
    });
  }

  // ---------- Contact form ----------
  const form = $("#contact-form");
  const statusEl = $("#form-status");
  const submitBtn = $("#btn-submit");

  function setStatus(type, msg) {
    if (!statusEl) return;
    statusEl.className = "form-status" + (type ? ` ${type}` : "");
    statusEl.textContent = msg || "";
  }

  // Sanitiza básico (recorta, quita control chars)
  function clean(str, max = 4000) {
    return String(str ?? "")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .trim()
      .slice(0, max);
  }

  function isValidEmail(email) {
    // Simple y suficiente para frontend
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function isValidPhone(phone) {
    // Permite +, espacios, guiones; mínimo 7 dígitos
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      setStatus("", "");

      const nombre = clean($("#nombre")?.value, 120);
      const negocio = clean($("#negocio-form")?.value, 160);
      const email = clean($("#email")?.value, 160).toLowerCase();
      const telefono = clean($("#telefono")?.value, 40);
      const mensaje = clean($("#mensaje")?.value, 2000);
      const website = clean($("#website")?.value, 120); // honeypot

      // Validación
      if (!nombre || !negocio || !email || !telefono) {
        setStatus("err", "Completa los campos obligatorios (nombre, negocio, email y teléfono).");
        return;
      }
      if (!isValidEmail(email)) {
        setStatus("err", "Revisa tu correo: parece inválido.");
        return;
      }
      if (!isValidPhone(telefono)) {
        setStatus("err", "Revisa tu teléfono: debe tener al menos 7 dígitos.");
        return;
      }

      const payload = { nombre, negocio, email, telefono, mensaje, website };

      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Enviando...";
        }

        const res = await fetch("/api/contacto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.ok) {
          const msg = data?.error || "No se pudo enviar. Intenta de nuevo en un momento.";
          setStatus("err", msg);
          return;
        }

        setStatus("ok", "Listo ✅ Te contactamos en breve.");
        form.reset();
      } catch (err) {
        console.error("contact error:", err);
        setStatus("err", "Error de conexión. Revisa tu internet e inténtalo de nuevo.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Enviar mi información";
        }
      }
    });
  }
})();
