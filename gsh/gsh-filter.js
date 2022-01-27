customElements.define(
  "gsh-filter",
  class extends HTMLElement {
    constructor() {
      super();
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

    connectedCallback() {
      this._addDataListeners();
    }

    disconnectedCallback() {
      this._removeDataListeners();
    }

    _addDataListeners = () => {
      this.fromElement.addEventListener(
        "change",
        this._dataChangeListener,
        true
      );
    };

    _removeDataListeners = () => {
      this.fromElement.removeEventListener("change", this._dataChangeListener);
    };

    _dataChangeListener = () => {
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
