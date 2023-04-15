<template>
	<div class="row">
		<div class="col">
			<h3 class="maintsum mb-4">Maintenance Progress Report - {{ongoingProject.id}}</h3>
				<div v-for="item in ongoingProject.checklistItems" :key="item">
					<hr>
						<div class="my-3">
							Location: {{item.address}}
						</div>

						<div class="row mt-3">
							<div class="col-2">
								Project Progress
							</div>

							<div class="col-10">
								<div class="progress" role="progressbar" aria-label="Example 20px high" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="height: 20px">
									<div class="progress-bar" style="width: 25%"></div>
								</div>
							</div>
						</div>
					<hr>

					<div class="accordion my-5" id="accordionPanelsStayOpenExample">
						<div class="accordion-item">
							<h2 class="accordion-header" id="panelsStayOpen-headingOne">
								<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
									{{item.problemDescription}}
								</button>
							</h2>
							<div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
								<div class="accordion-body">
									<div class="my-3" v-for="team in item.teams" :key="team">
										<div class="my-3">
											Team: {{team.value}}
										</div>
									</div>

									Assigned Members<div v-for="member in item.teamMembers" :key="member">
										<div>
											Name: {{member.teamName }}
										</div>
										<div>
											Notes: {{ member.notes }}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>


					<div class="table-responsive my-5">
						<table class="table">
							<thead>
								<tr>
									
									<th scope="col">Description</th>
									<th scope="col">Quantity</th>
									<th scope="col">Amount</th>
								</tr>
							</thead>
							<tbody class="table-group-divider"  v-for="material in ongoingProject.materials" :key="material">
								<tr>	
									<td>{{material.description}}</td>
									<td>{{material.quantity}}</td>
									<td>${{material.amount}}</td>
								</tr>
							</tbody>
						</table>
					</div>
					

					
				</div>
		</div>


	</div>
</template>

<script setup>
	import { ref, computed, reactive, onBeforeMount, onMounted } from 'vue'
	import { useRouter, useRoute } from 'vue-router'
	import { useStoreSPEstimate } from '../../../stores/SP/storeSPEstimates'
	import { useStoreUserInfo } from '../../../stores/storeUser'
	import axios from 'axios'
	import { storeToRefs } from 'pinia'

	const props = defineProps({
		id: String
	})

	const ongoingProject = ref({})
	
	const storeUser = useStoreUserInfo()

	const storeSPEstimate = useStoreSPEstimate()

	const { recentlySubmittedTicketId: docId, tickets: project, getSPSupportTicketDetail: ticket } =  storeToRefs(storeSPEstimate)
	
	const { listenForTickets, getSPSupportTicketDetailWithId} = storeSPEstimate

	const router = useRouter()


	onMounted(() => {
		listenForTickets()
		console.log(props.id)
		ongoingProject.value = getSPSupportTicketDetailWithId(props.id)
	})

	


</script>

<style scoped>
	.underlined {
  	text-decoration: underline;
	}

	.centered {
		justify-content: center;
	}

	.technician {
		position: relative;
		left: 40%;
	}
	.leads {
		position: relative;
		bottom: 10%;
		left: 80%;
	}
	.right {
		position: relative;
		right: 40%;
	}
	.progressandphotos {
		position: relative;
		top: 10%;
		left: 25%;
	}
	.table {
		position: relative;
		top: 30%;
	}
	.desc {
		white-space: pre-line;
	}
	.picture {
		position: relative;
		right: 30%;
	}
</style>