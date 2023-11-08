<template>
	<div>
		<div class="row">
			<div class="col-lg-4 col-sm-4">
				<img :src="team.profileImage" class="img-thumbnail avatar" alt="...">
			</div>

			<div class="col-lg-0 col-sm-5">
					<h1>
						{{team.teamName}}
					</h1>

					<p class="mt-4">
						{{ team.teamLead}}
					</p>

					<p class="mt-4">
						{{team.address}} {{team.city}} {{team.state}}, {{team.zipcode}}
					</p>

					<p class="mt-4">
						
					</p>
			</div>
		</div>
	
		<h3 class="mt-5" >Team Members</h3>
		<div class="row mt-2">
			<div class="col-sm-8"></div>
			<div class="col-sm-4">
				<AddCircleButton v-if="team" :route="{ name: 'RenterTeamAddATeamMember', query: { teamName: team.teamName } }" ></AddCircleButton>
			</div>
		</div>

			{{ teamMemberList }}
			
		<div class="mt-2 row row-cols-sm-3 g-4">
			<div v-for="teamMember in teamMemberList" :key="teamMember.renterTeamTeamMemberId" class="col">
				<MWTeamMemberCard v-if="teamMember.teamName == team.teamName" :profileImage="teamMember.teamMemberProfileImage" :firstName="teamMember.firstName" :lastName="teamMember.lastName" :phone="teamMember.phone" :email="teamMember.email" :role="teamMember.role" route="RenterTeamTeamMemberProfile" :id="teamMember.renterTeamTeamMemberId"></MWTeamMemberCard>
			</div>
		</div>
	</div>
		
</template>

<script setup>
	import { ref, computed, reactive} from 'vue'
	import MWTeamMemberCard from '../../../components/Cards/MWTeamMemberCard.vue'
	import AddCircleButton from '../../../components/Forms/AddCircleButton.vue'
	import { useStoreRenterTeam } from '../../../stores/Renter/storeRenterTeams'
	import { onMounted, onUpdated, onBeforeUpdate } from 'vue'
	import { useStoreRenterTeamTeamMember } from '../../../stores/Renter/storeRenterTeamTeamMembers'
	import { useStoreUserInfo } from '../../../stores/storeUser'
	import { storeToRefs } from 'pinia'

	const storeUser = useStoreUserInfo()
	const storeRenterTeam = useStoreRenterTeam()
	const storeRenterTeamTeamMember = useStoreRenterTeamTeamMember()

	const { teamDetails: team, teams: teamList } =  storeToRefs(storeRenterTeam)
	const { teamMembers: teamMemberList } = storeToRefs(storeRenterTeamTeamMember)
	const { me: user } =  storeToRefs(storeUser)

	var name = ref("")

	const props = defineProps({
		id: String,
	}) 

	onMounted(() => {
		console.log(props.id)
		storeRenterTeam.getTeamDetails(props.id)
		storeRenterTeamTeamMember.getTeamMembers(user.value.uid)
	 
	})
</script>

<style scoped>
.avatar {
	vertical-align: middle;
	width: 300px;
	height: 300px;
	border-radius: 50%;
}
.down {
	position: relative;
	top: 17%;
}
</style>