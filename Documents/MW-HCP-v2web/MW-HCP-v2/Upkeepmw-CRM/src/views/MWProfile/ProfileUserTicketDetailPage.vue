<template>
	<div>
		hi - {{id}}

		<div class="mt-2" v-for="ticket of userTickets" :key="ticket">
			{{ticket}}
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, reactive  } from 'vue'
	import { onMounted, onBeforeUpdate } from 'vue'
	import { useStoreRenterSupportTicket } from '../../stores/Renter/storeRenterSupportTickets'
	import { useStoreUserInfo } from '../../stores/storeUser'
	import { storeToRefs } from 'pinia'
	import axios from 'axios'

	const storeRenterSupportTicket = useStoreRenterSupportTicket()
	const storeUser = useStoreUserInfo()

	const { me: user } =  storeToRefs(storeUser)


	const { tickets: userTickets } =  storeToRefs(storeRenterSupportTicket)

	const props = defineProps({
		id: String,
	})

	console.log("docId", props.id)

	onMounted(() => {
		const currentUID = user.value.id
		storeRenterSupportTicket.getTickets(currentUID)
	})

	onBeforeUpdate(() => {
	
	})

</script>

<style scoped>

</style>