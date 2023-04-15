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

export const useStoreOwnerCustomer = defineStore("storeOwnerCustomer", {
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
        collection(db, "OwnerCustomers")
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
    async addOwnerCustomer(ownerCustomerData) {
      console.log("owner customer data", ownerCustomerData);

      await addDoc(collection(db, "OwnerCustomers"), {
        profileImage: ownerCustomerData._value.profileImage.name,
        customerType: ownerCustomerData._value.customerType,
        firstName: ownerCustomerData._value.firstName,
        lastName: ownerCustomerData._value.lastName,
        email: ownerCustomerData._value.email,
        address: ownerCustomerData._value.address,
        city: ownerCustomerData._value.city,
        state: ownerCustomerData._value.state,
        zipcode: ownerCustomerData._value.zipcode,
        cellPhone: ownerCustomerData._value.cellPhone,
        createdOn: Timestamp.now(),
        uid: this.storeAuth.user.uid,
      })
        .then(() => {
          this.storeStorage.uploadProfileImage(ownerCustomerData.profileImage);
        })
        .then(this.router.push("/owner-customers"));
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
