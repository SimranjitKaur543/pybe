(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();const J=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let A=0;const ts=()=>A;function ys(){return A+=1,A}let z=!1,ss=0,ms=0;const U=()=>(z?ss:performance.now())-ms;function fs(){z||(ss=performance.now(),z=!0)}function gs(){z&&(ms+=performance.now()-ss,z=!1)}function as(){return z?gs():fs(),z}const g={inOut:e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,out:e=>1-Math.pow(1-e,3),in:e=>e*e*e,back:e=>1+2.2*Math.pow(e-1,3)+1.2*Math.pow(e-1,2)};function l(e){const s=A;return J?Promise.resolve():new Promise(t=>{const r=U()+e,a=()=>{if(s===A){if(U()>=r)return t();requestAnimationFrame(a)}};requestAnimationFrame(a)})}function M({duration:e=600,easing:s=g.inOut,onUpdate:t,onDone:r}={}){let a=null,i=!1;const o=A,n=new Promise(h=>{if(J||e<=0){t?.(1),r?.(),h();return}const w=U(),u=()=>{if(i)return h();if(o!==A)return;const p=Math.min(1,(U()-w)/e);t?.(s(p)),p<1?a=requestAnimationFrame(u):(r?.(),h())};a=requestAnimationFrame(u)});return n.cancel=()=>{i=!0,a&&cancelAnimationFrame(a)},n}const P=(e,s,t)=>e+(s-e)*t,S=(...e)=>Promise.all(e.map(s=>typeof s=="function"?s():s));class xs{constructor(s,t){this.el=s,this.view=t,this.state={x:t.width/2,y:t.height/2,zoom:1},this.following=null,this.shakeAmount=0,this.apply(),this.tick=this.tick.bind(this),requestAnimationFrame(this.tick)}apply(){const{x:s,y:t,zoom:r}=this.state,a=this.view.width/2,i=this.view.height/2,o=this.shakeAmount?(Math.random()-.5)*this.shakeAmount:0,n=this.shakeAmount?(Math.random()-.5)*this.shakeAmount:0;this.el.setAttribute("transform",`translate(${a+o} ${i+n}) scale(${r}) translate(${-s} ${-t})`)}tick(){if(this.following&&this.following.gen!==ts()&&(this.following=null),this.following){const{actor:s,offsetX:t=0,offsetY:r=0,lag:a=.08,map:i}=this.following,o=i?i(s.x,s.y):{x:s.x,y:s.y},n=o.x+t,h=o.y+r;this.state.x=P(this.state.x,n,a),this.state.y=P(this.state.y,h,a),this.apply()}else this.shakeAmount>0&&this.apply();this.shakeAmount>0&&(this.shakeAmount*=.9),this.shakeAmount<.05&&(this.shakeAmount=0),requestAnimationFrame(this.tick)}set({x:s,y:t,zoom:r}={}){return s!==void 0&&(this.state.x=s),t!==void 0&&(this.state.y=t),r!==void 0&&(this.state.zoom=r),this.apply(),this}to({x:s,y:t,zoom:r,duration:a=1400,easing:i=g.inOut}={}){const o={...this.state},n={x:s??o.x,y:t??o.y,zoom:r??o.zoom};return M({duration:a,easing:i,onUpdate:h=>{this.state.x=P(o.x,n.x,h),this.state.y=P(o.y,n.y,h),this.state.zoom=P(o.zoom,n.zoom,h),this.apply()}})}follow(s,t={}){return this.following={actor:s,...t,gen:ts()},this}unfollow(){return this.following=null,this}zoomToFitWidth(s){const r=this.el.ownerSVGElement.getBoundingClientRect();if(!r.width||!r.height)return 1;const a=Math.max(r.width/this.view.width,r.height/this.view.height);return r.width/a/s}fitRoom(s,t=.225){return this.zoomToFitWidth(s*t)}shake(s=10){return this.shakeAmount=s,this}}class Ls{constructor(s,{x:t=0,y:r=0,facing:a="right",scale:i=1}={}){this.el=s,this.figure=s.firstElementChild||s,this.x=t,this.y=r,this.facing=a,this.scale=i,this.pose="idle",this.apply()}apply(){const s=this.facing==="left"?-1:1;this.el.setAttribute("transform",`translate(${this.x} ${this.y}) scale(${s*this.scale} ${this.scale})`)}at(s,t){return this.x=s,t!==void 0&&(this.y=t),this.apply(),this}setPose(s){return this.figure.classList.remove(`pose-${this.pose}`),this.pose=s,this.figure.classList.add(`pose-${s}`),this}express(s){return this.figure.dataset.mood=s,this}async face(s,{duration:t=260}={}){if(this.facing===s)return;const r=s==="left"?-1:1;await M({duration:t/2,easing:g.in,onUpdate:a=>{const i=(1-a)*this.scale;this.el.setAttribute("transform",`translate(${this.x} ${this.y}) scale(${(this.facing==="left"?-1:1)*i} ${this.scale})`)}}),this.facing=s,await M({duration:t/2,easing:g.out,onUpdate:a=>{const i=a*this.scale;this.el.setAttribute("transform",`translate(${this.x} ${this.y}) scale(${r*i} ${this.scale})`)}}),this.apply()}async walkTo(s,{speed:t=300,pose:r="walk"}={}){const a=s<this.x?"left":"right";await this.face(a);const i=this.x,o=Math.abs(s-i);if(o<1)return;const n=o/t*1e3;this.setPose(r),await M({duration:n,easing:g.inOut,onUpdate:h=>{this.x=i+(s-i)*h,this.apply()}}),this.setPose("idle")}beat(s=500){return l(s)}}class vs{constructor(s){this.el=s,this.pre=s.querySelector(".ca-lines"),this.lines=[],this.texts=[]}at(){return this}dock(){return this.el.classList.add("is-docked"),this}undock(){return this.el.classList.remove("is-docked"),this}async write(s,{stagger:t=420}={}){return this.pre.innerHTML="",this.lines=[],this.texts=[],this.el.classList.add("is-open"),this.append(s,{stagger:t})}async append(s,{stagger:t=420}={}){this.el.classList.add("is-open");for(const r of s){const a=r.match(/^\s*/)[0].length,i=document.createElement("span");i.className="ca-line",i.style.paddingLeft=`${a*.62}em`,i.innerHTML=is(r.trim())||"&nbsp;",this.pre.appendChild(i),this.lines.push(i),this.texts.push(r),requestAnimationFrame(()=>i.classList.add("is-written")),await l(t)}return this}async retype(s,t,{flash:r=!0}={}){const a=this.lines[s];if(!a)return this;const i=t.match(/^\s*/)[0].length;return a.style.paddingLeft=`${i*.62}em`,a.innerHTML=is(t.trim())||"&nbsp;",this.texts[s]=t,r&&(a.classList.remove("is-written"),requestAnimationFrame(()=>a.classList.add("is-written")),await l(700)),this}note(s,t){const r=this.lines[s];if(!r)return this;if(r.querySelector(".ca-note")?.remove(),!t)return this;const a=document.createElement("span");return a.className="ca-note",a.textContent=`  # ${t}`,r.appendChild(a),this}clearNotes(){return this.pre.querySelectorAll(".ca-note").forEach(s=>s.remove()),this}mark(s,t){return this.lines[s]?.classList.add(t),this}unmark(s){return this.lines.forEach(t=>t.classList.remove(s)),this}focus(s){return this.lines.forEach((t,r)=>t.classList.toggle("is-running",r===s)),this}unfocus(){return this.lines.forEach(s=>s.classList.remove("is-running")),this}async clear({duration:s=700}={}){return this.el.classList.remove("is-open"),await l(s),this.pre.innerHTML="",this.lines=[],this.texts=[],this}}function is(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}const d=-246,q=46,$=-190,x=-104;function ls(e,s){return`
  <g class="limb ${s}">
    <path class="churidar" d="M ${e-13} ${x}
      C ${e-15} ${x+46} ${e-13} -40 ${e-11} -12
      L ${e+11} -12
      C ${e+13} -40 ${e+15} ${x+46} ${e+13} ${x} Z" />
    <path class="cuff" d="M ${e-12} -26 L ${e+12} -26 L ${e+11} -14 L ${e-11} -14 Z" />
    <ellipse class="slipper" cx="${e+3}" cy="-5" rx="19" ry="9" />
  </g>`}function rs(e,s,t=""){return`
  <g class="limb ${s}">
    <path class="sleeve" d="M ${e} ${$+4}
      C ${e+6} ${$+40} ${e+8} ${$+66} ${e+6} ${$+86}
      L ${e-14} ${$+86}
      C ${e-16} ${$+62} ${e-14} ${$+36} ${e-12} ${$+4} Z" />
    <circle class="skin" cx="${e-4}" cy="${$+94}" r="12" />
    ${t}
  </g>`}function bs(e,s){return`
  <g class="prop prop-lantern" transform="translate(${e} ${s})">
    <path class="lan-hoop" d="M -16 -4 C -16 -30 16 -30 16 -4" />
    <rect class="lan-cap" x="-19" y="-6" width="38" height="10" rx="4" />
    <path class="lan-glass" d="M -17 4 L 17 4 L 13 44 L -13 44 Z" />
    <circle class="lan-halo" cx="0" cy="24" r="82" />
    <path class="lan-flame" d="M 0 10 C 9 22 7 36 0 36 C -7 36 -9 22 0 10 Z" />
    <rect class="lan-base" x="-16" y="42" width="32" height="9" rx="4" />
  </g>`}function ks(e,s){return`
  <g class="prop prop-megaphone" transform="translate(${e} ${s})">
    <path class="meg-body" d="M -6 -14 L -6 14 L 42 34 L 42 -34 Z" />
    <ellipse class="meg-mouth" cx="42" cy="0" rx="9" ry="34" />
    <rect class="meg-grip" x="-20" y="-9" width="16" height="18" rx="6" />
  </g>`}function Ss(){return`
<g class="tara pose-idle" data-mood="neutral">
  <ellipse class="shadow" cx="4" cy="2" rx="62" ry="12" />

  <!-- far side limbs sit behind the body -->
  ${ls(-17,"leg-far")}
  ${rs(-46,"arm-far")}

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
      C -48 ${$+22} -50 ${x-20} -54 ${x+16}
      L 54 ${x+16}
      C 50 ${x-20} 44 ${$+22} 32 ${$-6}
      C 18 ${$-18} -18 ${$-18} -32 ${$-6} Z" />
    <path class="kurta-hem" d="M -54 ${x+4} L 54 ${x+4} L 54 ${x+16} L -54 ${x+16} Z" />
    <path class="dupatta" d="M -30 ${$-2}
      C -6 ${$+26} 22 ${$+22} 34 ${$+2}
      C 44 ${$+54} 38 ${x+6} 26 ${x+30}
      L 8 ${x+24}
      C 22 ${x-6} 28 ${$+58} 20 ${$+34}
      C 4 ${$+46} -18 ${$+40} -30 ${$+22} Z" />
  </g>

  <!-- near side limbs -->
  ${ls(17,"leg-near")}
  ${rs(48,"arm-near",bs(40,$+104)+ks(40,$+96))}

  <!-- head. The hair is a full disc sitting behind a slightly lower, slightly
       forward face disc: that leaves a clean hair rim over the crown. A single
       curved cap never reaches the top of the skull and leaves it bald. -->
  <g class="head">
    <circle class="hair" cx="-2" cy="${d-6}" r="${q+5}" />
    <circle class="skin" cx="3" cy="${d+4}" r="${q}" />
    <path class="hair" d="M ${-q+2} ${d-6}
      C ${-q+4} ${d-34} ${q-6} ${d-40} ${q+1} ${d-12}
      C ${q-12} ${d-26} 4 ${d-30} -10 ${d-16}
      C -22 ${d-6} ${-q+6} ${d+2} ${-q+2} ${d-6} Z" />
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
    <g class="mithu-hop">${ps()}</g>
  </g>
</g>`}function ps(){return`
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
</g>`}function N(e,s,t,r,a="stone"){const i=t/2;return`<g class="${a}">
    <path d="M ${e-i} ${s}
             C ${e-i} ${s-r*.5} ${e-i*.62} ${s-r*.8} ${e} ${s-r}
             C ${e+i*.62} ${s-r*.8} ${e+i} ${s-r*.5} ${e+i} ${s} Z" />
    <rect x="${e-3}" y="${s-r-28}" width="6" height="30" rx="3" />
    <circle cx="${e}" cy="${s-r-34}" r="7" />
  </g>`}function I(e,s,t,r){const a=t/2,i=e+a;return`M ${e} ${s+r}
          L ${e} ${s+a*.72}
          Q ${e} ${s} ${i} ${s-a*.28}
          Q ${e+t} ${s} ${e+t} ${s+a*.72}
          L ${e+t} ${s+r} Z`}function K(e,s,t,r,a="arch"){return`<path class="${a}" d="${I(e,s,t,r)}" />`}function j(e,s,t,r,a=0){return`<path class="lit-window" style="animation-delay:${a}s" d="${I(e,s,t,r)}" />`}function Q(e,s,t,r,a,i,o="arch"){const n=o==="lit"?j:K;return Array.from({length:t},(h,w)=>o==="lit"?n(e+w*(r+i),s,r,a,w*.83%5):n(e+w*(r+i),s,r,a)).join("")}function B(e,s,t,r=30){const a=r/2;return`<g class="stone">
    <rect x="${e-a}" y="${s}" width="${r}" height="${t-s}" rx="4" />
    <rect x="${e-a-9}" y="${s-14}" width="${r+18}" height="16" rx="5" />
    <rect x="${e-a-11}" y="${t-14}" width="${r+22}" height="16" rx="5" />
  </g>`}function W(e,s,t,r){const a=t/2;return`<g class="stone">
    <rect x="${e-a}" y="${s-7}" width="${t}" height="8" rx="4" />
    <rect x="${e-a+5}" y="${s-r}" width="6" height="${r-7}" />
    <rect x="${e+a-11}" y="${s-r}" width="6" height="${r-7}" />
  </g>${N(e,s-r,t*.9,r*.7)}`}function es(e=0,s=18,t={x:0,y:0,w:1600,h:900}){let r=e*9301+49297;const a=()=>(r=(r*9301+49297)%233280)/233280;return`<g class="motes">${Array.from({length:s},()=>{const i=t.x+a()*t.w,o=t.y+a()*t.h,n=2+a()*2.6,h=(a()*9).toFixed(2),w=(7+a()*7).toFixed(2);return`<circle cx="${i}" cy="${o}" r="${n}" style="animation-delay:${h}s; animation-duration:${w}s" />`}).join("")}</g>`}function os(e,s,t,r,a=2.6){const i=e+t/2;return`<path class="light-shaft" d="M ${e} ${s} L ${e+t} ${s}
    L ${i+t*a/2} ${s+r} L ${i-t*a/2} ${s+r} Z" />`}function qs(){return`
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
</defs>`}const L={floorY:420,taraX:60,wallX:-1090,doorX:390};function Ts(){const{floorY:e}=L;return`
<g class="room">
  <!-- back wall and floor -->
  <rect class="room-wall" x="-1180" y="-620" width="1700" height="${e+620}" />
  <rect class="room-floor" x="-1180" y="${e}" width="1700" height="520" />
  <rect class="room-skirting" x="-1180" y="${e-16}" width="1700" height="20" />

  <!-- wall niches -->
  <g class="room-niche">
    ${K(-1020,40,130,300,"niche")}
    ${K(-840,40,130,300,"niche")}
  </g>

  <!-- rug -->
  <ellipse class="rug" cx="-320" cy="${e+150}" rx="520" ry="98" />
  <ellipse class="rug-in" cx="-320" cy="${e+150}" rx="380" ry="66" />

  <!-- bed -->
  <g class="bed">
    <rect class="bed-frame" x="-1080" y="${e-30}" width="520" height="150" rx="16" />
    <rect class="bed-sheet" x="-1060" y="${e-64}" width="480" height="60" rx="26" />
    <rect class="bed-pillow" x="-1044" y="${e-104}" width="160" height="70" rx="32" />
    <rect class="bed-post" x="-1090" y="${e-250}" width="26" height="240" rx="12" />
    <circle class="bed-knob" cx="-1077" cy="${e-258}" r="18" />
  </g>

  <!-- bookshelf and books -->
  <g class="shelf">
    <rect class="shelf-board" x="-560" y="${e-216}" width="250" height="16" rx="6" />
    <rect class="book b1" x="-548" y="${e-292}" width="34" height="78" rx="5" />
    <rect class="book b2" x="-508" y="${e-278}" width="28" height="64" rx="5" />
    <rect class="book b3" x="-474" y="${e-300}" width="36" height="86" rx="5" />
    <rect class="book b4" x="-432" y="${e-268}" width="26" height="54" rx="5" />
    <rect class="book b5" x="-400" y="${e-286}" width="32" height="72" rx="5" />
  </g>

  <!-- little table with the oil lamp -->
  <g class="lamp-table">
    <rect class="table-top" x="-320" y="${e-130}" width="200" height="18" rx="8" />
    <rect class="table-leg" x="-296" y="${e-112}" width="18" height="112" rx="7" />
    <rect class="table-leg" x="-164" y="${e-112}" width="18" height="112" rx="7" />
    <g class="lamp">
      <circle class="lamp-halo" cx="-220" cy="${e-196}" r="230" fill="url(#lampGlow)" />
      <path class="lamp-dish" d="M -272 ${e-134} Q -220 ${e-104} -168 ${e-134}
        L -180 ${e-158} L -260 ${e-158} Z" />
      <g class="lamp-flame">
        <path class="flame-outer" d="M -220 ${e-232} C -196 ${e-198} -200 ${e-158} -220 ${e-158}
          C -240 ${e-158} -244 ${e-198} -220 ${e-232} Z" />
        <path class="flame-inner" d="M -220 ${e-206} C -210 ${e-190} -212 ${e-168} -220 ${e-168}
          C -228 ${e-168} -230 ${e-190} -220 ${e-206} Z" />
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
    <rect class="door-frame" x="264" y="-140" width="252" height="${e+140}" rx="10" />
    <rect class="door-void"  x="280" y="-124" width="220" height="${e+124}" rx="8" />
    <g class="door-swing">
      <rect class="door-leaf"  x="280" y="-124" width="220" height="${e+124}" rx="8" />
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
  ${es(21,8,{x:-900,y:-400,w:1300,h:800})}
</g>`}const b={x0:560,x1:3180,floorY:L.floorY,centreX:1840,askX:1760};function Ms(e,s){return`
<g class="fountain">
  <ellipse class="water-pool" cx="${e}" cy="${s}" rx="260" ry="66" />
  <path class="basin" d="M ${e-270} ${s-6} Q ${e} ${s+74} ${e+270} ${s-6}
    L ${e+250} ${s-40} L ${e-250} ${s-40} Z" />
  <rect class="basin" x="${e-34}" y="${s-210}" width="68" height="175" rx="16" />
  <ellipse class="basin-top" cx="${e}" cy="${s-212}" rx="132" ry="32" />
  <ellipse class="water-top" cx="${e}" cy="${s-216}" rx="112" ry="24" />
  <g class="jets">
    ${[-86,-44,0,44,86].map((t,r)=>`
      <path class="jet" style="animation-delay:${(r*.23).toFixed(2)}s"
        d="M ${e+t} ${s-226} Q ${e+t*1.5} ${s-150} ${e+t*1.9} ${s-46}" />`).join("")}
  </g>
  <g class="ripples">
    <ellipse class="rp r1" cx="${e}" cy="${s+6}" rx="60" ry="16" />
    <ellipse class="rp r2" cx="${e}" cy="${s+6}" rx="60" ry="16" />
    <ellipse class="rp r3" cx="${e}" cy="${s+6}" rx="60" ry="16" />
  </g>
</g>`}function X(e,s,t=1){return`
<g class="plant" transform="translate(${e} ${s}) scale(${t})">
  <path class="pot" d="M -52 0 L 52 0 L 38 92 L -38 92 Z" />
  <rect class="pot-rim" x="-60" y="-16" width="120" height="22" rx="9" />
  <g class="fronds">
    <path class="frond" d="M 0 -10 C -70 -40 -96 -120 -58 -176 C -30 -126 -14 -64 0 -10 Z" />
    <path class="frond" d="M 0 -10 C 64 -46 92 -126 52 -180 C 26 -126 12 -62 0 -10 Z" />
    <path class="frond" d="M 0 -10 C -26 -86 -8 -166 20 -200 C 24 -136 12 -66 0 -10 Z" />
  </g>
</g>`}function D(e,s,t,r=0){return`
<g class="court-lantern" style="animation-delay:${r}s">
  <line class="chain" x1="${e}" y1="${s}" x2="${e}" y2="${t}" />
  <path class="lantern-shell" d="M ${e-40} ${t} L ${e+40} ${t}
    L ${e+26} ${t+84} L ${e-26} ${t+84} Z" />
  <rect class="lantern-cap" x="${e-46}" y="${t-14}" width="92" height="18" rx="7" />
  <circle class="lantern-glow" cx="${e}" cy="${t+40}" r="26" />
</g>`}function As(){const{x0:e,x1:s,floorY:t,centreX:r}=b,a=-760;return`
<g class="courtyard">
  <!-- open sky above the courtyard -->
  <rect class="court-sky" x="${e}" y="-1180" width="${s-e}" height="${-a+1180-0}" />
  <g class="court-stars">
    ${[[820,-1040],[1180,-930],[1520,-1090],[1980,-960],[2420,-1050],[2760,-900],[1340,-1150],[2180,-1130],[2960,-1e3]].map(([i,o],n)=>`<circle class="${n%3?"still":""}" cx="${i}" cy="${o}" r="${n%2?6:8}" style="animation-delay:${n*.7}s" />`).join("")}
  </g>
  <circle class="court-moon" cx="2560" cy="-1010" r="96" />

  <!-- back wall, gallery and arcade -->
  <rect class="court-wall" x="${e}" y="${a}" width="${s-e}" height="${t-a}" />
  <rect class="court-band" x="${e}" y="${a}" width="${s-e}" height="34" />

  <!-- upper balconies -->
  <g class="balconies">
    ${[900,1500,2100,2700].map((i,o)=>`
      <g class="balcony">
        <rect class="balcony-floor" x="${i-130}" y="${a+300}" width="260" height="26" rx="8" />
        <rect class="balcony-rail"  x="${i-124}" y="${a+236}" width="248" height="16" rx="7" />
        ${[0,1,2,3,4].map(n=>`<rect class="baluster" x="${i-112+n*54}" y="${a+250}" width="13" height="52" rx="5" />`).join("")}
        <path class="balcony-arch" d="${I(i-96,a+60,192,178)}" />
        <g class="court-curtain" style="animation-delay:${o*.8}s">
          <path d="M ${i-92} ${a+64} L ${i-30} ${a+64} C ${i-38} ${a+140} ${i-34} ${a+200} ${i-26} ${a+236} L ${i-92} ${a+238} Z" />
        </g>
      </g>`).join("")}
  </g>

  <!-- ground-level arcade -->
  <g class="court-arcade">
    ${[760,1180,2500,2920].map(i=>`
      <path class="court-niche" d="${I(i-110,t-430,220,430)}" />`).join("")}
    ${B(970,t-470,t,46)}
    ${B(2710,t-470,t,46)}
  </g>

  <!-- moonlight falling into the open court -->
  ${os(1420,a+40,300,t-a-40,1.9)}
  ${os(2260,a+40,240,t-a-40,1.7)}

  <!-- lanterns -->
  ${D(1300,a+40,-190,0)}
  ${D(2380,a+40,-250,1.1)}
  ${D(1820,a+40,-330,.55)}

  <!-- floor -->
  <rect class="court-floor" x="${e}" y="${t}" width="${s-e}" height="560" />
  <g class="court-tiles">
    ${Array.from({length:13},(i,o)=>`<rect x="${e+o*200}" y="${t}" width="5" height="560" />`).join("")}
    ${Array.from({length:4},(i,o)=>`<rect x="${e}" y="${t+90+o*120}" width="${s-e}" height="5" />`).join("")}
  </g>
  <rect class="court-step" x="${e}" y="${t-14}" width="${s-e}" height="18" rx="6" />

  ${Ms(r,t-30)}

  ${X(760,t,1)}
  ${X(2980,t,1.1)}
  ${X(1140,t,.78)}
  ${X(2620,t,.86)}

  ${es(41,12,{x:e,y:-760,w:s-e,h:1200})}
</g>`}function zs(){return`
<g class="ask-anchor">
<g class="ask-prompt" role="button" tabindex="0" aria-label="Ask for the secret">
  <ellipse class="ask-aura" cx="0" cy="0" rx="330" ry="120" />
  <rect class="ask-hit" x="-360" y="-130" width="720" height="260" rx="130" />
  <g class="ask-motes">
    ${[[-210,-46,0],[190,-62,.8],[-120,58,1.6],[240,40,2.2],[40,-86,1.2],[-260,18,2.8]].map(([e,s,t])=>`<circle cx="${e}" cy="${s}" r="5" style="animation-delay:${t}s" />`).join("")}
  </g>
  <path class="ask-underline" d="M -196 46 Q 0 74 196 46" />
  <text class="ask-text" x="0" y="12" text-anchor="middle">Ask for the secret</text>
</g>
</g>`}function Cs(){return`
<g class="ask-speech-anchor">
<g class="ask-speech">
  <ellipse class="speech-aura" cx="0" cy="0" rx="420" ry="118" />
  <text class="speech-text" x="0" y="10" text-anchor="middle">Where is my secret?</text>
</g>
</g>`}function Es(){return`
<g class="q-motes">
  ${[[-230,30,0],[-90,-40,.35],[70,10,.7],[220,-30,1.05],[-10,70,1.4],[160,80,1.75]].map(([s,t,r])=>`
    <text class="q" x="${s}" y="${t}" text-anchor="middle" style="animation-delay:${r}s">?</text>`).join("")}
</g>`}const Z={x0:-1560,x1:3520,roofY:-1320,baseY:1010};function Ps(){return`
<g class="kingdom">
  <rect class="kd-sky" x="-6000" y="-4200" width="16000" height="7600" />
  <g class="kd-stars is-still">
    ${[[-3200,-2600],[-2400,-1800],[-1e3,-3e3],[600,-2400],[2200,-2900],[4200,-2e3],[5400,-2700],[-4200,-1400],[3400,-3300],[1400,-3400],[-2e3,-3400],[4800,-1200]].map(([e,s],t)=>`<circle cx="${e}" cy="${s}" r="${18+t%3*8}" style="animation-delay:${t*.5}s" />`).join("")}
  </g>
  <circle class="kd-moon" cx="-2900" cy="-2500" r="210" />
  <path class="kd-hills" d="M -6000 1180 Q -3600 780 -1400 1120 Q 900 1420 3200 1060 Q 6200 700 10000 1160
    L 10000 3400 L -6000 3400 Z" />
  <path class="kd-hills far" d="M -6000 980 Q -3000 600 -600 940 Q 1800 1240 4400 860 Q 7400 520 10000 960
    L 10000 3400 L -6000 3400 Z" />
</g>`}function Rs(){const{x0:e,x1:s,roofY:t,baseY:r}=Z;return`
<g class="shell">
  <path class="shell-roof" d="M ${e-140} ${t+250} L ${(e+s)/2} ${t-210}
    L ${s+140} ${t+250} L ${s+140} ${t+330} L ${e-140} ${t+330} Z" />
  <rect class="shell-wall" x="${e}" y="${t+300}" width="220" height="${r-t-300}" />
  <rect class="shell-wall" x="${s-220}" y="${t+300}" width="220" height="${r-t-300}" />
  <rect class="shell-band" x="${e-60}" y="${t+300}" width="${s-e+120}" height="46" />
  <rect class="shell-base" x="${e-200}" y="${r}" width="${s-e+400}" height="150" />
  <g class="shell-windows">
    ${[-1460,-1380,3380,3440].map((a,i)=>`<rect class="shell-lit" x="${a}" y="${t+520+i%2*190}" width="52" height="104" rx="24"
             style="animation-delay:${i*.9}s" />`).join("")}
  </g>
</g>`}function Os(){const e={x0:-1200,x1:540,y0:-640,y1:L.floorY+120},s={x0:b.x0-20,x1:b.x1+20,y0:-800,y1:b.floorY+200},t={x0:Z.x0-80,x1:Z.x1+80,y0:Z.roofY-160,y1:Z.baseY+90};return`
<g class="layer-glows">
  <!-- 1 · her room -->
  <g class="lg lg-local">
    <rect class="lg-fill"   x="${e.x0}" y="${e.y0}" width="${e.x1-e.x0}" height="${e.y1-e.y0}" rx="26" />
    <rect class="lg-stroke" x="${e.x0}" y="${e.y0}" width="${e.x1-e.x0}" height="${e.y1-e.y0}" rx="26" />
  </g>

  <!-- 2 · the courtyard. Drawn growing OUT of the room, because it only counts
          as an enclosing space by virtue of the room sitting inside it. -->
  <g class="lg lg-enclosing">
    <rect class="lg-fill"   x="${s.x0}" y="${s.y0}" width="${s.x1-s.x0}" height="${s.y1-s.y0}" rx="30" />
    <rect class="lg-stroke" x="${s.x0}" y="${s.y0}" width="${s.x1-s.x0}" height="${s.y1-s.y0}" rx="30" />
    <path class="lg-link" d="M ${e.x1} ${L.floorY-200} L ${s.x0} ${L.floorY-200}" />
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
</g>`}function R(e,s,t,r,a=""){return`
<g class="mlabel mlabel-${e}" transform="translate(${t} ${r})">
  <g class="ml-motes">
    ${[[-150,-30,0],[140,-44,.6],[-60,46,1.2],[110,40,1.8],[10,-62,.9]].map(([o,n,h])=>`<circle r="7" style="--mx:${o}px; --my:${n}px; animation-delay:${h}s" />`).join("")}
  </g>
  <path class="ml-rule" d="M -172 52 Q 0 74 172 52" />
  <text class="ml-text" x="0" y="0" text-anchor="middle">${s}</text>
  ${a?`<text class="ml-note" x="0" y="112" text-anchor="middle">${a}</text>`:""}
</g>`}function Fs(){return`
<g class="perch-stand">
  <rect class="perch-post" x="-9" y="-250" width="18" height="250" rx="9" />
  <rect class="perch-bar"  x="-92" y="-262" width="184" height="16" rx="8" />
  <ellipse class="perch-foot" cx="0" cy="4" rx="74" ry="17" />
  <g class="perch-bird" transform="translate(0 -262) scale(0.62)">
    ${ps()}
  </g>
</g>`}function Zs(){return`
<g class="error-spell">
  <g class="err-smoke">
    ${[[-300,0,0],[-120,-40,.5],[80,20,1],[260,-30,1.5],[-40,60,.8],[190,70,1.9]].map(([e,s,t])=>`<ellipse cx="${e}" cy="${s}" rx="150" ry="70" style="animation-delay:${t}s" />`).join("")}
  </g>
  <g class="err-shards">
    ${[[-380,-90],[-190,110],[40,-130],[250,90],[420,-60],[-60,140]].map(([e,s],t)=>`<path d="M ${e} ${s} l 26 -46 l 20 52 z" style="animation-delay:${t*.14}s" />`).join("")}
  </g>
  <text class="err-text" x="0" y="0" text-anchor="middle">UnboundLocalError</text>
  <path class="err-crack" d="M -430 46 L -300 20 L -170 58 L -30 14 L 110 56 L 250 18 L 430 50" />
</g>`}function Qs(){return`
<g class="trails">
  <path class="read-out"   d="M -360 -260 C 260 -780 1080 -1120 1800 -1160" />
  <path class="read-local" d="M -360 -250 C -430 -300 -500 -320 -560 -308" />
  <path class="read-blocked" d="M -360 -260 C -250 -300 -150 -330 -40 -344" />
  <g class="block-wall">
    <path class="bw-line" d="M 20 -520 L 20 -60" />
    <g class="bw-sparks">
      ${[-380,-280,-180].map((e,s)=>`<circle cx="20" cy="${e}" r="12" style="animation-delay:${s*.18}s" />`).join("")}
    </g>
  </g>
</g>`}const c={x:1600,y:300,w:380,h:520,scale:.225},T=980,cs=(()=>{let e=12345;const s=()=>(e=(e*9301+49297)%233280)/233280;return Array.from({length:44},()=>({x:-1400+s()*5e3,y:-1500+s()*1900,r:1.6+s()*3.4,d:(s()*6).toFixed(2),layer:s()<.4?"far":"near"}))})();function G(e,s,t,r,a){return`<g class="cloud" style="animation-delay:${r}s; animation-duration:${a}s"
     transform="translate(${e} ${s}) scale(${t})">
    <ellipse cx="0" cy="0" rx="200" ry="40" />
    <ellipse cx="-110" cy="14" rx="120" ry="30" />
    <ellipse cx="116" cy="16" rx="140" ry="34" />
    <ellipse cx="20" cy="-24" rx="96" ry="32" />
  </g>`}function _(e,s,t,r){return`<g class="flagpole-g">
    <rect class="flagpole" x="${e-3}" y="${s-t}" width="6" height="${t+26}" rx="3" />
    <circle class="flagpole" cx="${e}" cy="${s-t-5}" r="6" />
    <path class="pennant" style="animation-delay:${r}s"
      d="M ${e+3} ${s-t+2} L ${e+44} ${s-t+14} L ${e+3} ${s-t+26} Z" />
  </g>`}function Ws(){return`
<g class="sky-group">
  <rect x="-2600" y="-1900" width="8000" height="3400" fill="url(#nightSky)" />
  <circle cx="620" cy="-960" r="430" fill="url(#moonGlow)" />
  <circle class="moon" cx="620" cy="-960" r="104" />
  <circle class="moon-crater" cx="586" cy="-990" r="18" />
  <circle class="moon-crater" cx="650" cy="-930" r="12" />
  <circle class="moon-crater" cx="638" cy="-1004" r="9" />

  <g class="stars far">
    ${cs.filter(e=>e.layer==="far").map((e,s)=>`<circle class="${s%2?"still":""}" cx="${e.x}" cy="${e.y}" r="${e.r*.7}" style="animation-delay:${e.d}s" />`).join("")}
  </g>
  <g class="stars near">
    ${cs.filter(e=>e.layer==="near").map((e,s)=>`<circle class="${s%2?"still":""}" cx="${e.x}" cy="${e.y}" r="${e.r}" style="animation-delay:${e.d}s" />`).join("")}
  </g>

  <g class="clouds">
    ${G(-900,-1180,1.1,0,96)}
    ${G(-1700,-760,.8,16,122)}
    ${G(-500,-420,1.35,40,148)}
    ${G(-2100,-1420,.9,62,134)}
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
  <rect class="stone" x="880" y="700" width="200" height="${T-700}" rx="6" />
  ${W(980,700,74,58)}
  <rect class="stone" x="2120" y="700" width="200" height="${T-700}" rx="6" />
  ${W(2220,700,74,58)}
  ${Q(906,800,2,56,150,44,"lit")}
  ${Q(2146,800,2,56,150,44,"lit")}

  <!-- flanking towers -->
  <rect class="stone" x="1120" y="420" width="112" height="${T-420}" rx="6" />
  ${N(1176,420,132,108)}
  <rect class="stone" x="1968" y="420" width="112" height="${T-420}" rx="6" />
  ${N(2024,420,132,108)}
  ${_(1176,306,62,0)}
  ${_(2024,306,62,1.3)}

  <!-- great hall -->
  <rect class="stone" x="1220" y="520" width="760" height="${T-520}" rx="8" />
  <rect class="stone-band" x="1258" y="486" width="684" height="42" rx="14" />
  ${N(1600,486,330,260)}
  ${_(1600,180,74,.7)}
  ${W(1320,486,66,54)}
  ${W(1880,486,66,54)}
  ${B(1300,640,T)}
  ${B(1900,640,T)}

  <!-- ordinary lit windows, staggered so the palace breathes -->
  ${Q(1254,700,2,58,160,52,"lit")}
  ${Q(1830,700,2,58,160,52,"lit")}
  ${j(1148,560,48,120,2.1)}
  ${j(1996,560,48,120,.8)}
  ${j(1560,180,74,130,1.6)}

  <!-- plinth -->
  <rect class="plinth" x="820" y="${T-28}" width="1560" height="40" rx="8" />
</g>

<rect class="ground" x="-2600" y="${T}" width="8000" height="900" />

<!-- ─────────── Tara's window: the way in ─────────── -->
<g class="hero-window">
  <!-- warm light spilling out before we can see inside -->
  <ellipse class="hero-glow" cx="${c.x}" cy="${c.y}" rx="520" ry="560" />

  <!-- the room, mounted inside the opening and clipped to it -->
  <g class="portal" clip-path="url(#heroClip)">
    <g transform="translate(${c.x} ${c.y}) scale(${c.scale})">
      <!-- Behind everything, and only shown once the camera clears the roof. -->
      <g class="outer-world">
        ${Ps()}
        ${Rs()}
      </g>
      ${As()}
      ${Ts()}
      <g class="tara-slot"></g>
      ${Os()}
      <g class="magic-labels">
        ${R("local","Local",-330,-900,"inside one function")}
        ${R("enclosing","Enclosing",1870,-1120,"a function written inside another")}
        ${R("global","Global",980,-1760,"the whole file")}
        ${R("builtin","Built-in",980,-2520,"names Python already knows")}
      </g>
      ${Qs()}
      ${Fs()}
      ${Zs()}
      <g class="shadow-tag">
        ${R("shadow","shadowing",-300,-900)}
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
        ${zs()}
        ${Cs()}
        ${Es()}
      </g>
    </g>
  </g>

  <!-- frame and shutters sit over the opening -->
  <g class="hero-frame">
    <path class="frame-stone" d="M ${c.x-c.w/2-26} ${c.y+c.h/2+20}
      L ${c.x-c.w/2-26} ${c.y-70}
      Q ${c.x-c.w/2-26} ${c.y-c.h/2-60} ${c.x} ${c.y-c.h/2-86}
      Q ${c.x+c.w/2+26} ${c.y-c.h/2-60} ${c.x+c.w/2+26} ${c.y-70}
      L ${c.x+c.w/2+26} ${c.y+c.h/2+20}
      L ${c.x+c.w/2} ${c.y+c.h/2+20}
      L ${c.x+c.w/2} ${c.y-70}
      Q ${c.x+c.w/2} ${c.y-c.h/2-20} ${c.x} ${c.y-c.h/2-44}
      Q ${c.x-c.w/2} ${c.y-c.h/2-20} ${c.x-c.w/2} ${c.y-70}
      L ${c.x-c.w/2} ${c.y+c.h/2+20} Z" />
    <rect class="frame-sill" x="${c.x-c.w/2-44}" y="${c.y+c.h/2+12}"
          width="${c.w+88}" height="30" rx="12" />
  </g>

  <g class="shutter shutter-l">
    <rect x="${c.x-c.w/2}" y="${c.y-c.h/2-30}"
          width="${c.w/2}" height="${c.h+50}" rx="6" />
    <rect class="shutter-slat" x="${c.x-c.w/2+16}" y="${c.y-130}" width="${c.w/2-32}" height="10" rx="5" />
    <rect class="shutter-slat" x="${c.x-c.w/2+16}" y="${c.y-60}" width="${c.w/2-32}" height="10" rx="5" />
    <rect class="shutter-slat" x="${c.x-c.w/2+16}" y="${c.y+10}" width="${c.w/2-32}" height="10" rx="5" />
  </g>
  <g class="shutter shutter-r">
    <rect x="${c.x}" y="${c.y-c.h/2-30}"
          width="${c.w/2}" height="${c.h+50}" rx="6" />
    <rect class="shutter-slat" x="${c.x+16}" y="${c.y-130}" width="${c.w/2-32}" height="10" rx="5" />
    <rect class="shutter-slat" x="${c.x+16}" y="${c.y-60}" width="${c.w/2-32}" height="10" rx="5" />
    <rect class="shutter-slat" x="${c.x+16}" y="${c.y+10}" width="${c.w/2-32}" height="10" rx="5" />
  </g>
</g>

${es(3,14,{x:700,y:200,w:1800,h:800})}`}function Xs(){return`<clipPath id="heroClip">
    <path d="M ${c.x-c.w/2} ${c.y+c.h/2+20}
      L ${c.x-c.w/2} ${c.y-70}
      Q ${c.x-c.w/2} ${c.y-c.h/2-20} ${c.x} ${c.y-c.h/2-44}
      Q ${c.x+c.w/2} ${c.y-c.h/2-20} ${c.x+c.w/2} ${c.y-70}
      L ${c.x+c.w/2} ${c.y+c.h/2+20} Z" />
  </clipPath>`}function ns(){return`
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
</g>`}function ds(e){const s=Math.max(190,e.length*30+84);return`
<g class="spark-word" aria-hidden="true">
  <ellipse class="sw-aura" cx="0" cy="0" rx="${s*.78}" ry="74" />
  <rect class="sw-plate" x="${-s/2}" y="-38" width="${s}" height="76" rx="38" />
  <text class="sw-text" x="0" y="14" text-anchor="middle">${e}</text>
  <g class="sw-motes">
    ${[[-s*.4,-28,0],[s*.34,-34,.8],[-s*.2,36,1.6],[s*.44,26,2.3],[6,-52,1.1],[-s*.46,14,2.9]].map(([t,r,a])=>`<circle cx="${t}" cy="${r}" r="3.6" style="animation-delay:${a}s" />`).join("")}
  </g>
</g>`}function Gs(e=26){let s=777;const t=()=>(s=(s*9301+49297)%233280)/233280;return`<g class="title-motes">${Array.from({length:e},()=>{const r=t()*Math.PI*2,a=300+t()*620;return`<circle r="${2+t()*3.2}"
      style="--fx:${(Math.cos(r)*a).toFixed(1)}px; --fy:${(Math.sin(r)*a*.6).toFixed(1)}px;
             animation-delay:${(t()*1.1).toFixed(2)}s" />`}).join("")}</g>`}const m=(e,s)=>({x:c.x+e*c.scale,y:c.y+s*c.scale}),hs={x:26,y:176},O=L.wallX;async function Ns(e){const{camera:s,tara:t,spark:r,hers:a,ui:i,root:o}=e,n=o.querySelector(".room"),h=o.querySelector(".wall-ripple");i.classList.contains("show-title")&&(i.classList.add("title-out"),await l(900),i.classList.remove("show-title","show-sub","title-out")),r.moveTo(470,-330,{duration:1500,easing:g.inOut}),o.querySelector(".spark-slot").classList.add("is-dimmed"),await s.to({...m(t.x-30,150),zoom:s.fitRoom(1569),duration:1400}),t.express("curious"),await l(500),await s.to({...m(t.x+10,70),zoom:s.fitRoom(1067),duration:1400}),await l(400),t.setPose("whisper"),await l(500),a.at(t.x+hs.x,t.y-hs.y).setScale(.06),a.el.classList.add("is-live"),await l(300),await a.scaleTo(1,{duration:1e3,easing:g.back}),a.el.classList.add("is-word"),await l(400),t.setPose("idle"),t.express("happy"),await S(a.moveTo(t.x+120,t.y-330,{duration:1400,easing:g.out}),s.to({...m(t.x+60,-60),zoom:s.fitRoom(1356),duration:1400})),await l(400),t.express("curious"),s.follow(a,{map:(w,u)=>m(w,u),offsetY:60,lag:.035}),await a.moveTo(-180,-400,{duration:1400,easing:g.inOut}),await a.moveTo(-430,-250,{duration:1400,easing:g.inOut}),await S(t.walkTo(-320,{speed:200}),a.moveTo(-700,-320,{duration:1400,easing:g.inOut})),await a.moveTo(O,-300,{duration:1400,easing:g.in}),h.setAttribute("transform",`translate(${O-20} -300)`),h.classList.remove("is-hit"),h.getBoundingClientRect(),h.classList.add("is-hit"),a.el.classList.add("is-bouncing"),s.shake(9),await a.moveTo(O+250,-350,{duration:700,easing:g.out}),a.el.classList.remove("is-bouncing"),s.unfollow(),await s.to({...m(-520,-190),zoom:s.fitRoom(1455),duration:1200}),t.express("surprised"),await l(500),t.express("curious"),s.follow(a,{map:(w,u)=>m(w,u),offsetY:40,lag:.03}),await a.moveTo(O+30,-270,{duration:1400,easing:g.inOut}),h.classList.remove("is-hit"),h.getBoundingClientRect(),h.setAttribute("transform",`translate(${O-10} -270)`),h.classList.add("is-hit"),a.el.classList.add("is-straining"),s.shake(5),await l(600),a.el.classList.add("is-fading"),await l(900),a.el.classList.remove("is-live","is-word","is-straining","is-fading"),s.unfollow(),await s.to({...m(-560,-60),zoom:s.fitRoom(1379),duration:1400}),t.express("confused"),await l(600),await t.walkTo(-760,{speed:150}),await t.face("left"),t.setPose("touch"),n.classList.add("wall-felt"),await l(1e3),o.querySelector(".tara").classList.add("mithu-alert"),await l(700),t.setPose("idle"),await t.face("right"),t.express("curious"),await s.to({...m(-420,-40),zoom:s.fitRoom(1905),duration:1400}),await l(400),o.querySelector(".room-door").classList.add("is-noticed"),await l(800),i.dataset.line="far",i.classList.add("show-line"),await l(4e3),i.classList.remove("show-line"),n.classList.remove("wall-felt"),o.querySelector(".tara").classList.remove("mithu-alert"),o.querySelector(".room-door").classList.remove("is-noticed"),await l(300)}async function js(e){const{camera:s,tara:t,hers:r,ui:a,root:i}=e,o=i.querySelector(".room-door"),n=i.querySelector(".ask-prompt"),h=i.querySelector(".ask-anchor"),w=i.querySelector(".ask-speech"),u=i.querySelector(".ask-speech-anchor"),p=i.querySelector(".q-motes");r.at(-620,-240).setScale(1),r.el.classList.add("is-live","is-word","is-homebound"),await l(400),i.querySelector(".tara").classList.add("mithu-alert"),await l(500),t.express("curious"),await t.face("right"),await l(300),o.classList.add("is-open"),await l(500),s.follow(t,{map:(k,v)=>m(k,v),offsetY:-150,lag:.028}),await t.walkTo(L.doorX+40,{speed:210}),await l(400),await t.walkTo(b.x0+300,{speed:200}),s.unfollow(),await s.to({...m(b.centreX-260,-120),zoom:s.fitRoom(3077),duration:2300,easing:g.inOut}),t.express("surprised"),await l(500),await t.face("left"),await l(300),await t.face("right"),t.express("curious"),await l(400),h.setAttribute("transform",`translate(${b.askX} -470)`),await s.to({...m(b.askX,-250),zoom:s.fitRoom(2150),duration:1600,easing:g.inOut}),await t.face("right"),n.classList.add("is-offered"),await new Promise(k=>{const v=setTimeout(()=>n.classList.add("is-urging"),7e3),C=()=>{clearTimeout(v),n.classList.remove("is-urging"),n.removeEventListener("click",C),n.removeEventListener("keydown",E),k()},E=y=>{(y.key==="Enter"||y.key===" ")&&(y.preventDefault(),C())};n.addEventListener("click",C),n.addEventListener("keydown",E)}),n.classList.remove("is-offered"),n.classList.add("is-taken"),await S(t.walkTo(b.askX,{speed:190}),s.to({...m(b.askX+60,-180),zoom:s.fitRoom(2667),duration:1700})),await l(300),await t.face("left"),await l(300),t.setPose("reach"),t.express("curious"),u.setAttribute("transform",`translate(${b.askX+30} -330)`),w.classList.add("is-spoken"),await l(1100),t.setPose("idle"),w.classList.remove("is-spoken"),p.setAttribute("transform",`translate(${b.askX+40} -420)`),p.classList.add("is-asking"),i.querySelector(".courtyard").classList.add("is-hushed"),await l(1100),p.classList.remove("is-asking"),t.express("confused"),i.querySelector(".tara").classList.add("mithu-alert"),await l(700),await t.face("left"),await l(300),await s.to({...m(700,-180),zoom:s.fitRoom(4706),duration:2300,easing:g.inOut}),r.el.classList.add("is-beckoning"),await l(1100),a.dataset.line="born",a.classList.add("show-line"),await l(4800),a.classList.remove("show-line"),await l(400),i.querySelector(".tara").classList.remove("mithu-alert"),i.querySelector(".courtyard").classList.remove("is-hushed"),r.el.classList.remove("is-beckoning")}const Hs=[{id:"local",cls:"lg-local"},{id:"enclosing",cls:"lg-enclosing"},{id:"global",cls:"lg-global"},{id:"builtin",cls:"lg-builtin"}];async function Us(e){const{camera:s,tara:t,code:r,ui:a,root:i}=e,o=i.querySelector(".layer-glows"),n=i.querySelector(".magic-labels");t.setPose("idle").express("curious"),await s.to({...m(900,-420),zoom:s.zoomToFitWidth(1080),duration:2300,easing:g.inOut}),await l(300),i.querySelector(".portal").classList.add("show-shell"),await s.to({...m(980,-940),zoom:s.zoomToFitWidth(1760),duration:2600,easing:g.inOut}),await l(500),o.classList.add("is-live");for(const h of Hs)i.querySelector(`.${h.cls}`).classList.add("is-lit"),await l(400),n.querySelector(`.mlabel-${h.id}`).classList.add("is-named"),await l(900);await l(500),a.dataset.line="names",a.classList.add("show-line"),await l(3600),a.classList.remove("show-line"),a.dataset.line="legb",a.classList.add("show-line"),await l(4600),a.classList.remove("show-line"),r.dock(),await r.write(['name = "Mithu"'],{stagger:0}),r.note(0,"Global — out in the open palace"),await l(1600)}const Is=[{cls:"lg-local",found:!1,note:"not in room() — look outward"},{cls:"lg-enclosing",found:!1,note:"not in the enclosing space either"},{cls:"lg-global",found:!0,note:"found it — the palace name"}];async function Bs(e){const{camera:s,tara:t,spark:r,hers:a,code:i,ui:o,root:n}=e,h=n.querySelector(".layer-glows"),w=n.querySelector(".tara");n.querySelectorAll(".mlabel").forEach(u=>u.classList.remove("is-named")),n.querySelectorAll(".lg").forEach(u=>u.classList.remove("is-lit")),r.setText("MITHU").at(1900,-1180).setScale(1),r.el.classList.remove("is-dimmed"),r.el.classList.add("is-live","is-word","is-outer"),await s.to({...m(760,-560),zoom:s.zoomToFitWidth(1180),duration:1700}),t.express("curious"),await l(500),w.classList.add("mithu-alert"),o.dataset.line="wider",o.classList.add("show-line"),await l(3400),o.classList.remove("show-line"),w.classList.remove("mithu-alert"),i.clearNotes(),await i.append(["","def room():","    print(name)"],{stagger:380}),i.focus(3),await l(500),w.classList.add("has-lantern"),await l(500),h.classList.add("is-live","is-searching");for(const u of Is){const p=n.querySelector(`.${u.cls}`);p.classList.add("is-lit","is-probing"),i.note(3,u.note),u.cls==="lg-enclosing"&&S(t.walkTo(b.centreX-200,{speed:230}),s.to({...m(900,-640),zoom:s.zoomToFitWidth(1420),duration:1800})),u.cls==="lg-global"&&s.to({...m(980,-860),zoom:s.zoomToFitWidth(1780),duration:1900}),await l(1100),u.found?(p.classList.remove("is-probing"),p.classList.add("is-found"),r.el.classList.add("is-answering"),i.mark(3,"is-ok"),t.express("happy"),s.shake(5),await l(1400)):(p.classList.remove("is-probing"),p.classList.add("is-empty"),await l(300))}await l(800),i.unmark("is-ok"),i.note(3,"and print? found in the outermost ring"),n.querySelector(".lg-builtin").classList.add("is-lit","is-found"),n.querySelector(".mlabel-builtin").classList.add("is-named"),await l(1e3),o.dataset.line="builtin",o.classList.add("show-line"),await l(4400),o.classList.remove("show-line"),n.querySelector(".mlabel-builtin").classList.remove("is-named"),n.querySelectorAll(".lg").forEach(u=>u.classList.remove("is-empty","is-found")),h.classList.remove("is-searching"),r.el.classList.remove("is-answering"),i.unfocus(),i.clearNotes()}const Y={x:-560,y:-300};async function Ds(e){const{camera:s,tara:t,spark:r,hers:a,code:i,ui:o,root:n}=e,h=n.querySelector(".tara");await S(t.walkTo(L.taraX-120,{speed:240}),s.to({...m(-120,-240),zoom:s.zoomToFitWidth(760),duration:2200})),h.classList.remove("has-lantern"),await t.face("right"),t.express("curious"),await l(500),t.setPose("whisper"),await l(500),a.setText("MITHU").at(Y.x,Y.y).setScale(.05),a.el.classList.remove("is-homebound","is-beckoning"),a.el.classList.add("is-live","is-inner"),await a.scaleTo(1,{duration:1e3,easing:g.back}),a.el.classList.add("is-word"),t.setPose("idle"),await i.retype(3,'    name = "Tara"'),i.mark(3,"is-claim"),i.note(3,"assigning MAKES a new local name"),await i.append(["    print(name)"],{stagger:0}),await l(1e3),await s.to({...m(560,-620),zoom:s.zoomToFitWidth(1500),duration:1800}),await l(800),await s.to({...m(-260,-260),zoom:s.zoomToFitWidth(820),duration:1600}),await t.walkTo(Y.x+250,{speed:200}),await t.face("left"),t.setPose("reach"),await l(300),a.el.classList.add("is-touched"),s.shake(4),await a.morphTo("TARA",{duration:1100}),a.el.classList.remove("is-touched"),t.setPose("idle"),t.express("surprised"),await l(500),await s.to({...m(620,-640),zoom:s.zoomToFitWidth(1560),duration:1800}),r.el.classList.add("is-answering"),i.note(0,"untouched"),await l(1100),r.el.classList.remove("is-answering"),i.note(0,""),t.express("happy"),h.classList.add("mithu-alert"),await l(800),h.classList.remove("mithu-alert");const w=n.querySelector(".mlabel-local");w.classList.add("is-named","is-inline"),await l(1700),i.unmark("is-claim"),i.focus(3),await l(700),o.dataset.line="readassign",o.classList.add("show-line"),await l(4400),o.classList.remove("show-line"),i.unfocus(),await s.to({...m(-160,-420),zoom:s.zoomToFitWidth(1120),duration:1800}),await l(400),n.querySelector(".reach").classList.add("show-shadow"),r.el.classList.add("is-shadowed"),a.el.classList.add("is-shadowing"),i.focus(4),i.note(4,"finds the local one; outer is hidden"),await l(1400),o.dataset.line="hides",o.classList.add("show-line"),await l(4200),o.classList.remove("show-line"),await l(500),i.unfocus(),i.clearNotes(),w.classList.remove("is-inline","is-named")}async function _s(e){const{camera:s,tara:t,spark:r,hers:a,code:i,ui:o,root:n}=e,h=n.querySelector(".tara"),w=n.querySelector(".reach");w.classList.remove("show-shadow"),r.el.classList.remove("is-shadowed"),a.el.classList.remove("is-shadowing"),await l(400),await s.to({...m(400,-620),zoom:s.zoomToFitWidth(1420),duration:1800}),await t.face("right"),t.express("curious"),await l(700),h.classList.add("mithu-alert"),o.dataset.line="speak",o.classList.add("show-line"),await l(3600),o.classList.remove("show-line"),h.classList.remove("mithu-alert"),await s.to({...m(-200,-300),zoom:s.zoomToFitWidth(880),duration:1600}),h.classList.add("has-megaphone"),await l(500),t.setPose("reach"),t.express("happy"),await l(500),await s.to({...m(700,-700),zoom:s.zoomToFitWidth(1620),duration:1700}),await i.retype(3,"    global name"),i.mark(3,"is-claim"),i.note(3,"rebinds the palace name, not a local one"),await i.append(['    name = "Tara"'],{stagger:0}),await l(800),w.classList.add("show-global"),s.shake(6),await l(1100),r.el.classList.add("is-touched"),await r.morphTo("TARA",{duration:1200}),r.el.classList.remove("is-touched"),r.el.classList.add("is-answering"),s.shake(8),await l(1100),t.setPose("idle"),r.el.classList.remove("is-answering"),w.classList.remove("show-global"),h.classList.remove("has-megaphone"),await l(500);const u=n.querySelector(".mlabel-global");u.classList.add("is-named","is-inline"),await l(1700),u.classList.remove("is-inline","is-named"),await s.to({...m(260,-420),zoom:s.zoomToFitWidth(1240),duration:1700}),h.classList.add("mithu-alert"),i.unmark("is-claim"),i.clearNotes(),await i.write(["def palace():",'    name = "Mithu"',"","    def room():","        nonlocal name",'        name = "Tara"'],{stagger:300}),i.focus(4),i.note(4,"reaches the ENCLOSING room only"),w.classList.add("show-nonlocal"),await l(1100),o.dataset.line="nonlocal",o.classList.add("show-line"),await l(4600),o.classList.remove("show-line"),w.classList.remove("show-nonlocal"),h.classList.remove("mithu-alert"),i.unfocus(),i.clearNotes(),t.express("happy"),await l(700)}async function Ys(e){const{camera:s,tara:t,spark:r,hers:a,code:i,ui:o,root:n}=e,h=n.querySelector(".tara"),w=n.querySelector(".trails"),u=n.querySelector(".error-spell");r.setText("MITHU").at(1900,-1180),r.el.classList.add("is-live","is-word","is-outer"),r.el.classList.remove("is-shadowed"),a.el.classList.remove("is-word","is-live","is-inner","is-shadowing","is-hollow"),await s.to({...m(40,-140),zoom:s.fitRoom(1500),duration:2e3}),await t.face("right"),t.express("curious"),await i.write(['name = "Mithu"',"","def room():","    print(name)",'    name = "Tara"'],{stagger:300}),await l(500),w.classList.add("show-out"),r.el.classList.add("is-answering"),await l(1100),w.classList.remove("show-out"),r.el.classList.remove("is-answering"),await l(400),await s.to({...m(-380,-200),zoom:s.fitRoom(1e3),duration:1600}),await t.face("left"),t.setPose("reach"),await l(400),a.setText("name").at(-560,-300).setScale(.1),a.el.classList.add("is-live","is-hollow"),await a.scaleTo(1,{duration:900,easing:g.back}),a.el.classList.add("is-word"),s.shake(4),t.setPose("idle"),await l(700),a.el.classList.add("is-claimed"),i.focus(4),i.note(4,"seen first — so name is local everywhere"),await l(1400),t.setPose("reach"),t.express("curious"),w.classList.add("show-local"),i.focus(3),i.note(3,"runs first — local name still empty"),await l(1e3),a.el.classList.add("is-hollow-pulse"),await l(800),w.classList.remove("show-local"),await s.to({...m(140,-300),zoom:s.fitRoom(1700),duration:1600}),w.classList.add("show-blocked"),await l(500),w.classList.add("is-barred"),s.shake(9),t.setPose("surprise"),t.express("surprised"),h.classList.add("mithu-alert"),await l(800),w.classList.remove("show-blocked","is-barred"),n.querySelector(".stage").classList.add("is-darkened"),u.setAttribute("transform","translate(120 -760)"),u.classList.add("is-cast"),i.mark(3,"is-error"),i.focus(3),s.shake(12),await l(1400),o.dataset.line="claimed",o.classList.add("show-line"),await l(4200),o.classList.remove("show-line"),await l(300),o.dataset.line="lookedthere",o.classList.add("show-line"),await l(4400),o.classList.remove("show-line"),await l(800),u.classList.remove("is-cast"),n.querySelector(".stage").classList.remove("is-darkened"),h.classList.remove("mithu-alert"),t.setPose("idle"),a.el.classList.remove("is-hollow-pulse"),i.unmark("is-error"),i.unfocus(),i.clearNotes(),await l(500)}const us={x:620,y:-1180};async function Vs(e){const{camera:s,tara:t,spark:r,hers:a,code:i,ui:o,root:n}=e,h=n.querySelector(".tara"),w=n.querySelector(".trails"),u=n.querySelector(".perch-stand"),p=n.querySelector(".error-spell");await S(t.walkTo(L.taraX-220,{speed:200}),s.to({...m(-120,-260),zoom:s.fitRoom(1300),duration:1900})),await t.face("right"),t.setPose("sit"),t.express("curious"),u.setAttribute("transform",`translate(${L.taraX+190} ${L.floorY})`),u.classList.add("is-up"),h.classList.add("mithu-away"),await l(500),o.dataset.line="rules",o.classList.add("show-line"),await l(3800),o.classList.remove("show-line"),i.at(us.x,us.y),i.undock(),await i.clear({duration:400}),await s.to({...m(520,-760),zoom:s.fitRoom(2100),duration:1800}),a.el.classList.remove("is-word","is-live","is-hollow","is-claimed","is-hollow-pulse","is-inner","is-shadowing","is-clearing"),r.setText("MITHU").at(1900,-1180),r.el.classList.add("is-live","is-word","is-outer"),await i.write(['name = "Mithu"',"","def room():","    print(name)"]),await l(300),i.focus(3),w.classList.add("show-out"),await l(500),r.el.classList.add("is-answering"),await l(700),o.dataset.line="lookout",o.classList.add("show-line"),await l(3900),o.classList.remove("show-line"),w.classList.remove("show-out"),r.el.classList.remove("is-answering"),i.unfocus(),await i.clear(),await i.write(['name = "Mithu"',"","def room():",'    name = "Tara"',"    print(name)"]),await l(300),i.focus(3),a.setText("TARA").at(-560,-300).setScale(.1),a.el.classList.remove("is-hollow","is-claimed"),a.el.classList.add("is-live","is-inner"),await a.scaleTo(1,{duration:900,easing:g.back}),a.el.classList.add("is-word"),await l(400),i.focus(4),w.classList.add("show-local"),a.el.classList.add("is-shadowing"),r.el.classList.add("is-shadowed"),await l(800),o.dataset.line="hides",o.classList.add("show-line"),await l(3800),o.classList.remove("show-line");const k=n.querySelector(".shadow-tag .mlabel");k.classList.add("is-named"),await l(1100),k.classList.remove("is-named"),w.classList.remove("show-local"),r.el.classList.remove("is-shadowed"),a.el.classList.remove("is-shadowing"),i.unfocus(),await i.clear(),await i.write(['name = "Mithu"',"","def room():","    print(name)",'    name = "Tara"']),await l(300),i.focus(4),await l(500),a.setText("name").at(-560,-300).setScale(.1),a.el.classList.remove("is-inner"),a.el.classList.add("is-live","is-hollow"),await a.scaleTo(1,{duration:800,easing:g.back}),a.el.classList.add("is-word","is-claimed"),s.shake(4),await l(700),i.focus(3),w.classList.add("show-blocked"),a.el.classList.add("is-hollow-pulse"),await l(500),w.classList.add("is-barred"),s.shake(8),await l(500),w.classList.remove("show-blocked","is-barred"),p.setAttribute("transform","translate(620 -320)"),n.querySelector(".stage").classList.add("is-darkened"),p.classList.add("is-cast"),i.mark(3,"is-error"),await l(900),o.dataset.line="assigns",o.classList.add("show-line"),await l(4400),o.classList.remove("show-line"),await l(300),o.dataset.line="novalue",o.classList.add("show-line"),await l(4e3),o.classList.remove("show-line"),p.classList.remove("is-cast"),n.querySelector(".stage").classList.remove("is-darkened"),i.unfocus(),i.unmark("is-error"),await i.clear(),a.el.classList.remove("is-hollow-pulse"),await i.write(["len = 5",'print(len("palace"))'],{stagger:380}),await l(300),i.focus(0),i.note(0,"this hides the built-in len"),n.querySelector(".lg-builtin").classList.add("is-lit"),n.querySelector(".mlabel-builtin").classList.add("is-named"),await l(900),i.focus(1),i.mark(1,"is-error"),i.note(1,"TypeError — 5 is not a function"),s.shake(6),t.express("surprised"),await l(1100),o.dataset.line="shadowbuiltin",o.classList.add("show-line"),await l(4400),o.classList.remove("show-line"),n.querySelector(".mlabel-builtin").classList.remove("is-named"),n.querySelector(".lg-builtin").classList.remove("is-lit"),i.unfocus(),i.unmark("is-error"),i.clearNotes(),await i.clear(),t.express("curious"),await s.to({...m(-140,-180),zoom:s.fitRoom(1500),duration:1600}),t.setPose("idle");for(let v=0;v<2;v+=1)await t.walkTo(L.taraX-160,{speed:240}),a.setText("TARA").at(-560,-300).setScale(.1),a.el.classList.remove("is-hollow","is-claimed"),a.el.classList.add("is-live","is-inner"),await a.scaleTo(1,{duration:700,easing:g.back}),a.el.classList.add("is-word"),await l(500),await t.walkTo(L.doorX+60,{speed:240}),a.el.classList.add("is-clearing"),await l(400),a.el.classList.remove("is-live","is-word","is-clearing","is-inner"),await l(300);o.dataset.line="freshcall",o.classList.add("show-line"),await l(4e3),o.classList.remove("show-line"),await t.walkTo(L.taraX-160,{speed:220}),await t.face("right"),t.express("happy"),await s.to({...m(980,-940),zoom:s.zoomToFitWidth(1760),duration:2400}),n.querySelector(".layer-glows").classList.add("is-live");for(const v of["local","enclosing","global","builtin"])n.querySelector(`.lg-${v}`).classList.add("is-lit"),await l(300);await l(500),o.dataset.line="begins",o.classList.add("show-line"),await l(4400),o.classList.remove("show-line"),await l(500)}const H=["local","enclosing","global","builtin"],Ks=[{name:"secret",target:0},{name:"place",target:1},{name:"name",target:2},{name:"print",target:3}],Js=[{line:6,id:"local",note:"Local — this call only"},{line:3,id:"enclosing",note:"Enclosing — the function wrapped around it"},{line:0,id:"global",note:"Global — the top level of the file"},{line:7,id:"builtin",note:"print — Built-in, always there"}];function $s(e){H.forEach(s=>{e.querySelector(`.lg-${s}`).classList.remove("is-lit","is-probing","is-found","is-empty")})}async function se(e,s,t,r){$s(e),s.setText(t).at(1900,-1180).setScale(1),s.el.classList.remove("is-dimmed","is-answering"),s.el.classList.add("is-live","is-word"),await l(900);for(let a=0;a<=r;a+=1){const i=e.querySelector(`.lg-${H[a]}`);i.classList.add("is-lit","is-probing"),await l(a===r?850:600),i.classList.remove("is-probing"),a===r?(i.classList.add("is-found"),e.querySelector(`.mlabel-${H[a]}`).classList.add("is-named"),s.el.classList.add("is-answering"),await l(1700),e.querySelector(`.mlabel-${H[a]}`).classList.remove("is-named"),s.el.classList.remove("is-answering")):(i.classList.add("is-empty"),await l(260))}await l(400)}async function ee(e){const{camera:s,tara:t,spark:r,hers:a,code:i,ui:o,root:n}=e,h=n.querySelector(".tara"),w=n.querySelector(".perch-stand");await i.clear(),w.classList.remove("is-up"),h.classList.remove("mithu-away"),n.querySelectorAll(".mlabel").forEach(u=>u.classList.remove("is-named","is-inline")),n.querySelectorAll(".lg").forEach(u=>u.classList.remove("is-lit")),await l(600),t.setPose("idle").express("happy"),await S(t.walkTo(b.centreX+620,{speed:190}),s.to({...m(b.centreX+300,-260),zoom:s.fitRoom(2200),duration:4100})),await t.face("right"),await l(600),n.querySelector(".portal").classList.add("show-shell","is-warming"),await s.to({...m(900,-620),zoom:s.fitRoom(3200),duration:3e3}),a.el.classList.add("is-settled"),r.el.classList.add("is-settled"),h.classList.add("looks-out"),t.express("happy"),await l(900),o.dataset.line="belong",o.classList.add("show-line"),await l(3400),o.classList.remove("show-line"),await s.to({...m(980,-940),zoom:s.zoomToFitWidth(1760),duration:3e3}),n.querySelector(".layer-glows").classList.add("is-live"),await l(700),o.dataset.line="fourplaces",o.classList.add("show-line"),await l(3400),o.classList.remove("show-line");for(const{name:u,target:p}of Ks)await se(n,r,u,p);$s(n),r.el.classList.remove("is-live","is-word"),await l(800),i.undock(),await i.write(['name = "Mithu"',"","def palace():",'    place = "courtyard"',"","    def room():",'        secret = "laddoo"',"        print(name, place, secret)"],{stagger:300}),await l(900),n.querySelector(".layer-glows").classList.add("is-soft");for(const{line:u,id:p,note:k}of Js)i.focus(u),i.note(u,k),n.querySelector(`.lg-${p}`).classList.add("is-lit"),n.querySelector(`.mlabel-${p}`).classList.add("is-named"),await l(2600),n.querySelector(`.mlabel-${p}`).classList.remove("is-named");i.unfocus(),await l(900),o.dataset.line="legb",o.classList.add("show-line"),await l(4600),o.classList.remove("show-line"),await l(500),o.dataset.line="assignrule",o.classList.add("show-line"),await l(4800),o.classList.remove("show-line"),await l(600),await i.clear(),n.querySelectorAll(".mlabel").forEach(u=>u.classList.add("is-fading")),n.querySelectorAll(".lg").forEach(u=>u.classList.add("is-fading")),await l(1100),n.querySelectorAll(".mlabel").forEach(u=>u.classList.remove("is-named","is-fading")),n.querySelectorAll(".lg").forEach(u=>u.classList.remove("is-lit","is-fading")),n.querySelector(".layer-glows").classList.remove("is-soft"),await s.to({...m(900,-820),zoom:s.zoomToFitWidth(1900),duration:3e3}),await l(600),o.dataset.line="bridge",o.classList.add("show-line"),await l(4200),o.classList.remove("show-line"),await l(400),o.classList.add("is-ending"),o.classList.add("show-title"),await l(4200),o.classList.add("show-sub"),await l(1600),n.querySelector(".replay").classList.add("is-offered")}async function te(e){const{camera:s,tara:t,spark:r,ui:a}=e;s.set({x:300,y:-1080,zoom:s.zoomToFitWidth(2e3)}),t.setPose("idle").express("neutral"),await l(400);const i=(async()=>{a.dataset.line="premise",a.classList.add("show-line"),await l(2100),a.dataset.line="premise2",await l(2100),a.dataset.line="premise3",await l(2200),a.classList.remove("show-line")})();await s.to({x:1150,y:-560,zoom:s.zoomToFitWidth(2300),duration:2300,easing:g.inOut}),await s.to({x:1600,y:420,zoom:s.zoomToFitWidth(1900),duration:2600,easing:g.inOut}),await i,await l(400),await s.to({x:c.x,y:c.y,zoom:s.zoomToFitWidth(780),duration:1800,easing:g.inOut}),e.root.querySelector(".hero-window").classList.add("is-open"),await l(2500),t.express("curious"),await t.face("right"),await l(600),await s.to({x:c.x,y:c.y,zoom:s.zoomToFitWidth(540),duration:1800,easing:g.inOut});const o=s.to({...m(0,40),zoom:s.fitRoom(1739),duration:2600,easing:g.inOut});await l(1900),e.root.querySelector(".portal").classList.add("is-inside"),e.root.querySelector(".hero-window").classList.add("is-passed"),await o,await s.to({...m(-40,90),zoom:s.fitRoom(1667),duration:1800}),await l(600),await S(t.walkTo(L.taraX-360,{speed:210}),s.to({...m(-220,110),zoom:s.fitRoom(1684),duration:2300})),await l(700),await t.face("right"),await l(500),r.el.classList.add("is-live"),await r.moveTo(360,-160,{duration:1600,easing:g.out}),t.express("curious"),await l(700),await S(r.moveTo(-60,-60,{duration:2e3,easing:g.inOut}),s.to({...m(-160,40),zoom:s.fitRoom(1481),duration:2e3})),t.setPose("reach"),await l(520),await r.moveTo(300,-240,{duration:900,easing:g.out}),t.setPose("idle"),t.express("surprised"),s.shake(5),await l(700),t.express("curious"),await S(t.walkTo(L.taraX-60,{speed:190}),s.to({...m(40,-10),zoom:s.fitRoom(1569),duration:1800})),await l(500),await r.moveTo(150,-170,{duration:1100,easing:g.inOut}),await l(400),r.el.classList.add("is-word"),s.shake(7),t.setPose("surprise"),t.express("surprised"),await l(1400),t.setPose("idle"),t.express("curious"),await l(1600),await s.to({...m(30,10),zoom:s.fitRoom(1778),duration:2e3}),a.classList.add("show-title"),await l(3400),a.classList.add("show-sub"),await l(3e3)}const ae=[te,Ns,js,Us,Bs,Ds,_s,Ys,Vs,ee];async function ie(e){for(const s of ae)await s(e)}const F={width:1600,height:900};class ws{constructor(s){this.el=s,this.x=0,this.y=0,this.scale=1,this.apply()}apply(){this.el.setAttribute("transform",`translate(${this.x} ${this.y}) scale(${this.scale})`)}at(s,t){return this.x=s,this.y=t,this.apply(),this}setScale(s){return this.scale=s,this.apply(),this}setText(s){const t=this.el.querySelector(".sw-text");if(!t)return this;t.textContent=s;const r=Math.max(190,s.length*34+96),a=this.el.querySelector(".sw-plate"),i=this.el.querySelector(".sw-aura");return a&&(a.setAttribute("x",-r/2),a.setAttribute("width",r)),i&&i.setAttribute("rx",r*.78),this}async morphTo(s,{duration:t=900}={}){return this.el.classList.add("is-morphing"),await M({duration:t/2,easing:g.in,onUpdate:()=>{}}),this.setText(s),await M({duration:t/2,easing:g.out,onUpdate:()=>{}}),this.el.classList.remove("is-morphing"),this}scaleTo(s,{duration:t=900,easing:r=g.inOut}={}){const a=this.scale;return M({duration:t,easing:r,onUpdate:i=>{this.scale=a+(s-a)*i,this.apply()}})}moveTo(s,t,{duration:r=1400,easing:a=g.inOut}={}){const i=this.x,o=this.y;return M({duration:r,easing:a,onUpdate:n=>{this.x=i+(s-i)*n,this.y=o+(t-o)*n,this.apply()}})}}function V(e,s){const t=document.createElementNS("http://www.w3.org/2000/svg","g");return s&&t.setAttribute("class",s),t.innerHTML=e,t}function le(e){e.innerHTML=`
    <div class="stage">
      <svg class="stage-svg" viewBox="0 0 ${F.width} ${F.height}"
           preserveAspectRatio="xMidYMid slice" role="img"
           aria-label="A palace at night. A girl and her parrot watch a glowing word appear.">
        ${qs()}
        <defs>${Xs()}</defs>
        <g class="world">${Ws()}</g>
      </svg>

      <div class="ui">
        <svg class="title-svg" viewBox="0 0 ${F.width} ${F.height}"
             preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <g class="title-group" transform="translate(800 648)">
            ${Gs()}
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

      <button class="pausebtn" type="button" aria-label="Pause the story" aria-pressed="false">
        <span class="pause-icon" aria-hidden="true">&#10073;&#10073;</span>
        <span class="play-icon" aria-hidden="true">&#9654;</span>
      </button>
      <button class="replay" type="button" aria-label="Replay the story from the beginning">
        <span class="replay-icon" aria-hidden="true">&#8635;</span>
        <span class="replay-label">Replay the story</span>
      </button>
    </div>`;const s=e.querySelector(".world"),t=new xs(s,F),r=e.querySelector(".tara-slot"),a=V(Ss());r.appendChild(a);const i=new Ls(a,{x:60,y:420,scale:1,facing:"left"}),o=V(ns()+ds("laddoo"),"spark-slot");r.appendChild(o);const n=new ws(o);n.at(520,-300);const h=V(ns()+ds("chameli"),"spark-slot hers");r.appendChild(h);const w=new ws(h);w.at(0,0).setScale(.06);const u=new vs(e.querySelector(".code-air")),p={root:e,camera:t,tara:i,spark:n,hers:w,code:u,ui:e.querySelector(".ui")},k=()=>{ys(),e.querySelector(".hero-window").classList.remove("is-open","is-passed"),e.querySelector(".portal").classList.remove("is-inside"),o.classList.remove("is-live","is-word","is-dimmed"),h.classList.remove("is-live","is-word","is-bouncing","is-straining","is-fading"),w.at(0,0).setScale(.06),e.querySelector(".room").classList.remove("wall-felt"),e.querySelector(".room-door").classList.remove("is-noticed"),e.querySelector(".tara").classList.remove("mithu-alert"),e.querySelector(".wall-ripple").classList.remove("is-hit"),e.querySelector(".room-door").classList.remove("is-open"),e.querySelector(".portal").classList.remove("show-shell"),e.querySelector(".layer-glows").classList.remove("is-live"),e.querySelectorAll(".lg").forEach(f=>f.classList.remove("is-lit")),e.querySelectorAll(".mlabel").forEach(f=>f.classList.remove("is-named")),e.querySelector(".ask-prompt").classList.remove("is-offered","is-taken"),e.querySelector(".ask-speech").classList.remove("is-spoken"),e.querySelector(".q-motes").classList.remove("is-asking"),e.querySelector(".courtyard").classList.remove("is-hushed"),h.classList.remove("is-homebound","is-beckoning","is-inner","is-shadowing","is-touched"),o.classList.remove("is-outer","is-answering","is-shadowed","is-touched"),w.setText("chameli"),n.setText("laddoo"),e.querySelector(".reach").classList.remove("show-global","show-nonlocal","show-shadow"),e.querySelectorAll(".lg").forEach(f=>f.classList.remove("is-probing","is-empty","is-found")),e.querySelectorAll(".mlabel").forEach(f=>f.classList.remove("is-inline")),e.querySelector(".layer-glows").classList.remove("is-searching"),e.querySelector(".tara").classList.remove("has-lantern","has-megaphone","mithu-away"),h.classList.remove("is-hollow","is-claimed","is-hollow-pulse","is-clearing"),e.querySelector(".trails").classList.remove("show-out","show-local","show-blocked","is-barred"),e.querySelector(".error-spell").classList.remove("is-cast"),e.querySelector(".perch-stand").classList.remove("is-up"),e.querySelector(".shadow-tag .mlabel").classList.remove("is-named"),e.querySelector(".stage").classList.remove("is-darkened"),u.clear({duration:0}),u.undock(),e.querySelector(".tara").classList.remove("looks-out","mithu-nods"),e.querySelector(".portal").classList.remove("is-warming"),e.querySelectorAll(".is-waking").forEach(f=>f.classList.remove("is-waking")),e.querySelectorAll(".is-fading").forEach(f=>f.classList.remove("is-fading")),h.classList.remove("is-settled","is-rising","is-star"),o.classList.remove("is-settled"),e.querySelector(".layer-glows").classList.remove("is-soft"),e.querySelector(".replay").classList.remove("is-offered"),gs(),e.querySelector(".stage").classList.remove("is-paused");const y=e.querySelector(".pausebtn");y.classList.remove("is-paused"),y.setAttribute("aria-pressed","false"),y.setAttribute("aria-label","Pause the story"),p.ui.classList.remove("is-ending"),delete p.ui.dataset.line,p.ui.classList.remove("show-title","show-sub","show-line"),i.at(60,420),i.facing="left",i.apply(),n.x=520,n.y=-300,n.apply(),t.unfollow(),ie(p)},v=e.querySelector(".pausebtn"),C=e.querySelector(".stage"),E=y=>{C.classList.toggle("is-paused",y),v.classList.toggle("is-paused",y),v.setAttribute("aria-pressed",String(y)),v.setAttribute("aria-label",y?"Resume the story":"Pause the story")};return v.addEventListener("click",()=>E(as())),addEventListener("keydown",y=>{if(y.code!=="Space"&&y.key!==" ")return;const f=y.target;f instanceof Element&&(f.closest("button")||f.getAttribute("role")==="button"||f.isContentEditable)||(y.preventDefault(),E(as()))}),e.querySelector(".replay").addEventListener("click",k),J?(e.querySelector(".hero-window").classList.add("is-open","is-passed"),e.querySelector(".portal").classList.add("is-inside","show-shell"),e.querySelector(".room-door").classList.add("is-open"),h.classList.add("is-live","is-word","is-homebound"),w.at(-620,-240).setScale(1),o.classList.add("is-live","is-word"),n.at(470,-330),i.at(1760,420),i.express("confused"),e.querySelector(".layer-glows").classList.add("is-live"),e.querySelectorAll(".lg").forEach(y=>y.classList.add("is-lit")),e.querySelectorAll(".mlabel").forEach(y=>y.classList.add("is-named")),w.setText("TARA"),h.classList.add("is-inner"),w.at(-560,-300),n.setText("MITHU"),o.classList.add("is-outer"),n.at(1900,-1180),t.set({x:c.x+980*c.scale,y:c.y+-940*c.scale,zoom:t.zoomToFitWidth(1760)}),u.dock(),u.write(['name = "Mithu"',"","def room():",'    name = "Tara"',"    print(name)"],{stagger:0}),u.note(0,"Global — the palace name"),u.note(3,"assigning makes a NEW local name"),u.note(4,"finds the local one first"),p.ui.dataset.line="names",p.ui.classList.add("show-line")):k(),p}le(document.getElementById("app"));
