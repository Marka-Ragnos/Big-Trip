import moment from "moment";

const formatDateUnit = (unit) => String(unit).slice(-2).padStart(2, `0`);

export const formatTime = (date) => moment(date).format(`HH:mm`);

export const formatDate = (date) => moment(date).format(`MMM D`);

export const formatISODate = (date) => moment(date).format(`YYYY-MM-DD`);

export const formatDateRange = (beginDate, endDate) => {
  const beginMoment = moment(beginDate);
  const endMoment = moment(endDate);

  return checkIfOneMonth(beginDate, endDate) ?
    `${beginMoment.format(`MMM D`)}&nbsp;&mdash;&nbsp;${endMoment.format(`D`)}` :
    `${beginMoment.format(`D MMM`)}&nbsp;&mdash;&nbsp;${endMoment.format(`D MMM`)}`;
};

export const formatDuration = (beginDate, endDate) => {
  const duration = moment.duration(endDate - beginDate);

  const dayAmount = duration.days();
  const hourAmount = duration.hours();
  const minuteAmount = duration.minutes();

  return (
    `${
      dayAmount ? `${formatDateUnit(dayAmount)}D` : ``
    } ${
      hourAmount ? `${formatDateUnit(hourAmount)}H` : ``
    } ${
      minuteAmount ? `${formatDateUnit(minuteAmount)}M` : ``
    }`
  ).trim();
};

export const countHours = (duration) => Math.floor(moment.duration(duration).asHours());

export const checkIfPast = (date) => date < Date.now();

export const checkIfFuture = (date) => date > Date.now();

export const checkIfOneMonth = (leftDate, rightDate) => leftDate.getMonth() === rightDate.getMonth() &&
  moment(leftDate).diff(moment(rightDate), `months`) === 0;

export const getMinDate = (dates) => new Date(Math.min(...dates));

export const getMaxDate = (dates) => new Date(Math.max(...dates));
