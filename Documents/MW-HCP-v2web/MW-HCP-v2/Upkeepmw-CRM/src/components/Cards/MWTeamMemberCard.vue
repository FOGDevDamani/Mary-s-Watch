<template>
	<div class="card">
		<img :src="profileImage" class="card-img-top" alt="...">
		<div class="underlined">
			Name
		</div>
		<p class="card-text">{{firstName}} {{lastName}}</p>
		<div class="mb-4">
			<div class="underlined">
					Contact
				</div>
				<span class="card-text">{{email}}</span>/<span class="card-text">{{phone}}</span>
		</div>
		<div class="underlined">
			Role
		</div>
		<p class="card-text">{{role}}</p>

		<button type="button" @click.prevent="$router.push({ name: `${route}`, params: { id: `${id}` } })" class="btn btn-primary mt-auto button">View Details</button>
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
		email: String,
		phone: String,
		role: String
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