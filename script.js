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
// ==========================================================

// ---------- 1. Contact form validation ----------
(function () {
  var form = document.querySelector('.contact-form');
  if (!form) { return; }

  var nameInput = form.querySelector('input[type="text"]');
  var emailInput = form.querySelector('input[type="email"]');
  var messageInput = form.querySelector('textarea');
  if (!nameInput || !emailInput || !messageInput) { return; }

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  var nameError = createErrorElement(nameInput);
  var emailError = createErrorElement(emailInput);
  var messageError = createErrorElement(messageInput);
  var status = createStatusElement();

  function showError(input, errorEl, message) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
    input.classList.add('input-error');
  }

  function clearError(input, errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
    input.classList.remove('input-error');
  }

  function hideStatus() {
    status.textContent = '';
    status.className = 'form-status';
  }

  // Clear a field's error as soon as the user starts fixing it
  nameInput.addEventListener('input', function () {
    clearError(nameInput, nameError);
    hideStatus();
  });

  emailInput.addEventListener('input', function () {
    clearError(emailInput, emailError);
    hideStatus();
  });

  messageInput.addEventListener('input', function () {
    clearError(messageInput, messageError);
    hideStatus();
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    clearError(nameInput, nameError);
    clearError(emailInput, emailError);
    clearError(messageInput, messageError);
    hideStatus();

    var isValid = true;

    if (nameInput.value.trim().length < 2) {
      showError(nameInput, nameError, 'Please enter your name (at least 2 characters).');
      isValid = false;
    }

    var emailValue = emailInput.value.trim();
    if (emailValue === '') {
      showError(emailInput, emailError, 'Please enter your email address.');
      isValid = false;
    } else if (!emailPattern.test(emailValue)) {
      showError(emailInput, emailError, 'Please enter a valid email address.');
      isValid = false;
    }

    if (messageInput.value.trim().length < 10) {
      showError(messageInput, messageError, 'Please enter a message (at least 10 characters).');
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

    // No backend yet - confirm success and reset the form
    var firstName = nameInput.value.trim().split(' ')[0];
    status.textContent = 'Thanks, ' + firstName + '! Your message has been sent.';
    status.className = 'form-status success';
    form.reset();
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
