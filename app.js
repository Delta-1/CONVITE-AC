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
      book.classList.remove('unsealing', 'opening');
      $('cover').setAttribute('aria-hidden', 'true');
      $('cover').inert = true;
      $('invitation').inert = false;
      $('invitation').setAttribute('aria-hidden', 'false');
      $('replay-button').hidden = false;
      storage.set('opened', '1');
      storage.set('intro-version', '5');
      if (animated) { $('rsvp-button').focus({preventScroll:true}); celebrate(); }
    };
    if (animated) {
      book.classList.add('opening');
      if (window.InvitationPageTurn) {
        cancelPageTurn = window.InvitationPageTurn.play($('cover'), book, finish);
      } else {
        openingTimer = setTimeout(finish, 1850);
      }
    } else {
      book.classList.add('already-open');
      finish();
    }
  }
  // First visit waits for a click. Returning visitors keep their invitation open.
  const skipIntro = storage.get('opened') === '1' && storage.get('intro-version') === '5';
  if (skipIntro) showInvitation(false);
  $('open-button').addEventListener('click', () => showInvitation(true));
  $('cover').addEventListener('click', () => showInvitation(true));
  $('replay-button').addEventListener('click', () => {
    clearTimeout(openingTimer);
    if (cancelPageTurn) { cancelPageTurn(); cancelPageTurn = null; }
    open = false;
    $('book').classList.add('resetting');
    $('book').classList.remove('already-open', 'opened', 'unsealing', 'opening');
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
