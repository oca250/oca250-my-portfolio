// ==========================================================
// Portfolio JavaScript - extra functionality only.
// The original design, HTML, CSS, and inline scripts
// (blog posts + skill bars) are untouched.
//
// This file adds:
//   1. Contact form validation (messages are created with JS,
//      so the HTML stays exactly as designed)
//   2. A guard for project links that still point to "#",
//      so they don't open a broken page (no visual change)
//   3. Certificate lightbox (opens the original image larger,
//      closes on X / backdrop / Escape)
// ==========================================================

// ---------- 1. Contact form validation ----------
(function () {
  var form = document.querySelector('.contact-form');
  if (!form) { return; }

  var nameInput = form.querySelector('input[name="name"]');
  var emailInput = form.querySelector('input[name="email"]');
  var subjectInput = form.querySelector('input[name="subject"]');
  var messageInput = form.querySelector('textarea');
  var submitButton = form.querySelector('button[type="submit"]');
  if (!nameInput || !emailInput || !subjectInput || !messageInput || !submitButton) { return; }

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var isSending = false;

  // Error <small> elements are created here instead of in the
  // HTML. They stay hidden (display: none) until needed, so
  // the page looks exactly like the original design.
  function createErrorElement(input) {
    var el = document.createElement('small');
    el.className = 'form-error';
    input.insertAdjacentElement('afterend', el);
    return el;
  }

  function createStatusElement() {
    var el = document.createElement('p');
    el.className = 'form-status';
    el.setAttribute('role', 'status');
    form.appendChild(el);
    return el;
  }

  var errors = {};
  [nameInput, emailInput, subjectInput, messageInput].forEach(function (input) {
    errors[input.name] = createErrorElement(input);
  });
  var status = createStatusElement();

  function showError(input, message) {
    errors[input.name].textContent = message;
    errors[input.name].classList.add('visible');
    input.classList.add('input-error');
  }

  function clearError(input) {
    errors[input.name].textContent = '';
    errors[input.name].classList.remove('visible');
    input.classList.remove('input-error');
  }

  function hideStatus() {
    status.textContent = '';
    status.className = 'form-status';
  }

  function setSending(sending) {
    isSending = sending;
    submitButton.disabled = sending;
    submitButton.classList.toggle('is-loading', sending);
    if (sending) {
      submitButton.dataset.label = submitButton.textContent;
      submitButton.textContent = 'Sending...';
    } else if (submitButton.dataset.label) {
      submitButton.textContent = submitButton.dataset.label;
    }
  }

  // Clear a field's error as soon as the user starts fixing it
  [nameInput, emailInput, subjectInput, messageInput].forEach(function (input) {
    input.addEventListener('input', function () {
      clearError(input);
      hideStatus();
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (isSending) { return; }

    [nameInput, emailInput, subjectInput, messageInput].forEach(clearError);
    hideStatus();

    var isValid = true;

    if (nameInput.value.trim().length < 2) {
      showError(nameInput, 'Please enter your name (at least 2 characters).');
      isValid = false;
    }

    var emailValue = emailInput.value.trim();
    if (emailValue === '') {
      showError(emailInput, 'Please enter your email address.');
      isValid = false;
    } else if (!emailPattern.test(emailValue)) {
      showError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    }

    if (subjectInput.value.trim().length < 3) {
      showError(subjectInput, 'Please enter a subject (at least 3 characters).');
      isValid = false;
    }

    if (messageInput.value.trim().length < 10) {
      showError(messageInput, 'Please enter a message (at least 10 characters).');
      isValid = false;
    }

    if (!isValid) {
      status.textContent = 'Please fix the errors above and try again.';
      status.className = 'form-status error';
      var firstError = form.querySelector('.input-error');
      if (firstError) {
        firstError.focus();
      }
      return;
    }

    // Static site with no backend yet: show the loading state,
    // then confirm success and reset the form.
    setSending(true);
    setTimeout(function () {
      setSending(false);
      var firstName = nameInput.value.trim().split(' ')[0];
      status.textContent = 'Thanks, ' + firstName + '! Your message has been sent.';
      status.className = 'form-status success';
      form.reset();
    }, 900);
  });
})();

// ---------- 2. Mobile hamburger menu ----------
(function () {
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.nav-links');
  if (!toggle || !menu) { return; }

  function setMenu(open) {
    menu.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  toggle.addEventListener('click', function () {
    setMenu(!menu.classList.contains('open'));
  });

  // Close the menu automatically when a link is chosen
  menu.addEventListener('click', function (event) {
    if (event.target.closest('a')) {
      setMenu(false);
    }
  });
})();

// ---------- 3. Project placeholder links ----------
// The Live Demo / GitHub buttons still point to "#". Until real
// URLs are added to the href attributes, this stops the browser
// from opening a broken page. Links with real URLs keep working
// normally and nothing is shown on screen.
(function () {
  var projectLinks = document.querySelectorAll('.project-links a');
  for (var i = 0; i < projectLinks.length; i++) {
    projectLinks[i].addEventListener('click', function (event) {
      var href = this.getAttribute('href');
      if (href === '' || href === '#') {
        event.preventDefault();
      }
    });
  }
})();

// ---------- 4. Certificate lightbox ----------
// "View Certificate" opens the exact original image in a larger
// overlay. Nothing about the image is modified - the lightbox
// <img> simply reuses the same src as the section image.
(function () {
  var trigger = document.getElementById('view-certificate');
  var lightbox = document.getElementById('certificate-lightbox');
  var closeBtn = document.getElementById('lightbox-close');
  var certificateImage = document.getElementById('certificate-image');
  var lightboxImage = lightbox ? lightbox.querySelector('img') : null;
  if (!trigger || !lightbox || !closeBtn || !certificateImage || !lightboxImage) { return; }

  function openLightbox() {
    lightboxImage.src = certificateImage.currentSrc || certificateImage.src;
    lightbox.classList.add('open');
    document.body.classList.add('lightbox-open');
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.classList.remove('lightbox-open');
    trigger.focus();
  }

  trigger.addEventListener('click', openLightbox);
  closeBtn.addEventListener('click', closeLightbox);

  // Clicking the dark backdrop closes; clicking the image doesn't
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
})();
