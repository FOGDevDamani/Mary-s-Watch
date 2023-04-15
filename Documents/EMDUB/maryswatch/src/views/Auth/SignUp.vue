<template>
	<div class="container">
		<h2 class="register">Register</h2>

		<form>
			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndFileInput v-model="userData.profileImage" label="Upload Image" />
					
				</div>
			</div>

			<div class="row my-4">
				<div class="col-lg-5 col-sm-12">
					<MWFormLabelAndRadioInput v-model="userData.accountType" label1="Choose Your Account Type"  label2="Business" label3="Personal" option1="business" option2="personal"/>
					
				</div>
			</div>

			<div class="row my-4">
				<div>
					Choose Your Perspective:
				</div>
				
				<div class="col-lg-5 col-sm-12">
					<MWFormLabelAndCheckboxWith3OrMoreOptions v-for="perspective of userPerspectives" :key="perspective.value" v-model="userData.userPerspective"  :label="perspective.label"  :option="perspective.value"/>
					
				</div>
			</div>

			<div class="row my-4">
				<div>
					Type of Owner:
				</div>

				<div class="col-lg-5 col-sm-12">
					<MWFormLabelAndSelect v-model="userData.perspective" :options="ownerTypes" />
					
				</div>
			</div>

			<!-- <DwollaAddBeneficialOwners /> -->

			<div class="row mt-4">
				<div>
					Type of Company:
				</div>

				<div class="col-lg-5 col-sm-12">
					<MWFormLabelAndSelect  v-model="userData.companyType" :options="typeOfCompany"/>
					
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="userData.licenseNumber" label="License Number" />
					
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="userData.firstName" label="First Name" />
					
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="userData.lastName" label="Last Name" />
				
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="userData.email" label="Email" />
	
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndTextArea v-model="userData.bio" placeholder="Enter bio here" label="Bio" />
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="userData.phone" label="Cell Phone" />
	
				</div>

				<div class="col-lg-5 col-sm-12 mt-4 ml-3">
					<div>
						<span class="me-2">Receive Alerts by</span> <span><i class="bi bi-exclamation-circle-fill"></i></span>
					</div>
					<MWFormLabelAndCheckboxWith2Options v-for="choice of textEmail" :key="choice.value" v-model="userData.textOrEmail"  :label="choice.label"  :option="choice.value" />
					
				</div>
			</div>

			<div class="mt-4">
				<hr class="solid" />
			</div>

			<div class="row mt-4">
				<div class="col-lg-7 col-sm-12">
					<MWFormLabelAndInput v-model="userData.address" label="Address" />
			
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="userData.city" label="City" />

				</div>

				<div class="col-lg-5 col-sm-12 ml-3">
					<MWFormLabelAndInput v-model="userData.state" label="State" />
	
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput  v-model="userData.zipcode" label="Zipcode" />
			
				</div>

				<div class="col-lg-5 col-sm-12 ml-3">
					<MWFormLabelAndInput v-model="userData.county" label="County" />
		
				</div>
			</div>

			<div class="mt-4">
				<hr class="solid" />
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="userData.username" label="Username" />
				
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput v-model="userData.password" label="Password" />
				
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-5 col-sm-12 mr-3">
					<MWFormLabelAndInput label="Confirm Password" />
				</div>
			</div>

			<div class="col-lg-5 col-sm-12 mt-4 ml-3">
					<MWFormLabelAndCheckbox  v-model="userData.agreedToTOC">
						By checking this box you agree to  <a class="link">Our Terms of Service</a>  and <a class="link">Privacy Policy</a> as well as our partner's <a class="link">Dwolla's Terms of Service</a>  and <a class="link">Privacy Policy</a>
					</MWFormLabelAndCheckbox>

					
			</div>

			<button type="button" @click.prevent="register" class="btn btn-primary my-5 button">Sign Up</button>
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
	

	/* 
		Auth Store
	*/

	const storeAuth = useStoreAuth()

	/* 
	User Data
	*/

	const userData = reactive({
		profileImage: null,
		agreedToTOC: false,
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
		password: '',
		createdOn: new Date()
	})
	
	if(userData.profileImage) {
		console.log('image', userData.profileImage)
	}
	

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
	Register User
	*/
	const register = () => {
		if(userData) {
			storeAuth.registerUser(userData)
		}
	}

	dwolla.configure({
      environment: "sandbox",
      // styles: "/styles/create-custom.css",
      success: (res) => Promise.resolve(),
      error: (err) => Promise.resolve(),
      token: (req) => Promise.resolve(dwollaAPIToken(req, {blah: "abcd"})),
  });

	function dwollaAPIToken(req, additional) {
  const tokenUrl = "http://localhost:4041/tokenUrl";
  const data = {
    action: req.action,
  };
  if (req.links) {
    data._links = req.links;
  }
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "Dwolla-Drop-Ins-Library",
  };
  return fetch(`${tokenUrl}`, {
    credentials: "include",
    method: "POST",
    body: JSON.stringify(data),
    headers,
  })
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
}
</script>

<style  scoped>

</style>