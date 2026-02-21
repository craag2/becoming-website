// ========================================
// Becoming — Website Scripts
// ========================================

(function () {
  'use strict';

  // --- Scroll-triggered reveal ---
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // --- Nav scroll effect ---
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // --- Mobile nav toggle ---
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // --- Hero typing rotation ---
  const rotateEl = document.getElementById('hero-rotate');
  const commaEl  = document.querySelector('.hero-title-comma');
  const words = ['affirm', 'reflect', 'grow', 'heal', 'believe'];
  let wordIndex = 0;
  const typeSpeed  = 80;   // ms per character typing
  const eraseSpeed = 50;   // ms per character erasing
  const holdDelay  = 2000; // ms to hold the completed word

  function typeWord(word, callback) {
    let i = 0;
    // First type the word, then type the comma
    function typeChar() {
      if (i <= word.length) {
        rotateEl.textContent = word.slice(0, i);
        i++;
        setTimeout(typeChar, typeSpeed);
      } else {
        // Now show comma
        if (commaEl) commaEl.style.opacity = '1';
        callback();
      }
    }
    typeChar();
  }

  function eraseWord(word, callback) {
    // First erase comma
    if (commaEl) commaEl.style.opacity = '0';
    let i = word.length;
    setTimeout(function eraseChar() {
      if (i >= 0) {
        rotateEl.textContent = word.slice(0, i);
        i--;
        setTimeout(eraseChar, eraseSpeed);
      } else {
        callback();
      }
    }, commaEl ? eraseSpeed * 2 : 0); // brief pause after comma disappears
  }

  function runTypingCycle() {
    const currentWord = words[wordIndex];
    typeWord(currentWord, () => {
      setTimeout(() => {
        eraseWord(currentWord, () => {
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(runTypingCycle, 300);
        });
      }, holdDelay);
    });
  }

  // Hide comma initially then start typing cycle
  if (commaEl) commaEl.style.opacity = '0';
  rotateEl.textContent = '';
  setTimeout(runTypingCycle, 800);

  // --- Affirmation card cycling with shuffle ---
  const cardsStack = document.querySelector('.cards-stack');
  if (cardsStack) {
    // [front card, middle card, back card]
    const affirmationSets = [
      [
        { text: '"I love the person I\'m becoming."',              label: 'Self Love'   },
        { text: '"I trust myself to handle whatever comes."',      label: 'Confidence'  },
        { text: '"I am grateful for how far I\'ve already come."', label: 'Gratitude'   },
      ],
      [
        { text: '"Every day I grow a little more."',               label: 'Growth'      },
        { text: '"I am worthy of the things I desire."',           label: 'Worthiness'  },
        { text: '"I choose peace over perfection."',               label: 'Mindfulness' },
      ],
      [
        { text: '"I release what I cannot control."',              label: 'Letting Go'  },
        { text: '"Rest is part of my progress."',                  label: 'Self Care'   },
        { text: '"I am allowed to take up space."',                label: 'Confidence'  },
      ],
      [
        { text: '"I am enough, exactly as I am."',                 label: 'Self Worth'  },
        { text: '"I am building something that matters."',         label: 'Purpose'     },
        { text: '"My feelings are valid and temporary."',          label: 'Emotions'    },
      ],
    ];

    // Each theme: [back gradient, middle gradient, front gradient]
    const colorThemes = [
      ['linear-gradient(135deg,#D5D1E8,#E8D5D8)', 'linear-gradient(135deg,#D0E0D4,#D4DDD4)', 'linear-gradient(135deg,#FAF6F1,#F0EAE0)'],
      ['linear-gradient(135deg,#F2D5C0,#E8C0B5)', 'linear-gradient(135deg,#EBC5C5,#D8ADAD)', 'linear-gradient(135deg,#FCF7F2,#F4EDE5)'],
      ['linear-gradient(135deg,#C0D5EC,#B5C8DC)', 'linear-gradient(135deg,#C0E0D8,#AACFC4)', 'linear-gradient(135deg,#F7FAFB,#EDF4F6)'],
      ['linear-gradient(135deg,#DACBD8,#C8B5C5)', 'linear-gradient(135deg,#E2CDD0,#D0BCBC)', 'linear-gradient(135deg,#FAF6F0,#F0EAE2)'],
      ['linear-gradient(135deg,#E5D8B0,#D4C89A)', 'linear-gradient(135deg,#D8DEBB,#C6CCA5)', 'linear-gradient(135deg,#FCFBF0,#F4F2E5)'],
    ];

    // card-1 = front (z3), card-2 = middle (z2), card-3 = back (z1)
    const cardEls = [
      cardsStack.querySelector('.stack-card-1'),
      cardsStack.querySelector('.stack-card-2'),
      cardsStack.querySelector('.stack-card-3'),
    ];

    // Random rotation ranges [min, max] for front / middle / back
    const rotRanges = [[-3, 1], [3, 8], [-11, -5]];
    const yOffsets  = [0, 6, 12];

    let currentSet   = 0;
    let currentTheme = 0;
    let isAnimating  = false;

    function rand(min, max) { return min + Math.random() * (max - min); }

    function applyRandomRotations() {
      cardEls.forEach((card, i) => {
        const r = rand(rotRanges[i][0], rotRanges[i][1]).toFixed(1);
        card.style.transform = `translateX(-50%) rotate(${r}deg) translateY(${yOffsets[i]}px)`;
      });
    }

    function applyTheme(themeIndex) {
      // colorThemes: [back, middle, front] → cardEls: [front(0), middle(1), back(2)]
      cardEls[0].style.background = colorThemes[themeIndex][2];
      cardEls[1].style.background = colorThemes[themeIndex][1];
      cardEls[2].style.background = colorThemes[themeIndex][0];
    }

    function updateContent(setIndex) {
      const set = affirmationSets[setIndex];
      cardEls.forEach((card, i) => {
        const textEl  = card.querySelector('.stack-card-text');
        const labelEl = card.querySelector('.stack-card-label');
        if (textEl)  textEl.textContent  = set[i].text;
        if (labelEl) labelEl.textContent = set[i].label;
      });
    }

    cardsStack.addEventListener('click', () => {
      if (isAnimating) return;
      isAnimating = true;

      cardsStack.classList.add('is-shuffling');

      // Advance set; pick a new random theme
      currentSet = (currentSet + 1) % affirmationSets.length;
      let nextTheme;
      do { nextTheme = Math.floor(Math.random() * colorThemes.length); }
      while (nextTheme === currentTheme);
      currentTheme = nextTheme;

      // Swap content + colors at the visual midpoint of the animation
      setTimeout(() => {
        updateContent(currentSet);
        applyTheme(currentTheme);
        applyRandomRotations();
      }, 220);

      // Remove animation class; unlock after it finishes
      setTimeout(() => {
        cardsStack.classList.remove('is-shuffling');
        isAnimating = false;
      }, 520);
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = nav.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();
