<template>
	<router-link class="nav-item remove-link-underline" :to="route">
			<slot></slot>
	</router-link>
</template>

<script setup>
	const props = defineProps(['route'])
</script>

<style scoped>
.remove-link-underline {
  text-decoration: none;
}
</style>