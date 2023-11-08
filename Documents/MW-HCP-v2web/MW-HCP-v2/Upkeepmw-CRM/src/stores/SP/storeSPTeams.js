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
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import axios from "axios";

import { useStoreAuth } from "../storeAuth";
import { useStoreStorage } from "../Storage/storeStorage";

let unsubscribeFromSPTeams = null;

export const useStoreSPTeam = defineStore("storeSPTeam", {
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
        .post("https://getspteamlistdatafromcache-qqntzlhyfq-uw.a.run.app", {
          currentUID: currentUID,
        })
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
        .post("https://getspteamdetaildatafromcache-qqntzlhyfq-uw.a.run.app", {
          id: docId,
        })
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
      if (unsubscribeFromSPTeams) {
        return unsubscribeFromSPTeams();
      }
    },
    async addSPTeam(spTeamData, uid) {
      console.log("sp team data", spTeamData);

      const docRef = await addDoc(collection(db, "SPTeams"), {
        profileImage: spTeamData.image.name,
        teamName: spTeamData.data._value.teamName,
        teamLead: spTeamData.data._value.teamLead,
        address: spTeamData.data._value.address,
        city: spTeamData.data._value.city,
        state: spTeamData.data._value.state,
        zipcode: spTeamData.data._value.zipcode,
        createdOn: Timestamp.now(),
        uid: uid,
      })

			console.log("newly created doc id", docRef.id);
      this.$patch({
        recentlySubmittedTicketId: docRef.id,
      });

      if (this.recentlySubmittedTicketId) {
        console.log(
          "matched with new doc ref now",
          this.recentlySubmittedTicketId
        );

        await axios
          .post("https://cachespteamdata-qqntzlhyfq-uw.a.run.app", {
            id: this.recentlySubmittedTicketId,
            spTeamData: spTeamData.data._value,
          })
          .then(() => {
            if (spTeamData.image) {
              this.storeStorage.uploadTeamProfileImage(
                spTeamData.image,
                "SP"
              );
            }
          })
          .then(this.router.push("/sp-teams"))
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  getters: {
    getSPTeamDetails: (state) => {
      return (id) => {
        return state.teams.filter((team) => {
          return team.id === id;
        })[0];
      };
    },
  },
});
