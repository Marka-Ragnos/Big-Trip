import {MenuItem, DEFAULT_MENU_ITEM} from "../const";

import {upperCaseFirstLetter} from "../utils/text";

import AbstractComponent from "./abstract-component";

const createItemMarkup = (item, isChecked) => (
  `<a
    class="trip-tabs__btn ${isChecked ? `trip-tabs__btn--active` : ``}"
    href="#"
    data-menu-item="${item}">
    ${upperCaseFirstLetter(item)}
  </a>`
);

const createMenuTemplate = (checkedItem) => (
  `<nav class="trip-controls__trip-tabs trip-tabs">
    <h2 class="visually-hidden">Switch trip view</h2>
    ${Object.values(MenuItem).map((item) => createItemMarkup(item, item === checkedItem)).join(``)}
  </nav>`
);

export default class Menu extends AbstractComponent {
  constructor() {
    super();
    this._item = DEFAULT_MENU_ITEM;
    this._itemChangeHandler = null;
  }

  getTemplate() {
    return createMenuTemplate(this._item);
  }

  getElement() {
    if (!this._element) {
      this._element = super.getElement();

      this._element.addEventListener(`click`, (evt) => {
        const target = evt.target;

        if (!target.classList.contains(`trip-tabs__btn`) || target.classList.contains(`trip-tabs__btn--active`)) {
          return;
        }

        this._item = target.dataset.menuItem;

        this._element.querySelector(`.trip-tabs__btn--active`).classList.remove(`trip-tabs__btn--active`);
        target.classList.add(`trip-tabs__btn--active`);

        if (this._itemChangeHandler) {
          this._itemChangeHandler(this._item);
        }
      });
    }

    return this._element;
  }

  setDefaultItem() {
    this._item = DEFAULT_MENU_ITEM;
    this.getElement().querySelector(`.trip-tabs__btn--active`).classList.remove(`trip-tabs__btn--active`);
    this.getElement().querySelector(`[data-menu-item="${this._item}"]`).classList.add(`trip-tabs__btn--active`);
  }

  setItemChangeHandler(handler) {
    this._itemChangeHandler = handler;
  }
}
