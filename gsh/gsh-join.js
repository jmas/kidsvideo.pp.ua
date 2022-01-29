customElements.define(
  "gsh-join",
  class extends HTMLElement {
    constructor() {
      super();
      this._value = [];
    }

    get value() {
      return this._value;
    }

    set value(value) {
      this._value = value;
    }

    get fromLeft() {
      return this.getAttribute("from-left");
    }

    get fromRight() {
      return this.getAttribute("from-right");
    }

    get by() {
      return this.getAttribute("by") || "false";
    }

    get when() {
      return this.getAttribute("when") || "true";
    }

    get leftElement() {
      return document.querySelector(this.fromLeft);
    }

    get rightElement() {
      return document.querySelector(this.fromRight);
    }

    get leftValue() {
      return this.leftElement.value || [];
    }

    get rightValue() {
      return this.rightElement.value || [];
    }

    connectedCallback() {
      if (!this.leftElement) {
        console.warn(
          `Attribute "from-left" contains invalid selector. Can't find element.`
        );
        return;
      }
      if (!this.rightElement) {
        console.warn(
          `Attribute "from-right" contains invalid selector. Can't find element.`
        );
        return;
      }
      this._addDataListeners();
    }

    disconnectedCallback() {
      this._removeDataListeners();
    }

    _addDataListeners = () => {
      this.leftElement.addEventListener(
        "change",
        this._dataChangeListener,
        true
      );
      this.rightElement.addEventListener(
        "change",
        this._dataChangeListener,
        true
      );
    };

    _removeDataListeners = () => {
      this.leftElement.removeEventListener("change", this._dataChangeListener);
      this.rightElement.removeEventListener("change", this._dataChangeListener);
    };

    _dataChangeListener = () => {
      const left = this.leftValue;
      const right = this.rightValue;
      const whenCondition = new Function(
        "left",
        "right",
        `return ${this.when};`
      );
      if (whenCondition(left, right)) {
        this.value = this._join(this.leftValue, this.rightValue, this.by);
        this._dispatchChangeEvent();
      }
    };

    _join = (left, right, by) => {
      const byEqualFunction = (leftItem, rightItem) => {
        return new Function("left", "right", `return ${by};`)(
          leftItem,
          rightItem
        );
      };

      return left.map((leftItem) => {
        return {
          ...leftItem,
          ...right.find((rightItem) => byEqualFunction(leftItem, rightItem)),
        };
      });
    };

    _dispatchChangeEvent = () => {
      this.dispatchEvent(new CustomEvent("change"));
    };
  }
);
