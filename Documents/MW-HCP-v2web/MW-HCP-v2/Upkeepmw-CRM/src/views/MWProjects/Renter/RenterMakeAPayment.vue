<template>
	<div>
		<h2 class="register">Make A Payment</h2>

		<div>
			<form>
				<div class="row mt-4">
					<label for="" class="mb-2">Date:</label>
					<div class="col-lg-3 mt-1 col-sm-4">
						<MWFormLabelAndDatePicker v-model="makeAPaymentData.date" label="Name:" />
					</div>
				</div>
				
				<div class="col-5 col-sm-3 mt-3">
					<MWFormLabelAndInput v-model="makeAPaymentData.address" label="Address:" />
				</div>

				<div class="col-5 col-sm-3 mt-3">
					<MWFormLabelAndInput v-model="makeAPaymentData.amount" label="Amount:" />
				</div>

				<div class="col-5 col-sm-3 mt-3">
					<MWFormLabelAndInput v-model="makeAPaymentData.for" label="For:" />
				</div>

				<div class="mt-3">Options:</div>  
				<div class="col-lg-3 col-sm-8">
					<MWRadioInputWithMultipleOptions class="ms-3" v-for="option of paymentOptions" :key="option" v-model="makeAPaymentData.paymentOption"  :label2="option.label"  :option="option.value"/>
				</div>

				<div class="col-lg-2 col-sm-12 mt-3">
					Send Receipt:	<MWFormLabelAndSelect class="mt-2"  v-model="makeAPaymentData.sendReceipt" :options="sendReceipt"/>
				</div>
				<div class="row">
					<div class="col-6">
						<button class="btn btn-primary my-4" type="button">Cancel</button>
					</div>
					
					<div class="col-6">
						<button type="button" @click.prevent="makePayment" class="btn btn-primary my-4 button" data-bs-toggle="modal" data-bs-target="#exampleModal">Submit</button>
					</div>
				</div>
				
			</form>
		</div>

		<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-body" v-if="makeAPaymentData.for != ''">
						Your cash payment has been successfully sent to {{makeAPaymentData.for}} to be signed.
					</div>
					<div class="modal-footer">
						<button @click="routeToPayments" type="button" class="btn btn-primary" data-bs-dismiss="modal">Continue</button>
					</div>
				</div>
			</div>
		</div>
		<!-- <iframe
				src="https://esignatures.io/sign/1f9622d1-5e57-49cc-abb2-3b91ff6740c5"
				id="eSignaturesIOIframe"
				onload="iFrameResize({heightCalculationMethod: 'bodyScroll'}, '#eSignaturesIOIframe')"
				style="width: 1px;min-width: 100%;">
		</iframe> -->
		
		
	</div>
</template>

<script setup>

	import MWFormLabelAndInput from '../../../components/Forms/MWFormLabelAndInput.vue'
	import MWFormLabelAndSelect from '../../../components/Forms/MWFormLabelAndSelect.vue'
	import MWFormLabelAndDatePicker from '../../../components/Forms/MWFormLabelAndDatePicker.vue'
	import MWRadioInputWithMultipleOptions from '../../../components/Forms/MWRadioInputWithMultipleOptions.vue'
	import { useStoreRenterPayment } from '../../../stores/Renter/storeRenterPayments'
	import { ref, computed, reactive, onBeforeMount, onMounted, onUpdated } from 'vue'
	import { useRouter, useRoute } from 'vue-router'	
	import axios from 'axios'
	import { useStoreAuth } from '../../../stores/storeAuth'
	import { storeToRefs } from 'pinia'

	const storeAuth = useStoreAuth()

	const { userUID: uid} =  storeToRefs(storeAuth)


	const storeRenterPayment = useStoreRenterPayment()

	const router = useRouter()
	const route = useRoute()
	
	const makeAPaymentData = reactive({
		date: '',
		paymentOption: '',
		sendReceipt: '',
		amount: '',
		address: '',
		for: ''
	})

	const paymentOptions = ref([
		{ 
			value: "credit card ending", 
			label: "Credit Card Ending" 
		}, 
		{ 
			value: "checking account ending", 
			label: "Checking Account Ending"
		},
		{
			value: "new credit card",
			label: "New Credit Card"
		},
		{
			value: "new bank account", 
			label: "New Bank Account"
		},
		{
			value: "cash", 
			label: "Cash"
		},
		{
			value: "request an arrangement", 
			label: "Request An Arrangement"
		},
	])

	const sendReceipt = ref([
		{ 
			value: "yes", 
			label: "Yes" 
		}, 
		{ 
			value: "no", 
			label: "No"
		},
	])

	const paymentOptionRoute = ref("")

	const createRouteURL = (paymentOption) => {
		return addHyphens(paymentOption, " ")
	}

	const addHyphens = (stringToSplit, separator) => {
		const arrayOfStrings = stringToSplit.split(separator);
		paymentOptionRoute.value = arrayOfStrings.join("-")
	}
	
	const makePayment = () => {
		storeRenterPayment.addPayment(makeAPaymentData, uid.value)
		.then( () => {
			if(makeAPaymentData.paymentOption == "cash") {
				axios
				.post('http://localhost:4041/create-template', makeAPaymentData.amount)
				.catch((error) => console.log('error', error))
			}
		})
	}

	const transferMoney = () => {
		axios
		.get('http://localhost:4041/send-to-funding-source')
		.catch((error) => console.log('error', error))
		
	}

	onUpdated(() => {
		createRouteURL(makeAPaymentData.paymentOption)
		console.log('this is the route for the next page', paymentOptionRoute.value)
	})

	const routeToPayments = () => {
		router.push('/owner-payments')
	}

</script>

<style scoped>

</style>