<template>
	<div>
		<nav class="navbar navbar-expand bg-white">
			<div class="container-fluid">
				<router-link class="navbar-brand" to="/">
					<img style="height: 150%; width: 150%;" src="https://storage.googleapis.com/testapp-ddf1a.appspot.com/UpdatedMWLogo_250x250.png" alt="MW Logo">
				</router-link>

				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>

				
				<div class="collapse navbar-collapse" id="navbarSupportedContent">
					<ul class="navbar-nav  ms-auto mb-2 mb-lg-0">
						<li class="nav-item">
							<MWRouterLink class="nav-link" :route="`/`">
								Home
							</MWRouterLink>
						</li>
						<li class="nav-item">
							<MWRouterLink v-if="!storeAuth.isLoggedIn" class="nav-link" :route="`/sign-up`">
								Signup
							</MWRouterLink>
						</li>
						<li class="nav-item">
							<MWRouterLink v-if="!storeAuth.isLoggedIn" class="nav-link" :route="`/login`">
								Login
							</MWRouterLink>
						</li>
						<li class="nav-item">
							<a href="#" v-if="storeAuth.isLoggedIn" class="nav-link" @click.prevent="storeAuth.logoutUser">
								Logout
							</a>
						</li>
						<li class="nav-item dropdown">
							<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" data-bs-offset="60,10" aria-expanded="false">
								<i class="bi bi-bell-fill"></i>
							</a>
							<ul class="dropdown-menu">
								<li><a class="dropdown-item" href="#">Action</a></li>
								<li><a class="dropdown-item" href="#">Another action</a></li>
								<li><hr class="dropdown-divider"></li>
								<li><a class="dropdown-item" href="#">Something else here</a></li>
							</ul>
						</li>
						<li class="nav-item">
							<MWRouterLink v-if="storeAuth.isLoggedIn" class="nav-link" :route="{name: 'MWUserDashboard', params: {id: currentUID}}">
								Dashboard
							</MWRouterLink>
							
						</li>
					</ul>
				</div>
			</div>
		</nav>
	</div>
</template>

<script setup>
import MWRouterLink from '../Routing/MWRouterLink.vue'
import { useStoreAuth } from '../../stores/storeAuth'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

	/* 
		Auth Store
	*/

	const storeAuth = useStoreAuth()

	const { userUID: uid } =  storeToRefs(storeAuth)

	var currentUID = ''

	onMounted(() => {
		currentUID = uid.value

	})

	const logout = () => {
		console.log('logging out')
	}

</script>

<style scoped>
.dropdown-toggle::after {
    display:none;
}
.remove-link-underline {
  text-decoration: none;
}
a{
	color: black
}
</style>