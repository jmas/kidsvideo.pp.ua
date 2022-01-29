customElements.define(
  "gsh-data",
  class extends HTMLElement {
    constructor() {
      super();
      this._value = [];
    }

    static get observedAttributes() {
      return ["document-id", "sheet"];
    }

    get value() {
      return this._value;
    }

    set value(value) {
      this._value = value;
    }

    get reverse() {
      return this.getAttribute("reverse") !== null;
    }

    get types() {
      return Object.fromEntries(
        new URLSearchParams(this.getAttribute("types") || "")
      );
    }

    connectedCallback() {
      this._fetchAndRender(
        this.getAttribute("document-id"),
        this.getAttribute("sheet")
      );
    }

    disconnectedCallback() {
      this._value = undefined;
    }

    _fetchAndRender = (documentId, sheet) => {
      const sheets = sheet.split(" ");

      (sheets.length > 1
        ? Promise.all(
            sheets.map((sheet) => this._fetchSheetValues(documentId, sheet))
          )
        : this._fetchSheetValues(documentId, sheet)
      )
        .then((values) => {
          this.value = values;
          this._dispatchChangeEvent();
        })
        .catch((error) => {
          this._dispatchErrorEvent(error);
        });
    };

    _fetchSheetValues = (documentId, sheet) => {
      return fetch(
        `https://docs.google.com/spreadsheets/d/${documentId}/gviz/tq?tqx=out:json&sheet=${sheet}`
      )
        .then((response) => response.text())
        .then(
          (text) =>
            JSON.parse(
              String(text).match(
                /google\.visualization\.Query\.setResponse\((.+?)\);/m
              )[1]
            ).table
        )
        .then(this._formatSheetValues);
    };

    _formatSheetValues = ({ cols, rows }) => {
      const header = [];
      let firstRowIsHeader = false;
      for (let i = 0; i < cols.length; i++) {
        if (cols[i].label) {
          header.push(cols[i].label);
        } else {
          break;
        }
      }
      if (header.length === 0 && rows[0] && rows[0].c) {
        firstRowIsHeader = true;
        for (let i = 0; i < rows[0].c.length; i++) {
          if (rows[0].c[i] && rows[0].c[i].v) {
            header.push(rows[0].c[i].v);
          }
        }
      }
      const items = [];
      for (let i = 0; i < rows.length; i++) {
        if (firstRowIsHeader && i === 0) {
          continue;
        }
        const item = {};
        for (let j = 0; j < header.length; j++) {
          item[header[j]] = rows[i].c && rows[i].c[j] ? rows[i].c[j].v : "";
        }
        items.push(item);
      }
      return items;
    };

    _dispatchChangeEvent = () => {
      this.dispatchEvent(new CustomEvent("change"));
    };

    _dispatchErrorEvent = (error) => {
      this.dispatchEvent(
        new CustomEvent("error", {
          detail: {
            error,
          },
        })
      );
    };
  }
);
