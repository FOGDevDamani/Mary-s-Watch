 <template>
	
		<VueTimePicker class="shadow-sm " v-model="time" placeholder="Select Time" :format="timeFormat"></VueTimePicker>

</template>

<script setup>
import { ref } from 'vue'
import VueTimePicker from "vue3-timepicker";
import "vue3-timepicker/dist/VueTimepicker.css";

	const time = ref({});

	const timeFormat = ref("hh:mm A");


	const props = defineProps(['label'])
	
</script>

<style scoped>

</style>