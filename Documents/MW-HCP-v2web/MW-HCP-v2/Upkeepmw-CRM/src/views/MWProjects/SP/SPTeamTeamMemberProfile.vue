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
	import { useStoreSPTeamTeamMember } from '../../../stores/SP/storeSPTeamTeamMembers'
	import { onMounted, onUpdated, onBeforeUpdate } from 'vue'
	import { storeToRefs } from 'pinia'
	
	const storeSPTeamTeamMember = useStoreSPTeamTeamMember()
	const {  teamMemberDetails: member } = storeToRefs(storeSPTeamTeamMember)

	const props = defineProps({
		id: {
			type: String,
			required: true
		}
	})

	onMounted(() => {
		storeSPTeamTeamMember.getTeamMemberDetails(props.id)
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