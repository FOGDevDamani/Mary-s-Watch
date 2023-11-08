<template>
	<div>
		<h2>My Assets</h2>
		<div class="row mt-5 pt-2">
			<div class="col-sm-8"></div>
			<div class="col-sm-4">
				<AddCircleButton route="/owner-add-a-asset"></AddCircleButton>
			</div>
		</div>

		<div class="ms-5 ps-1 mt-5 pt-2 row row-cols-sm-3 g-4">
			<div v-for="asset in storeOwnerAsset.assets" :key="asset.id" class="col">
				<MWAssetCard  :profileImage="asset.assetImage" :label1="asset.assetOwner" :label2="asset.address" :label3="asset.email" route="OwnerAssetProfile" :id="asset.id"></MWAssetCard>
			</div>
			
		</div>
		
	</div>
</template>

<script setup>
import MWAssetCard from '../../components/Cards/MWAssetCard.vue'
import AddCircleButton from '../../components/Forms/AddCircleButton.vue'
import { onMounted } from 'vue'

import { useStoreOwnerAsset } from '../../stores/Owner/storeOwnerAssets'


	/* 
		SP Team Store
	*/

	const storeOwnerAsset = useStoreOwnerAsset()

	onMounted(() => {
	
	})

</script>

<style scoped>
	@media only screen and (max-width: 576px) {
	.card-width {
		width: 500%;
	}
	.icon {
		position: relative;
		left: 150%;
	}
	.card-height {
		height: 40vh;
	}
}
</style>