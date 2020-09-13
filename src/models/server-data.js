export default class ServerDataModel {
  static convertDestinationFromServerFormat(destination) {
    return {
      name: destination.name,
      description: destination.description || ``,
      photos: destination.pictures.map(({src, description}) => ({src, alt: description}))
    };
  }

  static convertDestinationToServerFormat(destination) {
    return {
      name: destination.name,
      description: destination.description,
      pictures: destination.photos.map(({src, alt}) => ({src, description: alt}))
    };
  }

  static convertOfferFromServerFormat(offer) {
    return {
      name: offer.title,
      price: offer.price
    };
  }

  static convertOfferToServerFormat(offer) {
    return {
      title: offer.name,
      price: offer.price
    };
  }

  static convertOffersFromServerFormat(offers) {
    return offers.reduce((typesToOffers, {type, offers: offersForType}) => {
      typesToOffers[type] = offersForType.map(ServerDataModel.convertOfferFromServerFormat);
      return typesToOffers;
    }, {});
  }

  static convertOffersToServerFormat(offers) {
    return Object.entries(offers).map(([type, offersForType]) => ({
      type,
      offers: offersForType.map(ServerDataModel.convertOfferToServerFormat)
    }));
  }

  static convertEventFromServerFormat(event) {
    return {
      id: event.id,
      type: event.type,
      destination: ServerDataModel.convertDestinationFromServerFormat(event.destination),
      beginDate: new Date(event[`date_from`]),
      endDate: new Date(event[`date_to`]),
      price: event[`base_price`],
      isFavorite: event[`is_favorite`],
      offers: event.offers.map(ServerDataModel.convertOfferFromServerFormat)
    };
  }

  static convertEventToServerFormat(event) {
    return {
      "id": event.id,
      "type": event.type,
      "destination": ServerDataModel.convertDestinationToServerFormat(event.destination),
      "date_from": event.beginDate.toISOString(),
      "date_to": event.endDate.toISOString(),
      "base_price": event.price,
      "is_favorite": event.isFavorite,
      "offers": event.offers.map(ServerDataModel.convertOfferToServerFormat)
    };
  }
}
