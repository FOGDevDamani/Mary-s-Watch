<template>
	<div>
		<h2>Project Summary</h2>
		<div v-if="ticket">
		
			<div class="card text-center mt-4" v-for="item in ticket.checklistItems" :key="item"> 
				<div class="card-body">
					<div class="row">
						<div class="col">
							<div class="mt-4">
								<p >
									Project Id: {{ticket.id}}
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

					<div class="row">
						<div class="col">
							<div class="mt-4" >
								<p>
									Problem Description: {{item.problemDescription}}
								</p>
							</div>
						</div>
					</div>
					<div class="row justify-content-center">
						<div class="col">
							<div class="mt-4">
								<p >
									Amount? $ {{item.amount}}
								</p>
							</div>
						</div>
						<div class="col">
							<div class="mt-4">
								<p >
									Type of Labor? {{item.laborType}}
								</p>
							</div>
						</div>
						<div class="col">
							<div class="mt-4">
								<p>
									Number of Hours: {{item.numberOfHours}}
								</p>
							</div>
						</div>
					</div>

					<div class="row justify-content-center">
						<div class="col">
							<div class="mt-4">
								<p >
									Number of Laborers? {{item.numberOfLaborers}}
								</p>
							</div>
						</div>
						<div class="col">
							<div class="mt-4">
								<p >
									Type of Labor? {{item.laborType}}
								</p>
							</div>
						</div>
						<div class="col">
							<div class="mt-4">
								<p>
									Number of Hours: {{item.numberOfHours}}
								</p>
							</div>
						</div>
					</div>

					<div class="row justify-content-center">
						<div class="col">
							<div class="mt-4">
								<p >
									Estimated Starting Date? {{ item.date.toDate() }} 
								</p>
							</div>
						</div>
						<div class="col">
							<div class="mt-4">
								<p >
									rate? {{item.rate}}
								</p>
							</div>
						</div>
						<div class="col">
							<div class="mt-4">
								<p>
									Room: {{item.room}}
								</p>
							</div>
						</div>
					</div>


					<h2>
						Total Cost for Materials: {{ticket.materialsEstimateTotal}}
					</h2>
				</div>
			

				<div class="accordion my-4  mx-4 " id="accordionExample">
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

													<div class="mt-4" v-for="item in ticket.checklistItems" :key="item">
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
				</div>
			</div>
		</div>
			

		<div class="row justify-content-center">
			<div class="col-2">
				<button class="btn btn-primary my-3" type="button">Cancel</button>
			</div>

			<div class="col-2">
				<button class="btn btn-primary my-3" @click.prevent="payForMaterialsAndLabor" type="button">Pay For Materials and Labor</button>
			</div>
			
			<div class="col-2">
				<button type="button" @click.prevent="updateTicket" class="btn btn-primary my-3 button" data-bs-toggle="modal" data-bs-target="#exampleModal">Confirm and Notify Owner</button>
			</div>
		</div>

		<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-body">
						Your project estimate has been received and the owner has been contacted
					</div>
					<div class="modal-footer">
						<router-link to="/sp-project-list">
							<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Continue</button>
						</router-link>
						
					</div>
				</div>
			</div>
		</div> 

	</div>
</template>

<script setup>
	import { ref, onBeforeMount, onMounted, reactive } from 'vue'
	import { useRouter, useRoute } from 'vue-router'
	import { useStoreSPEstimate } from '../../../stores/SP/storeSPEstimates'
	import { useStoreUserInfo } from '../../../stores/storeUser'
	import axios from 'axios'
	import { storeToRefs } from 'pinia'

	
	const storeUser = useStoreUserInfo()

	const storeSPEstimate = useStoreSPEstimate()

	const { recentlySubmittedTicketId: docId, tickets: project, getSPSupportTicketDetail: ticket, } =  storeToRefs(storeSPEstimate)
	
	const { listenForTickets, getSPSupportTicketDetailsById} = storeSPEstimate

	const router = useRouter()

	onMounted(() => {
		listenForTickets()
	})

	const routeToProject = () => {
		router.push({ name: 'SPOngoingProject', params: { id: docId.value} })
	}

	const payForMaterialsAndLabor = () => {
		const ticket = getSPSupportTicketDetailsById(docId.value)
		var amountArr = ticket.checklistItems.map(e =>  e.amount)
		const amount = amountArr.toString()

		const amounts = {
			amount : amount,
			materialsTotal: ticket.materialsEstimateTotal
		}
		axios.post('http://localhost:4041/pay-for-items', amounts)
		.catch((error) => console.log('error', error))
	}

</script>

<style scoped>

</style>