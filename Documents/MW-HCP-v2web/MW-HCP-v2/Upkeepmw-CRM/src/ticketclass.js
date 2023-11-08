class Ticket {
  gUID = "";
  ticketNumber;
  address;
  city;
  state;
  zipcode;
  previouslyReported;
  type;
  description;
  priority;
  prefferedDateAndTime;
  pets;
  entryAuthorized;
  prefferedContact = [];
  projectTeams;
  constructor(
    ticketNumber,
    address,
    city,
    state,
    zipcode,
    previouslyReported,
    assignTeams,
    type,
    description,
    priority,
    prefferedDateAndTime,
    pets,
    entryAuthorized,
    prefferedContact,
    projectTeams = []
  ) {
    this.ticketNumber = ticketNumber;
    this.address = address;
    this.city = city;
    this.state = state;
    this.zipcode = zipcode;
    this.previouslyReported = previouslyReported;
    this.assignTeams = assignTeams;
    this.type = type;
    this.description = description;
    this.priority = priority;
    this.prefferedDateAndTime = prefferedDateAndTime;
    this.pets = pets;
    this.entryAuthorized = entryAuthorized;
    this.prefferedContact = prefferedContact;
    this.projectTeams = projectTeams;
    this.teamAdded = this.teamAdded.bind(this);
    this.getFullAddress = this.getFullAddress.bind(this);
    this.getPreviouslyReported = this.getPreviouslyReported.bind(this);
    this.getType = this.getType.bind(this);
    this.getDescription = this.getDescription.bind(this);
    this.getPriority = this.getPriority.bind(this);
    this.getPrefferedDateAndTime = this.getPrefferedDateAndTime.bind(this);
    this.getPetsAllowed = this.getPetsAllowed.bind(this);
  }
  ticketExist(ticket) {
    if (Object.entries(ticket).length >= 0) {
      return true;
    }
    return false;
  }
  teamAdded(team) {
    console.log("this is team", team);
    this.projectTeams = this.projectTeams.push(team);
    console.log("after appending", this.projectTeams);
    return this.projectTeams;
  }
  teamDeleted(team) {
    console.log("this is team", team);
    this.projectTeams = this.projectTeams.filter(team).pop(team);
    console.log("this is the array after pop", this.projectTeams);
    return this.projectTeams;
  }
  arrayofTeams(team) {
    this.projectTeams = this.projectTeams.push(team);
    console.log("project team", this.projectTeams);
    return this.projectTeams;
  }
  alertNetwork(ticket) {
    return ticket;
  }
  getFullAddress() {
    return `${this.address} ${this.city} ${this.state} ${this.zipcode}`;
  }
  getPreviouslyReported() {
    return `${this.previouslyReported}`;
  }
  getType() {
    return `${this.type}`;
  }
  getDescription() {
    return `${this.description}`;
  }
  getPriority() {
    return `${this.priority}`;
  }
  getPrefferedDateAndTime() {
    return `${this.prefferedDateAndTime}`;
  }
  getPetsAllowed() {
    return `${this.pets}`;
  }
}
export default Ticket;
