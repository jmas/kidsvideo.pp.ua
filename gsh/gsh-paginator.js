customElements.define(
  "gsh-paginator",
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

    get limit() {
      return parseInt(this.getAttribute("limit"), 10) || 20;
    }

    get offset() {
      return parseInt(this.getAttribute("offset"), 10) || 0;
    }

    get fromElement() {
      return document.querySelector(this.from);
    }

    get fromValue() {
      return this.fromElement.value || [];
    }

    connectedCallback() {
      if (!this.fromElement) {
        console.warn(
          `Attribute "from-left" contains invalid selector. Can't find element.`
        );
        return;
      }
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
      this.rightElement.removeEventListener("change", this._dataChangeListener);
    };

    _dataChangeListener = () => {
      this._render(this._paginate(this.fromValue, this.limit, this.offset));
      this._dispatchChangeEvent();
    };

    _paginate = (values, limit, offset) => {
      const start = offset;
      const end = offset + limit;
      return values.slice(start, end > values.length ? values.length : end);
    };

    _render = (value) => {
      this.textContent = JSON.stringify(value);
    };

    _dispatchChangeEvent = () => {
      this.dispatchEvent(new CustomEvent("change"));
    };
  }
);
