import { test, describe, expect, vi } from "vitest";
import { User, PersonalUser, BusinessUser } from "../../userclass.js";
import Ticket from "../../ticketclass.js";
import Asset from "../../assetclass.js";
import Tenent from "../../tenenclass.js";
import { TitleHolder } from "../../titleholderclass.js";
import ServicePro from "../../serviceproclass.js";
import Auth from "../../authclass.js";

describe("this us the user test suite", () => {
  // test("create complete user", async () => {
  //   var user = new User(
  //     "sjfndknv",
  //     "dfff",
  //     "ddd",
  //     "ddd",
  //     "dddd",
  //     "ddddd",
  //     "raymond",
  //     "fowler",
  //     "1167 maderas sds",
  //     "memnlo",
  //     "ca",
  //     "o3oo3o3",
  //     "jsnenc",
  //     "jbwajdkj",
  //     "ajsndkn",
  //     "asoiej",
  //     "uahwwedij"
  //   );
  //   var profile = vi.fn(user.createUser);
  //   profile(user);
  //   expect(profile).toHaveReturnedWith(User);
  // });
  // test("create incomplete user", async () => {
  //   var user = new User(
  //     "sjfndknv",
  //     "dfff",
  //     "ddd",
  //     "ddd",
  //     "dddd",
  //     "ddddd",
  //     "raymond",
  //     "fowler",
  //     "1167 maderas sds",
  //     "memnlo",
  //     "ca",
  //     "o3oo3o3",
  //     "jsnenc",
  //     "jbwajdkj",
  //     "ajsndkn",
  //     "asoiej",
  //     "uahwwedij"
  //   );
  //   var profile = vi.fn(user.createUser);
  //   profile(user);
  //   expect(profile).toHaveReturnedWith(User);
  // });
  test("to make sure the the same attributes between users return true", async () => {
    var user = new User(
      "sjfndknv",
      "dfff",
      "ddd",
      "ddd",
      "dddd",
      "ddddd",
      "raymond",
      "fowler",
      "1167 maderas sds",
      "memnlo",
      "ca",
      "o3oo3o3",
      "jsnenc",
      "jbwajdkj",
      "ajsndkn",
      "asoiej",
      "uahwwedij"
    );
    var userOne = new User(
      "sjfndknv",
      "dfff",
      "ddd",
      "ddd",
      "dddd",
      "ddddd",
      "raymond",
      "fowler",
      "1167 maderas sds",
      "memnlo",
      "ca",
      "o3oo3o3",
      "jsnenc",
      "jbwajdkj",
      "ajsndkn",
      "asoiej",
      "uahwwedij"
    );

    expect(user.equals(userOne)).toBeTruthy();
  });
  test("to make sure the different attributes between users returns false", async () => {
    var user = new User(
      "sjfndknv",
      "dfff",
      "ddd",
      "ddd",
      "dddd",
      "ddddd",
      "raymond",
      "fowler",
      "1167 maderas sds",
      "memnlo",
      "ca",
      "o3oo3o3",
      "jsnenc",
      "jbwajdkj",
      "ajsndkn",
      "asoiej",
      "uahwwedij"
    );
    var userOne = new User(
      "sjfndknv",
      "gggg",
      "ddd",
      "ddd",
      "dddd",
      "ddddd",
      "george",
      "fowler",
      "1167 maderas sds",
      "memnlo",
      "ca",
      "o3oo3o3",
      "jsnenc",
      "jbwajdkj",
      "ajsndkn",
      "asoiej",
      "uahwwedij"
    );

    expect(user.equals(userOne)).toBeFalsy();
  });
  // test("setting the alert returns an array", async ()=> {
  //     var user = new User('a','b','c','d', 'e','f','g','h','i', 'j', 'k','l','m','n','o','p','r',[])
  //     var alert = ["mobile"]
  //      console.log("this is alerts", user.arrayofAlerts(alert))
  //      console.log("this is alert",alert)
  //         expect(user.arrayofAlerts(alert)).toHaveReturnedWith(alert)
  // });
  test("alert array has length", async () => {
    var user = new User(
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "r",
      []
    );
    var alerts = ["mobile"];

    expect(user.arrayofAlerts(alerts)).toHaveLength(1);
  });
  test("get full name of the user", async () => {
    var user = new User(
      "a",
      "b",
      "c",
      "d",
      "d",
      "d",
      "ray",
      "fowler",
      "jsj",
      "ss",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "r",
      ["mobile"]
    );
    var name = "ray fowler";
    var usergetfullname = vi.fn(user.getuserfullname);
    usergetfullname(name);

    expect(usergetfullname).toHaveReturnedWith(name);
  });
  test("get user contact info", async () => {
    var user = new User(
      "a",
      "b",
      "c",
      "6508267256",
      "6508267256",
      "6508267256",
      "ray",
      "fowler",
      "jsj",
      "ss",
      "j",
      "k",
      "l",
      "m",
      "ray@gmail.com",
      "o",
      "p",
      "r",
      ["mobile"]
    );
    var contact = "ray@gmail.com 6508267256";
    var getusercontactinfo = vi.fn(user.getusercontactinfo);
    getusercontactinfo(contact);
    expect(getusercontactinfo).toHaveReturnedWith(contact);
  });
  test("get user full adress", async () => {
    var user = new User(
      "sjfndknv",
      "dfff",
      "ddd",
      "ddd",
      "dddd",
      "ddddd",
      "raymond",
      "fowler",
      "1168 madera ave",
      "menlo park",
      "ca",
      "94025",
      "jsnenc",
      "jbwajdkj",
      "ajsndkn",
      "asoiej",
      "uahwwedij"
    );
    var fullAddress = "1168 madera ave menlo park ca 94025";
    var getfullAddress = vi.fn(user.getuserfuladdress);
    getfullAddress(fullAddress);
    expect(getfullAddress).toHaveReturnedWith(fullAddress);
  });
  test("get user perspective", async () => {
    var user = new User(
      "owner",
      "dfff",
      "ddd",
      "ddd",
      "dddd",
      "ddddd",
      "raymond",
      "fowler",
      "1168 madera ave",
      "menlo park",
      "ca",
      "94025",
      "jsnenc",
      "jbwajdkj",
      "ajsndkn",
      "asoiej",
      "uahwwedij"
    );
    var perspective = "owner";
    var getPerspective = vi.fn(user.getPerspective);
    getPerspective(perspective);
    expect(getPerspective).toHaveReturnedWith(perspective);
  });
  test("get user company type", async () => {
    var user = new User(
      "owner",
      "plumbing",
      "ddd",
      "ddd",
      "dddd",
      "ddddd",
      "raymond",
      "fowler",
      "1168 madera ave",
      "menlo park",
      "ca",
      "94025",
      "jsnenc",
      "jbwajdkj",
      "ajsndkn",
      "asoiej",
      "uahwwedij"
    );
    var companyType = "plumbing";
    var getCompanyType = vi.fn(user.getCompanyType);
    getCompanyType(companyType);
    expect(getCompanyType).toHaveReturnedWith(companyType);
  });
  test("get user account type", async () => {
    var user = new User(
      "owner",
      "plumbing",
      "business",
      "ddd",
      "dddd",
      "ddddd",
      "raymond",
      "fowler",
      "1168 madera ave",
      "menlo park",
      "ca",
      "94025",
      "jsnenc",
      "jbwajdkj",
      "ajsndkn",
      "asoiej",
      "uahwwedij"
    );
    var accountType = "business";
    var getAccountType = vi.fn(user.getAccountType);
    getAccountType(accountType);
    expect(getAccountType).toHaveReturnedWith(accountType);
  });
  test("get user bio", async () => {
    var user = new User(
      "owner",
      "plumbing",
      "business",
      "this is my amazing bio that has so many great things about my business listed.",
      "dddd",
      "ddddd",
      "raymond",
      "fowler",
      "1168 madera ave",
      "menlo park",
      "ca",
      "94025",
      "jsnenc",
      "jbwajdkj",
      "ajsndkn",
      "asoiej",
      "uahwwedij"
    );
    var bio =
      "this is my amazing bio that has so many great things about my business listed.";
    var getBio = vi.fn(user.getBio);
    getBio(bio);
    expect(getBio).toHaveReturnedWith(bio);
  });
  test("get user Licensce number", async () => {
    var user = new User(
      "owner",
      "plumbing",
      "business",
      "this is my amazing bio that has so many great things about my business listed.",
      "1234567",
      "1234567",
      "raymond",
      "fowler",
      "1168 madera ave",
      "menlo park",
      "ca",
      "94025",
      "jsnenc",
      "jbwajdkj",
      "ajsndkn",
      "asoiej",
      "uahwwedij"
    );
    var licenseNumber = "1234567";
    var getLicenseNumber = vi.fn(user.getLicenseNumber);
    getLicenseNumber(licenseNumber);
    expect(getLicenseNumber).toHaveReturnedWith(licenseNumber);
  });
  test("get user created on date", async () => {
    var user = new User(
      "owner",
      "plumbing",
      "business",
      "this is my amazing bio that has so many great things about my business listed.",
      "1234567",
      "1234567",
      "raymond",
      "fowler",
      "1168 madera ave",
      "menlo park",
      "ca",
      "94025",
      "jsnenc",
      "jbwajdkj",
      "ajsndkn",
      "asoiej",
      "12/14/1998"
    );
    var createdOn = "12/14/1998";
    var getCreatedOn = vi.fn(user.getCreatedOn);
    getCreatedOn(createdOn);
    expect(getCreatedOn).toHaveReturnedWith(createdOn);
  });
  test("this gets Business user's licence number", async () => {
    var businessUser = new BusinessUser(
      "1234567890",
      "file.jpeg",
      "file.jpeg",
      "file.jpeg",
      "file.jpeg",
      ""
    );
    var licenseNumber = "1234567890";
    var getLicenseNumber = vi.fn(businessUser.getLicenseNumber);
    getLicenseNumber(licenseNumber);
    expect(getLicenseNumber).toHaveReturnedWith(licenseNumber);
  });
  test("this is a businesss users test to get the background check", async () => {
    var businessUser = new BusinessUser(
      "1234567890",
      "123",
      "file.jpeg",
      "file.jpeg",
      "file.jpeg"
    );
    var background = "123";
    var getbackgroundCheck = vi.fn(businessUser.getbackgroundCheck);
    getbackgroundCheck(background);
    expect(getbackgroundCheck).toHaveReturnedWith(background);
  });
  test("this is a businesss users test to get the tax Documents", async () => {
    var businessUser = new BusinessUser(
      "1234567890",
      "file.jpeg",
      "file.jpeg",
      "file.jpeg",
      "file.jpeg"
    );
    var taxDocuments = "file.jpeg";
    var getTaxDocuments = vi.fn(businessUser.getTaxDocuments);
    getTaxDocuments(taxDocuments);
    expect(getTaxDocuments).toHaveReturnedWith(taxDocuments);
  });
  test("this is a businesss users test to get the general Liabilty Insurance", async () => {
    var businessUser = new BusinessUser(
      "1234567890",
      "file.jpeg",
      "file.jpeg",
      "file.jpeg",
      "file.jpeg"
    );
    var generalLiabiltyInsurance = "file.jpeg";
    var getGeneralLiabiltyInsurance = vi.fn(
      businessUser.getGeneralLiabiltyInsurance
    );
    getGeneralLiabiltyInsurance(generalLiabiltyInsurance);
    expect(getGeneralLiabiltyInsurance).toHaveReturnedWith(
      generalLiabiltyInsurance
    );
  });
  test("this is a businesss users test to get the general warranty and services", async () => {
    var businessUser = new BusinessUser(
      "1234567890",
      "file.jpeg",
      "file.jpeg",
      "file.jpeg",
      "file.jpeg"
    );
    var WarrantyOfProductsOrServices = "file.jpeg";
    var getWarrantyOfProductsOrServices = vi.fn(
      businessUser.getWarrantyOfProductsOrServices
    );
    getWarrantyOfProductsOrServices(WarrantyOfProductsOrServices);
    expect(getWarrantyOfProductsOrServices).toHaveReturnedWith(
      WarrantyOfProductsOrServices
    );
  });
});
// this is the test sweet for the child class of user. this is the personal branch off of the user perspectives.
describe("this is the personal user class test suite", () => {
  test("get the pesonal user full adress", async () => {
    var personalUser = new PersonalUser(
      "1168 madera ave",
      "menlo park",
      "Ca",
      "94025"
    );
    var address = "1168 madera ave menlo park Ca 94025";
    var getPersonalFullAddress = vi.fn(personalUser.getFullAddress);
    getPersonalFullAddress(address);
    expect(getPersonalFullAddress).toHaveReturnedWith(address);
  });
});
describe("this is the ticket test suite", () => {
  test("this is the test for submitting a ticket", async () => {
    var ticket = new Ticket(
      "jsjsjj",
      "jsjknd",
      "sds",
      "a",
      "m",
      "s",
      "s",
      "s",
      "s",
      "s",
      "s",
      "s",
      "s",
      "s"
    );
    var ticketExist = vi.fn(ticket.ticketExist);
    ticketExist(ticket);

    expect(ticketExist).toHaveReturnedWith(true);
  });
  // test("adding a team to a ticket", async () => {
  //     var ticket = new Ticket('jsjsjj','jsjknd','sds','a','m','s','s','s','s','s','s','s','yes','email')
  //     var team = ['the best team']
  //     expect(ticket.teamAdded(team)).toHaveReturnedWith(team)
  // })
  test("making sure an array of teams is strings", async () => {
    var ticket = new Ticket(
      "jsjsjj",
      "jsjknd",
      "sds",
      "a",
      "m",
      "s",
      "s",
      "s",
      "s",
      "s",
      "s",
      "s",
      "yes",
      "email"
    );
    var team = ["the best team"];

    expect(ticket.arrayofTeams(team)).toBeTypeOf("number");
  });
  // test("notify network", async () => {
  //     var ticket = new Ticket('jsjsjj','jsjknd','sds','a','m','s','s','s','s','s','s','s','yes','ewail')
  //     var alertNetwork = vi.fn(ticket.alertNetwork)
  //     alertNetwork(ticket)
  //     expect(alertNetwork).toHaveReturnedWith(Ticket)
  // })
  test("get ticket fulladdress", async () => {
    var ticket = new Ticket(
      "12345678",
      "1168 madera ave",
      "menlo park",
      "ca",
      "94025",
      "yes",
      "the best team",
      "rental property",
      "this is the bst damn rental property the world will ever know",
      "yes",
      "12/14/2024",
      "yes",
      "yes",
      "email",
      "the best teams"
    );
    var fullAddress = "1168 madera ave menlo park ca 94025";
    var getFullAddress = vi.fn(ticket.getFullAddress);
    getFullAddress(fullAddress);
    expect(getFullAddress).toHaveReturnedWith(fullAddress);
  });
  test("to know if ticket is previously reported", async () => {
    var ticket = new Ticket(
      "12345678",
      "1168 madera ave",
      "menlo park",
      "ca",
      "94025",
      "yes",
      "the best team",
      "rental property",
      "this is the bst damn rental property the world will ever know",
      "yes",
      "12/14/2024",
      "yes",
      "yes",
      "email",
      "the best teams"
    );
    var previouslyReported = "yes";
    var getPreviouslyReported = vi.fn(ticket.getPreviouslyReported);
    getPreviouslyReported(previouslyReported);
    expect(getPreviouslyReported).toHaveReturnedWith(previouslyReported);
  });
  test("get type of ticket", async () => {
    var ticket = new Ticket(
      "12345678",
      "1168 madera ave",
      "menlo park",
      "ca",
      "94025",
      "yes",
      "the best team",
      "rental property",
      "this is the bst damn rental property the world will ever know",
      "yes",
      "12/14/2024",
      "yes",
      "yes",
      "email",
      "the best teams"
    );
    var type = "rental property";
    var getType = vi.fn(ticket.getType);
    getType(type);
    expect(getType).toHaveReturnedWith(type);
  });
  test("get the description of the ticket", async () => {
    var ticket = new Ticket(
      "12345678",
      "1168 madera ave",
      "menlo park",
      "ca",
      "94025",
      "yes",
      "the best team",
      "rental property",
      "this is the bst damn rental property the world will ever know",
      "yes",
      "12/14/2024",
      "yes",
      "yes",
      "email",
      "the best teams"
    );
    var description =
      "this is the bst damn rental property the world will ever know";
    var getDescription = vi.fn(ticket.getDescription);
    getDescription(description);
    expect(getDescription).toHaveReturnedWith(description);
  });
  test("get the priority of the ticket", async () => {
    var ticket = new Ticket(
      "12345678",
      "1168 madera ave",
      "menlo park",
      "ca",
      "94025",
      "yes",
      "the best team",
      "rental property",
      "this is the bst damn rental property the world will ever know",
      "yes",
      "12/14/2024",
      "yes",
      "yes",
      "email",
      "the best teams"
    );
    var priority = "yes";
    var getPriority = vi.fn(ticket.getPriority);
    getPriority(priority);
    expect(getPriority).toHaveReturnedWith(priority);
  });
  test("get the preffered data and time to start of the ticket", async () => {
    var ticket = new Ticket(
      "12345678",
      "1168 madera ave",
      "menlo park",
      "ca",
      "94025",
      "yes",
      "the best team",
      "rental property",
      "this is the bst damn rental property the world will ever know",
      "yes",
      "12/14/2024",
      "yes",
      "yes",
      "email",
      "the best teams"
    );
    var prefferedDateAndTime = "12/14/2024";
    var getPrefferedDateAndTime = vi.fn(ticket.getPrefferedDateAndTime);
    getPrefferedDateAndTime(prefferedDateAndTime);
    expect(getPrefferedDateAndTime).toHaveReturnedWith(prefferedDateAndTime);
  });
  test("to see if pets are allowed on this ticket", async () => {
    var ticket = new Ticket(
      "12345678",
      "1168 madera ave",
      "menlo park",
      "ca",
      "94025",
      "yes",
      "the best team",
      "rental property",
      "this is the bst damn rental property the world will ever know",
      "yes",
      "12/14/2024",
      "yes",
      "yes",
      "email",
      "the best teams"
    );
    var petsAllowed = "yes";
    var getPetsAllowed = vi.fn(ticket.getPetsAllowed);
    getPetsAllowed(petsAllowed);
    expect(getPetsAllowed).toHaveReturnedWith(petsAllowed);
  });
});
describe("this is the test suite for customers", () => {
  test("this is the test for add a customer", async () => {});
});
describe("this is the test suite for assets", () => {
  test("this is the test for creating an asset/ addaAsset", async () => {
    var asset = new Asset(
      "1168 madera ave",
      "menlo park",
      "ca",
      "94025",
      "yes",
      "the best team",
      "rental property",
      "this is the bst damn rental property the world will ever know",
      "yes",
      "12/14/2024",
      "yes",
      "yes",
      "email",
      "the best teams"
    );
    var assetAdded = "1168 madera ave menlo park ca 94025";
    var addaAsset = vi.fn(asset.addaAsset);
    addaAsset(assetAdded);
    expect(addaAsset).toHaveReturnedWith(assetAdded);
  });
});
describe("this is the tenent test suite", () => {
  test("this is the test to get the tenent fulladdress", async () => {
    var tenent = new Tenent(
      "1168 madera ave",
      "Menlo park",
      "Ca",
      "94025",
      "name",
      "section 8"
    );
    var address = "1168 madera ave Menlo park Ca 94025";
    var getFullAddress = vi.fn(tenent.getFullAddresss);
    getFullAddress();
    expect(getFullAddress).toHaveReturnedWith(address);
  });
  test("this is the test to get the type of tenent", async () => {
    var tenent = new Tenent(
      "1168 madera ave",
      "Menlo park",
      "Ca",
      "94025",
      "name",
      "section 8"
    );
    var tenentType = "section 8";
    var getTenentType = vi.fn(tenent.getTenentType);
    getTenentType();
    expect(getTenentType).toHaveReturnedWith(tenentType);
  });
});
describe("this is the test suite for the Titleholder class", () => {
  test("this is a test to get the title holder's owner id", async () => {
    var titleholder = new TitleHolder("12345678", "deed.pdf", "corporation");
    var ownerid = "12345678";
    var getOwnerId = vi.fn(titleholder.getOwnerId);
    getOwnerId();
    expect(getOwnerId).toHaveReturnedWith(ownerid);
  });
  test("this is a test to get the title holder's owner id", async () => {
    var titleholder = new TitleHolder("12345678", "deed.pdf", "corporation");
    var deedortitle = "deed.pdf";
    var getdeedortitle = vi.fn(titleholder.getdeedortitle);
    getdeedortitle();
    expect(getdeedortitle).toHaveReturnedWith(deedortitle);
  });
  test("this is a test to get the title holder's owner id", async () => {
    var titleholder = new TitleHolder("12345678", "deed.pdf", "corporation");
    var typeofOwner = "corporation";
    var getTypeofOwner = vi.fn(titleholder.getTypeofOwner);
    getTypeofOwner();
    expect(getTypeofOwner).toHaveReturnedWith(typeofOwner);
  });
});
describe("this is the test suite forthe service pro class", () => {
  test("this is a test that get the service pros spId", async () => {
    var servicepro = new ServicePro(
      "1234",
      "1234567890",
      "plumber",
      "mike",
      "1234 crane st",
      "menlo Park",
      "ca",
      "94025"
    );
    var spId = "1234";
    var getspId = vi.fn(servicepro.getspId);
    getspId();
    expect(getspId).toHaveReturnedWith(spId);
  });
  test("this is a test that get the service pros type pf service provided", async () => {
    var servicepro = new ServicePro(
      "1234",
      "plumber",
      "1234567890",
      "mike",
      "1234 crane st",
      "menlo Park",
      "ca",
      "94025"
    );
    var typeofservicepro = "plumber";
    var getTypeofservicepro = vi.fn(servicepro.getTypeofservicepro);
    getTypeofservicepro();
    expect(getTypeofservicepro).toHaveReturnedWith(typeofservicepro);
  });
  test("this is a test that get the service pros license number for thier business", async () => {
    var servicepro = new ServicePro(
      "1234",
      "plumber",
      "1234567890",
      "mike",
      "1234 crane st",
      "menlo Park",
      "ca",
      "94025"
    );
    var licensenumber = "1234567890";
    var getLicenseNumber = vi.fn(servicepro.getLicenseNumber);
    getLicenseNumber();
    expect(getLicenseNumber).toHaveReturnedWith(licensenumber);
  });
  test("this is a test that get the service pros name", async () => {
    var servicepro = new ServicePro(
      "1234",
      "plumber",
      "1234567890",
      "mike",
      "1234 crane st",
      "menlo Park",
      "ca",
      "94025"
    );
    var name = "mike";
    var getname = vi.fn(servicepro.getname);
    getname();
    expect(getname).toHaveReturnedWith(name);
  });
  test("this is a test that get the service pros name", async () => {
    var servicepro = new ServicePro(
      "1234",
      "plumber",
      "1234567890",
      "mike",
      "1234 crane st",
      "menlo park",
      "ca",
      "94025"
    );
    var fulladdress = "1234 crane st menlo park ca 94025";
    var getFullAddress = vi.fn(servicepro.getFullAddress);
    getFullAddress();
    expect(getFullAddress).toHaveReturnedWith(fulladdress);
  });
});
describe("this is the test suite for the Auth class", () => {
  test("this is the test to get the Username for the aith class", async () => {
    var auth = new Auth("rayray123", "password", "good", "from Sign in page");
    var username = "rayray123";
    var getUsername = vi.fn(auth.getUsername);
    getUsername();
    expect(getUsername).toHaveReturnedWith(username);
  });
  test("this is the test to get the passwowrd for the auth class", async () => {
    var auth = new Auth("rayray123", "password", "good", "from Sign in page");
    var password = "password";
    var getPassword = vi.fn(auth.getPassword);
    getPassword();
    expect(getPassword).toHaveReturnedWith(password);
  });
  test("this is the test to get the status for the auth class", async () => {
    var auth = new Auth("rayray123", "password", "good", "from Sign in page");
    var status = "good";
    var getStatus = vi.fn(auth.getStatus);
    getStatus();
    expect(getStatus).toHaveReturnedWith(status);
  });
  test("this is the test to get the route for the auth class", async () => {
    var auth = new Auth("rayray123", "password", "good", "from Sign in page");
    var route = "from Sign in page";
    var getRoute = vi.fn(auth.getRoute);
    getRoute();
    expect(getRoute).toHaveReturnedWith(route);
  });
  test("this is the test to get the email verification for the auth class", async () => {
    var auth = new Auth(
      "rayray123",
      "password",
      "good",
      "from Sign in page",
      "yes",
      "yes",
      "the good stuff"
    );
    var emailVerified = "yes";
    var getEmailVerified = vi.fn(auth.getEmailVerified);
    getEmailVerified();
    expect(getEmailVerified).toHaveReturnedWith(emailVerified);
  });
  test("this is the test to get the refreshed token for the auth class", async () => {
    var auth = new Auth(
      "rayray123",
      "password",
      "good",
      "from Sign in page",
      "yes",
      "yes",
      "the good stuff"
    );
    var refreshedToken = "yes";
    var getRefreshedToken = vi.fn(auth.getRefreshedToken);
    getRefreshedToken();
    expect(getRefreshedToken).toHaveReturnedWith(refreshedToken);
  });
  test("this is the test to get the meta data for the auth class", async () => {
    var auth = new Auth(
      "rayray123",
      "password",
      "good",
      "from Sign in page",
      "yes",
      "yes",
      "the good stuff"
    );
    var metaData = "the good stuff";
    var getMetaData = vi.fn(auth.getMetaData);
    getMetaData();
    expect(getMetaData).toHaveReturnedWith(metaData);
  });
  test("this is a test in the auth suite that makaes sure that the new password does not match the old password.", async () => {
    var auth = new Auth("heybighead", "thebestpassword");
    var password = "heybiggyhead";
    var passwordReset = vi.fn(auth.passwordReset);
    expect(auth.passwordReset(password)).toBeFalsy();
  });
  test("this is a test in the auth suite that returns the call back Url", async () => {
    var auth = new Auth(
      "rayray123",
      "password",
      "good",
      "from Sign in page",
      "yes",
      "yes",
      "the good stuff",
      "callbackurl.com",
      "logoutUrl.com"
    );
    var callbackurl = "callbackurl.com";
    var getcallbackUrl = vi.fn(auth.getcallbackUrl);
    getcallbackUrl();
    expect(getcallbackUrl).toHaveReturnedWith(callbackurl);
  });
  test("this is a test in the auth suite that returns the login/out Url", async () => {
    var auth = new Auth(
      "rayray123",
      "password",
      "good",
      "from Sign in page",
      "yes",
      "yes",
      "the good stuff",
      "callbackurl.com",
      "logoutUrl.com"
    );
    var loginOutUrl = "logoutUrl.com";
    var getlloginoutUrl = vi.fn(auth.getlloginOutUrl);
    getlloginoutUrl(loginOutUrl);
    expect(getlloginoutUrl).toHaveReturnedWith(loginOutUrl);
  });
  // test ("this is a test in the auth suite that returns the login/out Url", async () => {
  //     var auth = new Auth('rayray123','password','good','from Sign in page','yes','yes','the good stuff','callbackurl.com','logoutUrl.com')
  //     var getRedirectResult = vi.fn(auth.getRedirectResult)
  //     getRedirectResult()
  //     expect(getRedirectResult).toBeTruthy()
  // })
  // test("thisis a test to make sure we get an update on auth state changing", async () => {
  //     var auth = new Auth('rayray123','password','good','from Sign in page','yes','yes','the good stuff','callbackurl.com','logoutUrl.com')
  //     var onAuthStateChanged = vi.fn(auth.onAuthStateChanged)
  //     onAuthStateChanged()
  //     expect(onAuthStateChanged).toBeFalsy()
  // })
  // test("this is the test in the auth that get the password updated and also makes sure it doesnt match the old password.",async ()=>{
  //     var auth = new Auth('rayray123','password','good','from Sign in page','yes','yes','the good stuff','callbackurl.com','logoutUrl.com')
  //     var updatedPassword = 'mynewpassword'
  //     var updatePassword = vi.fn(auth.updatePassword)
  //     updatePassword(updatedPassword)
  //     expect(updatePassword).toBeTruthy()
  // })
});
