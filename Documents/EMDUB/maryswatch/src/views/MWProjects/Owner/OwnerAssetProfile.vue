<template>
	<div>
		<div class="row">
			<div class="col-lg-4 col-sm-4">
				<img :src="assetInformation.assetImage" class="img-thumbnail avatar" alt="...">
			</div>

			<div class="col-lg-0 col-sm-5">
					<h1>
						{{assetInformation.assetOwner}}
					</h1>

					<p class="mt-4">
						{{ assetInformation.email}}/{{assetInformation.phone}}
					</p>

					<p class="mt-4">
						{{assetInformation.address}} {{assetInformation.city}} {{assetInformation.state}}, {{assetInformation.zipcode}}, {{assetInformation.county}}
					</p>

					<p class="mt-4">
						
					</p>
			</div>
			
		</div>
	</div>
</template>

<script setup>
import { ref, computed, reactive} from 'vue'

import { useStoreOwnerAsset } from '../../../stores/Owner/storeOwnerAssets'

 const props = defineProps({
	id: {
		type: String,
		required: true
	}
 })
 
	/* 
		SP Team Store
	*/

	const storeOwnerAsset = useStoreOwnerAsset()


const assetInformation = ref({})


assetInformation.value = storeOwnerAsset.getOwnerAssetDetails(props.id)

 
</script>

<style scoped>
.avatar {
	vertical-align: middle;
	width: 300px;
	height: 300px;
	border-radius: 50%;
}
.down {
	position: relative;
	top: 17%;
}
</style>