<template>
	<div class="container">
		<h2 class="register">Add A Team</h2>

		<form>
			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndFileInput v-model="ownerTeamData.profileImage" label="Upload Team Profile Image" />					
				</div>
			</div>


			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="ownerTeamData.teamName" label="Team Name" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="ownerTeamData.teamLead" label="Team Lead" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					Projects
					
					<MWFormLabelAndTagInput v-model="ownerTeamData.projects" label="Type a project then press enter or space" :tag="tags" />
				</div>
			</div>

			<div class="mt-4">
				<hr class="solid" />
			</div>

			<div class="row mt-4">
				<div class="col-lg-7 col-sm-12">
					<MWFormLabelAndInput v-model="ownerTeamData.address" label="Address" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="ownerTeamData.city" label="City" />
				</div>

				<div class="col-lg-5 col-sm-12 ml-3">
					<MWFormLabelAndInput v-model="ownerTeamData.state" label="State" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput  v-model="ownerTeamData.zipcode" label="Zipcode" />
				</div>
			</div>

			<button type="button" @click.prevent="addOwnerTeam" class="btn btn-primary my-5 button">Add Team</button>
		</form>
	</div>
</template>

<script setup>
	import MWFormLabelAndInput from '../../../components/Forms/MWFormLabelAndInput.vue'
	import MWFormLabelAndFileInput from '../../../components/Forms/MWFormLabelAndFileInput.vue'
	import MWFormLabelAndTagInput from '../../../components/Forms/MWFormLabelAndTagInput.vue'
	import { ref, computed, reactive} from 'vue'
	import { useStorage } from '@vueuse/core'
	import { useStoreOwnerTeam } from '../../../stores/Owner/storeOwnerTeams'
	import { useStoreUserInfo } from '../../../stores/storeUser'
	import axios from 'axios'
	import { storeToRefs } from 'pinia'

	const storeUser = useStoreUserInfo()
	const storeOwnerTeam = useStoreOwnerTeam()

	const { me: user } =  storeToRefs(storeUser)

	const ownerTeamData = reactive({
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

	const state = useStorage('ownerTeamState', ownerTeamData)

	const currentState = localStorage.getItem('ownerTeamState')
	
	/*
		Add owner Team
	*/
	const addOwnerTeam = () => {
		if(ownerTeamData) {
			storeOwnerTeam.addOwnerTeam(ownerTeamData, user.value.uid)
		}
	}

</script>

<style scoped>

</style>