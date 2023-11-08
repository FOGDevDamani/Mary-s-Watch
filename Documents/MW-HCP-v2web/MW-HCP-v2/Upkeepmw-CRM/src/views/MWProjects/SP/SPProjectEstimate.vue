<template>
	<div>
		<h2 class="register">SP Estimate</h2>

		<div v-if="storeSPTeam.teams.length > 0 && storeOwnerAsset.assets.length > 0" >
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
					<div class="col-lg-5 mt-4 col-sm-8">
							<MWFormLabelAndRadioInput v-model="state.petsAllowed" label="Pets:" id="1"  :options="yesOrNoTypes" /> 
					</div>

					<div class="col-lg-5 mt-4 col-sm-8">
						<div>
							Job Type:
						</div>
						<MWFormLabelAndSelect v-model="state.jobType" id="1" label="Priority:" :options="jobType" />
					</div>
				</div>

				<div class="row mt-4">
					<div class="col-lg-5 mt-4 col-sm-8">
						<MWFormLabelAndInput v-model="state.room" label="Room:" />
					</div>

					<div class="col-lg-5 mt-4 col-sm-8">
						<div>
							Labor Type:
						</div>
						<MWFormLabelAndSelect v-model="state.laborType" id="2" label="Priority:" :options="laborType" />
					</div>
				</div>

				<div class="row mt-4">
					<div class="col-lg-5 mt-4 col-sm-8">
						<div>
							Number of Laborers:
						</div>
						<MWFormLabelAndSelect v-model="state.numberOfLaborers" id="3" label="Priority:" :options="numberOfLaborers" />
					</div>

					<div class="col-lg-5 mt-4 col-sm-8">
						<div>
							Number of Hours:
						</div>
						<MWFormLabelAndSelect v-model="state.numberOfHours" id="4" label="Priority:" :options="numberOfHours" />
					</div>
				</div>

				<div class="row mt-4">
					<div class="col-lg-5 mt-4 col-sm-8">
							<MWFormLabelAndRadioInput v-model="state.rate" label="Rate:" id="2"  :options="yesOrNoTypes" />
					</div>

					<div class="col-lg-5 mt-4 col-sm-8">
						<MWFormLabelAndInput v-model="state.amount" label="Amount:" />
					</div>
				</div>

				<div class="row mt-4">
					<div class="col-lg-5 mt-4 col-sm-8">
							<MWFormLabelAndRadioInput v-model="state.petsAllowed" label="Additional Costs:" id="3"  :options="yesOrNoTypes" />
					</div>

					
				</div>

				<div class="row mt-4">
					<div class="col-lg-5 col-sm-8 mr-3">
						<MWFormLabelAndTextArea v-model="state.problemDescription" label="Description:" placeholder="" />
						
					</div>
				</div>

				<hr class="my-5 dotted">

				<div class="row mt-4">
					<label for="" class="mb-2">Estimate Start Date:</label>
					<div class="col-lg-3 mt-1 mb-3 col-sm-4">
						<MWFormLabelAndDatePicker v-model="state.date" label="Preferred Date and Time:" />
					</div>
					<div class="col-sm-1"></div>
				</div>

				<hr class="my-5 dotted">

				<div class="my-4">
					Assign team(s) to ticket:
				</div>

				<div class="row row-cols-sm-2 row-cols-lg-3 g-4">
					<div class="col" v-for="team of spTeams" :key="team.id">
						<MWAddTeamCheckbox  v-model="state.teams" :profileImage="team.profileImage"  :label="{teamName: team.teamName, teamLead: team.teamLead}"  :option="team"></MWAddTeamCheckbox>
						<div v-if="state.teams.length > 0" >
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
												<MWAddTeamTeamMemberCheckbox v-model="state.teamMembers"  :profileImage="member.profileImage"  :label="{role: member.role, firstName: member.firstName, lastName: member.lastName, teamName: member.teamName }"  :option="member"></MWAddTeamTeamMemberCheckbox>
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
					<div class="col-6">
						<button class="btn btn-primary my-3" type="button">Cancel</button>
					</div>
					<!-- <div>
						<button @click.prevent="retrieveCustomer">get funding source</button>
					</div> -->
					<div class="col-6">
						<button type="button" @click.prevent="addSPSupportTicket" class="btn btn-primary my-3 button">Continue</button>
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
	import MWFormLabelAndTextArea from '../../../components/Forms/MWFormLabelAndTextArea.vue'
	import MWAddTeamTeamMemberCheckbox from '../../../components/Forms/MWAddTeamTeamMemberCheckbox.vue'
	import MWFormLabelAndDatePicker from '../../../components/Forms/MWFormLabelAndDatePicker.vue'
	import MWFormLabelAndTimePicker from '../../../components/Forms/MWFormAndLabelTimePicker.vue'
	import MWFormLabelAndRadioInput from '../../../components/Forms/MWFormLabelAndRadioInput.vue'
	import MWFormLabelAndCheckbox from '../../../components/Forms/MWFormLabelAndCheckbox.vue'
	import MWFormTable from '../../../components/Forms/MWFormTable.vue'
	import { ref, computed, reactive, onBeforeMount, onMounted } from 'vue'
	import { useStorage } from '@vueuse/core'
	import { useRouter, useRoute } from 'vue-router'
	import { useStoreSPEstimate } from '../../../stores/SP/storeSPEstimates'
	import { useStoreSPTeam } from '../../../stores/SP/storeSPTeams'
	import { useStoreSPTeamTeamMember } from '../../../stores/SP/storeSPTeamTeamMembers'
	import { useStoreOwnerAsset } from '../../../stores/Owner/storeOwnerAssets'
	import { useStoreUserInfo } from '../../../stores/storeUser'
	import { storeToRefs } from 'pinia'
	

	/* 
		Owner Team, Asset and Support Ticket Store
	*/

	const storeSPEstimate = useStoreSPEstimate()
	const storeSPTeam = useStoreSPTeam()
	const storeSPTeamTeamMember = useStoreSPTeamTeamMember()
	const storeOwnerAsset = useStoreOwnerAsset()
	const storeUser = useStoreUserInfo()

	const router = useRouter()
	const route = useRoute()
	
	const spSupportTicketData = reactive({
		teams: [],
		teamMembers: [],
		jobType: '',
		laborType: '',
		room: '',
		numberOfLaborers: '',
		numberOfHours: '',
		rate: '',
		amount: '',
		customerSatisfied: false,
		address: '',
		date: '',
		petsAllowed: '',
		problemDescription: '',
		ongoing: true,
		completed: false,
		createdOn: new Date()
	})

	const state = useStorage('spSupportTicketState', spSupportTicketData)

	const currentState = localStorage.getItem('spSupportTicketState')

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

	const numberOfLaborers = ref([
		{ value: "1-5", label: "1-5" },
		{ value: "5-10", label: "5-10" },
		{ value: "10+", label: "10+" }
	])

	const numberOfHours = ref([
		{ value: "1-6", label: "1-6" },
		{ value: "6-12", label: "6-12" },
		{ value: "12+", label: "12+" }
	])

	const jobType = ref([
		{ value: "remodel", label: "Remodel" },
    { value: "renovation",label: "Renovation" }
	])

	const laborType = ref([
		{ value: "a", label: "Type A" },
		{ value: "b", label: "Type B" },
		{ value: "c", label: "Type C" }
	])

	


	const spTeams = ref([])
	const team = ref({})
	const spTeamMembers = ref([])
	const members = ref([])
	const customerUrl = ref('')

	members.value = spSupportTicketData.teamMembers

	const teamMembers = ref([])

	onMounted(() => {
		storeOwnerAsset.getAssets()
		storeSPEstimate.getTickets()	
		storeUser.getUser()
	})

	while(spTeamMembers.value.length == 0 && spTeams.value.length == 0 ) {
		
		const { listenForTeams } = storeSPTeam
		const { listenForTeamMembers } = storeSPTeamTeamMember

		listenForTeams()
		listenForTeamMembers()

		const { teams: team } = storeToRefs(storeSPTeam)
		const { teamMembers: teamMember } = storeToRefs(storeSPTeamTeamMember);

		spTeams.value = team.value
		spTeamMembers.value = teamMember.value

		break
	}
 
 	const teamMembersForModal = (team) => {
		const members = spTeamMembers.value.filter(member => {
			return member.teamName == team
		})
		teamMembers.value = []
		teamMembers.value.push(members)
	}
	
	const addSPSupportTicket = () => {
		console.log(spSupportTicketData)
		storeSPEstimate.addSPSupportTicket(state)
		.then(router.push('/sp-project-add-materials'))
	}

	
</script>

<style  scoped>
	hr.dotted {
  border-top: 3px dotted rgb(36, 36, 234);
}
</style>