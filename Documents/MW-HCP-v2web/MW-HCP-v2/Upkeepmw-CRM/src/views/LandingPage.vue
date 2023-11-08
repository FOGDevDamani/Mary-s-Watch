<template>
	<div class="row">
      <div class="col"></div>

      <div class="col-sm-4 mt-5 pt-3 align-self-end">
        <ul class="nav flex-column nav-pills">
          <h4>
            <li class="nav-item cursor" data-bs-toggle="collapse" data-bs-target="#collapseUpkeep">Upkeepmw(CRM)</li>
          </h4>
          <ul class="nav flex-column nav-pills">
            <div class="collapse " id="collapseUpkeep">
              <h5>
                <li>
									<MWSpacedRouterLink :route="`/personal-profile`" >
										- Profiles
									</MWSpacedRouterLink>
									
								</li>
              </h5>
              <h5>
								<li>
									<MWSpacedRouterLink :route="`/profile-messages`" >
										- Messages
									</MWSpacedRouterLink>
								</li>

              </h5>
              <h5>
								<li>
									<MWSpacedRouterLink :route="`/news-feed`" >
										- Housing News
									</MWSpacedRouterLink>
								</li>
              </h5>
              <h5>
								<li>
									<MWSpacedRouterLink :route="`/business-directory`" >
										- Business Directory
									</MWSpacedRouterLink>
								</li>
              </h5>
              
            </div>
          </ul>
          <h4 class="mt-3 pt-3">
						<li>
							<MWRouterLink :route="`/project-management`">
								Projectsmw
							</MWRouterLink>
						</li>
          </h4>
					<h4 class="mt-3 pt-3">
						<li>
							<MWRouterLink :route="`/payments`">
								CoffeeCan(Payments)
							</MWRouterLink>
						</li>
          </h4>
          <h4 class="mt-3 pt-3">
						<li>
							<MWRouterLink :route="`/bread-box`">
								Breadbox
							</MWRouterLink>
						</li>
          </h4>
          <!-- <h4 class="mt-3 pt-3">
            <b-nav-item v-b-toggle.collapse-mobile-apps>Mobile Apps</b-nav-item>
          </h4>
          <b-nav pills vertical>
            <b-collapse id="collapse-mobile-apps" class="ml-3">
              <h5>
                <b-dropdown-item>- iOS</b-dropdown-item>
              </h5>
              <h5>
                <b-dropdown-item>- Android</b-dropdown-item>
              </h5>
            </b-collapse>
          </b-nav>
          <h4 class="mt-3 pt-3">
            <b-nav-item
              v-b-toggle.collapse-business-directory
              :to="{ name: 'Storefront' }"
              >Storefronts</b-nav-item
            >
          </h4>
          <b-nav pills vertical>
            <b-collapse id="collapse-business-directory" class="ml-3">
              <h5>
                <b-dropdown-item :to="{ name: 'Storefront' }"
                  >- Stores</b-dropdown-item
                >
              </h5>
            </b-collapse>
          </b-nav>
          <h4 class="mt-3 pt-3">
            <b-nav-item v-b-toggle.collapse-cloud>Cloud</b-nav-item>
          </h4>
          <b-nav pills vertical>
            <b-collapse id="collapse-cloud" class="ml-3">
              <h5>
                <b-dropdown-item :to="{ name: 'CDNSetup' }"
                  >- CDN</b-dropdown-item
                >
              </h5>
              <h5>
                <b-dropdown-item :to="{ name: 'APIFeed' }"
                  >- APIs</b-dropdown-item
                >
              </h5>
              <h5>
                <b-dropdown-item>- Storage</b-dropdown-item>
              </h5>
            </b-collapse>
          </b-nav>
          <h4 class="mt-3 pt-3"><b-nav-item>AI/ML</b-nav-item></h4>
          <h4 class="mt-3 pt-3"><b-nav-item>Settings</b-nav-item></h4> -->
        </ul>
      </div>
    </div>
</template>

<script setup>
import MWSpacedRouterLink from '../components/Routing/MWSpacedRouterLink.vue'
import MWRouterLink from '../components/Routing/MWRouterLink.vue'
import { useStoreUserInfo } from '../stores/storeUser'
import { useStoreAuth } from '../stores/storeAuth'
import { onMounted, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { User } from "../userclass"

const storeAuth = useStoreAuth()
const storeUser = useStoreUserInfo()

const { userUID: uid} =  storeToRefs(storeAuth)
const { me: user } = storeToRefs(storeUser)

onMounted(() => {
	 storeUser.getUser(uid.value)
})

</script>

<style scoped>
.column {
  position: relative;
  right: 1%;
}
.remove-link-underline {
  text-decoration: none;
}
.word-wrap {
  white-space: normal;
}
.dropdown-menu {
  width: 170px;
}

.dropdown-menu .dropdown-item {
  white-space: normal;
}

a{
	color: black
}

.cursor{
	cursor: pointer;
}
</style>