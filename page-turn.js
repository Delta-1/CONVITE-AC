/* Flexible paper: linked 3D strips share one continuous front and back artwork. */
(() => {
  'use strict';
  const duration = 2100;
  function geometry(progress, count) {
    const t = Math.max(0, Math.min(1, progress));
    const ease = t * t * (3 - 2 * t);
    const bend = 68 * Math.sin(Math.PI * t);
    return Array.from({length:count}, (_, i) => -180 * ease - bend * Math.pow((i + 1) / count, 1.6));
  }
  window.InvitationPageTurn = {
    geometry,
    play(cover, book, done) {
      const bounds = cover.getBoundingClientRect();
      if (!bounds.width || !bounds.height) { done(); return () => {}; }
      const width = bounds.width, height = bounds.height;
      const count = width < 700 ? 14 : 22;
      const stripWidth = width / count;
      const layer = document.createElement('div');
      layer.className = 'page-turn'; layer.setAttribute('aria-hidden', 'true'); layer.inert = true;
      const shadow = document.createElement('div'); shadow.className = 'page-turn-shadow';
      const hinges = [], shades = [];
      let parent = layer;
      const sourceFront = cover.querySelector('.cover-front');
      const sourceBack = cover.querySelector('.cover-back');
      function makeFace(source, index, back) {
        const face = document.createElement('div'); face.className = 'paper-face ' + (back ? 'paper-back' : 'paper-front');
        const snapshot = source.cloneNode(true);
        snapshot.removeAttribute('id');
        snapshot.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        snapshot.querySelectorAll('button,a,input').forEach(el => { el.tabIndex = -1; if(el.tagName === 'BUTTON') el.disabled = false; });
        Object.assign(snapshot.style, {width:width+'px',height:height+'px',left:-(back ? width-(index+1)*stripWidth : index*stripWidth)+'px',top:'0',right:'auto',bottom:'auto',transform:'none',boxShadow:'none'});
        const shade = document.createElement('div'); shade.className='paper-shade';
        face.append(snapshot,shade); shades.push({node:shade,index,back});
        return face;
      }
      for (let i=0;i<count;i++) {
        const hinge=document.createElement('div');hinge.className='paper-hinge';
        hinge.style.width=stripWidth+'px'; hinge.style.height=height+'px'; hinge.style.left=(i ? stripWidth : 0)+'px';
        hinge.append(makeFace(sourceFront,i,false),makeFace(sourceBack,i,true));
        parent.append(hinge);parent=hinge;hinges.push(hinge);
      }
      book.append(shadow,layer);
      book.classList.add('page-curl-active');
      let start, frame, ended=false;
      function cleanup() {
        cancelAnimationFrame(frame); layer.remove();shadow.remove();book.classList.remove('page-curl-active');
      }
      function complete() { if(ended)return; ended=true;done();cleanup(); }
      function draw(now) {
        if(ended)return;
        if(start===undefined) start=now;
        const t=Math.min(1,(now-start)/duration),angles=geometry(t,count);
        hinges.forEach((hinge,i)=>{hinge.style.transform='rotateY('+(angles[i]-(i ? angles[i-1] : 0))+'deg)';});
        const strength=Math.sin(Math.PI*t);
        shades.forEach(({node,index,back})=>{
          const radians=angles[index]*Math.PI/180;
          const darkness=(1-Math.abs(Math.cos(radians)))*.28 + strength*.08;
          node.style.opacity=String(darkness);
          node.style.background=back?'linear-gradient(90deg,#632342,transparent)':'linear-gradient(270deg,#632342,transparent)';
        });
        shadow.style.opacity=String(strength*.45);
        shadow.style.transform='translateX('+((1-t)*width-width*.18)+'px) scaleX('+(0.7+strength*.5)+')';
        if(t<1) frame=requestAnimationFrame(draw);else complete();
      }
      frame=requestAnimationFrame(draw);
      // Finish even if the tab is suspended or animation frames stop arriving.
      const fallback=setTimeout(complete,duration+750);
      return () => {ended=true;clearTimeout(fallback);cleanup();};
    }
  };
})();
