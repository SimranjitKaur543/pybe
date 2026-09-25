(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();const W=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let Z=0;const O=()=>Z,re=new Set;function pe(s){return re.add(s),()=>re.delete(s)}function We(){Z+=1;for(const s of re)try{s()}catch{}return re.clear(),Z}let Q=!1,ge=0,Pe=0;const le=()=>(Q?ge:performance.now())-Pe;function Oe(){Q||(ge=performance.now(),Q=!0)}function Ce(){Q&&(Pe+=performance.now()-ge,Q=!1)}function $e(){return Q?Ce():Oe(),Q}const g={inOut:s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2,out:s=>1-Math.pow(1-s,3),in:s=>s*s*s,back:s=>1+2.2*Math.pow(s-1,3)+1.2*Math.pow(s-1,2)};function r(s){const e=Z;return W?Promise.resolve():new Promise(t=>{const o=le()+s,a=()=>{if(e===Z){if(le()>=o)return t();requestAnimationFrame(a)}};requestAnimationFrame(a)})}function R({duration:s=600,easing:e=g.inOut,onUpdate:t,onDone:o}={}){let a=null,i=!1;const l=Z,c=new Promise(h=>{if(W||s<=0){t?.(1),o?.(),h();return}const u=le(),m=()=>{if(i)return h();if(l!==Z)return;const w=Math.min(1,(le()-u)/s);t?.(e(w)),w<1?a=requestAnimationFrame(m):(o?.(),h())};a=requestAnimationFrame(m)});return c.cancel=()=>{i=!0,a&&cancelAnimationFrame(a)},c}const U=(s,e,t)=>s+(e-s)*t,C=(...s)=>Promise.all(s.map(e=>typeof e=="function"?e():e));class Ne{constructor(e,t){this.el=e,this.view=t,this.state={x:t.width/2,y:t.height/2,zoom:1},this.following=null,this.shakeAmount=0,this.shakePhase=0,this.shakeAngle=0,this.apply(),this.tick=this.tick.bind(this),requestAnimationFrame(this.tick)}apply(){const{x:e,y:t,zoom:o}=this.state,a=this.view.width/2,i=this.view.height/2,l=this.shakeAmount?Math.sin(this.shakePhase)*this.shakeAmount:0,c=l*Math.cos(this.shakeAngle),h=l*Math.sin(this.shakeAngle)*.6;this.el.setAttribute("transform",`translate(${a+c} ${i+h}) scale(${o}) translate(${-e} ${-t})`)}tick(){if(this.following&&this.following.gen!==O()&&(this.following=null),this.following){const{actor:e,offsetX:t=0,offsetY:o=0,lag:a=.08,map:i}=this.following,l=i?i(e.x,e.y):{x:e.x,y:e.y},c=l.x+t,h=l.y+o;this.state.x=U(this.state.x,c,a),this.state.y=U(this.state.y,h,a),this.apply()}else this.shakeAmount>0&&this.apply();this.shakeAmount>0&&(this.shakePhase+=.62,this.shakeAmount*=.88),this.shakeAmount<.05&&(this.shakeAmount=0,this.shakePhase=0),requestAnimationFrame(this.tick)}set({x:e,y:t,zoom:o}={}){return e!==void 0&&(this.state.x=e),t!==void 0&&(this.state.y=t),o!==void 0&&(this.state.zoom=o),this.apply(),this}to({x:e,y:t,zoom:o,duration:a=1400,easing:i=g.inOut}={}){const l={...this.state},c={x:e??l.x,y:t??l.y,zoom:o??l.zoom};return R({duration:a,easing:i,onUpdate:h=>{this.state.x=U(l.x,c.x,h),this.state.y=U(l.y,c.y,h),this.state.zoom=U(l.zoom,c.zoom,h),this.apply()}})}follow(e,t={}){return this.following={actor:e,...t,gen:O()},this}unfollow(){return this.following=null,this}zoomToFitWidth(e){const o=this.el.ownerSVGElement.getBoundingClientRect();if(!o.width||!o.height)return 1;const a=Math.max(o.width/this.view.width,o.height/this.view.height);return o.width/a/e}fitRoom(e,t=.225){return this.zoomToFitWidth(e*t)}shake(e=10){return this.shakeAmount=e,this.shakePhase=0,this.shakeAngle=(Math.random()-.5)*.9,this}}class je{constructor(e,{x:t=0,y:o=0,facing:a="right",scale:i=1}={}){this.el=e,this.figure=e.firstElementChild||e,this.x=t,this.y=o,this.facing=a,this.scale=i,this.pose="idle",this.apply()}apply(){const e=this.facing==="left"?-1:1;this.el.setAttribute("transform",`translate(${this.x} ${this.y}) scale(${e*this.scale} ${this.scale})`)}at(e,t){return this.x=e,t!==void 0&&(this.y=t),this.apply(),this}setPose(e){return this.figure.classList.remove(`pose-${this.pose}`),this.pose=e,this.figure.classList.add(`pose-${e}`),this}express(e){return this.figure.dataset.mood=e,this}async face(e,{duration:t=260}={}){if(this.facing===e)return;const o=e==="left"?-1:1;await R({duration:t/2,easing:g.in,onUpdate:a=>{const i=(1-a)*this.scale;this.el.setAttribute("transform",`translate(${this.x} ${this.y}) scale(${(this.facing==="left"?-1:1)*i} ${this.scale})`)}}),this.facing=e,await R({duration:t/2,easing:g.out,onUpdate:a=>{const i=a*this.scale;this.el.setAttribute("transform",`translate(${this.x} ${this.y}) scale(${o*i} ${this.scale})`)}}),this.apply()}async walkTo(e,{speed:t=300,pose:o="walk"}={}){const a=e<this.x?"left":"right";await this.face(a);const i=this.x,l=Math.abs(e-i);if(l<1)return;const c=l/t*1e3;this.setPose(o),await R({duration:c,easing:g.inOut,onUpdate:h=>{this.x=i+(e-i)*h,this.apply()}}),this.setPose("idle")}beat(e=500){return r(e)}}class Ze{constructor(e){this.el=e,this.pre=e.querySelector(".ca-lines"),this.lines=[],this.texts=[]}at(){return this}dock(){return this.el.classList.add("is-docked"),this}undock(){return this.el.classList.remove("is-docked"),this}async write(e,{stagger:t=420}={}){return this.pre.innerHTML="",this.lines=[],this.texts=[],this.el.classList.add("is-open"),this.append(e,{stagger:t})}async append(e,{stagger:t=420}={}){this.el.classList.add("is-open");for(const o of e){const a=o.match(/^\s*/)[0].length,i=document.createElement("span");i.className="ca-line",i.style.paddingLeft=`${a*.62}em`,i.innerHTML=Le(o.trim())||"&nbsp;",this.pre.appendChild(i),this.lines.push(i),this.texts.push(o),requestAnimationFrame(()=>i.classList.add("is-written")),await r(t)}return this}async retype(e,t,{flash:o=!0}={}){const a=this.lines[e];if(!a)return this;const i=t.match(/^\s*/)[0].length;return a.style.paddingLeft=`${i*.62}em`,a.innerHTML=Le(t.trim())||"&nbsp;",this.texts[e]=t,o&&(a.classList.remove("is-written"),requestAnimationFrame(()=>a.classList.add("is-written")),await r(700)),this}note(e,t){const o=this.lines[e];if(!o)return this;if(o.querySelector(".ca-note")?.remove(),!t)return this;const a=document.createElement("span");return a.className="ca-note",a.textContent=`  # ${t}`,o.appendChild(a),this}clearNotes(){return this.pre.querySelectorAll(".ca-note").forEach(e=>e.remove()),this}mark(e,t){return this.lines[e]?.classList.add(t),this}unmark(e){return this.lines.forEach(t=>t.classList.remove(e)),this}focus(e){return this.lines.forEach((t,o)=>t.classList.toggle("is-running",o===e)),this}unfocus(){return this.lines.forEach(e=>e.classList.remove("is-running")),this}async clear({duration:e=700}={}){return this.el.classList.remove("is-open"),await r(e),this.pre.innerHTML="",this.lines=[],this.texts=[],this}}function Le(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}const d=-246,E=46,f=-190,q=-104;function xe(s,e){return`
  <g class="limb ${e}">
    <path class="churidar" d="M ${s-13} ${q}
      C ${s-15} ${q+46} ${s-13} -40 ${s-11} -12
      L ${s+11} -12
      C ${s+13} -40 ${s+15} ${q+46} ${s+13} ${q} Z" />
    <path class="cuff" d="M ${s-12} -26 L ${s+12} -26 L ${s+11} -14 L ${s-11} -14 Z" />
    <ellipse class="slipper" cx="${s+3}" cy="-5" rx="19" ry="9" />
  </g>`}function be(s,e,t=""){return`
  <g class="limb ${e}">
    <path class="sleeve" d="M ${s} ${f+4}
      C ${s+6} ${f+40} ${s+8} ${f+66} ${s+6} ${f+86}
      L ${s-14} ${f+86}
      C ${s-16} ${f+62} ${s-14} ${f+36} ${s-12} ${f+4} Z" />
    <circle class="skin" cx="${s-4}" cy="${f+94}" r="12" />
    ${t}
  </g>`}function Qe(s,e){return`
  <g class="prop prop-lantern" transform="translate(${s} ${e})">
    <path class="lan-hoop" d="M -16 -4 C -16 -30 16 -30 16 -4" />
    <rect class="lan-cap" x="-19" y="-6" width="38" height="10" rx="4" />
    <path class="lan-glass" d="M -17 4 L 17 4 L 13 44 L -13 44 Z" />
    <circle class="lan-halo" cx="0" cy="24" r="82" />
    <path class="lan-flame" d="M 0 10 C 9 22 7 36 0 36 C -7 36 -9 22 0 10 Z" />
    <rect class="lan-base" x="-16" y="42" width="32" height="9" rx="4" />
  </g>`}function Ie(s,e){return`
  <g class="prop prop-megaphone" transform="translate(${s} ${e})">
    <path class="meg-body" d="M -6 -14 L -6 14 L 42 34 L 42 -34 Z" />
    <ellipse class="meg-mouth" cx="42" cy="0" rx="9" ry="34" />
    <rect class="meg-grip" x="-20" y="-9" width="16" height="18" rx="6" />
  </g>`}function Ge(){return`
<g class="tara pose-idle" data-mood="neutral">
  <ellipse class="shadow" cx="4" cy="2" rx="62" ry="12" />

  <!-- far side limbs sit behind the body -->
  ${xe(-17,"leg-far")}
  ${be(-46,"arm-far")}

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
    <path class="kurta" d="M -32 ${f-6}
      C -48 ${f+22} -50 ${q-20} -54 ${q+16}
      L 54 ${q+16}
      C 50 ${q-20} 44 ${f+22} 32 ${f-6}
      C 18 ${f-18} -18 ${f-18} -32 ${f-6} Z" />
    <path class="kurta-hem" d="M -54 ${q+4} L 54 ${q+4} L 54 ${q+16} L -54 ${q+16} Z" />
    <path class="dupatta" d="M -30 ${f-2}
      C -6 ${f+26} 22 ${f+22} 34 ${f+2}
      C 44 ${f+54} 38 ${q+6} 26 ${q+30}
      L 8 ${q+24}
      C 22 ${q-6} 28 ${f+58} 20 ${f+34}
      C 4 ${f+46} -18 ${f+40} -30 ${f+22} Z" />
  </g>

  <!-- near side limbs -->
  ${xe(17,"leg-near")}
  ${be(48,"arm-near",Qe(40,f+104)+Ie(40,f+96))}

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
  <g class="mithu-perch" transform="translate(46 ${f-14}) scale(0.34)">
    <g class="mithu-hop">${Ee()}</g>
  </g>
</g>`}function Ee(){return`
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
</g>`}function ae(s,e,t,o,a="stone"){const i=t/2;return`<g class="${a}">
    <path d="M ${s-i} ${e}
             C ${s-i} ${e-o*.5} ${s-i*.62} ${e-o*.8} ${s} ${e-o}
             C ${s+i*.62} ${e-o*.8} ${s+i} ${e-o*.5} ${s+i} ${e} Z" />
    <rect x="${s-3}" y="${e-o-28}" width="6" height="30" rx="3" />
    <circle cx="${s}" cy="${e-o-34}" r="7" />
  </g>`}function ne(s,e,t,o){const a=t/2,i=s+a;return`M ${s} ${e+o}
          L ${s} ${e+a*.72}
          Q ${s} ${e} ${i} ${e-a*.28}
          Q ${s+t} ${e} ${s+t} ${e+a*.72}
          L ${s+t} ${e+o} Z`}function we(s,e,t,o,a="arch"){return`<path class="${a}" d="${ne(s,e,t,o)}" />`}function ie(s,e,t,o,a=0){return`<path class="lit-window" style="animation-delay:${a}s" d="${ne(s,e,t,o)}" />`}function J(s,e,t,o,a,i,l="arch"){const c=l==="lit"?ie:we;return Array.from({length:t},(h,u)=>l==="lit"?c(s+u*(o+i),e,o,a,u*.83%5):c(s+u*(o+i),e,o,a)).join("")}function ce(s,e,t,o=30){const a=o/2;return`<g class="stone">
    <rect x="${s-a}" y="${e}" width="${o}" height="${t-e}" rx="4" />
    <rect x="${s-a-9}" y="${e-14}" width="${o+18}" height="16" rx="5" />
    <rect x="${s-a-11}" y="${t-14}" width="${o+22}" height="16" rx="5" />
  </g>`}function ee(s,e,t,o){const a=t/2;return`<g class="stone">
    <rect x="${s-a}" y="${e-7}" width="${t}" height="8" rx="4" />
    <rect x="${s-a+5}" y="${e-o}" width="6" height="${o-7}" />
    <rect x="${s+a-11}" y="${e-o}" width="6" height="${o-7}" />
  </g>${ae(s,e-o,t*.9,o*.7)}`}function ye(s=0,e=18,t={x:0,y:0,w:1600,h:900}){let o=s*9301+49297;const a=()=>(o=(o*9301+49297)%233280)/233280;return`<g class="motes">${Array.from({length:e},()=>{const i=t.x+a()*t.w,l=t.y+a()*t.h,c=2+a()*2.6,h=(a()*9).toFixed(2),u=(7+a()*7).toFixed(2);return`<circle cx="${i}" cy="${l}" r="${c}" style="animation-delay:${h}s; animation-duration:${u}s" />`}).join("")}</g>`}function ve(s,e,t,o,a=2.6){const i=s+t/2;return`<path class="light-shaft" d="M ${s} ${e} L ${s+t} ${e}
    L ${i+t*a/2} ${e+o} L ${i-t*a/2} ${e+o} Z" />`}function Xe(){return`
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
</defs>`}const M={floorY:420,taraX:60,wallX:-1090,doorX:390};function He(){const{floorY:s}=M;return`
<g class="room">
  <!-- back wall and floor -->
  <rect class="room-wall" x="-1180" y="-620" width="1700" height="${s+620}" />
  <rect class="room-floor" x="-1180" y="${s}" width="1700" height="520" />
  <rect class="room-skirting" x="-1180" y="${s-16}" width="1700" height="20" />

  <!-- wall niches -->
  <g class="room-niche">
    ${we(-1020,40,130,300,"niche")}
    ${we(-840,40,130,300,"niche")}
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
  ${ye(21,8,{x:-900,y:-400,w:1300,h:800})}
</g>`}const A={x0:560,x1:3180,floorY:M.floorY,centreX:1840,askX:1760};function Ue(s,e){return`
<g class="fountain">
  <ellipse class="water-pool" cx="${s}" cy="${e}" rx="260" ry="66" />
  <path class="basin" d="M ${s-270} ${e-6} Q ${s} ${e+74} ${s+270} ${e-6}
    L ${s+250} ${e-40} L ${s-250} ${e-40} Z" />
  <rect class="basin" x="${s-34}" y="${e-210}" width="68" height="175" rx="16" />
  <ellipse class="basin-top" cx="${s}" cy="${e-212}" rx="132" ry="32" />
  <ellipse class="water-top" cx="${s}" cy="${e-216}" rx="112" ry="24" />
  <g class="jets">
    ${[-86,-44,0,44,86].map((t,o)=>`
      <path class="jet" style="animation-delay:${(o*.23).toFixed(2)}s"
        d="M ${s+t} ${e-226} Q ${s+t*1.5} ${e-150} ${s+t*1.9} ${e-46}" />`).join("")}
  </g>
  <g class="ripples">
    <ellipse class="rp r1" cx="${s}" cy="${e+6}" rx="60" ry="16" />
    <ellipse class="rp r2" cx="${s}" cy="${e+6}" rx="60" ry="16" />
    <ellipse class="rp r3" cx="${s}" cy="${e+6}" rx="60" ry="16" />
  </g>
</g>`}function se(s,e,t=1){return`
<g class="plant" transform="translate(${s} ${e}) scale(${t})">
  <path class="pot" d="M -52 0 L 52 0 L 38 92 L -38 92 Z" />
  <rect class="pot-rim" x="-60" y="-16" width="120" height="22" rx="9" />
  <g class="fronds">
    <path class="frond" d="M 0 -10 C -70 -40 -96 -120 -58 -176 C -30 -126 -14 -64 0 -10 Z" />
    <path class="frond" d="M 0 -10 C 64 -46 92 -126 52 -180 C 26 -126 12 -62 0 -10 Z" />
    <path class="frond" d="M 0 -10 C -26 -86 -8 -166 20 -200 C 24 -136 12 -66 0 -10 Z" />
  </g>
</g>`}function de(s,e,t,o=0){return`
<g class="court-lantern" style="animation-delay:${o}s">
  <line class="chain" x1="${s}" y1="${e}" x2="${s}" y2="${t}" />
  <path class="lantern-shell" d="M ${s-40} ${t} L ${s+40} ${t}
    L ${s+26} ${t+84} L ${s-26} ${t+84} Z" />
  <rect class="lantern-cap" x="${s-46}" y="${t-14}" width="92" height="18" rx="7" />
  <circle class="lantern-glow" cx="${s}" cy="${t+40}" r="26" />
</g>`}function Be(){const{x0:s,x1:e,floorY:t,centreX:o}=A,a=-760;return`
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
        <path class="balcony-arch" d="${ne(i-96,a+60,192,178)}" />
        <g class="court-curtain" style="animation-delay:${l*.8}s">
          <path d="M ${i-92} ${a+64} L ${i-30} ${a+64} C ${i-38} ${a+140} ${i-34} ${a+200} ${i-26} ${a+236} L ${i-92} ${a+238} Z" />
        </g>
      </g>`).join("")}
  </g>

  <!-- ground-level arcade -->
  <g class="court-arcade">
    ${[760,1180,2500,2920].map(i=>`
      <path class="court-niche" d="${ne(i-110,t-430,220,430)}" />`).join("")}
    ${ce(970,t-470,t,46)}
    ${ce(2710,t-470,t,46)}
  </g>

  <!-- moonlight falling into the open court -->
  ${ve(1420,a+40,300,t-a-40,1.9)}
  ${ve(2260,a+40,240,t-a-40,1.7)}

  <!-- lanterns -->
  ${de(1300,a+40,-190,0)}
  ${de(2380,a+40,-250,1.1)}
  ${de(1820,a+40,-330,.55)}

  <!-- floor -->
  <rect class="court-floor" x="${s}" y="${t}" width="${e-s}" height="560" />
  <g class="court-tiles">
    ${Array.from({length:13},(i,l)=>`<rect x="${s+l*200}" y="${t}" width="5" height="560" />`).join("")}
    ${Array.from({length:4},(i,l)=>`<rect x="${s}" y="${t+90+l*120}" width="${e-s}" height="5" />`).join("")}
  </g>
  <rect class="court-step" x="${s}" y="${t-14}" width="${e-s}" height="18" rx="6" />

  ${Ue(o,t-30)}

  ${se(760,t,1)}
  ${se(2980,t,1.1)}
  ${se(1140,t,.78)}
  ${se(2620,t,.86)}

  ${ye(41,12,{x:s,y:-760,w:e-s,h:1200})}
</g>`}function De(){return`
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
</g>`}function Ye(){return`
<g class="ask-speech-anchor">
<g class="ask-speech">
  <ellipse class="speech-aura" cx="0" cy="0" rx="420" ry="118" />
  <text class="speech-text" x="0" y="10" text-anchor="middle">Where is my secret?</text>
</g>
</g>`}function _e(){return`
<g class="q-motes">
  ${[[-230,30,0],[-90,-40,.35],[70,10,.7],[220,-30,1.05],[-10,70,1.4],[160,80,1.75]].map(([e,t,o])=>`
    <text class="q" x="${e}" y="${t}" text-anchor="middle" style="animation-delay:${o}s">?</text>`).join("")}
</g>`}const _={x0:-1560,x1:3520,roofY:-1320,baseY:1010};function Ve(){return`
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
</g>`}function Ke(){const{x0:s,x1:e,roofY:t,baseY:o}=_;return`
<g class="shell">
  <path class="shell-roof" d="M ${s-140} ${t+250} L ${(s+e)/2} ${t-210}
    L ${e+140} ${t+250} L ${e+140} ${t+330} L ${s-140} ${t+330} Z" />
  <rect class="shell-wall" x="${s}" y="${t+300}" width="220" height="${o-t-300}" />
  <rect class="shell-wall" x="${e-220}" y="${t+300}" width="220" height="${o-t-300}" />
  <rect class="shell-band" x="${s-60}" y="${t+300}" width="${e-s+120}" height="46" />
  <rect class="shell-base" x="${s-200}" y="${o}" width="${e-s+400}" height="150" />
  <g class="shell-windows">
    ${[-1460,-1380,3380,3440].map((a,i)=>`<rect class="shell-lit" x="${a}" y="${t+520+i%2*190}" width="52" height="104" rx="24"
             style="animation-delay:${i*.9}s" />`).join("")}
  </g>
</g>`}function Je(){const s={x0:-1200,x1:540,y0:-640,y1:M.floorY+120},e={x0:A.x0-20,x1:A.x1+20,y0:-800,y1:A.floorY+200},t={x0:_.x0-80,x1:_.x1+80,y0:_.roofY-160,y1:_.baseY+90};return`
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
    <path class="lg-link" d="M ${s.x1} ${M.floorY-200} L ${e.x0} ${M.floorY-200}" />
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
</g>`}function B(s,e,t,o,a=""){return`
<g class="mlabel mlabel-${s}" transform="translate(${t} ${o})">
  <g class="ml-motes">
    ${[[-150,-30,0],[140,-44,.6],[-60,46,1.2],[110,40,1.8],[10,-62,.9]].map(([l,c,h])=>`<circle r="7" style="--mx:${l}px; --my:${c}px; animation-delay:${h}s" />`).join("")}
  </g>
  <path class="ml-rule" d="M -172 52 Q 0 74 172 52" />
  <text class="ml-text" x="0" y="0" text-anchor="middle">${e}</text>
  ${a?`<text class="ml-note" x="0" y="112" text-anchor="middle">${a}</text>`:""}
</g>`}function es(){return`
<g class="perch-stand">
  <rect class="perch-post" x="-9" y="-250" width="18" height="250" rx="9" />
  <rect class="perch-bar"  x="-92" y="-262" width="184" height="16" rx="8" />
  <ellipse class="perch-foot" cx="0" cy="4" rx="74" ry="17" />
  <g class="perch-bird" transform="translate(0 -262) scale(0.62)">
    ${Ee()}
  </g>
</g>`}function ss(){return`
<g class="error-spell">
  <g class="err-smoke">
    ${[[-300,0,0],[-120,-40,.5],[80,20,1],[260,-30,1.5],[-40,60,.8],[190,70,1.9]].map(([s,e,t])=>`<ellipse cx="${s}" cy="${e}" rx="150" ry="70" style="animation-delay:${t}s" />`).join("")}
  </g>
  <g class="err-shards">
    ${[[-380,-90],[-190,110],[40,-130],[250,90],[420,-60],[-60,140]].map(([s,e],t)=>`<path d="M ${s} ${e} l 26 -46 l 20 52 z" style="animation-delay:${t*.14}s" />`).join("")}
  </g>
  <text class="err-text" x="0" y="0" text-anchor="middle">UnboundLocalError</text>
  <path class="err-crack" d="M -430 46 L -300 20 L -170 58 L -30 14 L 110 56 L 250 18 L 430 50" />
</g>`}function ts(){return`
<g class="trails">
  <path class="read-out"   pathLength="100" d="M -360 -260 C 260 -780 1080 -1120 1800 -1160" />
  <path class="read-local" pathLength="100" d="M -360 -250 C -430 -300 -500 -320 -560 -308" />
  <path class="read-blocked" pathLength="100" d="M -360 -260 C -250 -300 -150 -330 -40 -344" />
  <g class="block-wall">
    <path class="bw-line" d="M 20 -520 L 20 -60" />
    <g class="bw-sparks">
      ${[-380,-280,-180].map((s,e)=>`<circle cx="20" cy="${s}" r="12" style="animation-delay:${e*.18}s" />`).join("")}
    </g>
  </g>
</g>`}const n={x:1600,y:300,w:380,h:520,scale:.225},z=980,ke=(()=>{let s=12345;const e=()=>(s=(s*9301+49297)%233280)/233280;return Array.from({length:44},()=>({x:-1400+e()*5e3,y:-1500+e()*1900,r:1.6+e()*3.4,d:(e()*6).toFixed(2),layer:e()<.4?"far":"near"}))})();function te(s,e,t,o,a){return`<g class="cloud" style="animation-delay:${o}s; animation-duration:${a}s"
     transform="translate(${s} ${e}) scale(${t})">
    <ellipse cx="0" cy="0" rx="200" ry="40" />
    <ellipse cx="-110" cy="14" rx="120" ry="30" />
    <ellipse cx="116" cy="16" rx="140" ry="34" />
    <ellipse cx="20" cy="-24" rx="96" ry="32" />
  </g>`}function he(s,e,t,o){return`<g class="flagpole-g">
    <rect class="flagpole" x="${s-3}" y="${e-t}" width="6" height="${t+26}" rx="3" />
    <circle class="flagpole" cx="${s}" cy="${e-t-5}" r="6" />
    <path class="pennant" style="animation-delay:${o}s"
      d="M ${s+3} ${e-t+2} L ${s+44} ${e-t+14} L ${s+3} ${e-t+26} Z" />
  </g>`}function as(){return`
<g class="sky-group">
  <rect x="-2600" y="-1900" width="8000" height="3400" fill="url(#nightSky)" />
  <circle cx="620" cy="-960" r="430" fill="url(#moonGlow)" />
  <circle class="moon" cx="620" cy="-960" r="104" />
  <circle class="moon-crater" cx="586" cy="-990" r="18" />
  <circle class="moon-crater" cx="650" cy="-930" r="12" />
  <circle class="moon-crater" cx="638" cy="-1004" r="9" />

  <g class="stars far">
    ${ke.filter(s=>s.layer==="far").map((s,e)=>`<circle class="${e%2?"still":""}" cx="${s.x}" cy="${s.y}" r="${s.r*.7}" style="animation-delay:${s.d}s" />`).join("")}
  </g>
  <g class="stars near">
    ${ke.filter(s=>s.layer==="near").map((s,e)=>`<circle class="${e%2?"still":""}" cx="${s.x}" cy="${s.y}" r="${s.r}" style="animation-delay:${s.d}s" />`).join("")}
  </g>

  <g class="clouds">
    ${te(-900,-1180,1.1,0,96)}
    ${te(-1700,-760,.8,16,122)}
    ${te(-500,-420,1.35,40,148)}
    ${te(-2100,-1420,.9,62,134)}
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
  <rect class="stone" x="880" y="700" width="200" height="${z-700}" rx="6" />
  ${ee(980,700,74,58)}
  <rect class="stone" x="2120" y="700" width="200" height="${z-700}" rx="6" />
  ${ee(2220,700,74,58)}
  ${J(906,800,2,56,150,44,"lit")}
  ${J(2146,800,2,56,150,44,"lit")}

  <!-- flanking towers -->
  <rect class="stone" x="1120" y="420" width="112" height="${z-420}" rx="6" />
  ${ae(1176,420,132,108)}
  <rect class="stone" x="1968" y="420" width="112" height="${z-420}" rx="6" />
  ${ae(2024,420,132,108)}
  ${he(1176,306,62,0)}
  ${he(2024,306,62,1.3)}

  <!-- great hall -->
  <rect class="stone" x="1220" y="520" width="760" height="${z-520}" rx="8" />
  <rect class="stone-band" x="1258" y="486" width="684" height="42" rx="14" />
  ${ae(1600,486,330,260)}
  ${he(1600,180,74,.7)}
  ${ee(1320,486,66,54)}
  ${ee(1880,486,66,54)}
  ${ce(1300,640,z)}
  ${ce(1900,640,z)}

  <!-- ordinary lit windows, staggered so the palace breathes -->
  ${J(1254,700,2,58,160,52,"lit")}
  ${J(1830,700,2,58,160,52,"lit")}
  ${ie(1148,560,48,120,2.1)}
  ${ie(1996,560,48,120,.8)}
  ${ie(1560,180,74,130,1.6)}

  <!-- plinth -->
  <rect class="plinth" x="820" y="${z-28}" width="1560" height="40" rx="8" />
</g>

<rect class="ground" x="-2600" y="${z}" width="8000" height="900" />

<!-- ─────────── Tara's window: the way in ─────────── -->
<g class="hero-window">
  <!-- warm light spilling out before we can see inside -->
  <ellipse class="hero-glow" cx="${n.x}" cy="${n.y}" rx="520" ry="560" />

  <!-- the room, mounted inside the opening and clipped to it -->
  <g class="portal" clip-path="url(#heroClip)">
    <g transform="translate(${n.x} ${n.y}) scale(${n.scale})">
      <!-- Behind everything, and only shown once the camera clears the roof. -->
      <g class="outer-world">
        ${Ve()}
        ${Ke()}
      </g>
      ${Be()}
      ${He()}
      <g class="tara-slot"></g>
      ${Je()}
      <g class="magic-labels">
        ${B("local","Local",-330,-900,"inside one function")}
        ${B("enclosing","Enclosing",1870,-1120,"a function written inside another")}
        ${B("global","Global",980,-1760,"the whole file")}
        ${B("builtin","Built-in",980,-2520,"names Python already knows")}
      </g>
      ${ts()}
      ${es()}
      ${ss()}
      <g class="shadow-tag">
        ${B("shadow","shadowing",-300,-900)}
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
        ${De()}
        ${Ye()}
        ${_e()}
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

${ye(3,14,{x:700,y:200,w:1800,h:800})}`}function is(){return`<clipPath id="heroClip">
    <path d="M ${n.x-n.w/2} ${n.y+n.h/2+20}
      L ${n.x-n.w/2} ${n.y-70}
      Q ${n.x-n.w/2} ${n.y-n.h/2-20} ${n.x} ${n.y-n.h/2-44}
      Q ${n.x+n.w/2} ${n.y-n.h/2-20} ${n.x+n.w/2} ${n.y-70}
      L ${n.x+n.w/2} ${n.y+n.h/2+20} Z" />
  </clipPath>`}function Se(){return`
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
</g>`}function Te(s){const e=Math.max(190,s.length*30+84);return`
<g class="spark-word" aria-hidden="true">
  <ellipse class="sw-aura" cx="0" cy="0" rx="${e*.78}" ry="74" />
  <rect class="sw-plate" x="${-e/2}" y="-38" width="${e}" height="76" rx="38" />
  <text class="sw-text" x="0" y="14" text-anchor="middle">${s}</text>
  <g class="sw-motes">
    ${[[-e*.4,-28,0],[e*.34,-34,.8],[-e*.2,36,1.6],[e*.44,26,2.3],[6,-52,1.1],[-e*.46,14,2.9]].map(([t,o,a])=>`<circle cx="${t}" cy="${o}" r="3.6" style="animation-delay:${a}s" />`).join("")}
  </g>
</g>`}function os(s=26){let e=777;const t=()=>(e=(e*9301+49297)%233280)/233280;return`<g class="title-motes">${Array.from({length:s},()=>{const o=t()*Math.PI*2,a=300+t()*620;return`<circle r="${2+t()*3.2}"
      style="--fx:${(Math.cos(o)*a).toFixed(1)}px; --fy:${(Math.sin(o)*a*.6).toFixed(1)}px;
             animation-delay:${(t()*1.1).toFixed(2)}s" />`}).join("")}</g>`}const p=(s,e)=>({x:n.x+s*n.scale,y:n.y+e*n.scale});function V(s,e){const t=s.root.querySelector(".stage");t&&t.classList.toggle("is-deciding",e);const o=s.root.querySelector(".tara");o&&o.classList.toggle("is-attending",e)}async function I(s,e="curious",{nod:t=!1,ms:o=900}={}){const a=s.root.querySelector(".tara");s.tara?.express?.(e),t&&a&&a.classList.add("mithu-alert"),await new Promise(i=>setTimeout(i,W?0:o)),t&&a&&a.classList.remove("mithu-alert")}function F(s,{question:e,options:t,kind:o="choice"}={}){const a=s.root.querySelector(".interact"),i=O();return new Promise(l=>{const c=document.createElement("div");c.className=`ask ask-${o}`,c.setAttribute("role","group"),c.setAttribute("aria-label",e);const h=document.createElement("p");h.className="ask-q",h.textContent=e,c.appendChild(h);const u=document.createElement("div");u.className="ask-options",c.appendChild(u);let m=!1;const w=()=>{m||(m=!0,V(s,!1),b(),c.classList.add("is-going"),setTimeout(()=>c.remove(),W?0:420))},x=v=>{m||([...u.children].forEach(k=>k.classList.toggle("is-chosen",k.dataset.value===String(v.value))),w(),i===O()&&l(v.value))};t.forEach((v,k)=>{const y=document.createElement("button");y.type="button",y.className="choice",y.dataset.value=String(v.value),y.innerHTML=`<span class="choice-label"></span>${v.note?'<span class="choice-note"></span>':""}`,y.querySelector(".choice-label").textContent=v.label,v.note&&(y.querySelector(".choice-note").textContent=v.note),y.addEventListener("click",()=>x(v)),u.appendChild(y),k===0&&requestAnimationFrame(()=>y.focus({preventScroll:!0}))});const b=pe(()=>{m=!0,c.remove()});V(s,!0),a.appendChild(c),requestAnimationFrame(()=>c.classList.add("is-open"))})}function rs(s,{again:e="See it again",go:t="Continue"}={}){return F(s,{kind:"after",question:"",options:[{label:t,value:"continue"},{label:e,value:"again"}]})}async function j(s,e,t=2600){const o=s.root.querySelector(".interact"),a=O(),i=document.createElement("p");i.className="ask-said",i.setAttribute("role","status"),i.textContent=e,o.appendChild(i);const l=pe(()=>i.remove());requestAnimationFrame(()=>i.classList.add("is-open")),await new Promise(c=>setTimeout(c,W?0:t)),l(),i.classList.remove("is-open"),setTimeout(()=>i.remove(),W?0:420),a!==O()&&await new Promise(()=>{})}async function fe(s,e){const{code:t=[],question:o,options:a,answer:i,hints:l=[],feedback:c={},reveal:h}=e,u=s.root.querySelector(".interact"),m=O();let w=0,x=!1;for(;;){const b=await new Promise(k=>{const y=document.createElement("div");if(y.className="ask ask-predict",y.setAttribute("role","group"),y.setAttribute("aria-label",o),t.length){const T=document.createElement("pre");T.className="ask-code",T.textContent=t.join(`
`),y.appendChild(T)}const P=document.createElement("p");P.className="ask-q",P.textContent=o,y.appendChild(P);const G=document.createElement("div");G.className="ask-options",y.appendChild(G);const X=document.createElement("div");X.className="hint-rail",y.appendChild(X);let L=0,$=null;l.length&&($=document.createElement("button"),$.type="button",$.className="hintbtn",$.innerHTML='<span aria-hidden="true">💡</span> Hint',$.addEventListener("click",()=>{x=!0;const T=document.createElement("p");T.className="hint",T.setAttribute("role","status"),T.textContent=l[L],X.appendChild(T),requestAnimationFrame(()=>T.classList.add("is-open")),L+=1,L>=l.length&&($.disabled=!0)}),y.appendChild($));let H=!1;const Re=T=>{H||(H=!0,V(s,!1),Fe(),[...G.children].forEach(K=>K.classList.toggle("is-chosen",K.dataset.value===String(T.value))),y.classList.add("is-going"),setTimeout(()=>y.remove(),W?0:420),m===O()&&k(T.value))};a.forEach((T,K)=>{const N=document.createElement("button");N.type="button",N.className="choice choice-tight",N.dataset.value=String(T.value),N.textContent=T.label,N.addEventListener("click",()=>Re(T)),G.appendChild(N),K===0&&requestAnimationFrame(()=>N.focus({preventScroll:!0}))});const Fe=pe(()=>{H=!0,V(s,!1),y.remove()});V(s,!0),u.appendChild(y),requestAnimationFrame(()=>y.classList.add("is-open"))});if(w+=1,b===i)return await j(s,c[b]||"That is it.",2400),{value:b,correct:!0,attempts:w,usedHint:x};if(await j(s,c[b]||"Not quite — look again at where it was made.",2600),w>=2)return h&&await j(s,h,3e3),{value:b,correct:!1,attempts:w,usedHint:x}}}const S={readyToWhisper:{question:"Tara has a secret word she wants to try.",options:[{value:"go",label:"Let her whisper it",note:"and see where it goes"}]},whatToDo:{question:"Tara has whispered a secret. What should she do?",options:[{value:"outside",label:"Take it outside",note:"see if it follows"},{value:"stay",label:"Keep it in the room",note:"say it again"}]},whereDidItGo:{question:"Her secret did not answer out here. Where is it?",options:[{value:"room",label:"Still in her room"},{value:"followed",label:"It followed her out"},{value:"gone",label:"It disappeared"}],answer:"room",feedback:{room:"Exactly. It never left the room it was made in.",followed:"Almost — that is what it feels like. Watch where it actually is.",gone:"Not gone. Look back at the room she came from."}},shadowPredict:{code:['name = "Mithu"',"","def room():",'    name = "Tara"',"    print(name)","","room()"],question:"What does this print?",options:[{value:"Tara",label:"Tara"},{value:"Mithu",label:"Mithu"},{value:"error",label:"An error"}],answer:"Tara",hints:["Look at where each name was made.","Is Tara inside the room, or outside it, when she reads it?"],feedback:{Tara:"Yes. Inside the room, her own name is the nearer one.",Mithu:"Almost. The palace still says Mithu — but Tara made her own copy inside.",error:"No error here. Both names exist; the question is which one is nearer."},reveal:"It prints Tara. The name made inside the room hides the one outside it."},errorPredict:{code:['name = "Mithu"',"","def room():","    print(name)",'    name = "Tara"',"","room()"],question:"And this one?",options:[{value:"error",label:"An error"},{value:"Mithu",label:"Mithu"},{value:"Tara",label:"Tara"}],answer:"error",hints:["Python reads the whole room before it runs a single line of it.","The room assigns to name somewhere. What does that make the name, everywhere in the room?"],feedback:{error:"Yes — UnboundLocalError. The room owns the name before it has a value.",Mithu:"That is the trap. Because the room assigns to name lower down, it never looks outside at all.",Tara:"Not yet — that line has not run when print is reached."},reveal:"It raises UnboundLocalError: the room claimed name the moment it was written, so there is nothing outside to fall back to."},lookNext:{question:"It is not in her room. Where should Python look next?",options:[{value:"enclosing",label:"The space just outside",note:"one step out"},{value:"global",label:"Straight to the palace"},{value:"stop",label:"Stop looking"}],answer:"enclosing",feedback:{enclosing:"Yes — one step out at a time, never a jump.",global:"It IS in the palace. But Python does not skip — it checks the space just outside first.",stop:"Not yet. A name missing from the room is normal; Python keeps looking outward."}},whoMadePrint:{question:"And print — who made that one?",options:[{value:"python",label:"Nobody. Python already knew it"},{value:"tara",label:"Tara did"},{value:"palace",label:"The palace holds it"}],answer:"python",feedback:{python:"Yes. It was never written here. It is built in.",tara:"She never wrote it — and it worked the very first time she used it.",palace:"Not the palace either. Search the whole file and print is nowhere in it."}},changeThePalace:{question:"She wants to change the palace’s name, not make another copy. What does she need?",options:[{value:"declare",label:"Tell Python she means the palace’s one"},{value:"louder",label:"Say it louder"},{value:"again",label:"Write it again"}],answer:"declare",feedback:{declare:"Exactly. That is what the word global does.",louder:"Volume is not the problem — the room keeps making its own copy however loudly she says it.",again:"Writing it again in her room just makes the same local copy a second time."}},whichReach:{code:["def palace():",'    name = "Mithu"',"","    def room():","        ???  name",'        name = "Tara"'],question:"She means the room around her, not the whole palace. Which word?",options:[{value:"nonlocal",label:"nonlocal"},{value:"global",label:"global"}],answer:"nonlocal",hints:["One of these reaches all the way out to the file. The other stops one step out."],feedback:{nonlocal:"Yes. nonlocal reaches the enclosing room and stops there.",global:"global would skip past the surrounding room and rebind the name at the very top of the file."},reveal:"nonlocal — it reaches the enclosing function, never the module."}},qe={x:26,y:176},D=M.wallX;async function ls(s){const{camera:e,tara:t,spark:o,hers:a,ui:i,root:l}=s,c=l.querySelector(".room"),h=l.querySelector(".wall-ripple");i.classList.contains("show-title")&&(i.classList.add("title-out"),await r(900),i.classList.remove("show-title","show-sub","title-out")),o.moveTo(470,-330,{duration:1500,easing:g.inOut}),l.querySelector(".spark-slot").classList.add("is-dimmed"),await e.to({...p(t.x-30,150),zoom:e.fitRoom(1569),duration:1400}),t.express("curious"),await r(500),await e.to({...p(t.x+10,70),zoom:e.fitRoom(1067),duration:1400}),await r(400),await F(s,S.readyToWhisper),t.setPose("whisper"),await r(500),a.at(t.x+qe.x,t.y-qe.y).setScale(.06),a.el.classList.add("is-live"),await r(300),await a.scaleTo(1,{duration:1e3,easing:g.back}),a.el.classList.add("is-word"),await r(400),t.setPose("idle"),t.express("happy"),await C(a.moveTo(t.x+120,t.y-330,{duration:1400,easing:g.out}),e.to({...p(t.x+60,-60),zoom:e.fitRoom(1356),duration:1400})),await r(400),t.express("curious"),e.follow(a,{map:(m,w)=>p(m,w),offsetY:60,lag:.035}),await a.moveTo(-180,-400,{duration:1400,easing:g.inOut}),await a.moveTo(-430,-250,{duration:1400,easing:g.inOut}),await C(t.walkTo(-320,{speed:200}),a.moveTo(-700,-320,{duration:1400,easing:g.inOut})),await a.moveTo(D,-300,{duration:1400,easing:g.in}),h.setAttribute("transform",`translate(${D-20} -300)`),h.classList.remove("is-hit"),h.getBoundingClientRect(),h.classList.add("is-hit"),a.el.classList.add("is-bouncing"),e.shake(9),await a.moveTo(D+250,-350,{duration:700,easing:g.out}),a.el.classList.remove("is-bouncing"),e.unfollow(),await e.to({...p(-520,-190),zoom:e.fitRoom(1455),duration:1200}),t.express("surprised"),await r(500),t.express("curious"),e.follow(a,{map:(m,w)=>p(m,w),offsetY:40,lag:.03}),await a.moveTo(D+30,-270,{duration:1400,easing:g.inOut}),h.classList.remove("is-hit"),h.getBoundingClientRect(),h.setAttribute("transform",`translate(${D-10} -270)`),h.classList.add("is-hit"),a.el.classList.add("is-straining"),e.shake(5),await r(600),a.el.classList.add("is-fading"),await r(900),a.el.classList.remove("is-live","is-word","is-straining","is-fading"),e.unfollow(),await e.to({...p(-560,-60),zoom:e.fitRoom(1379),duration:1400}),t.express("confused"),await r(600),await t.walkTo(-760,{speed:150}),await t.face("left"),t.setPose("touch"),c.classList.add("wall-felt"),await r(1e3),l.querySelector(".tara").classList.add("mithu-alert"),await r(700),t.setPose("idle"),await t.face("right"),t.express("curious"),await e.to({...p(-420,-40),zoom:e.fitRoom(1905),duration:1400}),await r(400),l.querySelector(".room-door").classList.add("is-noticed"),await r(800),i.dataset.line="far",i.classList.add("show-line"),await r(4e3),i.classList.remove("show-line"),c.classList.remove("wall-felt"),l.querySelector(".tara").classList.remove("mithu-alert"),await r(300),s.journey.at("local"),await s.journey.flash(1800);let u=await F(s,S.whatToDo);for(await I(s,u==="outside"?"curious":"neutral",{ms:700});u==="stay";)await e.to({...p(t.x-20,60),zoom:e.fitRoom(1330),duration:1200}),t.setPose("whisper"),await r(700),t.setPose("idle"),a.el.classList.add("is-beckoning"),await r(900),a.el.classList.remove("is-beckoning"),c.classList.add("wall-felt"),await r(700),c.classList.remove("wall-felt"),t.express("confused"),await r(900),u=await F(s,{question:"The same wall, every time. Should she try outside?",options:[{value:"outside",label:"Take it outside",note:"find out why"},{value:"stay",label:"Try once more"}]});l.querySelector(".room-door").classList.remove("is-noticed"),await r(300)}async function ns(s){const{camera:e,tara:t,hers:o,ui:a,root:i}=s,l=i.querySelector(".room-door"),c=i.querySelector(".ask-prompt"),h=i.querySelector(".ask-anchor"),u=i.querySelector(".ask-speech"),m=i.querySelector(".ask-speech-anchor"),w=i.querySelector(".q-motes");o.at(-620,-240).setScale(1),o.el.classList.add("is-live","is-word","is-homebound"),await r(400),i.querySelector(".tara").classList.add("mithu-alert"),await r(500),t.express("curious"),await t.face("right"),await r(300),l.classList.add("is-open"),await r(500),e.follow(t,{map:(b,v)=>p(b,v),offsetY:-150,lag:.028}),await t.walkTo(M.doorX+40,{speed:210}),await r(400),await t.walkTo(A.x0+300,{speed:200}),e.unfollow(),await e.to({...p(A.centreX-260,-120),zoom:e.fitRoom(3077),duration:2300,easing:g.inOut}),t.express("surprised"),await r(500),await t.face("left"),await r(300),await t.face("right"),t.express("curious"),await r(400),h.setAttribute("transform",`translate(${A.askX} -470)`),await e.to({...p(A.askX,-250),zoom:e.fitRoom(2150),duration:1600,easing:g.inOut}),await t.face("right"),c.classList.add("is-offered"),await new Promise(b=>{const v=setTimeout(()=>c.classList.add("is-urging"),7e3),k=()=>{clearTimeout(v),c.classList.remove("is-urging"),c.removeEventListener("click",k),c.removeEventListener("keydown",y),b()},y=P=>{(P.key==="Enter"||P.key===" ")&&(P.preventDefault(),k())};c.addEventListener("click",k),c.addEventListener("keydown",y)}),c.classList.remove("is-offered"),c.classList.add("is-taken"),await C(t.walkTo(A.askX,{speed:190}),e.to({...p(A.askX+60,-180),zoom:e.fitRoom(2667),duration:1700})),await r(300),await t.face("left"),await r(300),t.setPose("reach"),t.express("curious"),m.setAttribute("transform",`translate(${A.askX+30} -330)`),u.classList.add("is-spoken"),await r(1100),t.setPose("idle"),u.classList.remove("is-spoken"),w.setAttribute("transform",`translate(${A.askX+40} -420)`),w.classList.add("is-asking"),i.querySelector(".courtyard").classList.add("is-hushed"),await r(1100),w.classList.remove("is-asking"),t.express("confused"),i.querySelector(".tara").classList.add("mithu-alert"),await r(700);const x=await F(s,S.whereDidItGo);await I(s,x===S.whereDidItGo.answer?"happy":"confused",{nod:!0,ms:800}),await j(s,S.whereDidItGo.feedback[x],2400),await t.face("left"),await r(300),await e.to({...p(700,-180),zoom:e.fitRoom(4706),duration:2300,easing:g.inOut}),o.el.classList.add("is-beckoning"),await r(1100),a.dataset.line="born",a.classList.add("show-line"),await r(4800),a.classList.remove("show-line"),await r(400),s.journey.done("local").at("enclosing"),i.querySelector(".tara").classList.remove("mithu-alert"),i.querySelector(".courtyard").classList.remove("is-hushed"),o.el.classList.remove("is-beckoning")}const cs=[{id:"local",cls:"lg-local"},{id:"enclosing",cls:"lg-enclosing"},{id:"global",cls:"lg-global"},{id:"builtin",cls:"lg-builtin"}];async function ds(s){const{camera:e,tara:t,code:o,ui:a,root:i}=s,l=i.querySelector(".layer-glows"),c=i.querySelector(".magic-labels");t.setPose("idle").express("curious"),await e.to({...p(900,-420),zoom:e.zoomToFitWidth(1080),duration:2300,easing:g.inOut}),await r(300),i.querySelector(".portal").classList.add("show-shell"),await e.to({...p(980,-940),zoom:e.zoomToFitWidth(1760),duration:2600,easing:g.inOut}),await r(500),l.classList.add("is-live");for(const h of cs)i.querySelector(`.${h.cls}`).classList.add("is-lit"),await r(400),c.querySelector(`.mlabel-${h.id}`).classList.add("is-named"),await r(900);await r(500),a.dataset.line="names",a.classList.add("show-line"),await r(3600),a.classList.remove("show-line"),a.dataset.line="legb",a.classList.add("show-line"),await r(4600),a.classList.remove("show-line"),o.dock(),await o.write(['name = "Mithu"'],{stagger:0}),o.note(0,"Global — out in the open palace"),await r(1600)}const hs=[{cls:"lg-local",found:!1,note:"not in room() — look outward"},{cls:"lg-enclosing",found:!1,note:"not in the enclosing space either"},{cls:"lg-global",found:!0,note:"found it — the palace name"}];async function us(s){const{camera:e,tara:t,spark:o,hers:a,code:i,ui:l,root:c}=s,h=c.querySelector(".layer-glows"),u=c.querySelector(".tara");c.querySelectorAll(".mlabel").forEach(w=>w.classList.remove("is-named")),c.querySelectorAll(".lg").forEach(w=>w.classList.remove("is-lit")),o.setText("MITHU").at(1900,-1180).setScale(1),o.el.classList.remove("is-dimmed"),o.el.classList.add("is-live","is-word","is-outer"),await e.to({...p(760,-560),zoom:e.zoomToFitWidth(1180),duration:1700}),t.express("curious"),await r(500),u.classList.add("mithu-alert"),l.dataset.line="wider",l.classList.add("show-line"),await r(3400),l.classList.remove("show-line"),u.classList.remove("mithu-alert"),i.clearNotes(),await i.append(["","def room():","    print(name)"],{stagger:380}),i.focus(3),await r(500),u.classList.add("has-lantern"),await r(500),h.classList.add("is-live","is-searching");for(const w of hs){if(w.cls==="lg-enclosing"){const b=await F(s,S.lookNext);await I(s,b===S.lookNext.answer?"happy":"curious",{ms:700}),await j(s,S.lookNext.feedback[b],2600),s.journey.done("local").at("enclosing")}const x=c.querySelector(`.${w.cls}`);x.classList.add("is-lit","is-probing"),i.note(3,w.note),w.cls==="lg-enclosing"&&C(t.walkTo(A.centreX-200,{speed:230}),e.to({...p(900,-640),zoom:e.zoomToFitWidth(1420),duration:1800})),w.cls==="lg-global"&&e.to({...p(980,-860),zoom:e.zoomToFitWidth(1780),duration:1900}),await r(1100),w.found?(x.classList.remove("is-probing"),x.classList.add("is-found"),o.el.classList.add("is-answering"),i.mark(3,"is-ok"),t.express("happy"),e.shake(5),await r(1400)):(x.classList.remove("is-probing"),x.classList.add("is-empty"),await r(300))}await r(800),i.unmark("is-ok"),i.note(3,"and print? found in the outermost ring"),c.querySelector(".lg-builtin").classList.add("is-lit","is-found"),c.querySelector(".mlabel-builtin").classList.add("is-named"),await r(1e3),s.journey.done("enclosing").done("global").at("builtin");const m=await F(s,S.whoMadePrint);await I(s,m===S.whoMadePrint.answer?"happy":"surprised",{nod:!0,ms:800}),await j(s,S.whoMadePrint.feedback[m],2800),l.dataset.line="builtin",l.classList.add("show-line"),await r(4400),l.classList.remove("show-line"),c.querySelector(".mlabel-builtin").classList.remove("is-named"),c.querySelectorAll(".lg").forEach(w=>w.classList.remove("is-empty","is-found")),h.classList.remove("is-searching"),o.el.classList.remove("is-answering"),i.unfocus(),i.clearNotes()}const ue={x:-560,y:-300};async function ms(s){const{camera:e,tara:t,spark:o,hers:a,code:i,ui:l,root:c}=s,h=c.querySelector(".tara");await C(t.walkTo(M.taraX-120,{speed:240}),e.to({...p(-120,-240),zoom:e.zoomToFitWidth(760),duration:2200})),h.classList.remove("has-lantern"),await t.face("right"),t.express("curious"),await r(500),t.setPose("whisper"),await r(500),a.setText("MITHU").at(ue.x,ue.y).setScale(.05),a.el.classList.remove("is-homebound","is-beckoning"),a.el.classList.add("is-live","is-inner"),await a.scaleTo(1,{duration:1e3,easing:g.back}),a.el.classList.add("is-word"),t.setPose("idle"),await i.retype(3,'    name = "Tara"'),i.mark(3,"is-claim"),i.note(3,"assigning MAKES a new local name"),await i.append(["    print(name)"],{stagger:0}),await r(1e3),await e.to({...p(560,-620),zoom:e.zoomToFitWidth(1500),duration:1800}),await r(800),await e.to({...p(-260,-260),zoom:e.zoomToFitWidth(820),duration:1600}),await t.walkTo(ue.x+250,{speed:200}),await t.face("left"),t.setPose("reach"),await r(300),a.el.classList.add("is-touched"),e.shake(4),await a.morphTo("TARA",{duration:1100}),a.el.classList.remove("is-touched"),t.setPose("idle"),t.express("surprised"),await r(500),await e.to({...p(620,-640),zoom:e.zoomToFitWidth(1560),duration:1800}),o.el.classList.add("is-answering"),i.note(0,"untouched"),await r(1100),o.el.classList.remove("is-answering"),i.note(0,""),t.express("happy"),h.classList.add("mithu-alert"),await r(800),h.classList.remove("mithu-alert");const u=c.querySelector(".mlabel-local");u.classList.add("is-named","is-inline"),await r(1700),i.unmark("is-claim"),i.focus(3),await r(700),l.dataset.line="readassign",l.classList.add("show-line"),await r(4400),l.classList.remove("show-line"),i.unfocus();const m=await fe(s,S.shadowPredict);await I(s,m.correct?"happy":"curious",{nod:!0,ms:800}),await e.to({...p(-160,-420),zoom:e.zoomToFitWidth(1120),duration:1800}),await r(400),c.querySelector(".reach").classList.add("show-shadow"),o.el.classList.add("is-shadowed"),a.el.classList.add("is-shadowing"),i.focus(4),i.note(4,"finds the local one; outer is hidden"),await r(1400),l.dataset.line="hides",l.classList.add("show-line"),await r(4200),l.classList.remove("show-line"),await r(500),i.unfocus(),i.clearNotes(),u.classList.remove("is-inline","is-named")}async function ws(s){const{camera:e,tara:t,spark:o,hers:a,code:i,ui:l,root:c}=s,h=c.querySelector(".tara"),u=c.querySelector(".reach");u.classList.remove("show-shadow"),o.el.classList.remove("is-shadowed"),a.el.classList.remove("is-shadowing"),await r(400),await e.to({...p(400,-620),zoom:e.zoomToFitWidth(1420),duration:1800}),await t.face("right"),t.express("curious"),await r(700),h.classList.add("mithu-alert"),l.dataset.line="speak",l.classList.add("show-line"),await r(3600),l.classList.remove("show-line"),h.classList.remove("mithu-alert"),s.journey.at("global");const m=await F(s,S.changeThePalace);await I(s,m===S.changeThePalace.answer?"happy":"confused",{nod:!0,ms:800}),await j(s,S.changeThePalace.feedback[m],2800),await e.to({...p(-200,-300),zoom:e.zoomToFitWidth(880),duration:1600}),h.classList.add("has-megaphone"),await r(500),t.setPose("reach"),t.express("happy"),await r(500),await e.to({...p(700,-700),zoom:e.zoomToFitWidth(1620),duration:1700}),await i.retype(3,"    global name"),i.mark(3,"is-claim"),i.note(3,"rebinds the palace name, not a local one"),await i.append(['    name = "Tara"'],{stagger:0}),await r(800),u.classList.add("show-global"),e.shake(6),await r(1100),o.el.classList.add("is-touched"),await o.morphTo("TARA",{duration:1200}),o.el.classList.remove("is-touched"),o.el.classList.add("is-answering"),e.shake(8),await r(1100),t.setPose("idle"),o.el.classList.remove("is-answering"),u.classList.remove("show-global"),h.classList.remove("has-megaphone"),await r(500);const w=c.querySelector(".mlabel-global");w.classList.add("is-named","is-inline"),await r(1700),w.classList.remove("is-inline","is-named"),await e.to({...p(260,-420),zoom:e.zoomToFitWidth(1240),duration:1700}),h.classList.add("mithu-alert"),i.unmark("is-claim"),i.clearNotes(),await i.write(["def palace():",'    name = "Mithu"',"","    def room():","        nonlocal name",'        name = "Tara"'],{stagger:300}),i.focus(4),i.note(4,"reaches the ENCLOSING room only"),u.classList.add("show-nonlocal"),await r(1100),await fe(s,S.whichReach),l.dataset.line="nonlocal",l.classList.add("show-line"),await r(4600),l.classList.remove("show-line"),u.classList.remove("show-nonlocal"),h.classList.remove("mithu-alert"),i.unfocus(),i.clearNotes(),t.express("happy"),await r(700)}async function ps(s){const{camera:e,tara:t,spark:o,hers:a,code:i,ui:l,root:c}=s,h=c.querySelector(".tara"),u=c.querySelector(".trails"),m=c.querySelector(".error-spell");o.setText("MITHU").at(1900,-1180),o.el.classList.add("is-live","is-word","is-outer"),o.el.classList.remove("is-shadowed"),a.el.classList.remove("is-word","is-live","is-inner","is-shadowing","is-hollow"),await e.to({...p(40,-140),zoom:e.fitRoom(1500),duration:2e3}),await t.face("right"),t.express("curious"),await i.write(['name = "Mithu"',"","def room():","    print(name)",'    name = "Tara"'],{stagger:300}),await r(500),u.classList.add("show-out"),o.el.classList.add("is-answering"),await r(1100),u.classList.remove("show-out"),o.el.classList.remove("is-answering"),await r(400);const w=await fe(s,S.errorPredict);await I(s,w.correct?"happy":"surprised",{nod:!0,ms:850}),await e.to({...p(-380,-200),zoom:e.fitRoom(1e3),duration:1600}),await t.face("left"),t.setPose("reach"),await r(400),a.setText("name").at(-560,-300).setScale(.1),a.el.classList.add("is-live","is-hollow"),await a.scaleTo(1,{duration:900,easing:g.back}),a.el.classList.add("is-word"),e.shake(4),t.setPose("idle"),await r(700),a.el.classList.add("is-claimed"),i.focus(4),i.note(4,"seen first — so name is local everywhere"),await r(1400),t.setPose("reach"),t.express("curious"),u.classList.add("show-local"),i.focus(3),i.note(3,"runs first — local name still empty"),await r(1e3),a.el.classList.add("is-hollow-pulse"),await r(800),u.classList.remove("show-local"),await e.to({...p(140,-300),zoom:e.fitRoom(1700),duration:1600}),u.classList.add("show-blocked"),await r(500),u.classList.add("is-barred"),e.shake(9),t.setPose("surprise"),t.express("surprised"),h.classList.add("mithu-alert"),await r(800),u.classList.remove("show-blocked","is-barred"),c.querySelector(".stage").classList.add("is-darkened"),m.setAttribute("transform","translate(120 -760)"),m.classList.add("is-cast"),i.mark(3,"is-error"),i.focus(3),e.shake(12),await r(1400),l.dataset.line="claimed",l.classList.add("show-line"),await r(4200),l.classList.remove("show-line"),await r(300),l.dataset.line="lookedthere",l.classList.add("show-line"),await r(4400),l.classList.remove("show-line"),await rs(s,{again:"See that again",go:"I follow — continue"})==="again"&&(m.classList.remove("is-cast"),await r(500),u.classList.add("show-blocked","is-barred"),m.classList.add("is-cast"),i.mark(3,"is-error"),e.shake(7),await r(2600),u.classList.remove("show-blocked","is-barred")),await r(700),m.classList.remove("is-cast"),c.querySelector(".stage").classList.remove("is-darkened"),h.classList.remove("mithu-alert"),t.setPose("idle"),a.el.classList.remove("is-hollow-pulse"),i.unmark("is-error"),i.unfocus(),i.clearNotes(),s.journey.done("builtin"),await r(500)}const Me={x:620,y:-1180};async function gs(s){const{camera:e,tara:t,spark:o,hers:a,code:i,ui:l,root:c}=s,h=c.querySelector(".tara"),u=c.querySelector(".trails"),m=c.querySelector(".perch-stand"),w=c.querySelector(".error-spell");await C(t.walkTo(M.taraX-220,{speed:200}),e.to({...p(-120,-260),zoom:e.fitRoom(1300),duration:1900})),await t.face("right"),t.setPose("sit"),t.express("curious"),m.setAttribute("transform",`translate(${M.taraX+190} ${M.floorY})`),m.classList.add("is-up"),h.classList.add("mithu-away"),await r(500),l.dataset.line="rules",l.classList.add("show-line"),await r(3800),l.classList.remove("show-line"),i.at(Me.x,Me.y),i.undock(),await i.clear({duration:400}),await e.to({...p(520,-760),zoom:e.fitRoom(2100),duration:1800}),a.el.classList.remove("is-word","is-live","is-hollow","is-claimed","is-hollow-pulse","is-inner","is-shadowing","is-clearing"),o.setText("MITHU").at(1900,-1180),o.el.classList.add("is-live","is-word","is-outer"),await i.write(['name = "Mithu"',"","def room():","    print(name)"]),await r(300),i.focus(3),u.classList.add("show-out"),await r(500),o.el.classList.add("is-answering"),await r(700),l.dataset.line="lookout",l.classList.add("show-line"),await r(3900),l.classList.remove("show-line"),u.classList.remove("show-out"),o.el.classList.remove("is-answering"),i.unfocus(),await i.clear(),await i.write(['name = "Mithu"',"","def room():",'    name = "Tara"',"    print(name)"]),await r(300),i.focus(3),a.setText("TARA").at(-560,-300).setScale(.1),a.el.classList.remove("is-hollow","is-claimed"),a.el.classList.add("is-live","is-inner"),await a.scaleTo(1,{duration:900,easing:g.back}),a.el.classList.add("is-word"),await r(400),i.focus(4),u.classList.add("show-local"),a.el.classList.add("is-shadowing"),o.el.classList.add("is-shadowed"),await r(800),l.dataset.line="hides",l.classList.add("show-line"),await r(3800),l.classList.remove("show-line");const x=c.querySelector(".shadow-tag .mlabel");x.classList.add("is-named"),await r(1100),x.classList.remove("is-named"),u.classList.remove("show-local"),o.el.classList.remove("is-shadowed"),a.el.classList.remove("is-shadowing"),i.unfocus(),await i.clear(),await i.write(['name = "Mithu"',"","def room():","    print(name)",'    name = "Tara"']),await r(300),i.focus(4),await r(500),a.setText("name").at(-560,-300).setScale(.1),a.el.classList.remove("is-inner"),a.el.classList.add("is-live","is-hollow"),await a.scaleTo(1,{duration:800,easing:g.back}),a.el.classList.add("is-word","is-claimed"),e.shake(4),await r(700),i.focus(3),u.classList.add("show-blocked"),a.el.classList.add("is-hollow-pulse"),await r(500),u.classList.add("is-barred"),e.shake(8),await r(500),u.classList.remove("show-blocked","is-barred"),w.setAttribute("transform","translate(620 -320)"),c.querySelector(".stage").classList.add("is-darkened"),w.classList.add("is-cast"),i.mark(3,"is-error"),await r(900),l.dataset.line="assigns",l.classList.add("show-line"),await r(4400),l.classList.remove("show-line"),await r(300),l.dataset.line="novalue",l.classList.add("show-line"),await r(4e3),l.classList.remove("show-line"),w.classList.remove("is-cast"),c.querySelector(".stage").classList.remove("is-darkened"),i.unfocus(),i.unmark("is-error"),await i.clear(),a.el.classList.remove("is-hollow-pulse"),await i.write(["len = 5",'print(len("palace"))'],{stagger:380}),await r(300),i.focus(0),i.note(0,"this hides the built-in len"),c.querySelector(".lg-builtin").classList.add("is-lit"),c.querySelector(".mlabel-builtin").classList.add("is-named"),await r(900),i.focus(1),i.mark(1,"is-error"),i.note(1,"TypeError — 5 is not a function"),e.shake(6),t.express("surprised"),await r(1100),l.dataset.line="shadowbuiltin",l.classList.add("show-line"),await r(4400),l.classList.remove("show-line"),c.querySelector(".mlabel-builtin").classList.remove("is-named"),c.querySelector(".lg-builtin").classList.remove("is-lit"),i.unfocus(),i.unmark("is-error"),i.clearNotes(),await i.clear(),t.express("curious"),await e.to({...p(-140,-180),zoom:e.fitRoom(1500),duration:1600}),t.setPose("idle");for(let b=0;b<2;b+=1)await t.walkTo(M.taraX-160,{speed:240}),a.setText("TARA").at(-560,-300).setScale(.1),a.el.classList.remove("is-hollow","is-claimed"),a.el.classList.add("is-live","is-inner"),await a.scaleTo(1,{duration:700,easing:g.back}),a.el.classList.add("is-word"),await r(500),await t.walkTo(M.doorX+60,{speed:240}),a.el.classList.add("is-clearing"),await r(400),a.el.classList.remove("is-live","is-word","is-clearing","is-inner"),await r(300);l.dataset.line="freshcall",l.classList.add("show-line"),await r(4e3),l.classList.remove("show-line"),await t.walkTo(M.taraX-160,{speed:220}),await t.face("right"),t.express("happy"),await e.to({...p(980,-940),zoom:e.zoomToFitWidth(1760),duration:2400}),c.querySelector(".layer-glows").classList.add("is-live");for(const b of["local","enclosing","global","builtin"])c.querySelector(`.lg-${b}`).classList.add("is-lit"),await r(300);await r(500),l.dataset.line="begins",l.classList.add("show-line"),await r(4400),l.classList.remove("show-line"),await r(500)}const oe=["local","enclosing","global","builtin"],ys=[{name:"secret",target:0},{name:"place",target:1},{name:"name",target:2},{name:"print",target:3}],fs=[{line:6,id:"local",note:"Local — this call only"},{line:3,id:"enclosing",note:"Enclosing — the function wrapped around it"},{line:0,id:"global",note:"Global — the top level of the file"},{line:7,id:"builtin",note:"print — Built-in, always there"}];function ze(s){oe.forEach(e=>{s.querySelector(`.lg-${e}`).classList.remove("is-lit","is-probing","is-found","is-empty")})}async function $s(s,e,t,o){ze(s),e.setText(t).at(1900,-1180).setScale(1),e.el.classList.remove("is-dimmed","is-answering"),e.el.classList.add("is-live","is-word"),await r(900);for(let a=0;a<=o;a+=1){const i=s.querySelector(`.lg-${oe[a]}`);i.classList.add("is-lit","is-probing"),await r(a===o?850:600),i.classList.remove("is-probing"),a===o?(i.classList.add("is-found"),s.querySelector(`.mlabel-${oe[a]}`).classList.add("is-named"),e.el.classList.add("is-answering"),await r(1700),s.querySelector(`.mlabel-${oe[a]}`).classList.remove("is-named"),e.el.classList.remove("is-answering")):(i.classList.add("is-empty"),await r(260))}await r(400)}async function Ls(s){const{camera:e,tara:t,spark:o,hers:a,code:i,ui:l,root:c}=s,h=c.querySelector(".tara"),u=c.querySelector(".perch-stand");await i.clear(),u.classList.remove("is-up"),h.classList.remove("mithu-away"),c.querySelectorAll(".mlabel").forEach(m=>m.classList.remove("is-named","is-inline")),c.querySelectorAll(".lg").forEach(m=>m.classList.remove("is-lit")),await r(600),t.setPose("idle").express("happy"),await C(t.walkTo(A.centreX+620,{speed:190}),e.to({...p(A.centreX+300,-260),zoom:e.fitRoom(2200),duration:4100})),await t.face("right"),await r(600),c.querySelector(".portal").classList.add("show-shell","is-warming"),await e.to({...p(900,-620),zoom:e.fitRoom(3200),duration:3e3}),a.el.classList.add("is-settled"),o.el.classList.add("is-settled"),h.classList.add("looks-out"),t.express("happy"),await r(900),l.dataset.line="belong",l.classList.add("show-line"),await r(3400),l.classList.remove("show-line"),await e.to({...p(980,-940),zoom:e.zoomToFitWidth(1760),duration:3e3}),c.querySelector(".layer-glows").classList.add("is-live"),await r(700),l.dataset.line="fourplaces",l.classList.add("show-line"),await r(3400),l.classList.remove("show-line");for(const{name:m,target:w}of ys)await $s(c,o,m,w);ze(c),o.el.classList.remove("is-live","is-word"),await r(800),i.undock(),await i.write(['name = "Mithu"',"","def palace():",'    place = "courtyard"',"","    def room():",'        secret = "laddoo"',"        print(name, place, secret)"],{stagger:300}),await r(900),c.querySelector(".layer-glows").classList.add("is-soft");for(const{line:m,id:w,note:x}of fs)i.focus(m),i.note(m,x),c.querySelector(`.lg-${w}`).classList.add("is-lit"),c.querySelector(`.mlabel-${w}`).classList.add("is-named"),await r(2600),c.querySelector(`.mlabel-${w}`).classList.remove("is-named");i.unfocus(),await r(900),l.dataset.line="legb",l.classList.add("show-line"),await r(4600),l.classList.remove("show-line"),await r(500),l.dataset.line="assignrule",l.classList.add("show-line"),await r(4800),l.classList.remove("show-line"),await r(600),await i.clear(),c.querySelectorAll(".mlabel").forEach(m=>m.classList.add("is-fading")),c.querySelectorAll(".lg").forEach(m=>m.classList.add("is-fading")),await r(1100),c.querySelectorAll(".mlabel").forEach(m=>m.classList.remove("is-named","is-fading")),c.querySelectorAll(".lg").forEach(m=>m.classList.remove("is-lit","is-fading")),c.querySelector(".layer-glows").classList.remove("is-soft"),await e.to({...p(900,-820),zoom:e.zoomToFitWidth(1900),duration:3e3}),await r(600),l.dataset.line="bridge",l.classList.add("show-line"),await r(4200),l.classList.remove("show-line"),await r(400),l.classList.add("is-ending"),l.classList.add("show-title"),await r(4200),l.classList.add("show-sub"),await r(1600),c.querySelector(".replay").classList.add("is-offered")}async function xs(s){const{camera:e,tara:t,spark:o,ui:a}=s;e.set({x:300,y:-1080,zoom:e.zoomToFitWidth(2e3)}),t.setPose("idle").express("neutral"),await r(400);const i=(async()=>{a.dataset.line="premise",a.classList.add("show-line"),await r(2100),a.dataset.line="premise2",await r(2100),a.dataset.line="premise3",await r(2200),a.classList.remove("show-line")})();await e.to({x:1150,y:-560,zoom:e.zoomToFitWidth(2300),duration:2300,easing:g.inOut}),await e.to({x:1600,y:420,zoom:e.zoomToFitWidth(1900),duration:2600,easing:g.inOut}),await i,await r(400),await e.to({x:n.x,y:n.y,zoom:e.zoomToFitWidth(780),duration:1800,easing:g.inOut}),s.root.querySelector(".hero-window").classList.add("is-open"),await r(2500),t.express("curious"),await t.face("right"),await r(600),await e.to({x:n.x,y:n.y,zoom:e.zoomToFitWidth(540),duration:1800,easing:g.inOut});const l=e.to({...p(0,40),zoom:e.fitRoom(1739),duration:2600,easing:g.inOut});await r(1900),s.root.querySelector(".portal").classList.add("is-inside"),s.root.querySelector(".hero-window").classList.add("is-passed"),await l,await e.to({...p(-40,90),zoom:e.fitRoom(1667),duration:1800}),await r(600),await C(t.walkTo(M.taraX-360,{speed:210}),e.to({...p(-220,110),zoom:e.fitRoom(1684),duration:2300})),await r(700),await t.face("right"),await r(500),o.el.classList.add("is-live"),await o.moveTo(360,-160,{duration:1600,easing:g.out}),t.express("curious"),await r(700),await C(o.moveTo(-60,-60,{duration:2e3,easing:g.inOut}),e.to({...p(-160,40),zoom:e.fitRoom(1481),duration:2e3})),t.setPose("reach"),await r(520),await o.moveTo(300,-240,{duration:900,easing:g.out}),t.setPose("idle"),t.express("surprised"),e.shake(5),await r(700),t.express("curious"),await C(t.walkTo(M.taraX-60,{speed:190}),e.to({...p(40,-10),zoom:e.fitRoom(1569),duration:1800})),await r(500),await o.moveTo(150,-170,{duration:1100,easing:g.inOut}),await r(400),o.el.classList.add("is-word"),e.shake(7),t.setPose("surprise"),t.express("surprised"),await r(1400),t.setPose("idle"),t.express("curious"),await r(1600),await e.to({...p(30,10),zoom:e.fitRoom(1778),duration:2e3}),a.classList.add("show-title"),await r(3400),a.classList.add("show-sub"),await r(3e3)}const bs=[xs,ls,ns,ds,us,ms,ws,ps,gs,Ls];async function vs(s){for(const e of bs)await e(s)}const ks=[{id:"local",name:"Local"},{id:"enclosing",name:"Enclosing"},{id:"global",name:"Global"},{id:"builtin",name:"Built-in"}];function Ss(){return`
<nav class="journey" aria-label="Story progress">
  <span class="journey-title">Palace Journey</span>
  <ol class="journey-steps">
    ${ks.map(s=>`
      <li class="jstep" data-id="${s.id}">
        <span class="jlamp" aria-hidden="true"></span>
        <span class="jname">${s.name}</span>
      </li>`).join("")}
  </ol>
</nav>`}class Ts{constructor(e){this.el=e,this.steps=new Map([...e.querySelectorAll(".jstep")].map(t=>[t.dataset.id,t]))}at(e){for(const[t,o]of this.steps)o.classList.toggle("is-here",t===e),t===e?o.setAttribute("aria-current","step"):o.removeAttribute("aria-current");return this.el.classList.add("is-shown"),this}done(e){const t=this.steps.get(e);return t&&(t.classList.add("is-done"),t.classList.remove("is-here"),t.removeAttribute("aria-current")),this}async flash(e=2600){return this.el.classList.add("is-shown","is-forward"),await new Promise(t=>setTimeout(t,e)),this.el.classList.remove("is-forward"),this}reset(){for(const e of this.steps.values())e.classList.remove("is-here","is-done"),e.removeAttribute("aria-current");return this.el.classList.remove("is-shown","is-forward"),this}}const Y={width:1600,height:900};class Ae{constructor(e){this.el=e,this.x=0,this.y=0,this.scale=1,this.apply()}apply(){this.el.setAttribute("transform",`translate(${this.x} ${this.y}) scale(${this.scale})`)}at(e,t){return this.x=e,this.y=t,this.apply(),this}setScale(e){return this.scale=e,this.apply(),this}setText(e){const t=this.el.querySelector(".sw-text");if(!t)return this;t.textContent=e;const o=Math.max(190,e.length*34+96),a=this.el.querySelector(".sw-plate"),i=this.el.querySelector(".sw-aura");return a&&(a.setAttribute("x",-o/2),a.setAttribute("width",o)),i&&i.setAttribute("rx",o*.78),this}async morphTo(e,{duration:t=900}={}){return this.el.classList.add("is-morphing"),await R({duration:t/2,easing:g.in,onUpdate:()=>{}}),this.setText(e),await R({duration:t/2,easing:g.out,onUpdate:()=>{}}),this.el.classList.remove("is-morphing"),this}scaleTo(e,{duration:t=900,easing:o=g.inOut}={}){const a=this.scale;return R({duration:t,easing:o,onUpdate:i=>{this.scale=a+(e-a)*i,this.apply()}})}moveTo(e,t,{duration:o=1400,easing:a=g.inOut}={}){const i=this.x,l=this.y;return R({duration:o,easing:a,onUpdate:c=>{this.x=i+(e-i)*c,this.y=l+(t-l)*c,this.apply()}})}}function me(s,e){const t=document.createElementNS("http://www.w3.org/2000/svg","g");return e&&t.setAttribute("class",e),t.innerHTML=s,t}function qs(s){s.innerHTML=`
    <div class="stage">
      <svg class="stage-svg" viewBox="0 0 ${Y.width} ${Y.height}"
           preserveAspectRatio="xMidYMid slice" role="img"
           aria-label="A palace at night. A girl and her parrot watch a glowing word appear.">
        ${Xe()}
        <defs>${is()}</defs>
        <g class="world">${as()}</g>
      </svg>

      <div class="ui">
        <svg class="title-svg" viewBox="0 0 ${Y.width} ${Y.height}"
             preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <g class="title-group" transform="translate(800 648)">
            ${os()}
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

      <!-- The story's narration is shown by toggling which <p> is displayed.
           A screen reader announces nothing for that: the text was always in
           the document, and display:none -> block is not reliably reported.
           So the whole seven-minute lesson was silent, while the palace itself
           offered one static alt line. This region mirrors whatever narration
           is currently visible, and is the only thing that makes the story
           audible at all. -->
      <p class="sr-live" aria-live="polite" aria-atomic="true"></p>
      ${Ss()}

      <button class="pausebtn" type="button" aria-label="Pause the story" aria-pressed="false">
        <span class="pause-icon" aria-hidden="true">&#10073;&#10073;</span>
        <span class="play-icon" aria-hidden="true">&#9654;</span>
      </button>
      <button class="replay" type="button" aria-label="Replay the story from the beginning">
        <span class="replay-icon" aria-hidden="true">&#8635;</span>
        <span class="replay-label">Replay the story</span>
      </button>
    </div>`;const e=s.querySelector(".world"),t=new Ne(e,Y),o=s.querySelector(".tara-slot"),a=me(Ge());o.appendChild(a);const i=new je(a,{x:60,y:420,scale:1,facing:"left"}),l=me(Se()+Te("laddoo"),"spark-slot");o.appendChild(l);const c=new Ae(l);c.at(520,-300);const h=me(Se()+Te("chameli"),"spark-slot hers");o.appendChild(h);const u=new Ae(h);u.at(0,0).setScale(.06);const m=new Ze(s.querySelector(".code-air")),w=s.querySelector(".sr-live"),x=s.querySelector(".ui"),b=()=>{if(!x.classList.contains("show-line")){w.textContent="";return}const L=x.dataset.line,$=L?s.querySelector(`.narration[data-for="${L}"]`):s.querySelector('.narration[data-for="far"]'),H=$?$.textContent.trim():"";w.textContent!==H&&(w.textContent=H)};new MutationObserver(b).observe(x,{attributes:!0,attributeFilter:["class","data-line"]});const v=new Ts(s.querySelector(".journey"));v.at("local");const k={root:s,camera:t,tara:i,spark:c,hers:u,code:m,journey:v,ui:s.querySelector(".ui")},y=()=>{We(),s.querySelector(".hero-window").classList.remove("is-open","is-passed"),s.querySelector(".portal").classList.remove("is-inside"),l.classList.remove("is-live","is-word","is-dimmed"),h.classList.remove("is-live","is-word","is-bouncing","is-straining","is-fading"),u.at(0,0).setScale(.06),s.querySelector(".room").classList.remove("wall-felt"),s.querySelector(".room-door").classList.remove("is-noticed"),s.querySelector(".tara").classList.remove("mithu-alert"),s.querySelector(".wall-ripple").classList.remove("is-hit"),s.querySelector(".room-door").classList.remove("is-open"),s.querySelector(".portal").classList.remove("show-shell"),s.querySelector(".layer-glows").classList.remove("is-live"),s.querySelectorAll(".lg").forEach($=>$.classList.remove("is-lit")),s.querySelectorAll(".mlabel").forEach($=>$.classList.remove("is-named")),s.querySelector(".ask-prompt").classList.remove("is-offered","is-taken"),s.querySelector(".ask-speech").classList.remove("is-spoken"),s.querySelector(".q-motes").classList.remove("is-asking"),s.querySelector(".courtyard").classList.remove("is-hushed"),h.classList.remove("is-homebound","is-beckoning","is-inner","is-shadowing","is-touched"),l.classList.remove("is-outer","is-answering","is-shadowed","is-touched"),u.setText("chameli"),c.setText("laddoo"),s.querySelector(".reach").classList.remove("show-global","show-nonlocal","show-shadow"),s.querySelectorAll(".lg").forEach($=>$.classList.remove("is-probing","is-empty","is-found")),s.querySelectorAll(".mlabel").forEach($=>$.classList.remove("is-inline")),s.querySelector(".layer-glows").classList.remove("is-searching"),s.querySelector(".tara").classList.remove("has-lantern","has-megaphone","mithu-away"),h.classList.remove("is-hollow","is-claimed","is-hollow-pulse","is-clearing"),s.querySelector(".trails").classList.remove("show-out","show-local","show-blocked","is-barred"),s.querySelector(".error-spell").classList.remove("is-cast"),s.querySelector(".perch-stand").classList.remove("is-up"),s.querySelector(".shadow-tag .mlabel").classList.remove("is-named"),s.querySelector(".stage").classList.remove("is-darkened"),m.clear({duration:0}),m.undock(),s.querySelector(".tara").classList.remove("looks-out","mithu-nods"),s.querySelector(".portal").classList.remove("is-warming"),s.querySelectorAll(".is-waking").forEach($=>$.classList.remove("is-waking")),s.querySelectorAll(".is-fading").forEach($=>$.classList.remove("is-fading")),h.classList.remove("is-settled","is-rising","is-star"),l.classList.remove("is-settled"),s.querySelector(".layer-glows").classList.remove("is-soft"),s.querySelector(".replay").classList.remove("is-offered"),s.querySelector(".interact").innerHTML="",v.reset(),v.at("local"),Ce(),s.querySelector(".stage").classList.remove("is-paused");const L=s.querySelector(".pausebtn");L.classList.remove("is-paused"),L.setAttribute("aria-pressed","false"),L.setAttribute("aria-label","Pause the story"),k.ui.classList.remove("is-ending"),delete k.ui.dataset.line,k.ui.classList.remove("show-title","show-sub","show-line"),i.at(60,420),i.facing="left",i.apply(),c.x=520,c.y=-300,c.apply(),t.unfollow(),vs(k)},P=s.querySelector(".pausebtn"),G=s.querySelector(".stage"),X=L=>{G.classList.toggle("is-paused",L),P.classList.toggle("is-paused",L),P.setAttribute("aria-pressed",String(L)),P.setAttribute("aria-label",L?"Resume the story":"Pause the story")};return P.addEventListener("click",()=>X($e())),addEventListener("keydown",L=>{if(L.code!=="Space"&&L.key!==" ")return;const $=L.target;$ instanceof Element&&($.closest("button")||$.getAttribute("role")==="button"||$.isContentEditable)||(L.preventDefault(),X($e()))}),s.querySelector(".replay").addEventListener("click",y),W?(s.querySelector(".hero-window").classList.add("is-open","is-passed"),s.querySelector(".portal").classList.add("is-inside","show-shell"),s.querySelector(".room-door").classList.add("is-open"),h.classList.add("is-live","is-word","is-homebound"),u.at(-620,-240).setScale(1),l.classList.add("is-live","is-word"),c.at(470,-330),i.at(1760,420),i.express("confused"),s.querySelector(".layer-glows").classList.add("is-live"),s.querySelectorAll(".lg").forEach(L=>L.classList.add("is-lit")),s.querySelectorAll(".mlabel").forEach(L=>L.classList.add("is-named")),u.setText("TARA"),h.classList.add("is-inner"),u.at(-560,-300),c.setText("MITHU"),l.classList.add("is-outer"),c.at(1900,-1180),t.set({x:n.x+980*n.scale,y:n.y+-940*n.scale,zoom:t.zoomToFitWidth(1760)}),m.dock(),m.write(['name = "Mithu"',"","def room():",'    name = "Tara"',"    print(name)"],{stagger:0}),m.note(0,"Global — the palace name"),m.note(3,"assigning makes a NEW local name"),m.note(4,"finds the local one first"),k.ui.dataset.line="names",k.ui.classList.add("show-line")):y(),k}qs(document.getElementById("app"));
