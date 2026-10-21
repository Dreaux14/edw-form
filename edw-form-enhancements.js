// E. D. White Alumni Directory Form — layout & helper tweaks
// ---------------------------------------------------------------------------
// Runs after Bloomerang injects the form. Two tweaks:
//
//   1. Maiden Name moves up next to First/Last Name.
//   2. "Any news?" becomes topic chips + a guiding question per topic.
//
// How both stay compatible with Bloomerang: Bloomerang only collects custom
// fields found inside ".section.custom-fields" whose id contains "Account".
// So each original <input id="CustomAccountField_..."> stays in that section
// as a hidden input and is the only thing Bloomerang reads. The visible
// replacements have no "Account" in their ids and just keep it in sync.
(function () {
  var MAIDEN_ID = "CustomAccountField_16386";
  var NEWS_ID = "CustomAccountField_4282369";

  // One guiding question per topic keeps the prompt box short even when
  // several chips are picked. "tag" is what Bloomerang stores.
  var TOPICS = [
    { tag: "Graduated", label: "Graduated", prompt: "Which school and degree, and what's next for you?" },
    { tag: "New job", label: "New job", prompt: "Where are you working, and what's your role?" },
    { tag: "Married", label: "Got married", prompt: "Who's the lucky one, and when was the big day? Fellow Cardinal?" },
    { tag: "New baby", label: "New baby", prompt: "What's your little one's name and birthday?" },
    { tag: "Achievement", label: "Achievement", prompt: "What did you accomplish? An award, promotion, certification, business launch…" },
    { tag: "Other", label: "Other", prompt: "Moved, retired, reconnected with classmates? Tell us what's new!" }
  ];

  var DEFAULT_PLACEHOLDER = "Share an update with the E. D. White family…";
  var PICKED_PLACEHOLDER = "Share the details here…";

  // Swap a Bloomerang input for a visible stand-in. The original becomes a
  // hidden input left where Bloomerang looks for it.
  function hideOriginal(original) {
    original.setAttribute("data-edw-enhanced", "1");
    original.type = "hidden";
  }

  function moveMaidenName() {
    var original = document.getElementById(MAIDEN_ID);
    if (!original) return false;
    if (original.getAttribute("data-edw-enhanced")) return true;
    var lastName = document.querySelector(".interaction-form .field.last-name");
    if (!lastName) return false;

    var field = original.parentNode;
    var label = field.querySelector("label");

    var visible = document.createElement("input");
    visible.type = "text";
    visible.id = "edw-maiden-name";
    visible.maxLength = original.maxLength > 0 ? original.maxLength : 255;
    visible.placeholder = "If applicable";
    visible.value = original.value;
    visible.addEventListener("input", function () {
      original.value = visible.value;
    });

    // Leave the hidden original in the custom-fields section, then move the
    // visible field (label + stand-in) up beside Last Name.
    field.parentNode.insertBefore(original, field);
    hideOriginal(original);
    field.appendChild(visible);
    if (label) {
      label.htmlFor = visible.id;
      var text = label.querySelector(".label");
      if (text) text.textContent = "Maiden Name";
    }
    lastName.parentNode.insertBefore(field, lastName.nextSibling);
    return true;
  }

  function enhanceNews() {
    var original = document.getElementById(NEWS_ID);
    if (!original) return false;
    if (original.getAttribute("data-edw-enhanced")) return true;

    var field = original.parentNode;
    var label = field.querySelector("label");
    var max = original.maxLength > 0 ? original.maxLength : 255;

    var wrap = document.createElement("div");
    wrap.className = "edw-news";

    var hint = document.createElement("p");
    hint.className = "edw-news-hint";
    hint.textContent = "Pick anything that applies and we'll suggest what to include.";

    var chips = document.createElement("div");
    chips.className = "checkboxes edw-news-topics";
    chips.setAttribute("role", "group");
    chips.setAttribute("aria-label", "What's your news about?");

    var buttons = TOPICS.map(function (topic) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "checkbox";
      b.setAttribute("aria-pressed", "false");
      b.textContent = topic.label;
      b.addEventListener("click", function () {
        var on = b.classList.toggle("selected");
        b.setAttribute("aria-pressed", on ? "true" : "false");
        update();
      });
      chips.appendChild(b);
      return b;
    });

    var prompts = document.createElement("div");
    prompts.className = "edw-news-prompts";
    prompts.hidden = true;
    prompts.innerHTML = "<p>A few things we'd love to hear:</p><ul></ul>";
    var promptList = prompts.querySelector("ul");

    var text = document.createElement("textarea");
    text.id = "edw-news-text";
    text.rows = 4;
    text.placeholder = DEFAULT_PLACEHOLDER;
    text.addEventListener("input", update);

    var count = document.createElement("div");
    count.className = "edw-news-count";
    count.setAttribute("aria-live", "polite");

    wrap.appendChild(hint);
    wrap.appendChild(chips);
    wrap.appendChild(prompts);
    wrap.appendChild(text);
    wrap.appendChild(count);

    hideOriginal(original);
    field.insertBefore(wrap, original);
    if (label) label.htmlFor = text.id;

    function update() {
      var picked = TOPICS.filter(function (t, i) { return buttons[i].classList.contains("selected"); });
      var prefix = picked.length ? "[" + picked.map(function (t) { return t.tag; }).join(", ") + "] " : "";
      var room = max - prefix.length;

      // What Bloomerang will store.
      original.value = (prefix + text.value.trim()).trim().slice(0, max);

      text.maxLength = room;
      text.placeholder = picked.length ? PICKED_PLACEHOLDER : DEFAULT_PLACEHOLDER;

      promptList.innerHTML = "";
      picked.forEach(function (t) {
        var li = document.createElement("li");
        li.textContent = t.prompt;
        promptList.appendChild(li);
      });
      prompts.hidden = !picked.length;

      var left = room - text.value.length;
      count.textContent = left >= 0
        ? left + " characters left"
        : -left + " characters over the limit; the end will be cut off";
      count.classList.toggle("is-low", left < 30);
    }

    update();
    return true;
  }

  // Bloomerang injects the form asynchronously, so retry until every tweak
  // has found its field.
  var pending = [moveMaidenName, enhanceNews];
  function run() {
    pending = pending.filter(function (task) { return !task(); });
    return !pending.length;
  }

  if (!run()) {
    var observer = new MutationObserver(function () {
      if (run()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
