(() => {
  'use strict';

  const dialog = document.getElementById('letter-dialog');
  const closeButton = document.getElementById('close-note');
  const message = window.BOUQUET_MESSAGE || {};
  let previousFocus = null;

  if (typeof message.recipient === 'string' && message.recipient.trim()) {
    document.querySelector('[data-recipient]').textContent = message.recipient;
  }
  if (typeof message.signature === 'string' && message.signature.trim()) {
    document.querySelector('[data-signature]').textContent = message.signature;
  }
  if (Array.isArray(message.paragraphs)) {
    const paragraphs = message.paragraphs.filter((text) => typeof text === 'string' && text.trim());
    if (paragraphs.length) {
      const copy = document.getElementById('letter-copy');
      copy.replaceChildren(...paragraphs.map((text) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        return paragraph;
      }));
    }
  }

  const bgMusic = document.getElementById('bg-music');

  function startMusicFromNote() {
    if (!bgMusic) return;

    bgMusic.volume = 0.45;
    bgMusic.muted = false;
    bgMusic.play().catch(() => {
      // Browsers may block playback until a user interaction, which is expected.
    });
  }

  function openNote(event) {
    if (dialog.open) return;
    previousFocus = event.currentTarget;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      // Simple readable fallback for browsers without the dialog API.
      dialog.setAttribute('open', '');
      dialog.setAttribute('role', 'dialog');
      dialog.style.position = 'fixed';
      dialog.style.inset = '20px 0 auto';
      dialog.style.zIndex = '50';
    }
    startMusicFromNote();
    document.body.classList.add('note-open');
    dialog.scrollTop = 0;
    closeButton.focus();
  }

  function restorePage() {
    document.body.classList.remove('note-open');
    if (previousFocus) previousFocus.focus();
  }

  function closeNote() {
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
      restorePage();
    }
  }

  document.querySelectorAll('[data-note-open]').forEach((button) => {
    button.addEventListener('click', openNote);
  });
  closeButton.addEventListener('click', closeNote);
  dialog.addEventListener('close', restorePage);
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) {
      closeNote();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dialog.open && typeof dialog.close !== 'function') closeNote();
  });

  const capyButton = document.getElementById('capy-button');
  const capyImage = document.getElementById('capy-image');
  const bubble = document.getElementById('capy-message');
  const surprises = [
    { text: 'One tiny capybara. One very big hug.', image: 'assets/capybara-love.png', alt: 'A capybara hugging a pink heart' },
    { text: 'Just here to remind you: you are so loved.', image: 'assets/capybara-hello.png', alt: 'A capybara waving hello' },
    { text: 'The flowers are yours. The snacks are mine.', image: 'assets/capybara-flower.png', alt: 'A capybara carrying a flower' },
    { text: 'Official bouquet guard, reporting for duty.', image: 'assets/capybara-love.png', alt: 'A capybara holding a pink heart' },
    { text: 'You deserve flowers on the ordinary days, too.', image: 'assets/capybara-flower.png', alt: 'A capybara carrying a flower' },
    { text: 'Special delivery for the prettiest girl.', image: 'assets/capybara-love.png', alt: 'A capybara holding a pink heart' }
  ];
  let surpriseIndex = 0;
  let bubbleFrame = 0;
  capyButton.addEventListener('click', () => {
    const surprise = surprises[surpriseIndex];
    surpriseIndex = (surpriseIndex + 1) % surprises.length;
    bubble.textContent = surprise.text;
    capyImage.src = surprise.image;
    capyImage.alt = surprise.alt;
    bubble.classList.remove('is-new');
    cancelAnimationFrame(bubbleFrame);
    bubbleFrame = requestAnimationFrame(() => bubble.classList.add('is-new'));
  });
})();
