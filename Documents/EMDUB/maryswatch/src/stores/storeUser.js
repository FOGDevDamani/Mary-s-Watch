import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  Timestamp,
  query,
  where,
  onSnapshot
} from "firebase/firestore";
import { db } from "../firebase/config";

import { useStoreAuth } from "./storeAuth";


export const useStoreUserInfo = defineStore("storeUser", {
  state: () => {
    return {
      me: useStorage('me', {}),
      storeAuth: useStoreAuth(),
    };
  },
  persist: true,
  actions: {
    init() {},
    async addUserOnRegister(uid, userData) {
      await setDoc(doc(db, "user", uid), {
        profileImage: userData.profileImage.name,
        userPerspectives: userData.userPerspective,
        perspective: userData.perspective,
        companyType: userData.companyType,
        accountType: userData.accountType,
        bio: userData.bio,
        phone: userData.phone,
        licenseNumber: userData.licenseNumber,
        firstName: userData.firstName,
        lastName: userData.lastName,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        zipcode: userData.zipcode,
        county: userData.county,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        createdOn: Timestamp.now(),
        uid: uid,
      });
    },
    async getUser() {
      if (this.storeAuth.user) {
        const q = query(
          collection(db, "user"),
          where("user_id", "==", this.storeAuth.user.uid)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          if (doc.exists()) {
            let user = {
              id: doc.id,
              firstName: doc.data().firstName,
              accountType: doc.data().accountType,
              lastName: doc.data().lastName,
              perspectives: doc.data().userPerspectives,
              companyType: doc.data().companyType,
              bio: doc.data().bio,
              phone: doc.data().phone,
              licenseNumber: doc.data().licenseNumber,
              email: doc.data().email,
              profileImage: doc.data().profileImage,
              address: doc.data().address,
              city: doc.data().city,
              state: doc.data().state,
              zipcode: doc.data().zipcode,
              county: doc.data().county,
              createdOn: doc.data().createdOn,
              badges: doc.data().badges,
              points: doc.data().points,
              uid: doc.data().uid,
              dwollaAccountName: doc.data().dwollaAccountName,
            };

            this.$patch({
              me: user,
            });
          }
        });
      } else {
        console.log("no id");
      }
    },
		clearUser() {
			this.me = {}
		}
  },
  getters: {
    fullName: (state) => {
      return `${state.me.firstName} ${state.me.lastName}`;
    },
    isOwner: (state) => {
      if (state.me.perspectives && state.me.perspectives.length > 0) {
        return state.me.perspectives.includes("owner");
      }
    },
    isRenter: (state) => {
      if (state.me.perspectives && state.me.perspectives.length > 0) {
        return state.me.perspectives.includes("renter");
      }
    },
    isSP: (state) => {
      if (state.me.perspectives && state.me.perspectives.length > 0) {
        return state.me.perspectives.includes("service provider");
      }
    },
    isNonprofit: (state) => {
      if (state.me.perspectives && state.me.perspectives.length > 0) {
        return state.me.perspectives.includes("non profit");
      }
    },
  },
});
