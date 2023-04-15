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

export const useStoreRenterTeam = defineStore("storeRenterTeam", {
  state: () => {
    return {
      user: {},
      teams: [],
      storeAuth: useStoreAuth(),
      storeStorage: useStoreStorage(),
    };
  },
  persist: true,
  actions: {
    init() {},
    async getTeams() {
      const q = query(
        collection(db, "RenterTeams")
        // where("uid", "==", this.storeAuth.user.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
				let tempArr = []
        let team = {
          id: doc.id,
          profileImage: doc.data().teamProfileImage,
          teamName: doc.data().teamName,
          teamLead: doc.data().teamLead,
          address: doc.data().address,
          city: doc.data().city,
          state: doc.data().state,
          zipcode: doc.data().zipcode,
          createdOn: doc.data().createdOn,
        };
        tempArr.push(team);
				this.$patch((state) => {
          state.teams.push(team);
        });
      });
    },
		clearTeams() {
			this.teams = []
		},
    async addRenterTeam(renterTeamData) {
      console.log("renter team data", renterTeamData);

      await addDoc(collection(db, "RenterTeams"), {
        profileImage: renterTeamData._value.profileImage.name,
        teamName: renterTeamData._value.teamName,
        teamLead: renterTeamData._value.teamLead,
        address: renterTeamData._value.address,
        city: renterTeamData._value.city,
        state: renterTeamData._value.state,
        zipcode: renterTeamData._value.zipcode,
        createdOn: Timestamp.now(),
        uid: this.storeAuth.user.uid,
      })
        .then(() => {
          this.storeStorage.uploadProfileImage(
            renterTeamData._value.profileImage
          );
        })
        .then(this.router.push("/renter-teams"));
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
