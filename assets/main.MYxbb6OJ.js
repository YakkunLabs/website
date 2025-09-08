(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&t(c)}).observe(document,{childList:!0,subtree:!0});function n(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function t(e){if(e.ep)return;e.ep=!0;const i=n(e);fetch(e.href,i)}})();const l=document.getElementById("year");l&&(l.textContent=new Date().getFullYear());const s=document.getElementById("navToggle"),r=document.getElementById("mobileMenu");if(s&&r){const a=o=>{o.preventDefault(),o.stopPropagation();const n=!r.classList.contains("hidden");r.classList.toggle("hidden",n),s.setAttribute("aria-expanded",String(!n)),document.body.style.overflow=n?"":"hidden"};s.addEventListener("click",a),s.addEventListener("touchstart",a,{passive:!1}),r.querySelectorAll("a").forEach(o=>{const n=t=>{r.classList.add("hidden"),s.setAttribute("aria-expanded","false"),document.body.style.overflow=""};o.addEventListener("click",n)}),document.addEventListener("click",o=>{!r.contains(o.target)&&!s.contains(o.target)&&(r.classList.add("hidden"),s.setAttribute("aria-expanded","false"),document.body.style.overflow="")}),window.addEventListener("orientationchange",()=>{setTimeout(()=>{r.classList.contains("hidden")||(r.classList.add("hidden"),s.setAttribute("aria-expanded","false"),document.body.style.overflow="")},100)})}document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll(".faq-item").forEach(n=>{n.addEventListener("click",()=>{const t=n.querySelector(".faq-content"),e=n.querySelector(".faq-icon");t&&e&&(t.classList.toggle("hidden"),e.classList.toggle("rotate-180"))})});const a=document.getElementById("contactForm");a&&a.addEventListener("submit",function(n){n.preventDefault();const t=this.querySelector('button[type="submit"]'),e=t.innerHTML;t.innerHTML=`
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Message Sent!
      `,t.disabled=!0,t.classList.add("success-state"),this.reset(),setTimeout(()=>{t.innerHTML=e,t.disabled=!1,t.classList.remove("success-state")},3e3)});const o=document.querySelector(".yl-newsletter-form");o&&o.addEventListener("submit",function(n){n.preventDefault();const t=this.querySelector(".yl-newsletter-input"),e=this.querySelector(".yl-newsletter-btn"),i=e.innerHTML;e.innerHTML="Subscribed!",e.disabled=!0,t.value="",setTimeout(()=>{e.innerHTML=i,e.disabled=!1},3e3)}),document.querySelectorAll('a[href^="#"]').forEach(n=>{n.addEventListener("click",function(t){t.preventDefault();const e=document.querySelector(this.getAttribute("href"));e&&e.scrollIntoView({behavior:"smooth",block:"start"})})})});const d=document.createElement("style");d.textContent=`
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
