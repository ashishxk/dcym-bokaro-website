/* DCYM Bokaro Parish admin website.
   A separate site where staff sign in and edit the details and photos shown on the public website.
   Data is stored in your own Supabase project (see backend/setup.sql and the README). */
const C = window.ADMIN_CONFIG || {}, base = (C.supabaseUrl || "").replace(/\/$/, ""), KEY = C.supabaseKey || "";
const DEFAULT = window.DCYM_DEFAULT;
const $ = s => document.querySelector(s);
const h = (t, a = {}, ...k) => { const e = document.createElement(t); for (const [x, v] of Object.entries(a)) { if (x === "class") e.className = v; else if (x.startsWith("on")) e[x] = v; else e.setAttribute(x, v) } k.flat().forEach(c => e.append(c && c.nodeType ? c : document.createTextNode(c == null ? "" : c))); return e };
const app = $("#app");
let session = null, D = null, dirtyFlag = false, active = "Details", uid = 0;
try { session = JSON.parse(localStorage.getItem("dcym-admin-session") || "null") } catch (e) { }

/* ---- Supabase REST helpers ---- */
const jsonH = { apikey: KEY, "Content-Type": "application/json" };
function setSession(j, prev) { session = { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Date.now() + (j.expires_in || 3600) * 1000 - 60000, email: (j.user && j.user.email) || (prev && prev.email) || "" }; try { localStorage.setItem("dcym-admin-session", JSON.stringify(session)) } catch (e) { } }
function logout() { session = null; try { localStorage.removeItem("dcym-admin-session") } catch (e) { } start() }
async function login(email, password) { const r = await fetch(base + "/auth/v1/token?grant_type=password", { method: "POST", headers: jsonH, body: JSON.stringify({ email, password }) }); const j = await r.json(); if (!r.ok) { const m = j.error_description || j.msg || j.message || ""; throw new Error(/invalid api key|apikey/i.test(m) ? "The Supabase key in admin/config.js is wrong or missing (use the anon public key from Project Settings > API)." : /not confirmed/i.test(m) ? "This email is not confirmed yet. In Supabase open Authentication > Users and confirm it." : /invalid login/i.test(m) || !m ? "Wrong email or password. If you are sure they are right, the user may have been created in a different Supabase project than the one in admin/config.js." : m) }; setSession(j) }
async function ensure() { if (!session) throw new Error("Please sign in."); if (Date.now() > session.expires_at) { const r = await fetch(base + "/auth/v1/token?grant_type=refresh_token", { method: "POST", headers: jsonH, body: JSON.stringify({ refresh_token: session.refresh_token }) }); if (!r.ok) { logout(); throw new Error("Your session expired. Please sign in again.") } setSession(await r.json(), session) } }
async function loadData() { const r = await fetch(base + "/rest/v1/site_content?id=eq.1&select=data", { headers: { apikey: KEY, Authorization: "Bearer " + KEY } }); if (!r.ok) throw new Error("Could not load the site content. Check the setup steps."); const rows = await r.json(); return rows[0] && rows[0].data && Object.keys(rows[0].data).length ? rows[0].data : {} }
async function saveData(data) { await ensure(); const r = await fetch(base + "/rest/v1/site_content", { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + session.access_token, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ id: 1, data, updated_at: new Date().toISOString() }) }); if (!r.ok) throw new Error("Could not save. Make sure this account was created in your Supabase project.") }
async function shrink(file, max = 1600) { const bmp = await createImageBitmap(file), k = Math.min(1, max / Math.max(bmp.width, bmp.height)), c = document.createElement("canvas"); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k); c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height); return new Promise(r => c.toBlob(r, "image/jpeg", .85)) }
async function upload(file) { await ensure(); const blob = await shrink(file), name = Date.now() + "-" + Math.random().toString(36).slice(2, 8) + ".jpg"; const r = await fetch(base + "/storage/v1/object/parish-media/" + name, { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + session.access_token, "Content-Type": "image/jpeg" }, body: blob }); if (!r.ok) throw new Error("Upload failed"); return base + "/storage/v1/object/public/parish-media/" + name }

/* ---- editor building blocks ---- */
const status = h("span", { class: "ast", role: "status" });
const dirty = () => { dirtyFlag = true; status.textContent = "Unsaved changes" };
addEventListener("beforeunload", e => { if (dirtyFlag) { e.preventDefault(); e.returnValue = "" } });
function field(label, obj, key, o = {}) { const id = "af" + (uid++), i = o.rows ? h("textarea", { id, rows: o.rows }) : h("input", { id, type: o.type || "text", placeholder: o.ph || "" }); i.value = obj[key] || ""; i.oninput = () => { obj[key] = i.value; dirty() }; return h("div", { class: "af" }, h("label", { for: id }, label), i) }
function photo(label, obj, key) {
   const prev = h("img", { class: "ap", alt: "" }), st = h("span", { class: "ast" }), file = h("input", { type: "file", accept: "image/*", hidden: "" });
   const upd = () => { prev.hidden = !obj[key]; prev.src = obj[key] || "" };
   file.onchange = async () => { const f = file.files[0]; if (!f) return; st.textContent = "Uploading…"; try { obj[key] = await upload(f); upd(); dirty(); st.textContent = "Photo added" } catch (e) { st.textContent = "Upload failed. Please try again." } file.value = "" };
   upd(); return h("div", { class: "af" }, h("label", {}, label), prev, h("div", { class: "arow" }, h("button", { type: "button", class: "ab", onclick: () => file.click() }, "Take or choose photo"), h("button", { type: "button", class: "ab ghost", onclick: () => { obj[key] = ""; upd(); dirty() } }, "Remove photo"), st), file)
}
function del(arr, i, draw) { const b = h("button", { type: "button", class: "ab danger" }, "Delete"); let armed = 0; b.onclick = () => { if (!armed) { armed = 1; b.textContent = "Tap again to delete"; setTimeout(() => { armed = 0; b.textContent = "Delete" }, 3000); return } arr.splice(i, 1); dirty(); draw() }; return b }
function list(arr, mk, label, fields, addText = "+ Add") {
   const box = h("div");
   const draw = () => { box.replaceChildren(...arr.map((it, i) => h("details", { class: "ai" }, h("summary", {}, label(it) || "Item " + (i + 1)), ...fields(it), h("div", { class: "arow" }, h("button", { type: "button", class: "ab ghost", onclick: () => { if (i > 0) { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; dirty(); draw() } } }, "Move up"), del(arr, i, draw)))), h("button", { type: "button", class: "ab add", onclick: () => { arr.push(mk()); dirty(); draw() } }, addText)) }; draw(); return box
}
const tabs = {
   Details: () => [h("h3", {}, "Contact"), field("Email", D.contact, "email", { type: "email" }), field("Phone", D.contact, "phone", { type: "tel" }), field("WhatsApp number with country code", D.contact, "whatsapp", { type: "tel", ph: "919876543210" }), field("Address", D.contact, "address", { rows: 3 }),
   h("h3", {}, "Social media links (full web addresses)"), ...["Facebook", "Instagram", "YouTube"].map(k => field(k, D.contact.social, k, { type: "url", ph: "https://" })),
   h("h3", {}, "About Us"), field("Who we are", D.about, "who", { rows: 3 }), field("Our values", D.about, "values", { rows: 2 }), field("Our mission", D.about, "mission", { rows: 3 }), field("Our vision", D.about, "vision", { rows: 3 })],
   Leaders: () => [list(D.leaders, () => ({ role: "", name: "", desc: "", photo: "" }), l => l.name || l.role, l => [field("Role", l, "role"), field("Name", l, "name"), field("Short description", l, "desc", { rows: 2 }), photo("Photo", l, "photo")])],
   Activities: () => [list(D.activities, () => ({ title: "", desc: "" }), a => a.title, a => [field("Title", a, "title"), field("Description", a, "desc", { rows: 2 })])],
   Events: () => [list(D.events, () => ({ title: "", date: "", time: "", venue: "", desc: "", reg: "", photo: "" }), e => (e.title || "") + (e.date ? " (" + e.date + ")" : ""), e => [field("Title", e, "title"), field("Date", e, "date", { type: "date" }), field("Time", e, "time", { ph: "5:00 PM" }), field("Venue", e, "venue"), field("Description", e, "desc", { rows: 3 }), field("Registration link (optional)", e, "reg", { type: "url", ph: "https://" }), photo("Event photo", e, "photo")])],
   Notices: () => [list(D.notices, () => ({ title: "", date: "", summary: "", body: "" }), n => n.title, n => [field("Title", n, "title"), field("Date", n, "date", { type: "date" }), field("Short summary", n, "summary", { rows: 2 }), field("Full notice", n, "body", { rows: 5 })])],
   Gallery: () => {
      const box = h("div"), st = h("p", { class: "ast" }), file = h("input", { type: "file", accept: "image/*", multiple: "", hidden: "" });
      const draw = () => { box.replaceChildren(list(D.gallery, () => ({ cat: "Youth gatherings", caption: "", photo: "" }), g => g.caption || g.cat, g => [field("Category", g, "cat"), field("Caption", g, "caption"), photo("Photo", g, "photo")], "+ Add one item")) };
      file.onchange = async () => { const fs = [...file.files]; if (!fs.length) return; let n = 0; for (const f of fs) { st.textContent = "Uploading " + (++n) + " of " + fs.length + "…"; try { D.gallery.push({ cat: "Youth gatherings", caption: "", photo: await upload(f) }) } catch (e) { st.textContent = "One upload failed. Please try again."; break } } dirty(); if (n === fs.length) st.textContent = n + " photo(s) added. Open each one to set its caption and category."; file.value = ""; draw() };
      draw(); return [h("button", { type: "button", class: "ab add", onclick: () => file.click() }, "Add several photos at once"), st, file, box]
   },
   Verses: () => [h("p", {}, "The website shows the daily verse automatically. To show your own verse on a certain date instead, add it here."), list(D.verseDays, () => ({ date: "", ref: "", text: "" }), v => (v.date || "") + " " + (v.ref || ""), v => [field("Date", v, "date", { type: "date" }), field("Reference (for example John 3:16)", v, "ref"), field("Verse text", v, "text", { rows: 4 })])]
};
async function save(btn) { btn.disabled = true; status.textContent = "Saving…"; try { D.saved = true; await saveData(JSON.parse(JSON.stringify(D))); dirtyFlag = false; status.textContent = "Saved. The website will show this within a minute." } catch (e) { status.textContent = e.message || "Could not save." } btn.disabled = false }

/* ---- screens ---- */
function merge(stored) { const d = Object.assign(JSON.parse(JSON.stringify(DEFAULT)), stored || {}); d.contact = Object.assign({}, DEFAULT.contact, (stored || {}).contact || {}); d.contact.social = Object.assign({ Facebook: "", Instagram: "", YouTube: "" }, d.contact.social || {}); d.about = Object.assign({}, DEFAULT.about, (stored || {}).about || {}); return d }
function screenSetup() { app.replaceChildren(h("main", { class: "login" }, h("h1", {}, "Setup needed"), h("p", {}, "This admin website is not connected yet. Open config.js, paste your Supabase project URL and anon key, then reload. The README has the five setup steps."))) }
function screenLogin(msg) {
   const em = h("input", { type: "email", autocomplete: "username", required: "", id: "lg-e" }), pw = h("input", { type: "password", autocomplete: "current-password", required: "", id: "lg-p" }), err = h("p", { class: "ast", role: "alert" }, msg || "");
   const f = h("form", { class: "login-card" }, h("div", { class: "af" }, h("label", { for: "lg-e" }, "Email"), em), h("div", { class: "af" }, h("label", { for: "lg-p" }, "Password"), pw), h("button", { class: "ab save", type: "submit" }, "Sign in"), err);
   f.onsubmit = async e => { e.preventDefault(); err.textContent = "Signing in…"; try { await login(em.value.trim(), pw.value); start() } catch (x) { err.textContent = x.message } };
   app.replaceChildren(h("main", { class: "login" }, h("img", { src: "logo.png", alt: "DCYM Bokaro Parish emblem", class: "login-logo" }), h("h1", {}, "DCYM Bokaro Parish"), h("p", {}, "Admin sign in"), f))
}
function screenEditor() {
   const saveBtn = h("button", { type: "button", class: "ab save" }, "Save changes"); saveBtn.onclick = () => save(saveBtn);
   const tabBar = h("div", { class: "adm-tabs", role: "tablist" }), body = h("div", { class: "adm-body" });
   const draw = () => { tabBar.replaceChildren(...Object.keys(tabs).map(k => h("button", { type: "button", role: "tab", "aria-selected": String(k === active), onclick: () => { active = k; draw() } }, k))); body.replaceChildren(...tabs[active]()); body.scrollTop = 0 };
   const site = C.siteUrl ? h("a", { class: "ab ghost lnk", href: C.siteUrl, target: "_blank", rel: "noopener" }, "View website") : "";
   app.replaceChildren(h("div", { class: "adm" }, h("div", { class: "adm-top" }, h("b", {}, "Edit website"), h("span", { class: "arow" }, site, h("button", { type: "button", class: "ab ghost", onclick: logout }, "Sign out"))), tabBar, body, h("div", { class: "adm-save" }, saveBtn, status))); draw()
}
async function start() {
   if (!base || !KEY) { screenSetup(); return } if (!session) { screenLogin(); return }
   try { await ensure(); D = merge(await loadData()); dirtyFlag = false; screenEditor() } catch (e) { if (session) app.replaceChildren(h("main", { class: "login" }, h("p", { class: "ast" }, e.message), h("button", { class: "ab", onclick: start }, "Try again"), h("button", { class: "ab ghost", onclick: logout }, "Sign out"))); else screenLogin(e.message) }
}
start();
