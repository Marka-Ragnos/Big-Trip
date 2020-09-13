import {nanoid} from "nanoid";

import {StorageKey} from "../const";

import ServerDataModel from "../models/server-data";

const convertEventsFromStorageFormat = (events) => Object.values(events)
  .map(ServerDataModel.convertEventFromServerFormat);

const convertEventsToStorageFormat = (events) => events.reduce((idsToEvents, event) => {
  idsToEvents[event.id] = ServerDataModel.convertEventToServerFormat(event);
  return idsToEvents;
}, {});

export default class Provider {
  constructor(api, storage) {
    this._api = api;
    this._storage = storage;
    this._isSyncNeeded = false;
  }

  get isSyncNeeded() {
    return this._isSyncNeeded;
  }

  getDestinations() {
    return this._api.getDestinations()
      .then((destinations) => {
        this._storage.setItem(StorageKey.DESTINATIONS, destinations.map(ServerDataModel.convertDestinationToServerFormat));
        return destinations;
      }).catch(() => {
        const destinations = this._storage.getItem(StorageKey.DESTINATIONS);

        if (destinations) {
          return destinations.map(ServerDataModel.convertDestinationFromServerFormat);
        }

        throw new Error(`Load error`);
      });
  }

  getOffers() {
    return this._api.getOffers()
      .then((offers) => {
        this._storage.setItem(StorageKey.OFFERS, ServerDataModel.convertOffersToServerFormat(offers));
        return offers;
      }).catch(() => {
        const offers = this._storage.getItem(StorageKey.OFFERS);

        if (offers) {
          return ServerDataModel.convertOffersFromServerFormat(offers);
        }

        throw new Error(`Load error`);
      });
  }

  getEvents() {
    return this._api.getEvents()
      .then((events) => {
        this._storage.setItem(StorageKey.EVENTS, convertEventsToStorageFormat(events));
        return events;
      }).catch(() => {
        this._isSyncNeeded = true;
        const events = this._storage.getItem(StorageKey.EVENTS);

        if (events) {
          return convertEventsFromStorageFormat(events);
        }

        throw new Error(`Load error`);
      });
  }

  createEvent(event) {
    const events = Object.assign({}, this._storage.getItem(StorageKey.EVENTS));

    return this._api.createEvent(event)
      .then((eventFromServer) => {
        events[eventFromServer.id] = ServerDataModel.convertEventToServerFormat(eventFromServer);
        this._storage.setItem(StorageKey.EVENTS, events);
        return eventFromServer;
      }).catch(() => {
        this._isSyncNeeded = true;
        const id = nanoid();
        event = Object.assign({}, event, {id});
        events[id] = ServerDataModel.convertEventToServerFormat(event);
        this._storage.setItem(StorageKey.EVENTS, events);
        return event;
      });
  }

  updateEvent(id, event) {
    const events = Object.assign({}, this._storage.getItem(StorageKey.EVENTS));

    return this._api.updateEvent(id, event)
      .then((eventFromServer) => {
        events[id] = ServerDataModel.convertEventToServerFormat(eventFromServer);
        this._storage.setItem(StorageKey.EVENTS, events);
        return eventFromServer;
      }).catch(() => {
        this._isSyncNeeded = true;
        events[id] = ServerDataModel.convertEventToServerFormat(event);
        this._storage.setItem(StorageKey.EVENTS, events);
        return event;
      });
  }

  deleteEvent(id) {
    const events = Object.assign({}, this._storage.getItem(StorageKey.EVENTS));

    return this._api.deleteEvent(id)
      .then(() => {
        delete events[id];
        this._storage.setItem(StorageKey.EVENTS, events);
      }).catch(() => {
        this._isSyncNeeded = true;
        delete events[id];
        this._storage.setItem(StorageKey.EVENTS, events);
      });
  }

  syncEvents() {
    return this._api.syncEvents(convertEventsFromStorageFormat(this._storage.getItem(StorageKey.EVENTS)))
      .then((events) => {
        this._isSyncNeeded = false;
        this._storage.setItem(StorageKey.EVENTS, convertEventsToStorageFormat(events));
        return events;
      }).catch(() => {
        throw new Error(`Sync error`);
      });
  }
}
