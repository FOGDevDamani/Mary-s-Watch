<template>
	<div class="container">
		<h2 class="register">Add A Team Member</h2>

		<form>
			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndFileInput v-model="spTeamTeamMemberData.profileImage" label="Upload Team Member Profile Image" />					
				</div>
			</div>

			<div class="row mt-4">
				<div>
					Role:
				</div>

				<div class="col-lg-5 col-sm-12 mt-2">
					<MWFormLabelAndSelect v-model="spTeamTeamMemberData.role" :options="roles" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="spTeamTeamMemberData.firstName" label="First Name:" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="spTeamTeamMemberData.lastName" label="Last Name:" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="spTeamTeamMemberData.email" label="Email:" />
				</div>
			</div>

			<div class="mt-4">
				<hr class="solid" />
			</div>

			<div class="row mt-4">
				<div class="col-lg-7 col-sm-12">
					<MWFormLabelAndInput v-model="spTeamTeamMemberData.address" label="Address" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="spTeamTeamMemberData.city" label="City" />
				</div>

				<div class="col-lg-5 col-sm-12 ml-3">
					<MWFormLabelAndInput v-model="spTeamTeamMemberData.state" label="State" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput  v-model="spTeamTeamMemberData.zipcode" label="Zipcode" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="spTeamTeamMemberData.phone" label="Cell Phone:" />
				</div>
			</div>

			<button type="button" @click.prevent="addSPTeamTeamMember" class="btn btn-primary my-5 button">Add Team Member</button>
		</form>
	</div>
</template>

<script setup>
	import MWFormLabelAndInput from '../../../components/Forms/MWFormLabelAndInput.vue'
	import MWFormLabelAndFileInput from '../../../components/Forms/MWFormLabelAndFileInput.vue'
	import MWFormLabelAndSelect from '../../../components/Forms/MWFormLabelAndSelect.vue'
	import { ref, computed, reactive} from 'vue'
	import { useStoreSPTeamTeamMember} from '../../../stores/SP/storeSPTeamTeamMembers'


	/* 
		Owner Team Store
	*/

	const storeSPTeamTeamMember = useStoreSPTeamTeamMember()

	/* 
	Owner Team Data
	*/

	const spTeamTeamMemberData = reactive({
		profileImage: null,
		role: '',
		firstName: '',
		lastName: '',
		email: '',
		address: '',
		city: '',
		state: '',
		zipcode: '',
		phone: '',
		createdOn: new Date()
	})

	const roles = ref([
		{ 
			value: "project manager", 
			label: "Project Manager" 
		}, 
		{ 
			value: "general labor", 
			label: "General Labor"
		},
		{
			value: "handyman",
			label: "Handyman"
		},
		{
			value: "property manager", 
			label: "Property Manager"
		},
		{
			value: "customer support", 
			label: "Customer Support"
		},
		{
			value: "coordinator",
			label: "Coordinator"
		},
		{
			value: "delivery",
			label: "Delivery"
		}
	])
	
	/*
		Add owner customer
	*/
	const addSPTeamTeamMember = () => {
		if(spTeamTeamMemberData) {
			storeSPTeamTeamMember.addSPTeamTeamMember(spTeamTeamMemberData)
		}
	}

</script>

<style scoped>

</style>