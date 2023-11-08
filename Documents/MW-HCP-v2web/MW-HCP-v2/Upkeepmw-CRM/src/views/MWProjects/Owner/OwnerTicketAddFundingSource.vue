<template>
	<div>
		<div v-if="fundingSources.length > 0">
				<div class="row row-cols-sm-2 row-cols-lg-3 g-4" v-for="fundingSource in fundingSources" :key="fundingSource">
					<div class="col">
						<MWAddFundingSourceCheckbox class="mb-4" v-model="fundingSourceData.names"  :label="{name: fundingSource.name, bankAccountType: fundingSource.bankAccountType, id: fundingSource.id}" :balance="accountBalance"  :option="fundingSource"></MWAddFundingSourceCheckbox>
					</div>	
				</div>
		</div>
		<div class="row">
			<div class="col-6">
				<button class="btn btn-primary my-3" type="button">Skip</button>
			</div>
			<!-- <div>
				<button @click.prevent="retrieveCustomer">get funding source</button>
			</div> -->
			<div class="col-6">
				<button type="button" @click.prevent="updateTicket" class="btn btn-primary my-3 button">Continue to Summary</button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import MWFormLabelAndInput from '../../../components/Forms/MWFormLabelAndInput.vue'
	import MWFormLabelAndSelect from '../../../components/Forms/MWFormLabelAndSelect.vue'
	import MWAddFundingSourceCheckbox from '../../../components/Forms/MWAddFundingSourceCheckbox.vue'
	import MWFormLabelAndDatePicker from '../../../components/Forms/MWFormLabelAndDatePicker.vue'
	import MWFormLabelAndTimePicker from '../../../components/Forms/MWFormAndLabelTimePicker.vue'
	import MWFormLabelAndRadioInput from '../../../components/Forms/MWFormLabelAndRadioInput.vue'
	import MWFormLabelAndCheckbox from '../../../components/Forms/MWFormLabelAndCheckbox.vue'
	import MWFormTable from '../../../components/Forms/MWFormTable.vue'
	import { ref, onBeforeMount, onMounted, reactive } from 'vue'
	import { useStorage } from '@vueuse/core'
	import { useRouter, useRoute } from 'vue-router'
	import { useStoreOwnerTeamTeamMember } from '../../../stores/Owner/storeOwnerTeamTeamMembers'
	import { useStoreOwnerSupportTicket } from '../../../stores/Owner/storeOwnerSupportTickets'
	import { useStoreUserInfo } from '../../../stores/storeUser'
	import axios from 'axios'
	import { storeToRefs } from 'pinia'

	const storeUser = useStoreUserInfo()
	const storeOwnerSupportTicket = useStoreOwnerSupportTicket()
	const router = useRouter()

	const { me: user } = storeToRefs(storeUser) 
	const { recentlySubmittedTicketId: docId, tickets: project, getOwnerSupportTicketDetails: ticket } =  storeToRefs(useStoreOwnerSupportTicket())

	const { listenForTickets } = storeOwnerSupportTicket
	
	const fundingSources = ref([])
	const accountBalance = ref('')

	const documentId = useStorage('docId', docId.value)

	onBeforeMount(() => {
		retrieveCustomer()
	})

	onMounted(() => {
		listenForTickets()
	
	})

	const fundingSourceData = reactive({
		names: [],
	})

	const retrieveCustomer = () => {
		axios.post('http://localhost:4041/retrieve-customer-accounts', user.value.dwollaAccountName)
		.then((res) => {
			fundingSources.value = res.data
		})
		.then(() => {
			retrieveFundingSourceBalance()
		})
		.catch((error) => console.log('error', error))
	}

	const retrieveFundingSourceBalance = () => {
		if (fundingSources.value.length > 0) {
			const links = fundingSources.value.map(fundingSource => fundingSource._links.self.href)
			axios.post('http://localhost:4041/retrieve-funding-source-balances', links)
			.then((res) => {
				console.log("balances", res.data)
				accountBalance.value = res.data
				console.log(accountBalance)
			})
			.catch((error) => console.log('error', error))
		}
	}

	const updateTicket = () => {
		const fullCheckListItems = {
			fundingSources: fundingSourceData
		}
		storeOwnerSupportTicket.updateTicket(storeOwnerSupportTicket.recentlySubmittedTicketId,fullCheckListItems)
		.then(router.push('/owner-ticket-summary'))
	}
</script>

<style scoped>

</style>