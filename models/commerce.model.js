class Commerce {
  constructor(id, name, cuit, email, phone = null, address = null) {
    this.id = id;
    this.name = name;
    this.cuit = cuit;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.status = 0; // 1 = active, 0 =inactive
    this.createdAt = new Date();
  }

  activate() {
    this.status = 1;
  }

  deactivate() {
    this.status = 0;
  }

  update(data) {
    this.name = data.name || this.name;
    this.cuit = data.cuit || this.cuit;
    this.email = data.email || this.email;
    this.phone = data.phone || this.phone;
    this.address = data.address || this.address;
  }
}

module.exports = Commerce;
