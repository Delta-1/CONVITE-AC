(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const config = window.INVITE_CONFIG || {eventId:'mavie-lunna-2027-02-28',whatsappNumber:''};
  const prefix = config.eventId + ':';
  const storage = {
    get(key) { try { return localStorage.getItem(prefix + key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(prefix + key, value); } catch { /* Storage may be unavailable in private browsing. */ } }
  };
  let open = false;
  let openingTimer;
  let cancelPageTurn;
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  function showInvitation(animate) {
    if (open) return;
    open = true;
    clearTimeout(openingTimer);
    const animated = animate && !reducedMotion();
    const book = $('book');
    $('open-button').disabled = true;
    const finish = () => {
      book.classList.add('opened');
      $('scene').classList.add('revealed');
      book.classList.remove('unsealing', 'opening', 'css-sheet-opening');
      $('cover').setAttribute('aria-hidden', 'true');
      $('cover').inert = true;
      $('invitation').inert = false;
      $('invitation').setAttribute('aria-hidden', 'false');
      $('replay-button').hidden = false;
      storage.set('opened', '1');
      storage.set('intro-version', '8');
      if (animated) { $('rsvp-button').focus({preventScroll:true}); celebrate(); }
    };
    if (animated) {
      book.classList.add('opening');
      if (window.InvitationPageTurn) {
        cancelPageTurn = window.InvitationPageTurn.play($('cover'), book, finish);
      } else {
        openingTimer = setTimeout(finish, 3900);
      }
    } else {
      book.classList.add('already-open');
      finish();
    }
  }
  // Always show the closed cover, including repeat visits and old saved-open states.
  // Opening requires a click; replay also returns to this same closed state.
  const openFromGesture = () => { startMusic(); showInvitation(true); };
  $('open-button').addEventListener('click', openFromGesture);
  $('cover').addEventListener('click', openFromGesture);
  $('replay-button').addEventListener('click', () => {
    clearTimeout(openingTimer);
    if (cancelPageTurn) { cancelPageTurn(); cancelPageTurn = null; }
    open = false;
    $('scene').classList.remove('revealed');
    $('book').classList.add('resetting');
    $('book').classList.remove('already-open', 'opened', 'unsealing', 'opening', 'css-sheet-opening');
    $('cover').inert = false;
    $('cover').setAttribute('aria-hidden', 'false');
    $('invitation').inert = true;
    $('invitation').setAttribute('aria-hidden', 'true');
    $('replay-button').hidden = true;
    $('open-button').disabled = false;
    $('book').scrollIntoView({behavior: reducedMotion() ? 'instant' : 'smooth', block:'start'});
    // Keep the cover closed until the visitor clicks it again.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      $('book').classList.remove('resetting');
      $('open-button').focus({preventScroll:true});
    }));
  });
  const audio = $('party-audio');
  const musicButton = $('music-toggle');
  let musicReady = false;
  function syncMusicButton() {
    const playing = !audio.paused;
    $('music-label').textContent = playing ? 'Pausar música' : 'Tocar música';
    musicButton.setAttribute('aria-label', playing ? 'Pausar música' : 'Tocar música');
    musicButton.setAttribute('aria-pressed', playing ? 'true' : 'false');
  }
  if (typeof config.musicUrl === 'string' && config.musicUrl.trim()) {
    audio.src = config.musicUrl;
    audio.volume = 0.35;
    musicReady = true;
    musicButton.hidden = false;
    audio.addEventListener('play', syncMusicButton);
    audio.addEventListener('pause', syncMusicButton);
    audio.addEventListener('error', () => {
      musicReady = false;
      $('music-label').textContent = 'Música indisponível';
      musicButton.disabled = true;
      musicButton.setAttribute('aria-label', 'Música indisponível');
    });
  }
  function startMusic() {
    if (!musicReady || !audio.paused) return;
    audio.play().then(syncMusicButton).catch(syncMusicButton);
  }
  musicButton.addEventListener('click', () => {
    if (!musicReady) return;
    if (audio.paused) startMusic(); else audio.pause();
  });
  // A normal link opens WhatsApp on mobile and WhatsApp Web on desktop.
  // Opening the conversation never means the guest has sent their confirmation.
  const recipient = String(config.whatsappNumber || '').replace(/[^0-9]/g, '');
  const validRecipient = /^[1-9][0-9]{9,14}$/.test(recipient);
  const rsvpMessage = config.whatsappMessage || 'Olá! Quero confirmar minha presença no aniversário de 1 aninho da Mavie Lunna, dia 28/02, às 19h. 🎉💖';
  if (validRecipient) {
    $('rsvp-button').href = 'https://wa.me/' + recipient + '?text=' + encodeURIComponent(rsvpMessage);
  } else {
    $('rsvp-button').setAttribute('role', 'button');
    $('rsvp-button').tabIndex = 0;
    const explainMissingNumber = (event) => {
      event.preventDefault();
      $('rsvp-error').textContent = 'O WhatsApp para confirmação será disponibilizado em breve.';
      $('rsvp-error').hidden = false;
    };
    $('rsvp-button').addEventListener('click', explainMissingNumber);
    $('rsvp-button').addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') explainMissingNumber(event);
    });
  }
  function celebrate() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for(let i=0;i<34;i++) { const el=document.createElement('i'); el.className='confetto'; el.style.left=Math.random()*100+'%'; el.style.background=['#ff358a','#ffd447','#3acada','#a77af4'][i%4];el.style.setProperty('--drift',(Math.random()*180-90)+'px');el.style.animationDelay=Math.random()*.6+'s';$('confetti').append(el);setTimeout(()=>el.remove(),4000); }
  }
})();
