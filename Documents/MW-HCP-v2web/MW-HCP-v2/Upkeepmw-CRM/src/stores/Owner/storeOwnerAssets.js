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
import { useStoreUserInfo } from "../storeUser";
import { useStoreStorage } from "../Storage/storeStorage";
import axios from "axios";

export const useStoreOwnerAsset = defineStore("storeOwnerAsset", {
  state: () => {
    return {
      assets: [],
			assetDetail: {},
      storeAuth: useStoreAuth(),
      storeUser: useStoreUserInfo(),
      storeStorage: useStoreStorage(),
      recentlySubmittedTicketId: useStorage("recentDocId", ""),
    };
  },
  persist: true,
  actions: {
    init() {},
    async getAssets(currentUID) {
      console.log(currentUID);
      await axios
        .post(
          "https://getownerassetlistdatafromcache-qqntzlhyfq-uw.a.run.app",
          { currentUID: currentUID }
        )
        .then((res) => {
          console.log("res", res);
          this.$patch({ assets: res.data });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    async getAssetDetails(docId) {
      await axios
        .post(
          "https://getownerassetdetaildatafromcache-qqntzlhyfq-uw.a.run.app",
          { id: docId }
        )
        .then((res) => {
          console.log("res", res);
          this.$patch({ assetDetail: res.data });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    clearAssets() {
      this.assets = [];
      localStorage.clear();
    },
    async addOwnerAsset(ownerAssetData, uid) {
      console.log("owner asset data", ownerAssetData);

      for (const team of ownerAssetData._value.teams) {
        console.log("from the selected teams", team);
      }

      const docRef = await addDoc(collection(db, "Assets"), {
        assetImage: ownerAssetData.image.name,
        typeOfProperty: ownerAssetData.data._value.typeOfProperty,
        petsAccepted: ownerAssetData.data._value.petsAccepted,
        parkingLocation: ownerAssetData.data._value.parkingLocation,
        email: ownerAssetData.data._value.email,
        address: ownerAssetData.data._value.address,
        city: ownerAssetData.data._value.city,
        state: ownerAssetData.data._value.state,
        zipcode: ownerAssetData.data._value.zipcode,
        typeOfShortTerm: ownerAssetData.data._value.typeOfShortTerm,
        phone: ownerAssetData.data._value.phone,
        createdOn: Timestamp.now(),
        forSale: ownerAssetData.data._value.forSale,
        teams: ownerAssetData.data._value.teams,
        isShortTerm: ownerAssetData.data._value.isShortTerm,
        assetOwnerID: uid,
        assetOwner: this.storeUser.fullName,
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
          .post("https://adddocidtoownerassetprofile-qqntzlhyfq-uw.a.run.app", {
            docId: this.recentlySubmittedTicketId,
            assetOwner: ownerAssetData.data._value.assetOwner,
          })
          .then(async () => {
            await axios.post(
              "https://cacheownerassetdata-qqntzlhyfq-uw.a.run.app",
              {
                id: this.recentlySubmittedTicketId,
                ownerAssetData: ownerAssetData.data._value,
              }
            );
          })
          .then(() => {
            if (ownerAssetData.image) {
              this.storeStorage.uploadAssetProfileImage(
                ownerAssetData.image,
                uid,
                "Owner",
                "owner"
              );
            }
          })
          .then(this.router.push("/owner-assets"))
          .catch((err) => {
            console.log(err);
          });
      }
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
