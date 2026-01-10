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
  } else {
    // Si quieres debug rápido:
    // console.warn("Swiper no está cargado (window.Swiper undefined).");
  }

  // ---------- Contact form ----------
  const form = $("#contact-form");
  const statusEl = $("#form-status"); // opcional
  const submitBtn = form ? form.querySelector(".btn-submit") : null; // tu HTML usa class

  function setStatus(type, msg) {
    if (!statusEl) return; // si no existe, no hacemos nada
    statusEl.className = "form-status" + (type ? ` ${type}` : "");
    statusEl.textContent = msg || "";
  }

  function clean(str, max = 4000) {
    return String(str ?? "")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .trim()
      .slice(0, max);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function isValidPhone(phone) {
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

      // honeypot opcional
      const website = clean($("#website")?.value, 120);

      if (!nombre || !negocio || !email || !telefono) {
        setStatus("err", "Completa los campos obligatorios (nombre, negocio, email y teléfono).");
        alert("Completa los campos obligatorios (nombre, negocio, email y teléfono).");
        return;
      }
      if (!isValidEmail(email)) {
        setStatus("err", "Revisa tu correo: parece inválido.");
        alert("Revisa tu correo: parece inválido.");
        return;
      }
      if (!isValidPhone(telefono)) {
        setStatus("err", "Revisa tu teléfono: debe tener al menos 7 dígitos.");
        alert("Revisa tu teléfono: debe tener al menos 7 dígitos.");
        return;
      }

      const payload = { name: nombre, business: negocio, email, phone: telefono, message: mensaje, website };

      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Enviando...";
        }

        // OJO: tu API actual es /api/contact (no /api/contacto)
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.ok) {
          const msg = data?.error || "No se pudo enviar. Intenta de nuevo en un momento.";
          setStatus("err", msg);
          alert(msg);
          return;
        }

        setStatus("ok", "Listo ✅ Te contactamos en breve.");
        alert("¡Información enviada con éxito!");
        form.reset();
      } catch (err) {
        console.error("contact error:", err);
        setStatus("err", "Error de conexión. Revisa tu internet e inténtalo de nuevo.");
        alert("No se pudo conectar con la API de GCA.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Enviar mi información";
        }
      }
    });
  }
})();
