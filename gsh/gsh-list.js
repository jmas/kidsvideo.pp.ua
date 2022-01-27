customElements.define(
  "gsh-list",
  class extends HTMLElement {
    constructor() {
      super();
    }

    static get observedAttributes() {
      return ["item-template"];
    }

    get renderInto() {
      return this.getAttribute("render-into");
    }

    get itemTemplate() {
      return this.getAttribute("item-template");
    }

    get fromDataElement() {
      return document.querySelector(this.getAttribute("from-data"));
    }

    get renderIntoElement() {
      return this.renderInto ? document.querySelector(this.renderInto) : this;
    }

    get newItemTemplateElement() {
      const template = document.querySelector(this.itemTemplate);
      return document.importNode(template.content, true);
    }

    get fromDataValues() {
      return this.fromDataElement.value || [];
    }

    connectedCallback() {
      this._render(this.renderIntoElement, this.fromDataValues);
      this._attachFromDataListener();
    }

    disconnectedCallback() {
      this._detachFromDataListener();
    }

    _attachFromDataListener = () => {
      this.fromDataElement.addEventListener(
        "change",
        this._fromDataLoadListener,
        true
      );
      this.fromDataElement.addEventListener(
        "error",
        this._fromDataErrorListener,
        true
      );
    };

    _detachFromDataListener() {
      this.fromDataElement.removeEventListener(
        "change",
        this._fromDataLoadListener
      );
      this.fromDataElement.removeEventListener(
        "error",
        this._fromDataErrorListener
      );
    }

    _fromDataLoadListener = () => {
      this._render(this.renderIntoElement, this.fromDataValues);
    };

    _fromDataErrorListener = (event) => {
      console.error(event.detail.error);
    };

    _render = (element, values) => {
      for (let i = 0; i < element.children.length; i++) {
        element.removeChild(element.children[i]);
      }
      for (let i = 0; i < values.length; i++) {
        element.appendChild(
          this._renderElementValues(this.newItemTemplateElement, values[i])
        );
      }
    };

    _renderElementValues(element, values) {
      Array.from(element.querySelectorAll("*"))
        .filter((element) =>
          Array.from(element.attributes).some((attribute) =>
            attribute.name.startsWith("insert")
          )
        )
        .forEach((element) => {
          const attributes = Array.from(element.attributes);
          for (let i = 0; i < attributes.length; i++) {
            const attribute = attributes[i].name;
            if (attribute.startsWith("insert")) {
              const insertIntoAttr = attribute.substring(7);
              if (insertIntoAttr === "") {
                element.textContent = this._interpolateString(
                  element.getAttribute(attribute),
                  values
                );
              } else {
                element.setAttribute(
                  insertIntoAttr,
                  this._interpolateString(
                    element.getAttribute(attribute),
                    values
                  )
                );
              }
              element.removeAttribute(attribute);
            }
          }
        });
      return element;
    }

    _findAllDataInsertNodes = (element) => {
      const evaluator = new XPathEvaluator();
      const iterator = evaluator.evaluate(
        '(self::node()|*)[@*[starts-with(name(), "data-insert")]]',
        element,
        null,
        XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
        null
      );
      const foundNodes = [];
      try {
        let currentNode = iterator.iterateNext();
        while (currentNode) {
          foundNodes.push(currentNode);
          currentNode = iterator.iterateNext();
        }
      } catch (error) {
        console.error(
          "Error: Document tree modified during iteration " + error
        );
      }
      return foundNodes;
    };

    _interpolateString = (str, values) => {
      const _names = Object.keys(values);
      const _values = Object.values(values);
      return new Function(..._names, `return \`${str}\`;`)(..._values);
    };
  }
);
