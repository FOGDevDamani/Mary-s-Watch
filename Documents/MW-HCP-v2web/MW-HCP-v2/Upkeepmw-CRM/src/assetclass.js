class Asset {
  constructor(
    address,
    city,
    state,
    zipcode,
    assignTeams,
    propertyForSale,
    shortTermRental,
    parking,
    email,
    phone,
    assetOwner,
    teams = []
  ) {
    this.address = address;
    this.city = city;
    this.state = state;
    this.zipcode = zipcode;
    this.assignTeams = assignTeams;
    this.propertyForSale = propertyForSale;
    this.shortTermRental = shortTermRental;
    this.parking = parking;
    this.email = email;
    this.phone = phone;
    this.assetOwner = assetOwner;
    this.teams = teams;
    this.getFullAddress = this.getFullAddress.bind(this);
    this.getPropertyForSale = this.getPropertyForSale.bind(this);
    this.getShortTermRental = this.getShortTermRental.bind(this);
    this.isParking = this.isParking.bind(this);
    this.getContactInformation = this.getContactInformation.bind(this);
    this.getOwner = this.getOwner.bind(this);
    this.addaAsset = this.addaAsset.bind(this);
  }
  assignTeams = (team) => {
    this.teams.push(team);
    return this.teams;
  };
  getContactInformation() {
    return `${this.phone} ${this.email}`;
  }
  getPropertyForSale(propertyForSale) {
    return `${this.propertyForSale}`;
  }
  getOwner(owner) {
    return `${this.assetOwner}`;
  }
  getShortTermRental() {
    return `${this.shortTermRental}`;
  }
  getFullAddress() {
    return `${this.address} ${this.state} ${this.city} ${this.zipcode}`;
  }
  isParking() {
    return `${this.parking}`;
  }
  addaAsset() {
    return `${this.address} ${this.city} ${this.state} ${this.zipcode}`;
  }
}
export default Asset;
