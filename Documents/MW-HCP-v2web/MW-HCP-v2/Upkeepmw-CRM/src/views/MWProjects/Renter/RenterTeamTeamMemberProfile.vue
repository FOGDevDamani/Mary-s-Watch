<template>
	<div>
		<div class="row">
			<div class="col-lg-4 col-sm-4">
				<img :src="member.profileImage" class="img-thumbnail avatar" alt="...">
			</div>

			<div class="col-lg-0 col-sm-5">
					<h1>
						{{member.firstName}} {{member.lastName}}
					</h1>

					<p class="mt-4">
						{{member.role}}
					</p>

					<p class="mt-4">
						{{ member.email}}/{{member.cellPhone}}
					</p>

					<p class="mt-4">
						{{member.address}} {{member.city}} {{member.state}}, {{member.zipcode}}
					</p>

					<p class="mt-4">
						
					</p>
			</div>
			
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, reactive} from 'vue'
	import { onMounted, onUpdated, onBeforeUpdate } from 'vue'
	import { useStoreRenterTeamTeamMember } from '../../../stores/Renter/storeRenterTeamTeamMembers'
	import { storeToRefs } from 'pinia'
	const storeRenterTeamTeamMember = useStoreRenterTeamTeamMember()
	const {  teamMemberDetails: member } = storeToRefs(storeRenterTeamTeamMember)

	const props = defineProps({
		id: String,
	}) 
	onMounted(() => {
		storeRenterTeamTeamMember.getTeamMemberDetails(props.id)
	})
</script>

<style scoped>
.avatar {
	vertical-align: middle;
	width: 300px;
	height: 300px;
	border-radius: 50%;
}
.down {
	position: relative;
	top: 17%;
}
</style>