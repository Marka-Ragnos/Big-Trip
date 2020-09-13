import AbstractComponent from "./abstract-component";

const createButtonTemplate = () => (
  `<button
    class="trip-main__event-add-btn btn btn--big btn--yellow"
    type="button">
    New event
  </button>`
);

export default class Button extends AbstractComponent {
  getTemplate() {
    return createButtonTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

  enable() {
    this.getElement().disabled = false;
  }

  disable() {
    this.getElement().disabled = true;
  }
}
