// ArbiTracker site: the compare teaser, the app demo, screenshots and the idea button.
// Own code only: no outside scripts, no tracking (see privacy.html).

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Compare teaser: funny pairs ----------
const pairs = [
  ["'sleep'", "'the full moon'"],
  ["'mood'", "'the neighbour's cat visiting'"],
  ["'chess wins'", "'your lucky socks'"],
  ["'headaches'", "'your team losing'"],
  ["'sleep'", "'spicy dinners'"],
  ["'houseplant growth'", "'talking to them'"],
  ["'productivity'", "'how messy your desk is'"],
  ["'mood'", "'rainy days'"]
];

const pairA = document.getElementById("pair-a");
const pairB = document.getElementById("pair-b");

if (pairA && pairB && !reduceMotion) {
  let p = 0;

  setInterval(() => {
    pairA.classList.add("out");
    pairB.classList.add("out");

    setTimeout(() => {
      p = (p + 1) % pairs.length;
      pairA.textContent = pairs[p][0];
      pairB.textContent = pairs[p][1];
      pairA.classList.remove("out");
      pairB.classList.remove("out");
    }, 400);
  }, 5000);
}

// ---------- Setup demo, drawn like the app ----------
// Left: "Setup measurement(s)". Right: the node's entry card, rebuilt live from it.

const TYPES = ["Number", "Boolean", "Text", "Timestamp", "Category"];
const DEFAULT_OPTIONS = ["Home", "Work", "Elsewhere"];

const presets = {
  run: {
    node: "Morning run",
    fields: [
      { name: "Distance", type: "Number", unit: "km" },
      { name: "Felt good", type: "Boolean" },
      { name: "Route", type: "Category", options: ["Park", "River", "Hills"] },
      { name: "Note", type: "Text" }
    ]
  },
  mood: {
    node: "Mood",
    fields: [
      { name: "Mood", type: "Number", min: 1, max: 10 },
      { name: "Where", type: "Category", options: ["Home", "Work", "Outside"] },
      { name: "With people", type: "Boolean" }
    ]
  },
  trivia: {
    node: "Trivial pursuit",
    fields: [
      { name: "Category", type: "Category", options: ["Geography", "Entertainment", "History", "Arts & literature", "Science & nature", "Sports & leisure"] },
      { name: "Correct", type: "Boolean" }
    ]
  },
  cat: {
    node: "The neighbour's cat",
    fields: [
      { name: "Arrived", type: "Timestamp" },
      { name: "Brought a gift", type: "Boolean" }
    ]
  }
};

let fields = [];
let values = {};
let nextId = 1;

const setupEl = document.getElementById("setup-fields");
const entryEl = document.getElementById("entry-fields");
const nodeTitle = document.getElementById("app-node");
const recentEl = document.getElementById("recent");
const recentTitle = document.getElementById("recent-title");
const snackbar = document.getElementById("snackbar");
const presetChips = document.querySelectorAll(".chip[data-demo]");

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function loadPreset(key) {
  const preset = presets[key];
  if (!preset) return;

  fields = preset.fields.map((f) => ({ ...f, id: nextId++ }));
  values = {};
  nodeTitle.textContent = preset.node;
  recentEl.replaceChildren();
  recentTitle.hidden = true;

  presetChips.forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.demo === key)));

  renderSetup();
  renderEntry();
}

// ----- Left: one card per measurement -----
function renderSetup() {
  setupEl.replaceChildren();

  fields.forEach((field) => {
    const card = el("div", "def-card");

    // Name
    const nameRow = el("div", "def-row");
    nameRow.append(el("span", "def-label", "Name"));

    const nameInput = el("input", "def-input");
    nameInput.value = field.name;
    nameInput.setAttribute("aria-label", "Measurement name");
    nameInput.addEventListener("input", () => {
      field.name = nameInput.value;
      const label = entryEl.querySelector(`[data-name="${field.id}"]`);
      if (label) label.textContent = field.name;
    });
    nameRow.append(nameInput);

    const del = el("button", "def-delete", "×");
    del.setAttribute("aria-label", "Delete measurement");
    del.addEventListener("click", () => {
      fields = fields.filter((f) => f !== field);
      delete values[field.id];
      renderSetup();
      renderEntry();
    });
    nameRow.append(del);
    card.append(nameRow);

    // Type
    const typeRow = el("div", "def-row");
    typeRow.append(el("span", "def-label", "Type"));

    const select = el("select", "type-pill");
    select.setAttribute("aria-label", "Measurement type");
    TYPES.forEach((type) => {
      const option = el("option", "", type);
      option.value = type;
      option.selected = type === field.type;
      select.append(option);
    });
    select.addEventListener("change", () => {
      field.type = select.value;
      delete field.min;
      delete field.max;
      delete values[field.id];
      if (field.type === "Category" && !field.options) field.options = DEFAULT_OPTIONS;
      renderSetup();
      renderEntry();
    });
    typeRow.append(select);
    card.append(typeRow);

    // Unit (numbers) or options (categories)
    if (field.type === "Number" && field.min === undefined) {
      const unitRow = el("div", "def-row");
      unitRow.append(el("span", "def-label", "Unit"));

      const unitInput = el("input", "def-input");
      unitInput.value = field.unit || "";
      unitInput.setAttribute("aria-label", "Unit");
      unitInput.addEventListener("input", () => {
        field.unit = unitInput.value;
        const unit = entryEl.querySelector(`[data-unit="${field.id}"]`);
        if (unit) unit.textContent = field.unit;
      });
      unitRow.append(unitInput);
      card.append(unitRow);
    }

    if (field.type === "Number" && field.min !== undefined) {
      const rulesRow = el("div", "def-row");
      rulesRow.append(el("span", "def-label", "Rules"));
      rulesRow.append(el("span", "def-options", `Whole numbers, ${field.min}–${field.max}`));
      card.append(rulesRow);
    }

    if (field.type === "Category") {
      const optRow = el("div", "def-row");
      optRow.append(el("span", "def-label", "Category"));
      optRow.append(el("span", "def-options", field.options.join(", ")));
      card.append(optRow);
    }

    setupEl.append(card);
  });
}

document.getElementById("add-field")?.addEventListener("click", () => {
  fields.push({ id: nextId++, name: "", type: "Number" });
  renderSetup();
  renderEntry();
  const inputs = setupEl.querySelectorAll(".def-card:last-child .def-input");
  inputs[0]?.focus();
});

// ----- Right: the entry form (ObservationFormView) -----
function closeMenus() {
  entryEl.querySelectorAll(".menu").forEach((m) => m.remove());
}

function renderEntry() {
  entryEl.replaceChildren();

  fields.forEach((field) => {
    const wrap = el("div", "form-field");

    const name = el("div", "form-name");
    const label = el("span", "", field.name);
    label.dataset.name = field.id;
    name.append(label);
    wrap.append(name);

    const row = el("div", "form-row");

    if (field.type === "Number" && field.min !== undefined) {
      row.classList.add("cells");
      for (let n = field.min; n <= field.max; n++) {
        const cell = el("button", "cell" + (values[field.id] === n ? " on" : ""), String(n));
        cell.addEventListener("click", () => {
          values[field.id] = values[field.id] === n ? undefined : n;
          row.querySelectorAll(".cell").forEach((c) => c.classList.toggle("on", Number(c.textContent) === values[field.id]));
        });
        row.append(cell);
      }
    } else if (field.type === "Number" || field.type === "Text") {
      const input = el("input");
      input.inputMode = field.type === "Number" ? "decimal" : "text";
      input.value = values[field.id] ?? "";
      input.setAttribute("aria-label", field.name);
      input.addEventListener("input", () => { values[field.id] = input.value; });
      row.append(input);
      row.addEventListener("click", () => input.focus());

      if (field.type === "Number") {
        const unit = el("span", "unit", field.unit || "");
        unit.dataset.unit = field.id;
        row.append(unit);
      }
    } else if (field.type === "Boolean") {
      const on = values[field.id] === true;
      const state = el("span", "value", on ? "Yes" : "No");
      const toggle = el("span", "switch" + (on ? " on" : ""));
      row.append(state, toggle);
      row.addEventListener("click", () => {
        values[field.id] = !values[field.id];
        state.textContent = values[field.id] ? "Yes" : "No";
        toggle.classList.toggle("on", values[field.id]);
      });
    } else if (field.type === "Timestamp") {
      const value = el("span", "value", values[field.id] || "");
      row.append(value, el("span", "chev", "▾"));
      row.addEventListener("click", () => {
        values[field.id] = timeNow();
        value.textContent = values[field.id];
      });
    } else if (field.type === "Category") {
      const value = el("span", "value", values[field.id] || "");
      row.append(value, el("span", "chev", "▾"));
      row.addEventListener("click", (event) => {
        event.stopPropagation();
        const open = row.querySelector(".menu");
        closeMenus();
        if (open) return;

        const menu = el("div", "menu");
        ["None", ...field.options].forEach((option, i) => {
          const item = el("button", "", option);
          item.addEventListener("click", (e) => {
            e.stopPropagation();
            values[field.id] = i === 0 ? undefined : option;
            value.textContent = values[field.id] || "";
            closeMenus();
          });
          menu.append(item);
        });
        row.append(menu);
      });
    }

    wrap.append(row);
    entryEl.append(wrap);
  });
}

document.addEventListener("click", closeMenus);

// ----- Save: one observation -----
let snackTimer;

document.getElementById("save-observation")?.addEventListener("click", () => {
  const parts = fields
    .map((field) => {
      let value = values[field.id];
      if (field.type === "Boolean") value = value ? "Yes" : "No";
      if (value === undefined || value === "") return null;
      if (field.type === "Number" && field.unit) value = `${value} ${field.unit}`;
      return `${field.name || "?"}: ${value}`;
    })
    .filter(Boolean);

  const item = el("div", "recent-item");
  item.append(el("div", "when", `Today ${timeNow()}`));
  item.append(el("div", "", parts.join(" · ") || "Nothing filled in"));

  recentEl.prepend(item);
  while (recentEl.children.length > 3) recentEl.lastChild.remove();
  recentTitle.hidden = false;

  values = {};
  renderEntry();

  snackbar.classList.add("show");
  clearTimeout(snackTimer);
  snackTimer = setTimeout(() => snackbar.classList.remove("show"), 1800);
});

presetChips.forEach((chip) => chip.addEventListener("click", () => loadPreset(chip.dataset.demo)));

if (setupEl && entryEl) loadPreset("run");

// ---------- Screenshots: tap to see the whole screen ----------
const lightbox = document.getElementById("lightbox");

if (lightbox) {
  const big = lightbox.querySelector("img");

  document.querySelectorAll(".shot, .notif").forEach((img) => {
    img.addEventListener("click", () => {
      big.src = img.src;
      big.alt = img.alt;
      lightbox.hidden = false;
    });
  });

  lightbox.addEventListener("click", () => { lightbox.hidden = true; });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") lightbox.hidden = true; });
}

// ---------- Floating "Share an idea": after the hero, until the contact card ----------
const floatIdea = document.getElementById("float-idea");
const hero = document.querySelector(".hero");
const contact = document.getElementById("contact");

if (floatIdea && hero && contact && "IntersectionObserver" in window) {
  let heroVisible = true;
  let contactVisible = false;

  const update = () => floatIdea.classList.toggle("show", !heroVisible && !contactVisible);

  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; update(); }).observe(hero);
  new IntersectionObserver(([e]) => { contactVisible = e.isIntersecting; update(); }).observe(contact);
}
