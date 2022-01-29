customElements.define(
  "gsh-filter",
  class extends HTMLElement {
    constructor() {
      super();
      this._value = [];
    }

    static get observedAttributes() {
      return ["filter"];
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

    get fromElement() {
      return document.querySelector(this.from);
    }

    get fromValue() {
      return this.fromElement.value;
    }

    get filter() {
      return this.getAttribute("filter") || "true";
    }

    get sortBy() {
      return this.getAttribute("sort-by");
    }

    get sortOrder() {
      return this.getAttribute("sort-order") || "asc";
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
      this._value = undefined;
      this._removeDataListeners();
    }

    _addDataListeners = () => {
      this.fromElement.addEventListener("change", this._changeListener, true);
    };

    _removeDataListeners = () => {
      this.fromElement.removeEventListener("change", this._changeListener);
    };

    _changeListener = () => {
      this.value = this._filter(
        this.fromValue,
        this.filter,
        this.sortBy,
        this.sortOrder
      );
      this._dispatchChangeEvent();
    };

    _filter = (values, filter, sortBy, sortOrder) => {
      if (sortBy) {
        values = values.sort((a, b) => {
          let valueA = a[sortBy];
          let valueB = b[sortBy];
          if (
            String(valueA).startsWith("Date") &&
            String(valueB).startsWith("Date")
          ) {
            valueA = new Function(`return new ${valueA};`)().getTime();
            valueB = new Function(`return new ${valueB};`)().getTime();
          }
          if (sortOrder === "asc") {
            return valueA - valueB;
          }
          return valueB - valueA;
        });
      }
      if (filter) {
        const filterFunction = (item) => {
          return new Function("item", `return ${filter};`)(item);
        };
        values = values.filter(filterFunction);
      }
      return values;
    };

    _dispatchChangeEvent = () => {
      this.dispatchEvent(new CustomEvent("change"));
    };
  }
);
