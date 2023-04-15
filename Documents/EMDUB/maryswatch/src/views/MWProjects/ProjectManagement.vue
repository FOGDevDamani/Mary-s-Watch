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

		<ul class="nav nav-pills my-5 justify-content-center">
				<li class="nav-item-dropdown" v-if="storeUser.isRenter">
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
							<router-link class="dropdown-item" to="/make-a-payment">Make A Payment</router-link>
						</li>
						
						<li>
							<router-link class="dropdown-item" to="/renter-make-a-payment">Request A Payment</router-link>
						</li>
					</ul>
				
				</li>

				<li class="nav-item-dropdown" v-if="storeUser.isOwner">
					<a class="nav-link dropdown-toggle black" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Owner</a>
					<ul class="dropdown-menu">
						<li>
							<router-link class="dropdown-item" to="/owner-project-list">My Projects</router-link>
						</li>

						<li>
							<router-link class="dropdown-item" to="/owner-teams">My Teams</router-link>
						</li>
						<li>
							<router-link class="dropdown-item" to="/owner-customers">My Customers</router-link>
						</li>
						<li>
							<router-link class="dropdown-item" to="/owner-assets">My Assets</router-link>
						</li>

						<li>
							<router-link class="dropdown-item" to="/owner-payments">My Payments</router-link>
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

				<li class="nav-item-dropdown" v-if="storeUser.isSP">
					<a class="nav-link dropdown-toggle black" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Service Provider</a>
					<ul class="dropdown-menu">
						<li>
							<router-link class="dropdown-item" to="/sp-project-list">My Projects</router-link>
						</li>

						<li>
							<router-link class="dropdown-item" to="/sp-teams">My Teams</router-link>
						</li>

						<li>
							<router-link class="dropdown-item" to="/sp-customers">My Customers</router-link>
						</li>

						<li>
							<router-link class="dropdown-item" to="/sp-stores">My Stores</router-link>
						</li>

						<li>
							<router-link class="dropdown-item" to="/sp-payments">My Payments</router-link>
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
import { useStoreOwnerTeamTeamMember } from '../../stores/Owner/storeOwnerTeamTeamMembers'



	/* 
		SP Team Store
	*/

	const storeUser = useStoreUserInfo()
	const storeOwnerTeamTeamMember = useStoreOwnerTeamTeamMember()

	const teamMembers = ref([])

	onMounted(() => {
		storeUser.getUser()
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