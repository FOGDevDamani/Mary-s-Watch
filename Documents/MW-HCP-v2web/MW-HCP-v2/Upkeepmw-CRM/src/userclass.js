import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Storage } from "./StorageService"
import { useRouter, useRoute } from "vue-router";

class User {
  gUID = "";
  profileImage;
  userPerspectives = [];
  companyType;
  accountType;
  bio;
  phone;
  licenseNumber;
  firstName;
  lastName;
  address;
  city;
  state;
  zipcode;
  county;
  username;
  email;
  password;
  createdOn;
  receiveAlerts;
  alertType;
	static currentUserData
  teams = [];
  gif;

  static ownerTypes = [
    {
      value: "single-family",
      label: "Single_Family",
    },
    {
      value: "condo",
      label: "Condo",
    },
    {
      value: "multi-family",
      label: "Multi-Family",
    },
    {
      value: "mobile home",
      label: "Mobile Home",
    },
    {
      value: "commercial",
      label: "Commercial",
    },
  ];
  static userPerspectives = [
    {
      value: "renter",
      label: "Renter",
    },
    {
      value: "owner",
      label: "Owner",
    },
    {
      value: "rental operator",
      label: "Rental Operator",
    },
    {
      value: "service provider",
      label: "Service Provider",
    },
    {
      value: "nonprofit",
      label: "Nonprofit",
    },
  ];
  static textEmail = [
    {
      value: "text",
      label: "Text",
    },
    {
      value: "email",
      label: "Email",
    },
  ];
  static typeOfCompany = [
    {
      value: "llc",
      label: "LLC",
    },
    {
      value: "partnership",
      label: "Partnership",
    },
    {
      value: "sole proprietorship",
      label: "Sole Proprietorship",
    },
    {
      value: "limited liability",
      label: "Limited Liability",
    },
    {
      value: "limited partnership",
      label: "Limited Partnership",
    },
    {
      value: "limited liability partnership",
      label: "Limited Liability Partnership",
    },
    {
      value: "corporation",
      label: "Corporation",
    },
    {
      value: "s-corp",
      label: "S-Corp",
    },
    {
      value: "nonprofit",
      label: "Nonprofit",
    },
  ];
  constructor(
		profileImage,
    userPerspectives,
    companyType,
    accountType,
    bio,
    phone,
    licenseNumber,
    firstName,
    lastName,
    address,
    city,
    state,
    zipcode,
    county,
    username,
    email,
    password,
    createdOn,
    alertType = [],
		currentUserData,
    gif
  ) {
		this.profileImage = profileImage
    this.userPerspectives = userPerspectives;
    this.companyType = companyType;
    this.accountType = accountType;
    this.bio = bio;
    this.phone = phone;
    this.licenseNumber = licenseNumber;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.city = city;
    this.state = state;
    this.zipcode = zipcode;
    this.county = county;
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdOn = createdOn;
    this.alertType = alertType;
		this.currentUserData = currentUserData

    this.alerts = this.alerts.bind(this);
    this.getuserfullname = this.getuserfullname.bind(this);
    this.getusercontactinfo = this.getusercontactinfo.bind(this);
    this.getuserfuladdress = this.getuserfuladdress.bind(this);
    this.getPerspective = this.getPerspective.bind(this);
    this.getCompanyType = this.getCompanyType.bind(this);
    this.getAccountType = this.getAccountType.bind(this);
    this.getBio = this.getBio.bind(this);
    this.getLicenseNumber = this.getLicenseNumber.bind(this);
    this.getCreatedOn = this.getCreatedOn.bind(this);
    this.usergot = this.usergot.bind(this);
  }
  createUser() {
    return new User();
  }
  arrayofAlerts(alerts) {
    this.alertType = this.alertType.concat(alerts);
    return this.alertType;
  }
  // fullname ,contactinfo, full address,
  getuserfullname() {
    name = `${this.firstName} ${this.lastName}`;
    return name;
  }
  getusercontactinfo() {
    return `${this.email} ${this.phone}`;
  }
  getuserfuladdress() {
    return `${this.address} ${this.city} ${this.state} ${this.zipcode}`;
  }
  equals(profiles) {
    if (
      profiles.firstName === this.firstName &&
      profiles.lastName === this.lastName
    ) {
      return true;
    }
  }
  alerts(alert) {
    this.alertType.push(alert);
    return this.alertType;
  }
  getPerspective() {
    return `${this.userPerspectives}`;
  }
  getCompanyType() {
    return `${this.companyType}`;
  }
  getAccountType() {
    return `${this.accountType}`;
  }
  getBio() {
    return `${this.bio}`;
  }
  getLicenseNumber() {
    return `${this.licenseNumber}`;
  }
  getCreatedOn() {
    return `${this.createdOn}`;
  }
  usergot() {
    return User;
  }

  async addUserData(userData) {
			const router = useRouter();

    console.log(userData);

		let gUID = uuidv4();

		const storageService = new Storage()

		console.log('whats going', gUID, userData)
    await axios
      .post("https://cacheuser-qqntzlhyfq-uw.a.run.app", {
        userData: userData,
        gUID: gUID,
      })
      .then(() => {
        storageService.uploadProfileImage(userData.profileImage, gUID, userData);
      })
      
  }

  async getUserData(gUID) {
    // if (gUID) {
    //   console.log("current uid", gUID);
    //   await axios
    //     .post("https://getuserdatafromcache-qqntzlhyfq-uw.a.run.app", {
    //       gUID: gUID,
    //     })
    //     .then((res) => {
    //       console.log("res", res.data);
    //       this.currentUserData = res.data
    //     })
    //     .catch((err) => {
    //       console.log("err", err);
    //     });
    // } else {
    //   console.log("no id");
    // }
  }

  async editUserData(gUID, editedUserData) {
    if (gUID) {
      console.log(gUID);
      console.log(editedUserData);

			const storageService = new Storage();

      await axios
        .post("https://cacheediteduser-qqntzlhyfq-uw.a.run.app", {
          editedUserData: editedUserData,
					gUID: gUID
        })
        .then( await storageService.uploadProfileImage(editedUserData.profileImage, gUID, editedUserData))
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      console.log("no id");
    }
  }

  async deleteUserData(userData, gUID) {
    console.log(userData);

    await axios
      .post("https://cacheuser-qqntzlhyfq-uw.a.run.app", {
        userData: userData,
      })
      .then((res) => {
        console.log("res", res);
      })
      .then(() => {
        this.storeStorage.uploadProfileImage(userData.profileImage, gUID);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }
}
class PersonalUser extends User {
  address;
  city;
  state;
  zipcode;
  constructor(address, city, state, zipcode) {
    super();
    this.address = address;
    this.city = city;
    this.state = state;
    this.zipcode = zipcode;
    this.getFullAddress = this.getFullAddress.bind(this);
  }
  getFullAddress() {
    return `${this.address} ${this.city} ${this.state} ${this.zipcode}`;
  }
}

class BusinessUser extends User {
  licenseNumber;
  backgroundCheck;
  taxdocuments;
  generalLiabilityInsurance;
  warrantyOfProductsOrServices;
  constructor(
    licenseNumber,
    backgroundCheck,
    taxdocuments,
    generalLiabilityInsurance,
    warrantyOfProductsOrServices
  ) {
    super();
    this.licenseNumber = licenseNumber;
    this.backgroundCheck = backgroundCheck;
    this.taxdocuments = taxdocuments;
    this.generalLiabilityInsurance = generalLiabilityInsurance;
    this.warrantyOfProductsOrServices = warrantyOfProductsOrServices;
    this.getbackgroundCheck = this.getbackgroundCheck.bind(this);
    this.getGeneralLiabiltyInsurance =
      this.getGeneralLiabiltyInsurance.bind(this);
    this.getWarrantyOfProductsOrServices =
      this.getWarrantyOfProductsOrServices.bind(this);
    this.getTaxDocuments = this.getTaxDocuments.bind(this);
  }
  getLicenseNumber() {
    return `${this.licenseNumber}`;
  }
  getbackgroundCheck() {
    return `${this.backgroundCheck}`;
  }
  getTaxDocuments() {
    return `${this.taxdocuments}`;
  }
  getGeneralLiabiltyInsurance() {
    return `${this.generalLiabilityInsurance}`;
  }
  getWarrantyOfProductsOrServices() {
    return `${this.warrantyOfProductsOrServices}`;
  }
}

export { User, PersonalUser, BusinessUser };
