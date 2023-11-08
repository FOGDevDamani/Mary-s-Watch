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

export const useStoreRenterTeamTeamMember = defineStore(
  "storeRenterTeamTeamMember",
  {
    state: () => {
      return {
        user: {},
        teamMembers: [],
        teamMemberDetails: {},
        storeAuth: useStoreAuth(),
        recentlySubmittedTicketId: useStorage("recentDocId", ""),
        storeStorage: useStoreStorage(),
      };
    },
    persist: true,
    actions: {
      init() {},
      async getTeamMembers(currentUID) {
        console.log(currentUID);
        await axios
          .post(
            "https://getrenterteamteammemberlistdatafromcache-qqntzlhyfq-uw.a.run.app",
            {
              currentUID: currentUID,
            }
          )
          .then((res) => {
            console.log("res", res);
            this.$patch({ teamMembers: res.data });
          })
          .catch((err) => {
            console.log("err", err);
          });
      },
      async getTeamMemberDetails(docId) {
        console.log(docId);
        await axios
          .post(
            "https://getrenterteamtemmemberdetaildatafromcache-qqntzlhyfq-uw.a.run.app",
            { currentUserUID: docId }
          )
          .then((res) => {
            console.log("res", res);
            this.$patch({ teamMemberDetails: res.data });
          })
          .catch((err) => {
            console.log("err", err);
          });
      },
      clearTeamMembers() {
        this.teamMembers = [];
        localStorage.clear();
      },
      async addRenterTeamTeamMember(renterTeamTeamMemberData, uid) {
        console.log("renter team team member data", renterTeamTeamMemberData);

        let renterTeamTeamMemberUuid = uuidv4();

        await axios
          .post(
            "https://cacherenterteamteammemberdata-qqntzlhyfq-uw.a.run.app",
            {
              userUid: uid,
              renterTeamTeamMemberUuid: renterTeamTeamMemberUuid,
              renterTeamTeamMemberData: renterTeamTeamMemberData.data._value,
            }
          )
          .then(() => {
            if (renterTeamTeamMemberData.image) {
              this.storeStorage.uploadTeamMemberProfileImage(
                renterTeamTeamMemberData.image,
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
      getRenterTeamTeamMemberDetails: (state) => {
        return (id) => {
          return state.teamMembers.filter((teamMember) => {
            return teamMember.id === id;
          })[0];
        };
      },
    },
  }
);
