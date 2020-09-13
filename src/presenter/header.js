import {DEFAULT_FILTER_TYPE} from "../const";

import {render} from "../utils/dom";
import {countEventsForEachFilter} from "../utils/filter";
import {getEventsInfo} from "../utils/event";

import InfoComponent from "../view/info";
import ControlsComponent from "../view/controls";
import MenuComponent from "../view/menu";
import FilterComponent from "../view/filter";
import ButtonComponent from "../view/button";

export default class HeaderPresenter {
  constructor(container, eventsModel, menuItemChangeHandler, addButtonClickHandler) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._infoComponent = new InfoComponent();
    this._controlsComponent = new ControlsComponent();
    this._menuComponent = new MenuComponent();
    this._filterComponent = new FilterComponent();
    this._addButtonComponent = new ButtonComponent();

    this._menuItemChangeHandler = menuItemChangeHandler;
    this._addButtonClickHandler = addButtonClickHandler;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._dataChangeHandler = this._dataChangeHandler.bind(this);

    this._menuComponent.setItemChangeHandler(this._menuItemChangeHandler);
    this._addButtonComponent.setClickHandler(this._addButtonClickHandler);
    this._filterComponent.setTypeChangeHandler(this._filterTypeChangeHandler);
    this._eventsModel.setDataChangeHandler(this._dataChangeHandler);
  }

  render() {
    render(this._container, this._infoComponent);
    render(this._container, this._controlsComponent);
    render(this._controlsComponent, this._menuComponent);
    render(this._controlsComponent, this._filterComponent);
    render(this._container, this._addButtonComponent);

    const events = this._eventsModel.getAllEvents();

    this._updateInfo(events);
    this._updateFilters(events);

    if (!events.length) {
      this._controlsComponent.hide();
    }
  }

  setDefaultMenuItem() {
    this._menuComponent.setDefaultItem();
  }

  setDefaultFilterType() {
    this._filterComponent.setDefaultType();
    this._eventsModel.setFilterType(DEFAULT_FILTER_TYPE);
  }

  showFilters() {
    this._filterComponent.show();
  }

  hideFilters() {
    this._filterComponent.hide();
  }

  enableAddButton() {
    this._addButtonComponent.enable();
  }

  disableAddButton() {
    this._addButtonComponent.disable();
  }

  _updateInfo(events) {
    this._infoComponent.showInfo(events.length ? getEventsInfo(events) : {});
  }

  _updateFilters(events) {
    Object.entries(countEventsForEachFilter(events)).forEach(([filterType, counter]) => {
      if (counter) {
        this._filterComponent.enableType(filterType);
        return;
      }

      this._filterComponent.disableType(filterType);
    });
  }

  _filterTypeChangeHandler(filterType) {
    this._eventsModel.setFilterType(filterType);
  }

  _dataChangeHandler() {
    const events = this._eventsModel.getAllEvents();

    this._updateInfo(events);
    this._updateFilters(events);

    if (events.length) {
      this._controlsComponent.show();
      return;
    }

    this._controlsComponent.hide();
  }
}
