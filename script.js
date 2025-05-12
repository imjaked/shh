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

document.addEventListener('DOMContentLoaded', function() {
  const hoverImages = document.querySelector('.hover-images');
  const loadingHeart = document.querySelector('.loading-heart');
  
  // Function to check if everything is loaded
  function checkAllLoaded() {
    return new Promise((resolve) => {
      // Check if fonts are loaded
      if (document.fonts.status === 'loaded') {
        resolve();
      } else {
        document.fonts.ready.then(resolve);
      }
    });
  }

  // Wait for everything to load
  Promise.all([
    checkAllLoaded(),
    // Wait for images to load
    ...Array.from(document.images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve; // Resolve even on error to not block the page
      });
    })
  ]).then(() => {
    // Fade out loading heart
    loadingHeart.classList.add('hidden');
    
    // Remove loading class to trigger entrance animation
    document.body.classList.remove('loading');
    
    // Start polaroid animation after a short delay
    setTimeout(() => {
      hoverImages.classList.add('animation-started');
      
      // Cleanup images after animation
      const images = hoverImages.querySelectorAll('img');
      images.forEach(img => {
        img.addEventListener('animationend', function() {
          this.style.visibility = 'hidden';
        });
      });
    }, 1000); // Wait for entrance animation to start
  });
});

// Password protection
function checkPassword() {
  const password = document.getElementById('password-input').value;
  const errorMessage = document.getElementById('password-error');
  const content = document.querySelector('.content');
  const passwordProtection = document.getElementById('password-protection');

  if (password === 'room100') {
    content.style.display = 'block';
    passwordProtection.style.display = 'none';
    // Store in session storage so it persists during the session
    sessionStorage.setItem('weddingAccess', 'granted');
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
  }
});

// Allow Enter key to submit password
document.getElementById('password-input').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    checkPassword();
  }
});
