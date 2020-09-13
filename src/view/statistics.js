import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import {EventGroup, eventGroupsToEventTypes, CHART_FONT_FAMILY, ChartTitle, CHART_BAR_HEIGHT} from "../const";

import {countHours} from "../utils/date";
import {getChartLabel} from "../utils/text";
import {groupEventsByType, countEventsMoney, countEventsDuration} from "../utils/event";

import AbstractComponent from "./abstract-component";

Chart.defaults.global.defaultFontFamily = CHART_FONT_FAMILY;

const renderChart = (context, title, labels, values, formatter) => {
  context.height = CHART_BAR_HEIGHT * labels.length;

  return new Chart(context, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter
        }
      },
      title: {
        display: true,
        text: title,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatisticsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>
    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart statistics__chart--money" width="900"></canvas>
    </div>
    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart statistics__chart--transport" width="900"></canvas>
    </div>
    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart statistics__chart--time" width="900"></canvas>
    </div>
  </section>`
);

export default class Statistics extends AbstractComponent {
  constructor() {
    super();
    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  renderCharts(events) {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._transportChart.destroy();
      this._timeChart.destroy();
    }

    this._renderMoneyChart(events);
    this._renderTransportChart(events);
    this._renderTimeChart(events);
  }

  _renderMoneyChart(events) {
    const context = this.getElement().querySelector(`.statistics__chart--money`);
    const title = ChartTitle.MONEY.toUpperCase();
    const labels = [];
    const values = [];
    const formatter = (value) => `€ ${value}`;

    Object.entries(groupEventsByType(events))
      .map(([type, groupedEvents]) => [type, countEventsMoney(groupedEvents)])
      .sort(([, leftMoney], [, rightMoney]) => rightMoney - leftMoney)
      .forEach(([type, money]) => {
        labels.push(getChartLabel(type));
        values.push(money);
      });

    this._moneyChart = renderChart(context, title, labels, values, formatter);
  }

  _renderTransportChart(events) {
    const context = this.getElement().querySelector(`.statistics__chart--transport`);
    const title = ChartTitle.TRANSPORT.toUpperCase();
    const labels = [];
    const values = [];
    const formatter = (value) => `${value}x`;

    Object.entries(groupEventsByType(events))
      .filter(([type]) => eventGroupsToEventTypes[EventGroup.TRANSFER].includes(type))
      .map(([type, groupedEvents]) => [type, groupedEvents.length])
      .sort(([, leftAmount], [, rightAmount]) => rightAmount - leftAmount)
      .forEach(([type, amount]) => {
        labels.push(getChartLabel(type));
        values.push(amount);
      });

    this._transportChart = renderChart(context, title, labels, values, formatter);
  }

  _renderTimeChart(events) {
    const context = this.getElement().querySelector(`.statistics__chart--time`);
    const title = ChartTitle.TIME.toUpperCase();
    const labels = [];
    const values = [];
    const formatter = (value) => `${value}H`;

    Object.entries(groupEventsByType(events))
      .map(([type, groupedEvents]) => [type, countEventsDuration(groupedEvents)])
      .sort(([, leftDuration], [, rightDuration]) => rightDuration - leftDuration)
      .forEach(([type, duration]) => {
        labels.push(getChartLabel(type));
        values.push(countHours(duration));
      });

    this._timeChart = renderChart(context, title, labels, values, formatter);
  }
}
