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

let unsubscribeFromEstimates = null

export const useStoreSPEstimate = defineStore("storeSPEstimate", {
  state: () => {
    return {
      user: {},
      recentlySubmittedTicketId: "",
      tickets: [],
      storeAuth: useStoreAuth(),
      storeStorage: useStoreStorage(),
    };
  },
  persist: true,
  actions: {
    init() {},
    async getTickets() {
      const q = query(
        collection(db, "SPSupportTickets")
        // where("uid", "==", this.storeAuth.user.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        let tempArr = [];
        let ticket = {
          id: doc.id,
          checklistItems: doc.data().checklistItems,
          materials: doc.data().materials,
          materialsTotal: doc.data().materialsTotal,
        };
        tempArr.push(ticket);
				console.log(tempArr)
        this.$patch((state) => {
          state.tickets.push(ticket);
        });
      });
    },
		clearSPTickets() {
			this.tickets = []
			localStorage.clear();
			if (unsubscribeFromEstimates) {
				return unsubscribeFromEstimates();
			}
		},
    listenForTickets() {
      const q = query(
        collection(db, "SPSupportTickets")
        // where("uid", "==", this.storeAuth.user.uid)
      );

      unsubscribeFromEstimates = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            let ticket = {
              id: change.doc.id,
              checklistItems: change.doc.data().checklistItems,
            };
            this.$patch((state) => {
              state.tickets.push(ticket);
            });
          }
          if (change.type === "modified") {
            console.log(change);
            console.log("Modified data: ", change.doc.data());
            let updatedTicket = {
              id: change.doc.id,
              checklistItems: change.doc.data().checklistItems,
              materials: change.doc.data().materials,
              materialsEstimateTotal: change.doc.data().materialsEstimateTotal,
            };
            const updatedProject = (this.tickets.filter((ticket) => {
              ticket.id === updatedTicket.id;
            })[0] = updatedTicket);
            this.$patch((state) => {
              state.tickets.splice(1, 1, updatedProject);
              // state.tickets.shift()
              // state.tickets.push(updatedProject)
            });
          }
          // if (change.type === "removed") {
          //   console.log("Removed city: ", change.doc.data());
          // }
        });
      });
    },
    async addSPSupportTicket(spSupportTicketData) {
      console.log("sp estimate data", spSupportTicketData);

      const docRef = await addDoc(collection(db, "SPSupportTickets"), {
        checklistItems: [
          {
            teams: spSupportTicketData._value.teams,
            teamMembers: spSupportTicketData._value.teamMembers,
            jobType: spSupportTicketData._value.jobType,
            laborType: spSupportTicketData._value.laborType,
            room: spSupportTicketData._value.room,
            numberOfLaborers: spSupportTicketData._value.numberOfLaborers,
            numberOfHours: spSupportTicketData._value.numberOfHours,
            rate: spSupportTicketData._value.rate,
            amount: spSupportTicketData._value.amount,
            customerSatisfied: false,
            address: spSupportTicketData._value.address,
            date: spSupportTicketData._value.date,
            petsAllowed: spSupportTicketData._value.petsAllowed,
            problemDescription: spSupportTicketData._value.problemDescription,
            ongoing: true,
            completed: false,
            createdOn: Timestamp.now(),
            uid: this.storeAuth.user.uid,
          },
        ],
      });

      console.log("newly created doc id", docRef.id);
      this.$patch({
        recentlySubmittedTicketId: docRef.id,
      });

      if (this.recentlySubmittedTicketId) {
        console.log(
          "matched with new doc ref now",
          this.recentlySubmittedTicketId
        );
      }
    },
    async updateTicket(id, fullMaterialsData) {
      console.log(id);
      console.log(fullMaterialsData);
      await setDoc(doc(db, "SPSupportTickets", id), fullMaterialsData);
    },
  },
  getters: {
    getSPSupportTicketDetail: (state) => {
      return state.tickets.filter((ticket) => {
        if (ticket.id === state.recentlySubmittedTicketId) {
          console.log("ids match", state.recentlySubmittedTicketId);
          console.log("ticket", ticket);
          return ticket.id === state.recentlySubmittedTicketId;
        }
      })[0];
    },
		getSPSupportTicketDetailsById: (state) => {
			return (id) => {
				return state.tickets.filter((ticket) => {
          return ticket.id === id;
        })[0];
			}
		}
  },
});
