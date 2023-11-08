import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { User } from "../userclass"
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
import axios from "axios";
import { useStoreAuth } from "./storeAuth";
import { useStoreStorage } from "./Storage/storeStorage";


export const useStoreUserInfo = defineStore("storeUser", {
  state: () => {
    return {
      me: useStorage('me', {}),
      storeAuth: useStoreAuth(),
			storeStorage: useStoreStorage(),
			userService: new User()
    };
  },
  persist: true,
  actions: {
    init() {},
    async addUserOnRegister(userData) {
			this.userService.addUserData(userData)
    },
    async getUser(gUID) {
			if (gUID) {
        console.log(gUID);
        await axios
          .post("https://getuserdatafromcache-qqntzlhyfq-uw.a.run.app", {
            gUID: gUID,
          })
          .then((res) => {
            this.$patch({ me: res.data })
          }) 
          .catch((err) => {
            console.log("err", err);
          });
      } else {
        console.log("no id");
      }
    },
		async editUser(uid, editedUserData) {
			this.userService.editUserData(uid, editedUserData).then(this.router.push("/personal-profile"))
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
