/* Henna Spell by Ahona — Main JS (no dependencies) */
(function(){
  const WHATSAPP_NUMBER = "8801937589991"; // +88 removed for wa.me format
  const SERVICE_LOCATION = "Bajitpur";

  // Mobile nav toggle
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  if(navToggle && navLinks){
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const expanded = navLinks.classList.contains('open');
      navToggle.setAttribute('aria-expanded', String(expanded));
    });
  }

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      for(const e of entries){
        if(e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }
    }, {threshold: 0.12});
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Light tilt effect for panels/cards (CSS variables --sx/--sy)
  function attachShine(el){
    const rect = () => el.getBoundingClientRect();
    const onMove = (ev) => {
      const r = rect();
      const x = (ev.clientX - r.left) / r.width;
      const y = (ev.clientY - r.top) / r.height;
      el.style.setProperty('--sx', Math.round(x*100) + '%');
      el.style.setProperty('--sy', Math.round(y*100) + '%');
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--sx', '35%');
      el.style.setProperty('--sy', '20%');
    });
  }

  document.querySelectorAll('.panel, .card, .priceCard').forEach(attachShine);

  // Hero 3D stack parallax
  const stack = document.querySelector('[data-stack]');
  const stackCards = stack ? Array.from(stack.querySelectorAll('.stackCard')) : [];
  if(stack && stackCards.length){
    const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
    const onMove = (ev) => {
      const r = stack.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width;   // 0..1
      const y = (ev.clientY - r.top) / r.height;   // 0..1
      const rx = clamp((0.5 - y) * 10, -8, 8);      // deg
      const ry = clamp((x - 0.5) * 14, -10, 10);    // deg
      stackCards.forEach((c, idx) => {
        const mul = (idx === 0 ? 1 : idx === 1 ? 0.78 : 0.55);
        c.style.setProperty('--rx', (rx*mul).toFixed(2)+'deg');
        c.style.setProperty('--ry', (ry*mul).toFixed(2)+'deg');
        c.style.setProperty('--sx', Math.round(x*100) + '%');
        c.style.setProperty('--sy', Math.round(y*100) + '%');
      });
    };
    stack.addEventListener('mousemove', onMove);
    stack.addEventListener('mouseleave', () => {
      stackCards.forEach(c => {
        c.style.setProperty('--rx', '0deg');
        c.style.setProperty('--ry', '0deg');
        c.style.setProperty('--sx', '35%');
        c.style.setProperty('--sy', '20%');
      });
    });
  }

  // Gallery modal (works on pages that have data-modal)
  const modal = document.querySelector('[data-modal]');
  const modalImg = document.querySelector('[data-modal-img]');
  const modalTitle = document.querySelector('[data-modal-title]');
  const modalText = document.querySelector('[data-modal-text]');
  const modalCta = document.querySelector('[data-modal-cta]');
  const closeBtn = document.querySelector('[data-modal-close]');

  function openModal({src, title, tag}){
    if(!modal) return;
    modal.classList.add('open');
    if(modalImg) modalImg.src = src;
    if(modalTitle) modalTitle.textContent = title || 'Henna Design';
    if(modalText) modalText.textContent = tag ? `Style: ${tag}. Want a similar design? Message us on WhatsApp.` : `Want a similar design? Message us on WhatsApp.`;
    if(modalCta){
      modalCta.setAttribute('href', whatsappLinkFromTemplate({
        name: '',
        phone: '',
        date: '',
        time: '',
        area: SERVICE_LOCATION,
        package: 'Gallery design inquiry',
        notes: `I want a similar design: ${title || ''}`
      }));
    }
  }

  function closeModal(){
    if(!modal) return;
    modal.classList.remove('open');
  }

  if(modal){
    modal.addEventListener('click', (e) => {
      if(e.target === modal) closeModal();
    });
  }
  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeModal();
  });

  // Click-to-open modal for gallery items
  document.querySelectorAll('[data-open-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal({
        src: btn.getAttribute('data-src'),
        title: btn.getAttribute('data-title'),
        tag: btn.getAttribute('data-tag')
      });
    });
  });

  // Gallery filter (gallery page)
  const filterWrap = document.querySelector('[data-filter]');
  const filterBtns = filterWrap ? Array.from(filterWrap.querySelectorAll('button')) : [];
  const filterItems = Array.from(document.querySelectorAll('[data-filter-item]'));
  if(filterWrap && filterBtns.length && filterItems.length){
    filterBtns.forEach((b) => {
      b.addEventListener('click', () => {
        const key = b.getAttribute('data-key');
        filterBtns.forEach(x => x.classList.remove('primary'));
        b.classList.add('primary');

        filterItems.forEach((item) => {
          const tags = (item.getAttribute('data-tags') || '').split(',').map(s => s.trim());
          const ok = (key === 'all') || tags.includes(key);
          item.style.display = ok ? '' : 'none';
        });
      });
    });
  }

  // Booking form -> WhatsApp (on booking page and index)
  function whatsappLinkFromTemplate(data){
    // Compose a neat message that looks professional
    const lines = [
      "Assalamu Alaikum,",
      "I want to book mehendi.",
      "",
      `Name: ${data.name || '-'}`,
      `Phone: ${data.phone || '-'}`,
      `Event Date: ${data.date || '-'}`,
      `Time: ${data.time || '-'}`,
      `Location/Area: ${data.area || SERVICE_LOCATION}`,
      `Package/Type: ${data.package || '-'}`,
      `Notes: ${data.notes || '-'}`,
      "",
      "Please confirm availability. Thank you!"
    ];
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }

  function wireBookingForm(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        name: form.querySelector('[name="name"]')?.value?.trim(),
        phone: form.querySelector('[name="phone"]')?.value?.trim(),
        date: form.querySelector('[name="date"]')?.value?.trim(),
        time: form.querySelector('[name="time"]')?.value?.trim(),
        area: form.querySelector('[name="area"]')?.value?.trim(),
        package: form.querySelector('[name="package"]')?.value?.trim(),
        notes: form.querySelector('[name="notes"]')?.value?.trim(),
      };
      const link = whatsappLinkFromTemplate(data);
      window.open(link, '_blank');
    });
  }

  document.querySelectorAll('[data-booking-form]').forEach(wireBookingForm);

  // Floating WhatsApp button
  const floatBtn = document.querySelector('[data-wa-float]');
  if(floatBtn){
    floatBtn.setAttribute('href', whatsappLinkFromTemplate({
      name:'',
      phone:'',
      date:'',
      time:'',
      area: SERVICE_LOCATION,
      package:'Quick booking',
      notes:'Hi, I want to book mehendi. Please share available dates.'
    }));
  }

})();
