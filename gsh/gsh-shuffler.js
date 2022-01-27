customElements.define(
  "gsh-shuffler",
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

    get groupBy() {
      const groupBy = this.getAttribute("group-by") || "";
      return groupBy.split(" ").filter(Boolean);
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
      this._render(this._shuffle(this.fromValue, this.groupBy));
      this._dispatchChangeEvent();
    };

    _shuffle = (values, groupBy) => {
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
      return shuffled.filter(Boolean);
    };

    _render = (value) => {
      this.textContent = JSON.stringify(value);
    };

    _dispatchChangeEvent = () => {
      this.dispatchEvent(new CustomEvent("change"));
    };
  }
);
