import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { User } from "./userclass";
// import { Dwolla } from "../DwollaService"
// import { Router} from "../RoutingService"

import { useRouter, useRoute } from "vue-router";

const router = useRouter();

class AppAuth {
  username;
	email;
  password;
  status;
  route;
  emailVerified;
  resfreshedToken;
  metaData;
  loginOutUrl;
  callbackUrl;
	userService = new User()
  constructor(
    username,
		email,
    password,
    status,
    route,
    emailVerified,
    refreshedToken,
    metaData,
    callbackUrl,
    loginOutUrl
  ) {
    this.username = username;
		this.email = email;
    this.password = password;
    this.status = status;
    this.route = route;
    this.emailVerified = emailVerified;
    this.resfreshedToken = refreshedToken;
    this.metaData = metaData;
    this.callbackUrl = callbackUrl;
    this.loginOutUrl = loginOutUrl;
    this.getcallbackUrl = this.getcallbackUrl.bind(this);
    this.getlloginOutUrl = this.getloginOutUrl.bind(this);
    this.getUsername = this.getUsername.bind(this);
    this.getPassword = this.getPassword.bind(this);
    this.getStatus = this.getStatus.bind(this);
    this.getRoute = this.getRoute.bind(this);
    this.getEmailVerified = this.getEmailVerified.bind(this);
    this.getRefreshedToken = this.getRefreshedToken.bind(this);
    this.getMetaData = this.getMetaData.bind(this);
    this.passwordReset = this.passwordReset.bind(this);
    this.getSignInMethods = this.getSignInMethods.bind(this);
    // this.getRedirectResult = this.getRedirectResult.bind(this)
    this.isSignInWithEmailLink = this.isSignInWithEmailLink.bind(this);
    this.onAuthStateChanged = this.onAuthStateChanged.bind(this);
    this.onIdTokenChanged = this.onIdTokenChanged.bind(this);
    this.onIdTokenChanged = this.onIdTokenChanged.bind(this);
    this.sendPasswordResetEmail = this.sendPasswordResetEmail.bind(this);
    this.sendSignInLinkToEmail = this.sendSignInLinkToEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.verifyPasswordResetCode = this.verifyPasswordResetCode.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.parseActionCodeURL = this.parseActionCodeURL.bind(this);
    this.linkWithCredential = this.linkWithCredential.bind(this);
    this.linkWithPhoneNumber = this.linkWithPhoneNumber.bind(this);
    this.multiFactorUser = this.multiFactorUser.bind(this);
    this.reauthenticateWithCredential =
      this.reauthenticateWithCredential.bind(this);
    this.reauthenticateWithPhoneNumber =
      this.reauthenticateWithPhoneNumber.bind(this);
    this.reauthenticateWithPopUp = this.reauthenticateWithPopUp.bind(this);
    this.reauthenticateWithRedirect =
      this.reauthenticateWithRedirect.bind(this);
    this.reloadUser = this.reloadUser.bind(this);
    this.sendEmailVerication = this.sendEmailVerication.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.verifyBeforeUpdateEmail = this.verifyBeforeUpdateEmail.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updatePhoneNumber = this.updatePhoneNumber.bind(this);
  }
	signUp(email, password, userData) {
		console.log('hit', email, password, userData)
		this.email = email
		this.password = password 

		const auth = getAuth();

		createUserWithEmailAndPassword(auth, this.email, this.password)
		.then((userCredential) => {
			// Signed in
			const user = userCredential.user;
			console.log("new user", user);
			const uid = user.uid;
		
			this.userService.addUserData(userData, uid);
		})
		.then(() => {
			//send photos to storage
			
		})
		.then(() => {
			// router.push({
			//   name: "MWUserDashboard",
			//   params: { id: uid },
			// });
		})
		.catch((error) => {
			console.log("error", error.message);
		});

	}
	login(email, password) {
		this.email = email
		this.password = password

		const auth = getAuth();
    signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        // Signed in
				console.log("user is logged in", userCredential)
        const user = userCredential.user;
        // router.push({ name: "MWUserDashboard", params: { id: user.uid } });
      })
      .catch((error) => {
        console.log("error", error.message);
      });
	}
	logOut() {
		const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("Sign-out successful.");
      })
      .catch((error) => {
        console.log(error.message);
      });
	}
  getcallbackUrl() {
    return `${this.callbackUrl}`;
  }
  getloginOutUrl() {
    return `${this.loginOutUrl}`;
  }
  getUsername() {
    return `${this.username}`;
  }
  getPassword() {
    return `${this.password}`;
  }
  getStatus() {
    return `${this.status}`;
  }
  getRoute() {
    return `${this.route}`;
  }
  getEmailVerified() {
    return `${this.emailVerified}`;
  }
  getRefreshedToken() {
    return `${this.resfreshedToken}`;
  }
  getMetaData() {
    return `${this.metaData}`;
  }
  passwordReset(password) {
    if (password !== this.password) {
      return false;
    } else {
      return true;
    }
  }
  getSignInMethods() {
    if (google) {
      return;
    }
    if (phonenumber) {
      return phonenumber;
    }
    if (instagram) {
      return instagram;
    }
    if (meta) {
      return meta;
    } else {
      return null;
    }
  }
  getRedirectResult() {
    if (username == this.username && password == this.password) {
      return true;
    }
    if (username !== this.username && password !== this.password) {
      return false;
    } else {
      return null;
    }
  }
  isSignInWithEmailLink() {}
  onAuthStateChanged() {
    if (username !== this.username && password == this.password) {
      return false;
    }
    if (username == this.username && password !== this.password) {
      return false;
    } else {
      return null;
    }
  }
  onIdTokenChanged() {
    return;
  }
  sendPasswordResetEmail() {
    if (this.passwordReset() == false && getemailVerified() == true) {
      return this.sendPasswordResetEmail;
    } else {
      return null;
    }
  }
  sendSignInLinkToEmail() {
    return;
  }
  validatePassword() {
    return;
  }
  verifyPasswordResetCode() {
    return;
  }
  deleteUser() {
    return;
  }
  parseActionCodeURL() {
    return;
  }
  linkWithCredential() {
    return;
  }
  linkWithPhoneNumber() {
    return;
  }
  multiFactorUser() {
    return;
  }
  reauthenticateWithCredential() {
    return;
  }
  reauthenticateWithPhoneNumber() {
    return;
  }
  reauthenticateWithPopUp() {
    return;
  }
  reauthenticateWithRedirect() {
    return;
  }
  reloadUser() {
    return;
  }
  sendEmailVerication() {
    return;
  }
  updateEmail() {
    return;
  }
  verifyBeforeUpdateEmail() {
    return;
  }
  updatePassword() {
    if (password !== this.password) {
      return true;
    } else {
      return false;
    }
  }
  updatePhoneNumber() {
    return;
  }
}
export { AppAuth };
