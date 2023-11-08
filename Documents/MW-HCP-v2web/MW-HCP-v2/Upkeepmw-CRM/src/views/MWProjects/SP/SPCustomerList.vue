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
			<div v-for="customer in customerList" :key="customer.id" class="col">
				<MWCustomerCard  :profileImage="customer.data.profileImage" :firstName="customer.data.firstName" :lastName="customer.data.lastName" :address="customer.data.address" :email="customer.data.email" :cellPhone="customer.data.cellPhone" route="SPCustomerProfile" :id="customer.id"></MWCustomerCard>
			</div>
			
		</div>
		
	</div>
</template>

<script setup>
import MWCustomerCard from '../../../components/Cards/MWCustomerCard.vue'
import AddCircleButton from '../../../components/Forms/AddCircleButton.vue'
import { onMounted } from 'vue'
import { useStoreSPCustomer } from '../../../stores/SP/storeSPCustomers'
import { useStoreUserInfo } from '../../../stores/storeUser'
	import axios from 'axios'
	import { storeToRefs } from 'pinia'

	const storeUser = useStoreUserInfo()
	const storeSPCustomer = useStoreSPCustomer()
	

	const { me: user } =  storeToRefs(storeUser)
	const { customers: customerList } =  storeToRefs(storeSPCustomer)

	onMounted(() => {
		const currentUID = user.value.uid
		storeSPCustomer.getCustomers(currentUID)
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