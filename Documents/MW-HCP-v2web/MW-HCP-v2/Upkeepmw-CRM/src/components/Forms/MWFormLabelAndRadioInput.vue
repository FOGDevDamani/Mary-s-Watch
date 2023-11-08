<template>
	<label for="exampleInputEmail1" class="form-label me-2">{{label}}</label>
	<div class="form-check form-check-inline" v-for="option in options" :key="option">
		<label class="form-check-label" for="inlineRadio1">{{option.label}}</label>
 		<input class="shadow-sm form-check-input" @input="updateValue" type="radio" :name="`inlineRadioOptions${id}`" :id="`inlineRadio${id}`" :value="option.value"  >
	</div>
</template>

<script setup>
	import { ref } from 'vue'

	const props = defineProps({
		id: String,
		label: String,
		options: [Object],
		modelValue: String
	})

	const value = ref("")

	const checked = ref(false)

	let emit = defineEmits(['update:modelValue']);

	const updateValue = (event) => {
			emit('update:modelValue', event.target.value)
	}

</script>

<style scoped>

</style>