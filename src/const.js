// Служебные константы
export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const ESC_KEY = `Escape`;

// Константы информации о путешествии
export const MAX_ROUTE_LENGTH = 3;

// Константы меню
export const MenuItem = {
  EVENTS: `table`,
  STATS: `stats`
};

export const DEFAULT_MENU_ITEM = MenuItem.EVENTS;

// Константы фильтров
export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const DEFAULT_FILTER_TYPE = FilterType.EVERYTHING;

// Константы сортировки
export const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

export const DEFAULT_SORT_TYPE = SortType.EVENT;

// Константы событий
export const EventType = {
  TAXI: `taxi`,
  BUS: `bus`,
  TRAIN: `train`,
  SHIP: `ship`,
  TRANSPORT: `transport`,
  DRIVE: `drive`,
  FLIGHT: `flight`,
  CHECK_IN: `check-in`,
  SIGHTSEEING: `sightseeing`,
  RESTAURANT: `restaurant`
};

export const DEFAULT_EVENT_TYPE = EventType.TAXI;

export const eventTypesToEmoji = {
  [EventType.TAXI]: `🚕`,
  [EventType.BUS]: `🚌`,
  [EventType.TRAIN]: `🚂`,
  [EventType.SHIP]: `🛳`,
  [EventType.TRANSPORT]: `🚊`,
  [EventType.DRIVE]: `🚗`,
  [EventType.FLIGHT]: `✈️`,
  [EventType.CHECK_IN]: `🏨`,
  [EventType.SIGHTSEEING]: `🏛`,
  [EventType.RESTAURANT]: `🍴`
};

export const EventGroup = {
  TRANSFER: `transfer`,
  ACTIVITY: `activity`
};

export const eventGroupsToEventTypes = {
  [EventGroup.TRANSFER]: [
    EventType.TAXI,
    EventType.BUS,
    EventType.TRAIN,
    EventType.SHIP,
    EventType.TRANSPORT,
    EventType.DRIVE,
    EventType.FLIGHT
  ],
  [EventGroup.ACTIVITY]: [
    EventType.CHECK_IN,
    EventType.SIGHTSEEING,
    EventType.RESTAURANT
  ]
};

export const eventGroupsToPrepositions = {[EventGroup.TRANSFER]: `to`, [EventGroup.ACTIVITY]: `in`};

export const EVENT_MAX_RENDERED_OFFER_AMOUNT = 3;

export const EventViewMode = {
  DEFAULT: `default`,
  EDITOR: `editor`,
  CREATOR: `creator`
};

// Константы сообщений
export const MessageText = {
  LOADING: `Loading...`,
  ERROR: `Loading error`,
  NO_EVENTS: `Click New Event to create your first point`
};

// Константы диаграмм
export const CHART_FONT_FAMILY = `Montserrat`;

export const ChartTitle = {
  MONEY: `Money`,
  TRANSPORT: `Transport`,
  TIME: `Time spent`
};

export const CHART_BAR_HEIGHT = 55;

// Константы сервера
export const SERVER_URL = `https://12.ecmascript.pages.academy/big-trip`;

export const SERVER_TOKEN = `Basic 1alexfrontfrontalex42`;

export const ServerRequestMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

// Константы хранилища
export const StorageKey = {
  DESTINATIONS: `destinations`,
  OFFERS: `offers`,
  EVENTS: `events`
};
