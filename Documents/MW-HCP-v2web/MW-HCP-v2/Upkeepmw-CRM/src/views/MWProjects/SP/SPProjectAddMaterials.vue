<template>
	<b-container>
		<div class="row">
			<div class="col">
				<h3 class="maintsum my-5">Materials</h3>
			</div>
		</div>

		<div class="row">
			<div class="col">
				<h3 class="maintsum my-4">Create Materials List</h3>
			</div>
		</div>


		<div class="row">
			<div class="col-12">
				<MWFormMaterialsTable v-model="state.materials" />
			</div>
		</div>
		<div class="row">
			<div class="col">
				<h3 class="maintsum mb-4">Total Estimated Materials: {{calculateTotal()}}</h3>
			</div>
		</div>

		<div class="row">
			<div class="col-6">
				<button class="btn btn-primary my-3" type="button">Cancel</button>
			</div>
			<!-- <div>
				<button @click.prevent="retrieveCustomer">get funding source</button>
			</div> -->
			<div class="col-6">
				<button type="button" @click.prevent="updateTicket" class="btn btn-primary my-3 button">Continue</button>
			</div>
		</div>

	</b-container>
</template>

<script setup>
	import MWFormMaterialsTable from '../../../components/Forms/MWFormMaterialsTable.vue'
	import { ref, computed, reactive, onBeforeMount, onMounted } from 'vue'
	import { useStorage } from '@vueuse/core'
	import { useRouter, useRoute } from 'vue-router'
	import { useStoreSPEstimate } from '../../../stores/SP/storeSPEstimates'
	import { useStoreSPTeam } from '../../../stores/SP/storeSPTeams'
	import { useStoreSPTeamTeamMember } from '../../../stores/SP/storeSPTeamTeamMembers'
	import { useStoreOwnerAsset } from '../../../stores/Owner/storeOwnerAssets'
	import { useStoreUserInfo } from '../../../stores/storeUser'
	import { storeToRefs } from 'pinia'

	const storeSPEstimate = useStoreSPEstimate()
	const storeSPTeam = useStoreSPTeam()
	const storeSPTeamTeamMember = useStoreSPTeamTeamMember()
	const storeOwnerAsset = useStoreOwnerAsset()
	const storeUser = useStoreUserInfo()

	const router = useRouter()
	const route = useRoute()

	const materialsTotal = ref(0)
	
	const spSupportTicketMaterialsData = reactive({
		materials: [],
	})

	const state = useStorage('spSupportTicketMaterialsState', spSupportTicketMaterialsData)

	const currentState = localStorage.getItem('spSupportTicketMaterialsState')
	
	const { listenForTickets } = storeSPEstimate

	onMounted(() => {
		listenForTickets()
	})

	const { recentlySubmittedTicketId: docId, } =  storeToRefs(storeSPEstimate)

	
	
	const calculateTotal = () => {
		if(spSupportTicketMaterialsData.materials.length > 0) {
			const number = spSupportTicketMaterialsData.materials.map(r => {
				if(r.quantity == null && r.amount == null) {
					return 0
				} else {
					const float = r.quantity * r.amount
					return parseFloat(float)
				}
			});
			
			const sum = number.reduce( ( previousValue, currentValue ) => previousValue + currentValue, 0)
			const total = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', currencySign: 'accounting'}).format(sum);
			if(total !== NaN) {
				materialsTotal.value = total
			}
			
			return total
		}
	}

	const updateTicket = () => {
		const fullMaterialsData = {
			checklistItems: storeSPEstimate.getSPSupportTicketDetail.checklistItems,
			materials: spSupportTicketMaterialsData.materials,
			materialsEstimateTotal: materialsTotal.value
		}
		storeSPEstimate.updateTicket(docId.value, fullMaterialsData)
		.then(router.push('/sp-project-summary'))
	}
</script>

<style scoped>
	.down {
		position: relative;
		bottom: 5%
	}
	.text {
		color: white !important;
		position: relative;
		left: 70%;
	}
	.total {
		position: relative;
		left: 75%
	}
</style>