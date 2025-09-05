/* empty css              */(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function t(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(e){if(e.ep)return;e.ep=!0;const i=t(e);fetch(e.href,i)}})();const l=document.getElementById("year");l&&(l.textContent=new Date().getFullYear());const s=document.getElementById("navToggle"),r=document.getElementById("mobileMenu");if(s&&r){const a=o=>{o.preventDefault(),o.stopPropagation();const t=!r.classList.contains("hidden");r.classList.toggle("hidden",t),s.setAttribute("aria-expanded",String(!t)),document.body.style.overflow=t?"":"hidden"};s.addEventListener("click",a),s.addEventListener("touchstart",a,{passive:!1}),r.querySelectorAll("a").forEach(o=>{const t=()=>{r.classList.add("hidden"),s.setAttribute("aria-expanded","false"),document.body.style.overflow=""};o.addEventListener("click",t),o.addEventListener("touchstart",t)}),document.addEventListener("click",o=>{!r.contains(o.target)&&!s.contains(o.target)&&(r.classList.add("hidden"),s.setAttribute("aria-expanded","false"),document.body.style.overflow="")}),window.addEventListener("orientationchange",()=>{setTimeout(()=>{r.classList.contains("hidden")||(r.classList.add("hidden"),s.setAttribute("aria-expanded","false"),document.body.style.overflow="")},100)})}document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll(".faq-item").forEach(t=>{t.addEventListener("click",()=>{const n=t.querySelector(".faq-content"),e=t.querySelector(".faq-icon");n&&e&&(n.classList.toggle("hidden"),e.classList.toggle("rotate-180"))})});const a=document.getElementById("contactForm");a&&a.addEventListener("submit",function(t){t.preventDefault();const n=this.querySelector('button[type="submit"]'),e=n.innerHTML;n.innerHTML=`
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Message Sent!
      `,n.disabled=!0,n.classList.add("success-state"),this.reset(),setTimeout(()=>{n.innerHTML=e,n.disabled=!1,n.classList.remove("success-state")},3e3)});const o=document.querySelector(".yl-newsletter-form");o&&o.addEventListener("submit",function(t){t.preventDefault();const n=this.querySelector(".yl-newsletter-input"),e=this.querySelector(".yl-newsletter-btn"),i=e.innerHTML;e.innerHTML="Subscribed!",e.disabled=!0,n.value="",setTimeout(()=>{e.innerHTML=i,e.disabled=!1},3e3)}),document.querySelectorAll('a[href^="#"]').forEach(t=>{t.addEventListener("click",function(n){n.preventDefault();const e=document.querySelector(this.getAttribute("href"));e&&e.scrollIntoView({behavior:"smooth",block:"start"})})})});const d=document.createElement("style");d.textContent=`
  .yl-btn {
    position: relative;
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
  }
  
  .success-state {
    background: linear-gradient(135deg, #22c55e, #16a34a) !important;
    box-shadow: 0 10px 28px rgba(34, 197, 94, 0.45) !important;
  }

  /* Mobile-specific improvements */
  @media (max-width: 768px) {
    /* Improve touch targets */
    .yl-link,
    .yl-mobile-link,
    .yl-btn {
      min-height: 44px;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    /* Prevent zoom on input focus */
    input,
    textarea,
    select {
      font-size: 16px;
    }

    /* Smooth scrolling for mobile */
    html {
      -webkit-overflow-scrolling: touch;
    }

    /* Better mobile transitions */
    .yl-feature-card--enhanced,
    .yl-update-card,
    .yl-card,
    .yl-post {
      transition: none;
    }

    /* Mobile menu overlay */
    #mobileMenu {
      z-index: 100;
    }

    /* Improve mobile text readability */
    body {
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }
  }

  /* Reduce motion for users who prefer it */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;document.head.appendChild(d);
