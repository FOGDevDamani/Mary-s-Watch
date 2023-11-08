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

export const useStoreSPCustomer = defineStore("storeSPCustomer", {
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
          "https://getspcustomerlistdatafromcache-qqntzlhyfq-uw.a.run.app",
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
          "https://getspcustomerdetaildatafromcache-qqntzlhyfq-uw.a.run.app",
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
    async addSPCustomer(spCustomerData, uid) {
      console.log("sp customer data", spCustomerData);

      const docRef = await addDoc(collection(db, "SPCustomers"), {
        profileImage: spCustomerData.image.name,
        customerType: spCustomerData.data._value.customerType,
        firstName: spCustomerData.data._value.firstName,
        lastName: spCustomerData.data._value.lastName,
        email: spCustomerData.data._value.email,
        address: spCustomerData.data._value.address,
        city: spCustomerData.data._value.city,
        state: spCustomerData.data._value.state,
        zipcode: spCustomerData.data._value.zipcode,
        cellPhone: spCustomerData.data._value.cellPhone,
        createdOn: Timestamp.now(),
        uid: uid,
      })

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
          .post("https://cachespcustomerdata-qqntzlhyfq-uw.a.run.app", {
            id: this.recentlySubmittedTicketId,
            spCustomerData: spCustomerData.data._value,
          })
          .then(() => {
            if (spCustomerData.image) {
              this.storeStorage.uploadCustomerProfileImage(
                spCustomerData.image,
                "SP"
              );
            }
          })
          .then(this.router.push("/sp-customers"))
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  getters: {
    getSPCustomerDetails: (state) => {
      return (id) => {
        return state.customers.filter((customer) => {
          return customer.id === id;
        })[0];
      };
    },
  },
});
