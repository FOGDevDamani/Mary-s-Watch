<template>
	<div>
		<h2>My Projects</h2>
		<div class="row my-5 pt-2">
			<div class="col-sm-8"></div>
			<div class="col-sm-4">
				<AddCircleButton route="/owner-support-ticket"></AddCircleButton>
			</div>
		</div>
		
		<div v-if="project.length > 0">
			<div class="row">
						<div class="col-lg-4 col-sm-6">				
							<div class="scroll">
								<nav class="navbar" v-for="project in project" :key="project.id">
									<ul class="nav nav-pills flex-column" v-for="ticket in project.checklistItems" :key="ticket">
											<li class="nav-item fw-bolder" data-bs-toggle="collapse" :data-bs-target="`#collapseExample${project.id}`">
												{{ticket.address}}
											</li>
											<div class="collapse show mt-2" id="collapseExample">
												<ul class="nav nav-pills flex-column">
														<li class="nav-item ms-2 fw-bold" data-bs-toggle="collapse" :data-bs-target="`#collapseExample${project.id}`">
															{{ticket.createdOn.toDate()}}
														</li>
														<div class="collapse show mt-2" id="collapseExample2">
															<ul class="nav nav-pills flex-column">
																<li class="nav-item ms-4 fw-semibold" @click.prevent="retrieveTicketDetails(project.id)">
																	{{project.id}}
																</li>
															</ul>
														</div>
												</ul>
											</div>
									</ul>
								</nav>
							</div>
						</div>

						<div class="col-lg-2 col-sm-2"></div>

						<div class="col-lg-6 col-sm-4 raise">
							<div class="container-fluid" v-if="retrievedTicket">
								<div v-for="rTicket in retrievedTicket.checklistItems" :key="rTicket">
									<div v-for="unit in rTicket.units" :key="unit">
										<h3 class="display-5 fw-bold">Priority - <button type="button" class="btn disabled btn-warning btn-sm">{{unit.highPriority}}</button></h3>
										<h5 class="col-md-8 fs-4">Project #{{retrievedTicket.id}}</h5>
										<hr>
										<h5>For Unit</h5>
										<h6>{{unit.description}}</h6>
										<div>
											Unit {{unit.unitNumber}} in room {{unit.roomNumber}}
										</div>
										<div>
											Type: {{unit.type}}
										</div>
										<div class="inline-block" v-if="unit.photos">
											<img v-for="photo in unit.photos" :key="photo" :src="photo" alt="...">
										</div>
									</div>
									
								</div>
								
								<button class="btn btn-primary mx-auto mt-4" type="button">View Project Details</button>
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
import { ref, computed, reactive} from 'vue'
import { onMounted } from 'vue'
import { useStoreOwnerSupportTicket } from '../../../stores/Owner/storeOwnerSupportTickets'
import { useStoreUserInfo } from '../../../stores/storeUser'
import { storeToRefs } from 'pinia'


	/* 
		SP Team Store
	*/

	const storeUser = useStoreUserInfo()

	const storeOwnerSupportTicket = useStoreOwnerSupportTicket()

	const { recentlySubmittedTicketId: docId, tickets: project, getOwnerSupportTicketDetails: ticket } =  storeToRefs(storeOwnerSupportTicket)
	
	const { listenForTickets, getOwnerSupportTicketDetailsById } = storeOwnerSupportTicket
	
	const ticketDetails = ref('')

	const retrievedTicket = ref({})

	const tickets = ref([])

	onMounted(() => {
		listenForTickets()
		storeUser.getUser()
		persistTicket()
	})


	const persistTicket = () => {
			ticketDetails.value = localStorage.getItem("docId")
			if(ticketDetails.value) {
				retrievedTicket.value = getOwnerSupportTicketDetailsById(ticketDetails.value)
			}			
	}

	const retrieveTicketDetails = (docId) => {
		localStorage.setItem("docId", docId)
		retrievedTicket.value = getOwnerSupportTicketDetailsById(docId)
		
		// if(props.perspectives.includes('owner')) {
		// 	retrievedTicket.value = storeSPSupportTicket.getSPSupportTicketDetails
		// 	console.log(retrievedTicket)
		// }
		
	}

</script>

<style  scoped>
	.scroll {
		position: relative;
		height: 85%;
		overflow-y: auto;
	}
	@media only screen and (max-width: 375px) {
		.raise {
			position: relative;
			top: 125%;
		}
	}
</style>