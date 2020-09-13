import AbstractComponent from "./abstract-component";

const createControlsTemplate = () => `<div class="trip-main__trip-controls trip-controls"></div>`;

export default class Controls extends AbstractComponent {
  getTemplate() {
    return createControlsTemplate();
  }
}
