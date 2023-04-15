<template>
	<div>
		<div class="row">
			<div class="col-lg-4 col-sm-4">
				<img :src="customerInformation.profileImage" class="img-thumbnail avatar" alt="...">
			</div>

			<div class="col-lg-0 col-sm-5">
					<h1>
						{{customerInformation.firstName}} {{customerInformation.lastName}}
					</h1>

					<p class="mt-4">
						{{ customerInformation.email}}/{{customerInformation.cellPhone}}
					</p>

					<p class="mt-4">
						{{customerInformation.address}} {{customerInformation.city}} {{customerInformation.state}}, {{customerInformation.zipcode}}
					</p>

					<p class="mt-4">
						
					</p>
			</div>
			
		</div>
	</div>
</template>

<script setup>
import { ref, computed, reactive} from 'vue'

import { useStoreSPCustomer } from '../../../stores/SP/storeSPCustomers'

 const props = defineProps({
	id: {
		type: String,
		required: true
	}
 })

 
	/* 
		SP Team Store
	*/

	const storeSPCustomer = useStoreSPCustomer()


const customerInformation = ref({})


customerInformation.value = storeSPCustomer.getSPCustomerDetails(props.id)

 
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