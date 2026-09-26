(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();const F=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let Z=0;const O=()=>Z,oe=new Set;function we(e){return oe.add(e),()=>oe.delete(e)}function Oe(){Z+=1;for(const e of oe)try{e()}catch{}return oe.clear(),Z}let j=!1,pe=0,Ae=0;const re=()=>(j?pe:performance.now())-Ae;function We(){j||(pe=performance.now(),j=!0)}function Ce(){j&&(Ae+=performance.now()-pe,j=!1)}function $e(){return j?Ce():We(),j}const y={inOut:e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,out:e=>1-Math.pow(1-e,3),in:e=>e*e*e,back:e=>1+2.2*Math.pow(e-1,3)+1.2*Math.pow(e-1,2)};function r(e){const s=Z;return F?Promise.resolve():new Promise(t=>{const o=re()+e,a=()=>{if(s===Z){if(re()>=o)return t();requestAnimationFrame(a)}};requestAnimationFrame(a)})}function z({duration:e=600,easing:s=y.inOut,onUpdate:t,onDone:o}={}){let a=null,i=!1;const l=Z,c=new Promise(h=>{if(F||e<=0){t?.(1),o?.(),h();return}const u=re(),m=()=>{if(i)return h();if(l!==Z)return;const w=Math.min(1,(re()-u)/e);t?.(s(w)),w<1?a=requestAnimationFrame(m):(o?.(),h())};a=requestAnimationFrame(m)});return c.cancel=()=>{i=!0,a&&cancelAnimationFrame(a)},c}const X=(e,s,t)=>e+(s-e)*t,P=(...e)=>Promise.all(e.map(s=>typeof s=="function"?s():s));class Ne{constructor(s,t){this.el=s,this.view=t,this.state={x:t.width/2,y:t.height/2,zoom:1},this.following=null,this.shakeAmount=0,this.shakePhase=0,this.shakeAngle=0,this.apply(),this.tick=this.tick.bind(this),requestAnimationFrame(this.tick)}apply(){const{x:s,y:t,zoom:o}=this.state,a=this.view.width/2,i=this.view.height/2,l=this.shakeAmount?Math.sin(this.shakePhase)*this.shakeAmount:0,c=l*Math.cos(this.shakeAngle),h=l*Math.sin(this.shakeAngle)*.6;this.el.setAttribute("transform",`translate(${a+c} ${i+h}) scale(${o}) translate(${-s} ${-t})`)}tick(){if(this.following&&this.following.gen!==O()&&(this.following=null),this.following){const{actor:s,offsetX:t=0,offsetY:o=0,lag:a=.08,map:i}=this.following,l=i?i(s.x,s.y):{x:s.x,y:s.y},c=l.x+t,h=l.y+o;this.state.x=X(this.state.x,c,a),this.state.y=X(this.state.y,h,a),this.apply()}else this.shakeAmount>0&&this.apply();this.shakeAmount>0&&(this.shakePhase+=.62,this.shakeAmount*=.88),this.shakeAmount<.05&&(this.shakeAmount=0,this.shakePhase=0),requestAnimationFrame(this.tick)}set({x:s,y:t,zoom:o}={}){return s!==void 0&&(this.state.x=s),t!==void 0&&(this.state.y=t),o!==void 0&&(this.state.zoom=o),this.apply(),this}to({x:s,y:t,zoom:o,duration:a=1400,easing:i=y.inOut}={}){const l={...this.state},c={x:s??l.x,y:t??l.y,zoom:o??l.zoom};return z({duration:a,easing:i,onUpdate:h=>{this.state.x=X(l.x,c.x,h),this.state.y=X(l.y,c.y,h),this.state.zoom=X(l.zoom,c.zoom,h),this.apply()}})}follow(s,t={}){return this.following={actor:s,...t,gen:O()},this}unfollow(){return this.following=null,this}zoomToFitWidth(s){const o=this.el.ownerSVGElement.getBoundingClientRect();if(!o.width||!o.height)return 1;const a=Math.max(o.width/this.view.width,o.height/this.view.height);return o.width/a/s}fitRoom(s,t=.225){return this.zoomToFitWidth(s*t)}shake(s=10){return this.shakeAmount=s,this.shakePhase=0,this.shakeAngle=(Math.random()-.5)*.9,this}}class Ze{constructor(s,{x:t=0,y:o=0,facing:a="right",scale:i=1}={}){this.el=s,this.figure=s.firstElementChild||s,this.x=t,this.y=o,this.facing=a,this.scale=i,this.pose="idle",this.apply()}apply(){const s=this.facing==="left"?-1:1;this.el.setAttribute("transform",`translate(${this.x} ${this.y}) scale(${s*this.scale} ${this.scale})`)}at(s,t){return this.x=s,t!==void 0&&(this.y=t),this.apply(),this}setPose(s){return this.figure.classList.remove(`pose-${this.pose}`),this.pose=s,this.figure.classList.add(`pose-${s}`),this}express(s){return this.figure.dataset.mood=s,this}async face(s,{duration:t=260}={}){if(this.facing===s)return;const o=s==="left"?-1:1;await z({duration:t/2,easing:y.in,onUpdate:a=>{const i=(1-a)*this.scale;this.el.setAttribute("transform",`translate(${this.x} ${this.y}) scale(${(this.facing==="left"?-1:1)*i} ${this.scale})`)}}),this.facing=s,await z({duration:t/2,easing:y.out,onUpdate:a=>{const i=a*this.scale;this.el.setAttribute("transform",`translate(${this.x} ${this.y}) scale(${o*i} ${this.scale})`)}}),this.apply()}async walkTo(s,{speed:t=300,pose:o="walk"}={}){const a=s<this.x?"left":"right";await this.face(a);const i=this.x,l=Math.abs(s-i);if(l<1)return;const c=l/t*1e3;this.setPose(o),await z({duration:c,easing:y.inOut,onUpdate:h=>{this.x=i+(s-i)*h,this.apply()}}),this.setPose("idle")}beat(s=500){return r(s)}}class je{constructor(s){this.el=s,this.pre=s.querySelector(".ca-lines"),this.lines=[],this.texts=[]}at(){return this}dock(){return this.el.classList.add("is-docked"),this}undock(){return this.el.classList.remove("is-docked"),this}async write(s,{stagger:t=420}={}){return this.pre.innerHTML="",this.lines=[],this.texts=[],this.el.classList.add("is-open"),this.append(s,{stagger:t})}async append(s,{stagger:t=420}={}){this.el.classList.add("is-open");for(const o of s){const a=o.match(/^\s*/)[0].length,i=document.createElement("span");i.className="ca-line",i.style.paddingLeft=`${a*.62}em`,i.innerHTML=fe(o.trim())||"&nbsp;",this.pre.appendChild(i),this.lines.push(i),this.texts.push(o),requestAnimationFrame(()=>i.classList.add("is-written")),await r(t)}return this}async retype(s,t,{flash:o=!0}={}){const a=this.lines[s];if(!a)return this;const i=t.match(/^\s*/)[0].length;return a.style.paddingLeft=`${i*.62}em`,a.innerHTML=fe(t.trim())||"&nbsp;",this.texts[s]=t,o&&(a.classList.remove("is-written"),requestAnimationFrame(()=>a.classList.add("is-written")),await r(700)),this}note(s,t){const o=this.lines[s];if(!o)return this;if(o.querySelector(".ca-note")?.remove(),!t)return this;const a=document.createElement("span");return a.className="ca-note",a.textContent=`  # ${t}`,o.appendChild(a),this}clearNotes(){return this.pre.querySelectorAll(".ca-note").forEach(s=>s.remove()),this}mark(s,t){return this.lines[s]?.classList.add(t),this}unmark(s){return this.lines.forEach(t=>t.classList.remove(s)),this}focus(s){return this.lines.forEach((t,o)=>t.classList.toggle("is-running",o===s)),this}unfocus(){return this.lines.forEach(s=>s.classList.remove("is-running")),this}async clear({duration:s=700}={}){return this.el.classList.remove("is-open"),await r(s),this.pre.innerHTML="",this.lines=[],this.texts=[],this}}function fe(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}const d=-246,Qe=43,g=-190,v=-104;function Le(e,s){return`
  <g class="limb ${s}">
    <path class="churidar" d="M ${e-13} ${v}
      C ${e-15} ${v+46} ${e-13} -40 ${e-11} -12
      L ${e+11} -12
      C ${e+13} -40 ${e+15} ${v+46} ${e+13} ${v} Z" />
    <path class="cuff" d="M ${e-12} -26 L ${e+12} -26 L ${e+11} -14 L ${e-11} -14 Z" />
    <ellipse class="slipper" cx="${e+3}" cy="-5" rx="19" ry="9" />
  </g>`}function xe(e,s,t=""){return`
  <g class="limb ${s}">
    <path class="sleeve" d="M ${e+1} ${g+2}
      C ${e+7} ${g+36} ${e+8} ${g+64} ${e+6} ${g+88}
      C ${e+1} ${g+92} ${e-9} ${g+92} ${e-13} ${g+88}
      C ${e-15} ${g+62} ${e-14} ${g+34} ${e-12} ${g+2} Z" />
    <!-- one soft fold where the sleeve gathers at the elbow -->
    <path class="fold" d="M ${e-10} ${g+48} C ${e-4} ${g+52} ${e+1} ${g+50} ${e+5} ${g+45}" />
    <!-- a hand, not a ball: slightly oval, tilted, with a thumb suggested by
         the notch on the inner edge -->
    <path class="skin hand" d="M ${e-14} ${g+88}
      C ${e-17} ${g+98} ${e-12} ${g+106} ${e-3} ${g+106}
      C ${e+6} ${g+106} ${e+10} ${g+98} ${e+8} ${g+89}
      C ${e+4} ${g+93} ${e-8} ${g+93} ${e-14} ${g+88} Z" />
    ${t}
  </g>`}function Ie(e,s){return`
  <g class="prop prop-lantern" transform="translate(${e} ${s})">
    <path class="lan-hoop" d="M -16 -4 C -16 -30 16 -30 16 -4" />
    <rect class="lan-cap" x="-19" y="-6" width="38" height="10" rx="4" />
    <path class="lan-glass" d="M -17 4 L 17 4 L 13 44 L -13 44 Z" />
    <circle class="lan-halo" cx="0" cy="24" r="82" />
    <path class="lan-flame" d="M 0 10 C 9 22 7 36 0 36 C -7 36 -9 22 0 10 Z" />
    <rect class="lan-base" x="-16" y="42" width="32" height="9" rx="4" />
  </g>`}function Ge(e,s){return`
  <g class="prop prop-megaphone" transform="translate(${e} ${s})">
    <path class="meg-body" d="M -6 -14 L -6 14 L 42 34 L 42 -34 Z" />
    <ellipse class="meg-mouth" cx="42" cy="0" rx="9" ry="34" />
    <rect class="meg-grip" x="-20" y="-9" width="16" height="18" rx="6" />
  </g>`}function He(){return`
<g class="tara pose-idle" data-mood="neutral">
  <ellipse class="shadow" cx="4" cy="2" rx="62" ry="12" />

  <!-- far side limbs sit behind the body -->
  ${Le(-17,"leg-far")}
  ${xe(-46,"arm-far")}

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
    <path class="kurta" d="M -32 ${g-6}
      C -48 ${g+22} -50 ${v-20} -54 ${v+16}
      L 54 ${v+16}
      C 50 ${v-20} 44 ${g+22} 32 ${g-6}
      C 18 ${g-18} -18 ${g-18} -32 ${g-6} Z" />
    <path class="fold" d="M -30 ${v-46} C -18 ${v-40} 16 ${v-40} 30 ${v-48}" />
    <path class="kurta-hem" d="M -54 ${v+4} L 54 ${v+4} L 54 ${v+16} L -54 ${v+16} Z" />
    <path class="dupatta" d="M -30 ${g-2}
      C -6 ${g+26} 22 ${g+22} 34 ${g+2}
      C 44 ${g+54} 38 ${v+6} 26 ${v+30}
      L 8 ${v+24}
      C 22 ${v-6} 28 ${g+58} 20 ${g+34}
      C 4 ${g+46} -18 ${g+40} -30 ${g+22} Z" />
  </g>

  <!-- near side limbs -->
  ${Le(17,"leg-near")}
  ${xe(48,"arm-near",Ie(40,g+104)+Ge(40,g+96))}

  <!-- head. The hair is a full disc sitting behind a slightly lower, slightly
       forward face disc: that leaves a clean hair rim over the crown. A single
       curved cap never reaches the top of the skull and leaves it bald. -->
  <g class="head">
    <!-- Hair as a rounded mass with real volume, rather than a disc five
         units wider than the face — that only ever showed as a thin rim. The
         old fringe doubled back on itself and left a dark wedge over her right
         brow, which read as a mistake rather than a hairstyle. -->
    <path class="hair" d="M -44 ${d+10}
      C -49 ${d-30} -24 ${d-54} 2 ${d-54}
      C 30 ${d-54} 50 ${d-28} 48 ${d+12}
      C 47 ${d+30} 44 ${d+42} 38 ${d+52}
      L -34 ${d+52}
      C -41 ${d+38} -44 ${d+26} -44 ${d+10} Z" />

    <circle class="skin" cx="3" cy="${d+4}" r="${Qe}" />

    <!-- Fringe: one sweep across the forehead, left to right. It has to clear
         the brows by a good margin — the brows are stroked in the hair colour,
         so a fringe that reaches them does not overlap them, it ERASES them,
         and she loses every expression the moods depend on. -->
    <path class="hair" d="M -42 ${d+4}
      C -46 ${d-26} -24 ${d-48} 3 ${d-48}
      C 31 ${d-48} 48 ${d-26} 46 ${d+2}
      C 41 ${d-24} 30 ${d-36} 14 ${d-39}
      C -6 ${d-42} -27 ${d-30} -37 ${d-10}
      C -38 ${d+2} -40 ${d+4} -42 ${d+4} Z" />

    <!-- the headband she already wore, drawn on purpose this time -->
    <path class="headband" d="M -40 ${d-10} C -30 ${d-34} 30 ${d-36} 45 ${d-12}" />
    <circle class="flower" cx="34" cy="${d-32}" r="9" />
    <circle class="flower-mid" cx="34" cy="${d-32}" r="3.8" />

    <g class="face">
      <circle class="blush" cx="-20" cy="${d+14}" r="10" />
      <circle class="blush" cx="30" cy="${d+14}" r="10" />

      <g class="eyes">
        <g class="eye">
          <ellipse class="eye-white" cx="-7" cy="${d-2}" rx="11.5" ry="13.5" />
          <circle class="pupil" cx="-5" cy="${d}" r="7.4" />
          <circle class="glint" cx="-9" cy="${d-5}" r="3.1" />
          <circle class="glint small" cx="-1" cy="${d+4}" r="1.6" />
        </g>
        <g class="eye">
          <ellipse class="eye-white" cx="23" cy="${d-2}" rx="11.5" ry="13.5" />
          <circle class="pupil" cx="25" cy="${d}" r="7.4" />
          <circle class="glint" cx="21" cy="${d-5}" r="3.1" />
          <circle class="glint small" cx="29" cy="${d+4}" r="1.6" />
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
        <path class="mouth-set" data-for="neutral"   d="M 1 ${d+24} Q 10 ${d+33} 19 ${d+24}" />
        <path class="mouth-set" data-for="curious"   d="M 2 ${d+23} Q 10 ${d+33} 18 ${d+23}" />
        <path class="mouth-set open" data-for="surprised" d="M 10 ${d+27} m -8 0 a 8 9 0 1 0 16 0 a 8 9 0 1 0 -16 0" />
        <path class="mouth-set" data-for="confused" d="M 2 ${d+28} Q 10 ${d+22} 18 ${d+27}" />
        <path class="mouth-set open" data-for="happy" d="M 0 ${d+22} Q 10 ${d+38} 20 ${d+22} Z" />
      </g>
    </g>
  </g>

  <!-- Mithu rides on her shoulder -->
  <!-- positioning on the OUTER group: the hop animation below sets transform,
       and a CSS transform replaces the SVG attribute rather than composing. -->
  <g class="mithu-perch" transform="translate(42 ${g-10}) scale(0.27)">
    <g class="mithu-hop">${Pe()}</g>
  </g>
</g>`}function Pe(){return`
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
</g>`}function te(e,s,t,o,a="stone"){const i=t/2;return`<g class="${a}">
    <path d="M ${e-i} ${s}
             C ${e-i} ${s-o*.5} ${e-i*.62} ${s-o*.8} ${e} ${s-o}
             C ${e+i*.62} ${s-o*.8} ${e+i} ${s-o*.5} ${e+i} ${s} Z" />
    <rect x="${e-3}" y="${s-o-28}" width="6" height="30" rx="3" />
    <circle cx="${e}" cy="${s-o-34}" r="7" />
  </g>`}function le(e,s,t,o){const a=t/2,i=e+a;return`M ${e} ${s+o}
          L ${e} ${s+a*.72}
          Q ${e} ${s} ${i} ${s-a*.28}
          Q ${e+t} ${s} ${e+t} ${s+a*.72}
          L ${e+t} ${s+o} Z`}function me(e,s,t,o,a="arch"){return`<path class="${a}" d="${le(e,s,t,o)}" />`}function ae(e,s,t,o,a=0){return`<path class="lit-window" style="animation-delay:${a}s" d="${le(e,s,t,o)}" />`}function K(e,s,t,o,a,i,l="arch"){const c=l==="lit"?ae:me;return Array.from({length:t},(h,u)=>l==="lit"?c(e+u*(o+i),s,o,a,u*.83%5):c(e+u*(o+i),s,o,a)).join("")}function ne(e,s,t,o=30){const a=o/2;return`<g class="stone">
    <rect x="${e-a}" y="${s}" width="${o}" height="${t-s}" rx="4" />
    <rect x="${e-a-9}" y="${s-14}" width="${o+18}" height="16" rx="5" />
    <rect x="${e-a-11}" y="${t-14}" width="${o+22}" height="16" rx="5" />
  </g>`}function J(e,s,t,o){const a=t/2;return`<g class="stone">
    <rect x="${e-a}" y="${s-7}" width="${t}" height="8" rx="4" />
    <rect x="${e-a+5}" y="${s-o}" width="6" height="${o-7}" />
    <rect x="${e+a-11}" y="${s-o}" width="6" height="${o-7}" />
  </g>${te(e,s-o,t*.9,o*.7)}`}function ge(e=0,s=18,t={x:0,y:0,w:1600,h:900}){let o=e*9301+49297;const a=()=>(o=(o*9301+49297)%233280)/233280;return`<g class="motes">${Array.from({length:s},()=>{const i=t.x+a()*t.w,l=t.y+a()*t.h,c=2+a()*2.6,h=(a()*9).toFixed(2),u=(7+a()*7).toFixed(2);return`<circle cx="${i}" cy="${l}" r="${c}" style="animation-delay:${h}s; animation-duration:${u}s" />`}).join("")}</g>`}function be(e,s,t,o,a=2.6){const i=e+t/2;return`<path class="light-shaft" d="M ${e} ${s} L ${e+t} ${s}
    L ${i+t*a/2} ${s+o} L ${i-t*a/2} ${s+o} Z" />`}function Xe(){return`
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
</defs>`}const M={floorY:420,taraX:60,wallX:-1090,doorX:390};function Ue(){const{floorY:e}=M;return`
<g class="room">
  <!-- back wall and floor -->
  <rect class="room-wall" x="-1180" y="-620" width="1700" height="${e+620}" />
  <rect class="room-floor" x="-1180" y="${e}" width="1700" height="520" />
  <rect class="room-skirting" x="-1180" y="${e-16}" width="1700" height="20" />

  <!-- wall niches -->
  <g class="room-niche">
    ${me(-1020,40,130,300,"niche")}
    ${me(-840,40,130,300,"niche")}
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
  ${ge(21,8,{x:-900,y:-400,w:1300,h:800})}
</g>`}const A={x0:560,x1:3180,floorY:M.floorY,centreX:1840,askX:1760};function Be(e,s){return`
<g class="fountain">
  <ellipse class="water-pool" cx="${e}" cy="${s}" rx="260" ry="66" />
  <path class="basin" d="M ${e-270} ${s-6} Q ${e} ${s+74} ${e+270} ${s-6}
    L ${e+250} ${s-40} L ${e-250} ${s-40} Z" />
  <rect class="basin" x="${e-34}" y="${s-210}" width="68" height="175" rx="16" />
  <ellipse class="basin-top" cx="${e}" cy="${s-212}" rx="132" ry="32" />
  <ellipse class="water-top" cx="${e}" cy="${s-216}" rx="112" ry="24" />
  <g class="jets">
    ${[-86,-44,0,44,86].map((t,o)=>`
      <path class="jet" style="animation-delay:${(o*.23).toFixed(2)}s"
        d="M ${e+t} ${s-226} Q ${e+t*1.5} ${s-150} ${e+t*1.9} ${s-46}" />`).join("")}
  </g>
  <g class="ripples">
    <ellipse class="rp r1" cx="${e}" cy="${s+6}" rx="60" ry="16" />
    <ellipse class="rp r2" cx="${e}" cy="${s+6}" rx="60" ry="16" />
    <ellipse class="rp r3" cx="${e}" cy="${s+6}" rx="60" ry="16" />
  </g>
</g>`}function ee(e,s,t=1){return`
<g class="plant" transform="translate(${e} ${s}) scale(${t})">
  <path class="pot" d="M -52 0 L 52 0 L 38 92 L -38 92 Z" />
  <rect class="pot-rim" x="-60" y="-16" width="120" height="22" rx="9" />
  <g class="fronds">
    <path class="frond" d="M 0 -10 C -70 -40 -96 -120 -58 -176 C -30 -126 -14 -64 0 -10 Z" />
    <path class="frond" d="M 0 -10 C 64 -46 92 -126 52 -180 C 26 -126 12 -62 0 -10 Z" />
    <path class="frond" d="M 0 -10 C -26 -86 -8 -166 20 -200 C 24 -136 12 -66 0 -10 Z" />
  </g>
</g>`}function ce(e,s,t,o=0){return`
<g class="court-lantern" style="animation-delay:${o}s">
  <line class="chain" x1="${e}" y1="${s}" x2="${e}" y2="${t}" />
  <path class="lantern-shell" d="M ${e-40} ${t} L ${e+40} ${t}
    L ${e+26} ${t+84} L ${e-26} ${t+84} Z" />
  <rect class="lantern-cap" x="${e-46}" y="${t-14}" width="92" height="18" rx="7" />
  <circle class="lantern-glow" cx="${e}" cy="${t+40}" r="26" />
</g>`}function De(){const{x0:e,x1:s,floorY:t,centreX:o}=A,a=-760;return`
<g class="courtyard">
  <!-- open sky above the courtyard -->
  <rect class="court-sky" x="${e}" y="-1180" width="${s-e}" height="${-a+1180-0}" />
  <g class="court-stars">
    ${[[820,-1040],[1180,-930],[1520,-1090],[1980,-960],[2420,-1050],[2760,-900],[1340,-1150],[2180,-1130],[2960,-1e3]].map(([i,l],c)=>`<circle class="${c%3?"still":""}" cx="${i}" cy="${l}" r="${c%2?6:8}" style="animation-delay:${c*.7}s" />`).join("")}
  </g>
  <circle class="court-moon" cx="2560" cy="-1010" r="96" />

  <!-- back wall, gallery and arcade -->
  <rect class="court-wall" x="${e}" y="${a}" width="${s-e}" height="${t-a}" />
  <rect class="court-band" x="${e}" y="${a}" width="${s-e}" height="34" />

  <!-- upper balconies -->
  <g class="balconies">
    ${[900,1500,2100,2700].map((i,l)=>`
      <g class="balcony">
        <rect class="balcony-floor" x="${i-130}" y="${a+300}" width="260" height="26" rx="8" />
        <rect class="balcony-rail"  x="${i-124}" y="${a+236}" width="248" height="16" rx="7" />
        ${[0,1,2,3,4].map(c=>`<rect class="baluster" x="${i-112+c*54}" y="${a+250}" width="13" height="52" rx="5" />`).join("")}
        <path class="balcony-arch" d="${le(i-96,a+60,192,178)}" />
        <g class="court-curtain" style="animation-delay:${l*.8}s">
          <path d="M ${i-92} ${a+64} L ${i-30} ${a+64} C ${i-38} ${a+140} ${i-34} ${a+200} ${i-26} ${a+236} L ${i-92} ${a+238} Z" />
        </g>
      </g>`).join("")}
  </g>

  <!-- ground-level arcade -->
  <g class="court-arcade">
    ${[760,1180,2500,2920].map(i=>`
      <path class="court-niche" d="${le(i-110,t-430,220,430)}" />`).join("")}
    ${ne(970,t-470,t,46)}
    ${ne(2710,t-470,t,46)}
  </g>

  <!-- moonlight falling into the open court -->
  ${be(1420,a+40,300,t-a-40,1.9)}
  ${be(2260,a+40,240,t-a-40,1.7)}

  <!-- lanterns -->
  ${ce(1300,a+40,-190,0)}
  ${ce(2380,a+40,-250,1.1)}
  ${ce(1820,a+40,-330,.55)}

  <!-- floor -->
  <rect class="court-floor" x="${e}" y="${t}" width="${s-e}" height="560" />
  <g class="court-tiles">
    ${Array.from({length:13},(i,l)=>`<rect x="${e+l*200}" y="${t}" width="5" height="560" />`).join("")}
    ${Array.from({length:4},(i,l)=>`<rect x="${e}" y="${t+90+l*120}" width="${s-e}" height="5" />`).join("")}
  </g>
  <rect class="court-step" x="${e}" y="${t-14}" width="${s-e}" height="18" rx="6" />

  ${Be(o,t-30)}

  ${ee(760,t,1)}
  ${ee(2980,t,1.1)}
  ${ee(1140,t,.78)}
  ${ee(2620,t,.86)}

  ${ge(41,12,{x:e,y:-760,w:s-e,h:1200})}
</g>`}function Ye(){return`
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
</g>`}function _e(){return`
<g class="ask-speech-anchor">
<g class="ask-speech">
  <ellipse class="speech-aura" cx="0" cy="0" rx="420" ry="118" />
  <text class="speech-text" x="0" y="10" text-anchor="middle">Where is my secret?</text>
</g>
</g>`}function Ve(){return`
<g class="q-motes">
  ${[[-230,30,0],[-90,-40,.35],[70,10,.7],[220,-30,1.05],[-10,70,1.4],[160,80,1.75]].map(([s,t,o])=>`
    <text class="q" x="${s}" y="${t}" text-anchor="middle" style="animation-delay:${o}s">?</text>`).join("")}
</g>`}const Y={x0:-1560,x1:3520,roofY:-1320,baseY:1010};function Ke(){return`
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
</g>`}function Je(){const{x0:e,x1:s,roofY:t,baseY:o}=Y;return`
<g class="shell">
  <path class="shell-roof" d="M ${e-140} ${t+250} L ${(e+s)/2} ${t-210}
    L ${s+140} ${t+250} L ${s+140} ${t+330} L ${e-140} ${t+330} Z" />
  <rect class="shell-wall" x="${e}" y="${t+300}" width="220" height="${o-t-300}" />
  <rect class="shell-wall" x="${s-220}" y="${t+300}" width="220" height="${o-t-300}" />
  <rect class="shell-band" x="${e-60}" y="${t+300}" width="${s-e+120}" height="46" />
  <rect class="shell-base" x="${e-200}" y="${o}" width="${s-e+400}" height="150" />
  <g class="shell-windows">
    ${[-1460,-1380,3380,3440].map((a,i)=>`<rect class="shell-lit" x="${a}" y="${t+520+i%2*190}" width="52" height="104" rx="24"
             style="animation-delay:${i*.9}s" />`).join("")}
  </g>
</g>`}function es(){const e={x0:-1200,x1:540,y0:-640,y1:M.floorY+120},s={x0:A.x0-20,x1:A.x1+20,y0:-800,y1:A.floorY+200},t={x0:Y.x0-80,x1:Y.x1+80,y0:Y.roofY-160,y1:Y.baseY+90};return`
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
    <path class="lg-link" d="M ${e.x1} ${M.floorY-200} L ${s.x0} ${M.floorY-200}" />
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
</g>`}function U(e,s,t,o,a=""){return`
<g class="mlabel mlabel-${e}" transform="translate(${t} ${o})">
  <g class="ml-motes">
    ${[[-150,-30,0],[140,-44,.6],[-60,46,1.2],[110,40,1.8],[10,-62,.9]].map(([l,c,h])=>`<circle r="7" style="--mx:${l}px; --my:${c}px; animation-delay:${h}s" />`).join("")}
  </g>
  <path class="ml-rule" d="M -172 52 Q 0 74 172 52" />
  <text class="ml-text" x="0" y="0" text-anchor="middle">${s}</text>
  ${a?`<text class="ml-note" x="0" y="112" text-anchor="middle">${a}</text>`:""}
</g>`}function ss(){return`
<g class="perch-stand">
  <rect class="perch-post" x="-9" y="-250" width="18" height="250" rx="9" />
  <rect class="perch-bar"  x="-92" y="-262" width="184" height="16" rx="8" />
  <ellipse class="perch-foot" cx="0" cy="4" rx="74" ry="17" />
  <g class="perch-bird" transform="translate(0 -262) scale(0.62)">
    ${Pe()}
  </g>
</g>`}function ts(){return`
<g class="error-spell">
  <g class="err-smoke">
    ${[[-300,0,0],[-120,-40,.5],[80,20,1],[260,-30,1.5],[-40,60,.8],[190,70,1.9]].map(([e,s,t])=>`<ellipse cx="${e}" cy="${s}" rx="150" ry="70" style="animation-delay:${t}s" />`).join("")}
  </g>
  <g class="err-shards">
    ${[[-380,-90],[-190,110],[40,-130],[250,90],[420,-60],[-60,140]].map(([e,s],t)=>`<path d="M ${e} ${s} l 26 -46 l 20 52 z" style="animation-delay:${t*.14}s" />`).join("")}
  </g>
  <text class="err-text" x="0" y="0" text-anchor="middle">UnboundLocalError</text>
  <path class="err-crack" d="M -430 46 L -300 20 L -170 58 L -30 14 L 110 56 L 250 18 L 430 50" />
</g>`}function as(){return`
<g class="trails">
  <path class="read-out"   pathLength="100" d="M -360 -260 C 260 -780 1080 -1120 1800 -1160" />
  <path class="read-local" pathLength="100" d="M -360 -250 C -430 -300 -500 -320 -560 -308" />
  <path class="read-blocked" pathLength="100" d="M -360 -260 C -250 -300 -150 -330 -40 -344" />
  <g class="block-wall">
    <path class="bw-line" d="M 20 -520 L 20 -60" />
    <g class="bw-sparks">
      ${[-380,-280,-180].map((e,s)=>`<circle cx="20" cy="${e}" r="12" style="animation-delay:${s*.18}s" />`).join("")}
    </g>
  </g>
</g>`}const n={x:1600,y:300,w:380,h:520,scale:.225},E=980,ve=(()=>{let e=12345;const s=()=>(e=(e*9301+49297)%233280)/233280;return Array.from({length:44},()=>({x:-1400+s()*5e3,y:-1500+s()*1900,r:1.6+s()*3.4,d:(s()*6).toFixed(2),layer:s()<.4?"far":"near"}))})();function se(e,s,t,o,a){return`<g class="cloud" style="animation-delay:${o}s; animation-duration:${a}s"
     transform="translate(${e} ${s}) scale(${t})">
    <ellipse cx="0" cy="0" rx="200" ry="40" />
    <ellipse cx="-110" cy="14" rx="120" ry="30" />
    <ellipse cx="116" cy="16" rx="140" ry="34" />
    <ellipse cx="20" cy="-24" rx="96" ry="32" />
  </g>`}function de(e,s,t,o){return`<g class="flagpole-g">
    <rect class="flagpole" x="${e-3}" y="${s-t}" width="6" height="${t+26}" rx="3" />
    <circle class="flagpole" cx="${e}" cy="${s-t-5}" r="6" />
    <path class="pennant" style="animation-delay:${o}s"
      d="M ${e+3} ${s-t+2} L ${e+44} ${s-t+14} L ${e+3} ${s-t+26} Z" />
  </g>`}function is(){return`
<g class="sky-group">
  <rect x="-2600" y="-1900" width="8000" height="3400" fill="url(#nightSky)" />
  <circle cx="620" cy="-960" r="430" fill="url(#moonGlow)" />
  <circle class="moon" cx="620" cy="-960" r="104" />
  <circle class="moon-crater" cx="586" cy="-990" r="18" />
  <circle class="moon-crater" cx="650" cy="-930" r="12" />
  <circle class="moon-crater" cx="638" cy="-1004" r="9" />

  <g class="stars far">
    ${ve.filter(e=>e.layer==="far").map((e,s)=>`<circle class="${s%2?"still":""}" cx="${e.x}" cy="${e.y}" r="${e.r*.7}" style="animation-delay:${e.d}s" />`).join("")}
  </g>
  <g class="stars near">
    ${ve.filter(e=>e.layer==="near").map((e,s)=>`<circle class="${s%2?"still":""}" cx="${e.x}" cy="${e.y}" r="${e.r}" style="animation-delay:${e.d}s" />`).join("")}
  </g>

  <g class="clouds">
    ${se(-900,-1180,1.1,0,96)}
    ${se(-1700,-760,.8,16,122)}
    ${se(-500,-420,1.35,40,148)}
    ${se(-2100,-1420,.9,62,134)}
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
  <rect class="stone" x="880" y="700" width="200" height="${E-700}" rx="6" />
  ${J(980,700,74,58)}
  <rect class="stone" x="2120" y="700" width="200" height="${E-700}" rx="6" />
  ${J(2220,700,74,58)}
  ${K(906,800,2,56,150,44,"lit")}
  ${K(2146,800,2,56,150,44,"lit")}

  <!-- flanking towers -->
  <rect class="stone" x="1120" y="420" width="112" height="${E-420}" rx="6" />
  ${te(1176,420,132,108)}
  <rect class="stone" x="1968" y="420" width="112" height="${E-420}" rx="6" />
  ${te(2024,420,132,108)}
  ${de(1176,306,62,0)}
  ${de(2024,306,62,1.3)}

  <!-- great hall -->
  <rect class="stone" x="1220" y="520" width="760" height="${E-520}" rx="8" />
  <rect class="stone-band" x="1258" y="486" width="684" height="42" rx="14" />
  ${te(1600,486,330,260)}
  ${de(1600,180,74,.7)}
  ${J(1320,486,66,54)}
  ${J(1880,486,66,54)}
  ${ne(1300,640,E)}
  ${ne(1900,640,E)}

  <!-- ordinary lit windows, staggered so the palace breathes -->
  ${K(1254,700,2,58,160,52,"lit")}
  ${K(1830,700,2,58,160,52,"lit")}
  ${ae(1148,560,48,120,2.1)}
  ${ae(1996,560,48,120,.8)}
  ${ae(1560,180,74,130,1.6)}

  <!-- plinth -->
  <rect class="plinth" x="820" y="${E-28}" width="1560" height="40" rx="8" />
</g>

<rect class="ground" x="-2600" y="${E}" width="8000" height="900" />

<!-- ─────────── Tara's window: the way in ─────────── -->
<g class="hero-window">
  <!-- warm light spilling out before we can see inside -->
  <ellipse class="hero-glow" cx="${n.x}" cy="${n.y}" rx="520" ry="560" />

  <!-- the room, mounted inside the opening and clipped to it -->
  <g class="portal" clip-path="url(#heroClip)">
    <g transform="translate(${n.x} ${n.y}) scale(${n.scale})">
      <!-- Behind everything, and only shown once the camera clears the roof. -->
      <g class="outer-world">
        ${Ke()}
        ${Je()}
      </g>
      ${De()}
      ${Ue()}
      <g class="tara-slot"></g>
      ${es()}
      <g class="magic-labels">
        ${U("local","Local",-330,-900,"inside one function")}
        ${U("enclosing","Enclosing",1870,-1120,"a function written inside another")}
        ${U("global","Global",980,-1760,"the whole file")}
        ${U("builtin","Built-in",980,-2520,"names Python already knows")}
      </g>
      ${as()}
      ${ss()}
      ${ts()}
      <g class="shadow-tag">
        ${U("shadow","shadowing",-300,-900)}
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
        ${Ye()}
        ${_e()}
        ${Ve()}
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

${ge(3,14,{x:700,y:200,w:1800,h:800})}`}function os(){return`<clipPath id="heroClip">
    <path d="M ${n.x-n.w/2} ${n.y+n.h/2+20}
      L ${n.x-n.w/2} ${n.y-70}
      Q ${n.x-n.w/2} ${n.y-n.h/2-20} ${n.x} ${n.y-n.h/2-44}
      Q ${n.x+n.w/2} ${n.y-n.h/2-20} ${n.x+n.w/2} ${n.y-70}
      L ${n.x+n.w/2} ${n.y+n.h/2+20} Z" />
  </clipPath>`}function ke(){return`
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
</g>`}function Se(e){const s=Math.max(190,e.length*30+84);return`
<g class="spark-word" aria-hidden="true">
  <ellipse class="sw-aura" cx="0" cy="0" rx="${s*.78}" ry="74" />
  <rect class="sw-plate" x="${-s/2}" y="-38" width="${s}" height="76" rx="38" />
  <text class="sw-text" x="0" y="14" text-anchor="middle">${e}</text>
  <g class="sw-motes">
    ${[[-s*.4,-28,0],[s*.34,-34,.8],[-s*.2,36,1.6],[s*.44,26,2.3],[6,-52,1.1],[-s*.46,14,2.9]].map(([t,o,a])=>`<circle cx="${t}" cy="${o}" r="3.6" style="animation-delay:${a}s" />`).join("")}
  </g>
</g>`}function rs(e=26){let s=777;const t=()=>(s=(s*9301+49297)%233280)/233280;return`<g class="title-motes">${Array.from({length:e},()=>{const o=t()*Math.PI*2,a=300+t()*620;return`<circle r="${2+t()*3.2}"
      style="--fx:${(Math.cos(o)*a).toFixed(1)}px; --fy:${(Math.sin(o)*a*.6).toFixed(1)}px;
             animation-delay:${(t()*1.1).toFixed(2)}s" />`}).join("")}</g>`}const p=(e,s)=>({x:n.x+e*n.scale,y:n.y+s*n.scale});function _(e,s){const t=e.root.querySelector(".stage");t&&t.classList.toggle("is-deciding",s),e.root.classList.toggle("is-asking",s);const o=e.root.querySelector(".tara");o&&o.classList.toggle("is-attending",s)}async function Q(e,s="curious",{nod:t=!1,ms:o=900}={}){const a=e.root.querySelector(".tara");e.tara?.express?.(s),t&&a&&a.classList.add("mithu-alert"),await new Promise(i=>setTimeout(i,F?0:o)),t&&a&&a.classList.remove("mithu-alert")}function R(e,{question:s,options:t,kind:o="choice"}={}){const a=e.root.querySelector(".interact"),i=O();return new Promise(l=>{const c=document.createElement("div");c.className=`ask ask-${o}`,c.setAttribute("role","group"),c.setAttribute("aria-label",s);const h=document.createElement("p");h.className="ask-q",h.textContent=s,c.appendChild(h);const u=document.createElement("div");u.className="ask-options",c.appendChild(u);let m=!1;const w=()=>{m||(m=!0,_(e,!1),b(),c.classList.add("is-going"),setTimeout(()=>c.remove(),F?0:420))},x=k=>{m||([...u.children].forEach(S=>S.classList.toggle("is-chosen",S.dataset.value===String(k.value))),w(),i===O()&&l(k.value))};t.forEach((k,S)=>{const $=document.createElement("button");$.type="button",$.className="choice",$.dataset.value=String(k.value),$.innerHTML=`<span class="choice-label"></span>${k.note?'<span class="choice-note"></span>':""}`,$.querySelector(".choice-label").textContent=k.label,k.note&&($.querySelector(".choice-note").textContent=k.note),$.addEventListener("click",()=>x(k)),u.appendChild($),S===0&&requestAnimationFrame(()=>$.focus({preventScroll:!0}))});const b=we(()=>{m=!0,c.remove()});_(e,!0),a.appendChild(c),requestAnimationFrame(()=>c.classList.add("is-open"))})}function ls(e,{again:s="See it again",go:t="Continue"}={}){return R(e,{kind:"after",question:"",options:[{label:t,value:"continue"},{label:s,value:"again"}]})}async function N(e,s,t=2600){const o=e.root.querySelector(".interact"),a=O(),i=document.createElement("p");i.className="ask-said",i.setAttribute("role","status"),i.textContent=s,o.appendChild(i);const l=we(()=>i.remove());requestAnimationFrame(()=>i.classList.add("is-open")),await new Promise(c=>setTimeout(c,F?0:t)),l(),i.classList.remove("is-open"),setTimeout(()=>i.remove(),F?0:420),a!==O()&&await new Promise(()=>{})}async function ye(e,s){const{code:t=[],question:o,options:a,answer:i,hints:l=[],feedback:c={},reveal:h}=s,u=e.root.querySelector(".interact"),m=O();let w=0,x=!1;for(;;){const b=await new Promise(S=>{const $=document.createElement("div");if($.className="ask ask-predict",$.setAttribute("role","group"),$.setAttribute("aria-label",o),t.length){const q=document.createElement("pre");q.className="ask-code",q.textContent=t.join(`
`),$.appendChild(q)}const C=document.createElement("p");C.className="ask-q",C.textContent=o,$.appendChild(C);const I=document.createElement("div");I.className="ask-options",$.appendChild(I);const G=document.createElement("div");G.className="hint-rail",$.appendChild(G);let L=0,f=null;l.length&&(f=document.createElement("button"),f.type="button",f.className="hintbtn",f.innerHTML='<span aria-hidden="true">💡</span> Hint',f.addEventListener("click",()=>{x=!0;const q=document.createElement("p");q.className="hint",q.setAttribute("role","status"),q.textContent=l[L],G.appendChild(q),requestAnimationFrame(()=>q.classList.add("is-open")),L+=1,L>=l.length&&(f.disabled=!0)}),$.appendChild(f));let H=!1;const Re=q=>{H||(H=!0,_(e,!1),Fe(),[...I.children].forEach(V=>V.classList.toggle("is-chosen",V.dataset.value===String(q.value))),$.classList.add("is-going"),setTimeout(()=>$.remove(),F?0:420),m===O()&&S(q.value))};a.forEach((q,V)=>{const W=document.createElement("button");W.type="button",W.className="choice choice-tight",W.dataset.value=String(q.value),W.textContent=q.label,W.addEventListener("click",()=>Re(q)),I.appendChild(W),V===0&&requestAnimationFrame(()=>W.focus({preventScroll:!0}))});const Fe=we(()=>{H=!0,_(e,!1),$.remove()});_(e,!0),u.appendChild($),requestAnimationFrame(()=>$.classList.add("is-open"))});if(w+=1,b===i)return await N(e,c[b]||"That is it.",2400),{value:b,correct:!0,attempts:w,usedHint:x};if(await N(e,c[b]||"Not quite — look again at where it was made.",2600),w>=2)return h&&await N(e,h,3e3),{value:b,correct:!1,attempts:w,usedHint:x}}}const T={readyToWhisper:{question:"Tara has a secret word she wants to try.",options:[{value:"go",label:"Let her whisper it",note:"and see where it goes"}]},whatToDo:{question:"Tara has whispered a secret. What should she do?",options:[{value:"outside",label:"Take it outside",note:"see if it follows"},{value:"stay",label:"Keep it in the room",note:"say it again"}]},whereDidItGo:{question:"Her secret did not answer out here. Where is it?",options:[{value:"room",label:"Still in her room"},{value:"followed",label:"It followed her out"},{value:"gone",label:"It disappeared"}],answer:"room",feedback:{room:"Exactly. It never left the room it was made in.",followed:"Almost — that is what it feels like. Watch where it actually is.",gone:"Not gone. Look back at the room she came from."}},shadowPredict:{code:['name = "Mithu"',"","def room():",'    name = "Tara"',"    print(name)","","room()"],question:"What does this print?",options:[{value:"Tara",label:"Tara"},{value:"Mithu",label:"Mithu"},{value:"error",label:"An error"}],answer:"Tara",hints:["Look at where each name was made.","Is Tara inside the room, or outside it, when she reads it?"],feedback:{Tara:"Yes. Inside the room, her own name is the nearer one.",Mithu:"Almost. The palace still says Mithu — but Tara made her own copy inside.",error:"No error here. Both names exist; the question is which one is nearer."},reveal:"It prints Tara. The name made inside the room hides the one outside it."},errorPredict:{code:['name = "Mithu"',"","def room():","    print(name)",'    name = "Tara"',"","room()"],question:"And this one?",options:[{value:"error",label:"An error"},{value:"Mithu",label:"Mithu"},{value:"Tara",label:"Tara"}],answer:"error",hints:["Python reads the whole room before it runs a single line of it.","The room assigns to name somewhere. What does that make the name, everywhere in the room?"],feedback:{error:"Yes — UnboundLocalError. The room owns the name before it has a value.",Mithu:"That is the trap. Because the room assigns to name lower down, it never looks outside at all.",Tara:"Not yet — that line has not run when print is reached."},reveal:"It raises UnboundLocalError: the room claimed name the moment it was written, so there is nothing outside to fall back to."},lookNext:{question:"It is not in her room. Where should Python look next?",options:[{value:"enclosing",label:"The space just outside",note:"one step out"},{value:"global",label:"Straight to the palace"},{value:"stop",label:"Stop looking"}],answer:"enclosing",feedback:{enclosing:"Yes — one step out at a time, never a jump.",global:"It IS in the palace. But Python does not skip — it checks the space just outside first.",stop:"Not yet. A name missing from the room is normal; Python keeps looking outward."}},whoMadePrint:{question:"And print — who made that one?",options:[{value:"python",label:"Nobody. Python already knew it"},{value:"tara",label:"Tara did"},{value:"palace",label:"The palace holds it"}],answer:"python",feedback:{python:"Yes. It was never written here. It is built in.",tara:"She never wrote it — and it worked the very first time she used it.",palace:"Not the palace either. Search the whole file and print is nowhere in it."}},changeThePalace:{question:"She wants to change the palace’s name, not make another copy. What does she need?",options:[{value:"declare",label:"Tell Python she means the palace’s one"},{value:"louder",label:"Say it louder"},{value:"again",label:"Write it again"}],answer:"declare",feedback:{declare:"Exactly. That is what the word global does.",louder:"Volume is not the problem — the room keeps making its own copy however loudly she says it.",again:"Writing it again in her room just makes the same local copy a second time."}},whichReach:{code:["def palace():",'    name = "Mithu"',"","    def room():","        ???  name",'        name = "Tara"'],question:"She means the room around her, not the whole palace. Which word?",options:[{value:"nonlocal",label:"nonlocal"},{value:"global",label:"global"}],answer:"nonlocal",hints:["One of these reaches all the way out to the file. The other stops one step out."],feedback:{nonlocal:"Yes. nonlocal reaches the enclosing room and stops there.",global:"global would skip past the surrounding room and rebind the name at the very top of the file."},reveal:"nonlocal — it reaches the enclosing function, never the module."}},Te={x:26,y:176},B=M.wallX;async function ns(e){const{camera:s,tara:t,spark:o,hers:a,ui:i,root:l}=e,c=l.querySelector(".room"),h=l.querySelector(".wall-ripple");i.classList.contains("show-title")&&(i.classList.add("title-out"),await r(900),i.classList.remove("show-title","show-sub","title-out")),o.moveTo(470,-330,{duration:1500,easing:y.inOut}),l.querySelector(".spark-slot").classList.add("is-dimmed"),await s.to({...p(t.x-30,150),zoom:s.fitRoom(1569),duration:1400}),t.express("curious"),await r(500),await s.to({...p(t.x+10,70),zoom:s.fitRoom(1067),duration:1400}),await r(400),await R(e,T.readyToWhisper),t.setPose("whisper"),await r(500),a.at(t.x+Te.x,t.y-Te.y).setScale(.06),a.el.classList.add("is-live"),await r(300),await a.scaleTo(1,{duration:1e3,easing:y.back}),a.el.classList.add("is-word"),await r(400),t.setPose("idle"),t.express("happy"),await P(a.moveTo(t.x+120,t.y-330,{duration:1400,easing:y.out}),s.to({...p(t.x+60,-60),zoom:s.fitRoom(1356),duration:1400})),await r(400),t.express("curious"),s.follow(a,{map:(m,w)=>p(m,w),offsetY:60,lag:.035}),await a.moveTo(-180,-400,{duration:1400,easing:y.inOut}),await a.moveTo(-430,-250,{duration:1400,easing:y.inOut}),await P(t.walkTo(-320,{speed:200}),a.moveTo(-700,-320,{duration:1400,easing:y.inOut})),await a.moveTo(B,-300,{duration:1400,easing:y.in}),h.setAttribute("transform",`translate(${B-20} -300)`),h.classList.remove("is-hit"),h.getBoundingClientRect(),h.classList.add("is-hit"),a.el.classList.add("is-bouncing"),s.shake(9),await a.moveTo(B+250,-350,{duration:700,easing:y.out}),a.el.classList.remove("is-bouncing"),s.unfollow(),await s.to({...p(-520,-190),zoom:s.fitRoom(1455),duration:1200}),t.express("surprised"),await r(500),t.express("curious"),s.follow(a,{map:(m,w)=>p(m,w),offsetY:40,lag:.03}),await a.moveTo(B+30,-270,{duration:1400,easing:y.inOut}),h.classList.remove("is-hit"),h.getBoundingClientRect(),h.setAttribute("transform",`translate(${B-10} -270)`),h.classList.add("is-hit"),a.el.classList.add("is-straining"),s.shake(5),await r(600),a.el.classList.add("is-fading"),await r(900),a.el.classList.remove("is-live","is-word","is-straining","is-fading"),s.unfollow(),await s.to({...p(-560,-60),zoom:s.fitRoom(1379),duration:1400}),t.express("confused"),await r(600),await t.walkTo(-760,{speed:150}),await t.face("left"),t.setPose("touch"),c.classList.add("wall-felt"),await r(1e3),l.querySelector(".tara").classList.add("mithu-alert"),await r(700),t.setPose("idle"),await t.face("right"),t.express("curious"),await s.to({...p(-420,-40),zoom:s.fitRoom(1905),duration:1400}),await r(400),l.querySelector(".room-door").classList.add("is-noticed"),await r(800),i.dataset.line="far",i.classList.add("show-line"),await r(4e3),i.classList.remove("show-line"),c.classList.remove("wall-felt"),l.querySelector(".tara").classList.remove("mithu-alert"),await r(300),e.journey.at("local"),await e.journey.flash(1800);let u=await R(e,T.whatToDo);for(await Q(e,u==="outside"?"curious":"neutral",{ms:700});u==="stay";)await s.to({...p(t.x-20,60),zoom:s.fitRoom(1330),duration:1200}),t.setPose("whisper"),await r(700),t.setPose("idle"),a.el.classList.add("is-beckoning"),await r(900),a.el.classList.remove("is-beckoning"),c.classList.add("wall-felt"),await r(700),c.classList.remove("wall-felt"),t.express("confused"),await r(900),u=await R(e,{question:"The same wall, every time. Should she try outside?",options:[{value:"outside",label:"Take it outside",note:"find out why"},{value:"stay",label:"Try once more"}]});l.querySelector(".room-door").classList.remove("is-noticed"),await r(300)}async function cs(e){const{camera:s,tara:t,hers:o,ui:a,root:i}=e,l=i.querySelector(".room-door"),c=i.querySelector(".ask-prompt"),h=i.querySelector(".ask-anchor"),u=i.querySelector(".ask-speech"),m=i.querySelector(".ask-speech-anchor"),w=i.querySelector(".q-motes");o.at(-620,-240).setScale(1),o.el.classList.add("is-live","is-word","is-homebound"),await r(400),i.querySelector(".tara").classList.add("mithu-alert"),await r(500),t.express("curious"),await t.face("right"),await r(300),l.classList.add("is-open"),await r(500),s.follow(t,{map:(b,k)=>p(b,k),offsetY:-150,lag:.028}),await t.walkTo(M.doorX+40,{speed:210}),await r(400),await t.walkTo(A.x0+300,{speed:200}),s.unfollow(),await s.to({...p(A.centreX-260,-120),zoom:s.fitRoom(3077),duration:2300,easing:y.inOut}),t.express("surprised"),await r(500),await t.face("left"),await r(300),await t.face("right"),t.express("curious"),await r(400),h.setAttribute("transform",`translate(${A.askX} -470)`),await s.to({...p(A.askX,-250),zoom:s.fitRoom(2150),duration:1600,easing:y.inOut}),await t.face("right"),c.classList.add("is-offered"),await new Promise(b=>{const k=setTimeout(()=>c.classList.add("is-urging"),7e3),S=()=>{clearTimeout(k),c.classList.remove("is-urging"),c.removeEventListener("click",S),c.removeEventListener("keydown",$),b()},$=C=>{(C.key==="Enter"||C.key===" ")&&(C.preventDefault(),S())};c.addEventListener("click",S),c.addEventListener("keydown",$)}),c.classList.remove("is-offered"),c.classList.add("is-taken"),await P(t.walkTo(A.askX,{speed:190}),s.to({...p(A.askX+60,-180),zoom:s.fitRoom(2667),duration:1700})),await r(300),await t.face("left"),await r(300),t.setPose("reach"),t.express("curious"),m.setAttribute("transform",`translate(${A.askX+30} -330)`),u.classList.add("is-spoken"),await r(1100),t.setPose("idle"),u.classList.remove("is-spoken"),w.setAttribute("transform",`translate(${A.askX+40} -420)`),w.classList.add("is-asking"),i.querySelector(".courtyard").classList.add("is-hushed"),await r(1100),w.classList.remove("is-asking"),t.express("confused"),i.querySelector(".tara").classList.add("mithu-alert"),await r(700);const x=await R(e,T.whereDidItGo);await Q(e,x===T.whereDidItGo.answer?"happy":"confused",{nod:!0,ms:800}),await N(e,T.whereDidItGo.feedback[x],2400),await t.face("left"),await r(300),await s.to({...p(700,-180),zoom:s.fitRoom(4706),duration:2300,easing:y.inOut}),o.el.classList.add("is-beckoning"),await r(1100),a.dataset.line="born",a.classList.add("show-line"),await r(4800),a.classList.remove("show-line"),await r(400),e.journey.done("local").at("enclosing"),i.querySelector(".tara").classList.remove("mithu-alert"),i.querySelector(".courtyard").classList.remove("is-hushed"),o.el.classList.remove("is-beckoning")}const ds=[{id:"local",cls:"lg-local"},{id:"enclosing",cls:"lg-enclosing"},{id:"global",cls:"lg-global"},{id:"builtin",cls:"lg-builtin"}];async function hs(e){const{camera:s,tara:t,code:o,ui:a,root:i}=e,l=i.querySelector(".layer-glows"),c=i.querySelector(".magic-labels");t.setPose("idle").express("curious"),await s.to({...p(900,-420),zoom:s.zoomToFitWidth(1080),duration:2300,easing:y.inOut}),await r(300),i.querySelector(".portal").classList.add("show-shell"),await s.to({...p(980,-940),zoom:s.zoomToFitWidth(1760),duration:2600,easing:y.inOut}),await r(500),l.classList.add("is-live");for(const h of ds)i.querySelector(`.${h.cls}`).classList.add("is-lit"),await r(400),c.querySelector(`.mlabel-${h.id}`).classList.add("is-named"),await r(900);await r(500),a.dataset.line="names",a.classList.add("show-line"),await r(3600),a.classList.remove("show-line"),a.dataset.line="legb",a.classList.add("show-line"),await r(4600),a.classList.remove("show-line"),o.dock(),await o.write(['name = "Mithu"'],{stagger:0}),o.note(0,"Global — out in the open palace"),await r(1600)}const us=[{cls:"lg-local",found:!1,note:"not in room() — look outward"},{cls:"lg-enclosing",found:!1,note:"not in the enclosing space either"},{cls:"lg-global",found:!0,note:"found it — the palace name"}];async function ms(e){const{camera:s,tara:t,spark:o,hers:a,code:i,ui:l,root:c}=e,h=c.querySelector(".layer-glows"),u=c.querySelector(".tara");c.querySelectorAll(".mlabel").forEach(w=>w.classList.remove("is-named")),c.querySelectorAll(".lg").forEach(w=>w.classList.remove("is-lit")),o.setText("MITHU").at(1900,-1180).setScale(1),o.el.classList.remove("is-dimmed"),o.el.classList.add("is-live","is-word","is-outer"),await s.to({...p(760,-560),zoom:s.zoomToFitWidth(1180),duration:1700}),t.express("curious"),await r(500),u.classList.add("mithu-alert"),l.dataset.line="wider",l.classList.add("show-line"),await r(3400),l.classList.remove("show-line"),u.classList.remove("mithu-alert"),i.clearNotes(),await i.append(["","def room():","    print(name)"],{stagger:380}),i.focus(3),await r(500),u.classList.add("has-lantern"),await r(500),h.classList.add("is-live","is-searching");for(const w of us){if(w.cls==="lg-enclosing"){const b=await R(e,T.lookNext);await Q(e,b===T.lookNext.answer?"happy":"curious",{ms:700}),await N(e,T.lookNext.feedback[b],2600),e.journey.at("enclosing")}const x=c.querySelector(`.${w.cls}`);x.classList.add("is-lit","is-probing"),i.note(3,w.note),w.cls==="lg-enclosing"&&P(t.walkTo(A.centreX-200,{speed:230}),s.to({...p(900,-640),zoom:s.zoomToFitWidth(1420),duration:1800})),w.cls==="lg-global"&&s.to({...p(980,-860),zoom:s.zoomToFitWidth(1780),duration:1900}),await r(1100),w.found?(e.journey.done("enclosing").at("global"),x.classList.remove("is-probing"),x.classList.add("is-found"),o.el.classList.add("is-answering"),i.mark(3,"is-ok"),t.express("happy"),s.shake(5),await r(1400)):(x.classList.remove("is-probing"),x.classList.add("is-empty"),await r(300))}await r(800),i.unmark("is-ok"),i.note(3,"and print? found in the outermost ring"),c.querySelector(".lg-builtin").classList.add("is-lit","is-found"),c.querySelector(".mlabel-builtin").classList.add("is-named"),await r(1e3),e.journey.done("global").at("builtin");const m=await R(e,T.whoMadePrint);await Q(e,m===T.whoMadePrint.answer?"happy":"surprised",{nod:!0,ms:800}),await N(e,T.whoMadePrint.feedback[m],2800),l.dataset.line="builtin",l.classList.add("show-line"),await r(4400),l.classList.remove("show-line"),c.querySelector(".mlabel-builtin").classList.remove("is-named"),c.querySelectorAll(".lg").forEach(w=>w.classList.remove("is-empty","is-found")),h.classList.remove("is-searching"),o.el.classList.remove("is-answering"),i.unfocus(),i.clearNotes()}const he={x:-560,y:-300};async function ws(e){const{camera:s,tara:t,spark:o,hers:a,code:i,ui:l,root:c}=e,h=c.querySelector(".tara");await P(t.walkTo(M.taraX-120,{speed:240}),s.to({...p(-120,-240),zoom:s.zoomToFitWidth(760),duration:2200})),h.classList.remove("has-lantern"),await t.face("right"),t.express("curious"),await r(500),t.setPose("whisper"),await r(500),a.setText("MITHU").at(he.x,he.y).setScale(.05),a.el.classList.remove("is-homebound","is-beckoning"),a.el.classList.add("is-live","is-inner"),await a.scaleTo(1,{duration:1e3,easing:y.back}),a.el.classList.add("is-word"),t.setPose("idle"),await i.retype(3,'    name = "Tara"'),i.mark(3,"is-claim"),i.note(3,"assigning MAKES a new local name"),await i.append(["    print(name)"],{stagger:0}),await r(1e3),await s.to({...p(560,-620),zoom:s.zoomToFitWidth(1500),duration:1800}),await r(800),await s.to({...p(-260,-260),zoom:s.zoomToFitWidth(820),duration:1600}),await t.walkTo(he.x+250,{speed:200}),await t.face("left"),t.setPose("reach"),await r(300),a.el.classList.add("is-touched"),s.shake(4),await a.morphTo("TARA",{duration:1100}),a.el.classList.remove("is-touched"),t.setPose("idle"),t.express("surprised"),await r(500),await s.to({...p(620,-640),zoom:s.zoomToFitWidth(1560),duration:1800}),o.el.classList.add("is-answering"),i.note(0,"untouched"),await r(1100),o.el.classList.remove("is-answering"),i.note(0,""),t.express("happy"),h.classList.add("mithu-alert"),await r(800),h.classList.remove("mithu-alert");const u=c.querySelector(".mlabel-local");u.classList.add("is-named","is-inline"),await r(1700),i.unmark("is-claim"),i.focus(3),await r(700),l.dataset.line="readassign",l.classList.add("show-line"),await r(4400),l.classList.remove("show-line"),i.unfocus();const m=await ye(e,T.shadowPredict);await Q(e,m.correct?"happy":"curious",{nod:!0,ms:800}),await s.to({...p(-160,-420),zoom:s.zoomToFitWidth(1120),duration:1800}),await r(400),c.querySelector(".reach").classList.add("show-shadow"),o.el.classList.add("is-shadowed"),a.el.classList.add("is-shadowing"),i.focus(4),i.note(4,"finds the local one; outer is hidden"),await r(1400),l.dataset.line="hides",l.classList.add("show-line"),await r(4200),l.classList.remove("show-line"),await r(500),i.unfocus(),i.clearNotes(),u.classList.remove("is-inline","is-named")}async function ps(e){const{camera:s,tara:t,spark:o,hers:a,code:i,ui:l,root:c}=e,h=c.querySelector(".tara"),u=c.querySelector(".reach");u.classList.remove("show-shadow"),o.el.classList.remove("is-shadowed"),a.el.classList.remove("is-shadowing"),await r(400),await s.to({...p(400,-620),zoom:s.zoomToFitWidth(1420),duration:1800}),await t.face("right"),t.express("curious"),await r(700),h.classList.add("mithu-alert"),l.dataset.line="speak",l.classList.add("show-line"),await r(3600),l.classList.remove("show-line"),h.classList.remove("mithu-alert");const m=await R(e,T.changeThePalace);await Q(e,m===T.changeThePalace.answer?"happy":"confused",{nod:!0,ms:800}),await N(e,T.changeThePalace.feedback[m],2800),await s.to({...p(-200,-300),zoom:s.zoomToFitWidth(880),duration:1600}),h.classList.add("has-megaphone"),await r(500),t.setPose("reach"),t.express("happy"),await r(500),await s.to({...p(700,-700),zoom:s.zoomToFitWidth(1620),duration:1700}),await i.retype(3,"    global name"),i.mark(3,"is-claim"),i.note(3,"rebinds the palace name, not a local one"),await i.append(['    name = "Tara"'],{stagger:0}),await r(800),u.classList.add("show-global"),s.shake(6),await r(1100),o.el.classList.add("is-touched"),await o.morphTo("TARA",{duration:1200}),o.el.classList.remove("is-touched"),o.el.classList.add("is-answering"),s.shake(8),await r(1100),t.setPose("idle"),o.el.classList.remove("is-answering"),u.classList.remove("show-global"),h.classList.remove("has-megaphone"),await r(500);const w=c.querySelector(".mlabel-global");w.classList.add("is-named","is-inline"),await r(1700),w.classList.remove("is-inline","is-named"),await s.to({...p(260,-420),zoom:s.zoomToFitWidth(1240),duration:1700}),h.classList.add("mithu-alert"),i.unmark("is-claim"),i.clearNotes(),await i.write(["def palace():",'    name = "Mithu"',"","    def room():","        nonlocal name",'        name = "Tara"'],{stagger:300}),i.focus(4),i.note(4,"reaches the ENCLOSING room only"),u.classList.add("show-nonlocal"),await r(1100),await ye(e,T.whichReach),l.dataset.line="nonlocal",l.classList.add("show-line"),await r(4600),l.classList.remove("show-line"),u.classList.remove("show-nonlocal"),h.classList.remove("mithu-alert"),i.unfocus(),i.clearNotes(),t.express("happy"),await r(700)}async function gs(e){const{camera:s,tara:t,spark:o,hers:a,code:i,ui:l,root:c}=e,h=c.querySelector(".tara"),u=c.querySelector(".trails"),m=c.querySelector(".error-spell");o.setText("MITHU").at(1900,-1180),o.el.classList.add("is-live","is-word","is-outer"),o.el.classList.remove("is-shadowed"),a.el.classList.remove("is-word","is-live","is-inner","is-shadowing","is-hollow"),await s.to({...p(40,-140),zoom:s.fitRoom(1500),duration:2e3}),await t.face("right"),t.express("curious"),await i.write(['name = "Mithu"',"","def room():","    print(name)",'    name = "Tara"'],{stagger:300}),await r(500),u.classList.add("show-out"),o.el.classList.add("is-answering"),await r(1100),u.classList.remove("show-out"),o.el.classList.remove("is-answering"),await r(400);const w=await ye(e,T.errorPredict);await Q(e,w.correct?"happy":"surprised",{nod:!0,ms:850}),await s.to({...p(-380,-200),zoom:s.fitRoom(1e3),duration:1600}),await t.face("left"),t.setPose("reach"),await r(400),a.setText("name").at(-560,-300).setScale(.1),a.el.classList.add("is-live","is-hollow"),await a.scaleTo(1,{duration:900,easing:y.back}),a.el.classList.add("is-word"),s.shake(4),t.setPose("idle"),await r(700),a.el.classList.add("is-claimed"),i.focus(4),i.note(4,"seen first — so name is local everywhere"),await r(1400),t.setPose("reach"),t.express("curious"),u.classList.add("show-local"),i.focus(3),i.note(3,"runs first — local name still empty"),await r(1e3),a.el.classList.add("is-hollow-pulse"),await r(800),u.classList.remove("show-local"),await s.to({...p(140,-300),zoom:s.fitRoom(1700),duration:1600}),u.classList.add("show-blocked"),await r(500),u.classList.add("is-barred"),s.shake(9),t.setPose("surprise"),t.express("surprised"),h.classList.add("mithu-alert"),await r(800),u.classList.remove("show-blocked","is-barred"),c.querySelector(".stage").classList.add("is-darkened"),m.setAttribute("transform","translate(120 -760)"),m.classList.add("is-cast"),i.mark(3,"is-error"),i.focus(3),s.shake(12),await r(1400),l.dataset.line="claimed",l.classList.add("show-line"),await r(4200),l.classList.remove("show-line"),await r(300),l.dataset.line="lookedthere",l.classList.add("show-line"),await r(4400),l.classList.remove("show-line"),await ls(e,{again:"See that again",go:"I follow — continue"})==="again"&&(m.classList.remove("is-cast"),await r(500),u.classList.add("show-blocked","is-barred"),m.classList.add("is-cast"),i.mark(3,"is-error"),s.shake(7),await r(2600),u.classList.remove("show-blocked","is-barred")),await r(700),m.classList.remove("is-cast"),c.querySelector(".stage").classList.remove("is-darkened"),h.classList.remove("mithu-alert"),t.setPose("idle"),a.el.classList.remove("is-hollow-pulse"),i.unmark("is-error"),i.unfocus(),i.clearNotes(),await r(500)}const qe={x:620,y:-1180};async function ys(e){const{camera:s,tara:t,spark:o,hers:a,code:i,ui:l,root:c}=e,h=c.querySelector(".tara"),u=c.querySelector(".trails"),m=c.querySelector(".perch-stand"),w=c.querySelector(".error-spell");await P(t.walkTo(M.taraX-220,{speed:200}),s.to({...p(-120,-260),zoom:s.fitRoom(1300),duration:1900})),await t.face("right"),t.setPose("sit"),t.express("curious"),m.setAttribute("transform",`translate(${M.taraX+190} ${M.floorY})`),m.classList.add("is-up"),h.classList.add("mithu-away"),await r(500),l.dataset.line="rules",l.classList.add("show-line"),await r(3800),l.classList.remove("show-line"),i.at(qe.x,qe.y),i.undock(),await i.clear({duration:400}),await s.to({...p(520,-760),zoom:s.fitRoom(2100),duration:1800}),a.el.classList.remove("is-word","is-live","is-hollow","is-claimed","is-hollow-pulse","is-inner","is-shadowing","is-clearing"),o.setText("MITHU").at(1900,-1180),o.el.classList.add("is-live","is-word","is-outer"),await i.write(['name = "Mithu"',"","def room():","    print(name)"]),await r(300),i.focus(3),u.classList.add("show-out"),await r(500),o.el.classList.add("is-answering"),await r(700),l.dataset.line="lookout",l.classList.add("show-line"),await r(3900),l.classList.remove("show-line"),u.classList.remove("show-out"),o.el.classList.remove("is-answering"),i.unfocus(),await i.clear(),await i.write(['name = "Mithu"',"","def room():",'    name = "Tara"',"    print(name)"]),await r(300),i.focus(3),a.setText("TARA").at(-560,-300).setScale(.1),a.el.classList.remove("is-hollow","is-claimed"),a.el.classList.add("is-live","is-inner"),await a.scaleTo(1,{duration:900,easing:y.back}),a.el.classList.add("is-word"),await r(400),i.focus(4),u.classList.add("show-local"),a.el.classList.add("is-shadowing"),o.el.classList.add("is-shadowed"),await r(800),l.dataset.line="hides",l.classList.add("show-line"),await r(3800),l.classList.remove("show-line");const x=c.querySelector(".shadow-tag .mlabel");x.classList.add("is-named"),await r(1100),x.classList.remove("is-named"),u.classList.remove("show-local"),o.el.classList.remove("is-shadowed"),a.el.classList.remove("is-shadowing"),i.unfocus(),await i.clear(),await i.write(['name = "Mithu"',"","def room():","    print(name)",'    name = "Tara"']),await r(300),i.focus(4),await r(500),a.setText("name").at(-560,-300).setScale(.1),a.el.classList.remove("is-inner"),a.el.classList.add("is-live","is-hollow"),await a.scaleTo(1,{duration:800,easing:y.back}),a.el.classList.add("is-word","is-claimed"),s.shake(4),await r(700),i.focus(3),u.classList.add("show-blocked"),a.el.classList.add("is-hollow-pulse"),await r(500),u.classList.add("is-barred"),s.shake(8),await r(500),u.classList.remove("show-blocked","is-barred"),w.setAttribute("transform","translate(620 -320)"),c.querySelector(".stage").classList.add("is-darkened"),w.classList.add("is-cast"),i.mark(3,"is-error"),await r(900),l.dataset.line="assigns",l.classList.add("show-line"),await r(4400),l.classList.remove("show-line"),await r(300),l.dataset.line="novalue",l.classList.add("show-line"),await r(4e3),l.classList.remove("show-line"),w.classList.remove("is-cast"),c.querySelector(".stage").classList.remove("is-darkened"),i.unfocus(),i.unmark("is-error"),await i.clear(),a.el.classList.remove("is-hollow-pulse"),await i.write(["len = 5",'print(len("palace"))'],{stagger:380}),await r(300),i.focus(0),i.note(0,"this hides the built-in len"),c.querySelector(".lg-builtin").classList.add("is-lit"),c.querySelector(".mlabel-builtin").classList.add("is-named"),await r(900),i.focus(1),i.mark(1,"is-error"),i.note(1,"TypeError — 5 is not a function"),s.shake(6),t.express("surprised"),await r(1100),e.journey.done("builtin"),l.dataset.line="shadowbuiltin",l.classList.add("show-line"),await r(4400),l.classList.remove("show-line"),c.querySelector(".mlabel-builtin").classList.remove("is-named"),c.querySelector(".lg-builtin").classList.remove("is-lit"),i.unfocus(),i.unmark("is-error"),i.clearNotes(),await i.clear(),t.express("curious"),await s.to({...p(-140,-180),zoom:s.fitRoom(1500),duration:1600}),t.setPose("idle");for(let b=0;b<2;b+=1)await t.walkTo(M.taraX-160,{speed:240}),a.setText("TARA").at(-560,-300).setScale(.1),a.el.classList.remove("is-hollow","is-claimed"),a.el.classList.add("is-live","is-inner"),await a.scaleTo(1,{duration:700,easing:y.back}),a.el.classList.add("is-word"),await r(500),await t.walkTo(M.doorX+60,{speed:240}),a.el.classList.add("is-clearing"),await r(400),a.el.classList.remove("is-live","is-word","is-clearing","is-inner"),await r(300);l.dataset.line="freshcall",l.classList.add("show-line"),await r(4e3),l.classList.remove("show-line"),await t.walkTo(M.taraX-160,{speed:220}),await t.face("right"),t.express("happy"),await s.to({...p(980,-940),zoom:s.zoomToFitWidth(1760),duration:2400}),c.querySelector(".layer-glows").classList.add("is-live");for(const b of["local","enclosing","global","builtin"])c.querySelector(`.lg-${b}`).classList.add("is-lit"),await r(300);await r(500),l.dataset.line="begins",l.classList.add("show-line"),await r(4400),l.classList.remove("show-line"),await r(500)}const ie=["local","enclosing","global","builtin"],$s=[{name:"secret",target:0},{name:"place",target:1},{name:"name",target:2},{name:"print",target:3}],fs=[{line:6,id:"local",note:"Local — this call only"},{line:3,id:"enclosing",note:"Enclosing — the function wrapped around it"},{line:0,id:"global",note:"Global — the top level of the file"},{line:7,id:"builtin",note:"print — Built-in, always there"}];function Ee(e){ie.forEach(s=>{e.querySelector(`.lg-${s}`).classList.remove("is-lit","is-probing","is-found","is-empty")})}async function Ls(e,s,t,o){Ee(e),s.setText(t).at(1900,-1180).setScale(1),s.el.classList.remove("is-dimmed","is-answering"),s.el.classList.add("is-live","is-word"),await r(900);for(let a=0;a<=o;a+=1){const i=e.querySelector(`.lg-${ie[a]}`);i.classList.add("is-lit","is-probing"),await r(a===o?850:600),i.classList.remove("is-probing"),a===o?(i.classList.add("is-found"),e.querySelector(`.mlabel-${ie[a]}`).classList.add("is-named"),s.el.classList.add("is-answering"),await r(1700),e.querySelector(`.mlabel-${ie[a]}`).classList.remove("is-named"),s.el.classList.remove("is-answering")):(i.classList.add("is-empty"),await r(260))}await r(400)}async function xs(e){const{camera:s,tara:t,spark:o,hers:a,code:i,ui:l,root:c}=e,h=c.querySelector(".tara"),u=c.querySelector(".perch-stand");await i.clear(),u.classList.remove("is-up"),h.classList.remove("mithu-away"),c.querySelectorAll(".mlabel").forEach(m=>m.classList.remove("is-named","is-inline")),c.querySelectorAll(".lg").forEach(m=>m.classList.remove("is-lit")),await r(600),t.setPose("idle").express("happy"),await P(t.walkTo(A.centreX+620,{speed:190}),s.to({...p(A.centreX+300,-260),zoom:s.fitRoom(2200),duration:4100})),await t.face("right"),await r(600),c.querySelector(".portal").classList.add("show-shell","is-warming"),await s.to({...p(900,-620),zoom:s.fitRoom(3200),duration:3e3}),a.el.classList.add("is-settled"),o.el.classList.add("is-settled"),h.classList.add("looks-out"),t.express("happy"),await r(900),l.dataset.line="belong",l.classList.add("show-line"),await r(3400),l.classList.remove("show-line"),await s.to({...p(980,-940),zoom:s.zoomToFitWidth(1760),duration:3e3}),c.querySelector(".layer-glows").classList.add("is-live"),await r(700),l.dataset.line="fourplaces",l.classList.add("show-line"),await r(3400),l.classList.remove("show-line");for(const{name:m,target:w}of $s)await Ls(c,o,m,w);Ee(c),o.el.classList.remove("is-live","is-word"),await r(800),i.undock(),await i.write(['name = "Mithu"',"","def palace():",'    place = "courtyard"',"","    def room():",'        secret = "laddoo"',"        print(name, place, secret)"],{stagger:300}),await r(900),c.querySelector(".layer-glows").classList.add("is-soft");for(const{line:m,id:w,note:x}of fs)i.focus(m),i.note(m,x),c.querySelector(`.lg-${w}`).classList.add("is-lit"),c.querySelector(`.mlabel-${w}`).classList.add("is-named"),await r(2600),c.querySelector(`.mlabel-${w}`).classList.remove("is-named");i.unfocus(),await r(900),l.dataset.line="legb",l.classList.add("show-line"),await r(4600),l.classList.remove("show-line"),await r(500),l.dataset.line="assignrule",l.classList.add("show-line"),await r(4800),l.classList.remove("show-line"),await r(600),await i.clear(),c.querySelectorAll(".mlabel").forEach(m=>m.classList.add("is-fading")),c.querySelectorAll(".lg").forEach(m=>m.classList.add("is-fading")),await r(1100),c.querySelectorAll(".mlabel").forEach(m=>m.classList.remove("is-named","is-fading")),c.querySelectorAll(".lg").forEach(m=>m.classList.remove("is-lit","is-fading")),c.querySelector(".layer-glows").classList.remove("is-soft"),await s.to({...p(900,-820),zoom:s.zoomToFitWidth(1900),duration:3e3}),await r(600),l.dataset.line="bridge",l.classList.add("show-line"),await r(4200),l.classList.remove("show-line"),await r(400),l.classList.add("is-ending"),l.classList.add("show-title"),await r(4200),l.classList.add("show-sub"),await r(1600),c.querySelector(".replay").classList.add("is-offered")}async function bs(e){const{camera:s,tara:t,spark:o,ui:a}=e;s.set({x:300,y:-1080,zoom:s.zoomToFitWidth(2e3)}),t.setPose("idle").express("neutral"),await r(400);const i=(async()=>{a.dataset.line="premise",a.classList.add("show-line"),await r(2100),a.dataset.line="premise2",await r(2100),a.dataset.line="premise3",await r(2200),a.classList.remove("show-line")})();await s.to({x:1150,y:-560,zoom:s.zoomToFitWidth(2300),duration:2300,easing:y.inOut}),await s.to({x:1600,y:420,zoom:s.zoomToFitWidth(1900),duration:2600,easing:y.inOut}),await i,await r(400),await s.to({x:n.x,y:n.y,zoom:s.zoomToFitWidth(780),duration:1800,easing:y.inOut}),e.root.querySelector(".hero-window").classList.add("is-open"),await r(2500),t.express("curious"),await t.face("right"),await r(600),await s.to({x:n.x,y:n.y,zoom:s.zoomToFitWidth(540),duration:1800,easing:y.inOut});const l=s.to({...p(0,40),zoom:s.fitRoom(1739),duration:2600,easing:y.inOut});await r(1900),e.root.querySelector(".portal").classList.add("is-inside"),e.root.querySelector(".hero-window").classList.add("is-passed"),await l,await s.to({...p(-40,90),zoom:s.fitRoom(1667),duration:1800}),await r(600),await P(t.walkTo(M.taraX-360,{speed:210}),s.to({...p(-220,110),zoom:s.fitRoom(1684),duration:2300})),await r(700),await t.face("right"),await r(500),o.el.classList.add("is-live"),await o.moveTo(360,-160,{duration:1600,easing:y.out}),t.express("curious"),await r(700),await P(o.moveTo(-60,-60,{duration:2e3,easing:y.inOut}),s.to({...p(-160,40),zoom:s.fitRoom(1481),duration:2e3})),t.setPose("reach"),await r(520),await o.moveTo(300,-240,{duration:900,easing:y.out}),t.setPose("idle"),t.express("surprised"),s.shake(5),await r(700),t.express("curious"),await P(t.walkTo(M.taraX-60,{speed:190}),s.to({...p(40,-10),zoom:s.fitRoom(1569),duration:1800})),await r(500),await o.moveTo(150,-170,{duration:1100,easing:y.inOut}),await r(400),o.el.classList.add("is-word"),s.shake(7),t.setPose("surprise"),t.express("surprised"),await r(1400),t.setPose("idle"),t.express("curious"),await r(1600),await s.to({...p(30,10),zoom:s.fitRoom(1778),duration:2e3}),a.classList.add("show-title"),await r(3400),a.classList.add("show-sub"),await r(3e3)}const vs=[bs,ns,cs,hs,ms,ws,ps,gs,ys,xs];async function ks(e){for(const s of vs)await s(e)}const ze=[{id:"local",name:"Local"},{id:"enclosing",name:"Enclosing"},{id:"global",name:"Global"},{id:"builtin",name:"Built-in"}];function Ss(){return`
<nav class="journey" aria-label="Story progress">
  <span class="journey-title">Palace Journey</span>
  <ol class="journey-steps">
    ${ze.map(e=>`
      <li class="jstep" data-id="${e.id}">
        <span class="jlamp" aria-hidden="true"></span>
        <span class="jname">${e.name}</span>
      </li>`).join("")}
  </ol>
</nav>`}class Ts{constructor(s){this.el=s,this.steps=new Map([...s.querySelectorAll(".jstep")].map(t=>[t.dataset.id,t])),this.order=ze.map(t=>t.id),this.furthest=-1}at(s){const t=this.order.indexOf(s);if(t<this.furthest)return this;this.furthest=t;for(const[o,a]of this.steps)a.classList.toggle("is-here",o===s),o===s?a.setAttribute("aria-current","step"):a.removeAttribute("aria-current");return this.el.classList.add("is-shown"),this}done(s){const t=this.order.indexOf(s);if(t<0)return this;for(let o=0;o<=t;o+=1){const a=this.steps.get(this.order[o]);a&&(a.classList.add("is-done"),a.classList.remove("is-here"),a.removeAttribute("aria-current"))}return this}async flash(s=2600){return this.el.classList.add("is-shown","is-forward"),await new Promise(t=>setTimeout(t,s)),this.el.classList.remove("is-forward"),this}reset(){this.furthest=-1;for(const s of this.steps.values())s.classList.remove("is-here","is-done"),s.removeAttribute("aria-current");return this.el.classList.remove("is-shown","is-forward"),this}}const D={width:1600,height:900};class Me{constructor(s){this.el=s,this.x=0,this.y=0,this.scale=1,this.apply()}apply(){this.el.setAttribute("transform",`translate(${this.x} ${this.y}) scale(${this.scale})`)}at(s,t){return this.x=s,this.y=t,this.apply(),this}setScale(s){return this.scale=s,this.apply(),this}setText(s){const t=this.el.querySelector(".sw-text");if(!t)return this;t.textContent=s;const o=Math.max(190,s.length*34+96),a=this.el.querySelector(".sw-plate"),i=this.el.querySelector(".sw-aura");return a&&(a.setAttribute("x",-o/2),a.setAttribute("width",o)),i&&i.setAttribute("rx",o*.78),this}async morphTo(s,{duration:t=900}={}){return this.el.classList.add("is-morphing"),await z({duration:t/2,easing:y.in,onUpdate:()=>{}}),this.setText(s),await z({duration:t/2,easing:y.out,onUpdate:()=>{}}),this.el.classList.remove("is-morphing"),this}scaleTo(s,{duration:t=900,easing:o=y.inOut}={}){const a=this.scale;return z({duration:t,easing:o,onUpdate:i=>{this.scale=a+(s-a)*i,this.apply()}})}moveTo(s,t,{duration:o=1400,easing:a=y.inOut}={}){const i=this.x,l=this.y;return z({duration:o,easing:a,onUpdate:c=>{this.x=i+(s-i)*c,this.y=l+(t-l)*c,this.apply()}})}}function ue(e,s){const t=document.createElementNS("http://www.w3.org/2000/svg","g");return s&&t.setAttribute("class",s),t.innerHTML=e,t}function qs(e){e.innerHTML=`
    <div class="stage">
      <svg class="stage-svg" viewBox="0 0 ${D.width} ${D.height}"
           preserveAspectRatio="xMidYMid slice" role="img"
           aria-label="A palace at night. A girl and her parrot watch a glowing word appear.">
        ${Xe()}
        <defs>${os()}</defs>
        <g class="world">${is()}</g>
      </svg>

      <div class="ui">
        <svg class="title-svg" viewBox="0 0 ${D.width} ${D.height}"
             preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <g class="title-group" transform="translate(800 648)">
            ${rs()}
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
    </div>`;const s=e.querySelector(".world"),t=new Ne(s,D),o=e.querySelector(".tara-slot"),a=ue(He());o.appendChild(a);const i=new Ze(a,{x:60,y:420,scale:1,facing:"left"}),l=ue(ke()+Se("laddoo"),"spark-slot");o.appendChild(l);const c=new Me(l);c.at(520,-300);const h=ue(ke()+Se("chameli"),"spark-slot hers");o.appendChild(h);const u=new Me(h);u.at(0,0).setScale(.06);const m=new je(e.querySelector(".code-air")),w=e.querySelector(".sr-live"),x=e.querySelector(".ui"),b=()=>{if(!x.classList.contains("show-line")){w.textContent="";return}const L=x.dataset.line,f=L?e.querySelector(`.narration[data-for="${L}"]`):e.querySelector('.narration[data-for="far"]'),H=f?f.textContent.trim():"";w.textContent!==H&&(w.textContent=H)};new MutationObserver(b).observe(x,{attributes:!0,attributeFilter:["class","data-line"]});const k=new Ts(e.querySelector(".journey"));k.at("local");const S={root:e,camera:t,tara:i,spark:c,hers:u,code:m,journey:k,ui:e.querySelector(".ui")},$=()=>{Oe(),e.querySelector(".hero-window").classList.remove("is-open","is-passed"),e.querySelector(".portal").classList.remove("is-inside"),l.classList.remove("is-live","is-word","is-dimmed"),h.classList.remove("is-live","is-word","is-bouncing","is-straining","is-fading"),u.at(0,0).setScale(.06),e.querySelector(".room").classList.remove("wall-felt"),e.querySelector(".room-door").classList.remove("is-noticed"),e.querySelector(".tara").classList.remove("mithu-alert"),e.querySelector(".wall-ripple").classList.remove("is-hit"),e.querySelector(".room-door").classList.remove("is-open"),e.querySelector(".portal").classList.remove("show-shell"),e.querySelector(".layer-glows").classList.remove("is-live"),e.querySelectorAll(".lg").forEach(f=>f.classList.remove("is-lit")),e.querySelectorAll(".mlabel").forEach(f=>f.classList.remove("is-named")),e.querySelector(".ask-prompt").classList.remove("is-offered","is-taken"),e.querySelector(".ask-speech").classList.remove("is-spoken"),e.querySelector(".q-motes").classList.remove("is-asking"),e.querySelector(".courtyard").classList.remove("is-hushed"),h.classList.remove("is-homebound","is-beckoning","is-inner","is-shadowing","is-touched"),l.classList.remove("is-outer","is-answering","is-shadowed","is-touched"),u.setText("chameli"),c.setText("laddoo"),e.querySelector(".reach").classList.remove("show-global","show-nonlocal","show-shadow"),e.querySelectorAll(".lg").forEach(f=>f.classList.remove("is-probing","is-empty","is-found")),e.querySelectorAll(".mlabel").forEach(f=>f.classList.remove("is-inline")),e.querySelector(".layer-glows").classList.remove("is-searching"),e.querySelector(".tara").classList.remove("has-lantern","has-megaphone","mithu-away"),h.classList.remove("is-hollow","is-claimed","is-hollow-pulse","is-clearing"),e.querySelector(".trails").classList.remove("show-out","show-local","show-blocked","is-barred"),e.querySelector(".error-spell").classList.remove("is-cast"),e.querySelector(".perch-stand").classList.remove("is-up"),e.querySelector(".shadow-tag .mlabel").classList.remove("is-named"),e.querySelector(".stage").classList.remove("is-darkened"),m.clear({duration:0}),m.undock(),e.querySelector(".tara").classList.remove("looks-out","mithu-nods"),e.querySelector(".portal").classList.remove("is-warming"),e.querySelectorAll(".is-waking").forEach(f=>f.classList.remove("is-waking")),e.querySelectorAll(".is-fading").forEach(f=>f.classList.remove("is-fading")),h.classList.remove("is-settled","is-rising","is-star"),l.classList.remove("is-settled"),e.querySelector(".layer-glows").classList.remove("is-soft"),e.querySelector(".replay").classList.remove("is-offered"),e.querySelector(".interact").innerHTML="",k.reset(),k.at("local"),Ce(),e.querySelector(".stage").classList.remove("is-paused");const L=e.querySelector(".pausebtn");L.classList.remove("is-paused"),L.setAttribute("aria-pressed","false"),L.setAttribute("aria-label","Pause the story"),S.ui.classList.remove("is-ending"),delete S.ui.dataset.line,S.ui.classList.remove("show-title","show-sub","show-line"),i.at(60,420),i.facing="left",i.apply(),c.x=520,c.y=-300,c.apply(),t.unfollow(),ks(S)},C=e.querySelector(".pausebtn"),I=e.querySelector(".stage"),G=L=>{I.classList.toggle("is-paused",L),C.classList.toggle("is-paused",L),C.setAttribute("aria-pressed",String(L)),C.setAttribute("aria-label",L?"Resume the story":"Pause the story")};return C.addEventListener("click",()=>G($e())),addEventListener("keydown",L=>{if(L.code!=="Space"&&L.key!==" ")return;const f=L.target;f instanceof Element&&(f.closest("button")||f.getAttribute("role")==="button"||f.isContentEditable)||(L.preventDefault(),G($e()))}),e.querySelector(".replay").addEventListener("click",$),F?(e.querySelector(".hero-window").classList.add("is-open","is-passed"),e.querySelector(".portal").classList.add("is-inside","show-shell"),e.querySelector(".room-door").classList.add("is-open"),h.classList.add("is-live","is-word","is-homebound"),u.at(-620,-240).setScale(1),l.classList.add("is-live","is-word"),c.at(470,-330),i.at(1760,420),i.express("confused"),e.querySelector(".layer-glows").classList.add("is-live"),e.querySelectorAll(".lg").forEach(L=>L.classList.add("is-lit")),e.querySelectorAll(".mlabel").forEach(L=>L.classList.add("is-named")),u.setText("TARA"),h.classList.add("is-inner"),u.at(-560,-300),c.setText("MITHU"),l.classList.add("is-outer"),c.at(1900,-1180),t.set({x:n.x+980*n.scale,y:n.y+-940*n.scale,zoom:t.zoomToFitWidth(1760)}),m.dock(),m.write(['name = "Mithu"',"","def room():",'    name = "Tara"',"    print(name)"],{stagger:0}),m.note(0,"Global — the palace name"),m.note(3,"assigning makes a NEW local name"),m.note(4,"finds the local one first"),S.ui.dataset.line="names",S.ui.classList.add("show-line")):$(),S}qs(document.getElementById("app"));
