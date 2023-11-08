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

let unsubscribeFromPaymentTickets = null;

export const useStoreRenterPayment = defineStore("storeRenterPayment", {
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
    async getPayments(currentUID) {
      console.log(currentUID);
      await axios
        .post(
          "https://getrenterpaymentlistdatafromcache-qqntzlhyfq-uw.a.run.app",
          { currentUID: currentUID }
        )
        .then((res) => {
          console.log("res", res);
          this.$patch({
            tickets: res.data,
          });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    async getPaymentDetails(docId) {
      await axios
        .post(
          "https://getrenterpaymentdetaildatafromcache-qqntzlhyfq-uw.a.run.app",
          { id: docId }
        )
        .then((res) => {
          console.log("res", res);
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    clearPaymentTickets() {
      this.payments = [];
			localStorage.clear();
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
              date: change.doc.data().date,
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
      const docRef = await addDoc(collection(db, "RenterPayments"), {
        date: makeAPaymentData.date,
        address: makeAPaymentData.address,
        amount: makeAPaymentData.amount,
        for: makeAPaymentData.for,
        paymentOption: makeAPaymentData.paymentOption,
        sendReceipt: makeAPaymentData.sendReceipt,
        createdOn: Timestamp.now(),
        uid: this.storeAuth.user.uid,
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
