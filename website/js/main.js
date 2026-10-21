/* DCYM Bokaro Parish: site script.
   Content comes from DEFAULT below, then data/site-data.js (window.SITE_DATA) if present. */
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const safeUrl = u => /^https?:\/\//i.test(u || "") ? u : "";
const DEFAULT = window.DCYM_DEFAULT;
/* Daily verses (King James Version, public domain). One is shown per day; custom verses can be set for specific dates. */
const VERSES = [["Psalm 133:1", "Behold, how good and how pleasant it is for brethren to dwell together in unity!"], ["John 3:16", "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."], ["Psalm 23:1", "The LORD is my shepherd; I shall not want."], ["Philippians 4:13", "I can do all things through Christ which strengtheneth me."], ["Proverbs 3:5", "Trust in the LORD with all thine heart; and lean not unto thine own understanding."], ["Jeremiah 29:11", "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end."], ["Isaiah 41:10", "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness."], ["Romans 8:28", "And we know that all things work together for good to them that love God, to them who are the called according to his purpose."], ["Matthew 11:28", "Come unto me, all ye that labour and are heavy laden, and I will give you rest."], ["Joshua 1:9", "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest."], ["Psalm 46:1", "God is our refuge and strength, a very present help in trouble."], ["1 Timothy 4:12", "Let no man despise thy youth; but be thou an example of the believers, in word, in conversation, in charity, in spirit, in faith, in purity."], ["Matthew 5:16", "Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven."], ["John 13:34", "A new commandment I give unto you, That ye love one another; as I have loved you, that ye also love one another."], ["Ephesians 2:8", "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God."], ["Psalm 119:105", "Thy word is a lamp unto my feet, and a light unto my path."], ["Matthew 6:33", "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you."], ["Psalm 27:1", "The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?"], ["1 Corinthians 13:13", "And now abideth faith, hope, charity, these three; but the greatest of these is charity."], ["Hebrews 11:1", "Now faith is the substance of things hoped for, the evidence of things not seen."], ["Micah 6:8", "He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?"], ["Isaiah 40:31", "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint."], ["Psalm 37:4", "Delight thyself also in the LORD; and he shall give thee the desires of thine heart."], ["Proverbs 22:6", "Train up a child in the way he should go: and when he is old, he will not depart from it."], ["John 14:6", "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me."], ["Psalm 121:1-2", "I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the LORD, which made heaven and earth."], ["2 Timothy 1:7", "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind."], ["James 1:5", "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him."], ["Colossians 3:23", "And whatsoever ye do, do it heartily, as to the Lord, and not unto men."], ["Psalm 34:8", "O taste and see that the LORD is good: blessed is the man that trusteth in him."], ["Matthew 22:39", "And the second is like unto it, Thou shalt love thy neighbour as thyself."], ["1 John 4:19", "We love him, because he first loved us."], ["Romans 15:13", "Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost."], ["Psalm 100:1-2", "Make a joyful noise unto the LORD, all ye lands. Serve the LORD with gladness: come before his presence with singing."], ["Ecclesiastes 4:9", "Two are better than one; because they have a good reward for their labour."], ["Philippians 4:6", "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God."], ["Lamentations 3:22-23", "It is of the LORD’s mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness."], ["Psalm 118:24", "This is the day which the LORD hath made; we will rejoice and be glad in it."], ["Galatians 6:2", "Bear ye one another’s burdens, and so fulfil the law of Christ."], ["Hebrews 10:24", "And let us consider one another to provoke unto love and to good works."], ["1 Peter 5:7", "Casting all your care upon him; for he careth for you."], ["Proverbs 27:17", "Iron sharpeneth iron; so a man sharpeneth the countenance of his friend."], ["Psalm 16:11", "Thou wilt shew me the path of life: in thy presence is fulness of joy; at thy right hand there are pleasures for evermore."], ["John 8:12", "Then spake Jesus again unto them, saying, I am the light of the world: he that followeth me shall not walk in darkness, but shall have the light of life."], ["Romans 12:10", "Be kindly affectioned one to another with brotherly love; in honour preferring one another."], ["2 Corinthians 5:7", "For we walk by faith, not by sight."], ["Psalm 55:22", "Cast thy burden upon the LORD, and he shall sustain thee: he shall never suffer the righteous to be moved."], ["Matthew 19:14", "But Jesus said, Suffer little children, and forbid them not, to come unto me: for of such is the kingdom of heaven."], ["Isaiah 26:3", "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee."], ["John 15:12", "This is my commandment, That ye love one another, as I have loved you."], ["1 Thessalonians 5:16-18", "Rejoice evermore. Pray without ceasing. In every thing give thanks: for this is the will of God in Christ Jesus concerning you."], ["Matthew 5:9", "Blessed are the peacemakers: for they shall be called the children of God."], ["Psalm 19:14", "Let the words of my mouth, and the meditation of my heart, be acceptable in thy sight, O LORD, my strength, and my redeemer."], ["Ephesians 4:32", "And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ’s sake hath forgiven you."], ["Psalm 51:10", "Create in me a clean heart, O God; and renew a right spirit within me."], ["John 10:10", "I am come that they might have life, and that they might have it more abundantly."], ["Romans 5:8", "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us."], ["1 Corinthians 16:14", "Let all your things be done with charity."], ["Joshua 24:15", "As for me and my house, we will serve the LORD."], ["Numbers 6:24-26", "The LORD bless thee, and keep thee: The LORD make his face shine upon thee, and be gracious unto thee: The LORD lift up his countenance upon thee, and give thee peace."], ["Matthew 28:20", "And, lo, I am with you alway, even unto the end of the world."]];

let DATA = JSON.parse(JSON.stringify(DEFAULT));
function setData(d) { d = d || {}; const b = JSON.parse(JSON.stringify(DEFAULT)); DATA = Object.assign(b, d); DATA.contact = Object.assign({}, DEFAULT.contact, d.contact || {}); DATA.about = Object.assign({}, DEFAULT.about, d.about || {}); renderAll() }
window.DCYM = { setData, getData: () => JSON.parse(JSON.stringify(DATA)), DEFAULT };

const fmt = (d, o) => new Date(d + "T00:00").toLocaleDateString(undefined, o || { day: "numeric", month: "long", year: "numeric" });
const today = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()) };
const dayKey = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0") };

/* ---- menu ---- */
$("#yr").textContent = new Date().getFullYear();
const mb = $("#menuBtn"), nav = $("#nav"), sync = () => { mb.textContent = mb.getAttribute("aria-expanded") === "true" ? "Close" : "Menu" };
mb.onclick = () => { const o = nav.classList.toggle("open"); mb.setAttribute("aria-expanded", o); sync() };
nav.addEventListener("click", e => { if (e.target.tagName === "A") { nav.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); sync() } });
addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("open")) { nav.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); sync(); mb.focus() } });

/* ---- renderers ---- */
function renderContact() {
   const c = DATA.contact, so = Object.entries(c.social || {}).filter(([k, v]) => safeUrl(v)).map(([k, v]) => `<a href="${esc(v)}" rel="noopener" target="_blank">${esc(k)}</a>`);
   const wa = String(c.whatsapp || "").replace(/\D/g, ""); if (wa) so.push(`<a href="https://wa.me/${wa}" rel="noopener" target="_blank">WhatsApp</a>`);
   const soc = so.join(" · ") || "Links will appear here once provided.";
   const mail = c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : "Email to be added";
   const tel = c.phone ? `<a href="tel:${esc(String(c.phone).replace(/[^+\d]/g, ""))}">${esc(c.phone)}</a>` : "Phone number to be added";
   $("#cEmail").innerHTML = mail; $("#fEmail").innerHTML = mail; $("#cPhone").innerHTML = tel; $("#fPhone").innerHTML = tel;
   $("#cAddr").textContent = c.address || "Parish address to be added, Bokaro"; $("#cSocial").innerHTML = soc; $("#fSocial").innerHTML = soc;
   const ph = !DATA.saved; $("#cPh").hidden = !ph; $("#aPh").hidden = !ph; $("#sampleNote").hidden = !ph
}
function renderAbout() { const a = DATA.about; $("#aWho").textContent = a.who; $("#aValues").textContent = a.values; $("#aMission").textContent = a.mission; $("#aVision").textContent = a.vision }
function renderLeaders() { $("#leaders").innerHTML = DATA.leaders.length ? DATA.leaders.map(l => `<div class="card person">${l.name ? "" : '<span class="ph">Placeholder</span>'}${l.photo ? `<img class="avatar pic" src="${esc(l.photo)}" alt="Photo of ${esc(l.name || l.role)}" loading="lazy">` : '<div class="avatar">Photo</div>'}<h3>${esc(l.name || "Name to be added")}</h3><b>${esc(l.role)}</b><p>${esc(l.desc || "Short description to be added.")}</p></div>`).join("") : "<p>Leadership details will be added soon.</p>" }
function renderActs() { $("#acts").innerHTML = DATA.activities.length ? DATA.activities.map(a => `<div class="card act"><h3>${esc(a.title)}</h3><p>${esc(a.desc)}</p></div>`).join("") : "<p>Activities will be added soon.</p>" }
let all = false;
function renderEvents() {
   const t = today(), l = DATA.events.map(e => ({ ...e, d: e.date ? new Date(e.date + "T00:00") : null }));
   const up = l.filter(e => !e.d || e.d >= t).sort((a, b) => (a.d || 1e15) - (b.d || 1e15)), past = l.filter(e => e.d && e.d < t).sort((a, b) => b.d - a.d), show = all ? [...up, ...past] : up.slice(0, 3);
   const card = e => {
      let b = ""; if (e.d) { const n = Math.round((e.d - t) / 864e5); b = `<span class="badge${n < 0 ? " past" : ""}">${n === 0 ? "Today" : n === 1 ? "Tomorrow" : n > 0 ? "In " + n + " days" : "Past event"}</span>` }
      const when = e.d ? fmt(e.date, { weekday: "short", day: "numeric", month: "short", year: "numeric" }) + (e.time ? ", " + esc(e.time) : "") : "Date and time to be announced";
      return `<article class="card ev">${e.photo ? `<img class="evimg" src="${esc(e.photo)}" alt="${esc(e.title)}" loading="lazy">` : ""}${e.d ? "" : '<span class="ph">Placeholder</span>'}${b}<h3>${esc(e.title)}</h3><p class="meta">${when}<span>${esc(e.venue || "Venue to be announced")}</span></p><p style="margin-top:10px">${esc(e.desc)}</p><p style="margin-top:12px">${safeUrl(e.reg) ? `<a href="${esc(e.reg)}" rel="noopener" target="_blank"><b>Register here</b></a>` : '<a href="#contact"><b>Contact us to register</b></a>'}</p></article>`
   };
   $("#evs").innerHTML = show.length ? show.map(card).join("") : "<p>No events are scheduled right now. Please check back soon.</p>";
   const m = $("#evMore"); m.hidden = !(all || up.length > 3 || past.length); m.textContent = all ? "Show fewer events" : "View All Events"
}
$("#evMore").onclick = () => { all = !all; renderEvents() };
let cur = "All", vis = [], idx = 0;
function renderGallery() {
   const cats = ["All", ...new Set(DATA.gallery.map(g => g.cat).filter(Boolean))]; if (!cats.includes(cur)) cur = "All";
   $("#filters").innerHTML = cats.map(c => `<button type="button" aria-pressed="${c === cur}">${esc(c)}</button>`).join("");
   vis = DATA.gallery.filter(g => cur === "All" || g.cat === cur);
   $("#gal").innerHTML = vis.length ? vis.map((g, i) => `<button class="tile" type="button" data-i="${i}" aria-label="Enlarge photo: ${esc(g.caption)}${g.photo ? "" : " (placeholder)"}">${g.photo ? `<img src="${esc(g.photo)}" alt="" loading="lazy">` : ""}<span class="cap">${esc(g.caption)}</span>${g.photo ? "" : "<small>Placeholder photo</small>"}</button>`).join("") : "<p>No photographs in this category yet.</p>"
}
function renderNotices() {
   const l = [...DATA.notices].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
   $("#notes").innerHTML = l.length ? l.map(n => `<details class="card"><summary>${n.date ? "" : '<span class="ph">Placeholder</span>'}<h3>${esc(n.title)}</h3><small>${n.date ? fmt(n.date) : "Publication date to be added"}</small><p style="margin:6px 0 8px">${esc(n.summary)}</p><u>Read more</u></summary><p>${esc(n.body || "Full notice text goes here once the parish provides it.").replace(/\n/g, "<br>")}</p></details>`).join("") : "<p>No notices at the moment.</p>"
}
/* ---- daily verse ---- */
let lastKey = "";
function todaysVerse() {
   const k = dayKey(), o = (DATA.verseDays || []).find(v => v.date === k && v.text); if (o) return { ref: o.ref || "", text: o.text };
   if (feed) return feed;
   const n = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5), v = VERSES[n % VERSES.length]; return { ref: v[0] + " (KJV)", text: v[1] }
}
function renderVerse(force) {
   const k = dayKey(); if (!force && k === lastKey) return; lastKey = k; const v = todaysVerse();
   $("#vlabel").textContent = "Verse of the day, " + new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
   $("#vtext").setAttribute("aria-label", v.text); $("#vtext").innerHTML = v.text.split(/\s+/).filter(Boolean).map((w, i) => `<span class="w" aria-hidden="true" style="transition-delay:${Math.min(i, 40) * 70}ms">${esc(w)}</span>`).join("");
   $("#vref").textContent = v.ref; $("#vsrc").innerHTML = v.url ? 'Source: <a href="' + esc(v.url) + '" target="_blank" rel="noopener">' + esc(v.source || "Jesus Calls, Today’s Promise") + "</a>" : ""
}
const say = m => { $("#vmsg").textContent = m; setTimeout(() => { $("#vmsg").textContent = "" }, 2800) };
$("#vShare").onclick = async () => { const v = todaysVerse(), t = `“${v.text}” – ${v.ref}\nDCYM Bokaro Parish`; try { if (navigator.share) { await navigator.share({ text: t }); return } await navigator.clipboard.writeText(t); say("Verse copied to your clipboard.") } catch (e) { if (!e || e.name !== "AbortError") say("Could not share. Please select and copy the verse.") } };
function renderAll() { renderContact(); renderAbout(); renderLeaders(); renderActs(); renderEvents(); renderGallery(); renderNotices(); renderVerse(true) }
setInterval(() => { renderVerse(); renderEvents() }, 60000);

/* ---- gallery filter and lightbox ---- */
$("#filters").onclick = e => { if (e.target.tagName === "BUTTON") { cur = e.target.textContent; renderGallery() } };
const lb = $("#lb");
function show() { const g = vis[idx]; $("#lbImg").innerHTML = g.photo ? `<img src="${esc(g.photo)}" alt="${esc(g.caption)}">` : `<div><b style="font-size:22px">${esc(g.caption)}</b><br>Placeholder photo. Replace with a real parish photograph.</div>`; $("#lbCap").textContent = `${g.caption} (${idx + 1} of ${vis.length})` }
$("#gal").onclick = e => { const t = e.target.closest(".tile"); if (t) { idx = +t.dataset.i; show(); lb.showModal() } };
$("#lbPrev").onclick = () => { idx = (idx - 1 + vis.length) % vis.length; show() };
$("#lbNext").onclick = () => { idx = (idx + 1) % vis.length; show() };
$("#lbClose").onclick = () => closeLb();
lb.addEventListener("click", e => { if (e.target === lb) closeLb() }); lb.addEventListener("cancel", e => { e.preventDefault(); closeLb() });
lb.addEventListener("keydown", e => { if (e.key === "ArrowLeft") $("#lbPrev").click(); if (e.key === "ArrowRight") $("#lbNext").click() });

/* ---- contact form ---- */
$("#form").addEventListener("submit", e => {
   e.preventDefault(); const f = e.target, v = k => f[k].value.trim();
   const er = { name: v("name") ? "" : "Please enter your name.", email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email")) ? "" : "Please enter a valid email address.", subject: v("subject") ? "" : "Please enter a subject.", msg: v("message").length >= 10 ? "" : "Please write a message of at least 10 characters." };
   let bad = null; for (const k in er) { $("#e-" + k).textContent = er[k]; const i = $("#f-" + k); i.setAttribute("aria-invalid", er[k] ? "true" : "false"); if (er[k]) { i.classList.remove("shake"); void i.offsetWidth; i.classList.add("shake"); if (!bad) bad = k } }
   if (bad) { $("#ok").textContent = ""; $("#f-" + bad).focus(); return }
   /* Integration point: no server is connected. Replace this with a POST to a form service (Formspree, Netlify Forms, or your own API).
      Until then the message opens in the visitor’s email app. */
   location.href = `mailto:${DATA.contact.email}?subject=${encodeURIComponent(v("subject"))}&body=${encodeURIComponent(v("message") + "\n\n" + v("name") + " (" + v("email") + ")")}`;
   $("#ok").textContent = "Your email app should open with the message ready to send."
});

/* ---- motion and interaction ---- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); setTimeout(() => e.target.style.removeProperty("--d"), 1500) } }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
function reveal() { document.querySelectorAll(".hd,.two>div,.card,.tile,.filters,.map,#form,.contact dl").forEach(el => { if (el.dataset.r) return; el.dataset.r = 1; el.classList.add("rv"); el.style.setProperty("--d", Math.min([...el.parentElement.children].indexOf(el), 6) * 80 + "ms"); io.observe(el) }) }
new MutationObserver(reveal).observe(document.body, { childList: true, subtree: true });
const bar = $("#prog"), hdr = $("header"), toTop = $("#toTop"); let tick = false;
function onS() { const y = scrollY, h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`; hdr.classList.toggle("scrolled", y > 20); toTop.classList.toggle("show", y > 700); tick = false }
addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(onS) } }, { passive: true }); onS();
toTop.onclick = () => smoothTo(0);
const links = [...document.querySelectorAll("#nav a")];
const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => { const on = a.getAttribute("href") === "#" + e.target.id; a.classList.toggle("active", on); on ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current") }) }), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach(s => so.observe(s));
const vo = new IntersectionObserver(es => { if (es[0].isIntersecting) { $(".verse").classList.add("in"); vo.disconnect() } }, { threshold: .35 }); vo.observe($("#vtext"));
const hi = $(".emb"), hs = $(".hero");
{
   const sky = document.createElement("div"); sky.className = "sky"; sky.setAttribute("aria-hidden", "true");
   for (let i = 0; i < 14; i++) { const c = document.createElement("i"); c.style.cssText = `--x:${(i * 7.3 + (i % 4) * 4) % 96}%;--s:${12 + (i * 5) % 16}px;--t:${14 + (i * 3) % 11}s;--dl:-${(i * 2.7) % 20}s`; sky.appendChild(c) }
   hs.prepend(sky)
}
if (matchMedia("(hover:hover)").matches && !matchMedia("(prefers-reduced-motion:reduce)").matches) {
   hi.style.transition = "transform .15s ease-out";
   hs.addEventListener("pointermove", e => { const r = hi.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; hi.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)` });
   hs.addEventListener("pointerleave", () => { hi.style.transform = "" })
}

/* ---- dark mode toggle (circular reveal where supported, smooth fade otherwise) ---- */
{
   const root = document.documentElement, tb = $("#themeBtn"), calm = matchMedia("(prefers-reduced-motion:reduce)").matches;
   const s2 = () => { const d = root.getAttribute("data-theme") === "dark"; tb.setAttribute("aria-pressed", d); tb.setAttribute("aria-label", d ? "Switch to light mode" : "Switch to dark mode") };
   const apply = t => { root.setAttribute("data-theme", t); try { localStorage.setItem("dcym-theme", t) } catch (e) { } s2() };
   s2();
   tb.addEventListener("click", () => {
      const t = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      if (calm) { apply(t); return }
      if (!document.startViewTransition) { root.classList.add("theming"); apply(t); setTimeout(() => root.classList.remove("theming"), 650); return }
      const r = tb.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const vt = document.startViewTransition(() => apply(t));
      vt.ready.then(() => root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] }, { duration: 850, easing: "cubic-bezier(.4,0,.15,1)", pseudoElement: "::view-transition-new(root)" })).catch(() => { })
   })
}

/* ---- gold cross with rays ---- */
function rayCross(wide) {
   const cx = 200, cy = wide ? 197 : 195, R = wide ? [[179.5, 111, 220.8, 354], [117.3, 177.7, 282.7, 216.7]] : [[178, 111, 222, 354], [110, 173, 290, 216]], hit = (x, y) => R.some(r => x > r[0] - 4 && x < r[2] + 4 && y > r[1] - 4 && y < r[3] + 4); let L = "";
   for (let k = 0; k < 24; k++) {
      const a = k * Math.PI / 12, ux = Math.sin(a), uy = -Math.cos(a), even = k % 2 === 0, segs = even ? [[95, 152]] : [[116, 146], [156, 167]];
      let exit = 0; while (exit < 200 && hit(cx + ux * exit, cy + uy * exit)) exit++;
      segs.forEach((s, i) => {
         const r1 = Math.max(s[0], exit + 10), r2 = s[1]; if (r2 - r1 < 8) return;
         L += `<line x1="${(cx + ux * r1).toFixed(1)}" y1="${(cy + uy * r1).toFixed(1)}" x2="${(cx + ux * r2).toFixed(1)}" y2="${(cy + uy * r2).toFixed(1)}" style="animation-delay:${(k * .15 + i * .45).toFixed(2)}s"/>`
      })
   }
   const d = wide ? "M179.5 111h41.3v66.7h61.9v39h-61.9v137.3h-41.3V216.7h-61.9v-39h61.9z" : "M178 111h44v62h68v43h-68v138h-44V216h-68v-43h68z";
   return `<svg class="rc${wide ? " solid" : ""}" viewBox="0 0 400 400" aria-hidden="true" focusable="false"><g class="rays">${L}</g><path class="body" d="${d}"/></svg>`
}
document.querySelectorAll("[data-rc]").forEach(el => { el.innerHTML = rayCross(el.dataset.rc === "solid") });

/* ---- live content from the admin website (Supabase) and the verse feed ---- */
const CFG = window.SITE_CONFIG || {}; let lastPull = "", feed = null;
async function pullContent() { if (!CFG.supabaseUrl || !CFG.supabaseKey) return; try { const r = await fetch(CFG.supabaseUrl.replace(/\/$/, "") + "/rest/v1/site_content?id=eq.1&select=data", { headers: { apikey: CFG.supabaseKey, Authorization: "Bearer " + CFG.supabaseKey } }); if (!r.ok) return; const rows = await r.json(), d = rows[0] && rows[0].data; if (d && Object.keys(d).length) { const s = JSON.stringify(d); if (s !== lastPull) { lastPull = s; setData(Object.assign({}, window.SITE_DATA || {}, d, { saved: true })) } } } catch (e) { } }
async function pullVerse() { if (!CFG.verseFeed) return; try { const c = new AbortController(); setTimeout(() => c.abort(), 7000); const r = await fetch(CFG.verseFeed, { signal: c.signal }); if (!r.ok) return; const j = await r.json(); if (j && j.text && j.ref) { feed = { ref: j.ref, text: j.text, url: safeUrl(j.url), source: j.source || "Jesus Calls, Today’s Promise" }; try { localStorage.setItem("dcym-feed", JSON.stringify({ k: dayKey(), f: feed })) } catch (e) { } renderVerse(true) } } catch (e) { } }
try { const c = JSON.parse(localStorage.getItem("dcym-feed") || "null"); if (c && c.k === dayKey()) feed = c.f } catch (e) { }
setData(window.SITE_DATA || {}); pullContent(); pullVerse(); setInterval(pullContent, 6e4); setInterval(pullVerse, 18e5);


/* ---- button and navigation polish: eased scrolling, press ripples, animated menu and photo viewer ---- */
const calmMotion = matchMedia("(prefers-reduced-motion:reduce)").matches;
let scrollRaf = 0;
function smoothTo(y, done) {
   cancelAnimationFrame(scrollRaf); const max = document.documentElement.scrollHeight - innerHeight; y = Math.max(0, Math.min(y, max)); const y0 = scrollY, dist = y - y0;
   if (calmMotion || Math.abs(dist) < 2) { scrollTo(0, y); done && done(); return }
   const dur = Math.max(550, Math.min(1200, Math.abs(dist) * .55)), t0 = performance.now(), ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, root = document.documentElement;
   root.style.scrollBehavior = "auto";
   const stop = () => { cancelAnimationFrame(scrollRaf); root.style.scrollBehavior = ""; removeEventListener("wheel", stop); removeEventListener("touchstart", stop) };
   addEventListener("wheel", stop, { passive: true }); addEventListener("touchstart", stop, { passive: true });
   const step = now => { const t = Math.min(1, (now - t0) / dur); scrollTo(0, y0 + dist * ease(t)); if (t < 1) scrollRaf = requestAnimationFrame(step); else { stop(); done && done() } }; scrollRaf = requestAnimationFrame(step)
}
document.addEventListener("click", e => {
   const a = e.target.closest('a[href^="#"]'); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return; const id = a.getAttribute("href").slice(1), el = id ? document.getElementById(id) : document.body; if (!el) return; e.preventDefault();
   const off = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 80, y = id ? el.getBoundingClientRect().top + scrollY - off + 1 : 0;
   smoothTo(y, () => {
      try { history.replaceState(null, "", id ? "#" + id : location.pathname + location.search) } catch (_) { }
      if (id) { if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1"); el.focus({ preventScroll: true }); const hd = el.querySelector(".hd"); if (hd) { hd.classList.remove("arrive"); void hd.offsetWidth; hd.classList.add("arrive") } }
   })
});
document.addEventListener("pointerdown", e => {
   if (calmMotion) return; const b = e.target.closest(".btn,.filters button,.theme-btn,.menu-btn,.totop,.lb-bar button"); if (!b || b.disabled) return;
   const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2, s = document.createElement("span"); s.className = "ripple"; s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`; b.appendChild(s); s.addEventListener("animationend", () => s.remove())
});
function closeLb() { if (!lb.open) return; if (calmMotion) { lb.close(); return } lb.classList.add("closing"); setTimeout(() => { lb.close(); lb.classList.remove("closing") }, 220) }
