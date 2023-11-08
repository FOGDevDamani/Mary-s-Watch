<template>
  <select class="shadow-sm form-select" :value="modelValue" @input="updateValue" :id="`exampleInputEmail${id}`" aria-label="Default select example">
		<option selected>Select Type</option>
		<option v-for="option in options" :key="option.label" :value="option.value">
			<p v-if="option.label && option.value">{{option.label}}</p>
			<p v-else>{{option.address}} {{option.city}}, {{option.state}} {{option.zipcode}}</p>
		</option>
	</select>
</template>

<script setup>
import { ref } from 'vue'

	const props = defineProps({
		label: String,
		id: String,
		options: [Object],
		modelValue: String
	})

	const value = ref("")
	
	let emit = defineEmits(['update:modelValue']);

	const updateValue = (event) => {
			emit('update:modelValue', event.target.value, )
	}
	
</script>

<style scoped>

</style>