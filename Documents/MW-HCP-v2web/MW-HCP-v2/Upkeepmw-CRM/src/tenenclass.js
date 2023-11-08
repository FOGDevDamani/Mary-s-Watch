class Tenent {
  address;
  city;
  state;
  zipcode;
  name;
  tenentType;
  constructor(address, city, state, zipcode, name, tenentType) {
    this.address = address;
    this.city = city;
    this.state = state;
    this.zipcode = zipcode;
    this.name = name;
    this.tenentType = tenentType;
    this.getFullAddresss = this.getFullAddresss.bind(this);
    this.getTenentType = this.getTenentType.bind(this);
  }
  getFullAddresss() {
    return `${this.address} ${this.city} ${this.state} ${this.zipcode}`;
  }
  getTenentType() {
    return `${this.tenentType}`;
  }
}
export default Tenent;
