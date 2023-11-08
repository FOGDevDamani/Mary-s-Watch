<template>
	<div>
		hi - {{ id }}
	</div>
</template>

<script setup>
	import { useStoreRenterPayment } from '../../stores/Renter/storeRenterPayments'
	import { ref, computed, reactive  } from 'vue'
	import { onMounted, onBeforeUpdate } from 'vue'
	import { storeToRefs } from 'pinia'
	
	const storeRenterPayment = useStoreRenterPayment()
	const storeUser = useStoreUserInfo()

	const { payments: userPayments } =  storeToRefs(storeRenterPayment)

	const props = defineProps({
		id: String,
	})

	console.log("docId", props.id)

	onMounted(() => {
		storeRenterPayment.getPaymentDetails(props.id)
	})

</script>

<style scoped>

</style>