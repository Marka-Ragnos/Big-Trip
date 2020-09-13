import {replace} from "../utils/dom";

import AbstractComponent from "./abstract-component";

export default class AbstractSmartComponent extends AbstractComponent {
  rerender() {
    const oldElement = this.getElement();
    this.removeElement();
    const newElement = this.getElement();
    this._restoreHandlers();
    replace(oldElement, newElement);
  }

  _restoreHandlers() {
  }
}
