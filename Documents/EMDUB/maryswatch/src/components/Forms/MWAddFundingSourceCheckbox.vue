<template>
	<div>
		<div class="card">
			<div class="card-header">
				{{label.id}}
			</div>
			<div class="card-body">
				<div class="form-check form-check-inline">	
					<div class="flex-shrink-0">
						<input class="form-check-input" :checked="checked" @change="updateValue" type="checkbox" id="inlineCheckbox1" :value="label.name">
					</div>
			
					<div class="flex-grow-1 ms-3 me-4">
						<label class="form-check-label" for="inlineCheckbox1">{{label.name}}</label>
						<h5 v-if="label.bankAccountType !== ''">Account Type: {{label.bankAccountType}}</h5> 
						<h5 v-if="label.balance !== ''">Account Balance: ${{ balance }}</h5>
					</div>
				</div>
			</div>
		</div>
		
	</div>


	
</template>

<script setup>
import { ref } from 'vue'

	const props = defineProps({
		label: Object, 
		profileImage: String,
		balance: String,
		checked: Boolean,
		option: [Object],
		modelValue: Array
	})

	props.check = true

	const value = ref([])
	
	let emit = defineEmits(['update:modelValue']);

	const updateValue = (event) => {
		const index = props.modelValue.indexOf(event.target.value);
		if (index !== -1) {
			props.modelValue.splice(index, 1);
		} else {
			const value = {
				name: event.target.value,
				balance: props.balance,
				bankAccountType: props.label.bankAccountType
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