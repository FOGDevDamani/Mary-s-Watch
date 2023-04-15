<template>
	<label for="exampleInputEmail1" class="form-label">{{label}}</label>
  <input :value="modelValue" @input="updateValue" type="email" class="shadow-sm form-control" :id="`exampleInputEmail${id}`" aria-describedby="emailHelp">
</template>

<script setup>
import { ref } from 'vue'

	const props = defineProps({
		label: String,
		id: String,
		modelValue: String,
		value: String
	})

	const value = ref("")
	
	let emit = defineEmits(['update:modelValue']);

	const updateValue = (event) => {
			emit('update:modelValue', event.target.value)
	}
</script>

<style scoped>

</style>