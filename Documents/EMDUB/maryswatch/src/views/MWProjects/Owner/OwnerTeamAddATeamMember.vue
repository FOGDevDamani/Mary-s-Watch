<template>
	<div class="container">
		<h2 class="register">Add A Team Member</h2>

		<form>
			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndFileInput v-model="ownerTeamTeamMemberData.profileImage" label="Upload Team Member Profile Image" />					
				</div>
			</div>

			<div class="row mt-4">
				<div>
					Role:
				</div>

				<div class="col-lg-5 col-sm-12 mt-2">
					<MWFormLabelAndSelect v-model="ownerTeamTeamMemberData.role" :options="roles" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="ownerTeamTeamMemberData.firstName" label="First Name:" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="ownerTeamTeamMemberData.lastName" label="Last Name:" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="ownerTeamTeamMemberData.email" label="Email:" />
				</div>
			</div>

			<div class="mt-4">
				<hr class="solid" />
			</div>

			<div class="row mt-4">
				<div class="col-lg-7 col-sm-12">
					<MWFormLabelAndInput v-model="ownerTeamTeamMemberData.address" label="Address" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="ownerTeamTeamMemberData.city" label="City" />
				</div>

				<div class="col-lg-5 col-sm-12 ml-3">
					<MWFormLabelAndInput v-model="ownerTeamTeamMemberData.state" label="State" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput  v-model="ownerTeamTeamMemberData.zipcode" label="Zipcode" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="ownerTeamTeamMemberData.phone" label="Cell Phone:" />
				</div>
			</div>

			<button type="button" @click.prevent="addOwnerTeamTeamMember" class="btn btn-primary my-5 button">Add Team Member</button>
		</form>
	</div>
</template>

<script setup>
	import MWFormLabelAndInput from '../../../components/Forms/MWFormLabelAndInput.vue'
	import MWFormLabelAndFileInput from '../../../components/Forms/MWFormLabelAndFileInput.vue'
	import MWFormLabelAndSelect from '../../../components/Forms/MWFormLabelAndSelect.vue'
	import { ref, computed, reactive} from 'vue'
	import { useStoreOwnerTeamTeamMember} from '../../../stores/Owner/storeOwnerTeamTeamMembers'

	const props = defineProps({
		teamName: String
	})


	/* 
		Owner Team Store
	*/

	const storeOwnerTeamTeamMember = useStoreOwnerTeamTeamMember()

	/* 
	Owner Team Data
	*/

	const ownerTeamTeamMemberData = reactive({
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
		teamName: props.teamName,
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
	const addOwnerTeamTeamMember = () => {
		if(ownerTeamTeamMemberData) {
			storeOwnerTeamTeamMember.addOwnerTeamTeamMember(ownerTeamTeamMemberData)
		}
	}

</script>

<style scoped>

</style>