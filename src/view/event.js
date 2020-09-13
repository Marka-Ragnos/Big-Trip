import {EVENT_MAX_RENDERED_OFFER_AMOUNT} from "../const";

import {formatTime, formatDuration} from "../utils/date";
import {upperCaseFirstLetter, getPreposition} from "../utils/text";

import AbstractComponent from "./abstract-component";

const createTypeMarkup = (type) => (
  `<div class="event__type">
    <img
      class="event__type-icon"
      width="42" height="42"
      src="img/icons/${type}.png"
      alt="Event type icon">
  </div>`
);

const createTitleMarkup = (type, destination) => (
  `<h3 class="event__title">${upperCaseFirstLetter(type)} ${getPreposition(type)} ${destination.name}</h3>`
);

const createScheduleMarkup = (beginDate, endDate) => (
  `<div class="event__schedule">
    <p class="event__time">
      <time
        class="event__start-time"
        datetime="${beginDate.toISOString()}">
        ${formatTime(beginDate)}
      </time>
      &mdash;
      <time
        class="event__end-time"
        datetime="${endDate.toISOString()}">
        ${formatTime(endDate)}
      </time>
    </p>
    <p class="event__duration">${formatDuration(beginDate, endDate)}</p>
  </div>`
);

const createOfferMarkup = (offer) => (
  `<li class="event__offer">
    <span class="event__offer-title">${offer.name}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
  </li>`
);

const createOffersMarkup = (offers) => {
  if (!offers.length) {
    return ``;
  }

  return (
    `<h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offers.slice(0, EVENT_MAX_RENDERED_OFFER_AMOUNT).map(createOfferMarkup).join(``)}
    </ul>`
  );
};

const createEventTemplate = (event) => {
  const {type, destination, beginDate, endDate, price, offers} = event;

  return (
    `<div class="event">
      ${createTypeMarkup(type)}
      ${createTitleMarkup(type, destination)}
      ${createScheduleMarkup(beginDate, endDate)}
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      ${createOffersMarkup(offers)}
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`
  );
};

export default class Event extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}
