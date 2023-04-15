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
import { useStoreUserInfo } from "../storeUser";
import { useStoreStorage } from "../Storage/storeStorage";

export const useStoreOwnerAsset = defineStore("storeOwnerAsset", {
  state: () => {
    return {
      user: {},
      assets: [],
      storeAuth: useStoreAuth(),
      storeUser: useStoreUserInfo(),
      storeStorage: useStoreStorage(),
    };
  },
	persist: true,
  actions: {
    init() {},
    async getAssets() {
      const q = query(
        collection(db, "Assets"),
        // where("uid", "==", this.storeAuth.user.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
				let tempArr = []
        let asset = {
          id: doc.id,
          assetImage: doc.data().assetImage,
          typeOfProperty: doc.data().typeOfProperty,
          petsAccepted: doc.data().petsAccepted,
          parkingLocation: doc.data().parkingLocation,
          email: doc.data().email,
          address: doc.data().address,
          city: doc.data().city,
          state: doc.data().state,
          zipcode: doc.data().zipcode,
					forSale: doc.data().forSale,
					teams: doc.data().teams,
					isShortTerm: doc.data().isShortTerm,
					typeOfShortTerm: doc.data().typeOfShortTerm,
					uid: doc.data().uid,
          phone: doc.data().phone,
          createdOn: doc.data().createdOn,
					assetOwner: doc.data().assetOwner
        };
				tempArr.push(asset)
				this.$patch((state) => {
          state.assets.push(asset);
        });
      });
    },
		clearAssets() {
			this.assets = []
		},
    async addOwnerAsset(ownerAssetData) {
      console.log("owner asset data", ownerAssetData);

			for(const team of ownerAssetData.teams) {
				console.log('from the selected teams', team)
			}

      await addDoc(collection(db, "Assets"), {
        assetImage: ownerAssetData._value.assetImage.name,
        typeOfProperty: ownerAssetData._value.typeOfProperty,
        petsAccepted: ownerAssetData._value.petsAccepted,
        parkingLocation: ownerAssetData._value.parkingLocation,
        email: ownerAssetData._value.email,
        address: ownerAssetData._value.address,
        city: ownerAssetData._value.city,
        state: ownerAssetData._value.state,
        zipcode: ownerAssetData._value.zipcode,
        typeOfShortTerm: ownerAssetData._value.typeOfShortTerm,
        phone: ownerAssetData._value.phone,
        createdOn: Timestamp.now(),
        forSale: ownerAssetData._value.forSale,
        teams: ownerAssetData._value.teams,
        isShortTerm: ownerAssetData._value.isShortTerm,
        uid: this.storeAuth.user.uid,
        assetOwner: this.storeUser.fullName,
      })
        .then(() => {
          this.storeStorage.uploadProfileImage(
            ownerAssetData._value.profileImage
          );
        })
        .then(this.router.push("/owner-assets"));
    },
  },
  getters: {
    getOwnerAssetDetails: (state) => {
      return (id) => {
        return state.assets.filter((asset) => {
          return asset.id === id;
        })[0];
      };
    },
  },
});
