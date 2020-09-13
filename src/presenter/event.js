import {EventViewMode} from "../const";

import {render, replace, remove} from "../utils/dom";
import {checkEscKey} from "../utils/keyboard";

import EventComponent from "../view/event";
import EditorComponent from "../view/editor";

export default class EventPresenter {
  constructor(container, event, destinations, typesToOffers, dataChangeHandler, viewChangeHandler) {
    this._container = container;
    this._event = event;
    this._destinations = destinations;
    this._typesToOffers = typesToOffers;

    this._eventComponent = null;
    this._editorComponent = null;

    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;
    this._viewMode = EventViewMode.DEFAULT;

    this._editButtonClickHandler = this._editButtonClickHandler.bind(this);
    this._editorKeydownHandler = this._editorKeydownHandler.bind(this);
    this._editorSubmitHandler = this._editorSubmitHandler.bind(this);
    this._deleteButtonClickHandler = this._deleteButtonClickHandler.bind(this);
    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
  }

  render(viewMode = EventViewMode.DEFAULT) {
    this._viewMode = viewMode;

    switch (this._viewMode) {
      case EventViewMode.DEFAULT:
        this._renderEvent();
        break;
      case EventViewMode.CREATOR:
        this._renderCreator();
        break;
    }

    this._setHandlers();
  }

  remove() {
    if (this._eventComponent) {
      remove(this._eventComponent);
      this._eventComponent = null;
    }

    if (this._editorComponent) {
      remove(this._editorComponent);
      this._editorComponent = null;
    }

    document.removeEventListener(`keydown`, this._editorKeydownHandler);
  }

  setDefaultView() {
    if (this._viewMode !== EventViewMode.DEFAULT) {
      this._replaceEditorWithEvent();
    }
  }

  showError() {
    this._editorComponent.enable();
    this._editorComponent.hideSavingProcess();
    this._editorComponent.hideDeletingProcess();
    this._editorComponent.showError();
  }

  _renderEvent() {
    this._eventComponent = new EventComponent(this._event);
    this._editorComponent = new EditorComponent(this._event, this._destinations, this._typesToOffers);

    this._container.renderEvent(this._eventComponent);
  }

  _renderCreator() {
    this._editorComponent = new EditorComponent(
        this._event, this._destinations, this._typesToOffers, EventViewMode.CREATOR
    );

    render(this._container, this._editorComponent);
  }

  _setHandlers() {
    this._editorComponent.setSubmitHandler(this._editorSubmitHandler);
    this._editorComponent.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._editorComponent.setCloseButtonClickHandler(this._closeButtonClickHandler);

    if (this._viewMode === EventViewMode.CREATOR) {
      document.addEventListener(`keydown`, this._editorKeydownHandler);
    } else {
      this._eventComponent.setEditButtonClickHandler(this._editButtonClickHandler);
    }
  }

  _replaceEventWithEditor() {
    this._viewChangeHandler();
    this._viewMode = EventViewMode.EDITOR;
    replace(this._eventComponent, this._editorComponent);
    document.addEventListener(`keydown`, this._editorKeydownHandler);
  }

  _replaceEditorWithEvent() {
    this._editorComponent.reset();
    this._viewMode = EventViewMode.DEFAULT;
    replace(this._editorComponent, this._eventComponent);
    document.removeEventListener(`keydown`, this._editorKeydownHandler);
  }

  _editButtonClickHandler() {
    this._replaceEventWithEditor();
  }

  _editorKeydownHandler(evt) {
    if (checkEscKey(evt.key)) {
      evt.preventDefault();

      if (this._viewMode === EventViewMode.CREATOR) {
        this._dataChangeHandler(this, null, null);
      } else {
        this._replaceEditorWithEvent();
      }
    }
  }

  _editorSubmitHandler(evt) {
    evt.preventDefault();

    this._editorComponent.disable();
    this._editorComponent.hideError();
    this._editorComponent.showSavingProcess();

    if (this._viewMode === EventViewMode.CREATOR) {
      this._dataChangeHandler(this, null, this._editorComponent.getData());
    } else {
      this._dataChangeHandler(this, this._event, this._editorComponent.getData());
    }
  }

  _deleteButtonClickHandler() {
    this._editorComponent.disable();
    this._editorComponent.hideError();
    this._editorComponent.showDeletingProcess();

    if (this._viewMode === EventViewMode.CREATOR) {
      this._dataChangeHandler(this, null, null);
    } else {
      this._dataChangeHandler(this, this._event, null);
    }
  }

  _closeButtonClickHandler() {
    this._replaceEditorWithEvent();
  }
}
