import {SortType} from "../const";

import {getEventDuration} from "./event";

export const sortEvents = (events, sortType) => {
  const eventsCopy = [...events];
  let sortedEvents;

  switch (sortType) {
    case SortType.TIME:
      sortedEvents = eventsCopy.sort((a, b) => getEventDuration(b) - getEventDuration(a));
      break;
    case SortType.PRICE:
      sortedEvents = eventsCopy.sort((a, b) => b.price - a.price);
      break;
  }

  return sortedEvents;
};
