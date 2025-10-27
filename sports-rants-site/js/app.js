// Simple SPA for a static blog: hash-based router, search, tags, and JSON-stored posts.
const state = {
  posts: [],
  filterTag: "All",
  search: "",
};

const el = (sel) => document.querySelector(sel);
const app = el("#app");
const searchInput = el("#search");
const tagButtons = document.querySelectorAll(".tag-btn");

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function loadData() {
  const res = await fetch("data/posts.json?ts=" + Date.now());
  state.posts = await res.json();
  // sort newest first by date
  state.posts.sort((a,b)=> new Date(b.date) - new Date(a.date));
  render();
}

function renderList() {
  const q = state.search.trim().toLowerCase();
  const filtered = state.posts.filter(p => {
    const tagOK = state.filterTag === "All" || (p.tags || []).includes(state.filterTag);
    const text = (p.title + " " + (p.subtitle||"") + " " + p.body).toLowerCase();
    const qOK = !q || text.includes(q);
    return tagOK && qOK;
  });

  const cards = filtered.map(p => {
    const date = new Date(p.date).toLocaleDateString(undefined, {year:'numeric', month:'short', day:'numeric'});
    return `
      <article class="rounded-2xl border border-neutral-200 bg-white p-5 hover:shadow-sm transition">
        <a href="#/post/${p.slug}" class="block">
          <h2 class="text-xl font-semibold mb-1">${p.title}</h2>
          <p class="text-sm text-neutral-500 mb-3">${date} • ${p.tags.join(" • ")}</p>
          ${p.subtitle ? `<p class="text-neutral-700">${p.subtitle}</p>` : ""}
        </a>
      </article>
    `;
  }).join("") || `<p class="text-neutral-600">No posts yet.</p>`;

  app.innerHTML = `<div class="grid gap-4">${cards}</div>`;
}

function mdToHtml(md) {
  // Tiny markdown-ish parser (headings, bold, italics, code block, list)
  let html = md
    .replace(/```([\s\S]*?)```/g, (_, code) => `<pre class="bg-neutral-100 rounded-xl p-3 overflow-auto"><code>${escapeHtml(code)}</code></pre>`)
    .replace(/^### (.*)$/gm, "<h3 class='text-lg font-semibold mt-6 mb-2'>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2 class='text-2xl font-semibold mt-6 mb-3'>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1 class='text-3xl font-bold mt-6 mb-3'>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.*)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul class='list-disc pl-6 space-y-1'>$1</ul>")
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br/>");
  return `<div class="prose"><p>${html}</p></div>`;
}

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

function renderPost(slug) {
  const p = state.posts.find(x => x.slug === slug);
  if (!p) {
    app.innerHTML = `<p class="text-neutral-600">Post not found.</p>`;
    return;
  }
  const date = new Date(p.date).toLocaleDateString(undefined, {year:'numeric', month:'long', day:'numeric'});
  app.innerHTML = `
    <article class="max-w-3xl">
      <a href="#/" class="text-sm underline decoration-neutral-300 hover:decoration-neutral-800">← Back</a>
      <h1 class="text-3xl font-bold mt-4 mb-2">${p.title}</h1>
      <p class="text-sm text-neutral-500">${date} • ${p.tags.join(" • ")}</p>
      ${p.subtitle ? `<p class="mt-3 text-neutral-700">${p.subtitle}</p>` : ""}
      <div class="mt-6">${mdToHtml(p.body)}</div>
    </article>
  `;
}

function renderAbout() {
  app.innerHTML = `
    <section class="max-w-3xl">
      <h1 class="text-3xl font-bold mb-3">About</h1>
      <p class="text-neutral-700">Short, sharp sports rants and analysis on the Miami Dolphins and Washington Wizards. Built as a static site you can deploy on GitHub Pages, Netlify, or Vercel.</p>
      <p class="mt-4 text-neutral-700">Edit <code>data/posts.json</code> to add posts. Update <code>stats/*.json</code> to refresh the manual widgets. Analytics + newsletter are optional.</p>
    </section>
  `;
}

function router() {
  const hash = location.hash.slice(1) || "/";
  const [_, route, param] = hash.split("/");
  if (route === "" || route === undefined) {
    renderList();
  } else if (route === "post" && param) {
    renderPost(param);
  } else if (route === "about") {
    renderAbout();
  } else {
    renderList();
  }
}

function bindUI() {
  // Tag toggles
  tagButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tagButtons.forEach(b => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      state.filterTag = btn.dataset.tag;
      router();
    });
  });

  // Search
  searchInput.addEventListener("input", (e) => {
    state.search = e.target.value;
    router();
  });
}

async function loadStats() {
  for (const team of ["dolphins", "wizards"]) {
    try {
      const res = await fetch(`stats/${team}.json?ts=${Date.now()}`);
      const data = await res.json();
      const elId = `${team}-stats`;
      const target = document.getElementById(elId);
      target.innerHTML = `
        <div class="grid grid-cols-2 gap-x-4 gap-y-1">
          <div class="text-neutral-500">Opponent:</div><div>${data.opponent}</div>
          <div class="text-neutral-500">Score:</div><div>${data.team_score}–${data.opp_score}</div>
          <div class="text-neutral-500">Key stat:</div><div>${data.key_stat}</div>
          <div class="text-neutral-500">Notes:</div><div>${data.notes}</div>
        </div>
      `;
    } catch (e) {
      // ignore
    }
  }
}

window.addEventListener("hashchange", router);

bindUI();
loadData();
loadStats();
router();
