class ServicePro {
  spId;
  typeofservicepro;
  licensenumber;
  name;
  address;
  city;
  state;
  zipcode;
  constructor(
    spId,
    typeofservicepro,
    licensenumber,
    name,
    address,
    city,
    state,
    zipcode
  ) {
    this.spId = spId;
    this.typeofservicepro = typeofservicepro;
    this.licensenumber = licensenumber;
    this.name = name;
    this.address = address;
    this.city = city;
    this.state = state;
    this.zipcode = zipcode;
    this.getspId = this.getspId.bind(this);
    this.getTypeofservicepro = this.getTypeofservicepro.bind(this);
    this.getLicenseNumber = this.getLicenseNumber.bind(this);
    this.getname = this.getname.bind(this);
    this.getFullAddress = this.getFullAddress.bind(this);
  }
  getspId() {
    return `${this.spId}`;
  }
  getTypeofservicepro() {
    return `${this.typeofservicepro}`;
  }
  getLicenseNumber() {
    return `${this.licensenumber}`;
  }
  getname() {
    return `${this.name}`;
  }
  getFullAddress() {
    return `${this.address} ${this.city} ${this.state} ${this.zipcode}`;
  }
}
export default ServicePro;
