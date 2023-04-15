<template>
	<div>
		<h2>My Teams</h2>
		<div class="row mt-5 pt-2">
			<div class="col-sm-8"></div>
			<div class="col-sm-4">
				<AddCircleButton route="/owner-add-a-team"></AddCircleButton>
			</div>
		</div>

		<div class="ms-5 ps-1 mt-5 pt-2 row row-cols-sm-3 g-4">
			<div v-for="team in storeOwnerTeam.teams" :key="team.id" class="col">
				<MWTeamCard  :profileImage="team.profileImage" :label1="team.teamName" :label2="team.address" :label3="team.teamLead" route="OwnerTeamProfile" :id="team.id"></MWTeamCard>
			</div>
			
		</div>
		
	</div>
</template>

<script setup>
import MWTeamCard from '../../components/Cards/MWTeamCard.vue'
import AddCircleButton from '../../components/Forms/AddCircleButton.vue'
import { onMounted } from 'vue'

import { useStoreOwnerTeam } from '../../stores/Owner/storeOwnerTeams'


	/* 
		SP Team Store
	*/

	const storeOwnerTeam = useStoreOwnerTeam()

	onMounted(() => {
		storeOwnerTeam.getTeams()
	})

</script>

<style scoped>
	@media only screen and (max-width: 576px) {
	.card-width {
		width: 500%;
	}
	.icon {
		position: relative;
		left: 150%;
	}
	.card-height {
		height: 40vh;
	}
}
</style>