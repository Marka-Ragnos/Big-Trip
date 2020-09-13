import {RenderPosition, DEFAULT_SORT_TYPE, DEFAULT_EVENT_TYPE, EventViewMode} from "../const";

import {render, remove} from "../utils/dom";

import MessageComponent from "../view/message";
import SortComponent from "../view/sort";
import EventListComponent from "../view/event-list";
import EventGroupComponent from "../view/event-group";

import EventPresenter from "./event";

export default class TripPresenter {
  constructor(container, eventsModel, api, eventCreatorCloseHandler) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._api = api;

    this._destinations = null;
    this._typesToOffers = null;

    this._eventCreator = null;
    this._eventPresenters = [];

    this._messageComponent = new MessageComponent();
    this._sortComponent = new SortComponent();
    this._eventListComponent = new EventListComponent();

    this._eventCreatorCloseHandler = eventCreatorCloseHandler;
    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._createEventPresenters = this._createEventPresenters.bind(this);

    this._eventsModel.setFilterTypeChangeHandler(this._filterTypeChangeHandler);
    this._sortComponent.setTypeChangeHandler(this._sortTypeChangeHandler);
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  setTypesToOffers(typesToOffers) {
    this._typesToOffers = typesToOffers;
  }

  render() {
    this._clear();

    const events = this._eventsModel.getEvents();

    if (!events.length) {
      this._messageComponent.showNoEventsMessage();
      render(this._container, this._messageComponent);
    }

    render(this._container, this._sortComponent, RenderPosition.AFTERBEGIN);
    render(this._container, this._eventListComponent);
    events.forEach(this._createEventPresenters);
  }

  renderLoadingMessage() {
    this._clear();
    this._messageComponent.showLoadingMessage();
    render(this._container, this._messageComponent);
  }

  renderErrorMessage() {
    this._clear();
    this._messageComponent.showErrorMessage();
    render(this._container, this._messageComponent);
  }

  createEvent() {
    if (this._eventCreator) {
      return;
    }

    this._eventCreator = new EventPresenter(
        this._container,
        this._getDefaultEvent(),
        this._destinations,
        this._typesToOffers,
        this._dataChangeHandler,
        this._viewChangeHandler
    );

    this._eventCreator.render(EventViewMode.CREATOR);
    this.render();
  }

  show() {
    this._container.show();
  }

  hide() {
    this._container.hide();
    this._eventPresenters.forEach((eventPresenter) => eventPresenter.setDefaultView());
    this._closeEventCreator();
  }

  _clear() {
    remove(this._messageComponent);
    remove(this._sortComponent);
    remove(this._eventListComponent);

    this._eventPresenters.forEach((eventPresenter) => eventPresenter.remove());
    this._eventPresenters = [];
  }

  _createEventPresenters(eventGroup) {
    const eventGroupComponent = new EventGroupComponent(eventGroup);

    this._eventPresenters = this._eventPresenters.concat(eventGroup.events.map((event) => {
      const eventPresenter = new EventPresenter(
          eventGroupComponent,
          event,
          this._destinations,
          this._typesToOffers,
          this._dataChangeHandler,
          this._viewChangeHandler
      );

      eventPresenter.render();
      return eventPresenter;
    }));

    render(this._eventListComponent, eventGroupComponent);
  }

  _getDefaultEvent() {
    const date = new Date();

    return {
      type: DEFAULT_EVENT_TYPE,
      destination: this._destinations[0],
      beginDate: date,
      endDate: date,
      price: 0,
      isFavorite: false,
      offers: []
    };
  }

  _closeEventCreator() {
    if (this._eventCreator) {
      this._eventCreator.remove();
      this._eventCreator = null;
      this._eventCreatorCloseHandler();
    }
  }

  _dataChangeHandler(eventPresenter, oldEvent, newEvent) {
    if (oldEvent && newEvent) {
      this._api.updateEvent(oldEvent.id, newEvent)
        .then((eventFromServer) => {
          this._eventsModel.updateEvent(oldEvent.id, eventFromServer);
          this.render();
        }).catch(() => eventPresenter.showError());

      return;
    }

    if (oldEvent) {
      this._api.deleteEvent(oldEvent.id)
        .then(() => {
          this._eventsModel.deleteEvent(oldEvent.id);
          this.render();
        }).catch(() => eventPresenter.showError());

      return;
    }

    if (newEvent) {
      this._api.createEvent(newEvent)
        .then((eventFromServer) => {
          this._eventsModel.createEvent(eventFromServer);
          this._closeEventCreator();
          this.render();
        }).catch(() => this._eventCreator.showError());

      return;
    }

    this._closeEventCreator();
    this.render();
  }

  _viewChangeHandler() {
    this._eventPresenters.forEach((eventPresenter) => eventPresenter.setDefaultView());
    this._closeEventCreator();
  }

  _filterTypeChangeHandler() {
    this._sortComponent.setDefaultType();
    this._eventsModel.setSortType(DEFAULT_SORT_TYPE);
    this.render();
  }

  _sortTypeChangeHandler(sortType) {
    this._eventsModel.setSortType(sortType);
    this.render();
  }
}
