<template>
	<label for="formFileSm" class="form-label">{{label}}</label>
  <input class="shadow-sm form-control form-control-sm" @change="onFileChange" id="formFileSm" type="file">
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
	label: String,
	modelValue: Object
})

const value = ref("")
	
	let emit = defineEmits(['update:modelValue']);

	const updateValue = (files) => {
			emit('update:modelValue', files)
	}

const onFileChange = (e) => {
  var files = e.target.files || e.dataTransfer.files;
	
	for(const file of files) {
		updateValue(file)
	}
}

</script>

<style scoped>

</style>