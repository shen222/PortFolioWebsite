
    // Tilt effect on mouse move (desktop only)
    const tagchain = document.getElementById("tagchain");
    tagchain.addEventListener("mousemove", (e) => {
      if (window.innerWidth <= 600) return;
      const { width, height, left, top } = tagchain.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const rotateX = ((y / height) - 0.5) * 15;
      const rotateY = ((x / width) - 0.5) * -15;
      tagchain.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    tagchain.addEventListener("mouseleave", () => {
      if (window.innerWidth <= 600) return;
      tagchain.style.transform = "rotateX(0deg) rotateY(0deg)";
    });

    // Scroll reveal + active dots
    const sections = document.querySelectorAll("section.content");
    const dots = document.querySelectorAll(".dot");
    window.addEventListener("scroll", () => {
      let current = "";
      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          sec.classList.add("visible");
          current = sec.id;
        } else {
          sec.classList.remove("visible");
        }
      });
      dots.forEach(dot => {
        dot.classList.remove("active");
        if (dot.getAttribute("href").substring(1) === current) {
          dot.classList.add("active");
        }
      });
    });


  // Animate title
const illustrationTitle = document.querySelector('.illustrations-title');
const titleObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      illustrationTitle.classList.add('visible');
    }
  });
}, { threshold: 0.5 });
titleObserver.observe(illustrationTitle);

const illustrationCards = document.querySelectorAll('.illustration-card');

const cardObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.setProperty('--delay', `${i * 0.15}s`);
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible'); // reset when out of view
    }
  });
}, { threshold: 0.2 });

illustrationCards.forEach(card => cardObserver.observe(card));

 // Select elements
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".lightbox .close");

  // Open lightbox when clicking portfolio images
  document.querySelectorAll(".portfolio-card img").forEach(img => {
    img.addEventListener("click", () => {
      lightbox.style.display = "flex";
      lightboxImg.src = img.src;
    });
  });

  // Close lightbox when clicking X
  closeBtn.addEventListener("click", () => {
    lightbox.style.display = "none";
  });

  // Close when clicking outside the image
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
    }
  });