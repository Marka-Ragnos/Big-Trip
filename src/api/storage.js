export default class Storage {
  constructor(storage) {
    this._storage = storage;
  }

  setItem(key, value) {
    this._storage.setItem(key, JSON.stringify(value));
  }

  getItem(key) {
    try {
      return JSON.parse(this._storage.getItem(key));
    } catch (error) {
      return null;
    }
  }
}
