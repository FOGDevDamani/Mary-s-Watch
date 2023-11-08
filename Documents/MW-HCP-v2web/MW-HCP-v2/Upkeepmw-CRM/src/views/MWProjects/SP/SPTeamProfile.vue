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

		<h3 class="mt-5">Team Members</h3>
		<div class="row mt-2">
			<div class="col-sm-8"></div>
			<div class="col-sm-4">
				<AddCircleButton v-if="team" :route="{ name: 'SPTeamAddATeamMember', query: { teamName: team.teamName } }" ></AddCircleButton>
			</div>
		</div>
		<div class="mt-2 row row-cols-sm-3 g-4">
			<div v-for="teamMember in teamMemberList" :key="teamMember.id" class="col">
				<MWTeamMemberCard v-if="teamMember.data.teamName == team.teamName" :profileImage="teamMember.data.profileImage" :firstName="teamMember.data.firstName" :lastName="teamMember.data.lastName" :phone="teamMember.data.phone" :email="teamMember.data.email" :role="teamMember.data.role" route="OwnerTeamTeamMemberProfile" :id="teamMember.id"></MWTeamMemberCard>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, reactive} from 'vue'
	import { onMounted } from 'vue'
	import { useStoreSPTeamTeamMember } from '../../../stores/SP/storeSPTeamTeamMembers'
	import MWTeamMemberCard from '../../../components/Cards/MWTeamMemberCard.vue'
	import AddCircleButton from '../../../components/Forms/AddCircleButton.vue'
	import { useStoreSPTeam } from '../../../stores/SP/storeSPTeams'
	import { useStoreUserInfo } from '../../../stores/storeUser'
	import { storeToRefs } from 'pinia'

	const storeSPTeam = useStoreSPTeam()
	const storeSPTeamTeamMember = useStoreSPTeamTeamMember()
	const storeUser = useStoreUserInfo()

	const { teamDetails: team } =  storeToRefs(storeSPTeam)
	const { teamMembers: teamMemberList } = storeToRefs(storeSPTeamTeamMember)
	const { me: user } =  storeToRefs(storeUser)
 	const props = defineProps({
		id: String
	})

	onMounted(() => {
	storeSPTeam.getTeamDetails(props.id)
	storeSPTeamTeamMember.getTeamMembers(user.value.uid)
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