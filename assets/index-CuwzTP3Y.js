(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();const O=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let W=0;const P=()=>W,se=new Set;function me(s){return se.add(s),()=>se.delete(s)}function Re(){W+=1;for(const s of se)try{s()}catch{}return se.clear(),W}let Z=!1,we=0,Te=0;const te=()=>(Z?we:performance.now())-Te;function Fe(){Z||(we=performance.now(),Z=!0)}function Me(){Z&&(Te+=performance.now()-we,Z=!1)}function ge(){return Z?Me():Fe(),Z}const g={inOut:s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2,out:s=>1-Math.pow(1-s,3),in:s=>s*s*s,back:s=>1+2.2*Math.pow(s-1,3)+1.2*Math.pow(s-1,2)};function o(s){const e=W;return O?Promise.resolve():new Promise(t=>{const r=te()+s,a=()=>{if(e===W){if(te()>=r)return t();requestAnimationFrame(a)}};requestAnimationFrame(a)})}function z({duration:s=600,easing:e=g.inOut,onUpdate:t,onDone:r}={}){let a=null,i=!1;const l=W,c=new Promise(h=>{if(O||s<=0){t?.(1),r?.(),h();return}const m=te(),u=()=>{if(i)return h();if(l!==W)return;const p=Math.min(1,(te()-m)/s);t?.(e(p)),p<1?a=requestAnimationFrame(u):(r?.(),h())};a=requestAnimationFrame(u)});return c.cancel=()=>{i=!0,a&&cancelAnimationFrame(a)},c}const N=(s,e,t)=>s+(e-s)*t,A=(...s)=>Promise.all(s.map(e=>typeof e=="function"?e():e));class Oe{constructor(e,t){this.el=e,this.view=t,this.state={x:t.width/2,y:t.height/2,zoom:1},this.following=null,this.shakeAmount=0,this.apply(),this.tick=this.tick.bind(this),requestAnimationFrame(this.tick)}apply(){const{x:e,y:t,zoom:r}=this.state,a=this.view.width/2,i=this.view.height/2,l=this.shakeAmount?(Math.random()-.5)*this.shakeAmount:0,c=this.shakeAmount?(Math.random()-.5)*this.shakeAmount:0;this.el.setAttribute("transform",`translate(${a+l} ${i+c}) scale(${r}) translate(${-e} ${-t})`)}tick(){if(this.following&&this.following.gen!==P()&&(this.following=null),this.following){const{actor:e,offsetX:t=0,offsetY:r=0,lag:a=.08,map:i}=this.following,l=i?i(e.x,e.y):{x:e.x,y:e.y},c=l.x+t,h=l.y+r;this.state.x=N(this.state.x,c,a),this.state.y=N(this.state.y,h,a),this.apply()}else this.shakeAmount>0&&this.apply();this.shakeAmount>0&&(this.shakeAmount*=.9),this.shakeAmount<.05&&(this.shakeAmount=0),requestAnimationFrame(this.tick)}set({x:e,y:t,zoom:r}={}){return e!==void 0&&(this.state.x=e),t!==void 0&&(this.state.y=t),r!==void 0&&(this.state.zoom=r),this.apply(),this}to({x:e,y:t,zoom:r,duration:a=1400,easing:i=g.inOut}={}){const l={...this.state},c={x:e??l.x,y:t??l.y,zoom:r??l.zoom};return z({duration:a,easing:i,onUpdate:h=>{this.state.x=N(l.x,c.x,h),this.state.y=N(l.y,c.y,h),this.state.zoom=N(l.zoom,c.zoom,h),this.apply()}})}follow(e,t={}){return this.following={actor:e,...t,gen:P()},this}unfollow(){return this.following=null,this}zoomToFitWidth(e){const r=this.el.ownerSVGElement.getBoundingClientRect();if(!r.width||!r.height)return 1;const a=Math.max(r.width/this.view.width,r.height/this.view.height);return r.width/a/e}fitRoom(e,t=.225){return this.zoomToFitWidth(e*t)}shake(e=10){return this.shakeAmount=e,this}}class We{constructor(e,{x:t=0,y:r=0,facing:a="right",scale:i=1}={}){this.el=e,this.figure=e.firstElementChild||e,this.x=t,this.y=r,this.facing=a,this.scale=i,this.pose="idle",this.apply()}apply(){const e=this.facing==="left"?-1:1;this.el.setAttribute("transform",`translate(${this.x} ${this.y}) scale(${e*this.scale} ${this.scale})`)}at(e,t){return this.x=e,t!==void 0&&(this.y=t),this.apply(),this}setPose(e){return this.figure.classList.remove(`pose-${this.pose}`),this.pose=e,this.figure.classList.add(`pose-${e}`),this}express(e){return this.figure.dataset.mood=e,this}async face(e,{duration:t=260}={}){if(this.facing===e)return;const r=e==="left"?-1:1;await z({duration:t/2,easing:g.in,onUpdate:a=>{const i=(1-a)*this.scale;this.el.setAttribute("transform",`translate(${this.x} ${this.y}) scale(${(this.facing==="left"?-1:1)*i} ${this.scale})`)}}),this.facing=e,await z({duration:t/2,easing:g.out,onUpdate:a=>{const i=a*this.scale;this.el.setAttribute("transform",`translate(${this.x} ${this.y}) scale(${r*i} ${this.scale})`)}}),this.apply()}async walkTo(e,{speed:t=300,pose:r="walk"}={}){const a=e<this.x?"left":"right";await this.face(a);const i=this.x,l=Math.abs(e-i);if(l<1)return;const c=l/t*1e3;this.setPose(r),await z({duration:c,easing:g.inOut,onUpdate:h=>{this.x=i+(e-i)*h,this.apply()}}),this.setPose("idle")}beat(e=500){return o(e)}}class Ze{constructor(e){this.el=e,this.pre=e.querySelector(".ca-lines"),this.lines=[],this.texts=[]}at(){return this}dock(){return this.el.classList.add("is-docked"),this}undock(){return this.el.classList.remove("is-docked"),this}async write(e,{stagger:t=420}={}){return this.pre.innerHTML="",this.lines=[],this.texts=[],this.el.classList.add("is-open"),this.append(e,{stagger:t})}async append(e,{stagger:t=420}={}){this.el.classList.add("is-open");for(const r of e){const a=r.match(/^\s*/)[0].length,i=document.createElement("span");i.className="ca-line",i.style.paddingLeft=`${a*.62}em`,i.innerHTML=ye(r.trim())||"&nbsp;",this.pre.appendChild(i),this.lines.push(i),this.texts.push(r),requestAnimationFrame(()=>i.classList.add("is-written")),await o(t)}return this}async retype(e,t,{flash:r=!0}={}){const a=this.lines[e];if(!a)return this;const i=t.match(/^\s*/)[0].length;return a.style.paddingLeft=`${i*.62}em`,a.innerHTML=ye(t.trim())||"&nbsp;",this.texts[e]=t,r&&(a.classList.remove("is-written"),requestAnimationFrame(()=>a.classList.add("is-written")),await o(700)),this}note(e,t){const r=this.lines[e];if(!r)return this;if(r.querySelector(".ca-note")?.remove(),!t)return this;const a=document.createElement("span");return a.className="ca-note",a.textContent=`  # ${t}`,r.appendChild(a),this}clearNotes(){return this.pre.querySelectorAll(".ca-note").forEach(e=>e.remove()),this}mark(e,t){return this.lines[e]?.classList.add(t),this}unmark(e){return this.lines.forEach(t=>t.classList.remove(e)),this}focus(e){return this.lines.forEach((t,r)=>t.classList.toggle("is-running",r===e)),this}unfocus(){return this.lines.forEach(e=>e.classList.remove("is-running")),this}async clear({duration:e=700}={}){return this.el.classList.remove("is-open"),await o(e),this.pre.innerHTML="",this.lines=[],this.texts=[],this}}function ye(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}const d=-246,E=46,$=-190,S=-104;function $e(s,e){return`
  <g class="limb ${e}">
    <path class="churidar" d="M ${s-13} ${S}
      C ${s-15} ${S+46} ${s-13} -40 ${s-11} -12
      L ${s+11} -12
      C ${s+13} -40 ${s+15} ${S+46} ${s+13} ${S} Z" />
    <path class="cuff" d="M ${s-12} -26 L ${s+12} -26 L ${s+11} -14 L ${s-11} -14 Z" />
    <ellipse class="slipper" cx="${s+3}" cy="-5" rx="19" ry="9" />
  </g>`}function fe(s,e,t=""){return`
  <g class="limb ${e}">
    <path class="sleeve" d="M ${s} ${$+4}
      C ${s+6} ${$+40} ${s+8} ${$+66} ${s+6} ${$+86}
      L ${s-14} ${$+86}
      C ${s-16} ${$+62} ${s-14} ${$+36} ${s-12} ${$+4} Z" />
    <circle class="skin" cx="${s-4}" cy="${$+94}" r="12" />
    ${t}
  </g>`}function Qe(s,e){return`
  <g class="prop prop-lantern" transform="translate(${s} ${e})">
    <path class="lan-hoop" d="M -16 -4 C -16 -30 16 -30 16 -4" />
    <rect class="lan-cap" x="-19" y="-6" width="38" height="10" rx="4" />
    <path class="lan-glass" d="M -17 4 L 17 4 L 13 44 L -13 44 Z" />
    <circle class="lan-halo" cx="0" cy="24" r="82" />
    <path class="lan-flame" d="M 0 10 C 9 22 7 36 0 36 C -7 36 -9 22 0 10 Z" />
    <rect class="lan-base" x="-16" y="42" width="32" height="9" rx="4" />
  </g>`}function Ne(s,e){return`
  <g class="prop prop-megaphone" transform="translate(${s} ${e})">
    <path class="meg-body" d="M -6 -14 L -6 14 L 42 34 L 42 -34 Z" />
    <ellipse class="meg-mouth" cx="42" cy="0" rx="9" ry="34" />
    <rect class="meg-grip" x="-20" y="-9" width="16" height="18" rx="6" />
  </g>`}function je(){return`
<g class="tara pose-idle" data-mood="neutral">
  <ellipse class="shadow" cx="4" cy="2" rx="62" ry="12" />

  <!-- far side limbs sit behind the body -->
  ${$e(-17,"leg-far")}
  ${fe(-46,"arm-far")}

  <!-- braid falls behind the shoulder -->
  <g class="braid">
    <path class="hair" d="M -34 ${d+6}
      C -66 ${d+40} -64 ${d+116} -46 ${d+152}
      L -26 ${d+146}
      C -44 ${d+112} -46 ${d+44} -18 ${d+16} Z" />
    <circle class="ribbon" cx="-36" cy="${d+150}" r="11" />
  </g>

  <!-- body -->
  <g class="body">
    <path class="kurta" d="M -32 ${$-6}
      C -48 ${$+22} -50 ${S-20} -54 ${S+16}
      L 54 ${S+16}
      C 50 ${S-20} 44 ${$+22} 32 ${$-6}
      C 18 ${$-18} -18 ${$-18} -32 ${$-6} Z" />
    <path class="kurta-hem" d="M -54 ${S+4} L 54 ${S+4} L 54 ${S+16} L -54 ${S+16} Z" />
    <path class="dupatta" d="M -30 ${$-2}
      C -6 ${$+26} 22 ${$+22} 34 ${$+2}
      C 44 ${$+54} 38 ${S+6} 26 ${S+30}
      L 8 ${S+24}
      C 22 ${S-6} 28 ${$+58} 20 ${$+34}
      C 4 ${$+46} -18 ${$+40} -30 ${$+22} Z" />
  </g>

  <!-- near side limbs -->
  ${$e(17,"leg-near")}
  ${fe(48,"arm-near",Qe(40,$+104)+Ne(40,$+96))}

  <!-- head. The hair is a full disc sitting behind a slightly lower, slightly
       forward face disc: that leaves a clean hair rim over the crown. A single
       curved cap never reaches the top of the skull and leaves it bald. -->
  <g class="head">
    <circle class="hair" cx="-2" cy="${d-6}" r="${E+5}" />
    <circle class="skin" cx="3" cy="${d+4}" r="${E}" />
    <path class="hair" d="M ${-E+2} ${d-6}
      C ${-E+4} ${d-34} ${E-6} ${d-40} ${E+1} ${d-12}
      C ${E-12} ${d-26} 4 ${d-30} -10 ${d-16}
      C -22 ${d-6} ${-E+6} ${d+2} ${-E+2} ${d-6} Z" />
    <circle class="flower" cx="34" cy="${d-32}" r="9" />
    <circle class="flower-mid" cx="34" cy="${d-32}" r="3.8" />

    <g class="face">
      <circle class="blush" cx="-20" cy="${d+14}" r="10" />
      <circle class="blush" cx="30" cy="${d+14}" r="10" />

      <g class="eyes">
        <g class="eye">
          <ellipse class="eye-white" cx="-6" cy="${d-2}" rx="10" ry="12" />
          <circle class="pupil" cx="-4" cy="${d}" r="6" />
          <circle class="glint" cx="-7" cy="${d-4}" r="2.6" />
        </g>
        <g class="eye">
          <ellipse class="eye-white" cx="22" cy="${d-2}" rx="10" ry="12" />
          <circle class="pupil" cx="24" cy="${d}" r="6" />
          <circle class="glint" cx="21" cy="${d-4}" r="2.6" />
        </g>
      </g>

      <!-- every mood is drawn; CSS reveals one -->
      <g class="brows">
        <g class="brow-set" data-for="neutral">
          <path d="M -16 ${d-20} Q -6 ${d-26} 4 ${d-21}" />
          <path d="M 14 ${d-21} Q 24 ${d-26} 32 ${d-20}" />
        </g>
        <g class="brow-set" data-for="curious">
          <path d="M -16 ${d-22} Q -6 ${d-30} 4 ${d-24}" />
          <path d="M 14 ${d-28} Q 24 ${d-36} 32 ${d-27}" />
        </g>
        <g class="brow-set" data-for="surprised">
          <path d="M -17 ${d-29} Q -6 ${d-38} 5 ${d-30}" />
          <path d="M 13 ${d-30} Q 24 ${d-38} 33 ${d-29}" />
        </g>
        <g class="brow-set" data-for="confused">
          <path d="M -16 ${d-26} Q -6 ${d-18} 4 ${d-24}" />
          <path d="M 14 ${d-30} Q 24 ${d-37} 32 ${d-28}" />
        </g>
        <g class="brow-set" data-for="happy">
          <path d="M -16 ${d-24} Q -6 ${d-31} 4 ${d-25}" />
          <path d="M 14 ${d-25} Q 24 ${d-31} 32 ${d-24}" />
        </g>
      </g>

      <g class="mouths">
        <path class="mouth-set" data-for="neutral"   d="M 2 ${d+24} Q 10 ${d+30} 18 ${d+24}" />
        <path class="mouth-set" data-for="curious"   d="M 3 ${d+23} Q 10 ${d+31} 17 ${d+23}" />
        <path class="mouth-set open" data-for="surprised" d="M 10 ${d+27} m -8 0 a 8 9 0 1 0 16 0 a 8 9 0 1 0 -16 0" />
        <path class="mouth-set" data-for="confused" d="M 2 ${d+28} Q 10 ${d+22} 18 ${d+27}" />
        <path class="mouth-set open" data-for="happy" d="M 0 ${d+22} Q 10 ${d+38} 20 ${d+22} Z" />
      </g>
    </g>
  </g>

  <!-- Mithu rides on her shoulder -->
  <!-- positioning on the OUTER group: the hop animation below sets transform,
       and a CSS transform replaces the SVG attribute rather than composing. -->
  <g class="mithu-perch" transform="translate(46 ${$-14}) scale(0.34)">
    <g class="mithu-hop">${Ae()}</g>
  </g>
</g>`}function Ae(){return`
<g class="mithu">
  <g class="mithu-tail">
    <path class="tail" d="M -26 -40 L -86 18 L -58 14 L -10 -22 Z" />
  </g>
  <g class="mithu-body">
    <ellipse class="body" cx="0" cy="-54" rx="40" ry="52" />
    <path class="belly" d="M 10 -96 C 34 -80 36 -34 12 -10 C 34 -30 42 -74 10 -96 Z" />
    <g class="mithu-head">
      <circle class="body" cx="14" cy="-112" r="31" />
      <path class="cheek" d="M 30 -104 a 12 10 0 1 0 0.1 0" />
      <path class="beak" d="M 40 -118 C 62 -114 62 -98 40 -96 C 46 -104 46 -110 40 -118 Z" />
      <path class="beak-lower" d="M 40 -100 C 52 -99 52 -94 42 -93 Z" />
      <g class="mithu-eye">
        <circle class="eye-white" cx="22" cy="-120" r="9" />
        <circle class="pupil" cx="24" cy="-119" r="5.2" />
        <circle class="glint" cx="21" cy="-122" r="2.2" />
      </g>
      <path class="crest" d="M 6 -140 C 2 -164 16 -172 24 -160 C 20 -152 14 -146 6 -140 Z" />
    </g>
    <g class="mithu-wing">
      <path class="wing" d="M -2 -84 C -34 -74 -36 -32 -6 -22 C -18 -46 -18 -66 -2 -84 Z" />
    </g>
  </g>
  <g class="mithu-feet">
    <path class="foot" d="M -6 -6 L -6 6 M -16 8 L 6 8" />
  </g>
</g>`}function _(s,e,t,r,a="stone"){const i=t/2;return`<g class="${a}">
    <path d="M ${s-i} ${e}
             C ${s-i} ${e-r*.5} ${s-i*.62} ${e-r*.8} ${s} ${e-r}
             C ${s+i*.62} ${e-r*.8} ${s+i} ${e-r*.5} ${s+i} ${e} Z" />
    <rect x="${s-3}" y="${e-r-28}" width="6" height="30" rx="3" />
    <circle cx="${s}" cy="${e-r-34}" r="7" />
  </g>`}function ae(s,e,t,r){const a=t/2,i=s+a;return`M ${s} ${e+r}
          L ${s} ${e+a*.72}
          Q ${s} ${e} ${i} ${e-a*.28}
          Q ${s+t} ${e} ${s+t} ${e+a*.72}
          L ${s+t} ${e+r} Z`}function ue(s,e,t,r,a="arch"){return`<path class="${a}" d="${ae(s,e,t,r)}" />`}function K(s,e,t,r,a=0){return`<path class="lit-window" style="animation-delay:${a}s" d="${ae(s,e,t,r)}" />`}function U(s,e,t,r,a,i,l="arch"){const c=l==="lit"?K:ue;return Array.from({length:t},(h,m)=>l==="lit"?c(s+m*(r+i),e,r,a,m*.83%5):c(s+m*(r+i),e,r,a)).join("")}function ie(s,e,t,r=30){const a=r/2;return`<g class="stone">
    <rect x="${s-a}" y="${e}" width="${r}" height="${t-e}" rx="4" />
    <rect x="${s-a-9}" y="${e-14}" width="${r+18}" height="16" rx="5" />
    <rect x="${s-a-11}" y="${t-14}" width="${r+22}" height="16" rx="5" />
  </g>`}function B(s,e,t,r){const a=t/2;return`<g class="stone">
    <rect x="${s-a}" y="${e-7}" width="${t}" height="8" rx="4" />
    <rect x="${s-a+5}" y="${e-r}" width="6" height="${r-7}" />
    <rect x="${s+a-11}" y="${e-r}" width="6" height="${r-7}" />
  </g>${_(s,e-r,t*.9,r*.7)}`}function pe(s=0,e=18,t={x:0,y:0,w:1600,h:900}){let r=s*9301+49297;const a=()=>(r=(r*9301+49297)%233280)/233280;return`<g class="motes">${Array.from({length:e},()=>{const i=t.x+a()*t.w,l=t.y+a()*t.h,c=2+a()*2.6,h=(a()*9).toFixed(2),m=(7+a()*7).toFixed(2);return`<circle cx="${i}" cy="${l}" r="${c}" style="animation-delay:${h}s; animation-duration:${m}s" />`}).join("")}</g>`}function Le(s,e,t,r,a=2.6){const i=s+t/2;return`<path class="light-shaft" d="M ${s} ${e} L ${s+t} ${e}
    L ${i+t*a/2} ${e+r} L ${i-t*a/2} ${e+r} Z" />`}function Ge(){return`
<defs>
  <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="#140a2c" />
    <stop offset="45%"  stop-color="#2a1550" />
    <stop offset="76%"  stop-color="#5d2a5c" />
    <stop offset="100%" stop-color="#8d4463" />
  </linearGradient>
  <radialGradient id="moonGlow">
    <stop offset="0%"   stop-color="rgba(255,226,167,0.45)" />
    <stop offset="100%" stop-color="rgba(255,226,167,0)" />
  </radialGradient>
  <radialGradient id="wordGlow">
    <stop offset="0%"   stop-color="rgba(255,222,150,0.85)" />
    <stop offset="52%"  stop-color="rgba(255,198,110,0.32)" />
    <stop offset="100%" stop-color="rgba(255,198,110,0)" />
  </radialGradient>
  <radialGradient id="lampGlow">
    <stop offset="0%"   stop-color="rgba(255,210,122,0.42)" />
    <stop offset="100%" stop-color="rgba(255,210,122,0)" />
  </radialGradient>
  <linearGradient id="shaft" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="rgba(255,212,137,0.30)" />
    <stop offset="100%" stop-color="rgba(255,212,137,0)" />
  </linearGradient>
</defs>`}const q={floorY:420,taraX:60,wallX:-1090,doorX:390};function Xe(){const{floorY:s}=q;return`
<g class="room">
  <!-- back wall and floor -->
  <rect class="room-wall" x="-1180" y="-620" width="1700" height="${s+620}" />
  <rect class="room-floor" x="-1180" y="${s}" width="1700" height="520" />
  <rect class="room-skirting" x="-1180" y="${s-16}" width="1700" height="20" />

  <!-- wall niches -->
  <g class="room-niche">
    ${ue(-1020,40,130,300,"niche")}
    ${ue(-840,40,130,300,"niche")}
  </g>

  <!-- rug -->
  <ellipse class="rug" cx="-320" cy="${s+150}" rx="520" ry="98" />
  <ellipse class="rug-in" cx="-320" cy="${s+150}" rx="380" ry="66" />

  <!-- bed -->
  <g class="bed">
    <rect class="bed-frame" x="-1080" y="${s-30}" width="520" height="150" rx="16" />
    <rect class="bed-sheet" x="-1060" y="${s-64}" width="480" height="60" rx="26" />
    <rect class="bed-pillow" x="-1044" y="${s-104}" width="160" height="70" rx="32" />
    <rect class="bed-post" x="-1090" y="${s-250}" width="26" height="240" rx="12" />
    <circle class="bed-knob" cx="-1077" cy="${s-258}" r="18" />
  </g>

  <!-- bookshelf and books -->
  <g class="shelf">
    <rect class="shelf-board" x="-560" y="${s-216}" width="250" height="16" rx="6" />
    <rect class="book b1" x="-548" y="${s-292}" width="34" height="78" rx="5" />
    <rect class="book b2" x="-508" y="${s-278}" width="28" height="64" rx="5" />
    <rect class="book b3" x="-474" y="${s-300}" width="36" height="86" rx="5" />
    <rect class="book b4" x="-432" y="${s-268}" width="26" height="54" rx="5" />
    <rect class="book b5" x="-400" y="${s-286}" width="32" height="72" rx="5" />
  </g>

  <!-- little table with the oil lamp -->
  <g class="lamp-table">
    <rect class="table-top" x="-320" y="${s-130}" width="200" height="18" rx="8" />
    <rect class="table-leg" x="-296" y="${s-112}" width="18" height="112" rx="7" />
    <rect class="table-leg" x="-164" y="${s-112}" width="18" height="112" rx="7" />
    <g class="lamp">
      <circle class="lamp-halo" cx="-220" cy="${s-196}" r="230" fill="url(#lampGlow)" />
      <path class="lamp-dish" d="M -272 ${s-134} Q -220 ${s-104} -168 ${s-134}
        L -180 ${s-158} L -260 ${s-158} Z" />
      <g class="lamp-flame">
        <path class="flame-outer" d="M -220 ${s-232} C -196 ${s-198} -200 ${s-158} -220 ${s-158}
          C -240 ${s-158} -244 ${s-198} -220 ${s-232} Z" />
        <path class="flame-inner" d="M -220 ${s-206} C -210 ${s-190} -212 ${s-168} -220 ${s-168}
          C -228 ${s-168} -230 ${s-190} -220 ${s-206} Z" />
      </g>
    </g>
  </g>

  <!-- hanging lanterns -->
  <g class="hang-lantern l1">
    <line class="cord" x1="-700" y1="-620" x2="-700" y2="-300" />
    <path class="lantern-body" d="M -736 -300 L -664 -300 L -648 -236 L -700 -206 L -752 -236 Z" />
    <circle class="lantern-core" cx="-700" cy="-256" r="16" />
  </g>
  <g class="hang-lantern l2">
    <line class="cord" x1="-460" y1="-620" x2="-460" y2="-380" />
    <path class="lantern-body" d="M -490 -380 L -430 -380 L -418 -328 L -460 -302 L -502 -328 Z" />
    <circle class="lantern-core" cx="-460" cy="-344" r="13" />
  </g>

  <!-- the window we came through -->
  <g class="room-window">
    <path class="window-night" d="M -190 260 L -190 -110
      Q -190 -330 0 -390 Q 190 -330 190 -110 L 190 260 Z" />
    <g class="window-stars">
      <circle cx="-96" cy="-160" r="4" /><circle cx="40" cy="-250" r="3.2" />
      <circle cx="118" cy="-80" r="3.6" /><circle cx="-40" cy="-40" r="2.8" />
    </g>
    <circle class="window-moon" cx="106" cy="-200" r="42" />
    <rect class="window-sill" x="-232" y="252" width="464" height="26" rx="10" />
    <rect class="window-mullion" x="-8" y="-380" width="16" height="640" />
    <rect class="window-mullion" x="-190" y="-20" width="380" height="14" />
  </g>

  <!-- curtains, always breathing -->
  <g class="curtain curtain-left">
    <path d="M -400 -420 L -196 -420 C -214 -180 -206 60 -190 300 L -400 320 Z" />
  </g>
  <g class="curtain curtain-right">
    <path d="M 400 -420 L 196 -420 C 214 -180 206 60 190 300 L 400 320 Z" />
  </g>
  <g class="curtain-rod"><rect x="-420" y="-436" width="840" height="18" rx="9" /></g>

  <!-- The door: the way out that the word never manages to take.
       The leaf, its panels and the knob are wrapped in one group so they swing
       together on the hinge; door-void is the dark of the corridor behind,
       which is what actually reads as "open" once the leaf moves off it. -->
  <g class="room-door">
    <rect class="door-frame" x="264" y="-140" width="252" height="${s+140}" rx="10" />
    <rect class="door-void"  x="280" y="-124" width="220" height="${s+124}" rx="8" />
    <g class="door-swing">
      <rect class="door-leaf"  x="280" y="-124" width="220" height="${s+124}" rx="8" />
      <rect class="door-panel" x="306" y="-92"  width="168" height="150" rx="6" />
      <rect class="door-panel" x="306" y="86"   width="168" height="190" rx="6" />
      <circle class="door-knob" cx="470" cy="200" r="13" />
    </g>
  </g>

  <!-- where a word strikes the far wall; positioned and triggered from a scene -->
  <g class="wall-ripple">
    <circle class="wr r1" r="30" /><circle class="wr r2" r="30" /><circle class="wr r3" r="30" />
  </g>

  <!-- dust in the lamplight -->
  ${pe(21,8,{x:-900,y:-400,w:1300,h:800})}
</g>`}const T={x0:560,x1:3180,floorY:q.floorY,centreX:1840,askX:1760};function He(s,e){return`
<g class="fountain">
  <ellipse class="water-pool" cx="${s}" cy="${e}" rx="260" ry="66" />
  <path class="basin" d="M ${s-270} ${e-6} Q ${s} ${e+74} ${s+270} ${e-6}
    L ${s+250} ${e-40} L ${s-250} ${e-40} Z" />
  <rect class="basin" x="${s-34}" y="${e-210}" width="68" height="175" rx="16" />
  <ellipse class="basin-top" cx="${s}" cy="${e-212}" rx="132" ry="32" />
  <ellipse class="water-top" cx="${s}" cy="${e-216}" rx="112" ry="24" />
  <g class="jets">
    ${[-86,-44,0,44,86].map((t,r)=>`
      <path class="jet" style="animation-delay:${(r*.23).toFixed(2)}s"
        d="M ${s+t} ${e-226} Q ${s+t*1.5} ${e-150} ${s+t*1.9} ${e-46}" />`).join("")}
  </g>
  <g class="ripples">
    <ellipse class="rp r1" cx="${s}" cy="${e+6}" rx="60" ry="16" />
    <ellipse class="rp r2" cx="${s}" cy="${e+6}" rx="60" ry="16" />
    <ellipse class="rp r3" cx="${s}" cy="${e+6}" rx="60" ry="16" />
  </g>
</g>`}function D(s,e,t=1){return`
<g class="plant" transform="translate(${s} ${e}) scale(${t})">
  <path class="pot" d="M -52 0 L 52 0 L 38 92 L -38 92 Z" />
  <rect class="pot-rim" x="-60" y="-16" width="120" height="22" rx="9" />
  <g class="fronds">
    <path class="frond" d="M 0 -10 C -70 -40 -96 -120 -58 -176 C -30 -126 -14 -64 0 -10 Z" />
    <path class="frond" d="M 0 -10 C 64 -46 92 -126 52 -180 C 26 -126 12 -62 0 -10 Z" />
    <path class="frond" d="M 0 -10 C -26 -86 -8 -166 20 -200 C 24 -136 12 -66 0 -10 Z" />
  </g>
</g>`}function ne(s,e,t,r=0){return`
<g class="court-lantern" style="animation-delay:${r}s">
  <line class="chain" x1="${s}" y1="${e}" x2="${s}" y2="${t}" />
  <path class="lantern-shell" d="M ${s-40} ${t} L ${s+40} ${t}
    L ${s+26} ${t+84} L ${s-26} ${t+84} Z" />
  <rect class="lantern-cap" x="${s-46}" y="${t-14}" width="92" height="18" rx="7" />
  <circle class="lantern-glow" cx="${s}" cy="${t+40}" r="26" />
</g>`}function Ie(){const{x0:s,x1:e,floorY:t,centreX:r}=T,a=-760;return`
<g class="courtyard">
  <!-- open sky above the courtyard -->
  <rect class="court-sky" x="${s}" y="-1180" width="${e-s}" height="${-a+1180-0}" />
  <g class="court-stars">
    ${[[820,-1040],[1180,-930],[1520,-1090],[1980,-960],[2420,-1050],[2760,-900],[1340,-1150],[2180,-1130],[2960,-1e3]].map(([i,l],c)=>`<circle class="${c%3?"still":""}" cx="${i}" cy="${l}" r="${c%2?6:8}" style="animation-delay:${c*.7}s" />`).join("")}
  </g>
  <circle class="court-moon" cx="2560" cy="-1010" r="96" />

  <!-- back wall, gallery and arcade -->
  <rect class="court-wall" x="${s}" y="${a}" width="${e-s}" height="${t-a}" />
  <rect class="court-band" x="${s}" y="${a}" width="${e-s}" height="34" />

  <!-- upper balconies -->
  <g class="balconies">
    ${[900,1500,2100,2700].map((i,l)=>`
      <g class="balcony">
        <rect class="balcony-floor" x="${i-130}" y="${a+300}" width="260" height="26" rx="8" />
        <rect class="balcony-rail"  x="${i-124}" y="${a+236}" width="248" height="16" rx="7" />
        ${[0,1,2,3,4].map(c=>`<rect class="baluster" x="${i-112+c*54}" y="${a+250}" width="13" height="52" rx="5" />`).join("")}
        <path class="balcony-arch" d="${ae(i-96,a+60,192,178)}" />
        <g class="court-curtain" style="animation-delay:${l*.8}s">
          <path d="M ${i-92} ${a+64} L ${i-30} ${a+64} C ${i-38} ${a+140} ${i-34} ${a+200} ${i-26} ${a+236} L ${i-92} ${a+238} Z" />
        </g>
      </g>`).join("")}
  </g>

  <!-- ground-level arcade -->
  <g class="court-arcade">
    ${[760,1180,2500,2920].map(i=>`
      <path class="court-niche" d="${ae(i-110,t-430,220,430)}" />`).join("")}
    ${ie(970,t-470,t,46)}
    ${ie(2710,t-470,t,46)}
  </g>

  <!-- moonlight falling into the open court -->
  ${Le(1420,a+40,300,t-a-40,1.9)}
  ${Le(2260,a+40,240,t-a-40,1.7)}

  <!-- lanterns -->
  ${ne(1300,a+40,-190,0)}
  ${ne(2380,a+40,-250,1.1)}
  ${ne(1820,a+40,-330,.55)}

  <!-- floor -->
  <rect class="court-floor" x="${s}" y="${t}" width="${e-s}" height="560" />
  <g class="court-tiles">
    ${Array.from({length:13},(i,l)=>`<rect x="${s+l*200}" y="${t}" width="5" height="560" />`).join("")}
    ${Array.from({length:4},(i,l)=>`<rect x="${s}" y="${t+90+l*120}" width="${e-s}" height="5" />`).join("")}
  </g>
  <rect class="court-step" x="${s}" y="${t-14}" width="${e-s}" height="18" rx="6" />

  ${He(r,t-30)}

  ${D(760,t,1)}
  ${D(2980,t,1.1)}
  ${D(1140,t,.78)}
  ${D(2620,t,.86)}

  ${pe(41,12,{x:s,y:-760,w:e-s,h:1200})}
</g>`}function Ue(){return`
<g class="ask-anchor">
<g class="ask-prompt" role="button" tabindex="0" aria-label="Ask for the secret">
  <ellipse class="ask-aura" cx="0" cy="0" rx="330" ry="120" />
  <rect class="ask-hit" x="-360" y="-130" width="720" height="260" rx="130" />
  <g class="ask-motes">
    ${[[-210,-46,0],[190,-62,.8],[-120,58,1.6],[240,40,2.2],[40,-86,1.2],[-260,18,2.8]].map(([s,e,t])=>`<circle cx="${s}" cy="${e}" r="5" style="animation-delay:${t}s" />`).join("")}
  </g>
  <path class="ask-underline" d="M -196 46 Q 0 74 196 46" />
  <text class="ask-text" x="0" y="12" text-anchor="middle">Ask for the secret</text>
</g>
</g>`}function Be(){return`
<g class="ask-speech-anchor">
<g class="ask-speech">
  <ellipse class="speech-aura" cx="0" cy="0" rx="420" ry="118" />
  <text class="speech-text" x="0" y="10" text-anchor="middle">Where is my secret?</text>
</g>
</g>`}function De(){return`
<g class="q-motes">
  ${[[-230,30,0],[-90,-40,.35],[70,10,.7],[220,-30,1.05],[-10,70,1.4],[160,80,1.75]].map(([e,t,r])=>`
    <text class="q" x="${e}" y="${t}" text-anchor="middle" style="animation-delay:${r}s">?</text>`).join("")}
</g>`}const H={x0:-1560,x1:3520,roofY:-1320,baseY:1010};function Ye(){return`
<g class="kingdom">
  <rect class="kd-sky" x="-6000" y="-4200" width="16000" height="7600" />
  <g class="kd-stars is-still">
    ${[[-3200,-2600],[-2400,-1800],[-1e3,-3e3],[600,-2400],[2200,-2900],[4200,-2e3],[5400,-2700],[-4200,-1400],[3400,-3300],[1400,-3400],[-2e3,-3400],[4800,-1200]].map(([s,e],t)=>`<circle cx="${s}" cy="${e}" r="${18+t%3*8}" style="animation-delay:${t*.5}s" />`).join("")}
  </g>
  <circle class="kd-moon" cx="-2900" cy="-2500" r="210" />
  <path class="kd-hills" d="M -6000 1180 Q -3600 780 -1400 1120 Q 900 1420 3200 1060 Q 6200 700 10000 1160
    L 10000 3400 L -6000 3400 Z" />
  <path class="kd-hills far" d="M -6000 980 Q -3000 600 -600 940 Q 1800 1240 4400 860 Q 7400 520 10000 960
    L 10000 3400 L -6000 3400 Z" />
</g>`}function _e(){const{x0:s,x1:e,roofY:t,baseY:r}=H;return`
<g class="shell">
  <path class="shell-roof" d="M ${s-140} ${t+250} L ${(s+e)/2} ${t-210}
    L ${e+140} ${t+250} L ${e+140} ${t+330} L ${s-140} ${t+330} Z" />
  <rect class="shell-wall" x="${s}" y="${t+300}" width="220" height="${r-t-300}" />
  <rect class="shell-wall" x="${e-220}" y="${t+300}" width="220" height="${r-t-300}" />
  <rect class="shell-band" x="${s-60}" y="${t+300}" width="${e-s+120}" height="46" />
  <rect class="shell-base" x="${s-200}" y="${r}" width="${e-s+400}" height="150" />
  <g class="shell-windows">
    ${[-1460,-1380,3380,3440].map((a,i)=>`<rect class="shell-lit" x="${a}" y="${t+520+i%2*190}" width="52" height="104" rx="24"
             style="animation-delay:${i*.9}s" />`).join("")}
  </g>
</g>`}function Ke(){const s={x0:-1200,x1:540,y0:-640,y1:q.floorY+120},e={x0:T.x0-20,x1:T.x1+20,y0:-800,y1:T.floorY+200},t={x0:H.x0-80,x1:H.x1+80,y0:H.roofY-160,y1:H.baseY+90};return`
<g class="layer-glows">
  <!-- 1 · her room -->
  <g class="lg lg-local">
    <rect class="lg-fill"   x="${s.x0}" y="${s.y0}" width="${s.x1-s.x0}" height="${s.y1-s.y0}" rx="26" />
    <rect class="lg-stroke" x="${s.x0}" y="${s.y0}" width="${s.x1-s.x0}" height="${s.y1-s.y0}" rx="26" />
  </g>

  <!-- 2 · the courtyard. Drawn growing OUT of the room, because it only counts
          as an enclosing space by virtue of the room sitting inside it. -->
  <g class="lg lg-enclosing">
    <rect class="lg-fill"   x="${e.x0}" y="${e.y0}" width="${e.x1-e.x0}" height="${e.y1-e.y0}" rx="30" />
    <rect class="lg-stroke" x="${e.x0}" y="${e.y0}" width="${e.x1-e.x0}" height="${e.y1-e.y0}" rx="30" />
    <path class="lg-link" d="M ${s.x1} ${q.floorY-200} L ${e.x0} ${q.floorY-200}" />
  </g>

  <!-- 3 · the whole palace -->
  <g class="lg lg-global">
    <rect class="lg-fill"   x="${t.x0}" y="${t.y0}" width="${t.x1-t.x0}" height="${t.y1-t.y0}" rx="46" />
    <rect class="lg-stroke" x="${t.x0}" y="${t.y0}" width="${t.x1-t.x0}" height="${t.y1-t.y0}" rx="46" />
  </g>

  <!-- 4 · everything beyond it -->
  <g class="lg lg-builtin">
    <rect class="lg-stroke outer" x="${t.x0-900}" y="${t.y0-820}"
          width="${t.x1-t.x0+1800}" height="${t.y1-t.y0+1700}" rx="120" />
  </g>
</g>`}function j(s,e,t,r,a=""){return`
<g class="mlabel mlabel-${s}" transform="translate(${t} ${r})">
  <g class="ml-motes">
    ${[[-150,-30,0],[140,-44,.6],[-60,46,1.2],[110,40,1.8],[10,-62,.9]].map(([l,c,h])=>`<circle r="7" style="--mx:${l}px; --my:${c}px; animation-delay:${h}s" />`).join("")}
  </g>
  <path class="ml-rule" d="M -172 52 Q 0 74 172 52" />
  <text class="ml-text" x="0" y="0" text-anchor="middle">${e}</text>
  ${a?`<text class="ml-note" x="0" y="112" text-anchor="middle">${a}</text>`:""}
</g>`}function Ve(){return`
<g class="perch-stand">
  <rect class="perch-post" x="-9" y="-250" width="18" height="250" rx="9" />
  <rect class="perch-bar"  x="-92" y="-262" width="184" height="16" rx="8" />
  <ellipse class="perch-foot" cx="0" cy="4" rx="74" ry="17" />
  <g class="perch-bird" transform="translate(0 -262) scale(0.62)">
    ${Ae()}
  </g>
</g>`}function Je(){return`
<g class="error-spell">
  <g class="err-smoke">
    ${[[-300,0,0],[-120,-40,.5],[80,20,1],[260,-30,1.5],[-40,60,.8],[190,70,1.9]].map(([s,e,t])=>`<ellipse cx="${s}" cy="${e}" rx="150" ry="70" style="animation-delay:${t}s" />`).join("")}
  </g>
  <g class="err-shards">
    ${[[-380,-90],[-190,110],[40,-130],[250,90],[420,-60],[-60,140]].map(([s,e],t)=>`<path d="M ${s} ${e} l 26 -46 l 20 52 z" style="animation-delay:${t*.14}s" />`).join("")}
  </g>
  <text class="err-text" x="0" y="0" text-anchor="middle">UnboundLocalError</text>
  <path class="err-crack" d="M -430 46 L -300 20 L -170 58 L -30 14 L 110 56 L 250 18 L 430 50" />
</g>`}function es(){return`
<g class="trails">
  <path class="read-out"   d="M -360 -260 C 260 -780 1080 -1120 1800 -1160" />
  <path class="read-local" d="M -360 -250 C -430 -300 -500 -320 -560 -308" />
  <path class="read-blocked" d="M -360 -260 C -250 -300 -150 -330 -40 -344" />
  <g class="block-wall">
    <path class="bw-line" d="M 20 -520 L 20 -60" />
    <g class="bw-sparks">
      ${[-380,-280,-180].map((s,e)=>`<circle cx="20" cy="${s}" r="12" style="animation-delay:${e*.18}s" />`).join("")}
    </g>
  </g>
</g>`}const n={x:1600,y:300,w:380,h:520,scale:.225},C=980,xe=(()=>{let s=12345;const e=()=>(s=(s*9301+49297)%233280)/233280;return Array.from({length:44},()=>({x:-1400+e()*5e3,y:-1500+e()*1900,r:1.6+e()*3.4,d:(e()*6).toFixed(2),layer:e()<.4?"far":"near"}))})();function Y(s,e,t,r,a){return`<g class="cloud" style="animation-delay:${r}s; animation-duration:${a}s"
     transform="translate(${s} ${e}) scale(${t})">
    <ellipse cx="0" cy="0" rx="200" ry="40" />
    <ellipse cx="-110" cy="14" rx="120" ry="30" />
    <ellipse cx="116" cy="16" rx="140" ry="34" />
    <ellipse cx="20" cy="-24" rx="96" ry="32" />
  </g>`}function ce(s,e,t,r){return`<g class="flagpole-g">
    <rect class="flagpole" x="${s-3}" y="${e-t}" width="6" height="${t+26}" rx="3" />
    <circle class="flagpole" cx="${s}" cy="${e-t-5}" r="6" />
    <path class="pennant" style="animation-delay:${r}s"
      d="M ${s+3} ${e-t+2} L ${s+44} ${e-t+14} L ${s+3} ${e-t+26} Z" />
  </g>`}function ss(){return`
<g class="sky-group">
  <rect x="-2600" y="-1900" width="8000" height="3400" fill="url(#nightSky)" />
  <circle cx="620" cy="-960" r="430" fill="url(#moonGlow)" />
  <circle class="moon" cx="620" cy="-960" r="104" />
  <circle class="moon-crater" cx="586" cy="-990" r="18" />
  <circle class="moon-crater" cx="650" cy="-930" r="12" />
  <circle class="moon-crater" cx="638" cy="-1004" r="9" />

  <g class="stars far">
    ${xe.filter(s=>s.layer==="far").map((s,e)=>`<circle class="${e%2?"still":""}" cx="${s.x}" cy="${s.y}" r="${s.r*.7}" style="animation-delay:${s.d}s" />`).join("")}
  </g>
  <g class="stars near">
    ${xe.filter(s=>s.layer==="near").map((s,e)=>`<circle class="${e%2?"still":""}" cx="${s.x}" cy="${s.y}" r="${s.r}" style="animation-delay:${s.d}s" />`).join("")}
  </g>

  <g class="clouds">
    ${Y(-900,-1180,1.1,0,96)}
    ${Y(-1700,-760,.8,16,122)}
    ${Y(-500,-420,1.35,40,148)}
    ${Y(-2100,-1420,.9,62,134)}
  </g>
</g>

<!-- distant ridges -->
<g class="ridge far-ridge">
  <path d="M -2600 780 Q -1400 600 -400 760 Q 600 900 1600 720 Q 2700 540 4000 760 L 4000 1500 L -2600 1500 Z" />
</g>
<g class="ridge near-ridge">
  <path d="M -2600 900 Q -1200 800 -200 900 Q 900 1000 2000 880 Q 3100 780 4000 900 L 4000 1500 L -2600 1500 Z" />
</g>

<!-- the palace -->
<g class="palace">
  <!-- outer wings -->
  <rect class="stone" x="880" y="700" width="200" height="${C-700}" rx="6" />
  ${B(980,700,74,58)}
  <rect class="stone" x="2120" y="700" width="200" height="${C-700}" rx="6" />
  ${B(2220,700,74,58)}
  ${U(906,800,2,56,150,44,"lit")}
  ${U(2146,800,2,56,150,44,"lit")}

  <!-- flanking towers -->
  <rect class="stone" x="1120" y="420" width="112" height="${C-420}" rx="6" />
  ${_(1176,420,132,108)}
  <rect class="stone" x="1968" y="420" width="112" height="${C-420}" rx="6" />
  ${_(2024,420,132,108)}
  ${ce(1176,306,62,0)}
  ${ce(2024,306,62,1.3)}

  <!-- great hall -->
  <rect class="stone" x="1220" y="520" width="760" height="${C-520}" rx="8" />
  <rect class="stone-band" x="1258" y="486" width="684" height="42" rx="14" />
  ${_(1600,486,330,260)}
  ${ce(1600,180,74,.7)}
  ${B(1320,486,66,54)}
  ${B(1880,486,66,54)}
  ${ie(1300,640,C)}
  ${ie(1900,640,C)}

  <!-- ordinary lit windows, staggered so the palace breathes -->
  ${U(1254,700,2,58,160,52,"lit")}
  ${U(1830,700,2,58,160,52,"lit")}
  ${K(1148,560,48,120,2.1)}
  ${K(1996,560,48,120,.8)}
  ${K(1560,180,74,130,1.6)}

  <!-- plinth -->
  <rect class="plinth" x="820" y="${C-28}" width="1560" height="40" rx="8" />
</g>

<rect class="ground" x="-2600" y="${C}" width="8000" height="900" />

<!-- ─────────── Tara's window: the way in ─────────── -->
<g class="hero-window">
  <!-- warm light spilling out before we can see inside -->
  <ellipse class="hero-glow" cx="${n.x}" cy="${n.y}" rx="520" ry="560" />

  <!-- the room, mounted inside the opening and clipped to it -->
  <g class="portal" clip-path="url(#heroClip)">
    <g transform="translate(${n.x} ${n.y}) scale(${n.scale})">
      <!-- Behind everything, and only shown once the camera clears the roof. -->
      <g class="outer-world">
        ${Ye()}
        ${_e()}
      </g>
      ${Ie()}
      ${Xe()}
      <g class="tara-slot"></g>
      ${Ke()}
      <g class="magic-labels">
        ${j("local","Local",-330,-900,"inside one function")}
        ${j("enclosing","Enclosing",1870,-1120,"a function written inside another")}
        ${j("global","Global",980,-1760,"the whole file")}
        ${j("builtin","Built-in",980,-2520,"names Python already knows")}
      </g>
      ${es()}
      ${Ve()}
      ${Je()}
      <g class="shadow-tag">
        ${j("shadow","shadowing",-300,-900)}
      </g>

      <!-- magic that travels between spaces -->
      <g class="reach">
        <!-- global: from her room out to the palace-level name -->
        <path class="global-beam" d="M -380 -300 C 300 -900 1100 -1180 1820 -1180" />
        <!-- nonlocal: only as far as the immediately surrounding space -->
        <path class="nonlocal-link" d="M -380 -160 C 100 -420 500 -520 940 -520" />
        <text class="nonlocal-tag" x="940" y="-566" text-anchor="middle">nonlocal</text>
      </g>

      <!-- last, so the one clickable thing in the story is never covered -->
      <g class="court-ui">
        ${Ue()}
        ${Be()}
        ${De()}
      </g>
    </g>
  </g>

  <!-- frame and shutters sit over the opening -->
  <g class="hero-frame">
    <path class="frame-stone" d="M ${n.x-n.w/2-26} ${n.y+n.h/2+20}
      L ${n.x-n.w/2-26} ${n.y-70}
      Q ${n.x-n.w/2-26} ${n.y-n.h/2-60} ${n.x} ${n.y-n.h/2-86}
      Q ${n.x+n.w/2+26} ${n.y-n.h/2-60} ${n.x+n.w/2+26} ${n.y-70}
      L ${n.x+n.w/2+26} ${n.y+n.h/2+20}
      L ${n.x+n.w/2} ${n.y+n.h/2+20}
      L ${n.x+n.w/2} ${n.y-70}
      Q ${n.x+n.w/2} ${n.y-n.h/2-20} ${n.x} ${n.y-n.h/2-44}
      Q ${n.x-n.w/2} ${n.y-n.h/2-20} ${n.x-n.w/2} ${n.y-70}
      L ${n.x-n.w/2} ${n.y+n.h/2+20} Z" />
    <rect class="frame-sill" x="${n.x-n.w/2-44}" y="${n.y+n.h/2+12}"
          width="${n.w+88}" height="30" rx="12" />
  </g>

  <g class="shutter shutter-l">
    <rect x="${n.x-n.w/2}" y="${n.y-n.h/2-30}"
          width="${n.w/2}" height="${n.h+50}" rx="6" />
    <rect class="shutter-slat" x="${n.x-n.w/2+16}" y="${n.y-130}" width="${n.w/2-32}" height="10" rx="5" />
    <rect class="shutter-slat" x="${n.x-n.w/2+16}" y="${n.y-60}" width="${n.w/2-32}" height="10" rx="5" />
    <rect class="shutter-slat" x="${n.x-n.w/2+16}" y="${n.y+10}" width="${n.w/2-32}" height="10" rx="5" />
  </g>
  <g class="shutter shutter-r">
    <rect x="${n.x}" y="${n.y-n.h/2-30}"
          width="${n.w/2}" height="${n.h+50}" rx="6" />
    <rect class="shutter-slat" x="${n.x+16}" y="${n.y-130}" width="${n.w/2-32}" height="10" rx="5" />
    <rect class="shutter-slat" x="${n.x+16}" y="${n.y-60}" width="${n.w/2-32}" height="10" rx="5" />
    <rect class="shutter-slat" x="${n.x+16}" y="${n.y+10}" width="${n.w/2-32}" height="10" rx="5" />
  </g>
</g>

${pe(3,14,{x:700,y:200,w:1800,h:800})}`}function ts(){return`<clipPath id="heroClip">
    <path d="M ${n.x-n.w/2} ${n.y+n.h/2+20}
      L ${n.x-n.w/2} ${n.y-70}
      Q ${n.x-n.w/2} ${n.y-n.h/2-20} ${n.x} ${n.y-n.h/2-44}
      Q ${n.x+n.w/2} ${n.y-n.h/2-20} ${n.x+n.w/2} ${n.y-70}
      L ${n.x+n.w/2} ${n.y+n.h/2+20} Z" />
  </clipPath>`}function ve(){return`
<g class="spark">
  <g class="spark-trail">
    <circle class="t1" r="7" /><circle class="t2" r="5.5" />
    <circle class="t3" r="4" /><circle class="t4" r="2.8" />
  </g>
  <circle class="spark-halo" r="66" />
  <circle class="spark-core" r="11" />
  <g class="spark-rays">
    <rect x="-1.6" y="-30" width="3.2" height="18" rx="1.6" />
    <rect x="-1.6" y="12"  width="3.2" height="18" rx="1.6" />
    <rect x="-30" y="-1.6" width="18" height="3.2" rx="1.6" />
    <rect x="12"  y="-1.6" width="18" height="3.2" rx="1.6" />
  </g>
</g>`}function be(s){const e=Math.max(190,s.length*30+84);return`
<g class="spark-word" aria-hidden="true">
  <ellipse class="sw-aura" cx="0" cy="0" rx="${e*.78}" ry="74" />
  <rect class="sw-plate" x="${-e/2}" y="-38" width="${e}" height="76" rx="38" />
  <text class="sw-text" x="0" y="14" text-anchor="middle">${s}</text>
  <g class="sw-motes">
    ${[[-e*.4,-28,0],[e*.34,-34,.8],[-e*.2,36,1.6],[e*.44,26,2.3],[6,-52,1.1],[-e*.46,14,2.9]].map(([t,r,a])=>`<circle cx="${t}" cy="${r}" r="3.6" style="animation-delay:${a}s" />`).join("")}
  </g>
</g>`}function as(s=26){let e=777;const t=()=>(e=(e*9301+49297)%233280)/233280;return`<g class="title-motes">${Array.from({length:s},()=>{const r=t()*Math.PI*2,a=300+t()*620;return`<circle r="${2+t()*3.2}"
      style="--fx:${(Math.cos(r)*a).toFixed(1)}px; --fy:${(Math.sin(r)*a*.6).toFixed(1)}px;
             animation-delay:${(t()*1.1).toFixed(2)}s" />`}).join("")}</g>`}const w=(s,e)=>({x:n.x+s*n.scale,y:n.y+e*n.scale});function V(s,{question:e,options:t,kind:r="choice"}={}){const a=s.root.querySelector(".interact"),i=P();return new Promise(l=>{const c=document.createElement("div");c.className=`ask ask-${r}`,c.setAttribute("role","group"),c.setAttribute("aria-label",e);const h=document.createElement("p");h.className="ask-q",h.textContent=e,c.appendChild(h);const m=document.createElement("div");m.className="ask-options",c.appendChild(m);let u=!1;const p=()=>{u||(u=!0,L(),c.classList.add("is-going"),setTimeout(()=>c.remove(),O?0:420))},v=b=>{u||([...m.children].forEach(M=>M.classList.toggle("is-chosen",M.dataset.value===String(b.value))),p(),i===P()&&l(b.value))};t.forEach((b,M)=>{const y=document.createElement("button");y.type="button",y.className="choice",y.dataset.value=String(b.value),y.innerHTML=`<span class="choice-label"></span>${b.note?'<span class="choice-note"></span>':""}`,y.querySelector(".choice-label").textContent=b.label,b.note&&(y.querySelector(".choice-note").textContent=b.note),y.addEventListener("click",()=>v(b)),m.appendChild(y),M===0&&requestAnimationFrame(()=>y.focus({preventScroll:!0}))});const L=me(()=>{u=!0,c.remove()});a.appendChild(c),requestAnimationFrame(()=>c.classList.add("is-open"))})}async function J(s,e,t=2600){const r=s.root.querySelector(".interact"),a=P(),i=document.createElement("p");i.className="ask-said",i.setAttribute("role","status"),i.textContent=e,r.appendChild(i);const l=me(()=>i.remove());requestAnimationFrame(()=>i.classList.add("is-open")),await new Promise(c=>setTimeout(c,O?0:t)),l(),i.classList.remove("is-open"),setTimeout(()=>i.remove(),O?0:420),a!==P()&&await new Promise(()=>{})}async function Ee(s,e){const{code:t=[],question:r,options:a,answer:i,hints:l=[],feedback:c={},reveal:h}=e,m=s.root.querySelector(".interact"),u=P();let p=0,v=!1;for(;;){const L=await new Promise(M=>{const y=document.createElement("div");if(y.className="ask ask-predict",y.setAttribute("role","group"),y.setAttribute("aria-label",r),t.length){const k=document.createElement("pre");k.className="ask-code",k.textContent=t.join(`
`),y.appendChild(k)}const f=document.createElement("p");f.className="ask-q",f.textContent=r,y.appendChild(f);const x=document.createElement("div");x.className="ask-options",y.appendChild(x);const oe=document.createElement("div");oe.className="hint-rail",y.appendChild(oe);let re=0,R=null;l.length&&(R=document.createElement("button"),R.type="button",R.className="hintbtn",R.innerHTML='<span aria-hidden="true">💡</span> Hint',R.addEventListener("click",()=>{v=!0;const k=document.createElement("p");k.className="hint",k.setAttribute("role","status"),k.textContent=l[re],oe.appendChild(k),requestAnimationFrame(()=>k.classList.add("is-open")),re+=1,re>=l.length&&(R.disabled=!0)}),y.appendChild(R));let le=!1;const ze=k=>{le||(le=!0,Pe(),[...x.children].forEach(I=>I.classList.toggle("is-chosen",I.dataset.value===String(k.value))),y.classList.add("is-going"),setTimeout(()=>y.remove(),O?0:420),u===P()&&M(k.value))};a.forEach((k,I)=>{const F=document.createElement("button");F.type="button",F.className="choice choice-tight",F.dataset.value=String(k.value),F.textContent=k.label,F.addEventListener("click",()=>ze(k)),x.appendChild(F),I===0&&requestAnimationFrame(()=>F.focus({preventScroll:!0}))});const Pe=me(()=>{le=!0,y.remove()});m.appendChild(y),requestAnimationFrame(()=>y.classList.add("is-open"))});if(p+=1,L===i)return await J(s,c[L]||"That is it.",2400),{value:L,correct:!0,attempts:p,usedHint:v};if(await J(s,c[L]||"Not quite — look again at where it was made.",2600),p>=2)return h&&await J(s,h,3e3),{value:L,correct:!1,attempts:p,usedHint:v}}}const Q={readyToWhisper:{question:"Tara has a secret word she wants to try.",options:[{value:"go",label:"Let her whisper it",note:"and see where it goes"}]},whatToDo:{question:"Tara has whispered a secret. What should she do?",options:[{value:"outside",label:"Take it outside",note:"see if it follows"},{value:"stay",label:"Keep it in the room",note:"say it again"}]},whereDidItGo:{question:"Her secret did not answer out here. Where is it?",options:[{value:"room",label:"Still in her room"},{value:"followed",label:"It followed her out"},{value:"gone",label:"It disappeared"}],feedback:{room:"Exactly. It never left the room it was made in.",followed:"Almost — that is what it feels like. Watch where it actually is.",gone:"Not gone. Look back at the room she came from."}},shadowPredict:{code:['name = "Mithu"',"","def room():",'    name = "Tara"',"    print(name)","","room()"],question:"What does this print?",options:[{value:"Tara",label:"Tara"},{value:"Mithu",label:"Mithu"},{value:"error",label:"An error"}],answer:"Tara",hints:["Look at where each name was made.","Is Tara inside the room, or outside it, when she reads it?"],feedback:{Tara:"Yes. Inside the room, her own name is the nearer one.",Mithu:"Almost. The palace still says Mithu — but Tara made her own copy inside.",error:"No error here. Both names exist; the question is which one is nearer."},reveal:"It prints Tara. The name made inside the room hides the one outside it."},errorPredict:{code:['name = "Mithu"',"","def room():","    print(name)",'    name = "Tara"',"","room()"],question:"And this one?",options:[{value:"error",label:"An error"},{value:"Mithu",label:"Mithu"},{value:"Tara",label:"Tara"}],answer:"error",hints:["Python reads the whole room before it runs a single line of it.","The room assigns to name somewhere. What does that make the name, everywhere in the room?"],feedback:{error:"Yes — UnboundLocalError. The room owns the name before it has a value.",Mithu:"That is the trap. Because the room assigns to name lower down, it never looks outside at all.",Tara:"Not yet — that line has not run when print is reached."},reveal:"It raises UnboundLocalError: the room claimed name the moment it was written, so there is nothing outside to fall back to."}},ke={x:26,y:176},G=q.wallX;async function is(s){const{camera:e,tara:t,spark:r,hers:a,ui:i,root:l}=s,c=l.querySelector(".room"),h=l.querySelector(".wall-ripple");i.classList.contains("show-title")&&(i.classList.add("title-out"),await o(900),i.classList.remove("show-title","show-sub","title-out")),r.moveTo(470,-330,{duration:1500,easing:g.inOut}),l.querySelector(".spark-slot").classList.add("is-dimmed"),await e.to({...w(t.x-30,150),zoom:e.fitRoom(1569),duration:1400}),t.express("curious"),await o(500),await e.to({...w(t.x+10,70),zoom:e.fitRoom(1067),duration:1400}),await o(400),await V(s,Q.readyToWhisper),t.setPose("whisper"),await o(500),a.at(t.x+ke.x,t.y-ke.y).setScale(.06),a.el.classList.add("is-live"),await o(300),await a.scaleTo(1,{duration:1e3,easing:g.back}),a.el.classList.add("is-word"),await o(400),t.setPose("idle"),t.express("happy"),await A(a.moveTo(t.x+120,t.y-330,{duration:1400,easing:g.out}),e.to({...w(t.x+60,-60),zoom:e.fitRoom(1356),duration:1400})),await o(400),t.express("curious"),e.follow(a,{map:(u,p)=>w(u,p),offsetY:60,lag:.035}),await a.moveTo(-180,-400,{duration:1400,easing:g.inOut}),await a.moveTo(-430,-250,{duration:1400,easing:g.inOut}),await A(t.walkTo(-320,{speed:200}),a.moveTo(-700,-320,{duration:1400,easing:g.inOut})),await a.moveTo(G,-300,{duration:1400,easing:g.in}),h.setAttribute("transform",`translate(${G-20} -300)`),h.classList.remove("is-hit"),h.getBoundingClientRect(),h.classList.add("is-hit"),a.el.classList.add("is-bouncing"),e.shake(9),await a.moveTo(G+250,-350,{duration:700,easing:g.out}),a.el.classList.remove("is-bouncing"),e.unfollow(),await e.to({...w(-520,-190),zoom:e.fitRoom(1455),duration:1200}),t.express("surprised"),await o(500),t.express("curious"),e.follow(a,{map:(u,p)=>w(u,p),offsetY:40,lag:.03}),await a.moveTo(G+30,-270,{duration:1400,easing:g.inOut}),h.classList.remove("is-hit"),h.getBoundingClientRect(),h.setAttribute("transform",`translate(${G-10} -270)`),h.classList.add("is-hit"),a.el.classList.add("is-straining"),e.shake(5),await o(600),a.el.classList.add("is-fading"),await o(900),a.el.classList.remove("is-live","is-word","is-straining","is-fading"),e.unfollow(),await e.to({...w(-560,-60),zoom:e.fitRoom(1379),duration:1400}),t.express("confused"),await o(600),await t.walkTo(-760,{speed:150}),await t.face("left"),t.setPose("touch"),c.classList.add("wall-felt"),await o(1e3),l.querySelector(".tara").classList.add("mithu-alert"),await o(700),t.setPose("idle"),await t.face("right"),t.express("curious"),await e.to({...w(-420,-40),zoom:e.fitRoom(1905),duration:1400}),await o(400),l.querySelector(".room-door").classList.add("is-noticed"),await o(800),i.dataset.line="far",i.classList.add("show-line"),await o(4e3),i.classList.remove("show-line"),c.classList.remove("wall-felt"),l.querySelector(".tara").classList.remove("mithu-alert"),await o(300),s.journey.at("local"),await s.journey.flash(1800);let m=await V(s,Q.whatToDo);for(;m==="stay";)await e.to({...w(t.x-20,60),zoom:e.fitRoom(1330),duration:1200}),t.setPose("whisper"),await o(700),t.setPose("idle"),a.el.classList.add("is-beckoning"),await o(900),a.el.classList.remove("is-beckoning"),c.classList.add("wall-felt"),await o(700),c.classList.remove("wall-felt"),t.express("confused"),await o(900),m=await V(s,{question:"The same wall, every time. Should she try outside?",options:[{value:"outside",label:"Take it outside",note:"find out why"},{value:"stay",label:"Try once more"}]});l.querySelector(".room-door").classList.remove("is-noticed"),await o(300)}async function os(s){const{camera:e,tara:t,hers:r,ui:a,root:i}=s,l=i.querySelector(".room-door"),c=i.querySelector(".ask-prompt"),h=i.querySelector(".ask-anchor"),m=i.querySelector(".ask-speech"),u=i.querySelector(".ask-speech-anchor"),p=i.querySelector(".q-motes");r.at(-620,-240).setScale(1),r.el.classList.add("is-live","is-word","is-homebound"),await o(400),i.querySelector(".tara").classList.add("mithu-alert"),await o(500),t.express("curious"),await t.face("right"),await o(300),l.classList.add("is-open"),await o(500),e.follow(t,{map:(L,b)=>w(L,b),offsetY:-150,lag:.028}),await t.walkTo(q.doorX+40,{speed:210}),await o(400),await t.walkTo(T.x0+300,{speed:200}),e.unfollow(),await e.to({...w(T.centreX-260,-120),zoom:e.fitRoom(3077),duration:2300,easing:g.inOut}),t.express("surprised"),await o(500),await t.face("left"),await o(300),await t.face("right"),t.express("curious"),await o(400),h.setAttribute("transform",`translate(${T.askX} -470)`),await e.to({...w(T.askX,-250),zoom:e.fitRoom(2150),duration:1600,easing:g.inOut}),await t.face("right"),c.classList.add("is-offered"),await new Promise(L=>{const b=setTimeout(()=>c.classList.add("is-urging"),7e3),M=()=>{clearTimeout(b),c.classList.remove("is-urging"),c.removeEventListener("click",M),c.removeEventListener("keydown",y),L()},y=f=>{(f.key==="Enter"||f.key===" ")&&(f.preventDefault(),M())};c.addEventListener("click",M),c.addEventListener("keydown",y)}),c.classList.remove("is-offered"),c.classList.add("is-taken"),await A(t.walkTo(T.askX,{speed:190}),e.to({...w(T.askX+60,-180),zoom:e.fitRoom(2667),duration:1700})),await o(300),await t.face("left"),await o(300),t.setPose("reach"),t.express("curious"),u.setAttribute("transform",`translate(${T.askX+30} -330)`),m.classList.add("is-spoken"),await o(1100),t.setPose("idle"),m.classList.remove("is-spoken"),p.setAttribute("transform",`translate(${T.askX+40} -420)`),p.classList.add("is-asking"),i.querySelector(".courtyard").classList.add("is-hushed"),await o(1100),p.classList.remove("is-asking"),t.express("confused"),i.querySelector(".tara").classList.add("mithu-alert"),await o(700);const v=await V(s,Q.whereDidItGo);await J(s,Q.whereDidItGo.feedback[v],2400),await t.face("left"),await o(300),await e.to({...w(700,-180),zoom:e.fitRoom(4706),duration:2300,easing:g.inOut}),r.el.classList.add("is-beckoning"),await o(1100),a.dataset.line="born",a.classList.add("show-line"),await o(4800),a.classList.remove("show-line"),await o(400),s.journey.done("local").at("enclosing"),i.querySelector(".tara").classList.remove("mithu-alert"),i.querySelector(".courtyard").classList.remove("is-hushed"),r.el.classList.remove("is-beckoning")}const rs=[{id:"local",cls:"lg-local"},{id:"enclosing",cls:"lg-enclosing"},{id:"global",cls:"lg-global"},{id:"builtin",cls:"lg-builtin"}];async function ls(s){const{camera:e,tara:t,code:r,ui:a,root:i}=s,l=i.querySelector(".layer-glows"),c=i.querySelector(".magic-labels");t.setPose("idle").express("curious"),await e.to({...w(900,-420),zoom:e.zoomToFitWidth(1080),duration:2300,easing:g.inOut}),await o(300),i.querySelector(".portal").classList.add("show-shell"),await e.to({...w(980,-940),zoom:e.zoomToFitWidth(1760),duration:2600,easing:g.inOut}),await o(500),l.classList.add("is-live");for(const h of rs)i.querySelector(`.${h.cls}`).classList.add("is-lit"),await o(400),c.querySelector(`.mlabel-${h.id}`).classList.add("is-named"),await o(900);await o(500),a.dataset.line="names",a.classList.add("show-line"),await o(3600),a.classList.remove("show-line"),a.dataset.line="legb",a.classList.add("show-line"),await o(4600),a.classList.remove("show-line"),r.dock(),await r.write(['name = "Mithu"'],{stagger:0}),r.note(0,"Global — out in the open palace"),await o(1600)}const ns=[{cls:"lg-local",found:!1,note:"not in room() — look outward"},{cls:"lg-enclosing",found:!1,note:"not in the enclosing space either"},{cls:"lg-global",found:!0,note:"found it — the palace name"}];async function cs(s){const{camera:e,tara:t,spark:r,hers:a,code:i,ui:l,root:c}=s,h=c.querySelector(".layer-glows"),m=c.querySelector(".tara");c.querySelectorAll(".mlabel").forEach(u=>u.classList.remove("is-named")),c.querySelectorAll(".lg").forEach(u=>u.classList.remove("is-lit")),r.setText("MITHU").at(1900,-1180).setScale(1),r.el.classList.remove("is-dimmed"),r.el.classList.add("is-live","is-word","is-outer"),await e.to({...w(760,-560),zoom:e.zoomToFitWidth(1180),duration:1700}),t.express("curious"),await o(500),m.classList.add("mithu-alert"),l.dataset.line="wider",l.classList.add("show-line"),await o(3400),l.classList.remove("show-line"),m.classList.remove("mithu-alert"),i.clearNotes(),await i.append(["","def room():","    print(name)"],{stagger:380}),i.focus(3),await o(500),m.classList.add("has-lantern"),await o(500),h.classList.add("is-live","is-searching");for(const u of ns){const p=c.querySelector(`.${u.cls}`);p.classList.add("is-lit","is-probing"),i.note(3,u.note),u.cls==="lg-enclosing"&&A(t.walkTo(T.centreX-200,{speed:230}),e.to({...w(900,-640),zoom:e.zoomToFitWidth(1420),duration:1800})),u.cls==="lg-global"&&e.to({...w(980,-860),zoom:e.zoomToFitWidth(1780),duration:1900}),await o(1100),u.found?(p.classList.remove("is-probing"),p.classList.add("is-found"),r.el.classList.add("is-answering"),i.mark(3,"is-ok"),t.express("happy"),e.shake(5),await o(1400)):(p.classList.remove("is-probing"),p.classList.add("is-empty"),await o(300))}await o(800),i.unmark("is-ok"),i.note(3,"and print? found in the outermost ring"),c.querySelector(".lg-builtin").classList.add("is-lit","is-found"),c.querySelector(".mlabel-builtin").classList.add("is-named"),await o(1e3),l.dataset.line="builtin",l.classList.add("show-line"),await o(4400),l.classList.remove("show-line"),c.querySelector(".mlabel-builtin").classList.remove("is-named"),c.querySelectorAll(".lg").forEach(u=>u.classList.remove("is-empty","is-found")),h.classList.remove("is-searching"),r.el.classList.remove("is-answering"),i.unfocus(),i.clearNotes()}const de={x:-560,y:-300};async function ds(s){const{camera:e,tara:t,spark:r,hers:a,code:i,ui:l,root:c}=s,h=c.querySelector(".tara");await A(t.walkTo(q.taraX-120,{speed:240}),e.to({...w(-120,-240),zoom:e.zoomToFitWidth(760),duration:2200})),h.classList.remove("has-lantern"),await t.face("right"),t.express("curious"),await o(500),t.setPose("whisper"),await o(500),a.setText("MITHU").at(de.x,de.y).setScale(.05),a.el.classList.remove("is-homebound","is-beckoning"),a.el.classList.add("is-live","is-inner"),await a.scaleTo(1,{duration:1e3,easing:g.back}),a.el.classList.add("is-word"),t.setPose("idle"),await i.retype(3,'    name = "Tara"'),i.mark(3,"is-claim"),i.note(3,"assigning MAKES a new local name"),await i.append(["    print(name)"],{stagger:0}),await o(1e3),await e.to({...w(560,-620),zoom:e.zoomToFitWidth(1500),duration:1800}),await o(800),await e.to({...w(-260,-260),zoom:e.zoomToFitWidth(820),duration:1600}),await t.walkTo(de.x+250,{speed:200}),await t.face("left"),t.setPose("reach"),await o(300),a.el.classList.add("is-touched"),e.shake(4),await a.morphTo("TARA",{duration:1100}),a.el.classList.remove("is-touched"),t.setPose("idle"),t.express("surprised"),await o(500),await e.to({...w(620,-640),zoom:e.zoomToFitWidth(1560),duration:1800}),r.el.classList.add("is-answering"),i.note(0,"untouched"),await o(1100),r.el.classList.remove("is-answering"),i.note(0,""),t.express("happy"),h.classList.add("mithu-alert"),await o(800),h.classList.remove("mithu-alert");const m=c.querySelector(".mlabel-local");m.classList.add("is-named","is-inline"),await o(1700),i.unmark("is-claim"),i.focus(3),await o(700),l.dataset.line="readassign",l.classList.add("show-line"),await o(4400),l.classList.remove("show-line"),i.unfocus(),await Ee(s,Q.shadowPredict),await e.to({...w(-160,-420),zoom:e.zoomToFitWidth(1120),duration:1800}),await o(400),c.querySelector(".reach").classList.add("show-shadow"),r.el.classList.add("is-shadowed"),a.el.classList.add("is-shadowing"),i.focus(4),i.note(4,"finds the local one; outer is hidden"),await o(1400),l.dataset.line="hides",l.classList.add("show-line"),await o(4200),l.classList.remove("show-line"),await o(500),i.unfocus(),i.clearNotes(),m.classList.remove("is-inline","is-named")}async function hs(s){const{camera:e,tara:t,spark:r,hers:a,code:i,ui:l,root:c}=s,h=c.querySelector(".tara"),m=c.querySelector(".reach");m.classList.remove("show-shadow"),r.el.classList.remove("is-shadowed"),a.el.classList.remove("is-shadowing"),await o(400),await e.to({...w(400,-620),zoom:e.zoomToFitWidth(1420),duration:1800}),await t.face("right"),t.express("curious"),await o(700),h.classList.add("mithu-alert"),l.dataset.line="speak",l.classList.add("show-line"),await o(3600),l.classList.remove("show-line"),h.classList.remove("mithu-alert"),await e.to({...w(-200,-300),zoom:e.zoomToFitWidth(880),duration:1600}),h.classList.add("has-megaphone"),await o(500),t.setPose("reach"),t.express("happy"),await o(500),await e.to({...w(700,-700),zoom:e.zoomToFitWidth(1620),duration:1700}),await i.retype(3,"    global name"),i.mark(3,"is-claim"),i.note(3,"rebinds the palace name, not a local one"),await i.append(['    name = "Tara"'],{stagger:0}),await o(800),m.classList.add("show-global"),e.shake(6),await o(1100),r.el.classList.add("is-touched"),await r.morphTo("TARA",{duration:1200}),r.el.classList.remove("is-touched"),r.el.classList.add("is-answering"),e.shake(8),await o(1100),t.setPose("idle"),r.el.classList.remove("is-answering"),m.classList.remove("show-global"),h.classList.remove("has-megaphone"),await o(500);const u=c.querySelector(".mlabel-global");u.classList.add("is-named","is-inline"),await o(1700),u.classList.remove("is-inline","is-named"),await e.to({...w(260,-420),zoom:e.zoomToFitWidth(1240),duration:1700}),h.classList.add("mithu-alert"),i.unmark("is-claim"),i.clearNotes(),await i.write(["def palace():",'    name = "Mithu"',"","    def room():","        nonlocal name",'        name = "Tara"'],{stagger:300}),i.focus(4),i.note(4,"reaches the ENCLOSING room only"),m.classList.add("show-nonlocal"),await o(1100),l.dataset.line="nonlocal",l.classList.add("show-line"),await o(4600),l.classList.remove("show-line"),m.classList.remove("show-nonlocal"),h.classList.remove("mithu-alert"),i.unfocus(),i.clearNotes(),t.express("happy"),await o(700)}async function us(s){const{camera:e,tara:t,spark:r,hers:a,code:i,ui:l,root:c}=s,h=c.querySelector(".tara"),m=c.querySelector(".trails"),u=c.querySelector(".error-spell");r.setText("MITHU").at(1900,-1180),r.el.classList.add("is-live","is-word","is-outer"),r.el.classList.remove("is-shadowed"),a.el.classList.remove("is-word","is-live","is-inner","is-shadowing","is-hollow"),await e.to({...w(40,-140),zoom:e.fitRoom(1500),duration:2e3}),await t.face("right"),t.express("curious"),await i.write(['name = "Mithu"',"","def room():","    print(name)",'    name = "Tara"'],{stagger:300}),await o(500),m.classList.add("show-out"),r.el.classList.add("is-answering"),await o(1100),m.classList.remove("show-out"),r.el.classList.remove("is-answering"),await o(400),await Ee(s,Q.errorPredict),await e.to({...w(-380,-200),zoom:e.fitRoom(1e3),duration:1600}),await t.face("left"),t.setPose("reach"),await o(400),a.setText("name").at(-560,-300).setScale(.1),a.el.classList.add("is-live","is-hollow"),await a.scaleTo(1,{duration:900,easing:g.back}),a.el.classList.add("is-word"),e.shake(4),t.setPose("idle"),await o(700),a.el.classList.add("is-claimed"),i.focus(4),i.note(4,"seen first — so name is local everywhere"),await o(1400),t.setPose("reach"),t.express("curious"),m.classList.add("show-local"),i.focus(3),i.note(3,"runs first — local name still empty"),await o(1e3),a.el.classList.add("is-hollow-pulse"),await o(800),m.classList.remove("show-local"),await e.to({...w(140,-300),zoom:e.fitRoom(1700),duration:1600}),m.classList.add("show-blocked"),await o(500),m.classList.add("is-barred"),e.shake(9),t.setPose("surprise"),t.express("surprised"),h.classList.add("mithu-alert"),await o(800),m.classList.remove("show-blocked","is-barred"),c.querySelector(".stage").classList.add("is-darkened"),u.setAttribute("transform","translate(120 -760)"),u.classList.add("is-cast"),i.mark(3,"is-error"),i.focus(3),e.shake(12),await o(1400),l.dataset.line="claimed",l.classList.add("show-line"),await o(4200),l.classList.remove("show-line"),await o(300),l.dataset.line="lookedthere",l.classList.add("show-line"),await o(4400),l.classList.remove("show-line"),await o(800),u.classList.remove("is-cast"),c.querySelector(".stage").classList.remove("is-darkened"),h.classList.remove("mithu-alert"),t.setPose("idle"),a.el.classList.remove("is-hollow-pulse"),i.unmark("is-error"),i.unfocus(),i.clearNotes(),await o(500)}const Se={x:620,y:-1180};async function ms(s){const{camera:e,tara:t,spark:r,hers:a,code:i,ui:l,root:c}=s,h=c.querySelector(".tara"),m=c.querySelector(".trails"),u=c.querySelector(".perch-stand"),p=c.querySelector(".error-spell");await A(t.walkTo(q.taraX-220,{speed:200}),e.to({...w(-120,-260),zoom:e.fitRoom(1300),duration:1900})),await t.face("right"),t.setPose("sit"),t.express("curious"),u.setAttribute("transform",`translate(${q.taraX+190} ${q.floorY})`),u.classList.add("is-up"),h.classList.add("mithu-away"),await o(500),l.dataset.line="rules",l.classList.add("show-line"),await o(3800),l.classList.remove("show-line"),i.at(Se.x,Se.y),i.undock(),await i.clear({duration:400}),await e.to({...w(520,-760),zoom:e.fitRoom(2100),duration:1800}),a.el.classList.remove("is-word","is-live","is-hollow","is-claimed","is-hollow-pulse","is-inner","is-shadowing","is-clearing"),r.setText("MITHU").at(1900,-1180),r.el.classList.add("is-live","is-word","is-outer"),await i.write(['name = "Mithu"',"","def room():","    print(name)"]),await o(300),i.focus(3),m.classList.add("show-out"),await o(500),r.el.classList.add("is-answering"),await o(700),l.dataset.line="lookout",l.classList.add("show-line"),await o(3900),l.classList.remove("show-line"),m.classList.remove("show-out"),r.el.classList.remove("is-answering"),i.unfocus(),await i.clear(),await i.write(['name = "Mithu"',"","def room():",'    name = "Tara"',"    print(name)"]),await o(300),i.focus(3),a.setText("TARA").at(-560,-300).setScale(.1),a.el.classList.remove("is-hollow","is-claimed"),a.el.classList.add("is-live","is-inner"),await a.scaleTo(1,{duration:900,easing:g.back}),a.el.classList.add("is-word"),await o(400),i.focus(4),m.classList.add("show-local"),a.el.classList.add("is-shadowing"),r.el.classList.add("is-shadowed"),await o(800),l.dataset.line="hides",l.classList.add("show-line"),await o(3800),l.classList.remove("show-line");const v=c.querySelector(".shadow-tag .mlabel");v.classList.add("is-named"),await o(1100),v.classList.remove("is-named"),m.classList.remove("show-local"),r.el.classList.remove("is-shadowed"),a.el.classList.remove("is-shadowing"),i.unfocus(),await i.clear(),await i.write(['name = "Mithu"',"","def room():","    print(name)",'    name = "Tara"']),await o(300),i.focus(4),await o(500),a.setText("name").at(-560,-300).setScale(.1),a.el.classList.remove("is-inner"),a.el.classList.add("is-live","is-hollow"),await a.scaleTo(1,{duration:800,easing:g.back}),a.el.classList.add("is-word","is-claimed"),e.shake(4),await o(700),i.focus(3),m.classList.add("show-blocked"),a.el.classList.add("is-hollow-pulse"),await o(500),m.classList.add("is-barred"),e.shake(8),await o(500),m.classList.remove("show-blocked","is-barred"),p.setAttribute("transform","translate(620 -320)"),c.querySelector(".stage").classList.add("is-darkened"),p.classList.add("is-cast"),i.mark(3,"is-error"),await o(900),l.dataset.line="assigns",l.classList.add("show-line"),await o(4400),l.classList.remove("show-line"),await o(300),l.dataset.line="novalue",l.classList.add("show-line"),await o(4e3),l.classList.remove("show-line"),p.classList.remove("is-cast"),c.querySelector(".stage").classList.remove("is-darkened"),i.unfocus(),i.unmark("is-error"),await i.clear(),a.el.classList.remove("is-hollow-pulse"),await i.write(["len = 5",'print(len("palace"))'],{stagger:380}),await o(300),i.focus(0),i.note(0,"this hides the built-in len"),c.querySelector(".lg-builtin").classList.add("is-lit"),c.querySelector(".mlabel-builtin").classList.add("is-named"),await o(900),i.focus(1),i.mark(1,"is-error"),i.note(1,"TypeError — 5 is not a function"),e.shake(6),t.express("surprised"),await o(1100),l.dataset.line="shadowbuiltin",l.classList.add("show-line"),await o(4400),l.classList.remove("show-line"),c.querySelector(".mlabel-builtin").classList.remove("is-named"),c.querySelector(".lg-builtin").classList.remove("is-lit"),i.unfocus(),i.unmark("is-error"),i.clearNotes(),await i.clear(),t.express("curious"),await e.to({...w(-140,-180),zoom:e.fitRoom(1500),duration:1600}),t.setPose("idle");for(let L=0;L<2;L+=1)await t.walkTo(q.taraX-160,{speed:240}),a.setText("TARA").at(-560,-300).setScale(.1),a.el.classList.remove("is-hollow","is-claimed"),a.el.classList.add("is-live","is-inner"),await a.scaleTo(1,{duration:700,easing:g.back}),a.el.classList.add("is-word"),await o(500),await t.walkTo(q.doorX+60,{speed:240}),a.el.classList.add("is-clearing"),await o(400),a.el.classList.remove("is-live","is-word","is-clearing","is-inner"),await o(300);l.dataset.line="freshcall",l.classList.add("show-line"),await o(4e3),l.classList.remove("show-line"),await t.walkTo(q.taraX-160,{speed:220}),await t.face("right"),t.express("happy"),await e.to({...w(980,-940),zoom:e.zoomToFitWidth(1760),duration:2400}),c.querySelector(".layer-glows").classList.add("is-live");for(const L of["local","enclosing","global","builtin"])c.querySelector(`.lg-${L}`).classList.add("is-lit"),await o(300);await o(500),l.dataset.line="begins",l.classList.add("show-line"),await o(4400),l.classList.remove("show-line"),await o(500)}const ee=["local","enclosing","global","builtin"],ws=[{name:"secret",target:0},{name:"place",target:1},{name:"name",target:2},{name:"print",target:3}],ps=[{line:6,id:"local",note:"Local — this call only"},{line:3,id:"enclosing",note:"Enclosing — the function wrapped around it"},{line:0,id:"global",note:"Global — the top level of the file"},{line:7,id:"builtin",note:"print — Built-in, always there"}];function Ce(s){ee.forEach(e=>{s.querySelector(`.lg-${e}`).classList.remove("is-lit","is-probing","is-found","is-empty")})}async function gs(s,e,t,r){Ce(s),e.setText(t).at(1900,-1180).setScale(1),e.el.classList.remove("is-dimmed","is-answering"),e.el.classList.add("is-live","is-word"),await o(900);for(let a=0;a<=r;a+=1){const i=s.querySelector(`.lg-${ee[a]}`);i.classList.add("is-lit","is-probing"),await o(a===r?850:600),i.classList.remove("is-probing"),a===r?(i.classList.add("is-found"),s.querySelector(`.mlabel-${ee[a]}`).classList.add("is-named"),e.el.classList.add("is-answering"),await o(1700),s.querySelector(`.mlabel-${ee[a]}`).classList.remove("is-named"),e.el.classList.remove("is-answering")):(i.classList.add("is-empty"),await o(260))}await o(400)}async function ys(s){const{camera:e,tara:t,spark:r,hers:a,code:i,ui:l,root:c}=s,h=c.querySelector(".tara"),m=c.querySelector(".perch-stand");await i.clear(),m.classList.remove("is-up"),h.classList.remove("mithu-away"),c.querySelectorAll(".mlabel").forEach(u=>u.classList.remove("is-named","is-inline")),c.querySelectorAll(".lg").forEach(u=>u.classList.remove("is-lit")),await o(600),t.setPose("idle").express("happy"),await A(t.walkTo(T.centreX+620,{speed:190}),e.to({...w(T.centreX+300,-260),zoom:e.fitRoom(2200),duration:4100})),await t.face("right"),await o(600),c.querySelector(".portal").classList.add("show-shell","is-warming"),await e.to({...w(900,-620),zoom:e.fitRoom(3200),duration:3e3}),a.el.classList.add("is-settled"),r.el.classList.add("is-settled"),h.classList.add("looks-out"),t.express("happy"),await o(900),l.dataset.line="belong",l.classList.add("show-line"),await o(3400),l.classList.remove("show-line"),await e.to({...w(980,-940),zoom:e.zoomToFitWidth(1760),duration:3e3}),c.querySelector(".layer-glows").classList.add("is-live"),await o(700),l.dataset.line="fourplaces",l.classList.add("show-line"),await o(3400),l.classList.remove("show-line");for(const{name:u,target:p}of ws)await gs(c,r,u,p);Ce(c),r.el.classList.remove("is-live","is-word"),await o(800),i.undock(),await i.write(['name = "Mithu"',"","def palace():",'    place = "courtyard"',"","    def room():",'        secret = "laddoo"',"        print(name, place, secret)"],{stagger:300}),await o(900),c.querySelector(".layer-glows").classList.add("is-soft");for(const{line:u,id:p,note:v}of ps)i.focus(u),i.note(u,v),c.querySelector(`.lg-${p}`).classList.add("is-lit"),c.querySelector(`.mlabel-${p}`).classList.add("is-named"),await o(2600),c.querySelector(`.mlabel-${p}`).classList.remove("is-named");i.unfocus(),await o(900),l.dataset.line="legb",l.classList.add("show-line"),await o(4600),l.classList.remove("show-line"),await o(500),l.dataset.line="assignrule",l.classList.add("show-line"),await o(4800),l.classList.remove("show-line"),await o(600),await i.clear(),c.querySelectorAll(".mlabel").forEach(u=>u.classList.add("is-fading")),c.querySelectorAll(".lg").forEach(u=>u.classList.add("is-fading")),await o(1100),c.querySelectorAll(".mlabel").forEach(u=>u.classList.remove("is-named","is-fading")),c.querySelectorAll(".lg").forEach(u=>u.classList.remove("is-lit","is-fading")),c.querySelector(".layer-glows").classList.remove("is-soft"),await e.to({...w(900,-820),zoom:e.zoomToFitWidth(1900),duration:3e3}),await o(600),l.dataset.line="bridge",l.classList.add("show-line"),await o(4200),l.classList.remove("show-line"),await o(400),l.classList.add("is-ending"),l.classList.add("show-title"),await o(4200),l.classList.add("show-sub"),await o(1600),c.querySelector(".replay").classList.add("is-offered")}async function $s(s){const{camera:e,tara:t,spark:r,ui:a}=s;e.set({x:300,y:-1080,zoom:e.zoomToFitWidth(2e3)}),t.setPose("idle").express("neutral"),await o(400);const i=(async()=>{a.dataset.line="premise",a.classList.add("show-line"),await o(2100),a.dataset.line="premise2",await o(2100),a.dataset.line="premise3",await o(2200),a.classList.remove("show-line")})();await e.to({x:1150,y:-560,zoom:e.zoomToFitWidth(2300),duration:2300,easing:g.inOut}),await e.to({x:1600,y:420,zoom:e.zoomToFitWidth(1900),duration:2600,easing:g.inOut}),await i,await o(400),await e.to({x:n.x,y:n.y,zoom:e.zoomToFitWidth(780),duration:1800,easing:g.inOut}),s.root.querySelector(".hero-window").classList.add("is-open"),await o(2500),t.express("curious"),await t.face("right"),await o(600),await e.to({x:n.x,y:n.y,zoom:e.zoomToFitWidth(540),duration:1800,easing:g.inOut});const l=e.to({...w(0,40),zoom:e.fitRoom(1739),duration:2600,easing:g.inOut});await o(1900),s.root.querySelector(".portal").classList.add("is-inside"),s.root.querySelector(".hero-window").classList.add("is-passed"),await l,await e.to({...w(-40,90),zoom:e.fitRoom(1667),duration:1800}),await o(600),await A(t.walkTo(q.taraX-360,{speed:210}),e.to({...w(-220,110),zoom:e.fitRoom(1684),duration:2300})),await o(700),await t.face("right"),await o(500),r.el.classList.add("is-live"),await r.moveTo(360,-160,{duration:1600,easing:g.out}),t.express("curious"),await o(700),await A(r.moveTo(-60,-60,{duration:2e3,easing:g.inOut}),e.to({...w(-160,40),zoom:e.fitRoom(1481),duration:2e3})),t.setPose("reach"),await o(520),await r.moveTo(300,-240,{duration:900,easing:g.out}),t.setPose("idle"),t.express("surprised"),e.shake(5),await o(700),t.express("curious"),await A(t.walkTo(q.taraX-60,{speed:190}),e.to({...w(40,-10),zoom:e.fitRoom(1569),duration:1800})),await o(500),await r.moveTo(150,-170,{duration:1100,easing:g.inOut}),await o(400),r.el.classList.add("is-word"),e.shake(7),t.setPose("surprise"),t.express("surprised"),await o(1400),t.setPose("idle"),t.express("curious"),await o(1600),await e.to({...w(30,10),zoom:e.fitRoom(1778),duration:2e3}),a.classList.add("show-title"),await o(3400),a.classList.add("show-sub"),await o(3e3)}const fs=[$s,is,os,ls,cs,ds,hs,us,ms,ys];async function Ls(s){for(const e of fs)await e(s)}const xs=[{id:"local",name:"Local"},{id:"enclosing",name:"Enclosing"},{id:"global",name:"Global"},{id:"builtin",name:"Built-in"}];function vs(){return`
<nav class="journey" aria-label="Story progress">
  <span class="journey-title">Palace Journey</span>
  <ol class="journey-steps">
    ${xs.map(s=>`
      <li class="jstep" data-id="${s.id}">
        <span class="jlamp" aria-hidden="true"></span>
        <span class="jname">${s.name}</span>
      </li>`).join("")}
  </ol>
</nav>`}class bs{constructor(e){this.el=e,this.steps=new Map([...e.querySelectorAll(".jstep")].map(t=>[t.dataset.id,t]))}at(e){for(const[t,r]of this.steps)r.classList.toggle("is-here",t===e),t===e?r.setAttribute("aria-current","step"):r.removeAttribute("aria-current");return this.el.classList.add("is-shown"),this}done(e){const t=this.steps.get(e);return t&&(t.classList.add("is-done"),t.classList.remove("is-here"),t.removeAttribute("aria-current")),this}async flash(e=2600){return this.el.classList.add("is-shown","is-forward"),await new Promise(t=>setTimeout(t,e)),this.el.classList.remove("is-forward"),this}reset(){for(const e of this.steps.values())e.classList.remove("is-here","is-done"),e.removeAttribute("aria-current");return this.el.classList.remove("is-shown","is-forward"),this}}const X={width:1600,height:900};class qe{constructor(e){this.el=e,this.x=0,this.y=0,this.scale=1,this.apply()}apply(){this.el.setAttribute("transform",`translate(${this.x} ${this.y}) scale(${this.scale})`)}at(e,t){return this.x=e,this.y=t,this.apply(),this}setScale(e){return this.scale=e,this.apply(),this}setText(e){const t=this.el.querySelector(".sw-text");if(!t)return this;t.textContent=e;const r=Math.max(190,e.length*34+96),a=this.el.querySelector(".sw-plate"),i=this.el.querySelector(".sw-aura");return a&&(a.setAttribute("x",-r/2),a.setAttribute("width",r)),i&&i.setAttribute("rx",r*.78),this}async morphTo(e,{duration:t=900}={}){return this.el.classList.add("is-morphing"),await z({duration:t/2,easing:g.in,onUpdate:()=>{}}),this.setText(e),await z({duration:t/2,easing:g.out,onUpdate:()=>{}}),this.el.classList.remove("is-morphing"),this}scaleTo(e,{duration:t=900,easing:r=g.inOut}={}){const a=this.scale;return z({duration:t,easing:r,onUpdate:i=>{this.scale=a+(e-a)*i,this.apply()}})}moveTo(e,t,{duration:r=1400,easing:a=g.inOut}={}){const i=this.x,l=this.y;return z({duration:r,easing:a,onUpdate:c=>{this.x=i+(e-i)*c,this.y=l+(t-l)*c,this.apply()}})}}function he(s,e){const t=document.createElementNS("http://www.w3.org/2000/svg","g");return e&&t.setAttribute("class",e),t.innerHTML=s,t}function ks(s){s.innerHTML=`
    <div class="stage">
      <svg class="stage-svg" viewBox="0 0 ${X.width} ${X.height}"
           preserveAspectRatio="xMidYMid slice" role="img"
           aria-label="A palace at night. A girl and her parrot watch a glowing word appear.">
        ${Ge()}
        <defs>${ts()}</defs>
        <g class="world">${ss()}</g>
      </svg>

      <div class="ui">
        <svg class="title-svg" viewBox="0 0 ${X.width} ${X.height}"
             preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <g class="title-group" transform="translate(800 648)">
            ${as()}
            <text class="title-main" x="0" y="0" text-anchor="middle">The Palace of Whispers</text>
            <text class="title-sub"  x="0" y="76" text-anchor="middle">A story about where words live</text>
            <text class="title-sub2" x="0" y="76" text-anchor="middle">Python scope, told as a story.</text>
          </g>
        </svg>
      </div>

      <!-- The film used to open straight into the metaphor, so for three
           minutes a viewer had no idea it was about Python at all. These two
           lines say what is being taught BEFORE the story that illustrates it,
           and they play over the sky drift that was empty anyway. -->
      <p class="narration" data-for="premise">In Python, a <em>function</em> is a room.</p>
      <p class="narration" data-for="premise2">A <em>variable</em> you make inside it stays inside it.</p>
      <p class="narration" data-for="premise3">This is a story about where variables live.</p>
      <p class="narration" data-for="far">Some words don't travel far.</p>
      <p class="narration" data-for="born">Some variables belong only to the place where they were born.</p>
      <p class="narration" data-for="names">Python gives these places names. They are called <em>scopes</em>.</p>
      <p class="narration" data-for="wider">A variable can be found in a wider place too.</p>
      <p class="narration" data-for="hides">A nearer variable hides a wider one with the same name.</p>
      <p class="narration" data-for="speak">Then you must speak to the palace.</p>
      <p class="narration" data-for="nonlocal">And if you mean the surrounding room, Python has <em>nonlocal</em>.</p>
      <p class="narration" data-for="claimed">But Tara had already claimed that name for her room.</p>
      <p class="narration" data-for="lookedthere">Python looked for it there.</p>
      <p class="narration" data-for="rules">Don't worry. Python has rules for where it looks for a name.</p>
      <p class="narration" data-for="legb">It looks Local, then Enclosing, then Global, then Built-in &mdash; and stops at the first match.</p>
      <p class="narration" data-for="builtin">Names like <em>print</em> live in the outermost ring. Python finds them last, and always.</p>
      <p class="narration" data-for="readassign">Reading a name looks outward. Assigning one creates it right here.</p>
      <p class="narration" data-for="shadowbuiltin">Shadow a built-in name, and you lose the built-in.</p>
      <p class="narration" data-for="bridge">You meet this every time you write a function.</p>
      <p class="narration" data-for="assignrule">Assigning to a name makes it local &mdash; unless you say <em>global</em> or <em>nonlocal</em>.</p>
      <p class="narration" data-for="fourplaces">Four places. One order. Every time.</p>
      <p class="narration" data-for="lookout">Tara didn't create a name here, so Python can look outward.</p>
      <p class="narration" data-for="assigns">Because the function assigns to <em>name</em>, Python treats it as local.</p>
      <p class="narration" data-for="novalue">But the local name has no value yet.</p>
      <p class="narration" data-for="freshcall">Each function call gets its own local space.</p>
      <p class="narration" data-for="begins">Now you know where Python begins its search.</p>
      <p class="narration" data-for="whenever">Whenever I use a name&hellip;</p>
      <p class="narration" data-for="belong">&hellip;Python asks: where does it belong?</p>
      <p class="narration" data-for="whichscope">Ask: which scope am I in?</p>
      <p class="narration" data-for="beginssearch">That is where Python begins its search.</p>

      <div class="code-air"><pre class="ca-lines"></pre></div>

      <!-- Where questions appear. A sibling of the stage rather than a child
           of it, so nothing the story does to the scene (darkening it for the
           error, pausing its animations) can reach the controls the learner
           needs to answer with. -->
      <div class="interact"></div>
      ${vs()}

      <button class="pausebtn" type="button" aria-label="Pause the story" aria-pressed="false">
        <span class="pause-icon" aria-hidden="true">&#10073;&#10073;</span>
        <span class="play-icon" aria-hidden="true">&#9654;</span>
      </button>
      <button class="replay" type="button" aria-label="Replay the story from the beginning">
        <span class="replay-icon" aria-hidden="true">&#8635;</span>
        <span class="replay-label">Replay the story</span>
      </button>
    </div>`;const e=s.querySelector(".world"),t=new Oe(e,X),r=s.querySelector(".tara-slot"),a=he(je());r.appendChild(a);const i=new We(a,{x:60,y:420,scale:1,facing:"left"}),l=he(ve()+be("laddoo"),"spark-slot");r.appendChild(l);const c=new qe(l);c.at(520,-300);const h=he(ve()+be("chameli"),"spark-slot hers");r.appendChild(h);const m=new qe(h);m.at(0,0).setScale(.06);const u=new Ze(s.querySelector(".code-air")),p=new bs(s.querySelector(".journey"));p.at("local");const v={root:s,camera:t,tara:i,spark:c,hers:m,code:u,journey:p,ui:s.querySelector(".ui")},L=()=>{Re(),s.querySelector(".hero-window").classList.remove("is-open","is-passed"),s.querySelector(".portal").classList.remove("is-inside"),l.classList.remove("is-live","is-word","is-dimmed"),h.classList.remove("is-live","is-word","is-bouncing","is-straining","is-fading"),m.at(0,0).setScale(.06),s.querySelector(".room").classList.remove("wall-felt"),s.querySelector(".room-door").classList.remove("is-noticed"),s.querySelector(".tara").classList.remove("mithu-alert"),s.querySelector(".wall-ripple").classList.remove("is-hit"),s.querySelector(".room-door").classList.remove("is-open"),s.querySelector(".portal").classList.remove("show-shell"),s.querySelector(".layer-glows").classList.remove("is-live"),s.querySelectorAll(".lg").forEach(x=>x.classList.remove("is-lit")),s.querySelectorAll(".mlabel").forEach(x=>x.classList.remove("is-named")),s.querySelector(".ask-prompt").classList.remove("is-offered","is-taken"),s.querySelector(".ask-speech").classList.remove("is-spoken"),s.querySelector(".q-motes").classList.remove("is-asking"),s.querySelector(".courtyard").classList.remove("is-hushed"),h.classList.remove("is-homebound","is-beckoning","is-inner","is-shadowing","is-touched"),l.classList.remove("is-outer","is-answering","is-shadowed","is-touched"),m.setText("chameli"),c.setText("laddoo"),s.querySelector(".reach").classList.remove("show-global","show-nonlocal","show-shadow"),s.querySelectorAll(".lg").forEach(x=>x.classList.remove("is-probing","is-empty","is-found")),s.querySelectorAll(".mlabel").forEach(x=>x.classList.remove("is-inline")),s.querySelector(".layer-glows").classList.remove("is-searching"),s.querySelector(".tara").classList.remove("has-lantern","has-megaphone","mithu-away"),h.classList.remove("is-hollow","is-claimed","is-hollow-pulse","is-clearing"),s.querySelector(".trails").classList.remove("show-out","show-local","show-blocked","is-barred"),s.querySelector(".error-spell").classList.remove("is-cast"),s.querySelector(".perch-stand").classList.remove("is-up"),s.querySelector(".shadow-tag .mlabel").classList.remove("is-named"),s.querySelector(".stage").classList.remove("is-darkened"),u.clear({duration:0}),u.undock(),s.querySelector(".tara").classList.remove("looks-out","mithu-nods"),s.querySelector(".portal").classList.remove("is-warming"),s.querySelectorAll(".is-waking").forEach(x=>x.classList.remove("is-waking")),s.querySelectorAll(".is-fading").forEach(x=>x.classList.remove("is-fading")),h.classList.remove("is-settled","is-rising","is-star"),l.classList.remove("is-settled"),s.querySelector(".layer-glows").classList.remove("is-soft"),s.querySelector(".replay").classList.remove("is-offered"),s.querySelector(".interact").innerHTML="",p.reset(),p.at("local"),Me(),s.querySelector(".stage").classList.remove("is-paused");const f=s.querySelector(".pausebtn");f.classList.remove("is-paused"),f.setAttribute("aria-pressed","false"),f.setAttribute("aria-label","Pause the story"),v.ui.classList.remove("is-ending"),delete v.ui.dataset.line,v.ui.classList.remove("show-title","show-sub","show-line"),i.at(60,420),i.facing="left",i.apply(),c.x=520,c.y=-300,c.apply(),t.unfollow(),Ls(v)},b=s.querySelector(".pausebtn"),M=s.querySelector(".stage"),y=f=>{M.classList.toggle("is-paused",f),b.classList.toggle("is-paused",f),b.setAttribute("aria-pressed",String(f)),b.setAttribute("aria-label",f?"Resume the story":"Pause the story")};return b.addEventListener("click",()=>y(ge())),addEventListener("keydown",f=>{if(f.code!=="Space"&&f.key!==" ")return;const x=f.target;x instanceof Element&&(x.closest("button")||x.getAttribute("role")==="button"||x.isContentEditable)||(f.preventDefault(),y(ge()))}),s.querySelector(".replay").addEventListener("click",L),O?(s.querySelector(".hero-window").classList.add("is-open","is-passed"),s.querySelector(".portal").classList.add("is-inside","show-shell"),s.querySelector(".room-door").classList.add("is-open"),h.classList.add("is-live","is-word","is-homebound"),m.at(-620,-240).setScale(1),l.classList.add("is-live","is-word"),c.at(470,-330),i.at(1760,420),i.express("confused"),s.querySelector(".layer-glows").classList.add("is-live"),s.querySelectorAll(".lg").forEach(f=>f.classList.add("is-lit")),s.querySelectorAll(".mlabel").forEach(f=>f.classList.add("is-named")),m.setText("TARA"),h.classList.add("is-inner"),m.at(-560,-300),c.setText("MITHU"),l.classList.add("is-outer"),c.at(1900,-1180),t.set({x:n.x+980*n.scale,y:n.y+-940*n.scale,zoom:t.zoomToFitWidth(1760)}),u.dock(),u.write(['name = "Mithu"',"","def room():",'    name = "Tara"',"    print(name)"],{stagger:0}),u.note(0,"Global — the palace name"),u.note(3,"assigning makes a NEW local name"),u.note(4,"finds the local one first"),v.ui.dataset.line="names",v.ui.classList.add("show-line")):L(),v}ks(document.getElementById("app"));
