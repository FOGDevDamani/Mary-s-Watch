<template>
	<div>
		<h2 class="register">Edit Profile</h2>

		<form>
			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndFileInput v-model="editedUserData.profileImage" label="Upload Image" />
				</div>
			</div>

			<div class="row my-4">
				<div class="col-lg-5 col-sm-12">
					<MWFormLabelAndRadioInput v-model="editedUserData.accountType" label="Choose Your Account Type" id="3"  :options="businessOrPersonalTypes"/>
				</div>
			</div>

			<div class="row my-4">
				<div>
					Choose Your Perspective:
				</div>
				
				<div class="col-lg-5 col-sm-12">
					<MWFormLabelAndCheckboxWith3OrMoreOptions v-for="perspective of userPerspectives" :key="perspective.value" v-model="editedUserData.userPerspective"  :label="perspective.label"  :option="perspective.value"/>
				</div>
			</div>

			<div class="row my-4" v-if="editedUserData.userPerspective.includes('owner')"> 
				<div>
					Type of Owner:
				</div>

				<div class="col-lg-5 col-sm-12">
					<MWFormLabelAndSelect v-model="editedUserData.perspective" :options="ownerTypes" />
				</div>
			</div>

			<!-- <DwollaAddBeneficialOwners /> -->

			<div class="row mt-4" v-if="editedUserData.userPerspective.includes('owner')">
				<div>
					Type of Company:
				</div>

				<div class="col-lg-5 col-sm-12">
					<MWFormLabelAndSelect  v-model="editedUserData.companyType" :options="typeOfCompany"/>
				</div>
			</div>

			<div class="row mt-4" v-if="editedUserData.userPerspective.includes('owner')">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="editedUserData.licenseNumber" label="License Number" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="editedUserData.firstName" label="First Name" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="editedUserData.lastName" label="Last Name" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="editedUserData.email" label="Email" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndTextArea v-model="editedUserData.bio" placeholder="Enter bio here" label="Bio" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="editedUserData.phone" label="Cell Phone" />
				</div>

				<div class="col-lg-5 col-sm-12 mt-4 ml-3">
					<div>
						<span class="me-2">Receive Alerts by</span> <span><i class="bi bi-exclamation-circle-fill"></i></span>
					</div>
					<MWFormLabelAndCheckboxWith2Options v-for="choice of textEmail" :key="choice.value" v-model="editedUserData.textOrEmail"  :label="choice.label"  :option="choice.value" />
				</div>
			</div>

			<div class="mt-4">
				<hr class="solid" />
			</div>

			<div class="row mt-4">
				<div class="col-lg-7 col-sm-12">
					<MWFormLabelAndInput v-model="editedUserData.address" label="Address" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="editedUserData.city" label="City" />
				</div>

				<div class="col-lg-5 col-sm-12 ml-3">
					<MWFormLabelAndInput v-model="editedUserData.state" label="State" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput  v-model="editedUserData.zipcode" label="Zipcode" />
				</div>

				<div class="col-lg-5 col-sm-12 ml-3">
					<MWFormLabelAndInput v-model="editedUserData.county" label="County" />
				</div>
			</div>

			<div class="mt-4">
				<hr class="solid" />
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="editedUserData.username" label="Username" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="editedUserData.password" label="Password" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput label="Confirm Password" />
				</div>
			</div>

			<button type="button" @click.prevent="update(currentUID)" class="btn btn-primary my-5 button">Update</button>
		</form>
	</div>
</template>

<script setup>
	import MWFormLabelAndInput from '../../components/Forms/MWFormLabelAndInput.vue'
	import MWFormLabelAndSelect from '../../components/Forms/MWFormLabelAndSelect.vue'
	import MWFormLabelAndFileInput from '../../components/Forms/MWFormLabelAndFileInput.vue'
	import MWFormLabelAndTextArea from '../../components/Forms/MWFormLabelAndTextArea.vue'
	import MWFormLabelAndRadioInput from '../../components/Forms/MWFormLabelAndRadioInput.vue'
	import MWFormLabelAndCheckboxWith3OrMoreOptions from '../../components/Forms/MWFormLabelAndCheckboxWith3OrMoreOptions.vue'
	import MWFormLabelAndCheckboxWith2Options from '../../components/Forms/MWFormLabelAndCheckboxWith2Options.vue'
	import MWFormLabelAndCheckbox from '../../components/Forms/MWFormLabelAndCheckbox.vue'
	import DwollaAddBeneficialOwners from '../../components/Forms/DwollaAddBeneficialOwners.vue'
	import { ref, computed, reactive} from 'vue'
	import { useStoreAuth} from '../../stores/storeAuth'
	import { useStoreUserInfo } from '../../stores/storeUser'
	import { storeToRefs } from 'pinia'
	import { onMounted } from 'vue'
	import { User } from "../../userclass"

const storeUser = useStoreUserInfo()
const storeAuth = useStoreAuth()

const { userUID: uid} =  storeToRefs(storeAuth)

const { me: user } = storeToRefs(storeUser)

	/* 
	User Data
	*/

	const editedUserData = reactive({
		profileImage: null,
		userPerspective: [],
		textOrEmail: [],
		perspective: '',
		companyType: '',
		accountType: '',
		bio: '',
		phone: '',
		licenseNumber: '',
		firstName: '',
		lastName: '',
		address: '',
		city: '',
		state: '',
		zipcode: '',
		county: '',
		username: '',
		email: '',
		password: ''
	})
	
	if(editedUserData.profileImage) {
		console.log('image', editedUserData.profileImage)
	}

	const businessOrPersonalTypes = ref([
		{ 
			value: "personal", 
			label: "Personal"
		},
		{ 
			value: "business", 
			label: "Business" 
		}, 
	])
	

	const ownerTypes = ref([
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

	const userPerspectives = ref([
		{ 
			value: "renter", 
			label: "Renter" 
		}, 
		{ 
			value: "owner", 
			label: "Owner"
		},
		{ 
			value: "rental operator", 
			label: "Rental Operator"
		},
		{
			value: "service provider",
			label: "Service Provider"
		},
		{
			value: "nonprofit", 
			label: "Nonprofit"
		}
	])

	const textEmail = ref([
		{ 
			value: "text", 
			label: "Text" 
		}, 
		{ 
			value: "email", 
			label: "Email"
		},
	])

	const typeOfCompany = ref([
		{ 
			value: "llc", 
			label: "LLC" 
		}, 
		{ 
			value: "partnership", 
			label: "Partnership"
		},
		{
			value: "sole proprietorship",
			label: "Sole Proprietorship"
		},
		{
			value: "limited liability", 
			label: "Limited Liability"
		},
		{
			value: "limited partnership", 
			label: "Limited Partnership"
		},
		{
			value: "limited liability partnership", 
			label: "Limited Liability Partnership"
		},
		{
			value: "corporation", 
			label: "Corporation"
		},
		{
			value: "s-corp", 
			label: "S-Corp"
		},
		{
			value: "nonprofit", 
			label: "Nonprofit"
		}
	])

	/*
	Update User
	*/
	const update = () => {
		const user = new User(editedUserData.profileImage, editedUserData.userPerspective, editedUserData.companyType, editedUserData.accountType, editedUserData.bio, editedUserData.phone, editedUserData.licenseNumber, editedUserData.firstName, editedUserData.lastName, editedUserData.address, editedUserData.city, editedUserData.state, editedUserData.zipcode, editedUserData.county, editedUserData.username, editedUserData.email, editedUserData.password, editedUserData.createdOn, editedUserData.textOrEmail)
		if(user) {
			storeUser.editUser(uid.value, user)
		}
	}

	// dwolla.configure({
  //     environment: "sandbox",
  //     // styles: "/styles/create-custom.css",
  //     success: (res) => Promise.resolve(),
  //     error: (err) => Promise.resolve(),
  //     token: (req) => Promise.resolve(dwollaAPIToken(req, {blah: "abcd"})),
  // });

	// function dwollaAPIToken(req, additional) {
  // const tokenUrl = "http://localhost:4041/tokenUrl";
  // const data = {
  //   action: req.action,
  // };
  // if (req.links) {
  //   data._links = req.links;
  // }
  // const headers = {
  //   Accept: "application/json",
  //   "Content-Type": "application/json",
  //   "X-Requested-With": "Dwolla-Drop-Ins-Library",
  // };
  // return fetch(`${tokenUrl}`, {
  //   credentials: "include",
  //   method: "POST",
  //   body: JSON.stringify(data),
  //   headers,
  // })
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((result) => {
  //     return result;
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     return error;
  //   });
	// }
</script>


<style scoped>

</style>