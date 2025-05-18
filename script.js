document.getElementById('rsvpForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = this;
  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  }).then(response => {
    if (response.ok) {
      form.style.display = 'none';
      document.getElementById('rsvpMessage').style.display = 'block';
    } else {
      alert('There was a problem submitting your RSVP. Please try again.');
    }
  }).catch(() => {
    alert('There was a problem submitting your RSVP. Please try again.');
  });
});

document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 500; // 500ms duration
    let start = null;

    function animation(currentTime) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function (easeInOutQuad)
      const ease = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      window.scrollTo(0, startPosition + (distance * ease));

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  });
});

// --- Polaroid Animation Logic (Refactored) ---
function checkAllLoaded() {
  return document.fonts.status === 'loaded'
    ? Promise.resolve()
    : document.fonts.ready;
}

function startAnimation() {
  const hoverImages = document.querySelector('.hover-images');
  hoverImages.classList.add('animation-started');
  if (window.innerWidth <= 768) {
    const lastDelay = 2.6;
    const duration = 2.0;
    const total = (lastDelay + duration) * 1000;
    setTimeout(() => {
      hoverImages.classList.remove('animation-started');
      void hoverImages.offsetWidth;
      hoverImages.classList.add('exit');
    }, total + 100);
  }
}

// Password protection
function checkPassword() {
  const password = document.getElementById('password-input').value;
  const errorMessage = document.getElementById('password-error');
  const content = document.querySelector('.content');
  const passwordProtection = document.getElementById('password-protection');
  const loadingHeart = document.querySelector('.loading-heart');

  if (password === 'room100') {
    content.style.display = 'block';
    passwordProtection.style.display = 'none';
    // Store in session storage so it persists during the session
    sessionStorage.setItem('weddingAccess', 'granted');
    // Wait for fonts and images, then start animation
    Promise.all([
      checkAllLoaded(),
      ...Array.from(document.images).map(img => img.complete ? Promise.resolve() : new Promise(res => { img.onload = res; img.onerror = res; }))
    ]).then(() => {
      if (loadingHeart) loadingHeart.classList.add('hidden');
      document.body.classList.remove('loading');
      setTimeout(startAnimation, 1000);
    });
  } else {
    errorMessage.style.display = 'block';
    errorMessage.textContent = 'Incorrect password. Please try again.';
  }
}

// Check if already authenticated
window.addEventListener('load', function() {
  if (sessionStorage.getItem('weddingAccess') === 'granted') {
    document.querySelector('.content').style.display = 'block';
    document.getElementById('password-protection').style.display = 'none';
    // Wait for fonts and images, then start animation
    const loadingHeart = document.querySelector('.loading-heart');
    Promise.all([
      checkAllLoaded(),
      ...Array.from(document.images).map(img => img.complete ? Promise.resolve() : new Promise(res => { img.onload = res; img.onerror = res; }))
    ]).then(() => {
      if (loadingHeart) loadingHeart.classList.add('hidden');
      document.body.classList.remove('loading');
      setTimeout(startAnimation, 1000);
    });
  }
});

// Allow Enter key to submit password
document.getElementById('password-input').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    checkPassword();
  }
});

// Mobile: allow tap to re-trigger animation if not already running
const jerica = document.querySelector('.jerica');
if (window.innerWidth <= 768 && jerica) {
  jerica.addEventListener('click', function() {
    const hoverImages = document.querySelector('.hover-images');
    if (!hoverImages.classList.contains('animation-started') && !hoverImages.classList.contains('exit')) {
      startAnimation();
    }
  });
}
