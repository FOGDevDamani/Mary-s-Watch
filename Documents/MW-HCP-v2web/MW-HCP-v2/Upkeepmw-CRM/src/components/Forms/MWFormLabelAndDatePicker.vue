
 <template>
	


		<Datepicker class="shadow-sm " placeholder="Select Date" v-model="date"></Datepicker>

		

</template>

<script setup>
	import { ref } from 'vue'
	import Datepicker from 'vue3-datepicker'


	const props = defineProps({
		label: String,
		option: String
	})

	const date = ref("")
	
	
	
</script>

<style scoped>

</style>