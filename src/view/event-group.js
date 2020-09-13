import {createElementFromTemplate, render} from "../utils/dom";
import {formatDate, formatISODate} from "../utils/date";

import AbstractComponent from "./abstract-component";

const createNumberMarkup = (number) => `<span class="day__counter">${number}</span>`;

const createDateMarkup = (date) => (
  `<time
    class="day__date"
    datetime="${formatISODate(date)}">
    ${formatDate(date)}
  </time>`
);

const createEventGroupTemplate = (eventGroup) => {
  const {number, date} = eventGroup;

  return (
    `<li class="trip-days__item day">
      <div class="day__info">
        ${number ? createNumberMarkup(number) : ``}
        ${date ? createDateMarkup(date) : ``}
      </div>
      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class EventGroup extends AbstractComponent {
  constructor(eventGroup = {}) {
    super();
    this._eventGroup = eventGroup;
  }

  getTemplate() {
    return createEventGroupTemplate(this._eventGroup);
  }

  renderEvent(eventComponent) {
    const eventListElement = this.getElement().querySelector(`.trip-events__list`);
    const listItemElement = createElementFromTemplate(`<li class="trip-events__item"></li>`);

    render(listItemElement, eventComponent);
    render(eventListElement, listItemElement);
  }
}
