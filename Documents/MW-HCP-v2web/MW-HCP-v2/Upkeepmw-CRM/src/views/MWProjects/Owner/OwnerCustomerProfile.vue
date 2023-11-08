<template>
	<div>
		<div class="row">
			<div class="col-lg-4 col-sm-4">
				<img :src="customer.profileImage" class="img-thumbnail avatar" alt="...">
			</div>

			<div class="col-lg-0 col-sm-5">
					<h1>
						{{customer.firstName}} {{customer.lastName}}
					</h1>

					<p class="mt-4">
						{{ customer.email}}/{{customer.cellPhone}}
					</p>

					<p class="mt-4">
						{{customer.address}} {{customer.city}} {{customer.state}}, {{customer.zipcode}}
					</p>

					<p class="mt-4">
						
					</p>
			</div>
			
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, reactive} from 'vue'
	import { onMounted } from 'vue'
	import { useStoreOwnerCustomer } from '../../../stores/Owner/storeOwnerCustomers'
	import axios from 'axios'
	import { storeToRefs } from 'pinia'

	const storeOwnerCustomer = useStoreOwnerCustomer()
	const { customerDetails: customer } =  storeToRefs(storeOwnerCustomer)

	const props = defineProps({
		id: {
			type: String,
			required: true
		}
	})
	
	onMounted(() => {
		console.log(props.id)
		storeOwnerCustomer.getCustomerDetails(props.id)
		console.log(customer.value)
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