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
	arrayUnion
} from "firebase/firestore";
import { db } from "../../firebase/config";

import { useStoreAuth } from "../storeAuth";
import { useStoreStorage } from "../Storage/storeStorage";
import { useStoreOwnerTeamTeamMember } from "./storeOwnerTeamTeamMembers";

let unsubscribeFromOwnerTickets = null 

export const useStoreOwnerSupportTicket = defineStore("storeOwnerSupportTicket", {
  state: () => {
    return {
      recentlySubmittedTicketId: "",
      user: {},
      tickets: useStorage('ownerSupportTickets', []),
      storeAuth: useStoreAuth(),
      storeStorage: useStoreStorage(),
      storeOwnerTeamMember: useStoreOwnerTeamTeamMember,
    };
  },
  persist: true,
  actions: {
    init() {},
    async getTickets() {
      const q = query(
        collection(db, "OwnerSupportTickets")
        // where("uid", "==", this.storeAuth.user.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        let tempArr = [];
        let ticket = {
          id: doc.id,
          checklistItems: doc.data().checklistItems,
        };
        tempArr.push(ticket);
        this.$patch({
          tickets: tempArr,
        });
      });
    },
		clearOwnerSupportTickets() {
			this.tickets = []
			if (unsubscribeFromOwnerTickets) {
        return unsubscribeFromOwnerTickets();
      }
		},
    listenForTickets() {
      const q = query(
        collection(db, "OwnerSupportTickets")
        // where("uid", "==", this.storeAuth.user.uid)
      );

			if (unsubscribeFromOwnerTickets) {
        return unsubscribeFromOwnerTickets();
      }

      unsubscribeFromOwnerTickets = onSnapshot(q, (snapshot) => {
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
            console.log("Modified data: ", change.doc.data());
            let updatedTicket = {
              id: change.doc.id,
              checklistItems: change.doc.data().checklistItems,
              fundingSources: change.doc.data().fundingSources,
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
    async addOwnerSupportTicket(ownerSupportTicketData) {
			console.log("data", ownerSupportTicketData._value.address)
      const docRef = await addDoc(collection(db, "OwnerSupportTickets"), {
        checklistItems: [
          {
            previouslyReported:
              ownerSupportTicketData._value.previouslyReported,
            customerSatisfied: false,
            address: ownerSupportTicketData._value.address,
            preferredStartingDate: ownerSupportTicketData._value.date,
            preferredStartingTime: ownerSupportTicketData._value.time,
            petsAllowed: ownerSupportTicketData._value.petsAllowed,
            entryAllowedIfAbsent:
              ownerSupportTicketData._value.entryAllowedIfAbsent,
            contactNumber: ownerSupportTicketData._value.contactNumber,
            teams: ownerSupportTicketData._value.teams,
            teamMembers: ownerSupportTicketData._value.teamMembers,
            ongoing: "pending",
            completed: false,
            units: ownerSupportTicketData._value.tableRows,
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
    async updateTicket(id, fullCheckListItems) {
      await setDoc(doc(db, "OwnerSupportTickets", id), fullCheckListItems, { merge: true });
    },
  },
  getters: {
    getOwnerSupportTicketDetails: (state) => {
      return state.tickets.filter((ticket) => {
        if (ticket.id === state.recentlySubmittedTicketId) {
          console.log("ids match", state.recentlySubmittedTicketId);
          console.log("ticket", ticket);
          return ticket.id === state.recentlySubmittedTicketId;
        }
      })[0];
    },
		getOwnerSupportTicketDetailsById: (state) => {
			return (id) => {
				return state.tickets.filter((ticket) => {
          return ticket.id === id;
        })[0];
			}
		}
  },
});
