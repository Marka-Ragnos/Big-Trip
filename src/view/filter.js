import {FilterType, DEFAULT_FILTER_TYPE} from "../const";

import AbstractComponent from "./abstract-component";

const createFilterMarkup = (filter, isChecked) => (
  `<div class="trip-filters__filter">
    <input
      class="trip-filters__filter-input visually-hidden"
      id="filter-${filter}"
      type="radio"
      name="trip-filter"
      value="${filter}"
      ${isChecked ? `checked` : ``}>
    <label
      class="trip-filters__filter-label"
      for="filter-${filter}">
      ${filter}
    </label>
  </div>`
);

const createFilterTemplate = (checkedFilter) => (
  `<form class="trip-filters" action="#" method="get">
    <h2 class="visually-hidden">Filter events</h2>
    ${Object.values(FilterType).map((filter) => createFilterMarkup(filter, filter === checkedFilter)).join(``)}
  </form>`
);

export default class Filter extends AbstractComponent {
  constructor() {
    super();
    this._type = DEFAULT_FILTER_TYPE;
    this._typeChangeHandler = null;
  }

  getTemplate() {
    return createFilterTemplate(this._type);
  }

  getElement() {
    if (!this._element) {
      this._element = super.getElement();

      this._element.addEventListener(`change`, (evt) => {
        this._type = evt.target.value;

        if (this._typeChangeHandler) {
          this._typeChangeHandler(this._type);
        }
      });
    }

    return this._element;
  }

  setDefaultType() {
    this._type = DEFAULT_FILTER_TYPE;
    this.getElement().querySelector(`[value="${this._type}"]`).checked = true;
  }

  enableType(type) {
    this.getElement().querySelector(`[value="${type}"]`).disabled = false;
  }

  disableType(type) {
    this.getElement().querySelector(`[value="${type}"]`).disabled = true;
  }

  setTypeChangeHandler(handler) {
    this._typeChangeHandler = handler;
  }
}
