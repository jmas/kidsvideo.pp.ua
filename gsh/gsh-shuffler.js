customElements.define(
  "gsh-shuffler",
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

    get from() {
      return this.getAttribute("from");
    }

    get fromElement() {
      return document.querySelector(this.from);
    }

    get fromValue() {
      return this.fromElement.value;
    }

    get groupBy() {
      const groupBy = this.getAttribute("group-by") || "";
      return groupBy.split(" ").filter(Boolean);
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
      this._shuffle(this.fromValue, this.groupBy).then((values) => {
        this.value = values;
        this._dispatchChangeEvent();
      });
    };

    _shuffle = (values, groupBy) => {
      const fnSource = `if (values.length === 0) {
        return [];
      }
      const shuffled = [];
      const grouped = groupBy
        .map((groupKey) => {
          return values.filter((value) => Boolean(value[groupKey]));
        })
        .filter((grouped) => grouped.length > 0);
      const groupedSorted = grouped.sort((a, b) => {
        return a.length - b.length;
      });
      const smallGroupsLength = Math.ceil(
        values.length / groupedSorted[0].length
      );
      for (let i = 0; i < smallGroupsLength; i++) {
        for (let j = 0; j < groupedSorted.length; j++) {
          for (
            let k = 0;
            k < Math.ceil(groupedSorted[j].length / smallGroupsLength);
            k++
          ) {
            shuffled.push(
              groupedSorted[j][
                i * Math.ceil(groupedSorted[j].length / smallGroupsLength) + k
              ]
            );
          }
        }
      }
      return shuffled.filter(Boolean);`;
      const fnArgs = ["values", "groupBy"];
      if ("Worker" in window) {
        return new Promise((resolve) => {
          const worker = new Worker("gsh/gsh-worker.js");
          worker.onmessage = (event) => {
            resolve(event.data);
            worker.terminate();
          };
          worker.postMessage([fnSource, fnArgs, [values, groupBy]]);
        });
      } else {
        const fn = new Function(...fnArgs, fnSource);
        return Promise.resolve(fn(values, groupBy));
      }
      // .filter(
      //   (value, index, self) =>
      //     index ===
      //     self.findIndex(
      //       (item) => item.place === value.place
      //     )
      // );
    };

    _dispatchChangeEvent = () => {
      this.dispatchEvent(new CustomEvent("change"));
    };
  }
);
