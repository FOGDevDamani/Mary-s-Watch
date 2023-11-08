<template>
	<div class="container-fluid" v-if="storeUser.me && user">
		<h2 class="my-5">Profile</h2>
		
		<div class="row">
			<div class="col-lg-4 col-sm-4">
				<MWRouterLink v-if="storeAuth.isLoggedIn" class="nav-link mb-3" :route="{name: 'EditProfile'}">
					Edit Profile
				</MWRouterLink>
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

					<MWRouterLink v-if="user.userPerspectives.includes('owner')" :route="`/customers`" >
						<button type="button" class="list-group-item list-group-item-action " aria-current="true">
							View Customer(s)
						</button>
					</MWRouterLink>

					<MWRouterLink v-if="user.userPerspectives.includes('owner')" :route="`/assets`" >
						<button type="button" class="list-group-item list-group-item-action " aria-current="true">
							View Asset(s)
						</button>
					</MWRouterLink>

					<MWRouterLink :route="`/payments`" >
						<button type="button" class="list-group-item list-group-item-action " aria-current="true">
							View Payments(s)
						</button>
					</MWRouterLink>

					<MWRouterLink :route="`/profile-messages`" >
						<button type="button" class="list-group-item list-group-item-action " aria-current="true">
							Messages
						</button>
					</MWRouterLink>
					
				</div>
			</div>


			<div class="mt-4 pt-2 col-lg-8 col-sm-8">
				<RouterView></RouterView>
			</div>
		</div>

		<div id="map" class="mt-4 pt-4 "></div>
	
	</div>
</template>

<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { onMounted } from 'vue'
import MWSpacedRouterLink from '../../components/Routing/MWSpacedRouterLink.vue'
import MWRouterLink from '../../components/Routing/MWRouterLink.vue'
import { useStoreUserInfo } from '../../stores/storeUser'
import { useStoreAuth } from '../../stores/storeAuth'
import { storeToRefs } from 'pinia'
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: "AIzaSyB4QrC50uBk1isfrALOALkJ3jx70zntkt4",
  version: "weekly",
  libraries: ["places"]
});

const mapOptions = {
  center: {
    lat: 0,
    lng: 0
  },
  zoom: 4,
	mapId: "44b501222c379de5"
};

const storeUser = useStoreUserInfo()
const storeAuth = useStoreAuth()

const { userUID: uid} =  storeToRefs(storeAuth)

const { me: user } = storeToRefs(storeUser)

let map;

async function initMap() {
  // Promise for a specific library
	loader
	.importLibrary('maps')
	.then(async ({Map}) => {
		const map = new Map(document.getElementById("map"), mapOptions);
		const {AdvancedMarkerElement} = await loader.importLibrary('marker');
		new AdvancedMarkerElement({map, position: mapOptions.center});
	})
	.catch((e) => {
		console.log(e)
	});

}


onMounted(() => {
	storeUser.getUser(uid.value)
	initMap()
})
</script>

<style scoped>
#map {
    height: 400px; /* The height is 400 pixels */
    width: 100%; /* The width is the width of the web page */
}
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