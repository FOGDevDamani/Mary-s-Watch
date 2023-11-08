<template>
	<div class="container">
		<h2 class="register">Add A Asset</h2>

		<form>
			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndFileInput v-model="ownerAssetData.assetImage" label="Upload Property Image" />					
				</div>
			</div>

			<div class="row my-4">
				<div>
					Type of Property:
				</div>

				<div class="col-lg-5 col-sm-12">
					<MWFormLabelAndSelect v-model="state.typeOfProperty" :options="assetTypes" />
				</div>
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

			<div class="my-4">
				Assign team(s) to this property:
			</div>

			<div class="row row-cols-sm-2 row-cols-lg-3 g-4">
				<div class="col" v-for="team of ownerTeams" :key="team.id">
					<MWAddTeamCheckbox  v-model="state.teams" :profileImage="team.profileImage"  :label="{teamName: team.teamName, teamLead: team.teamLead}"  :option="team"></MWAddTeamCheckbox>
				</div>
			</div>

			<div class="row my-4">
				<div class="col-lg-5 col-sm-12">
					<MWFormLabelAndRadioInput v-model="state.petsAccepted" label="Do you accept pets?" id="1"  :options="yesOrNoTypes"/>
					
				</div>
			</div>

			<div class="row my-4">
				<div class="col-lg-5 col-sm-12">
					<MWFormLabelAndRadioInput v-model="state.forSale" label="Is this property for sale?" id="3" :options="yesOrNoTypes"/>
					
				</div>
			</div>

			<div class="row my-4">
				<div class="col-lg-5 col-sm-12">
					<MWFormLabelAndRadioInput v-model="state.isShortTerm" label="Is this property a short term rental?"  id="5"  :options="yesOrNoTypes"/>
					
				</div>
			</div>

			<div v-if="state.isShortTerm == 'yes'" class="row my-4">
				<div>
					Select type of short term rental:
				</div>
				
				<div class="col-lg-5 col-sm-12">
					<MWFormLabelAndCheckboxWith3OrMoreOptions v-for="type of shortTermRentalTypes" :key="type.value" v-model="state.typeOfShortTerm"  :label="type.label"  :option="type.value"/>
					
				</div>
			</div>

				<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndTextArea v-model="state.parkingLocation" placeholder="Enter parking information here" label="Parking?" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-7 col-sm-12">
					<MWFormLabelAndInput v-model="state.email" label="Email" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-7 col-sm-12">
					<MWFormLabelAndInput v-model="state.phone" label="Phone" />
				</div>
			</div>

			<button type="button" @click.prevent="addOwnerAsset" class="btn btn-primary my-3 button">Add Asset</button>
		</form>
	</div>
</template>

<script setup>
	import MWFormLabelAndInput from '../../../components/Forms/MWFormLabelAndInput.vue'
	import MWFormLabelAndFileInput from '../../../components/Forms/MWFormLabelAndFileInput.vue'
	import MWFormLabelAndTextArea from '../../../components/Forms/MWFormLabelAndTextArea.vue'
	import MWFormLabelAndSelect from '../../../components/Forms/MWFormLabelAndSelect.vue'
	import MWFormLabelAndRadioInput from '../../../components/Forms/MWFormLabelAndRadioInput.vue'
	import MWAddTeamCheckbox from '../../../components/Forms/MWAddTeamCheckbox.vue'
	import MWFormLabelAndCheckboxWith3OrMoreOptions from '../../../components/Forms/MWFormLabelAndCheckboxWith3OrMoreOptions.vue'
	import { ref, computed, reactive, onMounted} from 'vue'
	import { useStorage } from '@vueuse/core'
	import { useStoreOwnerTeam } from '../../../stores/Owner/storeOwnerTeams'
	import { useStoreOwnerAsset } from '../../../stores/Owner/storeOwnerAssets'
	import { useStoreUserInfo } from '../../../stores/storeUser'
	import { storeToRefs } from 'pinia'

	const storeUser = useStoreUserInfo()
	const { me: user } = storeToRefs(storeUser)

	/* 
		Owner Team Store
	*/

	const storeOwnerTeam = useStoreOwnerTeam()

	const storeOwnerAsset = useStoreOwnerAsset()

	onMounted(() => {
		storeOwnerTeam.getTeams()
	})
	


	const assetTypes = ref([
		{ 
			value: "single-family", 
			label: "Single_Family" 
		}, 
		{ 
			value: "condo", 
			label: "Condo"
		},
		{
			value: "multi-family",
			label: "Multi-Family"
		},
		{
			value: "mobile home", 
			label: "Mobile Home"
		},
		{
			value: "commercial", 
			label: "Commercial"
		}
	])

	const shortTermRentalTypes = ref([
		{ 
			value: "airbnb", 
			label: "Airbnb" 
		}, 
		{ 
			value: "vrbo", 
			label: "Vrbo"
		}
	])

	const yesOrNoTypes = ref([
		{
			value: 'yes',
			label: 'Yes'
		},
		{
			value: 'no',
			label: 'No'
		}
	])

	const ownerTeams = ref([])

	ownerTeams.value = storeOwnerTeam.teams

	/* 
	Owner Team Data
	*/

	const ownerAssetData = {
		assetImage: null,
		typeOfProperty: '',
		petsAccepted: '',
		parkingLocation: '',
		email: '',
		address: 'addy',
		city: '',
		state: 'stsat',
		zipcode: '',
		forSale: '',
		teams: [],
		isShortTerm: '',
		typeOfShortTerm: '',
		phone: '',
	}

	const state = useStorage('assetState', ownerAssetData)

	const currentState = localStorage.getItem('assetState')

	const tags = ref([])
	
	/*
		Add owner Team
	*/
	const addOwnerAsset = () => {
		if(ownerAssetData) {
			const ownerAsset = {
				data: state,
				image: ownerAssetData.profileImage,
			}
			storeOwnerAsset.addOwnerAsset(user.value.uid, ownerAsset)
		}
	}

</script>

<style scoped>

</style>