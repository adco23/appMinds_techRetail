class Store {
  constructor(id, name, category, subdomain, status, commerceId, createdAt) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.subdomain = subdomain;
    this.status = status;
    this.commerceId = commerceId;
    this.createdAt = createdAt;
  }
}

module.exports = Store;