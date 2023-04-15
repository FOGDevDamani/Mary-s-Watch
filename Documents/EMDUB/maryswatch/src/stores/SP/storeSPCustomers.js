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

export const useStoreSPCustomer = defineStore("storeSPCustomer", {
  state: () => {
    return {
      user: {},
      customers: [],
      storeAuth: useStoreAuth(),
      storeStorage: useStoreStorage(),
    };
  },
  persist: true,
  actions: {
    init() {},
    async getCustomers() {
      const q = query(
        collection(db, "SPCustomers")
        // where("uid", "==", this.storeAuth.user.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
				let tempArr = []
        let customer = {
          id: doc.id,
          profileImage: doc.data().customerProfileImage,
          customerType: doc.data().customerType,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          email: doc.data().email,
          address: doc.data().address,
          city: doc.data().city,
          state: doc.data().state,
          zipcode: doc.data().zipcode,
          cellPhone: doc.data().cellPhone,
          createdOn: doc.data().createdOn,
        };
        tempArr.push(customer);
				this.$patch((state) => {
          state.customers.push(customer);
        });
      });
    },
		clearCustomers() {
			this.customers = []
		},
    async addSPCustomer(spCustomerData) {
      console.log("sp customer data", spCustomerData);

      await addDoc(collection(db, "SPCustomers"), {
        profileImage: spCustomerData._value.profileImage.name,
        customerType: spCustomerData._value.customerType,
        firstName: spCustomerData._value.firstName,
        lastName: spCustomerData._value.lastName,
        email: spCustomerData._value.email,
        address: spCustomerData._value.address,
        city: spCustomerData._value.city,
        state: spCustomerData._value.state,
        zipcode: spCustomerData._value.zipcode,
        cellPhone: spCustomerData._value.cellPhone,
        createdOn: Timestamp.now(),
        uid: this.storeAuth.user.uid,
      })
        .then(() => {
          this.storeStorage.uploadProfileImage(
            spCustomerData._value.profileImage
          );
        })
        .then(this.router.push("/sp-customers"));
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
