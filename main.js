// ============================================================
//  main.js — Anurajsinh Vaghela Portfolio
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ── AOS ── */
  if (typeof AOS !== 'undefined') {
    AOS.init({ once: true, offset: 60, duration: 900, easing: 'ease-in-out' });
  }

  /* ── Footer year ── */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ── Preloader ── */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.transition = 'opacity 0.4s ease';
      preloader.style.opacity = '0';

      setTimeout(() => {
        preloader.style.display = 'none';
      }, 400);
    });
  }

  /* ── Sticky nav — add bg-nav class after scrolling 50px ── */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('bg-nav', window.scrollY > 50);
    });
  }

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav li a');

  function setActiveLink() {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      if (
        scrollPos >= section.offsetTop &&
        scrollPos < section.offsetTop + section.offsetHeight
      ) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + section.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveLink);
  setActiveLink(); // run once on load

  /* ── Contact form ── */
  const form = document.getElementById('contact-form');
  const success = document.getElementById('success');
  const error = document.getElementById('error');
  const submit = document.getElementById('submit');

  // Show a feedback message inside the given element
  function showMsg(el, msg) {
    if (!el) return;
    const p = el.querySelector('p');
    if (p) p.textContent = msg;
    el.style.display = 'block';

    // Auto-hide after 6 seconds
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => {
      el.style.transition = 'opacity 0.5s ease';
      el.style.opacity = '0';
      setTimeout(() => {
        el.style.display = 'block'; // keep in DOM but invisible
        el.style.opacity = '1';
        el.style.display = 'none';
      }, 500);
    }, 6000);
  }

  function hideAll() {
    if (success) { success.style.display = 'none'; }
    if (error) { error.style.display = 'none'; }
  }

  // Highlight an invalid field briefly
  function flashField(field) {
    field.classList.add('input-error');
    field.addEventListener('input', () => field.classList.remove('input-error'), { once: true });
  }

  if (form && submit) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAll();

      const nameField = document.getElementById('cname');
      const emailField = document.getElementById('cemail');
      const phoneField = document.getElementById('cphone');
      const messageField = document.getElementById('cmessage');

      /* ── Client-side validation ── */
      if (!nameField.value.trim()) {
        showMsg(error, '⚠️ Please enter your full name.');
        flashField(nameField);
        nameField.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailField.value.trim() || !emailRegex.test(emailField.value.trim())) {
        showMsg(error, '⚠️ Please enter a valid email address.');
        flashField(emailField);
        emailField.focus();
        return;
      }

      if (!messageField.value.trim()) {
        showMsg(error, '⚠️ Please write a message before sending.');
        flashField(messageField);
        messageField.focus();
        return;
      }

      /* ── Loading state ── */
      const originalLabel = submit.textContent;
      submit.textContent = 'Sending…';
      submit.disabled = true;
      submit.style.opacity = '0.75';

      const payload = {
        name: nameField.value.trim(),
        email: emailField.value.trim(),
        phone: phoneField?.value.trim() || '',
        message: messageField.value.trim(),
      };

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showMsg(success, "✅ Message sent! I'll get back to you as soon as possible.");
          form.reset();
        } else {
          // Use the server's specific error text when available
          const serverMsg = data?.error || 'Something went wrong. Please try again.';
          showMsg(error, `❌ ${serverMsg}`);
        }

      } catch (networkErr) {
        // Genuine network / fetch failure
        console.error('Fetch error:', networkErr);
        showMsg(
          error,
          '❌ Network error — check your connection or email me directly at anurajsinhrajput@gmail.com'
        );
      } finally {
        submit.textContent = originalLabel;
        submit.disabled = false;
        submit.style.opacity = '1';
      }
    });
  }

});