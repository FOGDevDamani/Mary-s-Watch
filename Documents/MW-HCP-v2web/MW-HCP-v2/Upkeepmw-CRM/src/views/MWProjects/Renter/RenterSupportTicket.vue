<template>
	<div>
		<h2 class="register">Renter Support Ticket</h2>

		<form>
			<div class="row mt-4">
				<div class="col-lg-5 col-sm-8 mr-3">
					<MWFormLabelAndFileInput v-model="renterSupportTicketData.ticketImage" label="Upload Image" />
					
				</div>
			</div>

			<div class="row mt-4">
				<div>
					Priority:
				</div>

				<div class="col-lg-5 col-sm-8">
					<MWFormLabelAndSelect v-model="state.priority" label="Priority:" :options="priorityTypes"/>
					
				</div>
			</div>

			<div class="row mt-4">
				<div>
					Address:
				</div>

				<div class="col-lg-5 col-sm-8">
					<MWFormLabelAndSelect v-model="state.address" label="Address:" />
					
				</div>
			</div>

			<div class="row mt-4">
				<div>
					Previously Reported:
				</div>

				<div class="col-lg-5 col-sm-8">
					<MWFormLabelAndSelect v-model="state.previouslyReported" label="Previously Reported:" :options="yesOrNoTypes" />
					
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-8 mr-3">
					<MWFormLabelAndInput v-model="state.room" label="Room:" />
					
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-8 mr-3">
					<MWFormLabelAndTextArea v-model="state.problemDescription" label="Problem Description:" placeholder="Enter description here" />
					
				</div>
			</div>

			<div class="row mt-4">
				<label for="" class="mb-2"> Preferred Date And Time</label>
				<div class="col-lg-3 mb-3 col-sm-4">
					<MWFormLabelAndDatePicker v-model="renterSupportTicketData.date" label="Preferred Date and Time:" />
					
				</div>
				<div class="col-sm-1"></div>
				<div class="col-lg-3 col-sm-4">
					<MWFormLabelAndTimePicker v-model="renterSupportTicketData.time" />
				
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5">
					<MWFormLabelAndRadioInput v-model="state.petsAllowed" label="Pets:" id="1"  :options="yesOrNoTypes" />
					
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-11">
					<MWFormLabelAndRadioInput v-model="state.entryAllowedIfAbsent" label="Do you authorize entry into your unity to perform the maintenance or repairs above in your absence?" id="3" :options="yesOrNoTypes" />
		
				</div>
			</div>

			<div class="col-lg-5 col-sm-8 mt-3">
				<MWFormLabelAndInput v-model="state.contactNumber" label="Preferred Contact Number:" />
			
			</div>

			<div class="row">
				<div class="col-6">
					<button class="btn btn-primary my-3" type="button">Cancel</button>
				</div>
				<div class="col-6">
					<button type="button" @click.prevent="addRenterSupportTicket" class="btn btn-primary my-3 button">Submit</button>
				</div>
			</div>
			
		</form>
	</div>
</template>

<script setup>

	import MWFormLabelAndInput from '../../../components/Forms/MWFormLabelAndInput.vue'
	import MWFormLabelAndSelect from '../../../components/Forms/MWFormLabelAndSelect.vue'
	import MWFormLabelAndFileInput from '../../../components/Forms/MWFormLabelAndFileInput.vue'
	import MWFormLabelAndDatePicker from '../../../components/Forms/MWFormLabelAndDatePicker.vue'
	import MWFormLabelAndTimePicker from '../../../components/Forms/MWFormAndLabelTimePicker.vue'
	import MWFormLabelAndTextArea from '../../../components/Forms/MWFormLabelAndTextArea.vue'
	import MWFormLabelAndRadioInput from '../../../components/Forms/MWFormLabelAndRadioInput.vue'
	import MWFormLabelAndCheckboxWith3OrMoreOptions from '../../../components/Forms/MWFormLabelAndCheckboxWith3OrMoreOptions.vue'
	import MWFormLabelAndCheckboxWith2Options from '../../../components/Forms/MWFormLabelAndCheckboxWith2Options.vue'
	import MWFormLabelAndCheckbox from '../../../components/Forms/MWFormLabelAndCheckbox.vue'
	import DwollaAddBeneficialOwners from '../../../components/Forms/DwollaAddBeneficialOwners.vue'
	import { ref, computed, reactive} from 'vue'
	import { useStorage } from '@vueuse/core'
	import { useStoreRenterSupportTicket} from '../../../stores/Renter/storeRenterSupportTickets'
	import { storeToRefs } from 'pinia'
	import { useStoreUserInfo } from '../../../stores/storeUser'

	const storeUser = useStoreUserInfo()

	const { me: user } =  storeToRefs(storeUser)

	/* 
		Owner Team Store
	*/

	const storeRenterSupportTicket = useStoreRenterSupportTicket()
	
	const renterSupportTicketData = reactive({
		ticketImage: null,
		priority: '',
		previouslyReported: '',
		customerSatisfied: false,
		address: '',
		room: '',
		problemDescription: '',
		date: '',
		time: '',
		petsAllowed: '',
		entryAllowedIfAbsent: '',
		contactNumber: '',
		ongoing: true,
		completed: false,
		createdOn: new Date()
	})

	const state = useStorage('renterTicketState', renterSupportTicketData)

	const currentState = localStorage.getItem('renterTicketState')

	const yesOrNoTypes = ref([
		{ 
			value: "yes", 
			label: "Yes" 
		}, 
		{ 
			value: "no", 
			label: "No"
		},
	])

	const priorityTypes = ref([
		{ 
			value: "low", 
			label: "Low" 
		}, 
		{ 
			value: "medium", 
			label: "Medium"
		},
		{ 
			value: "high", 
			label: "High"
		},
	])

	const addRenterSupportTicket = () => {
		if(state) {
			const renterTicket = {
				data: state,
				image: renterSupportTicketData.ticketImage,
				date: renterSupportTicketData.date,
				time: renterSupportTicketData.time
			}
			storeRenterSupportTicket.addRenterSupportTicket(renterTicket, user.value.uid)
		}
	}

	

</script>

<style  scoped>

</style>