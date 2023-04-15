<template>
	<div>
		<h2 class="register">Owner Support Ticket</h2>

		<div v-if="storeOwnerTeam.teams.length > 0 && storeOwnerAsset.assets.length > 0">
			<form>
				<div class="row mt-4">
					<div>
						Address:
					</div>

					<div class="mt-2 col-lg-5 col-sm-8">
						<MWFormLabelAndSelect v-model="state.address" :options="storeOwnerAsset.assets" />
					</div>
				</div>

				<div class="row mt-4">
					<div>
						Previously Reported:
					</div>

					<div class="mt-2 col-lg-5 col-sm-8">
						<MWFormLabelAndSelect v-model="state.previouslyReported" :options="yesOrNoTypes"  />
					</div>
				</div>

				<div class="my-4">
					Assign team(s) to ticket:
				</div>

				<div class="row row-cols-sm-2 row-cols-lg-3 g-4">
					<div class="col" v-for="team of ownerTeams" :key="team.id">
						<MWAddTeamCheckbox  v-model="state.teams" :profileImage="team.profileImage" :id="team.id"  :label="{teamName: team.teamName, teamLead: team.teamLead}"  :option="team"></MWAddTeamCheckbox>
						<div v-if="state.teams.length > 0">
							<div v-for="t in state.teams" :key="t">
								<button v-if="t.checked && t.teamName == team.teamName" type="button" class="btn btn-outline-primary mt-2" @click.prevent="teamMembersForModal(team.teamName)" data-bs-toggle="modal" :data-bs-target="`#exampleModal_${team.id}`">
									Add Team Members
								</button>
							</div>
							
						</div>
						<div class="modal fade" data-bs-backdrop="static" :id="`exampleModal_${team.id}`" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
							<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
								<div class="modal-content">
									<div class="modal-header">
										<h1 class="modal-title fs-5" id="exampleModalLabel">Select Team Member</h1>
										<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
									</div>
									<div class="modal-body" >
										<div class="row row-cols-sm-2 row-cols-lg-3 g-4" v-for="documents of teamMembers" :key="documents">
											<div class="col" v-for="member of documents" :key="member.id">
												<MWAddTeamTeamMemberCheckbox v-model="state.teamMembers" :profileImage="member.profileImage"  :label="{role: member.role, firstName: member.firstName, lastName: member.lastName, teamName: member.teamName }"  :option="member" placeholder="Enter Addtional Notes"></MWAddTeamTeamMemberCheckbox>
											</div>	
										</div>
									</div>
									<div class="modal-footer">
										<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
										<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Add Team Members</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-lg-12">
						<MWFormTable v-model="state.tableRows" />
					</div>
				</div>

				<div class="row mt-4">
					<label for="" class="mb-2"> Preferred Date And Time:</label>
					<div class="col-lg-3 mt-1 mb-3 col-sm-4">
						<MWFormLabelAndDatePicker v-model="ownerSupportTicketData.date" label="Preferred Date and Time:" />
					</div>
					<div class="col-sm-1"></div>
					<div class="col-lg-3 mt-1 col-sm-4">
						<MWFormLabelAndTimePicker v-model="ownerSupportTicketData.time" />
					</div>
				</div>

				<div class="col-lg-5 mt-4 col-sm-8">
					<div class="col-5">
						<MWFormLabelAndRadioInput v-model="state.petsAllowed" label="Pets:" id="1"  :options="yesOrNoTypes" />
					</div>
				</div>

				<div class="row mt-4">
					<div class="col-11">
						<MWFormLabelAndRadioInput v-model="state.entryAllowedIfAbsent" label="Do you authorize entry into your unity to perform the maintenance or repairs above in your absence?" id="3" :options="yesOrNoTypes" />
					</div>
				</div>

				<div class="col-5 col-sm-3 mt-3">
					<MWFormLabelAndInput v-model="state.contactNumber" label="Preferred Contact Number:" />
				</div>


				<div class="row">
					<div class="col-6">
						<button class="btn btn-primary my-3" type="button">Cancel</button>
					</div>
					<!-- <div>
						<button @click.prevent="retrieveCustomer">get funding source</button>
					</div> -->
					<div class="col-6">
						<button type="button" @click.prevent="addOwnerSupportTicket" class="btn btn-primary my-3 button">Continue</button>
					</div>
				</div>
				
			</form>
		</div>
	</div>
</template>

<script setup>

	import MWFormLabelAndInput from '../../../components/Forms/MWFormLabelAndInput.vue'
	import MWFormLabelAndSelect from '../../../components/Forms/MWFormLabelAndSelect.vue'
	import MWAddTeamCheckbox from '../../../components/Forms/MWAddTeamCheckbox.vue'
	import MWAddTeamTeamMemberCheckbox from '../../../components/Forms/MWAddTeamTeamMemberCheckbox.vue'
	import MWFormLabelAndDatePicker from '../../../components/Forms/MWFormLabelAndDatePicker.vue'
	import MWFormLabelAndTimePicker from '../../../components/Forms/MWFormAndLabelTimePicker.vue'
	import MWFormLabelAndRadioInput from '../../../components/Forms/MWFormLabelAndRadioInput.vue'
	import MWFormLabelAndCheckbox from '../../../components/Forms/MWFormLabelAndCheckbox.vue'
	import MWFormTable from '../../../components/Forms/MWFormTable.vue'
	import { ref, computed, reactive, onBeforeMount, onMounted } from 'vue'
	import { useStorage } from '@vueuse/core'
	import { useRouter, useRoute } from 'vue-router'
	import { useStoreOwnerSupportTicket } from '../../../stores/Owner/storeOwnerSupportTickets'
	import { useStoreOwnerTeam } from '../../../stores/Owner/storeOwnerTeams'
	import { useStoreOwnerTeamTeamMember } from '../../../stores/Owner/storeOwnerTeamTeamMembers'
	import { useStoreOwnerAsset } from '../../../stores/Owner/storeOwnerAssets'
	import { useStoreUserInfo } from '../../../stores/storeUser'
	import { storeToRefs } from 'pinia'
	

	/* 
		Owner Team, Asset and Support Ticket Store
	*/

	const storeOwnerSupportTicket = useStoreOwnerSupportTicket()
	const storeOwnerTeam = useStoreOwnerTeam()
	const storeOwnerTeamTeamMember = useStoreOwnerTeamTeamMember()
	const storeOwnerAsset = useStoreOwnerAsset()
	const storeUser = useStoreUserInfo()

	const router = useRouter()
	const route = useRoute()
	
	const ownerSupportTicketData = reactive({
		teams: [],
		teamMembers: [],
		tableRows: [],
		previouslyReported: '',
		customerSatisfied: false,
		address: '',
		date: '',
		time: '',
		petsAllowed: '',
		entryAllowedIfAbsent: '',
		contactNumber: '',
		ongoing: true,
		completed: false,
		createdOn: new Date()
	})

	const state = useStorage('ownerTicketState', ownerSupportTicketData)

	const currentState = localStorage.getItem('ownerTicketState')

	const yesOrNoTypes = ref([
		{ 
			value: "yes", 
			label: "Yes" 
		}, 
		{ 
			value: "no", 
			label: "No"
		},
	])

	const ownerTeams = ref([])
	const team = ref({})
	const ownerTeamMembers = ref([])
	const members = ref([])
	const customerUrl = ref('')

	members.value = ownerSupportTicketData.teamMembers

	const teamMembers = ref([])

	onMounted(() => {
		storeOwnerAsset.getAssets()
		storeOwnerSupportTicket.getTickets()	
		storeUser.getUser()
	})

	while(ownerTeamMembers.value.length == 0 && ownerTeams.value.length == 0 ) {

		const { listenForTeams } = storeOwnerTeam
		const { listenForTeamMembers } = storeOwnerTeamTeamMember

		listenForTeams()
		listenForTeamMembers()

		const { teams: team } = storeToRefs(storeOwnerTeam)
		const { teamMembers: teamMember } = storeToRefs(storeOwnerTeamTeamMember);

		ownerTeams.value = team.value
		ownerTeamMembers.value = teamMember.value

		break
	}
	
 	const teamMembersForModal = (team) => {
		const members = ownerTeamMembers.value.filter(member => {
			return member.teamName == team
		})
		teamMembers.value = []
		teamMembers.value.push(members)
	}
	
	const addOwnerSupportTicket = () => {
		storeOwnerSupportTicket.addOwnerSupportTicket(state)
		.then(router.push('/owner-ticket-add-funding-source'))
	}
	
</script>

<style  scoped>
	
</style>