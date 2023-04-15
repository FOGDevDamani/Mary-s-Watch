import { defineStore } from "pinia";
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

let unsubscribeFromOwnerTeamTeamMembers = null;

export const useStoreOwnerTeamTeamMember = defineStore("storeOwnerTeamTeamMember", {
  state: () => {
    return {
      user: {},
      teamMembers: [],
      storeAuth: useStoreAuth(),
      storeStorage: useStoreStorage(),
    };
  },
  persist: true,
  actions: {
    init() {},
    async getTeamMembers() {
      const q = query(
        collection(db, "OwnerTeamTeamMembers")
        // where("uid", "==", this.storeAuth.user.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        let tempArr = [];
        let teamMember = {
          id: doc.id,
          profileImage: doc.data().profileImage,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          address: doc.data().address,
          city: doc.data().city,
          state: doc.data().state,
          zipcode: doc.data().zipcode,
          role: doc.data().role,
          phone: doc.data().phone,
          createdOn: doc.data().createdOn,
          teamName: doc.data().teamName,
        };
        tempArr.push(teamMember);
        this.$patch((state) => {
          state.teamMembers.push(teamMember);
        });
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
			if (unsubscribeFromOwnerTeamTeamMembers) {
        return unsubscribeFromOwnerTeamTeamMembers();
      }
    },
    getOwnerTeamTeamMemberDetailsByTeamName(name) {
      console.log("teamMember names", name);
      this.teamMembers.map((teamMember) => {
        console.log("members", teamMember);
        return teamMember.teamName === name;
      });
    },
    async addOwnerTeamTeamMember(ownerTeamTeamMemberData) {
      console.log("owner teamMember teamMember member data", ownerTeamTeamMemberData);

      await addDoc(collection(db, "OwnerTeamTeamMembers"), {
        profileImage: ownerTeamTeamMemberData._value.profileImage.name,
        firstName: ownerTeamTeamMemberData._value.firstName,
        lastName: ownerTeamTeamMemberData._value.lastName,
        address: ownerTeamTeamMemberData._value.address,
        city: ownerTeamTeamMemberData._value.city,
        state: ownerTeamTeamMemberData._value.state,
        zipcode: ownerTeamTeamMemberData._value.zipcode,
        role: ownerTeamTeamMemberData._value.role,
        email: ownerTeamTeamMemberData._value.email,
        phone: ownerTeamTeamMemberData._value.phone,
        teamName: ownerTeamTeamMemberData._value.teamName,
        createdOn: Timestamp.now(),
        uid: this.storeAuth.user.uid,
      })
        .then(() => {
          this.storeStorage.uploadProfileImage(
            ownerTeamTeamMemberData._value.profileImage
          );
        })
        .then(this.router.push("/owner-teamMembers"));
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
