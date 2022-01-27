customElements.define(
  "yt-video",
  class extends HTMLElement {
    constructor() {
      super();
    }

    static get observedAttributes() {
      return ["video-id"];
    }

    get videoId() {
      return this.getAttribute("video-id");
    }

    get title() {
      return this.getAttribute("title");
    }

    connectedCallback() {
      if (this.videoId) {
        this._fetchAndRender(this.videoId);
      }
    }

    _fetchAndRender = (videoId) => {
      const override = (() => {
        const override = {};
        if (this.title) {
          override.title = this.title;
        }
        return override;
      })();
      this._fetch(videoId).then((data) =>
        this._render(videoId, {
          ...data,
          ...override,
        })
      );
    };

    _fetch = (videoId) => {
      return fetch(
        `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${videoId}`
      ).then((response) => response.json());
    };

    _render = (videoId, { title, thumbnail_url }) => {
      this.innerHTML = `
        <a
          href="https://www.youtube.com/watch?v=${videoId}"
          target="_blank"
        >
          <img
            src="${thumbnail_url}"
            alt="${title}"
          />
          <span>${title}</span>
        </a>
      `;
    };
  }
);
