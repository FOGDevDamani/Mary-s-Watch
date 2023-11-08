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

let unsubscribeFromOwnerTeamTeamMembers = null;

export const useStoreOwnerTeamTeamMember = defineStore("storeOwnerTeamTeamMember", {
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
          "https://getownerteamteammemberlistdatafromcache-qqntzlhyfq-uw.a.run.app",
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
          "https://getownerteamtemmemberdetaildatafromcache-qqntzlhyfq-uw.a.run.app",
          { 
						id: docId,
						teamName: teamName
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
        collection(db, "OwnerTeamTeamMembers")
        // where("uid", "==", this.storeAuth.user.uid)
      );

      if (unsubscribeFromOwnerTeamTeamMembers) {
        return unsubscribeFromOwnerTeamTeamMembers();
      }

      unsubscribeFromOwnerTeamTeamMembers = onSnapshot(q, (snapshot) => {
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
      localStorage.clear();
      if (unsubscribeFromOwnerTeamTeamMembers) {
        return unsubscribeFromOwnerTeamTeamMembers();
      }
    },
    async addOwnerTeamTeamMember(ownerTeamTeamMemberData, uid) {
      console.log(
        "owner teamMember teamMember member data",
        ownerTeamTeamMemberData
      );

      const docRef = await addDoc(collection(db, "OwnerTeamTeamMembers"), {
        profileImage: ownerTeamTeamMemberData.image.name,
        firstName: ownerTeamTeamMemberData.data._value.firstName,
        lastName: ownerTeamTeamMemberData.data._value.lastName,
        address: ownerTeamTeamMemberData.data._value.address,
        city: ownerTeamTeamMemberData.data._value.city,
        state: ownerTeamTeamMemberData.data._value.state,
        zipcode: ownerTeamTeamMemberData.data._value.zipcode,
        role: ownerTeamTeamMemberData.data._value.role,
        email: ownerTeamTeamMemberData.data._value.email,
        phone: ownerTeamTeamMemberData.data._value.phone,
        teamName: ownerTeamTeamMemberData.teamName,
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
           .post(
             "https://adddocidtoownerteamteammemberprofile-qqntzlhyfq-uw.a.run.app",
             {
               docId: this.recentlySubmittedTicketId,
               firstName: ownerTeamTeamMemberData.data._value.firstName,
               lastName: ownerTeamTeamMemberData.data._value.lastName,
             }
           )
           .then(async () => {
             await axios.post(
               "https://cacheownerteamteammemberdata-qqntzlhyfq-uw.a.run.app",
               {
                 id: this.recentlySubmittedTicketId,
                 ownerTeamTeamMemberData: ownerTeamTeamMemberData.data._value,
               }
             );
           })
           .then(() => {
             if (ownerTeamTeamMemberData.image) {
               this.storeStorage.uploadTeamMemberProfileImage(
                 ownerTeamTeamMemberData.image,
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
      }
    },
  },
  getters: {
    getOwnerTeamTeamMemberDetailsById: (state) => {
      return (id) => {
        return state.teamMembers.filter((teamMember) => {
          return teamMember.id === id;
        })[0];
      };
    },
    getOwnerTeamTeamMemberDetailsByName: (state) => {
      return (teamMembers) => {
        console.log(teamMembers);
        console.log(state.teamMembers);
        return state.teamMembers.map((name) => {
          console.log(name);
          // return state.teamMembers.filter((teamMember) => {
          // 	console.log('teamMember Members', teamMember)
          // 	console.log('name', name)
          // 	return teamMember.teamName === name
          // })
        });
      };
    },
  },
});
