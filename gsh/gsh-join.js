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
      this.leftElement.addEventListener("change", this._changeListener, true);
      this.rightElement.addEventListener("change", this._changeListener, true);
    };

    _removeDataListeners = () => {
      this.leftElement.removeEventListener("change", this._changeListener);
      this.rightElement.removeEventListener("change", this._changeListener);
    };

    _changeListener = () => {
      const left = this.leftValue;
      const right = this.rightValue;
      const whenCondition = new Function(
        "left",
        "right",
        `return ${this.when};`
      );
      if (whenCondition(left, right)) {
        this._join(this.leftValue, this.rightValue, this.by).then((values) => {
          this.value = values;
          this._dispatchChangeEvent();
        });
      }
    };

    _join = (left, right, by) => {
      const fnArgs = [left, right, by];
      function fn(left, right, by) {
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
