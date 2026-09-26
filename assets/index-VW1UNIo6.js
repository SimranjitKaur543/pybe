(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function s(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(a){if(a.ep)return;a.ep=!0;const i=s(a);fetch(a.href,i)}})();const F=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let Z=0;const O=()=>Z,oe=new Set;function we(e){return oe.add(e),()=>oe.delete(e)}function Fe(){Z+=1;for(const e of oe)try{e()}catch{}return oe.clear(),Z}let j=!1,pe=0,Me=0;const re=()=>(j?pe:performance.now())-Me;function Oe(){j||(pe=performance.now(),j=!0)}function Ae(){j&&(Me+=performance.now()-pe,j=!1)}function $e(){return j?Ae():Oe(),j}const y={inOut:e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,out:e=>1-Math.pow(1-e,3),in:e=>e*e*e,back:e=>1+2.2*Math.pow(e-1,3)+1.2*Math.pow(e-1,2)};function r(e){const t=Z;return F?Promise.resolve():new Promise(s=>{const o=re()+e,a=()=>{if(t===Z){if(re()>=o)return s();requestAnimationFrame(a)}};requestAnimationFrame(a)})}function z({duration:e=600,easing:t=y.inOut,onUpdate:s,onDone:o}={}){let a=null,i=!1;const n=Z,c=new Promise(d=>{if(F||e<=0){s?.(1),o?.(),d();return}const u=re(),m=()=>{if(i)return d();if(n!==Z)return;const w=Math.min(1,(re()-u)/e);s?.(t(w)),w<1?a=requestAnimationFrame(m):(o?.(),d())};a=requestAnimationFrame(m)});return c.cancel=()=>{i=!0,a&&cancelAnimationFrame(a)},c}const X=(e,t,s)=>e+(t-e)*s,P=(...e)=>Promise.all(e.map(t=>typeof t=="function"?t():t));class We{constructor(t,s){this.el=t,this.view=s,this.state={x:s.width/2,y:s.height/2,zoom:1},this.following=null,this.shakeAmount=0,this.shakePhase=0,this.shakeAngle=0,this.apply(),this.tick=this.tick.bind(this),requestAnimationFrame(this.tick)}apply(){const{x:t,y:s,zoom:o}=this.state,a=this.view.width/2,i=this.view.height/2,n=this.shakeAmount?Math.sin(this.shakePhase)*this.shakeAmount:0,c=n*Math.cos(this.shakeAngle),d=n*Math.sin(this.shakeAngle)*.6;this.el.setAttribute("transform",`translate(${a+c} ${i+d}) scale(${o}) translate(${-t} ${-s})`)}tick(){if(this.following&&this.following.gen!==O()&&(this.following=null),this.following){const{actor:t,offsetX:s=0,offsetY:o=0,lag:a=.08,map:i}=this.following,n=i?i(t.x,t.y):{x:t.x,y:t.y},c=n.x+s,d=n.y+o;this.state.x=X(this.state.x,c,a),this.state.y=X(this.state.y,d,a),this.apply()}else this.shakeAmount>0&&this.apply();this.shakeAmount>0&&(this.shakePhase+=.62,this.shakeAmount*=.88),this.shakeAmount<.05&&(this.shakeAmount=0,this.shakePhase=0),requestAnimationFrame(this.tick)}set({x:t,y:s,zoom:o}={}){return t!==void 0&&(this.state.x=t),s!==void 0&&(this.state.y=s),o!==void 0&&(this.state.zoom=o),this.apply(),this}to({x:t,y:s,zoom:o,duration:a=1400,easing:i=y.inOut}={}){const n={...this.state},c={x:t??n.x,y:s??n.y,zoom:o??n.zoom};return z({duration:a,easing:i,onUpdate:d=>{this.state.x=X(n.x,c.x,d),this.state.y=X(n.y,c.y,d),this.state.zoom=X(n.zoom,c.zoom,d),this.apply()}})}follow(t,s={}){return this.following={actor:t,...s,gen:O()},this}unfollow(){return this.following=null,this}zoomToFitWidth(t){const o=this.el.ownerSVGElement.getBoundingClientRect();if(!o.width||!o.height)return 1;const a=Math.max(o.width/this.view.width,o.height/this.view.height);return o.width/a/t}fitRoom(t,s=.225){return this.zoomToFitWidth(t*s)}shake(t=10){return this.shakeAmount=t,this.shakePhase=0,this.shakeAngle=(Math.random()-.5)*.9,this}}class Ne{constructor(t,{x:s=0,y:o=0,facing:a="right",scale:i=1}={}){this.el=t,this.figure=t.firstElementChild||t,this.x=s,this.y=o,this.facing=a,this.scale=i,this.pose="idle",this.apply()}apply(){const t=this.facing==="left"?-1:1;this.el.setAttribute("transform",`translate(${this.x} ${this.y}) scale(${t*this.scale} ${this.scale})`)}at(t,s){return this.x=t,s!==void 0&&(this.y=s),this.apply(),this}setPose(t){return this.figure.classList.remove(`pose-${this.pose}`),this.pose=t,this.figure.classList.add(`pose-${t}`),this}express(t){return this.figure.dataset.mood=t,this}async face(t,{duration:s=260}={}){if(this.facing===t)return;const o=t==="left"?-1:1;await z({duration:s/2,easing:y.in,onUpdate:a=>{const i=(1-a)*this.scale;this.el.setAttribute("transform",`translate(${this.x} ${this.y}) scale(${(this.facing==="left"?-1:1)*i} ${this.scale})`)}}),this.facing=t,await z({duration:s/2,easing:y.out,onUpdate:a=>{const i=a*this.scale;this.el.setAttribute("transform",`translate(${this.x} ${this.y}) scale(${o*i} ${this.scale})`)}}),this.apply()}async walkTo(t,{speed:s=300,pose:o="walk"}={}){const a=t<this.x?"left":"right";await this.face(a);const i=this.x,n=Math.abs(t-i);if(n<1)return;const c=n/s*1e3;this.setPose(o),await z({duration:c,easing:y.inOut,onUpdate:d=>{this.x=i+(t-i)*d,this.apply()}}),this.setPose("idle")}beat(t=500){return r(t)}}class Ze{constructor(t){this.el=t,this.pre=t.querySelector(".ca-lines"),this.lines=[],this.texts=[]}at(){return this}dock(){return this.el.classList.add("is-docked"),this}undock(){return this.el.classList.remove("is-docked"),this}async write(t,{stagger:s=420}={}){return this.pre.innerHTML="",this.lines=[],this.texts=[],this.el.classList.add("is-open"),this.append(t,{stagger:s})}async append(t,{stagger:s=420}={}){this.el.classList.add("is-open");for(const o of t){const a=o.match(/^\s*/)[0].length,i=document.createElement("span");i.className="ca-line",i.style.paddingLeft=`${a*.62}em`,i.innerHTML=fe(o.trim())||"&nbsp;",this.pre.appendChild(i),this.lines.push(i),this.texts.push(o),requestAnimationFrame(()=>i.classList.add("is-written")),await r(s)}return this}async retype(t,s,{flash:o=!0}={}){const a=this.lines[t];if(!a)return this;const i=s.match(/^\s*/)[0].length;return a.style.paddingLeft=`${i*.62}em`,a.innerHTML=fe(s.trim())||"&nbsp;",this.texts[t]=s,o&&(a.classList.remove("is-written"),requestAnimationFrame(()=>a.classList.add("is-written")),await r(700)),this}note(t,s){const o=this.lines[t];if(!o)return this;if(o.querySelector(".ca-note")?.remove(),!s)return this;const a=document.createElement("span");return a.className="ca-note",a.textContent=`  # ${s}`,o.appendChild(a),this}clearNotes(){return this.pre.querySelectorAll(".ca-note").forEach(t=>t.remove()),this}mark(t,s){return this.lines[t]?.classList.add(s),this}unmark(t){return this.lines.forEach(s=>s.classList.remove(t)),this}focus(t){return this.lines.forEach((s,o)=>s.classList.toggle("is-running",o===t)),this}unfocus(){return this.lines.forEach(t=>t.classList.remove("is-running")),this}async clear({duration:t=700}={}){return this.el.classList.remove("is-open"),await r(t),this.pre.innerHTML="",this.lines=[],this.texts=[],this}}function fe(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}const h=-246,je=43,g=-190,b=-104;function xe(e,t){return`
  <g class="limb ${t}">
    <path class="churidar" d="M ${e-13} ${b}
      C ${e-15} ${b+46} ${e-13} -40 ${e-11} -12
      L ${e+11} -12
      C ${e+13} -40 ${e+15} ${b+46} ${e+13} ${b} Z" />
    <path class="cuff" d="M ${e-12} -26 L ${e+12} -26 L ${e+11} -14 L ${e-11} -14 Z" />
    <ellipse class="slipper" cx="${e+3}" cy="-5" rx="19" ry="9" />
  </g>`}function Le(e,t,s=""){return`
  <g class="limb ${t}">
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
    ${s}
  </g>`}function Qe(e,t){return`
  <g class="prop prop-lantern" transform="translate(${e} ${t})">
    <path class="lan-hoop" d="M -16 -4 C -16 -30 16 -30 16 -4" />
    <rect class="lan-cap" x="-19" y="-6" width="38" height="10" rx="4" />
    <path class="lan-glass" d="M -17 4 L 17 4 L 13 44 L -13 44 Z" />
    <circle class="lan-halo" cx="0" cy="24" r="82" />
    <path class="lan-flame" d="M 0 10 C 9 22 7 36 0 36 C -7 36 -9 22 0 10 Z" />
    <rect class="lan-base" x="-16" y="42" width="32" height="9" rx="4" />
  </g>`}function Ie(e,t){return`
  <g class="prop prop-megaphone" transform="translate(${e} ${t})">
    <path class="meg-body" d="M -6 -14 L -6 14 L 42 34 L 42 -34 Z" />
    <ellipse class="meg-mouth" cx="42" cy="0" rx="9" ry="34" />
    <rect class="meg-grip" x="-20" y="-9" width="16" height="18" rx="6" />
  </g>`}function Ge(){return`
<g class="tara pose-idle" data-mood="neutral">
  <ellipse class="shadow" cx="4" cy="2" rx="62" ry="12" />

  <!-- far side limbs sit behind the body -->
  ${xe(-17,"leg-far")}
  ${Le(-46,"arm-far")}

  <!-- braid falls behind the shoulder -->
  <g class="braid">
    <path class="hair" d="M -34 ${h+6}
      C -66 ${h+40} -64 ${h+116} -46 ${h+152}
      L -26 ${h+146}
      C -44 ${h+112} -46 ${h+44} -18 ${h+16} Z" />
    <circle class="ribbon" cx="-36" cy="${h+150}" r="11" />
  </g>

  <!-- body -->
  <g class="body">
    <path class="kurta" d="M -32 ${g-6}
      C -48 ${g+22} -50 ${b-20} -54 ${b+16}
      L 54 ${b+16}
      C 50 ${b-20} 44 ${g+22} 32 ${g-6}
      C 18 ${g-18} -18 ${g-18} -32 ${g-6} Z" />
    <path class="fold" d="M -30 ${b-46} C -18 ${b-40} 16 ${b-40} 30 ${b-48}" />
    <path class="kurta-hem" d="M -54 ${b+4} L 54 ${b+4} L 54 ${b+16} L -54 ${b+16} Z" />
    <path class="dupatta" d="M -30 ${g-2}
      C -6 ${g+26} 22 ${g+22} 34 ${g+2}
      C 44 ${g+54} 38 ${b+6} 26 ${b+30}
      L 8 ${b+24}
      C 22 ${b-6} 28 ${g+58} 20 ${g+34}
      C 4 ${g+46} -18 ${g+40} -30 ${g+22} Z" />
  </g>

  <!-- near side limbs -->
  ${xe(17,"leg-near")}
  ${Le(48,"arm-near",Qe(40,g+104)+Ie(40,g+96))}

  <!-- head. The hair is a full disc sitting behind a slightly lower, slightly
       forward face disc: that leaves a clean hair rim over the crown. A single
       curved cap never reaches the top of the skull and leaves it bald. -->
  <g class="head">
    <!-- Hair as a rounded mass with real volume, rather than a disc five
         units wider than the face — that only ever showed as a thin rim. The
         old fringe doubled back on itself and left a dark wedge over her right
         brow, which read as a mistake rather than a hairstyle. -->
    <path class="hair" d="M -44 ${h+10}
      C -49 ${h-30} -24 ${h-54} 2 ${h-54}
      C 30 ${h-54} 50 ${h-28} 48 ${h+12}
      C 47 ${h+30} 44 ${h+42} 38 ${h+52}
      L -34 ${h+52}
      C -41 ${h+38} -44 ${h+26} -44 ${h+10} Z" />

    <circle class="skin" cx="3" cy="${h+4}" r="${je}" />

    <!-- Fringe: one sweep across the forehead, left to right. It has to clear
         the brows by a good margin — the brows are stroked in the hair colour,
         so a fringe that reaches them does not overlap them, it ERASES them,
         and she loses every expression the moods depend on. -->
    <path class="hair" d="M -42 ${h+4}
      C -46 ${h-26} -24 ${h-48} 3 ${h-48}
      C 31 ${h-48} 48 ${h-26} 46 ${h+2}
      C 41 ${h-24} 30 ${h-36} 14 ${h-39}
      C -6 ${h-42} -27 ${h-30} -37 ${h-10}
      C -38 ${h+2} -40 ${h+4} -42 ${h+4} Z" />

    <!-- the headband she already wore, drawn on purpose this time -->
    <path class="headband" d="M -40 ${h-10} C -30 ${h-34} 30 ${h-36} 45 ${h-12}" />
    <circle class="flower" cx="34" cy="${h-32}" r="9" />
    <circle class="flower-mid" cx="34" cy="${h-32}" r="3.8" />

    <g class="face">
      <circle class="blush" cx="-20" cy="${h+14}" r="10" />
      <circle class="blush" cx="30" cy="${h+14}" r="10" />

      <g class="eyes">
        <g class="eye">
          <ellipse class="eye-white" cx="-7" cy="${h-2}" rx="11.5" ry="13.5" />
          <circle class="pupil" cx="-5" cy="${h}" r="7.4" />
          <circle class="glint" cx="-9" cy="${h-5}" r="3.1" />
          <circle class="glint small" cx="-1" cy="${h+4}" r="1.6" />
        </g>
        <g class="eye">
          <ellipse class="eye-white" cx="23" cy="${h-2}" rx="11.5" ry="13.5" />
          <circle class="pupil" cx="25" cy="${h}" r="7.4" />
          <circle class="glint" cx="21" cy="${h-5}" r="3.1" />
          <circle class="glint small" cx="29" cy="${h+4}" r="1.6" />
        </g>
      </g>

      <!-- every mood is drawn; CSS reveals one -->
      <g class="brows">
        <g class="brow-set" data-for="neutral">
          <path d="M -16 ${h-20} Q -6 ${h-26} 4 ${h-21}" />
          <path d="M 14 ${h-21} Q 24 ${h-26} 32 ${h-20}" />
        </g>
        <g class="brow-set" data-for="curious">
          <path d="M -16 ${h-22} Q -6 ${h-30} 4 ${h-24}" />
          <path d="M 14 ${h-28} Q 24 ${h-36} 32 ${h-27}" />
        </g>
        <g class="brow-set" data-for="surprised">
          <path d="M -17 ${h-29} Q -6 ${h-38} 5 ${h-30}" />
          <path d="M 13 ${h-30} Q 24 ${h-38} 33 ${h-29}" />
        </g>
        <g class="brow-set" data-for="confused">
          <path d="M -16 ${h-26} Q -6 ${h-18} 4 ${h-24}" />
          <path d="M 14 ${h-30} Q 24 ${h-37} 32 ${h-28}" />
        </g>
        <g class="brow-set" data-for="happy">
          <path d="M -16 ${h-24} Q -6 ${h-31} 4 ${h-25}" />
          <path d="M 14 ${h-25} Q 24 ${h-31} 32 ${h-24}" />
        </g>
      </g>

      <g class="mouths">
        <path class="mouth-set" data-for="neutral"   d="M 1 ${h+24} Q 10 ${h+33} 19 ${h+24}" />
        <path class="mouth-set" data-for="curious"   d="M 2 ${h+23} Q 10 ${h+33} 18 ${h+23}" />
        <path class="mouth-set open" data-for="surprised" d="M 10 ${h+27} m -8 0 a 8 9 0 1 0 16 0 a 8 9 0 1 0 -16 0" />
        <path class="mouth-set" data-for="confused" d="M 2 ${h+28} Q 10 ${h+22} 18 ${h+27}" />
        <path class="mouth-set open" data-for="happy" d="M 0 ${h+22} Q 10 ${h+38} 20 ${h+22} Z" />
      </g>
    </g>
  </g>

  <!-- Mithu rides on her shoulder -->
  <!-- positioning on the OUTER group: the hop animation below sets transform,
       and a CSS transform replaces the SVG attribute rather than composing. -->
  <g class="mithu-perch" transform="translate(42 ${g-10}) scale(0.27)">
    <g class="mithu-hop">${Ce()}</g>
  </g>
</g>`}function Ce(){return`
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
</g>`}function se(e,t,s,o,a="stone"){const i=s/2;return`<g class="${a}">
    <path d="M ${e-i} ${t}
             C ${e-i} ${t-o*.5} ${e-i*.62} ${t-o*.8} ${e} ${t-o}
             C ${e+i*.62} ${t-o*.8} ${e+i} ${t-o*.5} ${e+i} ${t} Z" />
    <rect x="${e-3}" y="${t-o-28}" width="6" height="30" rx="3" />
    <circle cx="${e}" cy="${t-o-34}" r="7" />
  </g>`}function le(e,t,s,o){const a=s/2,i=e+a;return`M ${e} ${t+o}
          L ${e} ${t+a*.72}
          Q ${e} ${t} ${i} ${t-a*.28}
          Q ${e+s} ${t} ${e+s} ${t+a*.72}
          L ${e+s} ${t+o} Z`}function me(e,t,s,o,a="arch"){return`<path class="${a}" d="${le(e,t,s,o)}" />`}function ae(e,t,s,o,a=0){return`<path class="lit-window" style="animation-delay:${a}s" d="${le(e,t,s,o)}" />`}function K(e,t,s,o,a,i,n="arch"){const c=n==="lit"?ae:me;return Array.from({length:s},(d,u)=>n==="lit"?c(e+u*(o+i),t,o,a,u*.83%5):c(e+u*(o+i),t,o,a)).join("")}function ne(e,t,s,o=30){const a=o/2;return`<g class="stone">
    <rect x="${e-a}" y="${t}" width="${o}" height="${s-t}" rx="4" />
    <rect x="${e-a-9}" y="${t-14}" width="${o+18}" height="16" rx="5" />
    <rect x="${e-a-11}" y="${s-14}" width="${o+22}" height="16" rx="5" />
  </g>`}function J(e,t,s,o){const a=s/2;return`<g class="stone">
    <rect x="${e-a}" y="${t-7}" width="${s}" height="8" rx="4" />
    <rect x="${e-a+5}" y="${t-o}" width="6" height="${o-7}" />
    <rect x="${e+a-11}" y="${t-o}" width="6" height="${o-7}" />
  </g>${se(e,t-o,s*.9,o*.7)}`}function ge(e=0,t=18,s={x:0,y:0,w:1600,h:900}){let o=e*9301+49297;const a=()=>(o=(o*9301+49297)%233280)/233280;return`<g class="motes">${Array.from({length:t},()=>{const i=s.x+a()*s.w,n=s.y+a()*s.h,c=2+a()*2.6,d=(a()*9).toFixed(2),u=(7+a()*7).toFixed(2);return`<circle cx="${i}" cy="${n}" r="${c}" style="animation-delay:${d}s; animation-duration:${u}s" />`}).join("")}</g>`}function be(e,t,s,o,a=2.6){const i=e+s/2;return`<path class="light-shaft" d="M ${e} ${t} L ${e+s} ${t}
    L ${i+s*a/2} ${t+o} L ${i-s*a/2} ${t+o} Z" />`}function He(){return`
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
</defs>`}const A={floorY:420,taraX:60,wallX:-1090,doorX:390};function Xe(){const{floorY:e}=A;return`
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
</g>`}const M={x0:560,x1:3180,floorY:A.floorY,centreX:1840,askX:1760};function Ue(e,t){return`
<g class="fountain">
  <ellipse class="water-pool" cx="${e}" cy="${t}" rx="260" ry="66" />
  <path class="basin" d="M ${e-270} ${t-6} Q ${e} ${t+74} ${e+270} ${t-6}
    L ${e+250} ${t-40} L ${e-250} ${t-40} Z" />
  <rect class="basin" x="${e-34}" y="${t-210}" width="68" height="175" rx="16" />
  <ellipse class="basin-top" cx="${e}" cy="${t-212}" rx="132" ry="32" />
  <ellipse class="water-top" cx="${e}" cy="${t-216}" rx="112" ry="24" />
  <g class="jets">
    ${[-86,-44,0,44,86].map((s,o)=>`
      <path class="jet" style="animation-delay:${(o*.23).toFixed(2)}s"
        d="M ${e+s} ${t-226} Q ${e+s*1.5} ${t-150} ${e+s*1.9} ${t-46}" />`).join("")}
  </g>
  <g class="ripples">
    <ellipse class="rp r1" cx="${e}" cy="${t+6}" rx="60" ry="16" />
    <ellipse class="rp r2" cx="${e}" cy="${t+6}" rx="60" ry="16" />
    <ellipse class="rp r3" cx="${e}" cy="${t+6}" rx="60" ry="16" />
  </g>
</g>`}function ee(e,t,s=1){return`
<g class="plant" transform="translate(${e} ${t}) scale(${s})">
  <path class="pot" d="M -52 0 L 52 0 L 38 92 L -38 92 Z" />
  <rect class="pot-rim" x="-60" y="-16" width="120" height="22" rx="9" />
  <g class="fronds">
    <path class="frond" d="M 0 -10 C -70 -40 -96 -120 -58 -176 C -30 -126 -14 -64 0 -10 Z" />
    <path class="frond" d="M 0 -10 C 64 -46 92 -126 52 -180 C 26 -126 12 -62 0 -10 Z" />
    <path class="frond" d="M 0 -10 C -26 -86 -8 -166 20 -200 C 24 -136 12 -66 0 -10 Z" />
  </g>
</g>`}function ce(e,t,s,o=0){return`
<g class="court-lantern" style="animation-delay:${o}s">
  <line class="chain" x1="${e}" y1="${t}" x2="${e}" y2="${s}" />
  <path class="lantern-shell" d="M ${e-40} ${s} L ${e+40} ${s}
    L ${e+26} ${s+84} L ${e-26} ${s+84} Z" />
  <rect class="lantern-cap" x="${e-46}" y="${s-14}" width="92" height="18" rx="7" />
  <circle class="lantern-glow" cx="${e}" cy="${s+40}" r="26" />
</g>`}function Be(){const{x0:e,x1:t,floorY:s,centreX:o}=M,a=-760;return`
<g class="courtyard">
  <!-- open sky above the courtyard -->
  <rect class="court-sky" x="${e}" y="-1180" width="${t-e}" height="${-a+1180-0}" />
  <g class="court-stars">
    ${[[820,-1040],[1180,-930],[1520,-1090],[1980,-960],[2420,-1050],[2760,-900],[1340,-1150],[2180,-1130],[2960,-1e3]].map(([i,n],c)=>`<circle class="${c%3?"still":""}" cx="${i}" cy="${n}" r="${c%2?6:8}" style="animation-delay:${c*.7}s" />`).join("")}
  </g>
  <circle class="court-moon" cx="2560" cy="-1010" r="96" />

  <!-- back wall, gallery and arcade -->
  <rect class="court-wall" x="${e}" y="${a}" width="${t-e}" height="${s-a}" />
  <rect class="court-band" x="${e}" y="${a}" width="${t-e}" height="34" />

  <!-- upper balconies -->
  <g class="balconies">
    ${[900,1500,2100,2700].map((i,n)=>`
      <g class="balcony">
        <rect class="balcony-floor" x="${i-130}" y="${a+300}" width="260" height="26" rx="8" />
        <rect class="balcony-rail"  x="${i-124}" y="${a+236}" width="248" height="16" rx="7" />
        ${[0,1,2,3,4].map(c=>`<rect class="baluster" x="${i-112+c*54}" y="${a+250}" width="13" height="52" rx="5" />`).join("")}
        <path class="balcony-arch" d="${le(i-96,a+60,192,178)}" />
        <g class="court-curtain" style="animation-delay:${n*.8}s">
          <path d="M ${i-92} ${a+64} L ${i-30} ${a+64} C ${i-38} ${a+140} ${i-34} ${a+200} ${i-26} ${a+236} L ${i-92} ${a+238} Z" />
        </g>
      </g>`).join("")}
  </g>

  <!-- ground-level arcade -->
  <g class="court-arcade">
    ${[760,1180,2500,2920].map(i=>`
      <path class="court-niche" d="${le(i-110,s-430,220,430)}" />`).join("")}
    ${ne(970,s-470,s,46)}
    ${ne(2710,s-470,s,46)}
  </g>

  <!-- moonlight falling into the open court -->
  ${be(1420,a+40,300,s-a-40,1.9)}
  ${be(2260,a+40,240,s-a-40,1.7)}

  <!-- lanterns -->
  ${ce(1300,a+40,-190,0)}
  ${ce(2380,a+40,-250,1.1)}
  ${ce(1820,a+40,-330,.55)}

  <!-- floor -->
  <rect class="court-floor" x="${e}" y="${s}" width="${t-e}" height="560" />
  <g class="court-tiles">
    ${Array.from({length:13},(i,n)=>`<rect x="${e+n*200}" y="${s}" width="5" height="560" />`).join("")}
    ${Array.from({length:4},(i,n)=>`<rect x="${e}" y="${s+90+n*120}" width="${t-e}" height="5" />`).join("")}
  </g>
  <rect class="court-step" x="${e}" y="${s-14}" width="${t-e}" height="18" rx="6" />

  ${Ue(o,s-30)}

  ${ee(760,s,1)}
  ${ee(2980,s,1.1)}
  ${ee(1140,s,.78)}
  ${ee(2620,s,.86)}

  ${ge(41,12,{x:e,y:-760,w:t-e,h:1200})}
</g>`}function De(){return`
<g class="ask-anchor">
<g class="ask-prompt" role="button" tabindex="0" aria-label="Ask for the secret">
  <ellipse class="ask-aura" cx="0" cy="0" rx="330" ry="120" />
  <rect class="ask-hit" x="-360" y="-130" width="720" height="260" rx="130" />
  <g class="ask-motes">
    ${[[-210,-46,0],[190,-62,.8],[-120,58,1.6],[240,40,2.2],[40,-86,1.2],[-260,18,2.8]].map(([e,t,s])=>`<circle cx="${e}" cy="${t}" r="5" style="animation-delay:${s}s" />`).join("")}
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
  ${[[-230,30,0],[-90,-40,.35],[70,10,.7],[220,-30,1.05],[-10,70,1.4],[160,80,1.75]].map(([t,s,o])=>`
    <text class="q" x="${t}" y="${s}" text-anchor="middle" style="animation-delay:${o}s">?</text>`).join("")}
</g>`}const Y={x0:-1560,x1:3520,roofY:-1320,baseY:1010};function Ve(){return`
<g class="kingdom">
  <rect class="kd-sky" x="-6000" y="-4200" width="16000" height="7600" />
  <g class="kd-stars is-still">
    ${[[-3200,-2600],[-2400,-1800],[-1e3,-3e3],[600,-2400],[2200,-2900],[4200,-2e3],[5400,-2700],[-4200,-1400],[3400,-3300],[1400,-3400],[-2e3,-3400],[4800,-1200]].map(([e,t],s)=>`<circle cx="${e}" cy="${t}" r="${18+s%3*8}" style="animation-delay:${s*.5}s" />`).join("")}
  </g>
  <circle class="kd-moon" cx="-2900" cy="-2500" r="210" />
  <path class="kd-hills" d="M -6000 1180 Q -3600 780 -1400 1120 Q 900 1420 3200 1060 Q 6200 700 10000 1160
    L 10000 3400 L -6000 3400 Z" />
  <path class="kd-hills far" d="M -6000 980 Q -3000 600 -600 940 Q 1800 1240 4400 860 Q 7400 520 10000 960
    L 10000 3400 L -6000 3400 Z" />
</g>`}function Ke(){const{x0:e,x1:t,roofY:s,baseY:o}=Y;return`
<g class="shell">
  <path class="shell-roof" d="M ${e-140} ${s+250} L ${(e+t)/2} ${s-210}
    L ${t+140} ${s+250} L ${t+140} ${s+330} L ${e-140} ${s+330} Z" />
  <rect class="shell-wall" x="${e}" y="${s+300}" width="220" height="${o-s-300}" />
  <rect class="shell-wall" x="${t-220}" y="${s+300}" width="220" height="${o-s-300}" />
  <rect class="shell-band" x="${e-60}" y="${s+300}" width="${t-e+120}" height="46" />
  <rect class="shell-base" x="${e-200}" y="${o}" width="${t-e+400}" height="150" />
  <g class="shell-windows">
    ${[-1460,-1380,3380,3440].map((a,i)=>`<rect class="shell-lit" x="${a}" y="${s+520+i%2*190}" width="52" height="104" rx="24"
             style="animation-delay:${i*.9}s" />`).join("")}
  </g>
</g>`}function Je(){const e={x0:-1200,x1:540,y0:-640,y1:A.floorY+120},t={x0:M.x0-20,x1:M.x1+20,y0:-800,y1:M.floorY+200},s={x0:Y.x0-80,x1:Y.x1+80,y0:Y.roofY-160,y1:Y.baseY+90};return`
<g class="layer-glows">
  <!-- 1 · her room -->
  <g class="lg lg-local">
    <rect class="lg-fill"   x="${e.x0}" y="${e.y0}" width="${e.x1-e.x0}" height="${e.y1-e.y0}" rx="26" />
    <rect class="lg-stroke" x="${e.x0}" y="${e.y0}" width="${e.x1-e.x0}" height="${e.y1-e.y0}" rx="26" />
  </g>

  <!-- 2 · the courtyard. Drawn growing OUT of the room, because it only counts
          as an enclosing space by virtue of the room sitting inside it. -->
  <g class="lg lg-enclosing">
    <rect class="lg-fill"   x="${t.x0}" y="${t.y0}" width="${t.x1-t.x0}" height="${t.y1-t.y0}" rx="30" />
    <rect class="lg-stroke" x="${t.x0}" y="${t.y0}" width="${t.x1-t.x0}" height="${t.y1-t.y0}" rx="30" />
    <path class="lg-link" d="M ${e.x1} ${A.floorY-200} L ${t.x0} ${A.floorY-200}" />
  </g>

  <!-- 3 · the whole palace -->
  <g class="lg lg-global">
    <rect class="lg-fill"   x="${s.x0}" y="${s.y0}" width="${s.x1-s.x0}" height="${s.y1-s.y0}" rx="46" />
    <rect class="lg-stroke" x="${s.x0}" y="${s.y0}" width="${s.x1-s.x0}" height="${s.y1-s.y0}" rx="46" />
  </g>

  <!-- 4 · everything beyond it -->
  <g class="lg lg-builtin">
    <rect class="lg-stroke outer" x="${s.x0-900}" y="${s.y0-820}"
          width="${s.x1-s.x0+1800}" height="${s.y1-s.y0+1700}" rx="120" />
  </g>
</g>`}function U(e,t,s,o,a=""){return`
<g class="mlabel mlabel-${e}" transform="translate(${s} ${o})">
  <g class="ml-motes">
    ${[[-150,-30,0],[140,-44,.6],[-60,46,1.2],[110,40,1.8],[10,-62,.9]].map(([n,c,d])=>`<circle r="7" style="--mx:${n}px; --my:${c}px; animation-delay:${d}s" />`).join("")}
  </g>
  <path class="ml-rule" d="M -172 52 Q 0 74 172 52" />
  <text class="ml-text" x="0" y="0" text-anchor="middle">${t}</text>
  ${a?`<text class="ml-note" x="0" y="112" text-anchor="middle">${a}</text>`:""}
</g>`}function et(){return`
<g class="perch-stand">
  <rect class="perch-post" x="-9" y="-250" width="18" height="250" rx="9" />
  <rect class="perch-bar"  x="-92" y="-262" width="184" height="16" rx="8" />
  <ellipse class="perch-foot" cx="0" cy="4" rx="74" ry="17" />
  <g class="perch-bird" transform="translate(0 -262) scale(0.62)">
    ${Ce()}
  </g>
</g>`}function tt(){return`
<g class="error-spell">
  <g class="err-smoke">
    ${[[-300,0,0],[-120,-40,.5],[80,20,1],[260,-30,1.5],[-40,60,.8],[190,70,1.9]].map(([e,t,s])=>`<ellipse cx="${e}" cy="${t}" rx="150" ry="70" style="animation-delay:${s}s" />`).join("")}
  </g>
  <g class="err-shards">
    ${[[-380,-90],[-190,110],[40,-130],[250,90],[420,-60],[-60,140]].map(([e,t],s)=>`<path d="M ${e} ${t} l 26 -46 l 20 52 z" style="animation-delay:${s*.14}s" />`).join("")}
  </g>
  <text class="err-text" x="0" y="0" text-anchor="middle">UnboundLocalError</text>
  <path class="err-crack" d="M -430 46 L -300 20 L -170 58 L -30 14 L 110 56 L 250 18 L 430 50" />
</g>`}function st(){return`
<g class="trails">
  <path class="read-out"   pathLength="100" d="M -360 -260 C 260 -780 1080 -1120 1800 -1160" />
  <path class="read-local" pathLength="100" d="M -360 -250 C -430 -300 -500 -320 -560 -308" />
  <path class="read-blocked" pathLength="100" d="M -360 -260 C -250 -300 -150 -330 -40 -344" />
  <g class="block-wall">
    <path class="bw-line" d="M 20 -520 L 20 -60" />
    <g class="bw-sparks">
      ${[-380,-280,-180].map((e,t)=>`<circle cx="20" cy="${e}" r="12" style="animation-delay:${t*.18}s" />`).join("")}
    </g>
  </g>
</g>`}const l={x:1600,y:300,w:380,h:520,scale:.225},E=980,ve=(()=>{let e=12345;const t=()=>(e=(e*9301+49297)%233280)/233280;return Array.from({length:44},()=>({x:-1400+t()*5e3,y:-1500+t()*1900,r:1.6+t()*3.4,d:(t()*6).toFixed(2),layer:t()<.4?"far":"near"}))})();function te(e,t,s,o,a){return`<g class="cloud" style="animation-delay:${o}s; animation-duration:${a}s"
     transform="translate(${e} ${t}) scale(${s})">
    <ellipse cx="0" cy="0" rx="200" ry="40" />
    <ellipse cx="-110" cy="14" rx="120" ry="30" />
    <ellipse cx="116" cy="16" rx="140" ry="34" />
    <ellipse cx="20" cy="-24" rx="96" ry="32" />
  </g>`}function he(e,t,s,o){return`<g class="flagpole-g">
    <rect class="flagpole" x="${e-3}" y="${t-s}" width="6" height="${s+26}" rx="3" />
    <circle class="flagpole" cx="${e}" cy="${t-s-5}" r="6" />
    <path class="pennant" style="animation-delay:${o}s"
      d="M ${e+3} ${t-s+2} L ${e+44} ${t-s+14} L ${e+3} ${t-s+26} Z" />
  </g>`}function at(){return`
<g class="sky-group">
  <rect x="-2600" y="-1900" width="8000" height="3400" fill="url(#nightSky)" />
  <circle cx="620" cy="-960" r="430" fill="url(#moonGlow)" />
  <circle class="moon" cx="620" cy="-960" r="104" />
  <circle class="moon-crater" cx="586" cy="-990" r="18" />
  <circle class="moon-crater" cx="650" cy="-930" r="12" />
  <circle class="moon-crater" cx="638" cy="-1004" r="9" />

  <g class="stars far">
    ${ve.filter(e=>e.layer==="far").map((e,t)=>`<circle class="${t%2?"still":""}" cx="${e.x}" cy="${e.y}" r="${e.r*.7}" style="animation-delay:${e.d}s" />`).join("")}
  </g>
  <g class="stars near">
    ${ve.filter(e=>e.layer==="near").map((e,t)=>`<circle class="${t%2?"still":""}" cx="${e.x}" cy="${e.y}" r="${e.r}" style="animation-delay:${e.d}s" />`).join("")}
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
  <rect class="stone" x="880" y="700" width="200" height="${E-700}" rx="6" />
  ${J(980,700,74,58)}
  <rect class="stone" x="2120" y="700" width="200" height="${E-700}" rx="6" />
  ${J(2220,700,74,58)}
  ${K(906,800,2,56,150,44,"lit")}
  ${K(2146,800,2,56,150,44,"lit")}

  <!-- flanking towers -->
  <rect class="stone" x="1120" y="420" width="112" height="${E-420}" rx="6" />
  ${se(1176,420,132,108)}
  <rect class="stone" x="1968" y="420" width="112" height="${E-420}" rx="6" />
  ${se(2024,420,132,108)}
  ${he(1176,306,62,0)}
  ${he(2024,306,62,1.3)}

  <!-- great hall -->
  <rect class="stone" x="1220" y="520" width="760" height="${E-520}" rx="8" />
  <rect class="stone-band" x="1258" y="486" width="684" height="42" rx="14" />
  ${se(1600,486,330,260)}
  ${he(1600,180,74,.7)}
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
  <ellipse class="hero-glow" cx="${l.x}" cy="${l.y}" rx="520" ry="560" />

  <!-- the room, mounted inside the opening and clipped to it -->
  <g class="portal" clip-path="url(#heroClip)">
    <g transform="translate(${l.x} ${l.y}) scale(${l.scale})">
      <!-- Behind everything, and only shown once the camera clears the roof. -->
      <g class="outer-world">
        ${Ve()}
        ${Ke()}
      </g>
      ${Be()}
      ${Xe()}
      <g class="tara-slot"></g>
      ${Je()}
      <g class="magic-labels">
        ${U("local","Local",-330,-900,"inside one function")}
        ${U("enclosing","Enclosing",1870,-1120,"a function written inside another")}
        ${U("global","Global",980,-1760,"the whole file")}
        ${U("builtin","Built-in",980,-2520,"names Python already knows")}
      </g>
      ${st()}
      ${et()}
      ${tt()}
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
        ${De()}
        ${Ye()}
        ${_e()}
      </g>
    </g>
  </g>

  <!-- frame and shutters sit over the opening -->
  <g class="hero-frame">
    <path class="frame-stone" d="M ${l.x-l.w/2-26} ${l.y+l.h/2+20}
      L ${l.x-l.w/2-26} ${l.y-70}
      Q ${l.x-l.w/2-26} ${l.y-l.h/2-60} ${l.x} ${l.y-l.h/2-86}
      Q ${l.x+l.w/2+26} ${l.y-l.h/2-60} ${l.x+l.w/2+26} ${l.y-70}
      L ${l.x+l.w/2+26} ${l.y+l.h/2+20}
      L ${l.x+l.w/2} ${l.y+l.h/2+20}
      L ${l.x+l.w/2} ${l.y-70}
      Q ${l.x+l.w/2} ${l.y-l.h/2-20} ${l.x} ${l.y-l.h/2-44}
      Q ${l.x-l.w/2} ${l.y-l.h/2-20} ${l.x-l.w/2} ${l.y-70}
      L ${l.x-l.w/2} ${l.y+l.h/2+20} Z" />
    <rect class="frame-sill" x="${l.x-l.w/2-44}" y="${l.y+l.h/2+12}"
          width="${l.w+88}" height="30" rx="12" />
  </g>

  <g class="shutter shutter-l">
    <rect x="${l.x-l.w/2}" y="${l.y-l.h/2-30}"
          width="${l.w/2}" height="${l.h+50}" rx="6" />
    <rect class="shutter-slat" x="${l.x-l.w/2+16}" y="${l.y-130}" width="${l.w/2-32}" height="10" rx="5" />
    <rect class="shutter-slat" x="${l.x-l.w/2+16}" y="${l.y-60}" width="${l.w/2-32}" height="10" rx="5" />
    <rect class="shutter-slat" x="${l.x-l.w/2+16}" y="${l.y+10}" width="${l.w/2-32}" height="10" rx="5" />
  </g>
  <g class="shutter shutter-r">
    <rect x="${l.x}" y="${l.y-l.h/2-30}"
          width="${l.w/2}" height="${l.h+50}" rx="6" />
    <rect class="shutter-slat" x="${l.x+16}" y="${l.y-130}" width="${l.w/2-32}" height="10" rx="5" />
    <rect class="shutter-slat" x="${l.x+16}" y="${l.y-60}" width="${l.w/2-32}" height="10" rx="5" />
    <rect class="shutter-slat" x="${l.x+16}" y="${l.y+10}" width="${l.w/2-32}" height="10" rx="5" />
  </g>
</g>

${ge(3,14,{x:700,y:200,w:1800,h:800})}`}function it(){return`<clipPath id="heroClip">
    <path d="M ${l.x-l.w/2} ${l.y+l.h/2+20}
      L ${l.x-l.w/2} ${l.y-70}
      Q ${l.x-l.w/2} ${l.y-l.h/2-20} ${l.x} ${l.y-l.h/2-44}
      Q ${l.x+l.w/2} ${l.y-l.h/2-20} ${l.x+l.w/2} ${l.y-70}
      L ${l.x+l.w/2} ${l.y+l.h/2+20} Z" />
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
</g>`}function Se(e){const t=Math.max(190,e.length*30+84);return`
<g class="spark-word" aria-hidden="true">
  <ellipse class="sw-aura" cx="0" cy="0" rx="${t*.78}" ry="74" />
  <rect class="sw-plate" x="${-t/2}" y="-38" width="${t}" height="76" rx="38" />
  <text class="sw-text" x="0" y="14" text-anchor="middle">${e}</text>
  <g class="sw-motes">
    ${[[-t*.4,-28,0],[t*.34,-34,.8],[-t*.2,36,1.6],[t*.44,26,2.3],[6,-52,1.1],[-t*.46,14,2.9]].map(([s,o,a])=>`<circle cx="${s}" cy="${o}" r="3.6" style="animation-delay:${a}s" />`).join("")}
  </g>
</g>`}function ot(e=26){let t=777;const s=()=>(t=(t*9301+49297)%233280)/233280;return`<g class="title-motes">${Array.from({length:e},()=>{const o=s()*Math.PI*2,a=300+s()*620;return`<circle r="${2+s()*3.2}"
      style="--fx:${(Math.cos(o)*a).toFixed(1)}px; --fy:${(Math.sin(o)*a*.6).toFixed(1)}px;
             animation-delay:${(s()*1.1).toFixed(2)}s" />`}).join("")}</g>`}const p=(e,t)=>({x:l.x+e*l.scale,y:l.y+t*l.scale});function _(e,t){const s=e.root.querySelector(".stage");s&&s.classList.toggle("is-deciding",t),e.root.classList.toggle("is-asking",t);const o=e.root.querySelector(".tara");o&&o.classList.toggle("is-attending",t)}async function Q(e,t="curious",{nod:s=!1,ms:o=900}={}){const a=e.root.querySelector(".tara");e.tara?.express?.(t),s&&a&&a.classList.add("mithu-alert"),await new Promise(i=>setTimeout(i,F?0:o)),s&&a&&a.classList.remove("mithu-alert")}function R(e,{question:t,options:s,kind:o="choice"}={}){const a=e.root.querySelector(".interact"),i=O();return new Promise(n=>{const c=document.createElement("div");c.className=`ask ask-${o}`,c.setAttribute("role","group"),c.setAttribute("aria-label",t);const d=document.createElement("p");d.className="ask-q",d.textContent=t,c.appendChild(d);const u=document.createElement("div");u.className="ask-options",c.appendChild(u);let m=!1;const w=()=>{m||(m=!0,_(e,!1),S(),c.classList.add("is-going"),setTimeout(()=>c.remove(),F?0:420))},L=v=>{m||([...u.children].forEach(k=>k.classList.toggle("is-chosen",k.dataset.value===String(v.value))),w(),i===O()&&n(v.value))};s.forEach((v,k)=>{const $=document.createElement("button");$.type="button",$.className="choice",$.dataset.value=String(v.value),$.innerHTML=`<span class="choice-label"></span>${v.note?'<span class="choice-note"></span>':""}`,$.querySelector(".choice-label").textContent=v.label,v.note&&($.querySelector(".choice-note").textContent=v.note),$.addEventListener("click",()=>L(v)),u.appendChild($),k===0&&requestAnimationFrame(()=>$.focus({preventScroll:!0}))});const S=we(()=>{m=!0,c.remove()});_(e,!0),a.appendChild(c),requestAnimationFrame(()=>c.classList.add("is-open"))})}function rt(e,{again:t="See it again",go:s="Continue"}={}){return R(e,{kind:"after",question:"",options:[{label:s,value:"continue"},{label:t,value:"again"}]})}async function N(e,t,s=2600){const o=e.root.querySelector(".interact"),a=O(),i=document.createElement("p");i.className="ask-said",i.setAttribute("role","status"),i.textContent=t,o.appendChild(i);const n=we(()=>i.remove());requestAnimationFrame(()=>i.classList.add("is-open")),await new Promise(c=>setTimeout(c,F?0:s)),n(),i.classList.remove("is-open"),setTimeout(()=>i.remove(),F?0:420),a!==O()&&await new Promise(()=>{})}async function ye(e,t){const{code:s=[],question:o,options:a,answer:i,hints:n=[],feedback:c={},reveal:d}=t,u=e.root.querySelector(".interact"),m=O();let w=0,L=!1;for(;;){const S=await new Promise(k=>{const $=document.createElement("div");if($.className="ask ask-predict",$.setAttribute("role","group"),$.setAttribute("aria-label",o),s.length){const T=document.createElement("pre");T.className="ask-code",T.textContent=s.join(`
`),$.appendChild(T)}const C=document.createElement("p");C.className="ask-q",C.textContent=o,$.appendChild(C);const I=document.createElement("div");I.className="ask-options",$.appendChild(I);const G=document.createElement("div");G.className="hint-rail",$.appendChild(G);let x=0,f=null;n.length&&(f=document.createElement("button"),f.type="button",f.className="hintbtn",f.innerHTML='<span aria-hidden="true">💡</span> Hint',f.addEventListener("click",()=>{L=!0;const T=document.createElement("p");T.className="hint",T.setAttribute("role","status"),T.textContent=n[x],G.appendChild(T),requestAnimationFrame(()=>T.classList.add("is-open")),x+=1,x>=n.length&&(f.disabled=!0)}),$.appendChild(f));let H=!1;const ze=T=>{H||(H=!0,_(e,!1),Re(),[...I.children].forEach(V=>V.classList.toggle("is-chosen",V.dataset.value===String(T.value))),$.classList.add("is-going"),setTimeout(()=>$.remove(),F?0:420),m===O()&&k(T.value))};a.forEach((T,V)=>{const W=document.createElement("button");W.type="button",W.className="choice choice-tight",W.dataset.value=String(T.value),W.textContent=T.label,W.addEventListener("click",()=>ze(T)),I.appendChild(W),V===0&&requestAnimationFrame(()=>W.focus({preventScroll:!0}))});const Re=we(()=>{H=!0,_(e,!1),$.remove()});_(e,!0),u.appendChild($),requestAnimationFrame(()=>$.classList.add("is-open"))});if(w+=1,S===i)return await N(e,c[S]||"That is it.",2400),{value:S,correct:!0,attempts:w,usedHint:L};if(await N(e,c[S]||"Not quite — look again at where it was made.",2600),w>=2)return d&&await N(e,d,3e3),{value:S,correct:!1,attempts:w,usedHint:L}}}const q={readyToWhisper:{question:"Tara has a secret word she wants to try.",options:[{value:"go",label:"Let her whisper it",note:"and see where it goes"}]},whatToDo:{question:"Tara has whispered a secret. What should she do?",options:[{value:"outside",label:"Take it outside",note:"see if it follows"},{value:"stay",label:"Keep it in the room",note:"say it again"}]},whereDidItGo:{question:"Her secret did not answer out here. Where is it?",options:[{value:"room",label:"Still in her room"},{value:"followed",label:"It followed her out"},{value:"gone",label:"It disappeared"}],answer:"room",feedback:{room:"Exactly. It never left the room it was made in.",followed:"Almost — that is what it feels like. Watch where it actually is.",gone:"Not gone. Look back at the room she came from."}},shadowPredict:{code:['name = "Mithu"',"","def room():",'    name = "Tara"',"    print(name)","","room()"],question:"What does this print?",options:[{value:"Tara",label:"Tara"},{value:"Mithu",label:"Mithu"},{value:"error",label:"An error"}],answer:"Tara",hints:["Look at where each name was made.","Is Tara inside the room, or outside it, when she reads it?"],feedback:{Tara:"Yes. Inside the room, her own name is the nearer one.",Mithu:"Almost. The palace still says Mithu — but Tara made her own copy inside.",error:"No error here. Both names exist; the question is which one is nearer."},reveal:"It prints Tara. The name made inside the room hides the one outside it."},errorPredict:{code:['name = "Mithu"',"","def room():","    print(name)",'    name = "Tara"',"","room()"],question:"And this one?",options:[{value:"error",label:"An error"},{value:"Mithu",label:"Mithu"},{value:"Tara",label:"Tara"}],answer:"error",hints:["Python reads the whole room before it runs a single line of it.","The room assigns to name somewhere. What does that make the name, everywhere in the room?"],feedback:{error:"Yes — UnboundLocalError. The room owns the name before it has a value.",Mithu:"That is the trap. Because the room assigns to name lower down, it never looks outside at all.",Tara:"Not yet — that line has not run when print is reached."},reveal:"It raises UnboundLocalError: the room claimed name the moment it was written, so there is nothing outside to fall back to."},lookNext:{question:"It is not in her room. Where should Python look next?",options:[{value:"enclosing",label:"The space just outside",note:"one step out"},{value:"global",label:"Straight to the palace"},{value:"stop",label:"Stop looking"}],answer:"enclosing",feedback:{enclosing:"Yes — one step out at a time, never a jump.",global:"It IS in the palace. But Python does not skip — it checks the space just outside first.",stop:"Not yet. A name missing from the room is normal; Python keeps looking outward."}},whoMadePrint:{question:"And print — who made that one?",options:[{value:"python",label:"Nobody. Python already knew it"},{value:"tara",label:"Tara did"},{value:"palace",label:"The palace holds it"}],answer:"python",feedback:{python:"Yes. It was never written here. It is built in.",tara:"She never wrote it — and it worked the very first time she used it.",palace:"Not the palace either. Search the whole file and print is nowhere in it."}},changeThePalace:{question:"She wants to change the palace’s name, not make another copy. What does she need?",options:[{value:"declare",label:"Tell Python she means the palace’s one"},{value:"louder",label:"Say it louder"},{value:"again",label:"Write it again"}],answer:"declare",feedback:{declare:"Exactly. That is what the word global does.",louder:"Volume is not the problem — the room keeps making its own copy however loudly she says it.",again:"Writing it again in her room just makes the same local copy a second time."}},whichReach:{code:["def palace():",'    name = "Mithu"',"","    def room():","        ???  name",'        name = "Tara"'],question:"She means the room around her, not the whole palace. Which word?",options:[{value:"nonlocal",label:"nonlocal"},{value:"global",label:"global"}],answer:"nonlocal",hints:["One of these reaches all the way out to the file. The other stops one step out."],feedback:{nonlocal:"Yes. nonlocal reaches the enclosing room and stops there.",global:"global would skip past the surrounding room and rebind the name at the very top of the file."},reveal:"nonlocal — it reaches the enclosing function, never the module."}},qe={x:26,y:176},B=A.wallX;async function lt(e){const{camera:t,tara:s,spark:o,hers:a,ui:i,root:n}=e,c=n.querySelector(".room"),d=n.querySelector(".wall-ripple");i.classList.contains("show-title")&&(i.classList.add("title-out"),await r(900),i.classList.remove("show-title","show-sub","title-out")),o.moveTo(470,-330,{duration:1500,easing:y.inOut}),n.querySelector(".spark-slot").classList.add("is-dimmed"),await t.to({...p(s.x-30,150),zoom:t.fitRoom(1569),duration:1400}),s.express("curious"),await r(500),await t.to({...p(s.x+10,70),zoom:t.fitRoom(1067),duration:1400}),await r(400),await R(e,q.readyToWhisper),s.setPose("whisper"),await r(500),a.at(s.x+qe.x,s.y-qe.y).setScale(.06),a.el.classList.add("is-live"),await r(300),await a.scaleTo(1,{duration:1e3,easing:y.back}),a.el.classList.add("is-word"),await r(400),s.setPose("idle"),s.express("happy"),await P(a.moveTo(s.x+120,s.y-330,{duration:1400,easing:y.out}),t.to({...p(s.x+60,-60),zoom:t.fitRoom(1356),duration:1400})),await r(400),s.express("curious"),t.follow(a,{map:(m,w)=>p(m,w),offsetY:60,lag:.035}),await a.moveTo(-180,-400,{duration:1400,easing:y.inOut}),await a.moveTo(-430,-250,{duration:1400,easing:y.inOut}),await P(s.walkTo(-320,{speed:200}),a.moveTo(-700,-320,{duration:1400,easing:y.inOut})),await a.moveTo(B,-300,{duration:1400,easing:y.in}),d.setAttribute("transform",`translate(${B-20} -300)`),d.classList.remove("is-hit"),d.getBoundingClientRect(),d.classList.add("is-hit"),a.el.classList.add("is-bouncing"),t.shake(9),await a.moveTo(B+250,-350,{duration:700,easing:y.out}),a.el.classList.remove("is-bouncing"),t.unfollow(),await t.to({...p(-520,-190),zoom:t.fitRoom(1455),duration:1200}),s.express("surprised"),await r(500),s.express("curious"),t.follow(a,{map:(m,w)=>p(m,w),offsetY:40,lag:.03}),await a.moveTo(B+30,-270,{duration:1400,easing:y.inOut}),d.classList.remove("is-hit"),d.getBoundingClientRect(),d.setAttribute("transform",`translate(${B-10} -270)`),d.classList.add("is-hit"),a.el.classList.add("is-straining"),t.shake(5),await r(600),a.el.classList.add("is-fading"),await r(900),a.el.classList.remove("is-live","is-word","is-straining","is-fading"),t.unfollow(),await t.to({...p(-560,-60),zoom:t.fitRoom(1379),duration:1400}),s.express("confused"),await r(600),await s.walkTo(-760,{speed:150}),await s.face("left"),s.setPose("touch"),c.classList.add("wall-felt"),await r(1e3),n.querySelector(".tara").classList.add("mithu-alert"),await r(700),s.setPose("idle"),await s.face("right"),s.express("curious"),await t.to({...p(-420,-40),zoom:t.fitRoom(1905),duration:1400}),await r(400),n.querySelector(".room-door").classList.add("is-noticed"),await r(800),i.dataset.line="far",i.classList.add("show-line"),await r(4e3),i.classList.remove("show-line"),c.classList.remove("wall-felt"),n.querySelector(".tara").classList.remove("mithu-alert"),await r(300),e.journey.at("local"),await e.journey.flash(1800);let u=await R(e,q.whatToDo);for(await Q(e,u==="outside"?"curious":"neutral",{ms:700});u==="stay";)await t.to({...p(s.x-20,60),zoom:t.fitRoom(1330),duration:1200}),s.setPose("whisper"),await r(700),s.setPose("idle"),a.el.classList.add("is-beckoning"),await r(900),a.el.classList.remove("is-beckoning"),c.classList.add("wall-felt"),await r(700),c.classList.remove("wall-felt"),s.express("confused"),await r(900),u=await R(e,{question:"The same wall, every time. Should she try outside?",options:[{value:"outside",label:"Take it outside",note:"find out why"},{value:"stay",label:"Try once more"}]});n.querySelector(".room-door").classList.remove("is-noticed"),await r(300)}async function nt(e){const{camera:t,tara:s,hers:o,ui:a,root:i}=e,n=i.querySelector(".room-door"),c=i.querySelector(".ask-prompt"),d=i.querySelector(".ask-anchor"),u=i.querySelector(".ask-speech"),m=i.querySelector(".ask-speech-anchor"),w=i.querySelector(".q-motes");o.at(-620,-240).setScale(1),o.el.classList.add("is-live","is-word","is-homebound"),await r(400),i.querySelector(".tara").classList.add("mithu-alert"),await r(500),s.express("curious"),await s.face("right"),await r(300),n.classList.add("is-open"),await r(500),t.follow(s,{map:(S,v)=>p(S,v),offsetY:-150,lag:.028}),await s.walkTo(A.doorX+40,{speed:210}),await r(400),await s.walkTo(M.x0+300,{speed:200}),t.unfollow(),await t.to({...p(M.centreX-260,-120),zoom:t.fitRoom(3077),duration:2300,easing:y.inOut}),s.express("surprised"),await r(500),await s.face("left"),await r(300),await s.face("right"),s.express("curious"),await r(400),d.setAttribute("transform",`translate(${M.askX} -470)`),await t.to({...p(M.askX,-250),zoom:t.fitRoom(2150),duration:1600,easing:y.inOut}),await s.face("right"),c.classList.add("is-offered"),await new Promise(S=>{const v=setTimeout(()=>c.classList.add("is-urging"),7e3),k=()=>{clearTimeout(v),c.classList.remove("is-urging"),c.removeEventListener("click",k),c.removeEventListener("keydown",$),S()},$=C=>{(C.key==="Enter"||C.key===" ")&&(C.preventDefault(),k())};c.addEventListener("click",k),c.addEventListener("keydown",$)}),c.classList.remove("is-offered"),c.classList.add("is-taken"),await P(s.walkTo(M.askX,{speed:190}),t.to({...p(M.askX+60,-180),zoom:t.fitRoom(2667),duration:1700})),await r(300),await s.face("left"),await r(300),s.setPose("reach"),s.express("curious"),m.setAttribute("transform",`translate(${M.askX+30} -330)`),u.classList.add("is-spoken"),await r(1100),s.setPose("idle"),u.classList.remove("is-spoken"),w.setAttribute("transform",`translate(${M.askX+40} -420)`),w.classList.add("is-asking"),i.querySelector(".courtyard").classList.add("is-hushed"),await r(1100),w.classList.remove("is-asking"),s.express("confused"),i.querySelector(".tara").classList.add("mithu-alert"),await r(700);const L=await R(e,q.whereDidItGo);await Q(e,L===q.whereDidItGo.answer?"happy":"confused",{nod:!0,ms:800}),await N(e,q.whereDidItGo.feedback[L],2400),await s.face("left"),await r(300),await t.to({...p(700,-180),zoom:t.fitRoom(4706),duration:2300,easing:y.inOut}),o.el.classList.add("is-beckoning"),await r(1100),a.dataset.line="born",a.classList.add("show-line"),await r(4800),a.classList.remove("show-line"),await r(400),e.journey.done("local").at("enclosing"),i.querySelector(".tara").classList.remove("mithu-alert"),i.querySelector(".courtyard").classList.remove("is-hushed"),o.el.classList.remove("is-beckoning")}const ct=[{id:"local",cls:"lg-local"},{id:"enclosing",cls:"lg-enclosing"},{id:"global",cls:"lg-global"},{id:"builtin",cls:"lg-builtin"}];async function ht(e){const{camera:t,tara:s,code:o,ui:a,root:i}=e,n=i.querySelector(".layer-glows"),c=i.querySelector(".magic-labels");s.setPose("idle").express("curious"),await t.to({...p(900,-420),zoom:t.zoomToFitWidth(1080),duration:2300,easing:y.inOut}),await r(300),i.querySelector(".portal").classList.add("show-shell"),await t.to({...p(980,-940),zoom:t.zoomToFitWidth(1760),duration:2600,easing:y.inOut}),await r(500),n.classList.add("is-live");for(const d of ct)i.querySelector(`.${d.cls}`).classList.add("is-lit"),await r(400),c.querySelector(`.mlabel-${d.id}`).classList.add("is-named"),await r(900);await r(500),a.dataset.line="names",a.classList.add("show-line"),await r(3600),a.classList.remove("show-line"),a.dataset.line="legb",a.classList.add("show-line"),await r(4600),a.classList.remove("show-line"),o.dock(),await o.write(['name = "Mithu"'],{stagger:0}),o.note(0,"Global — out in the open palace"),await r(1600)}const dt=[{cls:"lg-local",found:!1,note:"not in room() — look outward"},{cls:"lg-enclosing",found:!1,note:"not in the enclosing space either"},{cls:"lg-global",found:!0,note:"found it — the palace name"}];async function ut(e){const{camera:t,tara:s,spark:o,hers:a,code:i,ui:n,root:c}=e,d=c.querySelector(".layer-glows"),u=c.querySelector(".tara");c.querySelectorAll(".mlabel").forEach(w=>w.classList.remove("is-named")),c.querySelectorAll(".lg").forEach(w=>w.classList.remove("is-lit")),o.setText("MITHU").at(1900,-1180).setScale(1),o.el.classList.remove("is-dimmed"),o.el.classList.add("is-live","is-word","is-outer"),await t.to({...p(760,-560),zoom:t.zoomToFitWidth(1180),duration:1700}),s.express("curious"),await r(500),u.classList.add("mithu-alert"),n.dataset.line="wider",n.classList.add("show-line"),await r(3400),n.classList.remove("show-line"),u.classList.remove("mithu-alert"),i.clearNotes(),await i.append(["","def room():","    print(name)"],{stagger:380}),i.focus(3),await r(500),u.classList.add("has-lantern"),await r(500),d.classList.add("is-live","is-searching");for(const w of dt){if(w.cls==="lg-enclosing"){const S=await R(e,q.lookNext);await Q(e,S===q.lookNext.answer?"happy":"curious",{ms:700}),await N(e,q.lookNext.feedback[S],2600),e.journey.at("enclosing")}const L=c.querySelector(`.${w.cls}`);L.classList.add("is-lit","is-probing"),i.note(3,w.note),w.cls==="lg-enclosing"&&P(s.walkTo(M.centreX-200,{speed:230}),t.to({...p(900,-640),zoom:t.zoomToFitWidth(1420),duration:1800})),w.cls==="lg-global"&&t.to({...p(980,-860),zoom:t.zoomToFitWidth(1780),duration:1900}),await r(1100),w.found?(e.journey.done("enclosing").at("global"),L.classList.remove("is-probing"),L.classList.add("is-found"),o.el.classList.add("is-answering"),i.mark(3,"is-ok"),s.express("happy"),t.shake(5),await r(1400)):(L.classList.remove("is-probing"),L.classList.add("is-empty"),await r(300))}await r(800),i.unmark("is-ok"),i.note(3,"and print? found in the outermost ring"),c.querySelector(".lg-builtin").classList.add("is-lit","is-found"),c.querySelector(".mlabel-builtin").classList.add("is-named"),await r(1e3),e.journey.done("global").at("builtin");const m=await R(e,q.whoMadePrint);await Q(e,m===q.whoMadePrint.answer?"happy":"surprised",{nod:!0,ms:800}),await N(e,q.whoMadePrint.feedback[m],2800),n.dataset.line="builtin",n.classList.add("show-line"),await r(4400),n.classList.remove("show-line"),c.querySelector(".mlabel-builtin").classList.remove("is-named"),c.querySelectorAll(".lg").forEach(w=>w.classList.remove("is-empty","is-found")),d.classList.remove("is-searching"),o.el.classList.remove("is-answering"),i.unfocus(),i.clearNotes()}const de={x:-560,y:-300};async function mt(e){const{camera:t,tara:s,spark:o,hers:a,code:i,ui:n,root:c}=e,d=c.querySelector(".tara");await P(s.walkTo(A.taraX-120,{speed:240}),t.to({...p(-120,-240),zoom:t.zoomToFitWidth(760),duration:2200})),d.classList.remove("has-lantern"),await s.face("right"),s.express("curious"),await r(500),s.setPose("whisper"),await r(500),a.setText("MITHU").at(de.x,de.y).setScale(.05),a.el.classList.remove("is-homebound","is-beckoning"),a.el.classList.add("is-live","is-inner"),await a.scaleTo(1,{duration:1e3,easing:y.back}),a.el.classList.add("is-word"),s.setPose("idle"),await i.retype(3,'    name = "Tara"'),i.mark(3,"is-claim"),i.note(3,"assigning MAKES a new local name"),await i.append(["    print(name)"],{stagger:0}),await r(1e3),await t.to({...p(560,-620),zoom:t.zoomToFitWidth(1500),duration:1800}),await r(800),await t.to({...p(-260,-260),zoom:t.zoomToFitWidth(820),duration:1600}),await s.walkTo(de.x+250,{speed:200}),await s.face("left"),s.setPose("reach"),await r(300),a.el.classList.add("is-touched"),t.shake(4),await a.morphTo("TARA",{duration:1100}),a.el.classList.remove("is-touched"),s.setPose("idle"),s.express("surprised"),await r(500),await t.to({...p(620,-640),zoom:t.zoomToFitWidth(1560),duration:1800}),o.el.classList.add("is-answering"),i.note(0,"untouched"),await r(1100),o.el.classList.remove("is-answering"),i.note(0,""),s.express("happy"),d.classList.add("mithu-alert"),await r(800),d.classList.remove("mithu-alert");const u=c.querySelector(".mlabel-local");u.classList.add("is-named","is-inline"),await r(1700),i.unmark("is-claim"),i.focus(3),await r(700),n.dataset.line="readassign",n.classList.add("show-line"),await r(4400),n.classList.remove("show-line"),i.unfocus();const m=await ye(e,q.shadowPredict);await Q(e,m.correct?"happy":"curious",{nod:!0,ms:800}),await t.to({...p(-160,-420),zoom:t.zoomToFitWidth(1120),duration:1800}),await r(400),c.querySelector(".reach").classList.add("show-shadow"),o.el.classList.add("is-shadowed"),a.el.classList.add("is-shadowing"),i.focus(4),i.note(4,"finds the local one; outer is hidden"),await r(1400),n.dataset.line="hides",n.classList.add("show-line"),await r(4200),n.classList.remove("show-line"),await r(500),i.unfocus(),i.clearNotes(),u.classList.remove("is-inline","is-named")}async function wt(e){const{camera:t,tara:s,spark:o,hers:a,code:i,ui:n,root:c}=e,d=c.querySelector(".tara"),u=c.querySelector(".reach");u.classList.remove("show-shadow"),o.el.classList.remove("is-shadowed"),a.el.classList.remove("is-shadowing"),await r(400),await t.to({...p(400,-620),zoom:t.zoomToFitWidth(1420),duration:1800}),await s.face("right"),s.express("curious"),await r(700),d.classList.add("mithu-alert"),n.dataset.line="speak",n.classList.add("show-line"),await r(3600),n.classList.remove("show-line"),d.classList.remove("mithu-alert");const m=await R(e,q.changeThePalace);await Q(e,m===q.changeThePalace.answer?"happy":"confused",{nod:!0,ms:800}),await N(e,q.changeThePalace.feedback[m],2800),await t.to({...p(-200,-300),zoom:t.zoomToFitWidth(880),duration:1600}),d.classList.add("has-megaphone"),await r(500),s.setPose("reach"),s.express("happy"),await r(500),await t.to({...p(700,-700),zoom:t.zoomToFitWidth(1620),duration:1700}),await i.retype(3,"    global name"),i.mark(3,"is-claim"),i.note(3,"rebinds the palace name, not a local one"),await i.append(['    name = "Tara"'],{stagger:0}),await r(800),u.classList.add("show-global"),t.shake(6),await r(1100),o.el.classList.add("is-touched"),await o.morphTo("TARA",{duration:1200}),o.el.classList.remove("is-touched"),o.el.classList.add("is-answering"),t.shake(8),await r(1100),s.setPose("idle"),o.el.classList.remove("is-answering"),u.classList.remove("show-global"),d.classList.remove("has-megaphone"),await r(500);const w=c.querySelector(".mlabel-global");w.classList.add("is-named","is-inline"),await r(1700),w.classList.remove("is-inline","is-named"),await t.to({...p(260,-420),zoom:t.zoomToFitWidth(1240),duration:1700}),d.classList.add("mithu-alert"),i.unmark("is-claim"),i.clearNotes(),await i.write(["def palace():",'    name = "Mithu"',"","    def room():","        nonlocal name",'        name = "Tara"'],{stagger:300}),i.focus(4),i.note(4,"reaches the ENCLOSING room only"),u.classList.add("show-nonlocal"),await r(1100),await ye(e,q.whichReach),n.dataset.line="nonlocal",n.classList.add("show-line"),await r(4600),n.classList.remove("show-line"),u.classList.remove("show-nonlocal"),d.classList.remove("mithu-alert"),i.unfocus(),i.clearNotes(),s.express("happy"),await r(700)}async function pt(e){const{camera:t,tara:s,spark:o,hers:a,code:i,ui:n,root:c}=e,d=c.querySelector(".tara"),u=c.querySelector(".trails"),m=c.querySelector(".error-spell");o.setText("MITHU").at(1900,-1180),o.el.classList.add("is-live","is-word","is-outer"),o.el.classList.remove("is-shadowed"),a.el.classList.remove("is-word","is-live","is-inner","is-shadowing","is-hollow"),await t.to({...p(40,-140),zoom:t.fitRoom(1500),duration:2e3}),await s.face("right"),s.express("curious"),await i.write(['name = "Mithu"',"","def room():","    print(name)",'    name = "Tara"'],{stagger:300}),await r(500),u.classList.add("show-out"),o.el.classList.add("is-answering"),await r(1100),u.classList.remove("show-out"),o.el.classList.remove("is-answering"),await r(400);const w=await ye(e,q.errorPredict);await Q(e,w.correct?"happy":"surprised",{nod:!0,ms:850}),await t.to({...p(-380,-200),zoom:t.fitRoom(1e3),duration:1600}),await s.face("left"),s.setPose("reach"),await r(400),a.setText("name").at(-560,-300).setScale(.1),a.el.classList.add("is-live","is-hollow"),await a.scaleTo(1,{duration:900,easing:y.back}),a.el.classList.add("is-word"),t.shake(4),s.setPose("idle"),await r(700),a.el.classList.add("is-claimed"),i.focus(4),i.note(4,"seen first — so name is local everywhere"),await r(1400),s.setPose("reach"),s.express("curious"),u.classList.add("show-local"),i.focus(3),i.note(3,"runs first — local name still empty"),await r(1e3),a.el.classList.add("is-hollow-pulse"),await r(800),u.classList.remove("show-local"),await t.to({...p(140,-300),zoom:t.fitRoom(1700),duration:1600}),u.classList.add("show-blocked"),await r(500),u.classList.add("is-barred"),t.shake(9),s.setPose("surprise"),s.express("surprised"),d.classList.add("mithu-alert"),await r(800),u.classList.remove("show-blocked","is-barred"),c.querySelector(".stage").classList.add("is-darkened"),m.setAttribute("transform","translate(120 -760)"),m.classList.add("is-cast"),i.mark(3,"is-error"),i.focus(3),t.shake(12),await r(1400),n.dataset.line="claimed",n.classList.add("show-line"),await r(4200),n.classList.remove("show-line"),await r(300),n.dataset.line="lookedthere",n.classList.add("show-line"),await r(4400),n.classList.remove("show-line"),await rt(e,{again:"See that again",go:"I follow — continue"})==="again"&&(m.classList.remove("is-cast"),await r(500),u.classList.add("show-blocked","is-barred"),m.classList.add("is-cast"),i.mark(3,"is-error"),t.shake(7),await r(2600),u.classList.remove("show-blocked","is-barred")),await r(700),m.classList.remove("is-cast"),c.querySelector(".stage").classList.remove("is-darkened"),d.classList.remove("mithu-alert"),s.setPose("idle"),a.el.classList.remove("is-hollow-pulse"),i.unmark("is-error"),i.unfocus(),i.clearNotes(),await r(500)}async function gt(e){const{camera:t,tara:s,hers:o,code:a,ui:i,root:n}=e,c=n.querySelector(".tara"),d=n.querySelector(".perch-stand");await P(s.walkTo(A.taraX-220,{speed:200}),t.to({...p(-120,-260),zoom:t.fitRoom(1300),duration:1900})),await s.face("right"),s.setPose("sit"),s.express("curious"),d.setAttribute("transform",`translate(${A.taraX+190} ${A.floorY})`),d.classList.add("is-up"),c.classList.add("mithu-away"),await r(500),i.dataset.line="rules",i.classList.add("show-line"),await r(3800),i.classList.remove("show-line"),a.dock(),await a.clear({duration:300}),await t.to({...p(-40,-300),zoom:t.fitRoom(1150),duration:1600}),await r(400),await a.write(["len = 5",'print(len("palace"))'],{stagger:380}),await r(300),a.focus(0),a.note(0,"this hides the built-in len"),n.querySelector(".lg-builtin").classList.add("is-lit"),n.querySelector(".mlabel-builtin").classList.add("is-named"),await r(900),a.focus(1),a.mark(1,"is-error"),a.note(1,"TypeError — 5 is not a function"),t.shake(6),s.express("surprised"),await r(1100),e.journey.done("builtin"),i.dataset.line="shadowbuiltin",i.classList.add("show-line"),await r(4400),i.classList.remove("show-line"),n.querySelector(".mlabel-builtin").classList.remove("is-named"),n.querySelector(".lg-builtin").classList.remove("is-lit"),a.unfocus(),a.unmark("is-error"),a.clearNotes(),await a.clear(),s.express("curious"),await t.to({...p(-140,-180),zoom:t.fitRoom(1500),duration:1600}),s.setPose("idle");for(let u=0;u<2;u+=1)await s.walkTo(A.taraX-160,{speed:240}),o.setText("TARA").at(-560,-300).setScale(.1),o.el.classList.remove("is-hollow","is-claimed"),o.el.classList.add("is-live","is-inner"),await o.scaleTo(1,{duration:700,easing:y.back}),o.el.classList.add("is-word"),await r(500),await s.walkTo(A.doorX+60,{speed:240}),o.el.classList.add("is-clearing"),await r(400),o.el.classList.remove("is-live","is-word","is-clearing","is-inner"),await r(300);i.dataset.line="freshcall",i.classList.add("show-line"),await r(4e3),i.classList.remove("show-line"),await s.face("right"),s.express("happy"),await t.to({...p(-60,-280),zoom:t.fitRoom(1050),duration:1500}),await r(500),i.dataset.line="begins",i.classList.add("show-line"),await r(4400),i.classList.remove("show-line"),await r(500)}const ie=["local","enclosing","global","builtin"],yt=[{name:"secret",target:0},{name:"place",target:1},{name:"name",target:2},{name:"print",target:3}],$t=[{line:6,id:"local",note:"Local — this call only"},{line:3,id:"enclosing",note:"Enclosing — the function wrapped around it"},{line:0,id:"global",note:"Global — the top level of the file"},{line:7,id:"builtin",note:"print — Built-in, always there"}];function Pe(e){ie.forEach(t=>{e.querySelector(`.lg-${t}`).classList.remove("is-lit","is-probing","is-found","is-empty")})}async function ft(e,t,s,o){Pe(e),t.setText(s).at(1900,-1180).setScale(1),t.el.classList.remove("is-dimmed","is-answering"),t.el.classList.add("is-live","is-word"),await r(900);for(let a=0;a<=o;a+=1){const i=e.querySelector(`.lg-${ie[a]}`);i.classList.add("is-lit","is-probing"),await r(a===o?850:600),i.classList.remove("is-probing"),a===o?(i.classList.add("is-found"),e.querySelector(`.mlabel-${ie[a]}`).classList.add("is-named"),t.el.classList.add("is-answering"),await r(1700),e.querySelector(`.mlabel-${ie[a]}`).classList.remove("is-named"),t.el.classList.remove("is-answering")):(i.classList.add("is-empty"),await r(260))}await r(400)}async function xt(e){const{camera:t,tara:s,spark:o,hers:a,code:i,ui:n,root:c}=e,d=c.querySelector(".tara"),u=c.querySelector(".perch-stand");await i.clear(),u.classList.remove("is-up"),d.classList.remove("mithu-away"),c.querySelectorAll(".mlabel").forEach(m=>m.classList.remove("is-named","is-inline")),c.querySelectorAll(".lg").forEach(m=>m.classList.remove("is-lit")),await r(600),s.setPose("idle").express("happy"),await P(s.walkTo(M.centreX+620,{speed:190}),t.to({...p(M.centreX+300,-260),zoom:t.fitRoom(2200),duration:4100})),await s.face("right"),await r(600),c.querySelector(".portal").classList.add("show-shell","is-warming"),await t.to({...p(900,-620),zoom:t.fitRoom(3200),duration:3e3}),a.el.classList.add("is-settled"),o.el.classList.add("is-settled"),d.classList.add("looks-out"),s.express("happy"),await r(900),n.dataset.line="belong",n.classList.add("show-line"),await r(3400),n.classList.remove("show-line"),await t.to({...p(980,-940),zoom:t.zoomToFitWidth(1760),duration:3e3}),c.querySelector(".layer-glows").classList.add("is-live"),await r(700),n.dataset.line="fourplaces",n.classList.add("show-line"),await r(3400),n.classList.remove("show-line");for(const{name:m,target:w}of yt)await ft(c,o,m,w);Pe(c),o.el.classList.remove("is-live","is-word"),await r(800),i.undock(),await i.write(['name = "Mithu"',"","def palace():",'    place = "courtyard"',"","    def room():",'        secret = "laddoo"',"        print(name, place, secret)"],{stagger:300}),await r(900),c.querySelector(".layer-glows").classList.add("is-soft");for(const{line:m,id:w,note:L}of $t)i.focus(m),i.note(m,L),c.querySelector(`.lg-${w}`).classList.add("is-lit"),c.querySelector(`.mlabel-${w}`).classList.add("is-named"),await r(2600),c.querySelector(`.mlabel-${w}`).classList.remove("is-named");i.unfocus(),await r(900),n.dataset.line="legb",n.classList.add("show-line"),await r(4600),n.classList.remove("show-line"),await r(500),n.dataset.line="assignrule",n.classList.add("show-line"),await r(4800),n.classList.remove("show-line"),await r(600),await i.clear(),c.querySelectorAll(".mlabel").forEach(m=>m.classList.add("is-fading")),c.querySelectorAll(".lg").forEach(m=>m.classList.add("is-fading")),await r(1100),c.querySelectorAll(".mlabel").forEach(m=>m.classList.remove("is-named","is-fading")),c.querySelectorAll(".lg").forEach(m=>m.classList.remove("is-lit","is-fading")),c.querySelector(".layer-glows").classList.remove("is-soft"),await t.to({...p(900,-820),zoom:t.zoomToFitWidth(1900),duration:3e3}),await r(600),n.dataset.line="bridge",n.classList.add("show-line"),await r(4200),n.classList.remove("show-line"),await r(400),n.classList.add("is-ending"),n.classList.add("show-title"),await r(4200),n.classList.add("show-sub"),await r(1600),c.querySelector(".replay").classList.add("is-offered")}async function Lt(e){const{camera:t,tara:s,spark:o,ui:a}=e;t.set({x:300,y:-1080,zoom:t.zoomToFitWidth(2e3)}),s.setPose("idle").express("neutral"),await r(400);const i=(async()=>{a.dataset.line="premise",a.classList.add("show-line"),await r(2100),a.dataset.line="premise2",await r(2100),a.dataset.line="premise3",await r(2200),a.classList.remove("show-line")})();await t.to({x:1150,y:-560,zoom:t.zoomToFitWidth(2300),duration:2300,easing:y.inOut}),await t.to({x:1600,y:420,zoom:t.zoomToFitWidth(1900),duration:2600,easing:y.inOut}),await i,await r(400),await t.to({x:l.x,y:l.y,zoom:t.zoomToFitWidth(780),duration:1800,easing:y.inOut}),e.root.querySelector(".hero-window").classList.add("is-open"),await r(2500),s.express("curious"),await s.face("right"),await r(600),await t.to({x:l.x,y:l.y,zoom:t.zoomToFitWidth(540),duration:1800,easing:y.inOut});const n=t.to({...p(0,40),zoom:t.fitRoom(1739),duration:2600,easing:y.inOut});await r(1900),e.root.querySelector(".portal").classList.add("is-inside"),e.root.querySelector(".hero-window").classList.add("is-passed"),await n,await t.to({...p(-40,90),zoom:t.fitRoom(1667),duration:1800}),await r(600),await P(s.walkTo(A.taraX-360,{speed:210}),t.to({...p(-220,110),zoom:t.fitRoom(1684),duration:2300})),await r(700),await s.face("right"),await r(500),o.el.classList.add("is-live"),await o.moveTo(360,-160,{duration:1600,easing:y.out}),s.express("curious"),await r(700),await P(o.moveTo(-60,-60,{duration:2e3,easing:y.inOut}),t.to({...p(-160,40),zoom:t.fitRoom(1481),duration:2e3})),s.setPose("reach"),await r(520),await o.moveTo(300,-240,{duration:900,easing:y.out}),s.setPose("idle"),s.express("surprised"),t.shake(5),await r(700),s.express("curious"),await P(s.walkTo(A.taraX-60,{speed:190}),t.to({...p(40,-10),zoom:t.fitRoom(1569),duration:1800})),await r(500),await o.moveTo(150,-170,{duration:1100,easing:y.inOut}),await r(400),o.el.classList.add("is-word"),t.shake(7),s.setPose("surprise"),s.express("surprised"),await r(1400),s.setPose("idle"),s.express("curious"),await r(1600),await t.to({...p(30,10),zoom:t.fitRoom(1778),duration:2e3}),a.classList.add("show-title"),await r(3400),a.classList.add("show-sub"),await r(3e3)}const bt=[Lt,lt,nt,ht,ut,mt,wt,pt,gt,xt];async function vt(e){for(const t of bt)await t(e)}const Ee=[{id:"local",name:"Local"},{id:"enclosing",name:"Enclosing"},{id:"global",name:"Global"},{id:"builtin",name:"Built-in"}];function kt(){return`
<nav class="journey" aria-label="Story progress">
  <span class="journey-title">Palace Journey</span>
  <ol class="journey-steps">
    ${Ee.map(e=>`
      <li class="jstep" data-id="${e.id}">
        <span class="jlamp" aria-hidden="true"></span>
        <span class="jname">${e.name}</span>
      </li>`).join("")}
  </ol>
</nav>`}class St{constructor(t){this.el=t,this.steps=new Map([...t.querySelectorAll(".jstep")].map(s=>[s.dataset.id,s])),this.order=Ee.map(s=>s.id),this.furthest=-1}at(t){const s=this.order.indexOf(t);if(s<this.furthest)return this;this.furthest=s;for(const[o,a]of this.steps)a.classList.toggle("is-here",o===t),o===t?a.setAttribute("aria-current","step"):a.removeAttribute("aria-current");return this.el.classList.add("is-shown"),this}done(t){const s=this.order.indexOf(t);if(s<0)return this;for(let o=0;o<=s;o+=1){const a=this.steps.get(this.order[o]);a&&(a.classList.add("is-done"),a.classList.remove("is-here"),a.removeAttribute("aria-current"))}return this}async flash(t=2600){return this.el.classList.add("is-shown","is-forward"),await new Promise(s=>setTimeout(s,t)),this.el.classList.remove("is-forward"),this}reset(){this.furthest=-1;for(const t of this.steps.values())t.classList.remove("is-here","is-done"),t.removeAttribute("aria-current");return this.el.classList.remove("is-shown","is-forward"),this}}const D={width:1600,height:900};class Te{constructor(t){this.el=t,this.x=0,this.y=0,this.scale=1,this.apply()}apply(){this.el.setAttribute("transform",`translate(${this.x} ${this.y}) scale(${this.scale})`)}at(t,s){return this.x=t,this.y=s,this.apply(),this}setScale(t){return this.scale=t,this.apply(),this}setText(t){const s=this.el.querySelector(".sw-text");if(!s)return this;s.textContent=t;const o=Math.max(190,t.length*34+96),a=this.el.querySelector(".sw-plate"),i=this.el.querySelector(".sw-aura");return a&&(a.setAttribute("x",-o/2),a.setAttribute("width",o)),i&&i.setAttribute("rx",o*.78),this}async morphTo(t,{duration:s=900}={}){return this.el.classList.add("is-morphing"),await z({duration:s/2,easing:y.in,onUpdate:()=>{}}),this.setText(t),await z({duration:s/2,easing:y.out,onUpdate:()=>{}}),this.el.classList.remove("is-morphing"),this}scaleTo(t,{duration:s=900,easing:o=y.inOut}={}){const a=this.scale;return z({duration:s,easing:o,onUpdate:i=>{this.scale=a+(t-a)*i,this.apply()}})}moveTo(t,s,{duration:o=1400,easing:a=y.inOut}={}){const i=this.x,n=this.y;return z({duration:o,easing:a,onUpdate:c=>{this.x=i+(t-i)*c,this.y=n+(s-n)*c,this.apply()}})}}function ue(e,t){const s=document.createElementNS("http://www.w3.org/2000/svg","g");return t&&s.setAttribute("class",t),s.innerHTML=e,s}function qt(e){e.innerHTML=`
    <div class="stage">
      <svg class="stage-svg" viewBox="0 0 ${D.width} ${D.height}"
           preserveAspectRatio="xMidYMid slice" role="img"
           aria-label="A palace at night. A girl and her parrot watch a glowing word appear.">
        ${He()}
        <defs>${it()}</defs>
        <g class="world">${at()}</g>
      </svg>

      <div class="ui">
        <svg class="title-svg" viewBox="0 0 ${D.width} ${D.height}"
             preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <g class="title-group" transform="translate(800 648)">
            ${ot()}
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
      ${kt()}

      <button class="pausebtn" type="button" aria-label="Pause the story" aria-pressed="false">
        <span class="pause-icon" aria-hidden="true">&#10073;&#10073;</span>
        <span class="play-icon" aria-hidden="true">&#9654;</span>
      </button>
      <button class="replay" type="button" aria-label="Replay the story from the beginning">
        <span class="replay-icon" aria-hidden="true">&#8635;</span>
        <span class="replay-label">Replay the story</span>
      </button>
    </div>`;const t=e.querySelector(".world"),s=new We(t,D),o=e.querySelector(".tara-slot"),a=ue(Ge());o.appendChild(a);const i=new Ne(a,{x:60,y:420,scale:1,facing:"left"}),n=ue(ke()+Se("laddoo"),"spark-slot");o.appendChild(n);const c=new Te(n);c.at(520,-300);const d=ue(ke()+Se("chameli"),"spark-slot hers");o.appendChild(d);const u=new Te(d);u.at(0,0).setScale(.06);const m=new Ze(e.querySelector(".code-air")),w=e.querySelector(".sr-live"),L=e.querySelector(".ui"),S=()=>{if(!L.classList.contains("show-line")){w.textContent="";return}const x=L.dataset.line,f=x?e.querySelector(`.narration[data-for="${x}"]`):e.querySelector('.narration[data-for="far"]'),H=f?f.textContent.trim():"";w.textContent!==H&&(w.textContent=H)};new MutationObserver(S).observe(L,{attributes:!0,attributeFilter:["class","data-line"]});const v=new St(e.querySelector(".journey"));v.at("local");const k={root:e,camera:s,tara:i,spark:c,hers:u,code:m,journey:v,ui:e.querySelector(".ui")},$=()=>{Fe(),e.querySelector(".hero-window").classList.remove("is-open","is-passed"),e.querySelector(".portal").classList.remove("is-inside"),n.classList.remove("is-live","is-word","is-dimmed"),d.classList.remove("is-live","is-word","is-bouncing","is-straining","is-fading"),u.at(0,0).setScale(.06),e.querySelector(".room").classList.remove("wall-felt"),e.querySelector(".room-door").classList.remove("is-noticed"),e.querySelector(".tara").classList.remove("mithu-alert"),e.querySelector(".wall-ripple").classList.remove("is-hit"),e.querySelector(".room-door").classList.remove("is-open"),e.querySelector(".portal").classList.remove("show-shell"),e.querySelector(".layer-glows").classList.remove("is-live"),e.querySelectorAll(".lg").forEach(f=>f.classList.remove("is-lit")),e.querySelectorAll(".mlabel").forEach(f=>f.classList.remove("is-named")),e.querySelector(".ask-prompt").classList.remove("is-offered","is-taken"),e.querySelector(".ask-speech").classList.remove("is-spoken"),e.querySelector(".q-motes").classList.remove("is-asking"),e.querySelector(".courtyard").classList.remove("is-hushed"),d.classList.remove("is-homebound","is-beckoning","is-inner","is-shadowing","is-touched"),n.classList.remove("is-outer","is-answering","is-shadowed","is-touched"),u.setText("chameli"),c.setText("laddoo"),e.querySelector(".reach").classList.remove("show-global","show-nonlocal","show-shadow"),e.querySelectorAll(".lg").forEach(f=>f.classList.remove("is-probing","is-empty","is-found")),e.querySelectorAll(".mlabel").forEach(f=>f.classList.remove("is-inline")),e.querySelector(".layer-glows").classList.remove("is-searching"),e.querySelector(".tara").classList.remove("has-lantern","has-megaphone","mithu-away"),d.classList.remove("is-hollow","is-claimed","is-hollow-pulse","is-clearing"),e.querySelector(".trails").classList.remove("show-out","show-local","show-blocked","is-barred"),e.querySelector(".error-spell").classList.remove("is-cast"),e.querySelector(".perch-stand").classList.remove("is-up"),e.querySelector(".shadow-tag .mlabel").classList.remove("is-named"),e.querySelector(".stage").classList.remove("is-darkened"),m.clear({duration:0}),m.undock(),e.querySelector(".tara").classList.remove("looks-out","mithu-nods"),e.querySelector(".portal").classList.remove("is-warming"),e.querySelectorAll(".is-waking").forEach(f=>f.classList.remove("is-waking")),e.querySelectorAll(".is-fading").forEach(f=>f.classList.remove("is-fading")),d.classList.remove("is-settled","is-rising","is-star"),n.classList.remove("is-settled"),e.querySelector(".layer-glows").classList.remove("is-soft"),e.querySelector(".replay").classList.remove("is-offered"),e.querySelector(".interact").innerHTML="",v.reset(),v.at("local"),Ae(),e.querySelector(".stage").classList.remove("is-paused");const x=e.querySelector(".pausebtn");x.classList.remove("is-paused"),x.setAttribute("aria-pressed","false"),x.setAttribute("aria-label","Pause the story"),k.ui.classList.remove("is-ending"),delete k.ui.dataset.line,k.ui.classList.remove("show-title","show-sub","show-line"),i.at(60,420),i.facing="left",i.apply(),c.x=520,c.y=-300,c.apply(),s.unfollow(),vt(k)},C=e.querySelector(".pausebtn"),I=e.querySelector(".stage"),G=x=>{I.classList.toggle("is-paused",x),C.classList.toggle("is-paused",x),C.setAttribute("aria-pressed",String(x)),C.setAttribute("aria-label",x?"Resume the story":"Pause the story")};return C.addEventListener("click",()=>G($e())),addEventListener("keydown",x=>{if(x.code!=="Space"&&x.key!==" ")return;const f=x.target;f instanceof Element&&(f.closest("button")||f.getAttribute("role")==="button"||f.isContentEditable)||(x.preventDefault(),G($e()))}),e.querySelector(".replay").addEventListener("click",$),F?(e.querySelector(".hero-window").classList.add("is-open","is-passed"),e.querySelector(".portal").classList.add("is-inside","show-shell"),e.querySelector(".room-door").classList.add("is-open"),d.classList.add("is-live","is-word","is-homebound"),u.at(-620,-240).setScale(1),n.classList.add("is-live","is-word"),c.at(470,-330),i.at(1760,420),i.express("confused"),e.querySelector(".layer-glows").classList.add("is-live"),e.querySelectorAll(".lg").forEach(x=>x.classList.add("is-lit")),e.querySelectorAll(".mlabel").forEach(x=>x.classList.add("is-named")),u.setText("TARA"),d.classList.add("is-inner"),u.at(-560,-300),c.setText("MITHU"),n.classList.add("is-outer"),c.at(1900,-1180),s.set({x:l.x+980*l.scale,y:l.y+-940*l.scale,zoom:s.zoomToFitWidth(1760)}),m.dock(),m.write(['name = "Mithu"',"","def room():",'    name = "Tara"',"    print(name)"],{stagger:0}),m.note(0,"Global — the palace name"),m.note(3,"assigning makes a NEW local name"),m.note(4,"finds the local one first"),k.ui.dataset.line="names",k.ui.classList.add("show-line")):$(),k}qt(document.getElementById("app"));
