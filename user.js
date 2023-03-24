module.exports = class User {
  constructor(id, email, password, img, name) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.img = img;
    this.name = name;
  }
};
