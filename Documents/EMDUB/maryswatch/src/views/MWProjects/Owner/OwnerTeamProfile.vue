<template>
	<div>
		<div class="row">
			<div class="col-lg-4 col-sm-4">
				<img :src="teamInformation.profileImage" class="img-thumbnail avatar" alt="...">
			</div>

			<div class="col-lg-0 col-sm-5">
					<h1>
						{{teamInformation.teamName}}
					</h1>

					<p class="mt-4">
						{{ teamInformation.teamLead}}
					</p>

					<p class="mt-4">
						{{teamInformation.address}} {{teamInformation.city}} {{teamInformation.state}}, {{teamInformation.zipcode}}
					</p>

					<p class="mt-4">
						
					</p>
			</div>
			
		</div>

		<h3 class="mt-5">Team Members</h3>
		<div class="row mt-2">
			<div class="col-sm-8"></div>
			<div class="col-sm-4">
				<AddCircleButton :route="`/owner-team-add-a-team-member/${teamInformation.teamName}`"></AddCircleButton>
			</div>
		</div>
		<div class="mt-2 row row-cols-sm-3 g-4">
			<div v-for="teamMember in storeOwnerTeamTeamMember.teamMembers" :key="teamMember.id" class="col">
				<MWTeamMemberCard :profileImage="teamMember.profileImage" :firstName="teamMember.firstName" :lastName="teamMember.lastName" :email="teamMember.email" :phone="phone" route="OwnerTeamTeamMemberProfile" :id="teamMember.id"></MWTeamMemberCard>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, reactive} from 'vue'
import { onMounted } from 'vue'
import { useStoreOwnerTeam } from '../../../stores/Owner/storeOwnerTeams'
import { useStoreOwnerTeamTeamMember } from '../../../stores/Owner/storeOwnerTeamTeamMembers'
import MWTeamMemberCard from '../../../components/Cards/MWTeamMemberCard.vue'
import AddCircleButton from '../../../components/Forms/AddCircleButton.vue'

 const props = defineProps({
	id: {
		type: String,
		required: true
	}
 })
	/* 
		SP Team Store
	*/

	const storeOwnerTeam = useStoreOwnerTeam()
	const storeOwnerTeamTeamMember = useStoreOwnerTeamTeamMember()

	onMounted(() => {
	storeOwnerTeam.getTeams()
	storeOwnerTeamTeamMember.getTeamMembers()
	})

const teamInformation = ref({})

teamInformation.value = storeOwnerTeam.getOwnerTeamDetails(props.id)

 
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