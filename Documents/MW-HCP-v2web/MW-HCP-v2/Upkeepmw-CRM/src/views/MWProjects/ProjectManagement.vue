<template>
  <div class="container-fluid">
    <div class="row justify-content-end my-5">
      <div class="col-12">
        <MWRouterLink class="h2 black" to="/project-management">Project Management</MWRouterLink>
      </div>
    </div>

    <!-- <div class="row justify-content-center my-5">
      <b-col lg="6">
        <MWSearchbar />
      </b-col>
    </div> -->

		

		<ul class="nav nav-pills my-5 justify-content-center" v-if="user.userPerspectives.length > 0">
				<li class="nav-item-dropdown" v-if="user.userPerspectives.includes('renter')">
					<a class="nav-link dropdown-toggle black" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Renter</a>
					<ul class="dropdown-menu">
						<li>
							<router-link class="dropdown-item" to="/renter-project-list">My Projects</router-link>
						</li>

						<li>
							<router-link class="dropdown-item" to="/renter-teams">My Teams</router-link>
						</li>

						<li>
							<router-link class="dropdown-item" to="/renter-payments">My Payments</router-link>
						</li>
					
						<li><hr class="dropdown-divider"></li>

						<li>
							<router-link class="dropdown-item" to="/renter-support-ticket">Create Support Ticket</router-link>
						</li>

						<li><hr class="dropdown-divider"></li>

							<li>
							<router-link class="dropdown-item" to="/renter-add-a-team">Add A Team</router-link>
						</li>

						<li><hr class="dropdown-divider"></li>

						<li>
							<router-link class="dropdown-item" to="/renter-make-a-payment">Make A Payment</router-link>
						</li>
						
						<li>
							<router-link class="dropdown-item" to="/renter-request-a-payment">Request A Payment</router-link>
						</li>
					</ul>

				</li>

				<li class="nav-item-dropdown" v-if="user.userPerspectives.includes('owner')">
					<a class="nav-link dropdown-toggle black" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Owner</a>
					<ul class="dropdown-menu">
						<li>
							<router-link class="dropdown-item" to="/owner-project-list">My Business Projects</router-link>
						</li>

						<li>
							<router-link class="dropdown-item" to="/owner-teams">My Business Teams</router-link>
						</li>
						<li>
							<router-link class="dropdown-item" to="/owner-customers">My Business Customers</router-link>
						</li>
						<li>
							<router-link class="dropdown-item" to="/owner-assets">My Business Assets</router-link>
						</li>

						<li>
							<router-link class="dropdown-item" to="/owner-payments">My Business Payments</router-link>
						</li>
					
						<li><hr class="dropdown-divider"></li>

						<li>
							<router-link class="dropdown-item" :to="{ name: 'OwnerSupportTicket' }">Create Support Ticket</router-link>
						</li>

						<li>
							<router-link class="dropdown-item" to="/owner-behavior-ticket">Create Behavior Ticket</router-link>
						</li>

						<li><hr class="dropdown-divider"></li>

							<li>
								<router-link class="dropdown-item" to="/owner-add-a-team">Add A Team</router-link>
							</li>

							<li>
								<router-link class="dropdown-item" to="/owner-add-a-customer">Add A Customer</router-link>
							</li>

							<li>
								<router-link class="dropdown-item" to="/owner-add-a-asset">Add A Asset</router-link>
							</li>


						<li><hr class="dropdown-divider"></li>

						<li>
							<router-link class="dropdown-item" to="/make-a-payment">Make A Payment</router-link>
						</li>
						
						<li>
							<router-link class="dropdown-item" to="/renter-make-a-payment">Request A Payment</router-link>
						</li>
					</ul>
				
				</li>

				<li class="nav-item-dropdown" v-if="user.userPerspectives.includes('rental operator')">
					<a class="nav-link dropdown-toggle black" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Rental Operator</a>
					<ul class="dropdown-menu">
						<li>
							<router-link class="dropdown-item" to="/owner-project-list">My Business Projects</router-link>
						</li>

						<li>
							<router-link class="dropdown-item" to="/owner-teams">My Business Teams</router-link>
						</li>
						<li>
							<router-link class="dropdown-item" to="/owner-customers">My Business Customers</router-link>
						</li>
						<li>
							<router-link class="dropdown-item" to="/owner-assets">My Business Assets</router-link>
						</li>

						<li>
							<router-link class="dropdown-item" to="/owner-payments">My Business Payments</router-link>
						</li>
					
						<li><hr class="dropdown-divider"></li>

						<li>
							<router-link class="dropdown-item" :to="{ name: 'OwnerSupportTicket' }">Create Support Ticket</router-link>
						</li>

						<li>
							<router-link class="dropdown-item" to="/owner-behavior-ticket">Create Behavior Ticket</router-link>
						</li>

						<li><hr class="dropdown-divider"></li>

							<li>
								<router-link class="dropdown-item" to="/owner-add-a-team">Add A Team</router-link>
							</li>

							<li>
								<router-link class="dropdown-item" to="/owner-add-a-customer">Add A Customer</router-link>
							</li>

							<li>
								<router-link class="dropdown-item" to="/owner-add-a-asset">Add A Asset</router-link>
							</li>


						<li><hr class="dropdown-divider"></li>

						<li>
							<router-link class="dropdown-item" to="/make-a-payment">Make A Payment</router-link>
						</li>
						
						<li>
							<router-link class="dropdown-item" to="/renter-make-a-payment">Request A Payment</router-link>
						</li>
					</ul>
				
				</li>

				<li class="nav-item-dropdown" v-if="user.userPerspectives.includes('service provider')">
					<a class="nav-link dropdown-toggle black" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Service Provider</a>
					<ul class="dropdown-menu">
						<li>
							<router-link class="dropdown-item" to="/sp-project-list">My Business Projects</router-link>
						</li>

						<li>
							<router-link class="dropdown-item" to="/sp-teams">My Business Teams</router-link>
						</li>

						<li>
							<router-link class="dropdown-item" to="/sp-customers">My Business Customers</router-link>
						</li>

						<li>
							<router-link class="dropdown-item" to="/sp-stores">My Business Stores</router-link>
						</li>

						<li>
							<router-link class="dropdown-item" to="/sp-payments">My Business Payments</router-link>
						</li>
					
						<li><hr class="dropdown-divider"></li>

						<li>
							<router-link class="dropdown-item" to="/sp-estimate">Create Estimate</router-link>
						</li>

						<li><hr class="dropdown-divider"></li>

						<li>
							<router-link class="dropdown-item" to="/sp-add-a-team">Add a Team</router-link>
						</li>

						<li>
							<router-link class="dropdown-item" to="/sp-add-a-customer">Add A Customer</router-link>
						</li>

						<li><hr class="dropdown-divider"></li>

						<li>
							<router-link class="dropdown-item" to="/owner-support-ticket">Create Store</router-link>
						</li>

						<li>
							<router-link class="dropdown-item" to="/make-a-payment">Make A Payment</router-link>
						</li>
						
						<li>
							<router-link class="dropdown-item" to="/renter-make-a-payment">Request A Payment</router-link>
						</li>
					</ul>
				
				</li>
		</ul>

    <router-view></router-view>
  </div>
</template>

<script setup>
import MWRouterLink from '../../components/Routing/MWRouterLink.vue'
import { ref, computed, reactive, onBeforeMount, onMounted } from 'vue'
import { useStoreUserInfo } from '../../stores/storeUser'
import { useStoreAuth } from '../../stores/storeAuth'
import { useStoreOwnerTeamTeamMember } from '../../stores/Owner/storeOwnerTeamTeamMembers'
import { storeToRefs } from 'pinia'

const storeAuth = useStoreAuth()
const storeUser = useStoreUserInfo()

	/* 
		SP Team Store
	*/

	
	const storeOwnerTeamTeamMember = useStoreOwnerTeamTeamMember()

	const teamMembers = ref([])

	const { userUID: uid } =  storeToRefs(storeAuth)

	const { me: user } = storeToRefs(storeUser)

	onMounted(() => {
		console.log(uid.value)
		storeUser.getUser(uid.value)

		console.log(user.value.userPerspectives)
	})

	teamMembers.value = storeOwnerTeamTeamMember.teamMembers

	
</script>

<style scoped>
#nav a.router-link-exact-active {
  color: whitesmoke;
  background: blue;
  border-radius: 0.5rem;
}
.black{
	color: black
}
</style>