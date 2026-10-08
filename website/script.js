// Hero flashlight: follows the pointer on desktop, stays centered on touch / reduced motion
const hero = document.querySelector(".hero");
const canTrack = matchMedia("(pointer: fine)").matches &&
                 !matchMedia("(prefers-reduced-motion: reduce)").matches;
if (canTrack) {
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--x", `${e.clientX - r.left}px`);
    hero.style.setProperty("--y", `${e.clientY - r.top}px`);
  });
}

// Lightbox for gallery images
const dialog = document.getElementById("zoom");
const zoomed = dialog.querySelector("img");
document.querySelectorAll(".gallery img").forEach((img) => {
  const open = () => { zoomed.src = img.src; zoomed.alt = img.alt; dialog.showModal(); };
  img.tabIndex = 0;
  img.addEventListener("click", open);
  img.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); });
});
dialog.addEventListener("click", () => dialog.close());
