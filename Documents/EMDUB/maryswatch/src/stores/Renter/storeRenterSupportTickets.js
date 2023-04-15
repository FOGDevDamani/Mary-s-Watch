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

let unsubscribeFromRenterTickets = null

export const useStoreRenterSupportTicket = defineStore("storeRenterSupportTicket", {
  state: () => {
    return {
      user: {},
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
        collection(db, "RenterSupportTickets")
        // where("uid", "==", this.storeAuth.user.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
				let tempArr = []
        let ticket = {
          id: doc.id,
          priority: doc.data().priority,
          previouslyReported: doc.data().previouslyReported,
          address: doc.data().address,
          room: doc.data().room,
          problemDescription: doc.data().problemDescription,
          preferredStartingDate: doc.data().preferredStartingDate,
          preferredStartingTime: doc.data().preferredStartingTime,
          petsAllowed: doc.data().petsAllowed,
          entryAllowedIfAbsent: doc.data().entryAllowedIfAbsent,
          contactNumber: doc.data().contactNumber,
          ticketImage: doc.data().ticketImage,
          uid: doc.data().uid,
          createdOn: doc.data().createdOn,
        };
        tempArr.push(ticket);
				this.$patch({
          tickets: tempArr,
        });
      });
    },
		clearRenterTickets() {
			this.tickets = []
			if (unsubscribeFromRenterTickets) {
        return unsubscribeFromRenterTickets();
      }
		},
    listenForTickets() {
			if (unsubscribeFromRenterTickets) {
        return unsubscribeFromRenterTickets();
      }

      unsubscribeFromRenterTickets = onSnapshot(
        collection(db, "RenterSupportTickets"),
        (snapshot) => {
          this.tickets = [];
          snapshot.forEach((doc) => {
            let ticket = {
              id: doc.id,
              priority: doc.data().priority,
              previouslyReported: doc.data().previouslyReported,
              address: doc.data().address,
              room: doc.data().room,
              problemDescription: doc.data().problemDescription,
              preferredStartingDate: doc.data().preferredStartingDate,
              preferredStartingTime: doc.data().preferredStartingTime,
              petsAllowed: doc.data().petsAllowed,
              entryAllowedIfAbsent: doc.data().entryAllowedIfAbsent,
              contactNumber: doc.data().contactNumber,
              ticketImage: doc.data().ticketImage,
              uid: doc.data().uid,
              createdOn: doc.data().createdOn,
            };
            this.tickets.push(ticket);
          });
        }
      );
    },
    async addRenterSupportTicket(renterSupportTicketData) {
      console.log("renter team data", renterSupportTicketData);

      await addDoc(collection(db, "RenterSupportTickets"), {
        priority: renterSupportTicketData._value.priority,
        previouslyReported: renterSupportTicketData._value.previouslyReported,
        customerSatisfied: false,
        address: renterSupportTicketData._value.address,
        room: renterSupportTicketData._value.room,
        problemDescription: renterSupportTicketData._value.problemDescription,
        preferredStartingDate: renterSupportTicketData._value.date,
        preferredStartingTime: renterSupportTicketData._value.time,
        petsAllowed: renterSupportTicketData._value.petsAllowed,
        entryAllowedIfAbsent:
          renterSupportTicketData._value.entryAllowedIfAbsent,
        contactNumber: renterSupportTicketData._value.contactNumber,
        ongoing: "pending",
        completed: false,
        ticketImage: renterSupportTicketData._value.ticketImage.name,
        createdOn: Timestamp.now(),
        uid: this.storeAuth.user.uid,
      })
        .then(() => {
          this.storeStorage.uploadProfileImage(
            renterSupportTicketData._value.ticketImage
          );
        })
        .then(this.router.push("/renter-project-list"));
    },
  },
  getters: {
    getRenterSupportTicketDetails: (state) => {
      return (id) => {
        return state.tickets.filter((ticket) => {
          return ticket.id === id;
        })[0];
      };
    },
    getRenterSupportTicketDetais: (state) => {
      return (id) => {
        return state.tickets.filter((ticket) => {
          return ticket.id === id;
        })[0];
      };
    },
  },
});
