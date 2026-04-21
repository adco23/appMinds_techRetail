class User {
  constructor(id, firstName, lastName, email, password, role, commerceId, status = 'active') {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.role = role;
    this.commerceId = commerceId;
    this.status = status;
  }

  activate() {
    this.status = 'active';
  }

  deactivate() {
    this.status = 'inactive';
  }

  validateCredentials(email, password) {
    return this.email === email && this.password === password;
  }
}

module.exports = User;
