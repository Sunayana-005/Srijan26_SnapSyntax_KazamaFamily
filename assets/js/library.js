(function () {
  const STORAGE_KEY = "stillroom.entries";

  const entriesList = document.getElementById("entriesList");

  const entryCount = document.getElementById("entryCount");
  const latestDate = document.getElementById("latestDate");
  const totalWords = document.getElementById("totalWords");

  if (!entriesList) return;

  function readJSON(key, fallback) {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;

    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function countWords(text) {
    const normalized = String(text || "").trim();
    return normalized ? normalized.split(/\s+/).length : 0;
  }

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return "Unknown date";

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  const getEntries = () => readJSON(STORAGE_KEY, []);
  const setEntries = (entries) => writeJSON(STORAGE_KEY, entries);

  function updateStats(entries) {
    entryCount.textContent = String(entries.length);

    if (entries.length === 0) {
      latestDate.textContent = "-";
      totalWords.textContent = "0";
      return;
    }

    latestDate.textContent = formatDate(entries[0].createdAt);
    const words = entries.reduce((sum, item) => sum + countWords(item.body || ""), 0);
    totalWords.textContent = String(words);
  }

  function buildEntryCard(entry) {
    const article = document.createElement("article");

    const tags = Array.isArray(entry.tags) ? entry.tags : [];
    const excerpt = (entry.body || "").slice(0, 280);

    const top = document.createElement("div");
    top.className = "entry-top";

    const titleWrap = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = entry.title || "Untitled";
    const date = document.createElement("p");
    date.textContent = formatDate(entry.createdAt);
    titleWrap.appendChild(title);
    titleWrap.appendChild(date);

    const mood = document.createElement("span");
    mood.className = "pill";
    mood.textContent = entry.mood || "Unlabeled";

    top.appendChild(titleWrap);
    top.appendChild(mood);

    const meta = document.createElement("div");
    meta.className = "entry-meta";

    tags.forEach((tag) => {
      const pill = document.createElement("span");
      pill.className = "pill";
      pill.textContent = tag;
      meta.appendChild(pill);
    });

    const body = document.createElement("p");
    body.className = "entry-body";
    body.textContent = excerpt;

    const actions = document.createElement("div");
    actions.className = "entry-actions";

    const toggleButton = document.createElement("button");
    toggleButton.className = "ghost";
    toggleButton.type = "button";
    toggleButton.textContent = "Read More";

    const deleteButton = document.createElement("button");
    deleteButton.className = "ghost";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    actions.appendChild(toggleButton);
    actions.appendChild(deleteButton);

    article.appendChild(top);
    article.appendChild(meta);
    article.appendChild(body);
    article.appendChild(actions);

    let expanded = false;

    toggleButton.addEventListener("click", () => {
      expanded = !expanded;
      body.textContent = expanded ? entry.body : excerpt;
      toggleButton.textContent = expanded ? "Collapse" : "Read More";
    });

    deleteButton.addEventListener("click", () => {
      const entries = getEntries();
      const next = entries.filter((item) => item.id !== entry.id);
      setEntries(next);
      render();
    });

    return article;
  }

  function renderEmpty() {
    entriesList.innerHTML = `
      <div>
        <h3>No entries yet.</h3>
        <p>Use the Write page to create your first journal entry.</p>
      </div>
    `;
  }

  function render() {
    const allEntries = getEntries();
    updateStats(allEntries);

    entriesList.innerHTML = "";

    if (allEntries.length === 0) {
      renderEmpty();
      return;
    }

    allEntries.forEach((entry) => {
      entriesList.appendChild(buildEntryCard(entry));
    });
  }

  render();
})();
