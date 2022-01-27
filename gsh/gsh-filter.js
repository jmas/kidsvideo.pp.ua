customElements.define(
  "gsh-filter",
  class extends HTMLElement {
    constructor() {
      super();
    }

    static get observedAttributes() {
      return ["filter"];
    }

    get value() {
      return JSON.parse(this.textContent.trim());
    }

    get from() {
      return this.getAttribute("from");
    }

    get fromElement() {
      return document.querySelector(this.from);
    }

    get fromValue() {
      return this.fromElement.value;
    }

    get filter() {
      return this.getAttribute("filter") || "true";
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) {
        return;
      }
      if (name === "filter") {
        this._changeListener();
      }
    }

    connectedCallback() {
      if (!this.fromElement) {
        console.warn(
          `Attribute "from" contains invalid selector. Can't find element.`
        );
        return;
      }
      this._addDataListeners();
    }

    disconnectedCallback() {
      this._removeDataListeners();
    }

    _addDataListeners = () => {
      this.fromElement.addEventListener("change", this._changeListener, true);
    };

    _removeDataListeners = () => {
      this.fromElement.removeEventListener("change", this._changeListener);
    };

    _changeListener = () => {
      this._render(this._filter(this.fromValue, this.filter));
      this._dispatchChangeEvent();
    };

    _filter = (values, filter) => {
      const filterFunction = (item) => {
        return new Function("item", `return ${filter};`)(item);
      };
      return values.filter(filterFunction);
    };

    _render = (value) => {
      this.textContent = JSON.stringify(value);
    };

    _dispatchChangeEvent = () => {
      this.dispatchEvent(new CustomEvent("change"));
    };
  }
);
