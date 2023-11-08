<template>
	<div>
		<h2>My Projects</h2>
		<div class="row mt-5 pt-2">
			<div class="col-sm-8"></div>
			<div class="col-sm-4">
				<AddCircleButton route="/renter-support-ticket"></AddCircleButton>
			</div>
		</div>
		
		<div v-if="project">
			<div class="row mt-4">
			<div class="col-4">
				<div class="scroll">
					<nav class="navbar" v-for="ticket in project" :key="ticket.renterTicketId">
						<ul class="nav nav-pills flex-column">
								<li class="nav-item fw-bolder" data-bs-toggle="collapse" :data-bs-target="`#collapseExample${ticket.renterTicketId}`">
									{{ticket.address}}
								</li>
								<div class="collapse show mt-2" id="collapseExample">
									<ul class="nav nav-pills flex-column">
											<li class="nav-item ms-2 fw-bold" data-bs-toggle="collapse" :data-bs-target="`#collapseExample${ticket.renterTicketId}`">
												{{ticket.createdOn}}
											</li>
											<div class="collapse show mt-2" id="collapseExample2">
												<ul class="nav nav-pills flex-column">
													<li class="nav-item ms-4 fw-semibold" @click.prevent="retrieveTicketDetails(ticket.renterTicketId)">
														{{ticket.renterTicketId}}
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
					<h5 class="col-md-8 fs-4">Project #{{retrievedTicket.renterTicketId}}</h5>
					<p>{{retrievedTicket.problemDescription}}</p>
					<MWRouterLink v-if="retrievedTicket.renterTicketId" :route="{ name: 'RenterSupportTicketDetailPage', params:{ id: retrievedTicket.renterTicketId } }" class="inline-block" >
							<button class="btn btn-primary mx-auto" type="button" >View Project Details</button>
					</MWRouterLink>
					
				</div>
			</div>
		</div>
		</div>
	</div>
</template>

<script setup>
import MWProjectList from '../../../components/ProjectComponents/MWProjectList.vue'
import MWTeamCard from '../../../components/Cards/MWTeamCard.vue'
import AddCircleButton from '../../../components/Forms/AddCircleButton.vue'
import MWRouterLink from '../../../components/Routing/MWRouterLink.vue'
import { ref, computed, reactive} from 'vue'
import { onMounted, onBeforeUpdate } from 'vue'
import { useStoreRenterSupportTicket } from '../../../stores/Renter/storeRenterSupportTickets'
import { useStoreUserInfo } from '../../../stores/storeUser'
import { storeToRefs } from 'pinia'


	/* 
		SP Team Store
	*/

	const storeUser = useStoreUserInfo()

	const storeRenterSupportTicket = useStoreRenterSupportTicket()
	
	const ticketDetails = ref('')

	const retrievedTicket = ref({})

	const tickets = ref([])

	const { me: user } =  storeToRefs(storeUser)

	const { recentlySubmittedTicketId: docId, tickets: project, getOwnerSupportTicketDetails: ticket } =  storeToRefs(storeRenterSupportTicket)




	onMounted(() => {
		const currentUID = user.value.uid
		console.log(currentUID)
		storeRenterSupportTicket.getTickets(currentUID)
		persistTicket()

	})


	const persistTicket = () => {
			ticketDetails.value = localStorage.getItem("docId")
			if(ticketDetails.value) {
				retrievedTicket.value = storeRenterSupportTicket.getRenterSupportTicketDetails(ticketDetails.value)
			}			
	}

	const retrieveTicketDetails = (docId) => {
		console.log(docId)
		localStorage.setItem("docId", docId)
		retrievedTicket.value = storeRenterSupportTicket.getRenterSupportTicketDetails(docId)
		

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

<style  scoped>

</style>