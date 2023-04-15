<template>
	<div>
		<h2>My Customers</h2>
		<div class="row mt-5 pt-2">
			<div class="col-sm-8"></div>
			<div class="col-sm-4">
				<AddCircleButton route="/sp-add-a-customer"></AddCircleButton>
			</div>
		</div>

		<div class="ms-5 ps-1 mt-5 pt-2 row row-cols-sm-3 g-4">
			<div v-for="customer in storeSPCustomer.customers" :key="customer.id" class="col">
				<MWCustomerCard  :profileImage="customer.profileImage" :firstName="customer.firstName" :lastName="customer.lastName" :address="customer.address" :email="customer.email" :cellPhone="customer.cellPhone" route="SPCustomerProfile" :id="customer.id"></MWCustomerCard>
			</div>
			
		</div>
		
	</div>
</template>

<script setup>
import MWCustomerCard from '../../../components/Cards/MWCustomerCard.vue'
import AddCircleButton from '../../../components/Forms/AddCircleButton.vue'
import { onMounted } from 'vue'
import { useStoreSPCustomer } from '../../../stores/SP/storeSPCustomers'


	/* 
		SP Team Store
	*/

	const storeSPCustomer = useStoreSPCustomer()

	onMounted(() => {
	storeSPCustomer.getCustomers()
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