<template>
	<div>
		<div class="ms-5 ps-1 mt-5 pt-2 row card-width">
			<MWCardWithMultipleLabelsAndImage label1="SP Payment 1" label2="111 OneZero Ave" label3="cuzskeeter@mail.com" label4="321-456-8767"></MWCardWithMultipleLabelsAndImage>
		</div>
		
	</div>
</template>

<script setup>
import MWTeamCard from '../../../components/Cards/MWTeamCard.vue'

</script>

<style scoped>
	@media only screen and (max-width: 576px) {
	.card-width {
		width: 500%;
	}
	.icon {
		position: relative;
		left: 150%;
	}
	.card-height {
		height: 40vh;
	}
}
</style>