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
					<MWFormLabelAndSelect v-model="state.role" :options="roles" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="state.firstName" label="First Name:" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="state.lastName" label="Last Name:" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="state.email" label="Email:" />
				</div>
			</div>

			<div class="mt-4">
				<hr class="solid" />
			</div>

			<div class="row mt-4">
				<div class="col-lg-7 col-sm-12">
					<MWFormLabelAndInput v-model="state.address" label="Address" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="state.city" label="City" />
				</div>

				<div class="col-lg-5 col-sm-12 ml-3">
					<MWFormLabelAndInput v-model="state.state" label="State" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput  v-model="state.zipcode" label="Zipcode" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="state.phone" label="Cell Phone:" />
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
	import { RouterLink, RouterView, useRoute } from 'vue-router'
	import { onMounted } from 'vue'
	import { ref, computed, reactive} from 'vue'
	import { useStoreOwnerTeamTeamMember} from '../../../stores/Owner/storeOwnerTeamTeamMembers'
	import { useStorage } from '@vueuse/core'
	import { useStoreUserInfo } from '../../../stores/storeUser'
	import { storeToRefs } from 'pinia'


	const props = defineProps({
		teamName: String
	})

	const route = useRoute()

	const storeUser = useStoreUserInfo()
	const { me: user } = storeToRefs(storeUser)

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

	const state = useStorage('ownerTeamTeamMemberState', ownerTeamTeamMemberData)

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

	onMounted(() => {
		console.log(route.query.teamName)
	})
	
	/*
		Add owner customer
	*/
	const addOwnerTeamTeamMember = () => {
		if(ownerTeamTeamMemberData) {
			const ownerTeamTeamMember = {
				data: state,
				teamName: route.query.teamName,
				image: ownerTeamTeamMemberData.profileImage,
			}

			storeOwnerTeamTeamMember.addOwnerTeamTeamMember(ownerTeamTeamMember, user.value.uid)
		}
	}

</script>

<style scoped>

</style>