/* ==========================================================
   El Boquerón Books · Reseñas de lectores
   ----------------------------------------------------------
   Para añadir una reseña, copia un bloque { ... } de la lista
   RESENAS y cambia sus datos. La más reciente, arriba.

   libro:     titulitis · aprender · algoritmo · nomepasa · sana ·
              chatgpt · ventaja · cuando-deje · diriges · ahora-elijo · ventana
              (si el libro no está en la web, deja libro: "" y pon titulo: "…")
   origen:    Amazon · WhatsApp · Instagram · Facebook · Email · En persona (opcional)
   estrellas: de 1 a 5 (opcional; si el lector no puntuó, no se ponen)
   texto:     separa párrafos con \n\n
   destacado: frase corta de la reseña que sale grande arriba (opcional)
   ========================================================== */
const RESENAS = [
  {
    nombre: "Claudia",
    destacado: "Hay libros que se leen, otros que se olvidan y otros que te acompañan.",
    libro: "ventaja",
    titulo: "La ventaja invisible",
    fecha: "2026-10",
    texto: "Me regalaron La ventaja invisible y tengo que decir que ha sido todo un descubrimiento.\n\nLo que más me ha gustado es que no es el típico libro de autoayuda que te vende humo, ni te promete que todo va a ser maravilloso. Es un libro real, sincero, de esos que te hacen pensar y en los que te ves reflejada.\n\nSe nota que está escrito desde el corazón, desde las experiencias y los sentimientos de alguien que sabe de lo que habla. No intenta darte lecciones, simplemente te llega.\n\nY lo mejor es que no es uno de esos libros que lees y dejas olvidados en una estantería. Yo vuelvo a él cada vez que tengo un mal día, releo algunas de sus páginas y siempre encuentro algo que necesitaba escuchar en ese momento.\n\nHay libros que se leen, otros que se olvidan y otros que te acompañan. Para mí, La ventaja invisible es de estos últimos. ❤️\n\nGracias por un libro tan auténtico y tan necesario."
  }
];

(function () {
  "use strict";
  const sec = document.getElementById("resenas");
  if (!sec) return;
  const lista = RESENAS.filter((r) => r && r.texto);
  const navLink = document.querySelector('.nav a[href="#resenas"]');
  if (!lista.length) { sec.hidden = true; if (navLink) navLink.hidden = true; return; }

  const esc = (s) => String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const libro = (r) => {
    const cov = r.libro ? document.querySelector('.cover[aria-describedby="syn-' + r.libro + '"]') : null;
    if (cov) {
      const art = cov.closest(".book");
      return { img: cov.querySelector("img")?.getAttribute("src"), titulo: r.titulo || art?.querySelector("h3")?.textContent || "" };
    }
    return r.titulo ? { img: null, titulo: r.titulo } : null;
  };
  const fecha = (f) => { if (!f) return ""; const [y, m] = String(f).split("-"); return m ? MESES[+m - 1] + " de " + y : y; };
  const estrellas = (n) => { n = Math.max(1, Math.min(5, Math.round(+n))); return "★".repeat(n) + '<span class="off">' + "★".repeat(5 - n) + "</span>"; };
  const parrafos = (t) => String(t).split(/\n\s*\n/).map((p) => "<p>" + esc(p.trim()).replace(/\n/g, "<br>") + "</p>").join("");

  // Resumen: la media solo cuenta las reseñas que traen estrellas
  const conNota = lista.filter((r) => +r.estrellas > 0);
  const total = lista.length + (lista.length === 1 ? " reseña de lector" : " reseñas de lectores");
  if (conNota.length) {
    const media = conNota.reduce((s, r) => s + +r.estrellas, 0) / conNota.length;
    document.getElementById("revSummary").innerHTML = '<span class="rev-stars">' + estrellas(media) + "</span><b>" +
      media.toLocaleString("es-ES", { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + "</b><span>· " + total + "</span>";
  } else {
    document.getElementById("revSummary").innerHTML = "<span>" + total + "</span>";
  }

  const track = document.getElementById("revTrack");
  track.classList.toggle("rev-track--one", lista.length === 1);
  track.innerHTML = lista.map((r) => {
    const b = libro(r);
    const top = (+r.estrellas > 0 ? '<span class="rev-stars" aria-label="' + r.estrellas + ' de 5 estrellas">' + estrellas(r.estrellas) + "</span>" : (r.destacado ? "" : '<span class="rev-quote" aria-hidden="true">“</span>')) +
      (r.origen ? '<span class="rev-origin">' + esc(r.origen) + "</span>" : "");
    return '<article class="rev-card">' +
      (top ? '<div class="rev-top">' + top + "</div>" : "") +
      '<blockquote class="rev-body">' + (r.destacado ? '<p class="rev-highlight">“' + esc(r.destacado) + '”</p>' : "") + '<div class="rev-text">' + parrafos(r.texto) + "</div></blockquote>" +
      '<button type="button" class="rev-more" hidden>Leer completa</button>' +
      '<div class="rev-foot">' +
        (b && b.img ? '<img src="' + esc(b.img) + '" alt="" width="40" height="60" loading="lazy">' : "") +
        "<div><strong>" + esc(r.nombre || "Lector") + (r.lugar ? " · " + esc(r.lugar) : "") + "</strong>" +
        "<small>" + (b ? "Sobre <em>" + esc(b.titulo) + "</em>" : "") + (r.fecha ? (b ? " · " : "") + fecha(r.fecha) : "") + "</small></div>" +
      "</div></article>";
  }).join("");

  // Reseñas largas: se recortan y se abren con «Leer completa»
  track.querySelectorAll(".rev-card").forEach((card) => {
    const txt = card.querySelector(".rev-text"), btn = card.querySelector(".rev-more");
    txt.classList.add("is-clamped");
    if (txt.scrollHeight > txt.clientHeight + 4) {
      btn.hidden = false;
      btn.addEventListener("click", () => { const open = txt.classList.toggle("is-clamped"); btn.textContent = open ? "Leer completa" : "Leer menos"; upd(); });
    } else txt.classList.remove("is-clamped");
  });

  const prev = document.getElementById("revPrev"), next = document.getElementById("revNext");
  const step = () => { const c = track.querySelector(".rev-card"); return c ? c.offsetWidth + 18 : 300; };
  function upd() {
    prev.disabled = track.scrollLeft < 8;
    next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 8;
    const nav = sec.querySelector(".rev-arrows"); if (nav) nav.hidden = track.scrollWidth <= track.clientWidth + 8;
  }
  prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
  track.addEventListener("scroll", upd, { passive: true });
  addEventListener("resize", upd);
  upd();
})();
