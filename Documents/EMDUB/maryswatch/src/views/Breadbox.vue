<template>
	<div class="container">
		<h4 class="mt-5 mb-3 pb-3 pt-5">Breadbox</h4>
		<form>
			<div class="row justify-content-center mt-4">
				<div class="col-5 mr-3">
					<MWFormLabelAndInput :label="'Job#'" />
				</div>

				<div class="col-5 ml-3">
					<MWFormLabelAndInput :label="'Name'" />
				</div>
			</div>

			<div class="row justify-content-center mt-4">
				<div class="col-10">
					<MWFormLabelAndSelect :label="'Address'" />
				</div>
				
			</div>

			<div class="row justify-content-center mt-4">
				<div class="col-5 mr-3">
					<MWFormLabelAndInput :label="'Business Name'" />
				</div>

				<div class="col-5 ml-3">
					<MWFormLabelAndSelect :label="'Keyword'" />
				</div>
			</div>

			
			<button type="button" class="btn btn-primary ms-5 my-4 button">Retrieve Results</button>

		</form>

		<h6 class="mt-4 pt-4 ml-3 pl-3">Results:</h6>
	</div>
</template>

<script setup>
import MWFormLabelAndInput from '../components/Forms/MWFormLabelAndInput.vue'
import MWFormLabelAndSelect from '../components/Forms/MWFormLabelAndSelect.vue'
</script>

<style scoped>
.card {
  height: 17em;
}
.button {
	position: relative;
	left: 4.5%;
}
</style>