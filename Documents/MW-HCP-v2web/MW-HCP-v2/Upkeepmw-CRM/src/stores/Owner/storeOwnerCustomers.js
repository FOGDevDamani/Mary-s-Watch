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

export const useStoreOwnerCustomer = defineStore("storeOwnerCustomer", {
  state: () => {
    return {
      user: {},
      customers: [],
			customerDetails: {},
      storeAuth: useStoreAuth(),
      storeStorage: useStoreStorage(),
      recentlySubmittedTicketId: useStorage("recentDocId", ""),
    };
  },
  persist: true,
  actions: {
    init() {},
    async getCustomers(currentUID) {
      console.log(currentUID);
      await axios
        .post(
          "https://getownercustomerlistdatafromcache-qqntzlhyfq-uw.a.run.app",
          { currentUID: currentUID }
        )
        .then((res) => {
          console.log("res", res);
          this.$patch({
            customers: res.data,
          });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    async getCustomerDetails(docId) {
      await axios
        .post(
          "https://getownercustomerdetaildatafromcache-qqntzlhyfq-uw.a.run.app",
          { id: docId }
        )
        .then((res) => {
          console.log("res", res);
          this.$patch({ customerDetails: res.data });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    clearCustomers() {
      this.customers = [];
      localStorage.clear();
    },
    async addOwnerCustomer(ownerCustomerData, uid) {
      console.log("owner customer data", ownerCustomerData);

      const docRef = await addDoc(collection(db, "OwnerCustomers"), {
        profileImage: ownerCustomerData.image.name,
        customerType: ownerCustomerData.data._value.customerType,
        firstName: ownerCustomerData.data._value.firstName,
        lastName: ownerCustomerData.data._value.lastName,
        email: ownerCustomerData.data._value.email,
        address: ownerCustomerData.data._value.address,
        city: ownerCustomerData.data._value.city,
        state: ownerCustomerData.data._value.state,
        zipcode: ownerCustomerData.data._value.zipcode,
        cellPhone: ownerCustomerData.data._value.cellPhone,
        createdOn: Timestamp.now(),
        uid: uid,
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
          .post(
            "https://adddocidtoownercustomerprofile-qqntzlhyfq-uw.a.run.app",
            {
              docId: this.recentlySubmittedTicketId,
              firstName: ownerCustomerData.data._value.firstName,
							lastName: ownerCustomerData.data._value.lastName
            }
          )
          .then(async () => {
            await axios.post(
              "https://cacheownercustomerdata-qqntzlhyfq-uw.a.run.app",
              {
                id: this.recentlySubmittedTicketId,
                owneCustomerData: ownerCustomerData.data._value,
              }
            );
          })
          .then(() => {
            if (ownerCustomerData.image) {
              this.storeStorage.uploadCustomerProfileImage(
                ownerCustomerData.image,
                uid,
                "Owner",
                "owner"
              );
            }
          })
          .then(this.router.push("/owner-customers"))
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  getters: {
    getOwnerCustomerDetails: (state) => {
      return (id) => {
        return state.customers.filter((customer) => {
          return customer.id === id;
        })[0];
      };
    },
  },
});
