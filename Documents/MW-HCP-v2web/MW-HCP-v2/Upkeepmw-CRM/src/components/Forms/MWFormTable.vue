<template>
	<div>
	<div class="table-responsive">
		<table class="shadow-sm table">
			<thead>
				<tr>
					<th scope="col">Type</th>
					<th scope="col">Unit#</th>
					<th scope="col">Room</th>
					<th scope="col">Description</th>
					<th scope="col">High Priority</th>
					<th scope="col">Photos</th>
					<th scope="col">Add/Remove Unit Entry Row</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="row in rows" :key="row">
					<td><input  @input="updateInputValue" id="1" v-model="row.type" /></td>
					<td><input @input="updateInputValue" id="3" v-model="row.unitNumber" /></td>
					<td><input @input="updateInputValue" id="5" v-model="row.roomNumber" /></td>
					<td><textarea @input="updateTextAreaValue" v-model="row.description"></textarea></td>
					<td ><input class="shadow-sm form-check-input ms-3 mt-4" @input="updateCheckboxValue" type="checkbox" id="inlineCheckbox1" :value="modelValue" v-model="row.highPriority"></td>
					<td><input  class="shadow-sm form-control form-control-sm" @change="onFileChange"  id="formFileSm" type="file"></td>
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
	type: '',
	unitNumber: '',
	roomNumber: '',
	description: '',
	highPriority: false,
	photos: []
}])

const addRow = () => {
	rows.value.push({
		type: '',
		unitNumber: '',
		roomNumber: '',
		description: '',
		highPriority: false,
		photos: null
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