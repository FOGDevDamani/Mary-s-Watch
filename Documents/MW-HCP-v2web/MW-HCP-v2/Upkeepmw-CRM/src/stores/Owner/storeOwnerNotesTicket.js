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

let unsubscribeFromNotesTickets = null 

export const useStoreOwnerNoteTicket = defineStore("storeOwnerNoteTicket", {
  state: () => {
    return {
      user: {},
      tickets: [],
      storeAuth: useStoreAuth(),
    };
  },
  persist: true,
  actions: {
    init() {},
    async addOwnerNoteTicket(ownerNoteTicketData) {
      const docRef = await addDoc(collection(db, "Notes"), {
        address: ownerNoteTicketData.address,
        description: ownerNoteTicketData.description,
        name: ownerNoteTicketData.name,
        createdOn: Timestamp.now(),
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
    async getTickets() {
      const q = query(
        collection(db, "Notes")
        // where("uid", "==", this.storeAuth.user.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        let tempArr = [];
        let ticket = {
          id: doc.id,
          createdOn: doc.data().createdOn,
          description: doc.data().description,
          name: doc.data().name,
        };
        tempArr.push(ticket);
        this.$patch({
          tickets: tempArr
        });
      });
    },
		clearNNoteTickets() {
			this.tickets = []
			localStorage.clear();
			if(unsubscribeFromNotesTickets) unsubscribeFromNotesTickets()
		},
    listenForNoteTickets() {
      const q = query(
        collection(db, "Notes")
        // where("uid", "==", this.storeAuth.user.uid)
      );

			if (unsubscribeFromNotesTickets) unsubscribeFromNotesTickets();

      unsubscribeFromNotesTickets = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            let ticket = {
              id: change.doc.id,
              description: change.doc.data().description,
              name: change.doc.data().name,
              createdOn: change.doc.data().createdOn,
            };
            this.$patch((state) => {
              state.tickets.push(ticket);
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
          //   const updatedProject = (this.tickets.filter((ticket) => {
          //     ticket.id === updatedTicket.id;
          //   })[0] = updatedTicket);
          //   this.$patch((state) => {
          //     state.tickets.splice(1, 1, updatedProject);
          //     // state.tickets.shift()
          //     // state.tickets.push(updatedProject)
          //   });
          // }
          // if (change.type === "removed") {
          //   console.log("Removed city: ", change.doc.data());
          // }
        });
      });
    },
  },
  getters: {
    // getOwnerCustomerDetails: (state) => {
    //   return (id) => {
    //     return state.customers.filter((customer) => {
    //       return customer.id === id;
    //     })[0];
    //   };
    // },
  },
});
