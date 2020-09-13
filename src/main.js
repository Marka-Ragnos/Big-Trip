import {MenuItem} from "./const";

import {render} from "./utils/dom";

import EventsModel from "./models/events";

import TripComponent from "./view/trip";
import StatisticsComponent from "./view/statistics";

import HeaderPresenter from "./presenter/header";

import TripPresenter from "./presenter/trip";

import API from "./api/api";
import Storage from "./api/storage";
import Provider from "./api/provider";

const headerElement = document.querySelector(`.trip-main`);
const containerElement = document.querySelector(`.page-main .page-body__container`);
const eventListElement = containerElement.querySelector(`.trip-events`);

const tripComponent = new TripComponent();
const statisticsComponent = new StatisticsComponent();

render(eventListElement, tripComponent);
render(containerElement, statisticsComponent);
statisticsComponent.hide();

const eventsModel = new EventsModel();
const provider = new Provider(new API(), new Storage(window.localStorage));

const menuItemChangeHandler = (menuItem) => {
  switch (menuItem) {
    case MenuItem.EVENTS:
      headerPresenter.showFilters();
      tripPresenter.show();
      statisticsComponent.hide();
      break;
    case MenuItem.STATS:
      headerPresenter.setDefaultFilterType();
      headerPresenter.hideFilters();
      tripPresenter.hide();
      statisticsComponent.show();
      statisticsComponent.renderCharts(eventsModel.getAllEvents());
      break;
  }
};

const addButtonClickHandler = () => {
  headerPresenter.setDefaultMenuItem();
  headerPresenter.setDefaultFilterType();
  headerPresenter.showFilters();
  headerPresenter.disableAddButton();
  statisticsComponent.hide();
  tripPresenter.show();
  tripPresenter.createEvent();
};

const headerPresenter = new HeaderPresenter(headerElement, eventsModel, menuItemChangeHandler, addButtonClickHandler);
headerPresenter.render();
headerPresenter.disableAddButton();

const eventCreatorCloseHandler = () => headerPresenter.enableAddButton();

const tripPresenter = new TripPresenter(tripComponent, eventsModel, provider, eventCreatorCloseHandler);
tripPresenter.renderLoadingMessage();

let isCriticalInfoLoaded = false;

const windowLoadHandler = () => navigator.serviceWorker.register(`/sw.js`).catch(() => {});

const windowOfflineHandler = () => {
  document.title += ` [offline]`;
};

const windowOnlineHandler = () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (isCriticalInfoLoaded && provider.isSyncNeeded) {
    provider.syncEvents()
      .then((events) => {
        eventsModel.setEvents(events);
        tripPresenter.render();
        statisticsComponent.renderCharts(eventsModel.getAllEvents());
      });
  }
};

window.addEventListener(`load`, windowLoadHandler);
window.addEventListener(`offline`, windowOfflineHandler);
window.addEventListener(`online`, windowOnlineHandler);

Promise.all([
  provider.getDestinations(),
  provider.getOffers()
]).then(([destinations, typesToOffers]) => {
  isCriticalInfoLoaded = true;
  tripPresenter.setDestinations(destinations);
  tripPresenter.setTypesToOffers(typesToOffers);
  provider.getEvents()
    .then((events) => eventsModel.setEvents(events))
    .finally(() => {
      headerPresenter.enableAddButton();
      tripPresenter.render();
    });
}).catch(() => {
  tripPresenter.renderErrorMessage();
});
