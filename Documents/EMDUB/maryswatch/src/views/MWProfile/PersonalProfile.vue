<template>
	<div class="container-fluid">
		<h2 class="my-5">Profile</h2>

		<div class="row">
			<div class="col-lg-4 col-sm-4">
				<img :src="storeUser.me.profileImage" class="img-thumbnail avatar" alt="...">
			</div>

			<div class="col-lg-0 col-sm-5">
					<button type="button" class="btn disabled btn-success btn-sm my-4">Online</button>
					<h1>{{storeUser.me.firstName}} {{storeUser.me.lastName}}</h1>

					<p class="mt-4">{{storeUser.me.bio}}</p>
					<div class="row row-col-sm-1">
						<div class="col"><button v-for="perspective of storeUser.me.perspective" :key="perspective" type="button" class="btn disabled btn-outline-primary btn-md mt-4 me-2">{{perspective}}</button></div>
					</div>
					
					<p>Badges</p>
					<div class="row row-cols-sm-2">
						<div class="col">
							<img v-for=" badge in storeUser.me.badges" :key="badge.name" :src="badge.badgeUrl" class="me-2 badges inline-block" alt="..." v-tippy="{ content: `${badge.name}`, arrow: true}">
						</div>
					</div>

					<p class="mt-3">Points</p>
					{{storeUser.me.points}}
			</div>

			
		</div>


		<div class="row mt-4 pt-4">
			<div class="mb-4 col-lg-3 col-sm-4">
				<div class="list-group down">
					<MWRouterLink :route="`/vhs-card`" >
						<button type="button" class="list-group-item list-group-item-action " aria-current="true">
							Virtual Housing Summary
						</button>
					</MWRouterLink>

					<MWRouterLink :route="`/teams`" >
						<button type="button" class="list-group-item list-group-item-action " aria-current="true">
							View Team(s)
						</button>
					</MWRouterLink>

					<MWRouterLink :route="`/customers`" >
						<button type="button" class="list-group-item list-group-item-action " aria-current="true">
							View Customer(s)
						</button>
					</MWRouterLink>

					<MWRouterLink :route="`/assets`" >
						<button type="button" class="list-group-item list-group-item-action " aria-current="true">
							View Asset(s)
						</button>
					</MWRouterLink>

					<MWRouterLink :route="`/payments`" >
						<button type="button" class="list-group-item list-group-item-action " aria-current="true">
							View Payments(s)
						</button>
					</MWRouterLink>

					<!-- <MWRouterLink :route="`/profile-messages`" >
						<button type="button" class="list-group-item list-group-item-action " aria-current="true">
							Messages
						</button>
					</MWRouterLink> -->
					
				</div>
			</div>


			<div class="mt-4 pt-2 col-lg-8 col-sm-8">
				<RouterView></RouterView>
			</div>
		</div>
	
	</div>
</template>

<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { onMounted } from 'vue'
import MWSpacedRouterLink from '../../components/Routing/MWSpacedRouterLink.vue'
import MWRouterLink from '../../components/Routing/MWRouterLink.vue'
import { useStoreUserInfo } from '../../stores/storeUser'

const storeUser = useStoreUserInfo()

/* 
	mounted
*/

onMounted(() => {
	storeUser.getUser()
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
.badges {
	margin-left: 2px;
	width: 50px
}
</style>