customElements.define(
  "gsh-paginator",
  class extends HTMLElement {
    constructor() {
      super();
      this._value = [];
    }

    static get observedAttributes() {
      return ["limit", "offset"];
    }

    get value() {
      return this._value;
    }

    set value(value) {
      this._value = value;
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

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) {
        return;
      }
      if (name === "limit" || name === "offset") {
        this._changeListener();
      }
    }

    _addDataListeners = () => {
      this.fromElement.addEventListener("change", this._changeListener, true);
    };

    _removeDataListeners = () => {
      this.fromElement.removeEventListener("change", this._changeListener);
      this.rightElement.removeEventListener("change", this._changeListener);
    };

    _changeListener = () => {
      this._paginate(this.fromValue, this.limit, this.offset).then((values) => {
        this.value = values;
        this._dispatchChangeEvent();
      });
    };

    _paginate = (values, limit, offset) => {
      const fnArgs = [values, limit, offset];
      function fn(values, limit, offset) {
        const start = offset;
        const end = offset + limit;
        return values.slice(start, end > values.length ? values.length : end);
      }
      if ("Worker" in window) {
        return new Promise((resolve) => {
          const worker = new Worker("gsh/gsh-worker.js");
          worker.onmessage = (event) => {
            resolve(event.data);
            worker.terminate();
          };
          worker.postMessage([fn.toString(), fnArgs]);
        });
      } else {
        return Promise.resolve(fn(...fnArgs));
      }
    };

    _dispatchChangeEvent = () => {
      this.dispatchEvent(new CustomEvent("change"));
    };
  }
);
