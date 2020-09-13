import {groupBy} from "./common";
import {formatISODate, checkIfPast, checkIfFuture, getMinDate, getMaxDate} from "./date";

export const getEventDuration = (event) => event.endDate - event.beginDate;

export const groupEventsByType = (events) => groupBy(events, (event) => event.type);

export const groupEventsByBeginDate = (events) => groupBy(events, (event) => formatISODate(event.beginDate));

export const checkIfPastEvent = (event) => checkIfPast(event.endDate);

export const checkIfFutureEvent = (event) => checkIfFuture(event.beginDate);

export const countEventsMoney = (events) => events.reduce((money, event) => money + event.price, 0);

export const countEventsMoneyWithOffers = (events) => events.reduce((money, event) => {
  money += event.price + event.offers.reduce((offersMoney, offer) => offersMoney + offer.price, 0);
  return money;
}, 0);

export const countEventsDuration = (events) => events.reduce((duration, event) => duration + getEventDuration(event), 0);

export const getEventsInfo = (events) => {
  const route = [...events].sort((a, b) => a.beginDate - b.beginDate).reduce((acc, event) => {
    const destinationName = event.destination.name;

    if (!acc.length || acc[acc.length - 1] !== destinationName) {
      acc.push(destinationName);
    }

    return acc;
  }, []);

  return {
    route,
    beginDate: getMinDate(events.map((event) => event.beginDate)),
    endDate: getMaxDate(events.map((event) => event.endDate)),
    price: countEventsMoneyWithOffers(events)
  };
};
