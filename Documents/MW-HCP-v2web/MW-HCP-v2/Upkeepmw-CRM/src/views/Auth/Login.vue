<template>
	<div class="container">
		<h2 class="register mt-5 pt-5">Login</h2>

		<form >
			<div class="row justify-content-center mt-4">
				<div class="col-sm-12 col-lg-5 mr-3">
					<div class="mt-5"><MWFormLabelAndInput v-model="credentials.email" label="Email" /></div>
					<div class="mt-2"><MWFormLabelAndInput type="password" v-model="credentials.password"  label="Password" /></div>
					
					<MWRouterLink :route="`/sign-up`">
						Not registered? Sign up here.
					</MWRouterLink>
					
				</div>

				<div class="inline-block mt-2 centerButton">
					<i class="bi bi-facebook me-1"></i>
					<i class="bi bi-twitter me-1"></i>
					<i class="bi bi-google"></i>
				</div>
				
			</div>	
		</form>
		<button type="button" @click.prevent="login" class="btn btn-primary my-5 centerButton">Login</button>
	</div>
</template>

<script setup>
	import MWFormLabelAndInput from '../../components/Forms/MWFormLabelAndInput.vue'
	import MWRouterLink from '../../components/Routing/MWRouterLink.vue'
	import { ref, computed, reactive} from 'vue'
	import { useStoreAuth } from '../../stores/storeAuth'

	/* 
		Auth Store
	*/

	const storeAuth = useStoreAuth()


	/* 
	Credentials
	*/

	const credentials = reactive({
		email: '',
		password: ''
	})

	/*
	Login User
	*/
	const login = () => {
		if(credentials) {
			storeAuth.loginUser(credentials)
		}
		credentials.email = ''
		credentials.password = ''
	}
	
 
	
</script>

<style  scoped>
	.centerButton {
		position: relative;
		left: 40%;
	}
</style>