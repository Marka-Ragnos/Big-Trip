import AbstractComponent from "./abstract-component";

const createTripTemplate = () => `<div class="trip-events__container"></div>`;

export default class Trip extends AbstractComponent {
  getTemplate() {
    return createTripTemplate();
  }
}
