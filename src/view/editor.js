import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/material_blue.css";

import {EventGroup, eventGroupsToEventTypes, EventViewMode} from "../const";

import {getMaxDate} from "../utils/date";
import {upperCaseFirstLetter, getPreposition, replaceChars, checkIfNonNegativeNumericString} from "../utils/text";

import AbstractSmartComponent from "./abstract-smart-component";

const createTypeItemMarkup = (type, isChecked) => (
  `<div class="event__type-item">
    <input
      class="event__type-input visually-hidden"
      id="event-type-${type}"
      type="radio"
      name="event-type"
      value="${type}"
      ${isChecked ? `checked` : ``}>
    <label
      class="event__type-label event__type-label--${type}"
      for="event-type-${type}">
      ${upperCaseFirstLetter(type)}
    </label>
  </div>`
);

const createTypeGroupMarkup = (group, checkedType) => (
  `<fieldset class="event__type-group">
    <legend class="visually-hidden">${upperCaseFirstLetter(group)}</legend>
    ${eventGroupsToEventTypes[group].map((type) => createTypeItemMarkup(type, type === checkedType)).join(``)}
  </fieldset>`
);

const createTypeListMarkup = (checkedType) => (
  `<div class="event__type-list">
    ${Object.values(EventGroup).map((group) => createTypeGroupMarkup(group, checkedType)).join(``)}
  </div>`
);

const createTypeMarkup = (checkedType) => (
  `<div class="event__type-wrapper">
    <label
      class="event__type event__type-btn"
      for="event-type-toggle">
      <span class="visually-hidden">Choose event type</span>
      <img
        class="event__type-icon"
        width="17" height="17"
        src="img/icons/${checkedType}.png"
        alt="Event type icon">
    </label>
    <input
      class="event__type-toggle visually-hidden"
      id="event-type-toggle"
      type="checkbox">
    ${createTypeListMarkup(checkedType)}
  </div>`
);

const createDestinationListMarkup = (availableDestinations) => (
  `<datalist id="destination-list">
    ${availableDestinations.map((destination) => `<option value="${destination.name}"></option>`).join(``)}
  </datalist>`
);

const createDestinationMarkup = (availableDestinations, destinationName, type) => (
  `<div class="event__field-group event__field-group--destination">
    <label
      class="event__label event__type-output"
      for="event-destination">
      ${upperCaseFirstLetter(type)} ${getPreposition(type)}
    </label>
    <input
      class="event__input event__input--destination"
      id="event-destination"
      type="text"
      name="event-destination"
      value="${destinationName}"
      list="destination-list">
    ${createDestinationListMarkup(availableDestinations)}
  </div>`
);

const createDatesMarkup = () => (
  `<div class="event__field-group event__field-group--time">
    <label
      class="visually-hidden"
      for="event-start-time">
      From
    </label>
    <input
      class="event__input event__input--time"
      id="event-start-time"
      type="text"
      name="event-start-time">
    &mdash;
    <label
      class="visually-hidden"
      for="event-end-time">
      To
    </label>
    <input
      class="event__input event__input--time"
      id="event-end-time"
      type="text"
      name="event-end-time">
  </div>`
);

const createPriceMarkup = (price) => (
  `<div class="event__field-group event__field-group--price">
    <label
      class="event__label"
      for="event-price">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>
    <input
      class="event__input event__input--price"
      id="event-price"
      type="number"
      name="event-price"
      value="${price}"
      min="0">
  </div>`
);

const createFavoriteButtonMarkup = (isChecked) => (
  `<input
    class="event__favorite-checkbox visually-hidden"
    id="event-favorite"
    type="checkbox"
    name="event-favorite"
    ${isChecked ? `checked` : ``}>
  <label
    class="event__favorite-btn"
    for="event-favorite">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>
  </label>`
);

const createCloseButtonMarkup = () => (
  `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`
);

const createOfferMarkup = (offer, isChecked) => {
  const {name, price} = offer;
  const dashedName = replaceChars(name, ` `, `-`);

  return (
    `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${dashedName}"
        type="checkbox"
        name="event-offer-${dashedName}"
        value="${name}"
        ${isChecked ? `checked` : ``}>
      <label
        class="event__offer-label"
        for="event-offer-${dashedName}">
        <span class="event__offer-title">${name}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

const createOffersMarkup = (availableOffers, checkedOffers) => {
  if (!availableOffers.length) {
    return ``;
  }

  const offersMarkup = availableOffers.map((offer) => createOfferMarkup(
      offer, checkedOffers.some((checkedOffer) => checkedOffer.name === offer.name)
  )).join(``);

  return (
    `<section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersMarkup}
      </div>
    </section>`
  );
};

const createPhotosMarkup = (photos) => (
  `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${photos.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.alt}">`).join(``)}
    </div>
  </div>`
);

const createDestinationInfoMarkup = (destination) => {
  const {description, photos} = destination;

  if (!description && !photos.length) {
    return ``;
  }

  return (
    `<section class="event__section event__section--destination">
      <h3 class="event__section-title event__section-title--destination">Destination</h3>
      ${description ? `<p class="event__destination-description">${description}</p>` : ``}
      ${photos.length ? createPhotosMarkup(photos) : ``}
    </section>`
  );
};

const createDetailsMarkup = (destination, availableOffers, checkedOffers) => {
  const offersMarkup = createOffersMarkup(availableOffers, checkedOffers);
  const destinationInfoMarkup = createDestinationInfoMarkup(destination);

  if (!offersMarkup && !destinationInfoMarkup) {
    return ``;
  }

  return (
    `<section class="event__details">
      ${offersMarkup}
      ${destinationInfoMarkup}
    </section>`
  );
};

const createEditorTemplate = (event, parameters) => {
  const {type, destination, isFavorite, offers} = event;
  const {viewMode, destinationName, price, availableDestinations, availableOffers} = parameters;

  return (
    `<form
      class="${viewMode === EventViewMode.CREATOR ? `trip-events__item` : ``} event event--edit"
      action="#"
      method="post">
      <header class="event__header">
        ${createTypeMarkup(type)}
        ${createDestinationMarkup(availableDestinations, destinationName, type)}
        ${createDatesMarkup()}
        ${createPriceMarkup(price)}
        <button
          class="event__save-btn btn btn--blue"
          type="submit">
          Save
        </button>
        <button
          class="event__reset-btn"
          type="button">
          ${viewMode === EventViewMode.EDITOR ? `Delete` : `Cancel`}
        </button>
        ${viewMode === EventViewMode.EDITOR ? createFavoriteButtonMarkup(isFavorite) : ``}
        ${viewMode === EventViewMode.EDITOR ? createCloseButtonMarkup() : ``}
      </header>
      ${createDetailsMarkup(destination, availableOffers, offers)}
    </form>`
  );
};

export default class Editor extends AbstractSmartComponent {
  constructor(event, availableDestinations, typesToOffers, viewMode = EventViewMode.EDITOR) {
    super();

    this._event = event;
    this._eventCopy = Object.assign({}, this._event);
    this._availableDestinations = availableDestinations;
    this._typesToOffers = typesToOffers;
    this._viewMode = viewMode;

    this._destinationName = this._eventCopy.destination.name;
    this._priceString = String(this._eventCopy.price);

    this._beginDatePicker = null;
    this._endDatePicker = null;

    this._submitHandler = null;
    this._deleteButtonClickHandler = null;
    this._closeButtonClickHandler = null;
    this._changeHandler = this._changeHandler.bind(this);
    this._beginDateChangeHandler = this._beginDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._recoveryHandlers();
    this._createDatePickers();
  }

  getTemplate() {
    return createEditorTemplate(this._eventCopy, {
      viewMode: this._viewMode,
      destinationName: this._destinationName,
      price: this._priceString,
      availableDestinations: this._availableDestinations,
      availableOffers: this._typesToOffers[this._eventCopy.type]
    });
  }

  removeElement() {
    if (this._beginDatePicker) {
      this._beginDatePicker.destroy();
      this._beginDatePicker = null;
      this._endDatePicker.destroy();
      this._endDatePicker = null;
    }

    super.removeElement();
  }

  rerender() {
    super.rerender();
    this._createDatePickers();
    this._recoveryHandlers();
  }

  setSubmitHandler(handler) {
    this._submitHandler = handler;
    this.getElement().addEventListener(`submit`, this._submitHandler);
  }

  setDeleteButtonClickHandler(handler) {
    this._deleteButtonClickHandler = handler;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._deleteButtonClickHandler);
  }

  setCloseButtonClickHandler(handler) {
    if (this._viewMode === EventViewMode.EDITOR) {
      this._closeButtonClickHandler = handler;
      this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._closeButtonClickHandler);
    }
  }

  reset() {
    this._eventCopy = Object.assign({}, this._event);
    this._destinationName = this._eventCopy.destination.name;
    this._priceString = String(this._eventCopy.price);
    this.rerender();
  }

  getData() {
    return Object.assign({}, this._eventCopy);
  }

  enable() {
    Array.from(this.getElement().elements).forEach((element) => {
      element.disabled = false;
    });
  }

  disable() {
    Array.from(this.getElement().elements).forEach((element) => {
      element.disabled = true;
    });
  }

  showSavingProcess() {
    this.getElement().querySelector(`.event__save-btn`).textContent = `Saving…`;
  }

  hideSavingProcess() {
    this.getElement().querySelector(`.event__save-btn`).textContent = `Save`;
  }

  showDeletingProcess() {
    if (this._viewMode === EventViewMode.EDITOR) {
      this.getElement().querySelector(`.event__reset-btn`).textContent = `Deleting…`;
    }
  }

  hideDeletingProcess() {
    if (this._viewMode === EventViewMode.EDITOR) {
      this.getElement().querySelector(`.event__reset-btn`).textContent = `Delete`;
    }
  }

  showError() {
    this.getElement().classList.add(`error`);
  }

  hideError() {
    this.getElement().classList.remove(`error`);
  }

  _changeType(type) {
    this._eventCopy.type = type;
    this._eventCopy.offers = [];
    this.rerender();
  }

  _changeDestination(destinationName) {
    this._destinationName = destinationName;
    const newDestination = this._availableDestinations.find((destination) => destination.name === this._destinationName);

    if (newDestination) {
      this._eventCopy.destination = newDestination;
      this.rerender();
    }
  }

  _changePrice(priceString) {
    this._priceString = priceString;
    this._eventCopy.price = checkIfNonNegativeNumericString(this._priceString) ?
      parseFloat(this._priceString) : this._eventCopy.price;
  }

  _changeFavoriteness() {
    this._eventCopy.isFavorite = !this._eventCopy.isFavorite;
  }

  _changeOffers() {
    const availableOffers = this._typesToOffers[this._eventCopy.type];
    const checkedOfferNames = Array.from(this.getElement().querySelectorAll(`.event__offer-checkbox:checked`))
      .map((offerCheckbox) => offerCheckbox.value);

    this._eventCopy.offers = availableOffers.filter((offer) => checkedOfferNames.includes(offer.name));
  }

  _checkIfSubmitButtonDisabled() {
    return this._availableDestinations.every((destination) => destination.name !== this._destinationName) ||
      !checkIfNonNegativeNumericString(this._priceString);
  }

  _changeHandler(evt) {
    const target = evt.target;
    const classList = target.classList;
    const value = target.value;

    if (classList.contains(`event__type-input`)) {
      this._changeType(value);
    } else if (classList.contains(`event__input--destination`)) {
      this._changeDestination(value);
    } else if (classList.contains(`event__input--price`)) {
      this._changePrice(value);
    } else if (classList.contains(`event__favorite-checkbox`)) {
      this._changeFavoriteness();
    } else if (classList.contains(`event__offer-checkbox`)) {
      this._changeOffers();
    }

    this.getElement().querySelector(`.event__save-btn`).disabled = this._checkIfSubmitButtonDisabled();
  }

  _recoveryHandlers() {
    if (this._submitHandler) {
      this.setSubmitHandler(this._submitHandler);
    }

    if (this._deleteButtonClickHandler) {
      this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    }

    if (this._closeButtonClickHandler) {
      this.setCloseButtonClickHandler(this._closeButtonClickHandler);
    }

    this.getElement().addEventListener(`change`, this._changeHandler);
  }

  _beginDateChangeHandler([beginDate]) {
    this._eventCopy.beginDate = beginDate;
    this._eventCopy.endDate = getMaxDate([this._eventCopy.beginDate, this._eventCopy.endDate]);
    this._createEndDatePicker();
  }

  _endDateChangeHandler([endDate]) {
    this._eventCopy.endDate = endDate;
  }

  _createDatePicker(parameters) {
    const {dateElement, minDate = null, defaultDate, onChange} = parameters;

    return flatpickr(dateElement, {
      enableTime: true,
      minDate,
      defaultDate,
      altInput: true,
      altFormat: `d/m/y H:i`,
      onChange
    });
  }

  _createBeginDatePicker() {
    if (this._beginDatePicker) {
      this._beginDatePicker.destroy();
    }

    this._beginDatePicker = this._createDatePicker({
      dateElement: this.getElement().querySelector(`#event-start-time`),
      defaultDate: this._eventCopy.beginDate,
      onChange: this._beginDateChangeHandler
    });
  }

  _createEndDatePicker() {
    if (this._endDatePicker) {
      this._endDatePicker.destroy();
    }

    this._endDatePicker = this._createDatePicker({
      dateElement: this.getElement().querySelector(`#event-end-time`),
      minDate: this._eventCopy.beginDate,
      defaultDate: this._eventCopy.endDate,
      onChange: this._endDateChangeHandler
    });
  }

  _createDatePickers() {
    this._createBeginDatePicker();
    this._createEndDatePicker();
  }
}
