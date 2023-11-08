<template>
	<div class="d-flex align-items-center">
		<div class="form-check form-check-inline">	
			<div class="flex-shrink-0">
				<input class="form-check-input" :checked="checked" @change="updateValue" type="checkbox" id="inlineCheckbox1" :value="`${option.firstName} ${option.lastName}`">
				<img class="shadow-sm avatar" v-if="profileImage" :src="profileImage" alt="...">
			</div>
	
			<div class="flex-grow-1 mt-2 ms-3 me-4">
				<label class="form-check-label" for="inlineCheckbox1">{{label.firstName}} {{label.lastName}}</label>
				<div class="mt-2">Role: {{label.role}}</div>
			</div>

			<div class="mt-2 ms-3 ">
			Additonal Notes:	<textarea class="shadow-sm form-control" v-model="textAreaValue" :placeholder="`${placeholder}`" id="exampleFormControlTextarea1" rows="3"></textarea>
			</div>
		</div>
	</div>


	
</template>

<script setup>
import { ref } from 'vue'

	const props = defineProps({
		label: Object, 
		profileImage: String,
		placeholder: {
			type: String,
			default: ""
		},
		checked: Boolean,
		option: [Object],
		modelValue: Array
	})

	props.check = true

	const value = ref([])

		const textAreaValue = ref("")
	
	let emit = defineEmits(['update:modelValue']);

	const updateValue = (event) => {
		const index = props.modelValue.indexOf(event.target.value);
		if (index !== -1) {
			props.modelValue.splice(index, 1);
		} else {
			const value = {
				teamMemberName: event.target.value,
				profileImage: props.profileImage,
				notes: textAreaValue,
				teamName: props.label.teamName
			}
			props.modelValue.push(value);
		}
		emit('update:modelValue', props.modelValue);
	}

</script>

<style scoped>
.avatar {
	vertical-align: middle;
	width: 100px;
	height: 100px;
	border-radius: 50%;
}
.down {
	position: relative;
	top: 17%;
}

</style>