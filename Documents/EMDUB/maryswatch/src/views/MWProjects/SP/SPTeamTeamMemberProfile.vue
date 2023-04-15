<template>
	<div>
		<div class="row">
			<div class="col-lg-4 col-sm-4">
				<img :src="spTeamTeamMemberInformation.profileImage" class="img-thumbnail avatar" alt="...">
			</div>

			<div class="col-lg-0 col-sm-5">
					<h1>
						{{spTeamTeamMemberInformation.firstName}} {{spTeamTeamMemberInformation.lastName}}
					</h1>

					<p class="mt-4">
						{{spTeamTeamMemberInformation.role}}
					</p>

					<p class="mt-4">
						{{ spTeamTeamMemberInformation.email}}/{{spTeamTeamMemberInformation.cellPhone}}
					</p>

					<p class="mt-4">
						{{spTeamTeamMemberInformation.address}} {{spTeamTeamMemberInformation.city}} {{spTeamTeamMemberInformation.state}}, {{spTeamTeamMemberInformation.zipcode}}
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

 const props = defineProps({
	id: {
		type: String,
		required: true
	}
 })
 
	/* 
		SP Team Store
	*/

	const storeSPTeamTeamMember = useStoreSPTeamTeamMember()


const spTeamTeamMemberInformation = ref({})


spTeamTeamMemberInformation.value = storeSPTeamTeamMember.getSPTeamTeamMemberDetails(props.id)

 
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