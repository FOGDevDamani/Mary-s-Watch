<template>
	<div class="form-check">
		<label class="form-check-label" for="inlineRadio1">{{label2}}</label><span class="ms-2" v-if="label2 == 'Request An Arrangement'"><MWRouterLink :route="`/payments`">details</MWRouterLink></span>
 		<input class="shadow-sm form-check-input" @input="updateValue" type="radio" :name="`inlineRadioOptions${id1}`" id="inlineRadio1" :value="option">
	</div>
</template>

<script setup>
import { ref } from 'vue'
import MWRouterLink from '../../components/Routing/MWRouterLink.vue'

const props = defineProps({
	id1: String,
	label1: String, 
	label2: String, 
	option: String,
	modelValue: String
})

const value = ref("")
	
	let emit = defineEmits(['update:modelValue']);

	const updateValue = (event) => {
			emit('update:modelValue', event.target.value)
	}

</script>

<style scoped>

</style>