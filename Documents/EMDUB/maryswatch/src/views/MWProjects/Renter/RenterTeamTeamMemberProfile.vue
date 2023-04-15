<template>
	<div>
		<div class="row">
			<div class="col-lg-4 col-sm-4">
				<img :src="renterTeamTeamMemberInformation.profileImage" class="img-thumbnail avatar" alt="...">
			</div>

			<div class="col-lg-0 col-sm-5">
					<h1>
						{{renterTeamTeamMemberInformation.firstName}} {{renterTeamTeamMemberInformation.lastName}}
					</h1>

					<p class="mt-4">
						{{renterTeamTeamMemberInformation.role}}
					</p>

					<p class="mt-4">
						{{ renterTeamTeamMemberInformation.email}}/{{renterTeamTeamMemberInformation.cellPhone}}
					</p>

					<p class="mt-4">
						{{renterTeamTeamMemberInformation.address}} {{renterTeamTeamMemberInformation.city}} {{renterTeamTeamMemberInformation.state}}, {{renterTeamTeamMemberInformation.zipcode}}
					</p>

					<p class="mt-4">
						
					</p>
			</div>
			
		</div>
	</div>
</template>

<script setup>
import { ref, computed, reactive} from 'vue'

import { useStoreRenterTeamTeamMember } from '../../../stores/Renter/storeRenterTeamTeamMembers'

 const props = defineProps({
	id: {
		type: String,
		required: true
	}
 })
 
	/* 
		SP Team Store
	*/

	const storeRenterTeamTeamMember = useStoreRenterTeamTeamMember()


const renterTeamTeamMemberInformation = ref({})


renterTeamTeamMemberInformation.value = storeRenterTeamTeamMember.getRenterTeamTeamMemberDetails(props.id)

 
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