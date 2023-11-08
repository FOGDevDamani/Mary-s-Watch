class TitleHolder {
  ownerId;
  deedortitle;
  typeofOwner;
  constructor(ownerId, deedortitle, typeofOwner) {
    this.ownerId = ownerId;
    this.deedortitle = deedortitle;
    this.typeofOwner = typeofOwner;
    this.getOwnerId = this.getOwnerId.bind(this);
    this.getdeedortitle = this.getdeedortitle.bind(this);
    this.getTypeofOwner = this.getTypeofOwner.bind(this);
  }
  getOwnerId() {
    return `${this.ownerId}`;
  }
  getdeedortitle() {
    return `${this.deedortitle}`;
  }
  getTypeofOwner() {
    return `${this.typeofOwner}`;
  }
}
export { TitleHolder };
