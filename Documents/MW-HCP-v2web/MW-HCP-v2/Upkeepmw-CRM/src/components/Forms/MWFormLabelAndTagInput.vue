<template>
	<div>
		<Vue3TagsInput class="shadow-sm " v-model="value" :tags="modelValue" add-tag-on-keys=[13] :placeholder="label" @on-tags-changed="handleChangeTag"></Vue3TagsInput>
	</div>
</template>

<script setup>
import Vue3TagsInput from 'vue3-tags-input';

	import { ref } from 'vue'

	const props = defineProps({
		label: String,
		modelValue: Array
	})

	const value = ref([])
	
	let emit = defineEmits(['update:modelValue']);

 	const handleChangeTag = (event) => {
    const selectedItemsCopy = [...event];
		emit('update:modelValue', selectedItemsCopy)
	}

</script>

<style scoped>

</style>