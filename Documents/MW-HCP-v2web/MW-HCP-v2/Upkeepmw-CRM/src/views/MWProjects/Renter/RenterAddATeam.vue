<template>
	<div class="container">
		<h2 class="register">Add A Team</h2>

		<form>
			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndFileInput v-model="renterTeamData.profileImage" label="Upload Team Profile Image" />					
				</div>
			</div>


			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="renterTeamData.teamName" label="Team Name" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="renterTeamData.teamLead" label="Team Lead" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					Projects
					
					<MWFormLabelAndTagInput v-model="renterTeamData.projects" label="Type a project then press enter" :tag="tags" />
				</div>
			</div>

			<div class="mt-4">
				<hr class="solid" />
			</div>

			<div class="row mt-4">
				<div class="col-lg-7 col-sm-12">
					<MWFormLabelAndInput v-model="renterTeamData.address" label="Address" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="renterTeamData.city" label="City" />
				</div>

				<div class="col-lg-5 col-sm-12 ml-3">
					<MWFormLabelAndInput v-model="renterTeamData.state" label="State" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput  v-model="renterTeamData.zipcode" label="Zipcode" />
				</div>
			</div>

			<button type="button" @click.prevent="addRenterTeam" class="btn btn-primary my-5 button">Add Team</button>
		</form>
	</div>
</template>

<script setup>
	import MWFormLabelAndInput from '../../../components/Forms/MWFormLabelAndInput.vue'
	import MWFormLabelAndFileInput from '../../../components/Forms/MWFormLabelAndFileInput.vue'
	import MWFormLabelAndTagInput from '../../../components/Forms/MWFormLabelAndTagInput.vue'
	import { ref, computed, reactive} from 'vue'
	import { useStorage } from '@vueuse/core'
	import { useStoreRenterTeam } from '../../../stores/Renter/storeRenterTeams'
	import { storeToRefs } from 'pinia'
	import { useStoreUserInfo } from '../../../stores/storeUser'
	import { useStoreAuth } from '../../../stores/storeAuth'

	const storeUser = useStoreUserInfo()
	const storeAuth = useStoreAuth()

	const { userUID: uid} =  storeToRefs(storeAuth)

	const { me: user } =  storeToRefs(storeUser)


	/* 
		Renter Team Store
	*/

	const storeRenterTeam = useStoreRenterTeam()

	/* 
	Renter Team Data
	*/

	const renterTeamData = reactive({
		profileImage: null,
		projects: [],
		teamName: '',
		teamLead: '',
		address: '',
		city: '',
		state: '',
		zipcode: '',
		createdOn: new Date()
	})

	const tags = ref([])

	/*
		Add Renter Team
	*/
	const addRenterTeam = () => {
		if(renterTeamData) {
			storeRenterTeam.addRenterTeam(renterTeamData, uid.value)	
		}
	}
</script>

<style  scoped>

</style>