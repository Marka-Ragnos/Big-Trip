import {FilterType} from "../const";

import {checkIfPastEvent, checkIfFutureEvent} from "./event";

export const filterEvents = (events, filterType) => {
  let filteredEvents;

  switch (filterType) {
    case FilterType.EVERYTHING:
      filteredEvents = [...events];
      break;
    case FilterType.FUTURE:
      filteredEvents = events.filter(checkIfFutureEvent);
      break;
    case FilterType.PAST:
      filteredEvents = events.filter(checkIfPastEvent);
      break;
  }

  return filteredEvents;
};

export const countEventsForEachFilter = (events) => {
  const filtersToCounters = Object.values(FilterType)
    .reduce((acc, filterType) => Object.assign(acc, {[filterType]: 0}), {});

  events.forEach((event) => {
    filtersToCounters[FilterType.EVERYTHING]++;

    if (checkIfPastEvent(event)) {
      filtersToCounters[FilterType.PAST]++;
    }

    if (checkIfFutureEvent(event)) {
      filtersToCounters[FilterType.FUTURE]++;
    }
  });

  return filtersToCounters;
};
