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

import { useStoreAuth } from "../storeAuth";
import { useStoreStorage } from "../Storage/storeStorage";
import axios from "axios";

let unsubscribeFromSPTeamTeamMembers = null;

export const useStoreSPTeamTeamMember = defineStore("storeSPTeamTeamMember", {
  state: () => {
    return {
      user: {},
      teamMembers: [],
      teamMemberDetails: {},
      storeAuth: useStoreAuth(),
      storeStorage: useStoreStorage(),
      recentlySubmittedTicketId: useStorage("recentDocId", ""),
    };
  },
  persist: true,
  actions: {
    init() {},
    async getTeamMembers(currentUID) {
      console.log(currentUID);
      await axios
        .post(
          "https://getspteamteammemberlistdatafromcache-qqntzlhyfq-uw.a.run.app",
          { currentUID: currentUID }
        )
        .then((res) => {
          console.log("res", res);
          this.$patch({ teamMembers: res.data });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    async getTeamMemberDetails(docId, teamName) {
      await axios
        .post(
          "https://getspteamtemmemberdetaildatafromcache-qqntzlhyfq-uw.a.run.app",
          {
            id: docId,
            teamName: teamName,
          }
        )
        .then((res) => {
          console.log("res", res);
          this.$patch({ teamMemberDetails: res.data });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    listenForTeamMembers() {
      const q = query(
        collection(db, "SPTeamTeamMembers")
        // where("uid", "==", this.storeAuth.user.uid)
      );

      if (unsubscribeFromSPTeamTeamMembers) {
        return unsubscribeFromSPTeamTeamMembers();
      }

      unsubscribeFromSPTeamTeamMembers = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            let teamMember = {
              id: change.doc.id,
              profileImage: change.doc.data().profileImage,
              firstName: change.doc.data().firstName,
              lastName: change.doc.data().lastName,
              address: change.doc.data().address,
              city: change.doc.data().city,
              state: change.doc.data().state,
              zipcode: change.doc.data().zipcode,
              role: change.doc.data().role,
              phone: change.doc.data().phone,
              createdOn: change.doc.data().createdOn,
              teamName: change.doc.data().teamName,
            };
            this.$patch((state) => {
              state.teamMembers.push(teamMember);
            });
          }
          // if (change.type === "modified") {
          //   console.log(change);
          //   console.log("Modified data: ", change.doc.data());
          //   let updatedTicket = {
          //     id: change.doc.id,
          //     checklistItems: change.doc.data().checklistItems,
          //     fundingSources: change.doc.data().fundingSources,
          //   };
          //   const updatedProject = (this.teamMembers.filter((ticket) => {
          //     ticket.id === updatedTicket.id;
          //   })[0] = updatedTicket);
          //   this.$patch((state) => {
          //     state.teamMembers.splice(1, 1, updatedProject);
          //     // state.teamMembers.shift()
          //     // state.teamMembers.push(updatedProject)
          //   });
          // }
          // if (change.type === "removed") {
          //   console.log("Removed city: ", change.doc.data());
          // }
        });
      });
    },
    clearTeamMembers() {
      this.teamMembers = [];

      if (unsubscribeFromSPTeamTeamMembers) {
        return unsubscribeFromSPTeamTeamMembers();
      }
    },
    async addSPTeamTeamMember(spTeamTeamMemberData, uid) {
      console.log("sp team team member data", spTeamTeamMemberData);

     const docRef = await addDoc(collection(db, "SPTeamTeamMembers"), {
        profileImage: spTeamTeamMemberData.image.name,
        firstName: spTeamTeamMemberData.data._value.firstName,
        lastName: spTeamTeamMemberData.data._value.lastName,
        address: spTeamTeamMemberData.data._value.address,
        city: spTeamTeamMemberData.data._value.city,
        state: spTeamTeamMemberData.data._value.state,
        zipcode: spTeamTeamMemberData.data._value.zipcode,
        role: spTeamTeamMemberData.data._value.role,
        phone: spTeamTeamMemberData.data._value.phone,
				teamName: spTeamTeamMemberData.teamName,
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
          .post("https://cachespteamteammemberdata-qqntzlhyfq-uw.a.run.app", {
            id: this.recentlySubmittedTicketId,
            spTeamTeamMemberData: spTeamTeamMemberData.data._value,
          })
          .then(() => {
            if (spTeamTeamMemberData.image) {
              this.storeStorage.uploadTeamMemberProfileImage(
                spTeamTeamMemberData.image,
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
    getSPTeamTeamMemberDetails: (state) => {
      return (id) => {
        return state.teamMembers.filter((teamMember) => {
          return teamMember.id === id;
        })[0];
      };
    },
  },
});
