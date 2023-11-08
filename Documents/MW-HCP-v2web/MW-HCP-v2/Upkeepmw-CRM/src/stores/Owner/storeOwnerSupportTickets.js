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
import axios from "axios";

let unsubscribeFromOwnerTickets = null 

export const useStoreOwnerSupportTicket = defineStore("storeOwnerSupportTicket", {
  state: () => {
    return {
      recentlySubmittedTicketId: "",
      user: {},
      tickets: useStorage("ownerSupportTickets", []),
			ticketDetails: {},
      storeAuth: useStoreAuth(),
      storeStorage: useStoreStorage(),
      storeOwnerTeamMember: useStoreOwnerTeamTeamMember,
    };
  },
  persist: true,
  actions: {
    init() {},
    async getTickets(currentUID) {
      console.log(currentUID);
      await axios
        .post(
          "https://getownerticketlistdatafromcache-qqntzlhyfq-uw.a.run.app",
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
    async getTicketDetails(docId) {
      await axios
        .post(
          "https://getownerticketdetaildatafromcache-qqntzlhyfq-uw.a.run.app",
          { id: docId }
        )
        .then((res) => {
          console.log("res", res);
					this.$patch({
            ticketDetails: res.data,
          });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    async addOwnerSupportTicket(ownerSupportTicketData) {
      console.log("data", ownerSupportTicketData._value.address);
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
				await axios
          .post("https://cacheownerticketdata-qqntzlhyfq-uw.a.run.app", {
            id: this.recentlySubmittedTicketId,
            ownerTicketData: ownerSupportTicketData._value,
          })
          .then(() => {
            if (ownerSupportTicketData.image) {
              this.storeStorage.uploadTicketImage(
                ownerSupportTicketData.image,
								"Owner"
              );
            }
          })
          .then(this.router.push("/owner-project-list"))
          .catch((err) => {
            console.log(err);
          });
      }
    },
    async updateTicket(id, fullCheckListItems) {
      await setDoc(doc(db, "OwnerSupportTickets", id), fullCheckListItems, {
        merge: true,
      });
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
      };
    },
  },
});
