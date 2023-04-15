<template>
	<div class="container">
		<h2 class="register">Add A Customer</h2>

		<form>
			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndFileInput v-model="state.profileImage" label="Upload Customer Profile Image" />					
				</div>
			</div>

			<div class="row mt-4">
				<div>
					Customer Type:
				</div>

				<div class="col-lg-5 col-sm-12 mt-2">
					<MWFormLabelAndSelect v-model="state.customerType" :options="customerTypes" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="state.firstName" label="First Name:" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="state.lastName" label="Last Name:" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="state.email" label="Email:" />
				</div>
			</div>

			<div class="mt-4">
				<hr class="solid" />
			</div>

			<div class="row mt-4">
				<div class="col-lg-7 col-sm-12">
					<MWFormLabelAndInput v-model="state.address" label="Address" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="state.city" label="City" />
				</div>

				<div class="col-lg-5 col-sm-12 ml-3">
					<MWFormLabelAndInput v-model="state.state" label="State" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput  v-model="state.zipcode" label="Zipcode" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="state.cellPhone" label="Cell Phone:" />
				</div>
			</div>

			<button type="button" @click.prevent="addOwnerCustomer" class="btn btn-primary my-5 button">Add Customer</button>
		</form>
	</div>
</template>

<script setup>
	import MWFormLabelAndInput from '../../../components/Forms/MWFormLabelAndInput.vue'
	import MWFormLabelAndFileInput from '../../../components/Forms/MWFormLabelAndFileInput.vue'
	import MWFormLabelAndSelect from '../../../components/Forms/MWFormLabelAndSelect.vue'
	import { ref, computed, reactive} from 'vue'
	import { useStorage } from '@vueuse/core'
	import { useStoreOwnerCustomer} from '../../../stores/Owner/storeOwnerCustomers'


	/* 
		Owner Team Store
	*/

	const storeOwnerCustomer = useStoreOwnerCustomer()

	/* 
	Owner Team Data
	*/

	const ownerCustomerData = reactive({
		profileImage: null,
		customerType: '',
		firstName: '',
		lastName: '',
		email: '',
		address: '',
		city: '',
		state: '',
		zipcode: '',
		cellPhone: '',
		createdOn: new Date()
	})

	const state = useStorage('customerState', ownerCustomerData)

	const currentState = localStorage.getItem('customerState')

	const customerTypes = ref([
		{ 
			value: "single-family", 
			label: "Single_Family" 
		}, 
		{ 
			value: "condo", 
			label: "Condo"
		},
		{
			value: "multi-family",
			label: "Multi-Family"
		},
		{
			value: "mobile home", 
			label: "Mobile Home"
		},
		{
			value: "commercial", 
			label: "Commercial"
		}
	])
	
	/*
		Add owner customer
	*/
	const addOwnerCustomer = () => {
		if(ownerCustomerData) {
			storeOwnerCustomer.addOwnerCustomer(state)
		}
	}

</script>

<style scoped>

</style>