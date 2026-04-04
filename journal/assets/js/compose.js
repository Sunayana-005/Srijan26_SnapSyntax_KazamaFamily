(function () {
  const STORAGE_KEY = "stillroom.entries";
  const DRAFT_KEY = "stillroom.draft";

  const form = document.getElementById("journalForm");
  if (!form) return;

  const titleInput = document.getElementById("entryTitle");
  const moodInput = document.getElementById("entryMood");
  const tagsInput = document.getElementById("entryTags");
  const bodyInput = document.getElementById("entryBody");
  const saveMessage = document.getElementById("saveMessage");
  const wordCount = document.getElementById("wordCount");
  const fields = [titleInput, moodInput, tagsInput, bodyInput];

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

  function splitTags(value) {
    return String(value || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  const getEntries = () => readJSON(STORAGE_KEY, []);
  const getDraft = () => readJSON(DRAFT_KEY, null);
  const setEntries = (entries) => writeJSON(STORAGE_KEY, entries);

  function setDraft() {
    writeJSON(DRAFT_KEY, {
      title: titleInput.value,
      mood: moodInput.value,
      tags: tagsInput.value,
      body: bodyInput.value
    });
    saveMessage.textContent = "Draft saved";
  }

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
  }

  function updateWordCount() {
    wordCount.textContent = `${countWords(bodyInput.value)} words`;
  }

  const savedDraft = getDraft();
  if (savedDraft) {
    titleInput.value = savedDraft.title || "";
    moodInput.value = savedDraft.mood || "Focused";
    tagsInput.value = savedDraft.tags || "";
    bodyInput.value = savedDraft.body || "";
    saveMessage.textContent = "Draft restored";
  }

  updateWordCount();

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      setDraft();
      updateWordCount();
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title || !body) {
      saveMessage.textContent = "Title and entry are required";
      return;
    }

    const entry = {
      id: Date.now(),
      title,
      mood: moodInput.value,
      tags: splitTags(tagsInput.value),
      body,
      createdAt: new Date().toISOString()
    };

    const entries = getEntries();
    entries.unshift(entry);
    setEntries(entries);

    clearDraft();
    form.reset();
    moodInput.value = "Focused";
    updateWordCount();
    saveMessage.textContent = "Entry saved to your local library";
  });
})();
