(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const config = window.INVITE_CONFIG;
  const prefix = config.eventId + ':';
  const storage = {
    get(key) { try { return localStorage.getItem(prefix + key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(prefix + key, value); } catch { /* Storage may be unavailable in private browsing. */ } }
  };
  let open = false;
  function showInvitation(animate) {
    if (open) return;
    open = true;
    if (!animate) $('book').classList.add('already-open');
    $('book').classList.add('opened');
    $('cover').setAttribute('aria-hidden', 'true');
    $('cover').inert = true;
    $('invitation').inert = false;
    $('invitation').setAttribute('aria-hidden', 'false');
    storage.set('opened', '1');
    if (animate) { setTimeout(() => $('rsvp-button').focus({preventScroll:true}), 1250); }
  }
  function updateConfirmed() {
    if (storage.get('confirmed') !== '1') return;
    $('confirmed-note').hidden = false;
    $('rsvp-button').textContent = '♡ Presença confirmada';
  }
  if (storage.get('opened')) showInvitation(false);
  updateConfirmed();
  $('open-button').addEventListener('click', () => showInvitation(true));
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
    for(let i=0;i<34;i++) { const el=document.createElement('i'); el.className='confetto'; el.style.left=Math.random()*100+'%'; el.style.background=['#eaa6c0','#f3d272','#9ecfcc','#bba1d4'][i%4];el.style.setProperty('--drift',(Math.random()*180-90)+'px');el.style.animationDelay=Math.random()*.6+'s';$('confetti').append(el);setTimeout(()=>el.remove(),4000); }
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
