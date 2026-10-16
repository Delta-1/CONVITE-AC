(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const config = window.INVITE_CONFIG || {eventId:'mavie-lunna-2027-02-28',appsScriptUrl:''};
  const prefix = config.eventId + ':';
  const storage = {
    get(key) { try { return localStorage.getItem(prefix + key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(prefix + key, value); } catch { /* Storage may be unavailable in private browsing. */ } }
  };
  let open = false;
  let openingTimer;
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
      storage.set('intro-version', '3');
      if (animated) celebrate();
    };
    if (animated) {
      book.classList.add('unsealing');
      openingTimer = setTimeout(() => {
        book.classList.add('opening');
        openingTimer = setTimeout(finish, 1650);
      }, 600);
    } else {
      book.classList.add('already-open');
      finish();
    }
  }
  function updateConfirmed() {
    if (storage.get('confirmed') !== '1') return;
    $('confirmed-note').hidden = false;
    $('rsvp-button').textContent = '♡ Presença confirmada';
  }
  // Existing visitors see this repaired intro once; later visits keep the invitation open.
  const skipIntro = storage.get('confirmed') === '1' ||
    (storage.get('opened') === '1' && storage.get('intro-version') === '3');
  if (skipIntro) {
    showInvitation(false);
  } else {
    const startIntro = () => { if (!open) openingTimer = setTimeout(() => showInvitation(true), 1200); };
    if (document.readyState === 'complete') startIntro();
    else window.addEventListener('load', startIntro, {once:true});
  }
  updateConfirmed();
  $('open-button').addEventListener('click', () => showInvitation(true));
  $('replay-button').addEventListener('click', () => {
    clearTimeout(openingTimer);
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
    // Render the closed cover before starting the opening sequence again.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      $('book').classList.remove('resetting');
      showInvitation(true);
    }));
  });
  $('rsvp-button').addEventListener('click', () => {
    const confirmed = storage.get('confirmed') === '1';
    $('form-view').hidden = confirmed;
    $('success-view').hidden = !confirmed;
    $('rsvp-dialog').showModal();
  });
  const close = () => $('rsvp-dialog').close();
  $('close-dialog').addEventListener('click', close);
  $('back-invite').addEventListener('click', close);
  $('rsvp-dialog').addEventListener('click', (e) => { if(e.target === $('rsvp-dialog')) { const r=e.target.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) close(); } });
  let personId = 0;
  $('add-person').addEventListener('click', () => {
    if ($('companions').children.length >= 15) return;
    const id = 'person-' + ++personId;
    const container = document.createElement('div');
    const label = document.createElement('label'); label.htmlFor = id; label.textContent = 'Nome do acompanhante';
    const row = document.createElement('div'); row.className='companion-row';
    const input = document.createElement('input'); Object.assign(input,{id,required:true,minLength:2,maxLength:100,placeholder:'Quem vai com você?'}); input.name='companion';
    const remove = document.createElement('button'); remove.type='button'; remove.className='remove-person'; remove.textContent='×'; remove.setAttribute('aria-label','Remover acompanhante');
    remove.addEventListener('click',()=> {container.remove(); $('add-person').hidden=false;});
    row.append(input,remove); container.append(label,row); $('companions').append(container); input.focus();
    $('add-person').hidden = $('companions').children.length >= 15;
  });
  function celebrate() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for(let i=0;i<34;i++) { const el=document.createElement('i'); el.className='confetto'; el.style.left=Math.random()*100+'%'; el.style.background=['#ff358a','#ffd447','#3acada','#a77af4'][i%4];el.style.setProperty('--drift',(Math.random()*180-90)+'px');el.style.animationDelay=Math.random()*.6+'s';$('confetti').append(el);setTimeout(()=>el.remove(),4000); }
  }
  $('rsvp-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const error=$('form-error'); error.hidden=true;
    const phone=$('phone').value.trim();
    if(!/^\+?[\d\s().-]+$/.test(phone)||phone.replace(/\D/g,'').length<10||phone.replace(/\D/g,'').length>15) {error.textContent='Confira o telefone e inclua o DDD.';error.hidden=false;$('phone').focus();return;}
    if(!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(config.appsScriptUrl)) {error.textContent='A confirmação de presença estará disponível em breve. Tente novamente mais tarde.';error.hidden=false;return;}
    const btn=$('submit-button'); btn.disabled=true;btn.textContent='Enviando sua confirmação…';
    let id=storage.get('submission');if(!id){id=crypto.randomUUID();storage.set('submission',id);}
    const payload={id,eventId:config.eventId,name:$('guest-name').value.trim(),phone,companions:[...document.querySelectorAll('[name="companion"]')].map(el=>el.value.trim())};
    try {
      const response=await fetch(config.appsScriptUrl,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),redirect:'follow',signal:AbortSignal.timeout(25000)});
      if(!response.ok) throw new Error('http');
      const result=await response.json();
      if(result.status!=='success'||result.id!==id) throw new Error('rejected');
      storage.set('confirmed','1'); updateConfirmed();$('form-view').hidden=true;$('success-view').hidden=false;celebrate();
    } catch {error.textContent='Não conseguimos confirmar o envio. Confira sua conexão e tente novamente. Se o envio anterior chegou, ele não será duplicado.';error.hidden=false;}
    finally {btn.disabled=false;btn.textContent='Confirmar presença ♡';}
  });
})();
