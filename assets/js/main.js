(function(){
  "use strict";

  /* Header shrink / shadow on scroll */
  var header = document.querySelector(".site-header");
  if(header){
    var onScroll = function(){
      if(window.scrollY > 12){ header.classList.add("is-scrolled"); }
      else{ header.classList.remove("is-scrolled"); }
    };
    document.addEventListener("scroll", onScroll, { passive:true });
    onScroll();
  }

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if(toggle && nav && header){
    var setOpen = function(open){
      header.classList.toggle("is-nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
    };
    toggle.addEventListener("click", function(){
      setOpen(!header.classList.contains("is-nav-open"));
    });
    nav.addEventListener("click", function(e){
      if(e.target.tagName === "A"){ setOpen(false); }
    });
    document.addEventListener("click", function(e){
      if(header.classList.contains("is-nav-open") && !header.contains(e.target)){ setOpen(false); }
    });
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape"){ setOpen(false); }
    });
    window.addEventListener("resize", function(){
      if(window.innerWidth > 1080){ setOpen(false); }
    });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold:.14, rootMargin:"0px 0px -40px 0px" });
    revealEls.forEach(function(el, i){
      el.style.setProperty("--i", i % 6);
      io.observe(el);
    });
    /* Safety net: never leave content invisible if the observer stalls */
    setTimeout(function(){
      revealEls.forEach(function(el){ el.classList.add("is-visible"); });
    }, 2500);
  } else {
    revealEls.forEach(function(el){ el.classList.add("is-visible"); });
  }

  /* Animated stat counters */
  var counters = document.querySelectorAll("[data-count-to]");
  if("IntersectionObserver" in window && counters.length){
    var counted = new WeakSet();
    var countIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting && !counted.has(entry.target)){
          counted.add(entry.target);
          animateCount(entry.target);
        }
      });
    }, { threshold:.5 });
    counters.forEach(function(el){ countIo.observe(el); });
  }

  function animateCount(el){
    var target = parseFloat(el.getAttribute("data-count-to"));
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var start = null;
    function step(ts){
      if(start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      el.textContent = value.toLocaleString("pl-PL") + suffix;
      if(progress < 1){ requestAnimationFrame(step); }
    }
    requestAnimationFrame(step);
  }

  /* Knowledge base: highlight active TOC entry */
  var tocLinks = document.querySelectorAll(".kb-toc a");
  var kbSections = document.querySelectorAll(".kb-section");
  if("IntersectionObserver" in window && tocLinks.length && kbSections.length){
    var tocIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var id = entry.target.getAttribute("id");
        var link = document.querySelector('.kb-toc a[href="#' + id + '"]');
        if(!link) return;
        if(entry.isIntersecting){
          tocLinks.forEach(function(l){ l.classList.remove("is-active"); });
          link.classList.add("is-active");
        }
      });
    }, { rootMargin:"-40% 0px -50% 0px" });
    kbSections.forEach(function(sec){ tocIo.observe(sec); });
  }
})();
