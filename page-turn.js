/* Open the real invitation sheet. No cloned strips or external animation libraries. */
(() => {
  'use strict';
  const frames = [
    {transform:'rotateY(0deg)',offset:0},
    {transform:'rotateY(-12deg)',offset:.16},
    {transform:'rotateY(-55deg)',offset:.4},
    {transform:'rotateY(-105deg)',offset:.64},
    {transform:'rotateY(-155deg)',offset:.87},
    {transform:'rotateY(-178deg)',offset:1}
  ];
  window.InvitationPageTurn = {
    play(cover, book, done) {
      const shadow=document.createElement('div');
      shadow.className='book-opening-shadow'; shadow.setAttribute('aria-hidden','true');
      book.append(shadow);
      let ended=false, timer, animation, shadowAnimation;
      const cleanup=()=>{
        clearTimeout(timer);
        cover.removeEventListener('animationend',onAnimationEnd);
        shadow.remove();
        animation?.cancel();shadowAnimation?.cancel();
      };
      const complete=()=>{if(ended)return;ended=true;done();cleanup();};
      const onAnimationEnd=(event)=>{if(event.target===cover&&event.animationName==='openActualSheet')complete();};
      if(typeof cover.animate==='function') {
        try {
          animation=cover.animate(frames,{duration:3400,easing:'cubic-bezier(.35,.02,.25,1)',fill:'forwards'});
          shadowAnimation=shadow.animate([{opacity:0},{opacity:.5,offset:.4},{opacity:.25,offset:.7},{opacity:0}],{duration:3400,fill:'forwards'});
          animation.onfinish=complete;
        } catch {
          book.classList.add('css-sheet-opening');
          cover.addEventListener('animationend',onAnimationEnd);
        }
      } else {
        book.classList.add('css-sheet-opening');
        cover.addEventListener('animationend',onAnimationEnd);
      }
      // Recovery for suspended tabs or browsers that suppress animation completion events.
      timer=setTimeout(complete,3900);
      return ()=>{ended=true;cleanup();book.classList.remove('css-sheet-opening');};
    }
  };
})();
