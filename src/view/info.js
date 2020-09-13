import {formatDateRange} from "../utils/date";
import {formatRoute} from "../utils/text";

import AbstractSmartComponent from "./abstract-smart-component";

const createRouteMarkup = (route) => `<h1 class="trip-info__title">${formatRoute(route)}</h1>`;

const createDatesMarkup = (beginDate, endDate) => `<p class="trip-info__dates">${formatDateRange(beginDate, endDate)}</p>`;

const createInfoTemplate = (info) => {
  const {route, beginDate, endDate, price = 0} = info;

  return (
    `<section class="trip-main__trip-info trip-info">
      <div class="trip-info__main">
        ${route ? createRouteMarkup(route) : ``}
        ${beginDate && endDate ? createDatesMarkup(beginDate, endDate) : ``}
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
      </p>
    </section>`
  );
};

export default class Info extends AbstractSmartComponent {
  constructor(info = {}) {
    super();
    this._info = info;
  }

  getTemplate() {
    return createInfoTemplate(this._info);
  }

  showInfo(info = {}) {
    this._info = info;
    this.rerender();
  }

  _recoveryHandlers() {}
}
