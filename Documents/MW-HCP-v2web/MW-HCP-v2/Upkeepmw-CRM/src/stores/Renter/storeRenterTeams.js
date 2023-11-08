import { defineStore } from "pinia";
import { storeToRefs } from "pinia";
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

export const useStoreRenterTeam = defineStore("storeRenterTeam", {
  state: () => {
    return {
      user: {},
      teams: [],
      teamDetails: {},
      storeAuth: useStoreAuth(),
      recentlySubmittedTicketId: useStorage("recentDocId", ""),
      storeStorage: useStoreStorage(),
    };
  },
  persist: true,
  actions: {
    init() {},
    async getTeams(currentUserUID) {
      console.log(currentUserUID);
      await axios
        .post(
          "https://getrenterteamlistdatafromcache-qqntzlhyfq-uw.a.run.app",
          {
            currentUserUID: currentUserUID,
          }
        )
        .then((res) => {
          console.log("res", res);
          this.$patch({
            teams: res.data,
          });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    async getTeamDetails(currentUserUID) {
      await axios
        .post(
          "https://getrenterteamdetaildatafromcache-qqntzlhyfq-uw.a.run.app",
          { currentUserUID: currentUserUID }
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
    },
    async addRenterTeam(renterTeamData, uid) {
      console.log("renter team data", renterTeamData);

      console.log(uid);

      let renterTeamUuid = uuidv4();

      await axios
        .post("https://cacherenterteamdata-qqntzlhyfq-uw.a.run.app", {
          userUid: uid,
          renterTeamUuid: renterTeamUuid,
          renterTeamData: renterTeamData,
        })
        .then(() => {
          if (renterTeamData.image) {
            this.storeStorage.TeamProfileImage(
              renterTeamData.image,
              uid,
              "Renter",
              "renter"
            );
          }
        })
        .then(this.router.push("/renter-teams"))
        .catch((err) => {
          console.log(err);
        });
    },
  },
  getters: {
    getRenterTeamDetails: (state) => {
      return (id) => {
        return state.teams.filter((team) => {
          return team.id === id;
        })[0];
      };
    },
  },
});
