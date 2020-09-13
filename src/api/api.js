import {SERVER_URL, SERVER_TOKEN, ServerRequestMethod} from "../const";

import ServerDataModel from "../models/server-data";

const checkResponseStatus = (response) => {
  if (response.ok) {
    return response;
  }

  throw new Error(`${response.status}: ${response.statusText}`);
};

export default class API {
  getDestinations() {
    return this._sendRequest({url: `destinations`})
      .then((response) => response.json())
      .then((destinations) => destinations.map(ServerDataModel.convertDestinationFromServerFormat));
  }

  getOffers() {
    return this._sendRequest({url: `offers`})
      .then((response) => response.json())
      .then(ServerDataModel.convertOffersFromServerFormat);
  }

  getEvents() {
    return this._sendRequest({url: `points`})
      .then((response) => response.json())
      .then((events) => events.map(ServerDataModel.convertEventFromServerFormat));
  }

  createEvent(event) {
    return this._sendRequest({
      url: `points`,
      method: ServerRequestMethod.POST,
      headers: new Headers({"Content-Type": `application/json`}),
      body: JSON.stringify(ServerDataModel.convertEventToServerFormat(event))
    }).then((response) => response.json())
      .then(ServerDataModel.convertEventFromServerFormat);
  }

  updateEvent(id, event) {
    return this._sendRequest({
      url: `points/${id}`,
      method: ServerRequestMethod.PUT,
      headers: new Headers({"Content-Type": `application/json`}),
      body: JSON.stringify(ServerDataModel.convertEventToServerFormat(event))
    }).then((response) => response.json())
      .then(ServerDataModel.convertEventFromServerFormat);
  }

  deleteEvent(id) {
    return this._sendRequest({
      url: `points/${id}`,
      method: ServerRequestMethod.DELETE
    });
  }

  syncEvents(events) {
    return this._sendRequest({
      url: `points/sync`,
      method: ServerRequestMethod.POST,
      headers: new Headers({"Content-Type": `application/json`}),
      body: JSON.stringify(events.map(ServerDataModel.convertEventToServerFormat))
    }).then((response) => response.json())
      .then(({created, updated}) => ([
        ...created.map(ServerDataModel.convertEventFromServerFormat),
        ...updated.map((event) => ServerDataModel.convertEventFromServerFormat(event.payload.point))
      ]));
  }

  _sendRequest({url, method = ServerRequestMethod.GET, headers = new Headers(), body = null}) {
    headers.append(`Authorization`, SERVER_TOKEN);
    return fetch(`${SERVER_URL}/${url}`, {method, headers, body})
      .then(checkResponseStatus);
  }
}
