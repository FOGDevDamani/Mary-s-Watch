<template>
	<div>
		<h2>My Teams</h2>
		<div class="row mt-5 pt-2">
			<div class="col-sm-8"></div>
			<div class="col-sm-4">
				<AddCircleButton route="/sp-add-a-team"></AddCircleButton>
			</div>
		</div>

		<div class="ms-5 ps-1 mt-5 pt-2 row row-cols-sm-3 g-4">
			<div v-for="team in teamList" :key="team.id" class="col">
				<MWTeamCard  :profileImage="team.data.teamProfileImage" :label1="team.data.teamName" :label2="team.data.address" :label3="team.data.teamLead" route="SPTeamProfile" :id="team.id"></MWTeamCard>
			</div>
			
		</div>
		
	</div>
</template>

<script setup>
	import MWTeamCard from '../../../components/Cards/MWTeamCard.vue'
	import AddCircleButton from '../../../components/Forms/AddCircleButton.vue'
	import { onMounted } from 'vue'
	import { useStoreSPTeam } from '../../../stores/SP/storeSPTeams'
	import { useStoreUserInfo } from '../../../stores/storeUser'
	import axios from 'axios'
	import { storeToRefs } from 'pinia'

	const storeSPTeam = useStoreSPTeam()
	const storeUser = useStoreUserInfo()

	const { me: user } =  storeToRefs(storeUser)
	const { teams: teamList } =  storeToRefs(storeSPTeam)

	onMounted(() => {
		const currentUID = user.value.uid
		storeSPTeam.getTeams(currentUID)
	})
</script>

<style scoped>
	

</style>