import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { v4 as uuidv4 } from "uuid";
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

let unsubscribeFromRenterTickets = null

export const useStoreRenterSupportTicket = defineStore("storeRenterSupportTicket", {
  state: () => {
    return {
      user: {},
      tickets: [],
			ticketDetails: {},
      storeAuth: useStoreAuth(),
      recentlySubmittedTicketId: useStorage("recentDocId", ""),
      storeStorage: useStoreStorage(),
    };
  },
  persist: true,
  actions: {
    init() {},
    async getTickets(currentUID) {
      console.log(currentUID);
      await axios
        .post(
          "https://getrenterticketlistdatafromcache-qqntzlhyfq-uw.a.run.app",
          { currentUserUID: currentUID }
        )
        .then((res) => {
          console.log("res", res);
          this.$patch({ tickets: res.data })
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    async getTicketDetails(docId) {
      await axios
        .post(
          "https://getrenterticketdetaildatafromcache-qqntzlhyfq-uw.a.run.app",
          { currentUserUID: docId }
        )
        .then((res) => {
          console.log("res", res);
					this.$patch({ ticketDetails: res.data})
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    clearRenterTickets() {
      this.tickets = [];
			localStorage.clear();
      if (unsubscribeFromRenterTickets) {
        return unsubscribeFromRenterTickets();
      }
    },
    async addRenterSupportTicket(renterSupportTicketData, uid) {
      console.log("renter ticket data", renterSupportTicketData);

			let renterTicketUuid = uuidv4()

        await axios
          .post("https://cacherenterticketdata-qqntzlhyfq-uw.a.run.app", {
            userUid: uid,
						renterTicketUuid: renterTicketUuid,
            renterTicketData: renterSupportTicketData.data._value,
          })
          .then(() => {
            if (renterSupportTicketData.image) {
              this.storeStorage.uploadProfileImage(
                renterSupportTicketData.image
              );
            }
          })
          .then(this.router.push("/renter-project-list"))
          .catch((err) => {
            console.log(err);
          });
      
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
