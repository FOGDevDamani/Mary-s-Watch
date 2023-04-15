<template>
	<div class="row row-cols-3 mt-5 g-4">
		<div class="col">
			<div class="card">
				<img :src="props.image" class="card-img-top" alt="...">
				<div class="card-body">
					<h5 class="card-title">Card title</h5>
					<p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
				</div>

				<button type="button" class="btn btn-primary mx-5 my-4 button">View Storefront</button>
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps(['image'])

</script>

<style scoped>

</style>