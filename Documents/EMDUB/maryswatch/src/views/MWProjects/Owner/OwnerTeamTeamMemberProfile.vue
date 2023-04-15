<template>
	<div>
		<div class="row">
			<div class="col-lg-4 col-sm-4">
				<img :src="ownerTeamTeamMemberInformation.profileImage" class="img-thumbnail avatar" alt="...">
			</div>

			<div class="col-lg-0 col-sm-5">
					<h1>
						{{ownerTeamTeamMemberInformation.firstName}} {{ownerTeamTeamMemberInformation.lastName}}
					</h1>

					<p class="mt-4">
						{{ownerTeamTeamMemberInformation.role}}
					</p>

					<p class="mt-4">
						{{ ownerTeamTeamMemberInformation.email}}/{{ownerTeamTeamMemberInformation.cellPhone}}
					</p>

					<p class="mt-4">
						{{ownerTeamTeamMemberInformation.address}} {{ownerTeamTeamMemberInformation.city}} {{ownerTeamTeamMemberInformation.state}}, {{ownerTeamTeamMemberInformation.zipcode}}
					</p>

					<p class="mt-4">
						
					</p>
			</div>
			
		</div>
	</div>
</template>

<script setup>
import { ref, computed, reactive} from 'vue'

import { useStoreOwnerTeamTeamMember } from '../../../stores/Owner/storeOwnerTeamTeamMembers'

 const props = defineProps({
	id: {
		type: String,
		required: true
	}
 })
 
	/* 
		SP Team Store
	*/

	const storeOwnerTeamTeamMember = useStoreOwnerTeamTeamMember()


const ownerTeamTeamMemberInformation = ref({})


ownerTeamTeamMemberInformation.value = storeOwnerTeamTeamMember.getOwnerTeamTeamMemberDetailsById(props.id)

 
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