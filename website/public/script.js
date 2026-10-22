const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const nav = document.querySelector(".site-nav");
const menu = document.querySelector(".menu-toggle");
function closeMenu() {
  nav.classList.remove("is-open");
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "メニューを開く");
}
menu.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });

const dialog = document.getElementById("zoom");
const zoomed = dialog.querySelector("img");
document.querySelectorAll(".gallery img").forEach(img => {
  img.tabIndex = 0;
  img.setAttribute("role", "button");
  img.setAttribute("aria-label", img.alt + "を拡大");
  const open = () => {
    zoomed.src = img.src;
    zoomed.alt = img.alt;
    dialog.showModal();
  };
  img.addEventListener("click", open);
  img.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); }
  });
});
dialog.querySelector("button").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });


// Wireframe controller drawn from original 3D outlines, with no external library.
const canvas = document.getElementById("wireframe");
const ctx = canvas.getContext("2d");
let width = 0, height = 0, visible = true, pointerX = 0, pointerY = 0;
let smoothX = 0, smoothY = 0;
function resize() {
  const box = canvas.getBoundingClientRect();
  width = box.width; height = box.height;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = width * dpr; canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
new ResizeObserver(resize).observe(canvas);
new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(canvas);
canvas.addEventListener("pointermove", event => {
  const box = canvas.getBoundingClientRect();
  pointerX = (event.clientX - box.left) / width - .5;
  pointerY = (event.clientY - box.top) / height - .5;
});
canvas.addEventListener("pointerleave", () => { pointerX = pointerY = 0; });

const controllerLines = [];
function outline(points, opacity = .7, weight = .95, closed = true) {
  controllerLines.push({ points: closed ? [...points, points[0]] : points, opacity, weight });
}
function circle(x, y, radius, z, opacity = .7) {
  outline(Array.from({length:40}, (_, i) => {
    const angle = i / 40 * Math.PI * 2;
    return [x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, z];
  }), opacity);
}
// Sample a rounded silhouette: shoulder bar, tapered grips, and central arch.
const contour = [];
function curve(a, b, c, d) {
  for (let step = 0; step < 10; step++) {
    const t = step / 10, u = 1 - t;
    contour.push([
      u*u*u*a[0] + 3*u*u*t*b[0] + 3*u*t*t*c[0] + t*t*t*d[0],
      u*u*u*a[1] + 3*u*u*t*b[1] + 3*u*t*t*c[1] + t*t*t*d[1]
    ]);
  }
}
curve([-1.1,-.53],[-.85,-.72],[.85,-.72],[1.1,-.53]);
curve([1.1,-.53],[1.35,-.35],[1.57,.54],[1.39,.84]);
curve([1.39,.84],[1.19,1.12],[.93,.55],[.72,.35]);
curve([.72,.35],[.42,.23],[-.42,.23],[-.72,.35]);
curve([-.72,.35],[-.93,.55],[-1.19,1.12],[-1.39,.84]);
curve([-1.39,.84],[-1.57,.54],[-1.35,-.35],[-1.1,-.53]);
const frontZ = -.23;
outline(contour.map(([x,y]) => [x,y,frontZ]), .85, 1.2);
outline(contour.map(([x,y]) => [x*.97,y*.97,.23]), .38);
outline(contour.map(([x,y]) => [x*1.005,y*1.005,.04]), .25, .65);
contour.forEach(([x,y], index) => {
  if (index % 5 === 0) outline([[x,y,frontZ],[x*.97,y*.97,.23]], .26, .65, false);
});
// Shoulder buttons.
for (const side of [-1,1]) {
  outline([[side*.63,-.6,-.24],[side*.7,-.74,-.05],
    [side*1.04,-.67,-.05],[side*1.12,-.5,-.24]], .58);
}
// Central touch surface and two small menu buttons.
outline([[-.37,-.48,-.25],[.37,-.48,-.25],[.32,-.05,-.25],[-.32,-.05,-.25]], .55);
for (const side of [-1,1]) {
  outline([[side*.46,-.36,-.25],[side*.54,-.36,-.25],
    [side*.54,-.24,-.25],[side*.46,-.24,-.25]], .6);
}
// Raised analog sticks, with concentric rims and visible stems.
for (const x of [-.48,.48]) {
  circle(x,.2,.22,-.25,.48);
  circle(x,.2,.165,-.36,.8);
  circle(x,.2,.12,-.37,.35);
  for (const angle of [0,Math.PI/2,Math.PI,Math.PI*1.5]) {
    outline([[x+Math.cos(angle)*.22,.2+Math.sin(angle)*.22,-.25],
      [x+Math.cos(angle)*.165,.2+Math.sin(angle)*.165,-.36]], .32,.7,false);
  }
}
// Directional pad on the left.
const cross = [[-.07,-.2],[.07,-.2],[.07,-.07],[.2,-.07],[.2,.07],
  [.07,.07],[.07,.2],[-.07,.2],[-.07,.07],[-.2,.07],[-.2,-.07],[-.07,-.07]];
outline(cross.map(([x,y])=>[x-.88,y-.21,-.29]), .8);
circle(-.88,-.21,.045,-.3,.3);
// Four face buttons on the right.
for (const [x,y] of [[.88,-.42],[1.08,-.22],[.88,-.02],[.68,-.22]]) {
  circle(x,y,.075,-.26,.4);
  circle(x,y,.067,-.32,.8);
}
circle(0,.14,.045,-.26,.65);
// Grip seams.
for (const side of [-1,1]) {
  outline([[side*1.18,-.1,-.24],[side*1.04,.25,-.24],
    [side*1.26,.76,-.24]], .28,.7,false);
}

function draw(time) {
  if (visible && width && height) {
    ctx.clearRect(0, 0, width, height);
    smoothX += (pointerX - smoothX) * .045;
    smoothY += (pointerY - smoothY) * .045;
    // Gentle rotation keeps the controls recognizable throughout the motion.
    const angle = reducedMotion.matches ? -.3 : -.3 + Math.sin(time*.00035)*.48 + smoothX*.65;
    const tilt = reducedMotion.matches ? -.28 : -.28 + Math.sin(time*.00024)*.1 - smoothY*.4;
    const roll = -.08;
    const scale = Math.min(width*.255,height*.42);
    const float = reducedMotion.matches ? 0 : Math.sin(time*.0008)*5;
    function project([x,y,z]) {
      const a = x*Math.cos(angle)+z*Math.sin(angle);
      const b = -x*Math.sin(angle)+z*Math.cos(angle);
      const c = y*Math.cos(tilt)-b*Math.sin(tilt);
      const depth = y*Math.sin(tilt)+b*Math.cos(tilt);
      const perspective = 6/(6+depth);
      return [width/2+(a*Math.cos(roll)-c*Math.sin(roll))*scale*perspective,
        height/2+(a*Math.sin(roll)+c*Math.cos(roll)-.05)*scale*perspective+float];
    }
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    for (const line of controllerLines) {
      ctx.strokeStyle = "rgba(42,53,39," + line.opacity + ")";
      ctx.lineWidth = line.weight;
      ctx.beginPath();
      line.points.forEach((point,index) => {
        const [x,y] = project(point);
        if (index === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      });
      ctx.stroke();
    }
  }
  requestAnimationFrame(draw);
}
resize();
requestAnimationFrame(draw);
// A file:// document cannot send the HTTP referrer YouTube requires.
// Show a direct video preview there; HTTP(S) pages keep the embedded players.
if (location.protocol === "file:") {
  document.querySelectorAll('.project iframe').forEach(player => {
    const id = new URL(player.src).pathname.split("/").pop();
    const preview = document.createElement("a");
    preview.className = "video-preview";
    preview.href = "https://www.youtube.com/watch?v=" + id;
    preview.target = "_blank";
    preview.rel = "noopener";
    preview.setAttribute("aria-label", player.title + "をYouTubeで見る");
    const thumbnail = document.createElement("img");
    thumbnail.src = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
    thumbnail.alt = player.title;
    thumbnail.loading = "lazy";
    const label = document.createElement("span");
    label.textContent = "▶ YouTubeで再生";
    preview.append(thumbnail, label);
    player.replaceWith(preview);
  });
}

// Reveal and reset content as it enters and leaves the viewport.
(() => {
  if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

  const selector = [
    ".hero-topline", ".hero h1", ".hero-description", ".hero-object", ".hero-bottom",
    ".about > img", ".about .section-label", ".about h2", ".about > div > p", ".facts li",
    "section:not(#about) > .wrap > .section-label",
    "section:not(#about) > .wrap > h2", "section:not(#about) > .wrap > .lead",
    ".project > div", ".skill-group h3", ".skill-list li", ".gallery img", ".site-footer .section-label",
    ".site-footer h2", ".site-footer .lead", ".site-footer .mail",
    '.site-footer a[href*="github"]', ".footer-bottom"
  ].join(", ");
  const targets = [...document.querySelectorAll(selector)];
  let observer;

  function reveal(element, delay = 0) {
    element.style.setProperty("--reveal-delay", delay + "ms");
    element.classList.remove("reveal-pending");

  }

  try {
    observer = new IntersectionObserver(entries => {
      // Reset outside the viewport so the entrance can play again in either direction.
      entries.filter(entry => !entry.isIntersecting).forEach(entry => {
        if (entry.target.contains(document.activeElement)) return;
        entry.target.style.setProperty("--reveal-delay", "0ms");
        entry.target.classList.add("reveal-pending");
      });
      // Sort by visible position so masonry images appear in a natural sequence.
      entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top ||
          a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach((entry, index) => reveal(entry.target, Math.min(index * 65, 260)));
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });

    targets.forEach(element => {
      element.classList.add("scroll-reveal", "reveal-pending");
      observer.observe(element);
    });
  } catch {
    observer?.disconnect();
    targets.forEach(element => element.classList.remove("scroll-reveal", "reveal-pending"));
    return;
  }

  // Keyboard navigation should never focus an invisible control.
  document.addEventListener("focusin", event => {
    const pending = event.target.closest(".reveal-pending");
    if (pending) reveal(pending);
  });
  reducedMotion.addEventListener("change", event => {
    if (event.matches) {
      observer.disconnect();
      targets.forEach(element => element.classList.remove("reveal-pending"));
    }
  });
})();




