<template>
	<div>
	<div class="table-responsive">
		<table class="shadow-sm table">
			<thead>
				<tr>
					<th scope="col">Description</th>
					<th scope="col">Quantity</th>
					<th scope="col">Amount</th>
					
					<th scope="col">Add/Remove Materials Row</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="row in rows" :key="row">
					<td><textarea @input="updateTextAreaValue" v-model="row.description"></textarea></td>
					<td><input  @input="updateInputValue" id="1" v-model="row.quantity" /></td>
					<td><input @input="updateInputValue" id="3" v-model="row.amount" /></td>
					<td><button class="mt-3 me-1 btn btn-outline-dark btn-sm" @click.prevent="addRow">Add</button><button class="mt-3 ms-1 btn btn-outline-dark btn-sm" @click.prevent="removeRow(row)">Remove</button></td>
				</tr> 
			</tbody>
		</table>
	</div>

	</div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
	modelValue: String
})

const rows = ref([{
	quantity: '',
	amount: null,
	description: '',
}])

const addRow = () => {
	rows.value.push({
		quantity: '',
		amount: null,
		description: '',
	})
}

const removeRow = (row) => {
	// rows.value.pop()
	rows.value.splice(row, 1)
}

let emit = defineEmits(['update:modelValue']);
const tempArr = ref([])

	const updateInputValue = (event) => {
			emit('update:modelValue', rows.value)
	}

	const updateTextAreaValue = (event) => {
			emit('update:modelValue', rows.value)
	}

	const updateCheckboxValue = (event) => {
			emit('update:modelValue',  rows.value)
	}

	const updateFileInputValue = (files) => {
			emit('update:modelValue', files)
	}

const onFileChange = (e) => {
  var files = e.target.files || e.dataTransfer.files;
	
	for(const file of files) {
		updateFileInputValue(file)
	}
}
</script>

<style scoped>

</style>