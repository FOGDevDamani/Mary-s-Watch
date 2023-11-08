<template>
	<div class="form-check form-check-inline">
		<input class="shadow-sm form-check-input" @input="updateValue" type="checkbox" id="inlineCheckbox1" :value="modelValue">
		<label class="form-check-label" for="inlineCheckbox1"><slot></slot></label>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
	label: String,
	option: String,
	modelValue: Boolean
})

const value = ref("")
	
	let emit = defineEmits(['update:modelValue']);

	const updateValue = (event) => {
			emit('update:modelValue',  event.target.checked)
	}

</script>

<style scoped>

</style>