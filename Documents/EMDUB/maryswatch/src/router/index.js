import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import Index from '../views/Index.vue'
import SignUp from '../views/Auth/SignUp.vue'
import Login from '../views/Auth/Login.vue'
import ProjectManagement from '../views/MWProjects/ProjectManagement.vue'
import Breadbox from '../views/Breadbox.vue'
import BusinessDirectory from '../views/BusinessDirectory.vue'
import NewsFeed from '../views/NewsFeed.vue'
import PersonalProfile from '../views/MWProfile/PersonalProfile.vue'
import ProfileTeamView from '../views/MWProfile/ProfileTeamView.vue'
import ProfileCustomerView from '../views/MWProfile/ProfileCustomerView.vue'
import ProfileAssetView from '../views/MWProfile/ProfileAssetView.vue'
import PersonalVHSCard from '../views/MWProfile/PersonalVHSCard.vue'
import ProfileMessagesView from '../views/MWProfile/ProfileMessagesView.vue'
import ProfilePaymentsView from "../views/MWProfile/ProfilePaymentsView.vue";
import MakeAPayment from "../views/MWProjects/MakeAPayment.vue"

//renter 
import RenterProjectList from '../views/MWProjects/Renter/RenterProjectList.vue'
import RenterTeamList from '../views/MWProjects/Renter/RenterTeamList.vue'
import RenterPaymentList from '../views/MWProjects/Renter/RenterPaymentList.vue'
import RenterSupportTicket from "../views/MWProjects/Renter/RenterSupportTicket.vue"
import RenterAddATeam from '../views/MWProjects/Renter/RenterAddATeam.vue'
import RenterTeamProfile from '../views/MWProjects/Renter/RenterTeamProfile.vue'
import RenterTeamTeamMemberProfile from '../views/MWProjects/Renter/RenterTeamTeamMemberProfile.vue'
import RenterTeamAddATeamMember from '../views/MWProjects/Renter/RenterTeamAddATeamMember.vue'

//owner
import OwnerProjectList from '../views/MWProjects/Owner/OwnerProjectList.vue'
import OwnerTeamList from '../views/MWProjects/Owner/OwnerTeamList.vue'
import OwnerCustomerList from '../views/MWProjects/Owner/OwnerCustomerList.vue'
import OwnerPaymentList from '../views/MWProjects/Owner/OwnerPaymentList.vue'
import OwnerAssetList from '../views/MWProjects/Owner/OwnerAssetList.vue'
import OwnerSupportTicket from "../views/MWProjects/Owner/OwnerSupportTicket.vue"
import OwnerAddATeam from "../views/MWProjects/Owner/OwnerAddATeam.vue";
import OwnerAddACustomer from "../views/MWProjects/Owner/OwnerAddACustomer.vue"
import OwnerTeamProfile from "../views/MWProjects/Owner/OwnerTeamProfile.vue"
import OwnerCustomerProfile from "../views/MWProjects/Owner/OwnerCustomerProfile.vue"
import OwnerAddAAsset from "../views/MWProjects/Owner/OwnerAddAAsset.vue"
import OwnerAssetProfile from "../views/MWProjects/Owner/OwnerAssetProfile.vue"
import OwnerTeamTeamMemberProfile from "../views/MWProjects/Owner/OwnerTeamTeamMemberProfile.vue"
import OwnerTeamAddATeamMember from "../views/MWProjects/Owner/OwnerTeamAddATeamMember.vue"
import OwnerTicketAddFundingSource from "../views/MWProjects/Owner/OwnerTicketAddFundingSource.vue"
import OwnerTicketSummary from "../views/MWProjects/Owner/OwnerTicketSummary.vue"
import OwnerBehaviorTicket from "../views/MWProjects/Owner/OwnerBehaviorTicket.vue"

//sp
import SPAddATeam from '../views/MWProjects/SP/SPAddATeam.vue'
import SPProjectList from '../views/MWProjects/SP/SPProjectList.vue'
import SPTeamList from '../views/MWProjects/SP/SPTeamList.vue'
import SPCustomerList from '../views/MWProjects/SP/SPCustomerList.vue'
import SPPaymentList from '../views/MWProjects/SP/SPPaymentList.vue'
import SPStoreList from '../views/MWProjects/SP/SPStoreList.vue'
import SPProjectEstimate from "../views/MWProjects/SP/SPProjectEstimate.vue";
import SPAddACustomer from "../views/MWProjects/SP/SPAddACustomer.vue"
import SPTeamProfile from "../views/MWProjects/SP/SPTeamProfile.vue"
import SPCustomerProfile from "../views/MWProjects/SP/SPCustomerProfile.vue"
import SPTeamTeamMemberProfile from "../views/MWProjects/SP/SPTeamTeamMemberProfile.vue"
import SPTeamAddATeamMember from "../views/MWProjects/SP/SPTeamAddATeamMember.vue"
import SPProjectAddMaterials from "../views/MWProjects/SP/SPProjectAddMaterials.vue"
import SPProjectSummary from "../views/MWProjects/SP/SPProjectSummary.vue";
import SPOngoingProject from "../views/MWProjects/SP/SPOngoingProject.vue"


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "LandingPage",
      component: LandingPage,
    },
    {
      path: "/index",
      name: "Index",
      component: Index,
    },
    {
      path: "/sign-up",
      name: "SignUp",
      component: SignUp,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/news-feed",
      name: "NewsFeed",
      component: NewsFeed,
    },

    {
      path: "/business-directory",
      name: "BusinessDirectory",
      component: BusinessDirectory,
    },
    {
      path: "/bread-box",
      name: "Breadbox",
      component: Breadbox,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/personal-profile",
      name: "PersonalProfile",
      component: PersonalProfile,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "/vhs-card",
          name: "PersonalVHSCard",
          component: PersonalVHSCard,
        },
        {
          path: "/profile-messages",
          name: "ProfileMessagesView",
          component: ProfileMessagesView,
        },
        {
          path: "/teams",
          name: "ProfileTeamView",
          component: ProfileTeamView,
        },
        {
          path: "/customers",
          name: "ProfileCustomerView",
          component: ProfileCustomerView,
        },
        {
          path: "/payments",
          name: "ProfileCPaymentsView",
          component: ProfilePaymentsView,
        },
        {
          path: "/assets",
          name: "ProfileAssetView",
          component: ProfileAssetView,
        },
        // {
        //   path: "/submit-news",
        //   name: "SubmitNews",
        //   component: SubmitNews,
        // },
      ],
    },
    {
      path: "/project-management",
      redirect: { name: "RenterSupportTicket" },
      name: "ProjectManagement",
      component: ProjectManagement,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "/renter-project-list",
          name: "RenterProjectList",
          component: RenterProjectList,
        },
        {
          path: "/owner-project-list",
          name: "OwnerProjectList",
          component: OwnerProjectList,
        },
        {
          path: "/sp-project-list",
          name: "SPProjectList",
          component: SPProjectList,
        },
        {
          path: "/renter-teams",
          name: "RenterTeamList",
          component: RenterTeamList,
        },
        {
          path: "/owner-teams",
          name: "OwnerTeamList",
          component: OwnerTeamList,
        },
        {
          path: "/sp-teams",
          name: "SPTeamList",
          component: SPTeamList,
        },
        {
          path: "/renter-payments",
          name: "RenterPaymentList",
          component: RenterPaymentList,
        },
        {
          path: "/owner-payments",
          name: "OwnerPaymentList",
          component: OwnerPaymentList,
        },
        {
          path: "/sp-payments",
          name: "SPPaymentList",
          component: SPPaymentList,
        },
        {
          path: "/owner-assets",
          name: "OwnerAssetList",
          component: OwnerAssetList,
        },
        {
          path: "/sp-stores",
          name: "SPStoreList",
          component: SPStoreList,
        },
        {
          path: "/renter-support-ticket",
          name: "RenterSupportTicket",
          component: RenterSupportTicket,
        },
        {
          path: "/owner-support-ticket",
          name: "OwnerSupportTicket",
          component: OwnerSupportTicket,
        },
        {
          path: "/sp-estimate",
          name: "SPProjectEstimate",
          component: SPProjectEstimate,
        },
        {
          path: "/renter-add-a-team",
          name: "RenterAddATeam",
          component: RenterAddATeam,
        },
        {
          path: "/owner-add-a-team",
          name: "OwnerAddATeam",
          component: OwnerAddATeam,
        },
        {
          path: "/sp-add-a-team",
          name: "SPAddATeam",
          component: SPAddATeam,
        },
        {
          path: "/owner-customers",
          name: "OwnerCustomerList",
          component: OwnerCustomerList,
        },
        {
          path: "/sp-customers",
          name: "SPCustomerList",
          component: SPCustomerList,
        },
        {
          path: "/owner-add-a-customer",
          name: "OwnerAddACustomer",
          component: OwnerAddACustomer,
        },
        {
          path: "/sp-add-a-customer",
          name: "SPAddACustomer",
          component: SPAddACustomer,
        },
        {
          path: "/owner-team-profile/:id",
          name: "OwnerTeamProfile",
          component: OwnerTeamProfile,
          props: true,
        },
        {
          path: "/renter-team-profile/:id",
          name: "RenterTeamProfile",
          component: RenterTeamProfile,
          props: true,
        },
        {
          path: "/sp-team-profile/:id",
          name: "SPTeamProfile",
          component: SPTeamProfile,
          props: true,
        },
        {
          path: "/owner-customer-profile/:id",
          name: "OwnerCustomerProfile",
          component: OwnerCustomerProfile,
          props: true,
        },
        {
          path: "/sp-customer-profile/:id",
          name: "SPCustomerProfile",
          component: SPCustomerProfile,
          props: true,
        },
        {
          path: "/owner-add-a-asset",
          name: "OwnerAddAAsset",
          component: OwnerAddAAsset,
        },
        {
          path: "/owner-asset-profile/:id",
          name: "OwnerAssetProfile",
          component: OwnerAssetProfile,
          props: true,
        },
        {
          path: "/owner-team-team-member-profile/:id",
          name: "OwnerTeamTeamMemberProfile",
          component: OwnerTeamTeamMemberProfile,
          props: true,
        },
        {
          path: "/renter-team-team-member-profile/:id",
          name: "RenterTeamTeamMemberProfile",
          component: RenterTeamTeamMemberProfile,
          props: true,
        },
        {
          path: "/sp-team-team-member-profile/:id",
          name: "SPTeamTeamMemberProfile",
          component: SPTeamTeamMemberProfile,
          props: true,
        },
        {
          path: "/owner-team-add-a-team-member/:teamName",
          name: "OwnerTeamAddATeamMember",
          component: OwnerTeamAddATeamMember,
          props: true,
        },
        {
          path: "/renter-team-add-a-team-member",
          name: "RenterTeamAddATeamMember",
          component: RenterTeamAddATeamMember,
        },
        {
          path: "/sp-team-add-a-team-member",
          name: "SPTeamAddAteamMember",
          component: SPTeamAddATeamMember,
        },
        {
          path: "/owner-ticket-add-funding-source",
          name: "OwnerTicketAddFundingSource",
          component: OwnerTicketAddFundingSource,
        },
        {
          path: "/owner-ticket-summary",
          name: "OwnerTicketSummary",
          component: OwnerTicketSummary,
        },
        {
          path: "/sp-project-add-materials",
          name: "SPProjectAddMaterials",
          component: SPProjectAddMaterials,
        },
        {
          path: "/sp-project-summary",
          name: "SPProjectSummary",
          component: SPProjectSummary,
        },
        {
          path: "/sp-ongoing-project/:id",
          name: "SPOngoingProject",
          component: SPOngoingProject,
          props: true,
        },
        {
          path: "/make-a-payment",
          name: "MakeAPayment",
          component: MakeAPayment,
        },
        {
          path: "/owner-behavior-ticket",
          name: "OwnerBehvaiorTicket",
          component: OwnerBehaviorTicket,
        },
        // {
        //   path: "/profilecard/",
        //   name: "ProfilePersonalFileCard",
        //   component: ProfilePersonalFileCard
        // },
        // {
        //   path: "/project-management-form-card",
        //   name: "ProjectManagementFormCard",
        //   component: ProjectManagementFormCard
        // },
        // {
        //   path: "/project-action-cards",
        //   name: "ProjectActionCards",
        //   component: ProjectActionCards
        // },
        // {
        //   path: "/renter-profile",
        //   name: "RenterProfile",
        //   component: RenterProfile
        // },
        // {
        //   path: "/owner-profile",
        //   name: "OwnerProfile",
        //   component: OwnerProfile
        // },
        // {
        //   path: "/service-pro-profile",
        //   name: "ServiceProProfile",
        //   component: ServiceProProfile
        // },
        // {
        //   path: "/add-a-team-member",
        //   name: "AddATeamMember",
        //   component: AddATeamMember
        // },
        // {
        //   path: "/add-a-team-member-renter/:docId/:teamName",
        //   name: "AddTeamMemberRenter",
        //   component: AddTeamMemberRenter,
        //   props: true
        // },
        // {
        //   path: "/add-a-team-member-sp",
        //   name: "AddTeamMemberSP",
        //   component: AddTeamMemberSP,
        //   props: true
        // },
        // {
        //   path: "/add-team-and-team-members-to-renter-project",
        //   name: "AddTeamAndTeamMembersToRenterProject",
        //   component: AddTeamAndTeamMembersToRenterProject
        // },
        // {
        //   path: "/add-team-and-team-members-to-owner-project",
        //   name: "AddTeamAndTeamMembersToOwnerProject",
        //   component: AddTeamAndTeamMembersToOwnerProject
        // },
        // {
        //   path: "/add-a-property",
        //   name: "AddAProperty",
        //   component: AddAProperty
        // },
        // {
        //   path: "/add-a-customer",
        //   name: "AddACustomer",
        //   component: AddACustomer
        // },
        // {
        //   path: "/owner-support-ticket",
        //   name: "OwnerSupportTicket",
        //   component: OwnerSupportTicket
        // },
        // {
        //   path: "/renter-support-ticket",
        //   name: "RenterSupportTicket",
        //   component: RenterSupportTicket
        // },
        // {
        //   path: "/service-pro-support-ticket",
        //   name: "ServiceProSupportTicket",
        //   component: ServiceProSupportTicket
        // },
        // {
        //   path: "/project-team-member-list/:id",
        //   name: "ProjectTeamMemberList",
        //   component: ProjectTeamMemberList,
        //   props: true
        // },
        // {
        //   path: "/customer-list",
        //   name: "CustomerList",
        //   component: CustomerList
        // },
        // {
        //   path: "/add-a-payment",
        //   name: "AddAPayment",
        //   component: AddAPayment
        // },
        // {
        //   path: "/add-behavior-ticket",
        //   name: "AddBehaviorTicket",
        //   component: AddBehaviorTicket
        // },
        // {
        //   path: "/project-team-list",
        //   name: "ProjectTeamList",
        //   component: ProjectTeamList,
        //   props: true
        // },
        // {
        //   path: "/owner-customer-list",
        //   name: "OwnerCustomerList",
        //   component: OwnerCustomerList
        // },
        // {
        //   path: "/project-asset-list",
        //   name: "ProjectAssetList",
        //   component: ProjectAssetList
        // },
        // {
        //   path: "/add-a-team",
        //   name: "AddATeam",
        //   component: AddATeam
        // },
        // {
        //   path: "owner-project-list",
        //   name: "OwnerProjectList",
        //   component: OwnerProjectList
        // },
        // {
        //   path: "payments-list",
        //   name: "PaymentsList",
        //   component: PaymentsList
        // },
        // {
        //   path: "add-team-renter",
        //   name: "AddTeamRenter",
        //   component: AddTeamRenter
        // {
        //   path: "sp-project-list",
        //   name: "SPProjectList",
        //   component: SPProjectList
        // },
        // {
        //   path: "sp-store-list",
        //   name: "SPStoreList",
        //   component: SPStoreList
        // },
        // {
        //   path: "sp-team-list",
        //   name: "SPTeamList",
        //   component: SPTeamList
        // },
        // {
        //   path: "sp-project-customer-list",
        //   name: "SPProjectCustomerList",
        //   component: SPProjectCustomerList
        // },
        // {
        //   path: "owner-customer-profile/:docId",
        //   name: "OwnerCustomerProfile",
        //   component: OwnerCustomerProfile,
        //   props: true
        // },
        // {
        //   path: "sp-customer-profile/:docId",
        //   name: "SPCustomerProfile",
        //   component: SPCustomerProfile,
        //   props: true
        // },
        // {
        //   path: "add-team-sp",
        //   name: "AddTeamSP",
        //   component: AddTeamSP
        // },
        // {
        //   path: "add-customer-sp",
        //   name: "AddCustomerSP",
        //   component: AddCustomerSP
        // },
        // {
        //   path: "service-pro-team-profile/:docId/:teamName",
        //   name: "ServiceProTeamProfile",
        //   component: ServiceProTeamProfile,
        //   props: true
        // },
        // {
        //   path: "/owner-team-profile/:docId/:teamName",
        //   name: "OwnerTeamProfile",
        //   component: OwnerTeamProfile,
        //   props: true
        // },
        // {
        //   path: "edit-team-page",
        //   name: "EditTeamPage",
        //   component: EditTeamPage
        // },
        // {
        //   path: "current-owner-project",
        //   name: "CurrentOwnerProject",
        //   component: CurrentOwnerProject
        // },
        // {
        //   path: "history-owner-project",
        //   name: "HistoryOwnerProject",
        //   component: HistoryOwnerProject
        // },
        // {
        //   path: "current-renter-project",
        //   name: "CurrentRenterProject",
        //   component: CurrentRenterProject
        // },
        // {
        //   path: "history-renter-project",
        //   name: "HistoryRenterProject",
        //   component: HistoryRenterProject
        // },
        // {
        //   path: "renter-project-requests/:project",
        //   name: "RenterProjectRequests",
        //   component: RenterProjectRequests,
        //   props: true
        // },
        // {
        //   path: "current-sp-project",
        //   name: "CurrentSPProject",
        //   component: CurrentSPProject
        // },
        // {
        //   path: "history-sp-project",
        //   name: "HistorySPProject",
        //   component: HistorySPProject
        // },
        // {
        //   path: "renter-current-payments",
        //   name: "RenterCurrentPayments",
        //   component: RenterCurrentPayments
        // },
        // {
        //   path: "renter-history-payments",
        //   name: "RenterHistoryPayments",
        //   component: RenterHistoryPayments
        // },
        // {
        //   path: "maintenance-completion-report/:assetNetworkId",
        //   name: "MaintenanceCompletionReport",
        //   component: MaintenanceCompletionReport,
        //   props: true
        // },
        // {
        //   path: "completed-renter-project-requests/:project",
        //   name: "CompletedRenterProjectRequests",
        //   component: CompletedRenterProjectRequests,
        //   props: true
        // },
        // {
        //   path: "maintenance-progress-report",
        //   name: "MaintenanceProgressReport",
        //   component: MaintenanceProgressReport
        // },
        // {
        //   path: "sp-estimate-progress/:assetNetworkId",
        //   name: "SPEstimateProgress",
        //   component: SPEstimateProgress,
        //   props: true
        // },
        // {
        //   path: "sp-estimate-materials-page/:ticketNumber",
        //   name: "SPEstimateMaterialsPage",
        //   component: SPEstimateMaterialsPage,
        //   props: true
        // },
        // {
        //   path: "sp-estimate-summary/:ticketNumber/:rows",
        //   name: "SPEstimateSummary",
        //   component: SPEstimateSummary,
        //   props: true
        // },
        // {
        //   path: "sp-estimate-invoice-details/:docId",
        //   name: "SPEstimateInvoiceDetails",
        //   component: SPEstimateInvoiceDetails,
        //   props: true
        // },
        // {
        //   path: "sp-estimate-invoice-reminder/:docId",
        //   name: "SPEstimateInvoiceReminder",
        //   component: SPEstimateInvoiceReminder,
        //   props: true
        // },
        // {
        //   path: "sp-estimate-add-team-members-page/:ticketNumber",
        //   name: "SPEstimateAddTeamMembersPage",
        //   component: SPEstimateAddTeamMembersPage,
        //   props: true
        // },
        // {
        //   path: "sp-estimate-transaction-history/:ticketNumber",
        //   name: "SPEstimateTransactionHistory",
        //   component: SPEstimateTransactionHistory,
        //   props: true
        // },
        // {
        //   path: "/transaction-detail-page/:id/:address",
        //   name: "TransactionDetailPage",
        //   component: TransactionDetailPage,
        //   props: true
        // },
        // {
        //   path: "owner-payments",
        //   name: "OwnerPayments",
        //   component: OwnerPayments
        // },
        // {
        //   path: "renter-payments",
        //   name: "RenterPayments",
        //   component: RenterPayments
        // },
        // {
        //   path: "make-a-payment",
        //   name: "RenterMakeAPayment",
        //   component: RenterMakeAPayment
        // },
        // {
        //   path: "receive-a-payment",
        //   name: "RenterReceiveAPayment",
        //   component: RenterReceiveAPayment
        // },
        // {
        //   path: "renter-receipt-of-payment/:docId",
        //   name: "RenterReceiptOfPayment",
        //   component: RenterReceiptOfPayment,
        //   props: true
        // },
        // {
        //   path: "renter-payment-confirmation/:docId",
        //   name: "RenterPaymentConfirmation",
        //   component: RenterPaymentConfirmation,
        //   props: true
        // },
        // {
        //   path: "renter-payment-arrangement/:docId",
        //   name: "RenterPaymentArrangement",
        //   component: RenterPaymentArrangement,
        //   props: true
        // },
        // {
        //   path: "project-balance/:ticketNumber",
        //   name: "ProjectBalance",
        //   component: ProjectBalance,
        //   props: true
        // },
        // {
        //   path: "sp-payments",
        //   name: "SPPayments",
        //   component: SPPayments
        // },
        // {
        //   path: "renter-summmary-page",
        //   name: "RenterSummaryPage",
        //   component: RenterSummaryPage
        // },
        // {
        //   path: "make-cash-payment/:id/:address",
        //   name: "MakeCashPayment",
        //   component: MakeCashPayment,
        //   props: true
        // },
        // {
        //   path: "make-payment-arrangement/:id/:address",
        //   name: "MakePaymentArrangement",
        //   component: MakePaymentArrangement,
        //   props: true
        // },
        // {
        //   path: "create-payment-arrangement/:id/:address",
        //   name: "CreatePaymentArrangement",
        //   component: CreatePaymentArrangement,
        //   props: true
        // },
        // {
        //   path: "create-store",
        //   name: "CreateStore",
        //   component: CreateStore
        // },
        // {
        //   path: "create-store-coupons/:ticketNumber",
        //   name: "CreateStoreCoupons",
        //   component: CreateStoreCoupons,
        //   props: true
        // },
        // {
        //   path: "add-store-employees/:ticketNumber",
        //   name: "AddStoreEmployees",
        //   component: AddStoreEmployees,
        //   props: true
        // },
        // {
        //   path: "create-store-subscriptions/:ticketNumber",
        //   name: "CreateStoreSubscriptions",
        //   component: CreateStoreSubscriptions,
        //   props: true
        // },
        // {
        //   path: "create-store-products/:ticketNumber",
        //   name: "CreateStoreProducts",
        //   component: CreateStoreProducts,
        //   props: true
        // },
        // {
        //   path: "create-store-summary/:ticketNumber",
        //   name: "CreateStoreSummary",
        //   component: CreateStoreSummary,
        //   props: true
        // },
        // {
        //   path: "/renter-team-profile/:docId/:teamName",
        //   name: "RenterTeamProfile",
        //   component: RenterTeamProfile,
        //   props: true
        // }
      ],
    },
  ],
});

export default router
