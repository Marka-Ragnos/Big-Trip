import {DEFAULT_FILTER_TYPE, DEFAULT_SORT_TYPE} from "../const";

import {groupEventsByBeginDate} from "../utils/event";
import {filterEvents} from "../utils/filter";
import {sortEvents} from "../utils/sort";

export default class EventsModel {
  constructor() {
    this._events = [];

    this._filterType = DEFAULT_FILTER_TYPE;
    this._sortType = DEFAULT_SORT_TYPE;

    this._dataChangeHandlers = [];
    this._filterTypeChangeHandlers = [];
  }

  setEvents(events) {
    this._events = events;
    this._callHandlers(this._dataChangeHandlers);
  }

  getEvents() {
    if (!this._events.length) {
      return [];
    }

    const filteredEvents = filterEvents(this._events, this._filterType);

    if (this._sortType === DEFAULT_SORT_TYPE) {
      return Object.entries(groupEventsByBeginDate(filteredEvents))
        .map(([dateString, events]) => ({date: new Date(dateString), events}))
        .sort((leftGroup, rightGroup) => leftGroup.date - rightGroup.date)
        .map((group, i) => Object.assign(group, {number: i + 1}));
    }

    return [{events: sortEvents(filteredEvents, this._sortType)}];
  }

  getAllEvents() {
    return this._events;
  }

  createEvent(event) {
    this._events = [event, ...this._events];
    this._callHandlers(this._dataChangeHandlers);
  }

  updateEvent(id, newEvent) {
    const index = this._events.findIndex((event) => event.id === id);
    this._events = [...this._events.slice(0, index), newEvent, ...this._events.slice(index + 1)];
    this._callHandlers(this._dataChangeHandlers);
  }

  deleteEvent(id) {
    const index = this._events.findIndex((event) => event.id === id);
    this._events = [...this._events.slice(0, index), ...this._events.slice(index + 1)];
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilterType(filterType) {
    this._filterType = filterType;
    this._callHandlers(this._filterTypeChangeHandlers);
  }

  setSortType(sortType) {
    this._sortType = sortType;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterTypeChangeHandler(handler) {
    this._filterTypeChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
