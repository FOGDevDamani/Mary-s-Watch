<template>
	<label for="exampleInputEmail1" class="form-label">{{labelTitle}}</label>
	<div class="form-check form-check-inline">
		<input class="shadow-sm form-check-input" :checked="checked"  @change="updateValue" type="checkbox" id="inlineCheckbox1" :value="option">
		<label class="form-check-label" for="inlineCheckbox1">{{label}}</label>
	</div>
</template>

<script setup>
import { ref } from 'vue'

	const props = defineProps({
		label: String, 
		labelTitle: String,
		checked: Boolean,
		option: String,
		modelValue: Array
	})

const value = ref([])
	
	let emit = defineEmits(['update:modelValue']);

	const updateValue = (event) => {
		const selectedItemsCopy = [...props.modelValue];
		const index = selectedItemsCopy.indexOf(event.target.value);
		if (index !== -1) {
			selectedItemsCopy.splice(index, 1);
		} else {
			selectedItemsCopy.push(event.target.value);
		}
		emit('update:modelValue', selectedItemsCopy);
	}

</script>

<style scoped>

</style>