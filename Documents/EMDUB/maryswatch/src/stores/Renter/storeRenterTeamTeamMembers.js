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

export const useStoreRenterTeamTeamMember = defineStore("storeRenterTeamTeamMember", {
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
        collection(db, "RenterTeamTeamMembers")
        // where("uid", "==", this.storeAuth.user.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
				let tempArr = []
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
        };
        tempArr.push(teamMember);
				this.$patch((state) => {
          state.teamMembers.push(teamMember);
        });
      });
    },
		clearTeamMembers() {
			this.teamMembers = []
		},
    async addRenterTeamTeamMember(renterTeamTeamMemberData) {
      console.log("renter team team member data", renterTeamTeamMemberData);

      await addDoc(collection(db, "RenterTeamTeamMembers"), {
        profileImage: renterTeamTeamMemberData._value.profileImage.name,
        firstName: renterTeamTeamMemberData._value.firstName,
        lastName: renterTeamTeamMemberData._value.lastName,
        address: renterTeamTeamMemberData._value.address,
        city: renterTeamTeamMemberData._value.city,
        state: renterTeamTeamMemberData._value.state,
        zipcode: renterTeamTeamMemberData._value.zipcode,
        role: renterTeamTeamMemberData._value.role,
        phone: renterTeamTeamMemberData._value.phone,
        createdOn: Timestamp.now(),
        uid: this.storeAuth.user.uid,
      })
        .then(() => {
          this.storeStorage.uploadProfileImage(
            renterTeamTeamMemberData._value.profileImage
          );
        })
        .then(this.router.push("/renter-teams"));
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
});
