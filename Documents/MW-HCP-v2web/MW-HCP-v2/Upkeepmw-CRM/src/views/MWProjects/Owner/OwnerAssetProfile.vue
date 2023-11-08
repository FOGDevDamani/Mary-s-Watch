<template>
	<div>
		<div class="row">
			<div class="col-lg-4 col-sm-4">
				<img :src="asset.assetImage" class="img-thumbnail avatar" alt="...">
			</div>

			<div class="col-lg-0 col-sm-5">
					<h1>
						{{asset.assetOwner}}
					</h1>

					<p class="mt-4">
						{{ asset.email}}/{{asset.phone}}
					</p>

					<p class="mt-4">
						{{asset.address}} {{asset.city}} {{asset.state}}, {{asset.zipcode}}, {{asset.county}}
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
	import { storeToRefs } from 'pinia'
	import { onMounted, onBeforeUpdate } from 'vue'

	const props = defineProps({
		id: {
			type: String,
			required: true
		},
		assetName: String
	})
	
	const storeOwnerAsset = useStoreOwnerAsset()

	const { assetDetail: asset, assets: location } =  storeToRefs(storeOwnerAsset)

	onMounted(() => {
		console.log(props.id, props.assetName)
		storeOwnerAsset.getAssetDetails(props.id)
	})

 
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