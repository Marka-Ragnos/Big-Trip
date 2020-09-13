import {MessageText} from "../const";

import AbstractComponent from "./abstract-component";

const createMessageTemplate = () => `<p class="trip-events__msg"></p>`;

export default class Message extends AbstractComponent {
  getTemplate() {
    return createMessageTemplate();
  }

  showLoadingMessage() {
    this.getElement().textContent = MessageText.LOADING;
  }

  showErrorMessage() {
    this.getElement().textContent = MessageText.ERROR;
  }

  showNoEventsMessage() {
    this.getElement().textContent = MessageText.NO_EVENTS;
  }
}
