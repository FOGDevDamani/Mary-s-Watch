<template>
	<div>
		<h2>My Teams</h2>
		<div class="row mt-5 pt-2">
			<div class="col-sm-8"></div>
			<div class="col-sm-4">
				<AddCircleButton route="/renter-add-a-team"></AddCircleButton>
			</div>
		</div>

		<div class="ms-5 ps-1 mt-5 pt-2 row row-cols-sm-3 g-4" >
			<div v-for="team in teamList" :key="team.renterTeamId" class="col">
				<MWTeamCard  :profileImage="team.teamProfileImage" :label1="team.teamName" :label2="team.address" :label3="team.teamLead" :id="team.renterTeamId" route="RenterTeamProfile"></MWTeamCard>
			</div>
			
		</div>
		
	</div>
</template>

<script setup>
import MWTeamCard from '../../../components/Cards/MWTeamCard.vue'
import AddCircleButton from '../../../components/Forms/AddCircleButton.vue'
import { ref, computed, reactive} from 'vue'
import { onMounted, onUpdated, onBeforeUpdate } from 'vue'
import { useStoreRenterTeam } from '../../../stores/Renter/storeRenterTeams'
import { useStoreUserInfo } from '../../../stores/storeUser'
import { useStoreAuth } from '../../../stores/storeAuth'
import axios from 'axios'
import { storeToRefs } from 'pinia'


	/* 
		SP Team Store
	*/

	const storeRenterTeam = useStoreRenterTeam()
	const storeUser = useStoreUserInfo()
	const storeAuth = useStoreAuth()

	var teamNames = reactive([])
	const { me: user } =  storeToRefs(storeUser)
	const { userUID: uid} =  storeToRefs(storeAuth)
	const { teams: teamList } =  storeToRefs(storeRenterTeam)


	onMounted(() => {
		const currentUserUID = uid.value
		storeRenterTeam.getTeams(currentUserUID)
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