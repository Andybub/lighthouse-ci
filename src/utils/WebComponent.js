import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

export const toCamel = (str) =>
  str.replace(/([-_][a-z])/gi, (char) => char.toUpperCase().replace('-', '').replace('_', ''));

export const htmlAttributeToProps = (el) => {
  const attrToProps = {};
  el.getAttributeNames().forEach((name) => {
    const camelName = toCamel(name);
    attrToProps[camelName] = el.getAttribute(name);
  });
  delete attrToProps.cloak;
  return attrToProps;
};

export const defineWebComponent = (tagName, Component) => {
  class TWComponent extends HTMLElement {
    constructor() {
      super();
      this.root = ReactDOM.createRoot(this);
    }

    connectedCallback() {
      const attrToProps = htmlAttributeToProps(this);

      let innerHTMLToProps = {};
      try {
        innerHTMLToProps = JSON.parse(this.innerText);
      } catch (error) {
        // console.log(error);
      }

      this.root.render(
        <Suspense>
          <Component {...attrToProps} {...innerHTMLToProps} />
        </Suspense>,
      );

      setTimeout(() => {
        this.removeAttribute('cloak');
      }, 0);
    }
  }

  window.customElements.define(tagName, TWComponent);
};
