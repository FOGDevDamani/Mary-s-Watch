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
import { useStoreAuth } from "../storeAuth"

let unsubscribeFromPaymentTickets = null 

export const useStoreOwnerPayment = defineStore("storeOwnerPayment", {
  state: () => {
    return {
      user: {},
      payments: [],
      storeAuth: useStoreAuth(),
    };
  },
  persist: true,
  actions: {
    init() {},
    async getPayments() {
      const q = query(
        collection(db, "Payments")
        // where("uid", "==", this.storeAuth.user.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        let tempArr = [];
        let payment = {
          id: doc.id,
          amountDue: doc.data().amountDue,
          createdOn: doc.data().createdOn,
          daysTilLate: doc.data().daysTilLate,
          name: doc.data().name,
        };
        tempArr.push(payment);
        this.$patch((state) => {
          state.payments.push(payment);
        });
      });
    },
    clearPaymentTickets() {
      this.payments = [];
      if (unsubscribeFromPaymentTickets) unsubscribeFromPaymentTickets();
    },
    listenForPayments() {
      const q = query(
        collection(db, "Payments")
        // where("uid", "==", this.storeAuth.user.uid)
      );

      if (unsubscribeFromPaymentTickets) unsubscribeFromPaymentTickets();

      unsubscribeFromPaymentTickets = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            let ticket = {
              id: change.doc.id,
              amountDue: change.doc.data().amountDue,
              createdOn: change.doc.data().createdOn,
              daysTilLate: change.doc.data().daysTilLate,
							for: change.doc.data().for,
							paymentOption: change.doc.data().paymentOption,
							address: change.doc.data().address,
							sendReceipt: change.doc.data().sendReceipt,
							amount: change.doc.data().amount,
              name: change.doc.data().name,
							date: change.doc.data().date
            };
            this.$patch((state) => {
              state.payments.push(ticket);
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
          //   const updatedProject = (this.payments.filter((ticket) => {
          //     ticket.id === updatedTicket.id;
          //   })[0] = updatedTicket);
          //   this.$patch((state) => {
          //     state.payments.splice(1, 1, updatedProject);
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
    async addPayment(makeAPaymentData) {

      const docRef = await addDoc(collection(db, "Payments"), {
				date: makeAPaymentData.date,
				address: makeAPaymentData.address,
				amount: makeAPaymentData.amount,
				for: makeAPaymentData.for,
				paymentOption: makeAPaymentData.paymentOption,
				sendReceipt: makeAPaymentData.sendReceipt,
				createdOn: Timestamp.now(),
				uid: this.storeAuth.user.uid
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
    }
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
