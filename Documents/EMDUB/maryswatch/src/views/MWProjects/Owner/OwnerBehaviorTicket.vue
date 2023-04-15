<template>
	<div>
		<h2 class="register">Add a Behvior Ticket</h2>

		<div>
			<form>
				<div class="row mt-4">
					<div>
						Address:
					</div>

					<div class="mt-2 col-lg-5 col-sm-8">
						<MWFormLabelAndSelect v-model="ownerBehaviorTicketData.address" :options="storeOwnerAsset.assets" />
					</div>
				</div>

				<div class="row mt-4">
					<div class="col-lg-5 col-sm-8 mr-3">
						<MWFormLabelAndTextArea v-model="ownerBehaviorTicketData.description" label="Description:" placeholder="Enter description here" />
					</div>
				</div>

				<div class="col-5 col-sm-3 mt-3">
					<MWFormLabelAndInput v-model="ownerBehaviorTicketData.name" label="Name:" />
				</div>


				<div class="row">
					<div class="col-6">
						<button class="btn btn-primary my-3" type="button">Cancel</button>
					</div>
				
					<div class="col-6">
						<button type="button" @click.prevent="addOwnerSupportTicket" class="btn btn-primary my-3 button">Submit</button>
					</div>
				</div>
				
			</form>
		</div>
		
		
	</div>
</template>

<script setup>

	import MWFormLabelAndInput from '../../../components/Forms/MWFormLabelAndInput.vue'
	import MWFormLabelAndTextArea from '../../../components/Forms/MWFormLabelAndTextArea.vue'
	import MWFormLabelAndSelect from '../../../components/Forms/MWFormLabelAndSelect.vue'
	import { ref, computed, reactive, onBeforeMount, onMounted } from 'vue'
	import { useRouter, useRoute } from 'vue-router'
	import { useStoreOwnerAsset } from '../../../stores/Owner/storeOwnerAssets'
	import { useStoreOwnerBehaviorTicket } from '../../../stores/Owner/storeOwnerBehaviorTicket'
	import { useStoreUserInfo } from '../../../stores/storeUser'
	import { storeToRefs } from 'pinia'
	

	/* 
		Owner Team, Asset and Support Ticket Store
	*/

	const storeOwnerAsset = useStoreOwnerAsset()
	const storeUser = useStoreUserInfo()
	const storeOwnerBehaviorTicket = useStoreOwnerBehaviorTicket()



	const router = useRouter()
	const route = useRoute()
	
	const ownerBehaviorTicketData = reactive({
		address: '',
		name: '',
		description: '',
		createdOn: new Date()
	})

	onMounted(() => {
		storeOwnerAsset.getAssets()
		storeUser.getUser()
	})

	const addOwnerSupportTicket = () => {
		storeOwnerBehaviorTicket.addOwnerBehaviorTicket(ownerBehaviorTicketData)
		.then(router.push('/owner-ticket-add-funding-source'))
	}

	
</script>

<style  scoped>
	
</style>