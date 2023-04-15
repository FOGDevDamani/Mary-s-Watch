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

let unsubscribeFromSPTeams = null;

export const useStoreSPTeam = defineStore("storeSPTeam", {
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
        collection(db, "SPTeams")
        // where("uid", "==", this.storeAuth.user.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        let tempArr = [];
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
    listenForTeams() {
      const q = query(
        collection(db, "SPTeams")
        // where("uid", "==", this.storeAuth.user.uid)
      );

      if (unsubscribeFromSPTeams) {
        return unsubscribeFromSPTeams();
      }

      unsubscribeFromSPTeams = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            let team = {
              id: change.doc.id,
              profileImage: change.doc.data().teamProfileImage,
              teamName: change.doc.data().teamName,
              teamLead: change.doc.data().teamLead,
              address: change.doc.data().address,
              city: change.doc.data().city,
              state: change.doc.data().state,
              zipcode: change.doc.data().zipcode,
              createdOn: change.doc.data().createdOn,
            };
            this.$patch((state) => {
              state.teams.push(team);
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
          //   const updatedProject = (this.teams.filter((ticket) => {
          //     ticket.id === updatedTicket.id;
          //   })[0] = updatedTicket);
          //   this.$patch((state) => {
          //     state.teams.splice(1, 1, updatedProject);
          //     // state.teams.shift()
          //     // state.teams.push(updatedProject)
          //   });
          // }
          // if (change.type === "removed") {
          //   console.log("Removed city: ", change.doc.data());
          // }
        });
      });
    },
    clearTeams() {
      this.teams = [];
			if (unsubscribeFromSPTeams) {
        return unsubscribeFromSPTeams();
      }
    },
    async addSPTeam(spTeamData) {
      console.log("sp team data", spTeamData);

      await addDoc(collection(db, "SPTeams"), {
        profileImage: spTeamData._value.profileImage.name,
        teamName: spTeamData._value.teamName,
        teamLead: spTeamData._value.teamLead,
        address: spTeamData._value.address,
        city: spTeamData._value.city,
        state: spTeamData._value.state,
        zipcode: spTeamData._value.zipcode,
        createdOn: Timestamp.now(),
        uid: this.storeAuth.user.uid,
      })
        .then(() => {
          this.storeStorage.uploadProfileImage(spTeamData._value.profileImage);
        })
        .then(this.router.push("/sp-teams"));
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
