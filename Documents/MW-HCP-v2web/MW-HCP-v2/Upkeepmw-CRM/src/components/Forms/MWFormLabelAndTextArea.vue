<template>
	<label for="exampleFormControlTextarea1" class="form-label">{{label}}</label>
  <textarea class="shadow-sm form-control" :value="modelValue" @input="updateValue" :placeholder="`${placeholder}`" id="exampleFormControlTextarea1" rows="3"></textarea>

</template>

<script setup>
	const props = defineProps({
		label: String,
		placeholder: {
			type: String,
			default: ""
		},
		modelValue: String
	})

	import { ref } from 'vue'

	const value = ref("")
	
	let emit = defineEmits(['update:modelValue']);

	const updateValue = (event) => {
			emit('update:modelValue', event.target.value)
	}

</script>


<style scoped>

</style>