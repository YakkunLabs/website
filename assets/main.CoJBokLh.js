/* empty css              */(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const l of n.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&t(l)}).observe(document,{childList:!0,subtree:!0});function r(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(e){if(e.ep)return;e.ep=!0;const n=r(e);fetch(e.href,n)}})();const a=document.getElementById("year");a&&(a.textContent=new Date().getFullYear());const c=document.getElementById("navToggle"),i=document.getElementById("mobileMenu");c&&i&&(c.addEventListener("click",()=>{const o=!i.classList.contains("hidden");i.classList.toggle("hidden",o),c.setAttribute("aria-expanded",String(!o))}),i.querySelectorAll("a").forEach(o=>o.addEventListener("click",()=>{i.classList.add("hidden"),c.setAttribute("aria-expanded","false")})));document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll(".faq-item").forEach(r=>{r.addEventListener("click",()=>{const t=r.querySelector(".faq-content"),e=r.querySelector(".faq-icon");t&&e&&(t.classList.toggle("hidden"),e.classList.toggle("rotate-180"))})});const o=document.getElementById("contactForm");o&&o.addEventListener("submit",function(r){r.preventDefault();const t=this.querySelector('button[type="submit"]'),e=t.innerHTML;t.innerHTML=`
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Message Sent!
      `,t.disabled=!0,t.classList.add("success-state"),this.reset(),setTimeout(()=>{t.innerHTML=e,t.disabled=!1,t.classList.remove("success-state")},3e3)});const s=document.querySelector(".yl-newsletter-form");s&&s.addEventListener("submit",function(r){r.preventDefault();const t=this.querySelector(".yl-newsletter-input"),e=this.querySelector(".yl-newsletter-btn"),n=e.innerHTML;e.innerHTML="Subscribed!",e.disabled=!0,t.value="",setTimeout(()=>{e.innerHTML=n,e.disabled=!1},3e3)}),document.querySelectorAll('a[href^="#"]').forEach(r=>{r.addEventListener("click",function(t){t.preventDefault();const e=document.querySelector(this.getAttribute("href"));e&&e.scrollIntoView({behavior:"smooth",block:"start"})})})});const d=document.createElement("style");d.textContent=`
  .yl-btn {
    position: relative;
    overflow: hidden;
  }
  
  .success-state {
    background: linear-gradient(135deg, #22c55e, #16a34a) !important;
    box-shadow: 0 10px 28px rgba(34, 197, 94, 0.45) !important;
  }
`;document.head.appendChild(d);
