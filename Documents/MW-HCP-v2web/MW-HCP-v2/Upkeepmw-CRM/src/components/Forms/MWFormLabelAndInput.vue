<template>
	<label for="exampleInputEmail1" class="form-label">{{label}}</label>
  <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" class="shadow-sm form-control" :id="`exampleInputEmail${id}`">
</template>

<script setup>
import { ref } from 'vue'

defineProps({
	label: String,
	id: String,
	modelValue: String
})

defineEmits(['update:modelValue']);
</script>

<style scoped>

</style>