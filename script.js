// hardcoded values for suggestions
const hm = {
  hello: ["how are you", "how can i help you"],
  I: ["would like to inform you that", "hope you are doing well"],
  how: ["are you?"],
  My: ["name is Shivam"],
};

class SmartCompose {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.container = document.querySelector(options.container);
    this.suggestedSentences = [];
    // call update function on text change
    quill.on("text-change", this.update.bind(this));
    const body = document.querySelector("body");
    // add shortcut key listener
    body.addEventListener("keyup", this.checkTabPress.bind(this));
  }

  checkTabPress(e) {
    // check if key pressed is between 1 to 9 along with ctrl key
    if (e.keyCode >= 49 && e.keyCode <= 57 && e.ctrlKey) {
      // 1 is having keycode 49. so doing mod will map it to 0.
      // same for others
      const normalizedKeyCode = e.keyCode % 49;
      // check if a valid suggestion is chosen.
      if (normalizedKeyCode >= this.suggestedSentences.length) return;
      this.quill.insertText(
        this.quill.getText().trim().length,
        " " + this.suggestedSentences[normalizedKeyCode]
      );
      // empties the suggestions
      this.suggestedSentences = [];
    }
  }

  // check if any suggestion exist for the last typed word or not.
  calculate() {
    const text = this.quill.getText().split(/\s+/);
    let lastWord = text[text.length - 2];

    if (lastWord in hm) {
      return hm[lastWord];
    }
    return [];
  }

  update() {
    const suggestions = this.calculate();
    // if suggestions exist then map it to different div's with unique key
    const suggestionComp = suggestions.map((suggestion, index) => {
      return `<div>ctrl+${index + 1} for 👉  ${suggestion}</div>`;
    });
    // deep copy suggestions
    this.suggestedSentences = [...suggestions];
    this.container.innerHTML =
      suggestionComp.length > 0
        ? suggestionComp
        : "<div>No suggestions 🥺</div>";
  }
}

Quill.register("modules/smartCompose", SmartCompose);

var quill = new Quill("#editor", {
  modules: {
    smartCompose: {
      container: "#suggestions",
    },
  },
  placeholder: "⚡️ Type to see magic!🪄 Not every time though! 😅",
});
