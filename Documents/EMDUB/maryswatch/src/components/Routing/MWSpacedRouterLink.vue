<template>
		<router-link class="dropdown-item ms-3" :to="route">
			<slot></slot>
		</router-link>
</template>

<script setup>
	const props = defineProps(['route'])
</script>

<style scoped>

</style>