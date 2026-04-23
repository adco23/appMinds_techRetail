class Product {
  constructor(
    id,
    name,
    description,
    price,
    stock,
    category,
    storeId,
    status
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.category = category;
    this.storeId = storeId;
    this.status = status;
  }

  create() {}

  update(data) {
    this.name = data.name ?? this.name;
    this.description = data.description ?? this.description;
    this.price = data.price ?? this.price;
    this.stock = data.stock ?? this.stock;
    this.category = data.category ?? this.category;
    this.storeId = data.storeId ?? this.storeId;
    this.status = data.status ?? this.status;
  }

  decreaseStock(quantity) {
    if (quantity > this.stock) {
      throw new Error("Insufficient stock");
    }
    this.stock -= quantity;
  }

  activate() {
    this.status = "active";
  }

  deactivate() {
    this.status = "inactive";
  }
}

module.exports = Product;