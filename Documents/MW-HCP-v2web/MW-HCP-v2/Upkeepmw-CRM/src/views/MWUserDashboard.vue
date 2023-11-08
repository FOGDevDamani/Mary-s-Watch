<template>
	<div class="container-fluid">
    <div class="row justify-content-end my-5">
      <div class="col-12">
        <MWRouterLink class="h2 black" to="/project-management">User Dashboard - {{user.uid}}</MWRouterLink>
      </div>
    </div>

    <!-- <div class="row justify-content-center my-5">
      <b-col lg="6">
        <MWSearchbar />
      </b-col>
    </div> -->

		
		<div class="card dashboard">
			<div class="row mb-5">
				<div class="col mt-2">
		
					<MWRouterLink class="h4 ms-4 black" to="/personal-profile">
						Profile
					</MWRouterLink>

					<MWRouterLink class="h4 ms-3 black" to="/project-management">
						Project Management
					</MWRouterLink>
				</div>

				<div class="col-4 mt-2 ">
		
					<MWRouterLink class="h4 ms-2 black" to="/renter-teams">
						My Team
					</MWRouterLink>

					<!-- <MWRouterLink class="h4 black" to="/renter-payments">
						<span class="badge mt-3 ms-2 text-bg-primary">My Payments</span>
					</MWRouterLink> -->

					<MWRouterLink class="h4 ms-3 black" to="/renter-make-a-payment">
						Make A Payment
					</MWRouterLink>
				</div>
				
			</div>

			<h4 class="my-3 ms-3">
				Welcome! {{user.firstName}} {{user.lastName}}
			</h4>

			

			<div class="row ms-2 mt-4">
				<div class="col-lg-6 col-sm-4">
					<button type="button" class="btn disabled btn-success btn-sm my-4 me-4">Online</button>
					<img :src="user.profileImage" class="img-thumbnail avatar" alt="...">
				</div>

				<div class="col-lg-6 col-sm-4">
					Recent chat messages will go here
				</div>
			</div>

		

			<div v-if="projects.length  > 0">
				<MWRouterLink class="h4 mt-5 mb-2 ms-4 black" to="/renter-project-list">Recent Projects</MWRouterLink>
			
				<div class="row row-cols-1 row-cols-md-2 mx-2 my-1 g-4">
					<div class="col">
						<div class="card" v-for=" project in projects" :key="project">
							<div class="card-body" v-if="project.data">
								<h5 class="card-title">{{project.data.address}}</h5>
								<h6 class="card-subtitle mb-2 text-body-secondary">{{toDate(project.data.createdOn._seconds)}}</h6>
								<p class="card-text">{{project.data.problemDescription}}</p>
								<MWRouterLink class="h6 mt-5 mb-2 black" :route="{ name: 'RenterSupportTicketDetailPage', params: { id: project.id } }">View Details</MWRouterLink>
							</div>
						</div>
					</div>
				</div>			
			</div>
			<div v-else class="mx-auto my-5">
				Looks like you dont have any projects. <MWRouterLink class="h4 mt-5 mb-2 ms-4 black" to="/renter-support-ticket">Start a new one today!</MWRouterLink>
			</div>
		</div>
  </div>
</template>

<script setup>
	import { RouterLink, RouterView, useRoute } from 'vue-router'
	import { onMounted, onBeforeMount } from 'vue'
	import MWSpacedRouterLink from '../components/Routing/MWSpacedRouterLink.vue'
	import MWRouterLink from '../components/Routing/MWRouterLink.vue'
	import { useStoreUserInfo } from '../stores/storeUser'
	import { useStoreAuth } from '../stores/storeAuth'
	import { storeToRefs } from 'pinia'
	import { useStoreRenterSupportTicket } from '../stores/Renter/storeRenterSupportTickets'

	import axios from 'axios'

	const storeUser = useStoreUserInfo()
	const storeAuth = useStoreAuth()

	const { userUID: uid } =  storeToRefs(storeAuth)
	const storeRenterSupportTicket = useStoreRenterSupportTicket()
	const { recentlySubmittedTicketId: docId, tickets: projects, getOwnerSupportTicketDetails: ticket } =  storeToRefs(storeRenterSupportTicket)
	const { me: user } = storeToRefs(storeUser)

	onBeforeMount(() => {
		const currentUID = uid.value
		console.log(currentUID)
		storeRenterSupportTicket.getTickets(currentUID)

		console.log(user.value)
		storeUser.getUser(currentUID)
	})
	

	const toDate = (date) => {
			const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
			return new Date(date * 1000).toLocaleDateString(undefined, options)
  }

</script>

<style scoped>
.dashboard {
	width: 100%;
}
.avatar {
	vertical-align: middle;
	width: 300px;
	height: 300px;
	border-radius: 50%;
}
.black{
	color: black
}
</style>