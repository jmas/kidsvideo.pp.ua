customElements.define(
  "ui-panel",
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
        <style>
          .panel {
            display: none;
            position: relative;
            background-color: rgba(0, 0, 0, .015);
            box-shadow: 0 0 0 1px rgba(0, 0, 0, .025) inset;
            padding: 2rem;
            border-radius: 0.5rem;
          }

          .panel.panel-open {
            display: block;
          }

          .panel.panel-closable::before {
            display: block;
            content: "";
            width: 3rem;
            height: 3rem;
            float: right;
          }

          .panel ::slotted(*:first-child) {
            margin-top: 0;
          }

          .panel ::slotted(*:last-child) {
            margin-bottom: 0;
          }

          .close {
            display: none;
          }

          .panel.panel-closable .close {
            display: block;
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 2rem;
            height: 2rem;
            border: none;
            border-radius: 100%;
            font-size: 140%;
            line-height: 0;
            text-align: center;
            padding: 0;
            background-color: rgba(0, 0, 0, 0.05);
            box-shadow: 0 0 0 1px rgba(0, 0, 0, .005) inset;
            color: rgba(0, 0, 0, 0.5);
            cursor: pointer;
          }
        </style>
        <div id="panel" class="panel ${this.closable ? "panel-closable" : ""}">
          <slot></slot>
          <button class="close" id="close">
            <svg class="img-fluid" id="outputsvg" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 5120 5120"><g id="l1rSJ1NJjPFyoUz7cVSwv4h" fill="rgba(0, 0, 0, 0.5)"><g><path id="p1MlsAAAt" d="M233 5102 c-142 -51 -224 -166 -224 -314 0 -137 -68 -61 1063 -1193 560 -561 1018 -1025 1018 -1030 0 -6 -453 -462 -1006 -1015 -553 -553 -1016 -1024 -1030 -1047 -98 -164 -32 -379 141 -463 40 -19 66 -24 130 -25 154 0 58 -85 1208 1064 l1027 1026 1028 -1026 c1149 -1149 1053 -1064 1207 -1064 64 1 90 6 130 25 60 29 126 93 154 148 42 83 43 210 0 295 -14 29 -342 363 -1035 1057 -558 558 -1014 1020 -1014 1025 0 5 458 469 1018 1030 1131 1132 1063 1056 1063 1193 0 37 -7 86 -15 110 -64 180 -270 269 -443 191 -39 -18 -248 -222 -1070 -1043 l-1023 -1021 -1022 1021 c-834 832 -1032 1025 -1072 1043 -69 31 -167 37 -233 13z"></path></g></g></svg>
          </button>
        </div>
      `;
    }

    get closable() {
      return this.getAttribute("closable") !== null;
    }

    get open() {
      return this.getAttribute("open") !== null;
    }

    get openByLocalStorage() {
      return this.getAttribute("open-by-local-storage") !== null;
    }

    set open(isOpen) {
      this.shadowRoot
        .getElementById("panel")
        .classList.toggle("panel-open", isOpen);
      if (isOpen) {
        this.setAttribute("open", "");
      } else {
        this.removeAttribute("open");
      }
    }

    connectedCallback() {
      this.shadowRoot
        .getElementById("close")
        .addEventListener("click", this._closeListener, true);
      if (this.openByLocalStorage) {
        this.open = !localStorage[`panel_${this.id}_close`];
      } else {
        this.open = this.open;
      }
    }

    disconnectedCallback() {
      this.shadowRoot
        .getElementById("close")
        .removeEventListener("click", this._closeListener);
    }

    _closeListener = () => {
      this.open = false;
      localStorage[`panel_${this.id}_close`] = "1";
    };
  }
);
