<template>
	<h1>
		<MWRouterLink class="dark" :route="route">
			<i class="bi bi-plus-circle"></i>
		</MWRouterLink>
	</h1>
</template>

<script setup>
import { ref, computed, reactive} from 'vue'
import MWRouterLink from '../Routing/MWRouterLink.vue'

const props = defineProps({
	route: String
})

</script>

<style scoped>
	.dark{
		color: rgb(28, 27, 27);
	}
</style>