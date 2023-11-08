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
									<h3 class="display-5 fw-bold">Priority - <button type="button" class="btn disabled btn-warning btn-sm">low</button></h3>
									<h5 class="col-md-8 fs-4">Project #{{retrievedTicket.id}}</h5>
									<h6>{{rTicket.problemDescription}}</h6>
								</div>
								<button class="btn btn-primary mx-auto mt-4" @click.prevent="routeToProject(retrievedTicket.id)" type="button">View Project Details</button>
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
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useStoreSPEstimate } from '../../../stores/SP/storeSPEstimates'
import { useStoreUserInfo } from '../../../stores/storeUser'
import { storeToRefs } from 'pinia'


	/* 
		SP Team Store
	*/

	const storeUser = useStoreUserInfo()

	const storeSPEstimate = useStoreSPEstimate()

	const { recentlySubmittedTicketId: docId, tickets: project, getSPSupportTicketDetail: ticket } =  storeToRefs(storeSPEstimate)
	
	const { listenForTickets, getSPSupportTicketDetailsById } = storeSPEstimate
	
	const ticketDetails = ref('')

	const retrievedTicket = ref({})

	const tickets = ref([])

	const router = useRouter()

	onMounted(() => {
		listenForTickets()
		storeUser.getUser()
		persistTicket()
	})


	const persistTicket = () => {
			ticketDetails.value = localStorage.getItem("docId")
			if(ticketDetails.value) {
				retrievedTicket.value = getSPSupportTicketDetailsById(ticketDetails.value)
			}			
	}

	const retrieveTicketDetails = (docId) => {
		localStorage.setItem("docId", docId)
		retrievedTicket.value = getSPSupportTicketDetailsById(docId)
		
		// if(props.perspectives.includes('owner')) {
		// 	retrievedTicket.value = storeSPSupportTicket.getSPSupportTicketDetails
		// 	console.log(retrievedTicket)
		// }
		
	}

	const routeToProject = (id) => {
		router.push({ name: 'SPOngoingProject', params: { id: id } })
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