(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&t(l)}).observe(document,{childList:!0,subtree:!0});function n(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(e){if(e.ep)return;e.ep=!0;const r=n(e);fetch(e.href,r)}})();const c=document.getElementById("year");c&&(c.textContent=new Date().getFullYear());const s=document.getElementById("navToggle"),i=document.getElementById("mobileMenu");if(s&&i){const a=o=>{o.preventDefault(),o.stopPropagation();const n=!i.classList.contains("hidden");i.classList.toggle("hidden",n),s.setAttribute("aria-expanded",String(!n)),document.body.style.overflow=n?"":"hidden"};s.addEventListener("click",a),s.addEventListener("touchstart",a,{passive:!1}),i.querySelectorAll("a").forEach(o=>{const n=t=>{i.classList.add("hidden"),s.setAttribute("aria-expanded","false"),document.body.style.overflow=""};o.addEventListener("click",n)}),document.addEventListener("click",o=>{!i.contains(o.target)&&!s.contains(o.target)&&(i.classList.add("hidden"),s.setAttribute("aria-expanded","false"),document.body.style.overflow="")}),window.addEventListener("orientationchange",()=>{setTimeout(()=>{i.classList.contains("hidden")||(i.classList.add("hidden"),s.setAttribute("aria-expanded","false"),document.body.style.overflow="")},100)})}document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll(".faq-item").forEach(n=>{n.addEventListener("click",()=>{const t=n.querySelector(".faq-content"),e=n.querySelector(".faq-icon");t&&e&&(t.classList.toggle("hidden"),e.classList.toggle("rotate-180"))})});const a=document.getElementById("contactForm");a&&a.addEventListener("submit",function(n){n.preventDefault();const t=this.querySelector('button[type="submit"]'),e=t.innerHTML;t.innerHTML=`
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Message Sent!
      `,t.disabled=!0,t.classList.add("success-state"),this.reset(),setTimeout(()=>{t.innerHTML=e,t.disabled=!1,t.classList.remove("success-state")},3e3)});const o=document.querySelector(".yl-newsletter-form");o&&o.addEventListener("submit",function(n){n.preventDefault();const t=this.querySelector(".yl-newsletter-input"),e=this.querySelector(".yl-newsletter-btn"),r=e.innerHTML;e.innerHTML="Subscribed!",e.disabled=!0,t.value="",setTimeout(()=>{e.innerHTML=r,e.disabled=!1},3e3)}),document.querySelectorAll('a[href^="#"]').forEach(n=>{n.addEventListener("click",function(t){t.preventDefault();const e=document.querySelector(this.getAttribute("href"));e&&e.scrollIntoView({behavior:"smooth",block:"start"})})})});const d=document.createElement("style");d.textContent=`
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
      z-index: 1000;
      backdrop-filter: blur(10px);
    }
    
    #mobileMenu .bg-white {
      background: rgba(255, 255, 255, 0.98) !important;
      border: 1px solid rgba(0, 0, 0, 0.1) !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
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
