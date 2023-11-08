<template>
	<div>
		<div>
			Previously Reported? {{ticket.previouslyReported}}
		</div>
			
		<div>
			Customer Satisfied? {{ticket.customerSatisfied}}
		</div>

		<div>
			Address {{ticket.address}}
		</div>

		<div>
			Room {{ticket.room}}
		</div>

		<div>
			Problem Description {{ticket.problemDescription}}
		</div>

		<div>
			Preferred Starting Date {{ticket.date}}
		</div>

		<div>
			Preferred Starting Time {{ticket.time}}
		</div>

		<div>
			Pets Allowed? {{ticket.petsAllowed}}
		</div>

		<div>
			Entry allowed if absent? {{ticket.entryAllowedIfAbsent}}
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, reactive  } from 'vue'
	import { onMounted, onBeforeUpdate } from 'vue'
	import { useStoreRenterSupportTicket } from '../../../stores/Renter/storeRenterSupportTickets'
	import { useStoreUserInfo } from '../../../stores/storeUser'
	import { storeToRefs } from 'pinia'
	import axios from 'axios'

	const storeRenterSupportTicket = useStoreRenterSupportTicket()
	const storeUser = useStoreUserInfo()

	const { me: user } =  storeToRefs(storeUser)


	const { ticketDetails: ticket } =  storeToRefs(storeRenterSupportTicket)

	const props = defineProps({
		id: String,
	})

	console.log("docId", props.id)

	onMounted(() => {
		storeRenterSupportTicket.getTicketDetails(props.id)
	})
</script>

<style scoped>

</style>