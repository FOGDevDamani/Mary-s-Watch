<template>
	<div class="card">
		<img :src="profileImage" class="card-img-top" alt="...">
		<div class="underlined">
			Payment Option
		</div>
		<p class="card-text">{{label1}}</p>
		<div class="underlined">
			Address
		</div>
		<p class="card-text">{{label2}}</p>
		<div class="mb-4">
			<div class="underlined">
					Amount
				</div>
				{{label3}}
		</div>

		<div class="mb-4">
			<div class="underlined">
					For
				</div>
				{{label4}}
		</div>

		<div class="mb-4">
			<div class="underlined">
					Send Receipt?
				</div>
				{{label5}}
		</div>

		<div class="mb-4">
			<div class="underlined">
					Date?
				</div>
				{{label6}}
		</div>

		<!-- <button type="button" @click.prevent="$router.push({ name: `${route}`, params: { id: `${id}` } })" class="btn btn-primary mt-auto button">View Details</button> -->
	</div>
</template>

<script setup>
	import MWRouterLink from '../Routing/MWRouterLink.vue'

	const props = defineProps({
		profileImage: String,
		route: String,
		id: String,
		label1: String,
		label2: String,
		label3: String,
		label4: String,
		label5: String,
		label6: String
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