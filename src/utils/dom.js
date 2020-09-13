import DOMPurify from 'dompurify';
import {RenderPosition} from "../const";

import AbstractComponent from "../view/abstract-component";

export const createElementFromTemplate = (template) => {
  const element = document.createElement(`div`);
  element.innerHTML = DOMPurify.sanitize(template);

  return element.firstChild;
};

export const render = (parent, child, position = RenderPosition.BEFOREEND) => {
  const parentElement = parent instanceof AbstractComponent ? parent.getElement() : parent;
  const childElement = child instanceof AbstractComponent ? child.getElement() : child;

  switch (position) {
    case RenderPosition.AFTERBEGIN:
      parentElement.prepend(childElement);
      break;
    case RenderPosition.BEFOREEND:
      parentElement.append(childElement);
      break;
  }
};

export const replace = (replaced, replacer) => {
  const oldElement = replaced instanceof AbstractComponent ? replaced.getElement() : replaced;
  const newElement = replacer instanceof AbstractComponent ? replacer.getElement() : replacer;

  oldElement.replaceWith(newElement);
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};
