<template>
	<div class="card">
		<img :src="profileImage" class="card-img-top" alt="...">
		<div class="underlined">
			Name
		</div>
		<p class="card-text">{{firstName}} {{lastName}}</p>
		<div class="underlined">
			Address
		</div>
		<p class="card-text">{{address}}</p>
		<div class="mb-4">
			<div class="underlined">
					Contact
				</div>
				<span class="card-text">{{email}}</span>/<span class="card-text">{{cellPhone}}</span>
		</div>

		<button type="button" @click.prevent="$router.push({ name: `${route}`, params: { id: `${id}` } })" class="btn btn-primary mt-auto button">View Profile</button>
	</div>
</template>

<script setup>
	import MWRouterLink from '../Routing/MWRouterLink.vue'

	const props = defineProps({
		profileImage: String,
		route: String,
		id: String,
		firstName: String,
		lastName: String,
		address: String,
		email: String,
		cellPhone: String
		
	})
</script>

<style scoped>
	@media only screen and (max-width: 576px) {

		.icon {
			position: relative;
			left: 150%;
		}
	
	}

	.underlined {
		text-decoration: underline;
	}

	
</style>