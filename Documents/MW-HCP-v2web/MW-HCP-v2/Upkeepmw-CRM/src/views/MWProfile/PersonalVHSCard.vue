<template>
	<div>
		<h2>VHS Card</h2> 

		

		<div class="card vhsCard">
			<!-- <div class="row">
				<div class="col">
					<input type="text">
				</div>
				
			</div> -->

			<div class="row mt-4">
				<div class="col-lg-4 col-sm-8">
					  <p class="card-text">{{storeUser.me.id}}</p>

						<p class="card-text">Name: {{storeUser.me.firstName}} {{storeUser.me.lastName}}</p>

						<p class="card-text">Address: {{storeUser.me.address}} {{storeUser.me.city}} {{storeUser.me.state}}, {{storeUser.me.fzipcode}} {{storeUser.me.county}}</p>

						<p class="card-text">Badges: </p>
						<div class="row row-cols-sm-2">
							<div class="col">
								<img v-for=" badge in storeUser.me.badges" :key="badge.name" :src="badge.badgeUrl" class="me-2 badges inline-block" alt="..." v-tippy="{ content: `${badge.name}`, arrow: true}">
							</div>
						</div>

						<p class="card-text mt-3">Points: {{storeUser.me.points}}</p>

						<p class="card-text">Summary: </p>
				</div>

				<div class="col-lg-8 col-sm-4">
					<p class="card-text underline">History</p>
					 
					<div class="mb-2">
						Payments: <span v-for="item in monthItems" :key="item.name">
							<span
								v-for="createdOnItem in item.createdOn"
								:key="createdOnItem.createdOn"
								
							>
							<!-- {{createdonItem}}
								<MWRouterLink :route="{ name: 'ProfileUserPaymentDetailPage', params: { id: createdOnItem.id } }"  class="inline-block" 	v-tippy="{ content: `${createdOnItem.createdOn}`, arrow: true, theme: 'translucent'}">
									<button
										id="cardButton"
										:class="shadeCircleColor(createdOnItem)"
									>
										{{ item.name }}
									</button>
								</MWRouterLink> -->

								<!-- <b-popover
									:target="`date-popover-${item.name}`"
									
									triggers="hover"
									placement="top"
								>
									<div>
										{{ createdOnItem.createdOn }}
									</div>
									<div>Amount Due: ${{ createdOnItem.amountDue }}</div>
								</b-popover> -->
							</span>
						</span>
					</div>
					
					<div>
						Maint: <span class="card-text me-2" v-for="project in project" :key="project">
						<span v-for="ticket in project.checklistItems" :key="ticket" >
							<!-- <MWRouterLink :route="{ name: 'ProfileUserTicketDetailPage', params: { id: project.id } }"  class="inline-block" 	v-tippy="{ content: `${ticket.address}`, arrow: true }">
									{{ticket.createdOn}}
							</MWRouterLink> -->
						</span>
					</span>
					</div>

					<div v-if="behaviorTicket">
						<div class="my-2">
							Behavior: <span class="card-text me-2" v-for="ticket in behaviorTicket" :key="ticket">
								<!-- <MWRouterLink :route="`/project-management`" class="inline-block" v-tippy="{ content: `${ticket.description}`, arrow: true}">
									{{ticket.createdOn}}
								</MWRouterLink> -->
							</span>
						</div>
					</div>
				
					<div v-if="commentTicket">
						<div class="my-2">
							Comments: <span class="card-text me-2" v-for="ticket in commentTicket" :key="ticket">
								<!-- <MWRouterLink :route="`/project-management`" class="inline-block" v-tippy="{ content: `${ticket.description}`, arrow: true}">
									{{ticket.createdOn}}
								</MWRouterLink> -->
						</span>
						</div>
					</div>

					<div v-if="reviewTicket">
						<div class="my-2">
							Reviews: <span class="card-text me-2" v-for="ticket in reviewTicket" :key="ticket">
								<!-- <MWRouterLink :route="`/project-management`" class="inline-block" v-tippy="{ content: `${ticket.description}`, arrow: true}">
									{{ticket.createdOn}}
								</MWRouterLink> -->
						</span>
						</div>
					</div>

					<div v-if="noteTicket">
						<div class="my-2">
							Notes: <span class="card-text me-2" v-for="ticket in noteTicket" :key="ticket">
								<!-- <MWRouterLink :route="`/project-management`" class="inline-block" v-tippy="{ content: `${ticket.description}`, arrow: true}">
									{{ticket.createdOn}}
								</MWRouterLink> -->
						</span>
						</div>
					</div>

					<div v-if="referralTicket">
						<div class="my-2">
							Referrals: <span class="card-text me-2" v-for="ticket in referralTicket" :key="ticket">
								<!-- <MWRouterLink :route="`/project-management`" class="inline-block" v-tippy="{ content: `Referred By: ${ticket.name}`, arrow: true}">
									{{ticket.createdOn}}
								</MWRouterLink> -->
						</span>
						</div>
				</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import PaymentsCardButton from '../../components/VHSCard/PaymentsCardButton.vue'
import MWSpacedRouterLink from '../../components/Routing/MWSpacedRouterLink.vue'
import MWRouterLink from '../../components/Routing/MWRouterLink.vue'
import { useStoreUserInfo } from '../../stores/storeUser'
import { useStoreOwnerSupportTicket } from '../../stores/Owner/storeOwnerSupportTickets'
import { useStoreRenterSupportTicket } from '../../stores/Renter/storeRenterSupportTickets'
import { useStoreOwnerBehaviorTicket } from '../../stores/Owner/storeOwnerBehaviorTicket'
import { useStoreOwnerPayment } from '../../stores/Owner/storeOwnerPayments'
import { useStoreRenterPayment } from '../../stores/Renter/storeRenterPayments'
import { useStoreOwnerCommentTicket } from '../../stores/Owner/storeOwnerCommentTicket'
import { useStoreOwnerNoteTicket } from '../../stores/Owner/storeOwnerNotesTicket'
import { useStoreOwnerReferralTicket } from '../../stores/Owner/storeOwnerReferralTicket'
import { useStoreOwnerReviewTicket } from '../../stores/Owner/storeOwnerReviewTicket'
import { useStoreAuth } from '../../stores/storeAuth'
import { storeToRefs } from 'pinia'
import { list } from 'firebase/storage'
import { ref, computed, onMounted, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
 import { useTippy} from 'vue-tippy'


const storeUser = useStoreUserInfo()
const storeOwnerSupportTicket = useStoreOwnerSupportTicket()
const storeOwnerPayment = useStoreOwnerPayment()
const storeRenterPayment = useStoreRenterPayment()
const storeRenterSupportTicket = useStoreRenterSupportTicket()
const storeOwnerBehaviorTicket = useStoreOwnerBehaviorTicket()
const storeOwnerCommentTicket = useStoreOwnerCommentTicket()
const storeOwnerNotesTicket = useStoreOwnerNoteTicket()
const storeOwnerReviewTicket = useStoreOwnerReviewTicket()
const storeOwnerReferralTicket = useStoreOwnerReferralTicket()
const storeAuth = useStoreAuth()

const { user: me } =  storeToRefs(storeAuth)
const { recentlySubmittedTicketId: docId, tickets: project, getRenterrSupportTicketDetails: ticket } =  storeToRefs(useStoreRenterSupportTicket)
const { tickets: behaviorTicket } = storeToRefs(storeOwnerBehaviorTicket)
const { tickets: noteTicket } = storeToRefs(storeOwnerNotesTicket)
const { tickets: reviewTicket } = storeToRefs(storeOwnerReviewTicket)
const { tickets: referralTicket } = storeToRefs(storeOwnerReferralTicket)
const { tickets: commentTicket } = storeToRefs(storeOwnerCommentTicket)
const { payments: payment } = storeToRefs(storeOwnerPayment)

const maintToolTip = ref(null);


const months = ref([
	{ name: "Jan" },
	{ name: "Feb" },
	{ name: "Mar" },
	{ name: "Apr" },
	{ name: "May" },
	{ name: "Jun" },
	{ name: "Jul" },
	{ name: "Aug" },
	{ name: "Sep" },
	{ name: "Oct" },
	{ name: "Nov" },
	{ name: "Dec" }
])

const monthItems = computed(() => {
	return months.value.map((e, i) => {
        const createdOn = getFilteredDate(i);
        return {
          ...e,
          createdOn
        };
      });
})

const router = useRouter()



/* 
	mounted
*/

onMounted(() => {
	const currentUID = me.value.uid
	storeOwnerPayment.listenForPayments()
	storeRenterPayment.getPayments(currentUID)
	storeOwnerBehaviorTicket.listenForBehaviorTickets()
	storeOwnerNotesTicket.listenForNoteTickets()
	storeOwnerReferralTicket.listenForReferralTickets()
	storeOwnerReviewTicket.listenForReviewTickets()
	storeOwnerCommentTicket.listenForCommentTickets()
	storeRenterSupportTicket.getTickets(currentUID)
})

const shadeCircleColor = (createdOnItem) => {
	return {
		"btn-circle btn-md red-shade": createdOnItem.daysTilLate == 0,
		"btn-circle btn-md darkorange-shade":
			createdOnItem.daysTilLate < 9 && createdOnItem.daysTilLate > 0,
		"btn-circle btn-md orange-shade":
			createdOnItem.daysTilLate < 16 && createdOnItem.daysTilLate > 9,
		"btn-circle btn-md yellow-shade":
			createdOnItem.daysTilLate < 23 && createdOnItem.daysTilLate > 16,
		"btn-circle btn-md green-shade":
			createdOnItem.daysTilLate <= 30 && createdOnItem.daysTilLate >= 23
	};
}

const getFilteredDate = (idx) => {
	return (
		payment.value.filter(payment => {
			var dates = new Date(payment.createdOn);
			const shortMonth = dates.getMonth();
			return shortMonth === idx;
		}) || []
	);
}

const getFilteredDaysTilLate = (idx) => {
	return this.payments.filter(payment => {});
}

</script>

<style  scoped>
	.vhsCard {
		width: 150%;
	}
	.badges {
		margin-left: 2px;
		width: 50px;
	}
	.underline {
		text-decoration: underline;
	}
	.btn-circle.btn-md {
		width: 30px;
		height: 30px;
		padding: 6px 0px;
		border-radius: 15px;
		text-align: center;
		font-size: 12px;
		line-height: 1.42857;
	}
	.btn-circle.btn-md.red-shade {
		background-color: rgb(199, 13, 13);
	}
	.btn-circle.btn-md.green-shade {
		background-color: green;
	}
	.btn-circle.btn-md.yellow-shade {
		background-color: rgb(233, 219, 23);
	}
	.btn-circle.btn-md.orange-shade {
		background-color: rgb(241, 112, 7);
	}
	.btn-circle.btn-md.darkorange-shade {
		background-color: rgb(177, 82, 5);
	}
</style>