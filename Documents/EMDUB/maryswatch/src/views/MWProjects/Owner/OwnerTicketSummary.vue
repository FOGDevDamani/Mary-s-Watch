<template>
	<div>

		<h2>Project Summary</h2>

		ticket {{ticket}}

		

		<!-- <div v-if="ticket">
			<div class="card text-center mt-4" v-for="item in ticket.checklistItems" :key="item"> 
				<div class="card-body">
					<div class="row">
						<div class="col">
							<div class="mt-4">
								<p >
									Project Id: {{state.id}}
								</p>
							</div>
						</div>
						<div class="col">
							<div class="mt-4" >
								<p>
									Project Location: {{item.address}}
								</p>
							</div>
						</div>
					</div>
					<div class="row justify-content-center">
						<div class="col">
							<div class="mt-4">
								<p >
									Previously Reported? {{item.previouslyReported}}
								</p>
							</div>
						</div>
						<div class="col">
							<div class="mt-4">
								<p >
									Do you authorize entry into your unity to perform the maintenance or repairs above in your absence? {{item.entryAllowedIfAbsent}}
								</p>
							</div>
						</div>
					</div>

					<div class="row justify-content-center">
						<div class="col">
							<div class="mt-4">
								<p >
									Preferred Date and Time? {{ item.preferredStartingDate}} at {{item.preferredStartingTime}}
								</p>
							</div>
						</div>
						<div class="col">
							<div class="mt-4">
								<p >
									Pets? {{item.petsAllowed}}
								</p>
							</div>
						</div>
						<div class="col">
							<div class="mt-4">
								<p>
									Preferred Contact Number: {{item.preferredContactNumber}}
								</p>
							</div>
						</div>
					</div>
				</div>
			

				<div class="accordion my-4  mx-4 " id="accordionExample">
					<div class="accordion-item text-bg-light">
						<h2 class="accordion-header" id="headingOne">
							<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
								Units 
							</button>
						</h2>
						<div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
							<div class="accordion-body">
								<div class="mt-4" v-for="item in ticket.checklistItems" :key="item">
									<div v-for="unit in item.units" :key="unit">
										<div>
											Unit {{unit.unitNumber}} in room {{unit.roomNumber}}
										</div>
										<div>
											Type: {{unit.type}}
											Priority: {{unit.highPriority}} 
										</div>
										<div>
											Description: {{unit.description}}
										</div>
										<div class="inline-block" v-if="unit.photos">
											<img v-for="photo in unit.photos" :key="photo" :src="photo" alt="...">
										</div>
									</div>
									
								</div>
								<hr>
							</div>
						</div>
					</div>
					<div class="accordion-item text-bg-light">
						<h2 class="accordion-header" id="headingOne">
							<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseOne">
								Teams 
							</button>
						</h2>
						<div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
							<div class="accordion-body">
								<div class="mt-4" v-for="item in ticket.checklistItems" :key="item">
									<div v-for="team in item.teams" :key="team">
											<div >
												<div>
													<img v-if="team.profileImage" :src="team.profileImage" class="img-thumbnail avatar" alt="">
												</div>

												<div>
													<h4 class="mt-2 underlined">{{team.teamName}}</h4>

													<div class="mt-4" v-for="item in state.checklistItems" :key="item">
														Team Members: <div v-for="teamMember in item.teamMembers" :key="teamMember" >	
															<div v-if="teamMember.teamName === team.teamName" >
																<img v-if="teamMember.profileImage" :src="teamMember.profileImage" alt="" class="mt-4">
																<div>
																	{{teamMember.teamMemberName}}
																</div>
																Notes: <div>
																	{{teamMember.notes}}
																</div>
															</div>								
														</div>
													</div>
												</div>
												<hr class="my-4">
											</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="accordion-item text-bg-light">
						<h2 class="accordion-header" id="headingTwo">
							<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseTwo">
								Funding Source
							</button>
						</h2>
						<div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
							<div class="accordion-body">
								<div class="mt-4" v-for="name in ticket.fundingSources.names" :key="name">
								 <div>
										Name: {{name.name}}
									</div>	
									<div>
										Type: {{name.bankAccountType}}
									</div>
									<div>
										Balance: ${{name.balance}}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
			

		<div class="row justify-content-center">
			<div class="col-2">
				<button class="btn btn-primary my-3" @click.prevent="routeToSupportTicket" type="button">Cancel</button>
			</div>
			
			<div class="col-2">
				<button type="button" @click.prevent="updateTicket" class="btn btn-primary my-3 button" data-bs-toggle="modal" data-bs-target="#exampleModal">Confirm and Notify SP</button>
			</div>
		</div>
		
		<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-body">
						Your maintenance request has been received and your team(s) have been contacted
					</div>
					<div class="modal-footer">
						<button @click="routeToProjects" type="button" class="btn btn-primary" data-bs-dismiss="modal">Continue</button>
					</div>
				</div>
			</div>
		</div> -->

	</div>
</template>

<script setup>
	import { ref, onBeforeMount, onMounted, reactive, onUpdated, onBeforeUpdate } from 'vue'
	import { useStorage } from '@vueuse/core'
	import { useRouter, useRoute } from 'vue-router'
	import { useStoreOwnerSupportTicket } from '../../../stores/Owner/storeOwnerSupportTickets'
	import { useStoreUserInfo } from '../../../stores/storeUser'
	import axios from 'axios'
	import { storeToRefs } from 'pinia'
import { list } from 'firebase/storage'

	
	const storeUser = useStoreUserInfo()

	const storeOwnerSupportTicket = useStoreOwnerSupportTicket()

	const { recentlySubmittedTicketId: docId, tickets: project, getOwnerSupportTicketDetails: ticket } =  storeToRefs(storeOwnerSupportTicket)
	
	const { listenForTickets, getTickets } = storeOwnerSupportTicket
	
	const documentId = localStorage.getItem('docId')


	const router = useRouter()

	onMounted(() => {
		listenForTickets()
	
	})

	onBeforeUpdate(() => {
		console.log('gets called now. checking for updates')
	})
	onUpdated(() => {
		console.log('should have updates')
		console.log('fulll ticket', ticket)
	})

	const routeToProjects = () => {

		router.push('/owner-project-list')
	}

	const routeToSupportTicket = () => {
		router.push('/owner-support-ticket')
	}
</script>

<style scoped>
.avatar {
	vertical-align: middle;
	width: 300px;
	height: 300px;
	border-radius: 50%;
}

.underlined {
  text-decoration: underline;
}
</style>