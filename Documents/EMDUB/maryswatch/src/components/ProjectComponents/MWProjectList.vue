<template>
	<div>
		<div class="row mt-4">
			<div class="col-4">
				<div class="scroll">
					<nav class="navbar" v-for="ticket in tickets" :key="ticket.id">
						<ul class="nav nav-pills flex-column">
								<li class="nav-item" data-bs-toggle="collapse" :data-bs-target="`#collapseExample${ticket.id}`">
									{{ticket.address}}
								</li>
								<div class="collapse show mt-2" id="collapseExample">
									<ul class="nav nav-pills flex-column">
											<li class="nav-item ms-2" data-bs-toggle="collapse" :data-bs-target="`#collapseExample${ticket.id}`">
												{{ticket.createdOn.toDate()}}
											</li>
											<div class="collapse show mt-2" id="collapseExample2">
												<ul class="nav nav-pills flex-column">
													<li class="nav-item ms-4" @click.prevent="retrieveTicketDetails(ticket.id)">
														{{ticket.id}}
													</li>
												</ul>
											</div>
									</ul>
								</div>
						</ul>
					</nav>
				</div>
			</div>

			<div class="col-2"></div>

			<div class="col-6" >
				<div class="container-fluid py-5" v-if="retrievedTicket">
					<h3 class="display-5 fw-bold">Priority - <button type="button" class="btn disabled btn-warning btn-sm my-4">{{retrievedTicket.priority}}</button></h3>
					<h5 class="col-md-8 fs-4">Project #{{retrievedTicket.id}}</h5>
					<p>{{retrievedTicket.problemDescription}}</p>
					<button class="btn btn-primary mx-auto" type="button">View Project Details</button>
				</div>
			</div>
		</div>

		
	</div>
</template>

<script setup>
	import { ref, reactive, computed } from 'vue'
	import { onMounted } from 'vue'
	import { useStoreRenterSupportTicket } from '../../stores/Renter/storeRenterSupportTickets'
	import { useStoreOwnerSupportTicket } from '../../stores/Owner/storeOwnerSupportTickets'
	import { useStoreSPEstimate } from '../../stores/SP/storeSPEstimates'

	

	const props = defineProps({
		tickets: Array,
		perspectives: Array
	})

	/* 
		SP Team Store
	*/

	const storeRenterSupportTicket = useStoreRenterSupportTicket()
	const storeOwnerSupportTicket = useStoreOwnerSupportTicket()
	const storeSPEstimate = useStoreSPEstimate()

	const ticketDetails = ref('')

	onMounted(() => { 
		persistTicket()
		console.log(props.perspectives)
	})

	const retrievedTicket = ref({})

	
	const persistTicket = () => {

			ticketDetails.value = localStorage.getItem("docId")
			if(ticketDetails.value) {
				retrievedTicket.value = storeRenterSupportTicket.getRenterSupportTicketDetails(ticketDetails.value)
			}			
	}

	const retrieveTicketDetails = (docId) => {
		if(props.perspectives.includes('renter')) {
			console.log(docId)
			localStorage.setItem("docId", docId)
			retrievedTicket.value = storeRenterSupportTicket.getRenterSupportTicketDetails(docId)
			console.log(retrievedTicket)
		}

		// if(props.perspectives.includes('owner')) {
		// 	console.log(docId)
		// 	localStorage.setItem("docId", docId)
		// 	retrievedTicket.value = storeOwnerSupportTicket.getOwnerSupportTicketDetails(docId)
		// 	console.log(retrievedTicket)
		// }

		// if(props.perspectives.includes('service provider')) {
		// 	console.log(docId)
		// 	localStorage.setItem("docId", docId)
		// 	retrievedTicket.value = storeSPSupportTicket.getSPSupportTicketDetails(docId)
		// 	console.log(retrievedTicket)
		// }
		
	}
</script>

<style scoped>
	.scroll {
		height: 85%;
		overflow-y: auto;
	}
</style>