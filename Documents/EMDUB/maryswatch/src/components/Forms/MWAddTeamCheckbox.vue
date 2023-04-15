<template>
	<div class="d-flex align-items-center">
		<div class="form-check form-check-inline">	
			<div class="flex-shrink-0">
				<input class="form-check-input" @change="updateValue" type="checkbox" :id="`inlineCheckbox${id}`" :value="option.teamName" :checked="modelValue.some(e => e.teamName === option.teamName)">
				<img class="shadow-sm img-thumbnail avatar" v-if="profileImage" :src="profileImage" alt="...">
			</div>

			<div class="flex-grow-1 ms-3 me-4">
				<label class="form-check-label" for="inlineCheckbox1">{{label.teamName}}</label>
				<div>Team lead: {{label.teamLead}}</div>
			</div>
		</div>
	</div>


	
</template>

<script setup>
import { ref } from 'vue'

	const props = defineProps({
		label: String, 
		profileImage: String,
		id: String,
		option: Object,
		modelValue: Array
	})

	const checked = ref(false)
	const value = ref([])
	
	let emit = defineEmits(['update:modelValue']);

	const updateValue = (event) => {
		
		const index = props.modelValue.indexOf(event.target.value);
		if (index !== -1 || event.target.checked == false) {
			props.modelValue.splice(index, 1);
		} else {
			const value = {
				teamName: event.target.value,
				checked: event.target.checked,
				profileImage: props.profileImage,
			}
			props.modelValue.push(value);
		}
		emit('update:modelValue', props.modelValue);
	}

</script>

<style scoped>
.avatar {
	vertical-align: middle;
	width: 125px;
	height: 125px;
	border-radius: 50%;
}
.down {
	position: relative;
	top: 17%;
}

</style>