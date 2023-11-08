import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { v4 as uuidv4 } from "uuid";
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
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useStoreAuth } from "../storeAuth";
import { useStoreStorage } from "../Storage/storeStorage";
import axios from "axios";


let unsubscribeFromOwnerTeams = null;

export const useStoreOwnerTeam = defineStore("storeOwnerTeam", {
  state: () => {
    return {
      user: {},
      teams: [],
      teamDetails: {},
      storeAuth: useStoreAuth(),
      storeStorage: useStoreStorage(),
      recentlySubmittedTicketId: useStorage("recentDocId", ""),
    };
  },
  persist: true,
  actions: {
    init() {},
    async getTeams(currentUID) {
      console.log(currentUID);
      await axios
        .post(
          "https://getownerteamlistdatafromcache-qqntzlhyfq-uw.a.run.app",
          { currentUserUID: currentUID }
        )
        .then((res) => {
          console.log("res", res);
          this.$patch({ teams: res.data });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    async getTeamDetails(docId) {
      await axios
        .post(
          "https://getownerteamdetaildatafromcache-qqntzlhyfq-uw.a.run.app",
          { cuserUserUID: docId }
        )
        .then((res) => {
          console.log("res", res);
          this.$patch({ teamDetails: res.data });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    clearTeams() {
      this.teams = [];
      localStorage.clear();
      if (unsubscribeFromOwnerTeams) {
        return unsubscribeFromOwnerTeams();
      }
    },
    async addOwnerTeam(ownerTeamData, uid) {
       console.log("owner team data", ownerTeamData);

       console.log(uid);

       let ownerTeamUuid = uuidv4();

       await axios
         .post("https://cacheownerteamdata-qqntzlhyfq-uw.a.run.app", {
           userUid: uid,
           ownerTeamUuid: ownerTeamUuid,
           ownerTeamData: ownerTeamData.data._value,
         })
         .then(() => {
           if (ownerTeamData.image) {
             this.storeStorage.TeamProfileImage(
               ownerTeamData.image,
               uid,
               "Owner",
               "owner"
             );
           }
         })
         .then(this.router.push("/owner-teams"))
         .catch((err) => {
           console.log(err);
         });
    },
  },
  getters: {
    getOwnerTeamDetails: (state) => {
      return (id) => {
        return state.teams.filter((team) => {
          return team.id === id;
        })[0];
      };
    },
  },
});
