import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { AppAuth } from "../AppAuthService"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { useStoreUserInfo } from "./storeUser"
import { useStoreStorage } from "./Storage/storeStorage";
import { useStoreOwnerAsset } from "./Owner/storeOwnerAssets";
import { useStoreOwnerBehaviorTicket } from "./Owner/storeOwnerBehaviorTicket";
import { useStoreOwnerCommentTicket } from "./Owner/storeOwnerCommentTicket";
import { useStoreOwnerCustomer } from "./Owner/storeOwnerCustomers";
import { useStoreOwnerNoteTicket } from "./Owner/storeOwnerNotesTicket";
import { useStoreOwnerPayment } from "./Owner/storeOwnerPayments";
import { useStoreOwnerReferralTicket } from "./Owner/storeOwnerReferralTicket";
import { useStoreOwnerReviewTicket } from "./Owner/storeOwnerReviewTicket";
import { useStoreOwnerSupportTicket } from "./Owner/storeOwnerSupportTickets";
import { useStoreOwnerTeam } from "./Owner/storeOwnerTeams";
import { useStoreOwnerTeamTeamMember } from "./Owner/storeOwnerTeamTeamMembers";

import { useStoreRenterSupportTicket } from "./Renter/storeRenterSupportTickets";
import { useStoreRenterTeam } from "./Renter/storeRenterTeams";
import { useStoreRenterTeamTeamMember } from "./Renter/storeRenterTeamTeamMembers";

import { useStoreSPCustomer } from "./SP/storeSPCustomers";
import { useStoreSPEstimate } from "./SP/storeSPEstimates";
import { useStoreSPTeam } from "./SP/storeSPTeams";
import { useStoreSPTeamTeamMember } from "./SP/storeSPTeamTeamMembers";


export const useStoreAuth = defineStore("storeAuth", {
 state: () => {
		return {
			user: useStorage('user', {}),
			userUID: useStorage('userUID', ''),
			isLoggedIn: false,
			storeUser: useStoreUserInfo(),
			storeStorage: useStoreStorage(),
			authService: new AppAuth()
		}
	},				
	actions: {
		init() {
			const storeUser = useStoreUserInfo()
			const storeOwnerAsset = useStoreOwnerAsset()
			const storeOwnerBehaviorTicket = useStoreOwnerBehaviorTicket()
			const storeOwnerCommentTicket = useStoreOwnerCommentTicket()
			const storeOwnerCustomer = useStoreOwnerCustomer()
			const storeOwnerNotesTicket = useStoreOwnerNoteTicket()
			const storeOwnerPayments = useStoreOwnerPayment()
			const storeOwnerReferralTicket = useStoreOwnerReferralTicket()
			const storeOwnerReviewTicket = useStoreOwnerReviewTicket()
			const storeOwnerSupportTicket = useStoreOwnerSupportTicket()
			const storeOwnerTeam = useStoreOwnerTeam()
			const storeOwnerTeamMember = useStoreOwnerTeamTeamMember()

			const storeRenterSupportTicket = useStoreRenterSupportTicket()
			const storeRenterTeam = useStoreRenterTeam()
			const storeRenterTeamTeamMember = useStoreRenterTeamTeamMember()

			const storeSPCustomer = useStoreSPCustomer()
			const storeSPEstimate = useStoreSPEstimate()
			const storeSPTeam = useStoreSPTeam()
			const storeSPTeamTeamMember = useStoreSPTeamTeamMember()
			
			const auth = getAuth();
			onAuthStateChanged(auth, (user) => {
        if (user) {
          this.userUID = user.uid
					this.isLoggedIn = true
        } else {
					console.log("auth state no long signed in")
          this.user = {}
					this.isLoggedIn = false
					this.router.replace('login')
        }
      });
		},
		registerUser(userData) {
			this.authService.signUp(userData.email, userData.password, userData)
		},
		logoutUser() {
			this.authService.logOut()
		},
		loginUser(credentials) {
			this.authService.login(credentials.email, credentials.password)
		}
	},
	getters: {
		getUID: (state) => {
			return state.user.uid
		}
	}
});
