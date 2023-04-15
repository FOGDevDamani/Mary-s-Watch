import { defineStore } from "pinia";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { useStoreUserInfo } from "./storeUser";
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
			user: {
	
			},
			isLoggedIn: false,
			storeUser: useStoreUserInfo(),
			storeStorage: useStoreStorage()
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
          this.user.uid = user.uid
					this.isLoggedIn = true
        } else {
          this.user = {}
					this.isLoggedIn = false
					this.router.replace('login')
					storeUser.clearUser();
					storeOwnerAsset.clearAssets()
					storeOwnerBehaviorTicket.clearBehaviorTickets()
					storeOwnerCommentTicket.clearCommentTickets()
					storeOwnerCustomer.clearCustomers()
					storeOwnerNotesTicket.clearNNoteTickets()
					storeOwnerPayments.clearPaymentTickets()
					storeOwnerReferralTicket.clearReferralTickets()
					storeOwnerReviewTicket.clearReviewTickets()
					storeOwnerSupportTicket.clearOwnerSupportTickets()
					storeOwnerTeam.clearTeams()
					storeOwnerTeamMember.clearTeamMembers()
					storeRenterSupportTicket.clearRenterTickets()
					storeRenterTeam.clearTeams()
					storeRenterTeamTeamMember.clearTeamMembers()
					storeSPCustomer.clearCustomers()
					storeSPEstimate.clearSPTickets()
					storeSPTeam.clearTeams()
					storeSPTeamTeamMember.clearTeamMembers()
        }
      });
		},
		registerUser(userData) {
			const auth = getAuth()
			createUserWithEmailAndPassword(auth, userData.email, userData.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log('new user', user)
					this.storeUser.addUserOnRegister(user.uid, userData)
        })
				.then(() => {
					this.storeStorage.uploadProfileImage(userData.profileImage)
				})
				.then(this.router.push('/index'))
        .catch((error) => {
          console.log('error', error.message)
        });
		},
		logoutUser() {
			const auth = getAuth();
			signOut(auth).then(() => {
				console.log('Sign-out successful.')

			}).catch((error) => {
				console.log(error.message)
			})
		},
		loginUser(credentials) {
			const auth = getAuth();
			signInWithEmailAndPassword(auth, credentials.email, credentials.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
					this.router.push('/')
        })
        .catch((error) => {
          console.log('error', error.message)
        });
		}
	}
});
