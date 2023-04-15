<template>
	<div>
		<div class="ms-5 ps-1 mt-5 pt-2 row card-width">
			<div v-for="payment in payment" :key="payment">
				<MWPaymentCard  :label1="payment.paymentOption" :label2="payment.address" :label3="payment.amount" :label4="payment.for" :label5="payment.sendReceipt" :label6="payment.date"></MWPaymentCard>
			</div>
			
		</div>
		
	</div>
</template>

<script setup>
import MWPaymentCard from '../../components/Cards/MWPaymentCard.vue'
import { useStoreOwnerPayment } from '../../stores/Owner/storeOwnerPayments'
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted, onBeforeMount } from 'vue'

const storeOwnerPayment = useStoreOwnerPayment()

const { payments: payment } = storeToRefs(storeOwnerPayment)

onMounted(() => {
	storeOwnerPayment.listenForPayments()
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