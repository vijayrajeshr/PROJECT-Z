import React from "react";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminDashboardLayout from "./components/DashBoards/AdminDashboard/Admin/AdminDashboardLayout";
//import  RestaurantDashboardProtectedRoute from "./components/RestaurantDashboardProtectedRoute";
//import Unauthorized from "./pages/Unauthorized/Unauthorized";

import AddTiffin from "./pages/DashboardPages/TiffinPages/Add-Tiffin";
import DashboardHome from "./pages/DashboardPages/TiffinPages/DashboardHome";
import ManageTiffinSeeting from "./pages/DashboardPages/TiffinPages/ManageTiffinSeeting";
import EventBookingPage from "./pages/Booking-live-event/EventBookingPage.jsx";
import Orders from "./pages/DashboardPages/TiffinPages/Orders";
import TaxesAndChargesPage from "./pages/DashboardPages/TiffinPages/TaxesAndCharges";
import TiffinOffers from "./pages/DashboardPages/TiffinPages/TiffinOffers";
import ManageRestaurantSettings from "./components/RestaurantDasComponents/Dashboard/ManageSettingComponents/ManageRestaurantSettings";
import AddRestaurant from "./pages/AddRestaurant/AddRestaurant";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import GetTheApp from "./pages/GetTheApp/GetTheApp";
import RestaurantPage from "./pages/RestaurantPage/RestaurantPage";
import ShowCase from "./pages/ShowCase/ShowCase";
import SkipedPage from "./pages/SkipedPage/SkipedPage";
import User from "./pages/User/User";
import UserSettingsPage from "./pages/UserSettingsPage/UserSettingsPage";
import OrderPageSection from "./pages/OrderDeatilsCustomerSide/OrderPageSection";

import Dining from "./components/AddRestaurantComponents/AddRestaurantHeader/Dining";
import Fooddelieverydining from "./components/AddRestaurantComponents/AddRestaurantHeader/Fooddelieverydining";
import RestaurantRegistration from "./components/AddRestaurantComponents/AddRestaurantHeader/RestaurantRegistration";
import InvestorRelations from "./components/Navbars/InvestorsRelation/InvestorRelations";
import TestPage from "./pages/TestPage/TestPage";
import CollectionPage from "./pages/CollectionPage/CollectionPage";
import Blog from "./pages/Blog/Blog";
import ReportFraud from "./pages/Reportfraud/Reportfraud";
import MenuCarousel from "./components/RestaurantComponents/OrderBodyComponent/Components/MenuComponent/MenuCaraousel";
import WhoWeAre from "./pages/Whoweare/Whoweare";
import WorkWithUs from "./pages/Workwithus/WorkWithUs";

import AddToCart from "./pages/Addtocart/Addtocart";
import Cart from "./pages/Cart/Cart";
import BookingDetails from "./pages/BookingDetails/BookingDetails";
import Privacy from "./pages/Privacy/Privacy";
import Security from "./pages/Security/Security";
import Terms from "./pages/Terms/Terms";

import AllCategories from "./pages/Blog/AllCategories";
import Community from "./pages/Blog/Community";
import Company from "./pages/Blog/Company";
import Culture from "./pages/Blog/Culture";
import Technology from "./pages/Blog/Technology";

import LiveLocation from "./components/RestaurantComponents/OrderBodyComponent/Components/OrderOnlineTiffinFieldComponent/Livelocation";

import OrderHistory from "./components/RestaurantComponents/OrderBodyComponent/Components/OrderOnlineTiffinFieldComponent/OrderHistory";
import OrderNotificationBar from "./components/RestaurantComponents/OrderBodyComponent/Components/OrderOnlineTiffinFieldComponent/OrderNotificationComponet";
import TiffinServiceComponent from "./components/RestaurantComponents/OrderBodyComponent/Components/OrderOnlineTiffinFieldComponent/OrderOnlineTiffinFieldComponent";
import TiffinCheckoutPage from "./components/RestaurantComponents/OrderBodyComponent/Components/OrderOnlineTiffinFieldComponent/TifinCheckoutComponet";
import { CheckoutProvider } from "./context/CheckoutProvider";

import Homepage from "./pages/Homepage/Homepage";
import RestaurantListSection from "./components/ClaimRestaurantComponents/RestaurantListSection";
import RestaurantClaimForm from "./components/ClaimRestaurantComponents/RestaurantClaimForm";
import SuccessPage from "./components/ClaimRestaurantComponents/success";
import ClaimsList from "./components/ClaimRestaurantComponents/ClaimsList";

import RestaurentDasBoardLayout from "./layouts/restaurentDasLayout/DashboardLayout";
import DeliveryMenu from "./pages/RestaurantDasPages/DeliveryMenu";
import RestaurantDashboard from "./components/RestaurantDasComponents/Dashboard/RestaurantDashboard";
import AddItemForm from "./components/RestaurantDasComponents/Dining_Takeaway_Menu_Management/AddItemForm";
import DineInMenu from "./pages/RestaurantDasPages/DineInMenu";
import RestaurantOffers from "./pages/RestaurantDasPages/Offers";
import OutletDashboard from "./components/RestaurantDasComponents/OutletSetting/OutletDashboard";
import Outlet from "./components/RestaurantDasComponents/OutletSetting/Outlet";
import OutletInfo from "./pages/RestaurantDasPages/OutletInfo";
import RestaurantTaxesAndCharges from "./components/RestaurantDasComponents/TaxesAndCharges/TaxAndCharges";
import OrderManag from "./components/RestaurantDasComponents/OrderManage/OrderManag";
import RestaurantReviews from "./components/RestaurantDasComponents/RestaurantReviews/RestaurantReviews";

import AllOutletdata from "./components/RestaurantDasComponents/Dashboard/AllOutletdata/AllOutletdata";
import { OperatingHoursSection } from "./components/RestaurantDasComponents/OperatingHoursSection/OperatingHoursSection";

//admin dashbord pages
import AdminDashboradForAnalytics from "./pages/DashboardPages/AdminPages/DashboardAnalytics";
import Help from "./pages/DashboardPages/AdminPages/Help";
import RestaurantList from "./pages/DashboardPages/AdminPages/RestaurantList";
import EventList from "./pages/DashboardPages/AdminPages/EventList";
import UserAccessControl from "./pages/DashboardPages/AdminPages/UserAccessControl";
import FormSwitch from "./components/DashBoards/AdminDashboard/Form/index/FormSwitch";

import Notifications from "./pages/DashboardPages/AdminPages/Notifications";
import HistoryLogs from "./pages/DashboardPages/AdminPages/HistoryLogs";
import Analytics from "./pages/DashboardPages/AdminPages/Analytics";
import OrderManagement from "./pages/DashboardPages/AdminPages/OrderManagement";
import UserManagement from "./pages/DashboardPages/AdminPages/UserManagement";
import Support from "./pages/DashboardPages/AdminPages/Support";
import ManageAdmin from "./pages/DashboardPages/AdminPages/ManageAdmin";
import OrderDetails from "./cards/OrderDetails";

import NotificationsRes from "./components/RestaurantDasComponents/Dashboard/Notification";
import HelpDas from "./pages/RestaurantDasPages/support";
import RestaurantHelp from "./pages/RestaurantDasPages/Help";
import AddRestaurantInterface from "./components/DashBoards/AdminDashboard/Form/AddRestaurant";
import ClaimRestaurant from "./pages/DashboardPages/AdminPages/ClaimRestaurant";
import CollectionManagement from "./pages/DashboardPages/AdminPages/CollectionManagement";
import Offers from "./pages/DashboardPages/AdminPages/Offers";
import TaxesAndCharges from "./pages/DashboardPages/AdminPages/TaxesAndCharges";
import EventManagement from "./pages/DashboardPages/AdminPages/EventManagement";
import AddTiffinInterface from "./pages/DashboardPages/AdminPages/AdminAddTiffin";
import TiffinRegistrationForm from "./components/DashBoards/AdminDashboard/Form/Tiffin/TiffinRegistrationForm";
import MessageDetail from "./pages/DashboardPages/AdminPages/MessageDetail";
import Faq from "./pages/DashboardPages/AdminPages/Faq";
import Signup from "./pages/DashboardPages/AdminPages/Signup";
import Login from "./pages/DashboardPages/AdminPages/Login";
import AdminHandledTaxesAndCharges from "./pages/DashboardPages/AdminPages/TaxesAndCharges";
import ImageUpload from "./pages/DashboardPages/AdminPages/ImageUpload";
import RestaurantClaims from "./components/RestaurantDasComponents/restaurantClaimOwerside/restaurantClaimOwerside";

import { AuthProvider } from "./context/AuthContext";
import { TiffinPage } from "./pages/DashboardPages/AdminPages/TiffinPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLoginPage from "./pages/DashboardLoginPage/DashboardLogin";
// marketing dashboard imports
import CampaignManagement from "./pages/DashboardPages/MarketingPages/CampaignManagement";
import DashboardHomeMarketing from "./pages/DashboardPages/MarketingPages/DashboardHomeMarketing";
import { OffersProvider } from "./context/OffersContext";
import RestaurantOffersMarketing from "./pages/DashboardPages/MarketingPages/RestaurantOffers";
import { ResourceProvider } from "./context/Banner_CollectionContext";
import EmailTemplates from "./pages/DashboardPages/MarketingPages/EmailTemplates";
import EmailTemplateEdit from "./components/DashBoards/MarketingDashboard/EmailTempalateEdit";
import CollectionManagementMarketing from "./components/DashBoards/MarketingDashboard/CollectionManagement/CollectionManagement";

import ProfileManagement from "./components/DashBoards/MarketingDashboard/ProfileManagement";
import HelpMar from "./pages/DashboardPages/MarketingPages/Help";
import { SupportMar } from "./pages/DashboardPages/MarketingPages/Support";
import NotificationsMar from "./pages/DashboardPages/MarketingPages/Notifications";
import { HelpTiffin } from "./pages/DashboardPages/TiffinPages/Help";
import SupportTiffin from "./pages/DashboardPages/TiffinPages/support";

// Collection Pages
import CatchTheMatch from "./components/HomeComponents/Collections/CatchTheMatch";
import NewInTown from "./components/HomeComponents/Collections/NewInTown";
import TrendingThisWeek from "./components/HomeComponents/Collections/TrendingThisWeek";
import CallingAllBars from "./components/HomeComponents/Collections/CallingAllBars";
import CollectionPages from "./components/HomeComponents/Collections/DetailPages/CollectionPages";
import PartnerWithUs from "./pages/PartnerWithUs/PartnerWithUs";
import Announcement from "./pages/investor_relation_announcement/Announcement";
import Governance from "./pages/Governance/Governance";
import Resource from "./pages/Investor_r_resource/Resource";
import Esg from "./pages/Investor_r_esg/Esg";
import { Type } from "./Adminutils/DashboardType";
import DashboardLogin from "./Adminutils/AdminLogin";
import RestaurantDashboardProtectedRoute from "./components/RestaurantDashboardProtectedRoute";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import NotificationTiffin from "./components/DashBoards/TiffinDashboard/Notifications";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import AdminDashboardLayout from "./components/DashBoards/AdminDashboard/Admin/AdminDashboardLayout";
// google location context
import { LocationProvider } from "./context/locationContext.jsx";
// event section 
import EventsPage from "./pages/EventsPage"; // <-- New
import EventDetails from "./pages/EventDetails"; // <-- New
import MyTicketsPage from "./pages/MyTicketsPage"; // <-- New
import BookingSuccessPage from "./pages/BookingSuccessPage"; // <-- New

export default function App() {
  const [expanded, setExpanded] = useState(true);
  const [selectedOutlet, setSelectedOutlet] = useState(null);

  return (
    <LocationProvider>
      <AuthProvider>
        <CheckoutProvider>
          <OffersProvider>
            <OrderNotificationBar />
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/Live" element={<LiveLocation />} />
              <Route
                path="/RestaurantRegistration"
                element={<RestaurantRegistration />}
              />


              <Route path="/Event-Booking" element={<EventBookingPage />} />
              {/* --- NEW EVENT SECTION ROUTES --- */}
              {/* 1. The Main Events Listing Page */}
              <Route path="/events" element={<EventsPage />} />
              {/* 2. The Event Details & Booking Page */}
              <Route path="/events/:id" element={<EventDetails />} />

              {/* 3. Booking Success Confirmation */}
              <Route path="/booking-success" element={<BookingSuccessPage />} />

              {/* 4. My Tickets/Bookings (Protected User Route) */}
              {/* This route should ideally be nested under a ProtectedRoute, but we add it directly for testing */}
              <Route path="/my-tickets" element={<MyTicketsPage />} />


              <Route path="/collections" element={<CollectionPage />} />
              {/* m */}
              <Route path="/PartnerWithUs" element={<PartnerWithUs />} />
              <Route path="/investors/announcement" element={<Announcement />} />
              <Route path="/investors/governance" element={<Governance />} />
              <Route path="/investors/resources" element={<Resource />} />
              <Route path="/investors/esg" element={<Esg />} />








              {/* Collection routes */}
              <Route path="/CatchTheMatch" element={<CatchTheMatch />} />
              <Route path="/new-in-town" element={<NewInTown />} />
              <Route path="/trending-this-week" element={<TrendingThisWeek />} />
              <Route path="/calling-bar-hoppers" element={<CallingAllBars />} />
              <Route
                path="/collection/:collectionType"
                element={<CollectionPages />}
              />

              <Route path="/whoweare" element={<WhoWeAre />} />
              <Route path="/menucarousel" element={<MenuCarousel />} />
              <Route path="/reportfraud" element={<ReportFraud />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/workwithus" element={<WorkWithUs />} />
              <Route path="/dining" element={<Dining />} />
              <Route path="/add-restaurant/tiffin" element={<Dining />} />

              <Route path="/orderpage/:id" element={<OrderPageSection />} />
              <Route
                path="/fooddelievetydining"
                element={<Fooddelieverydining />}
              />
              <Route path="/show-case" element={<ShowCase />} />
              <Route path="/user/:userId" element={<User />} />
              <Route path="/user/:userId/:hashId" element={<User />} />
              <Route
                path="/user/:userId/notifications"
                element={<SkipedPage />}
              />
              <Route
                path="/investors-relations"
                element={<InvestorRelations />}
              />
              <Route path="/get-the-app" element={<GetTheApp />} />
              <Route path="/dashboard" element={<DashboardLoginPage />} />
              <Route path="/dashboard/type" element={<Type />} />
              <Route path="/dashboard-login" element={<DashboardLogin />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              {/* <Route path="/:city/:id" element={<RestaurantPage />} /> */}
              {/* <Route path="/:city/:id/:name" element={<RestaurantPage />} /> */}
              <Route path="/:city/:id" element={<RestaurantPage />} />
              <Route path="/:city/:id/:name/:page" element={<RestaurantPage />} />
              <Route
                path="/:city/:id/:name/:page/:reviewId"
                element={<RestaurantPage />}
              />

              <Route path="/:id" element={<Privacy />} />
              {/* <Route path="/security" element={<Security />} />
            <Route path="/terms" element={<Terms />} /> */}
              <Route path="/checkout" element={<TiffinCheckoutPage />} />
              {/* <Route path="/:city/:name" element={<RestaurantPage />} /> */}
              {/* <Route path="/:city/:id/:page" element={<RestaurantPage />} /> */}
              <Route path="/test" element={<TestPage />} />
              <Route path="/restaurants" element={<RestaurantListSection />} />
              <Route path="/SuccessPage" element={<SuccessPage />} />
              <Route path="/ClaimsList" element={<ClaimsList />} />
              <Route path="/add-to-cart" element={<AddToCart />} />
              <Route path="/bookingdetails" element={<BookingDetails />} />

              {/* Blog Paths */}
              <Route path="/blog/allcategories" element={<AllCategories />} />
              <Route path="/blog/community" element={<Community />} />
              <Route path="/blog/company" element={<Company />} />
              <Route path="/blog/culture" element={<Culture />} />
              <Route path="/blog/technology" element={<Technology />} />

              {/* Protected User Routes */}
              <Route
                path="/user/:userId/settings"
                element={<UserSettingsPage />}
              />
              <Route path="/History" element={<OrderHistory />} />
              <Route path="/user/:userId/network" element={<SkipedPage />} />
              <Route path="/user/:userId/find-friends" element={<SkipedPage />} />

              {/* Protected Restaurant Routes */}
              <Route path="/add-restaurant" element={<AddRestaurant />} />
              <Route
                path="/claim-restaurant/:id"
                element={<RestaurantClaimForm />}
              />

              {/* Dashboard Routes (Protected) */}
              <Route element={<DashboardLayout />}>
                <Route
                  path="/dashboard/tiffins/home"
                  element={<DashboardHome />}
                />
                <Route path="/dashboard/tiffins/orders" element={<Orders />} />
                <Route path="/dashboard/tiffins/tiffin" element={<AddTiffin />} />
                <Route
                  path="/dashboard/tiffins/notifications"
                  element={<NotificationTiffin />}
                />
                <Route
                  path="/dashboard/tiffins/outlet-info"
                  element={<ManageTiffinSeeting />}
                />
                <Route
                  path="/dashboard/tiffins/taxes-charges"
                  element={<TaxesAndChargesPage />}
                />
                <Route
                  path="/dashboard/tiffins/offers"
                  element={<TiffinOffers />}
                />
                <Route
                  path="/dashboard/tiffins/support"
                  element={<HelpTiffin />}
                />
                <Route
                  path="/dashboard/tiffins/help"
                  element={<SupportTiffin />}
                />
              </Route>

              {/* Admin Dashboard (Fully Protected) */}
              <Route element={<DashboardLayout />}>
                <Route
                  path="/dashboard/admins/home"
                  // element={<DashboardHome />}
                  element={<AdminDashboardLayout />}
                />
                <Route
                  path="/dashboard/admins/action-center"
                  element={<RestaurantList />}
                />
                <Route
                  path="/dashboard/admins/comments-manager"
                  element={<RestaurantList />}
                />
                <Route
                  path="/dashboard/admins/dashboard/switch"
                  element={<FormSwitch />}
                />
                <Route
                  path="/dashboard/admins/add-tiffin"
                  element={<AddTiffin />}
                />
                <Route
                  path="/dashboard/admins/register"
                  element={<FormSwitch />}
                />
                <Route path="/dashboard/admins/events" element={<EventList />} />
                <Route
                  path="/dashboard/admins/notifications"
                  element={<Notifications />}
                />
                <Route
                  path="/dashboard/admins/analytics"
                  element={<Analytics />}
                />
                <Route
                  path="/dashboard/admins/event"
                  element={<EventManagement />}
                />
                <Route path="/dashboard/admins/offers" element={<Offers />} />
                <Route
                  path="/dashboard/admins/orders"
                  element={<OrderManagement orders={dummyOrders} />}
                />
                <Route
                  path="/dashboard/admins/historylogs"
                  element={<HistoryLogs />}
                />
                <Route
                  path="/dashboard/admins/usermanagement"
                  element={<UserManagement />}
                />
                <Route
                  path="/dashboard/admins/manage-admins"
                  element={<ManageAdmin />}
                />
                <Route
                  path="/dashboard/admins/cards/OrderDetails/:orderId"
                  element={<OrderDetails />}
                />
                <Route
                  path="/dashboard/admins/taxes"
                  element={<AdminHandledTaxesAndCharges />}
                />
                <Route
                  path="/dashboard/admins/claim-restaurant"
                  element={<ClaimRestaurant />}
                />
                <Route
                  path="/dashboard/admins/collection-management"
                  element={<CollectionManagement />}
                />
                <Route path="/dashboard/admins/settings" element={<Support />} />
                <Route path="/dashboard/admins/help" element={<Help />} />
                <Route
                  path="/dashboard/restaurants/support"
                  element={<Support />}
                />
                <Route
                  path="/dashboard/restaurants/message/:id"
                  element={<MessageDetail />}
                />
                <Route path="/dashboard/admins/faqs" element={<Faq />} />
                <Route
                  path="/dashboard/admins/control"
                  element={<UserAccessControl />}
                />
                <Route
                  path="/dashboard/admins/tiffins"
                  element={<TiffinPage />}
                />
                {/* Marketing Dashboard routes */}
                <Route
                  path="/dashboard/marketing/"
                  element={<DashboardHomeMarketing />}
                />
                <Route
                  path="/dashboard/marketing/home"
                  element={<DashboardHomeMarketing />}
                />
                <Route
                  path="/dashboard/marketing/campaign-management"
                  element={
                    <ResourceProvider resourceType="banners">
                      <CampaignManagement />
                    </ResourceProvider>
                  }
                />
                <Route
                  path="/dashboard/marketing/collection-management"
                  element={
                    <ResourceProvider resourceType="collections">
                      <CollectionManagementMarketing />
                    </ResourceProvider>
                  }
                />
                <Route
                  path="/dashboard/marketing/email-templates"
                  element={<EmailTemplates />}
                />
                <Route
                  path="/dashboard/marketing/email-templates-edit"
                  element={<EmailTemplateEdit />}
                />
                <Route
                  path="/dashboard/marketing/RestaurantOffers"
                  element={<RestaurantOffersMarketing />}
                />
                <Route path="/dashboard/marketing/help" element={<HelpMar />} />

                <Route
                  path="/dashboard/marketing/"
                  element={<DashboardHomeMarketing />}
                />
                <Route
                  path="/dashboard/marketing/home"
                  element={<DashboardHomeMarketing />}
                />
                <Route
                  path="/dashboard/marketing/profile-management"
                  element={<ProfileManagement />}
                />
                <Route
                  path="/dashboard/marketing/notification"
                  element={<NotificationsMar />}
                />

                <Route
                  path="/dashboard/marketing/campaign-management"
                  element={
                    <ResourceProvider resourceType="banners">
                      <CampaignManagement />
                    </ResourceProvider>
                  }
                />

                {/* <Route
                path="/dashboard/marketing/collection-management"
                element={
                  <ResourceProvider resourceType="collections">
                    <CollectionManagementMarketing />
                  </ResourceProvider>
                }
              /> */}
                <Route
                  path="/dashboard/marketing/email-templates"
                  element={<EmailTemplates />}
                />
                <Route
                  path="/dashboard/marketing/email-templates-edit"
                  element={<EmailTemplateEdit />}
                />

                <Route
                  path="/dashboard/marketing/RestaurantOffers"
                  element={
                    <OffersProvider>
                      <RestaurantOffersMarketing />
                    </OffersProvider>
                  }
                />
                <Route path="/dashboard/marketing/help" element={<HelpMar />} />
                <Route
                  path="/dashboard/marketing/support"
                  element={<SupportMar />}
                />
                {/* not related to dashboard */}
                <Route path="/image-upload-page" element={<ImageUpload />} />
                <Route path="/sample" element={<AdminDashboradForAnalytics />} />
              </Route>

              {/* Restaurant Dashboard Routes */}
              <Route
                element={
                  <RestaurantDashboardProtectedRoute>
                    <RestaurentDasBoardLayout
                      expanded={expanded}
                      setExpanded={setExpanded}
                      selectedOutlet={selectedOutlet}
                    />
                  </RestaurantDashboardProtectedRoute>
                }
              >
                <Route
                  path="/dashboard/restaurants/home/:id"
                  element={<RestaurantDashboard />}
                />
                <Route
                  path="/RestaurantClaims/:id"
                  element={<RestaurantClaims />}
                />
                <Route
                  path="/delivery-menu/:id"
                  element={<DeliveryMenu showServiceType="Dine-in" />}
                />
                <Route path="/support/:id" element={<HelpDas />} />
                <Route path="/help/:id" element={<RestaurantHelp />} />
                <Route
                  path="/dine-in-menu/:id"
                  element={<DineInMenu showServiceType="Takeaway" />}
                />
                <Route path="/add-item/:id" element={<AddItemForm />} />
                <Route
                  path="/restaurant-offers/:id"
                  element={<RestaurantOffers />}
                />
                <Route
                  path="/Restaurant-Reviews/:id"
                  element={<RestaurantReviews />}
                />
                <Route
                  path="/outlet-settings/:id"
                  element={
                    <OutletDashboard setSelectedOutlet={setSelectedOutlet} />
                  }
                />
                {/* <Route path="/outlet-settings" element={<Outlet />} /> */}
                <Route
                  path="/outlet-info/:id"
                  element={<ManageRestaurantSettings />}
                />
                <Route
                  path="/taxes-charges/:id"
                  element={<RestaurantTaxesAndCharges />}
                />
                <Route path="/notifications/:id" element={<NotificationsRes />} />
                <Route path="/OrderManag/:id" element={<OrderManag />} />
                <Route path="/AllOutletdata/:id" element={<AllOutletdata />} />
                <Route
                  path="/OperatingHours/:id"
                  element={<OperatingHoursSection />}
                />
              </Route>

              {/* Fallback for unknown routes */}
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </OffersProvider>
        </CheckoutProvider>
      </AuthProvider>
    </LocationProvider>
  );
}

export const dummyOrders = [
  // Tiffin Orders
  {
    id: 1,
    Name: "John Doe",
    date: "2025-01-01",
    time: "12:30 PM",
    pickuptime: "1:00 PM",
    item: "Pizza",
    quantity: 2,
    payment: "Credit Card",
    price: 29.99,
    status: "pending",
    restaurant: "Italian Bistro",
    category: "Main Course",
    subcategory: "Pizza",
    typeOfOrder: "tiffin",
  },
  {
    id: 2,
    Name: "Jane Smith",
    date: "2025-01-02",
    time: "1:30 PM",
    pickuptime: "2:00 PM",
    item: "Burger",
    quantity: 1,
    payment: "Cash",
    price: 15.5,
    status: "pending",
    restaurant: "Burger King",
    category: "Fast Food",
    subcategory: "Burger",
    typeOfOrder: "tiffin",
  },
  {
    id: 3,
    Name: "Alice Green",
    date: "2025-01-03",
    time: "2:00 PM",
    pickuptime: "2:30 PM",
    item: "Sushi",
    quantity: 3,
    payment: "Debit Card",
    price: 45.75,
    status: "pending",
    restaurant: "Sushi World",
    category: "Japanese",
    subcategory: "Sushi",
    typeOfOrder: "tiffin",
  },
  {
    id: 4,
    Name: "Bob White",
    date: "2025-01-04",
    time: "3:00 PM",
    pickuptime: "3:30 PM",
    item: "Tacos",
    quantity: 5,
    payment: "Paypal",
    price: 22.0,
    status: "pending",
    restaurant: "Mexican Grill",
    category: "Mexican",
    subcategory: "Tacos",
    typeOfOrder: "tiffin",
  },
  {
    id: 5,
    Name: "Grace Red",
    date: "2025-01-09",
    time: "8:00 PM",
    pickuptime: "8:30 PM",
    item: "Fried Rice",
    quantity: 3,
    payment: "Paypal",
    price: 25.5,
    status: "expired",
    restaurant: "Asian Delights",
    category: "Chinese",
    subcategory: "Rice",
    typeOfOrder: "tiffin",
  },
  {
    id: 6,
    Name: "Olivia Pink",
    date: "2025-01-12",
    time: "9:00 AM",
    pickuptime: "9:30 AM",
    item: "Dosa",
    quantity: 3,
    payment: "Cash",
    price: 18.0,
    status: "confirmed",
    restaurant: "South Indian Tiffin",
    category: "Breakfast",
    subcategory: "Dosa",
    typeOfOrder: "tiffin",
  },
  {
    id: 7,
    Name: "Mia Yellow",
    date: "2025-01-14",
    time: "11:30 AM",
    pickuptime: "12:00 PM",
    item: "Idli",
    quantity: 4,
    payment: "Debit Card",
    price: 12.0,
    status: "pending",
    restaurant: "Healthy Breakfast",
    category: "Breakfast",
    subcategory: "Idli",
    typeOfOrder: "tiffin",
  },
  {
    id: 8,
    Name: "Ethan Orange",
    date: "2025-01-15",
    time: "1:00 PM",
    pickuptime: "1:30 PM",
    item: "Pongal",
    quantity: 2,
    payment: "Credit Card",
    price: 20.0,
    status: "confirmed",
    restaurant: "Tiffin Express",
    category: "Lunch",
    subcategory: "Pongal",
    typeOfOrder: "tiffin",
  },
  {
    id: 9,
    Name: "Sophia Blue",
    date: "2025-01-16",
    time: "7:30 AM",
    pickuptime: "8:00 AM",
    item: "Upma",
    quantity: 3,
    payment: "Paypal",
    price: 10.5,
    status: "confirmed",
    restaurant: "Breakfast Corner",
    category: "Breakfast",
    subcategory: "Upma",
    typeOfOrder: "tiffin",
  },
  {
    id: 10,
    Name: "Liam Black",
    date: "2025-01-17",
    time: "9:00 PM",
    pickuptime: "9:30 PM",
    item: "Chapati",
    quantity: 5,
    payment: "Cash",
    price: 15.0,
    status: "pending",
    restaurant: "Night Tiffin",
    category: "Dinner",
    subcategory: "Chapati",
    typeOfOrder: "tiffin",
  },

  // Orders
  {
    id: 11,
    Name: "Diana Blue",
    date: "2025-01-06",
    time: "5:00 PM",
    pickuptime: "5:30 PM",
    item: "Salad",
    quantity: 1,
    payment: "Cash",
    price: 9.99,
    status: "pending",
    restaurant: "Healthy Eats",
    category: "Salads",
    subcategory: "Veg",
    typeOfOrder: "order",
  },
  {
    id: 12,
    Name: "Frank Black",
    date: "2025-01-08",
    time: "7:00 PM",
    pickuptime: "7:30 PM",
    item: "Chicken Wings",
    quantity: 4,
    payment: "Credit Card",
    price: 18.0,
    status: "pending",
    restaurant: "Wings",
    category: "Appetizers",
    subcategory: "Wings",
    typeOfOrder: "order",
  },
  {
    id: 13,
    Name: "John Doe",
    date: "2025-01-01",
    time: "12:30 PM",
    pickuptime: "1:00 PM",
    item: "Pizza",
    quantity: 2,
    payment: "Credit Card",
    price: 29.99,
    status: "pending",
    restaurant: "Italian Bistro",
    category: "Main Course",
    subcategory: "Pizza",
    typeOfOrder: "takeaway",
  },
  {
    id: 14,
    Name: "Jane Smith",
    date: "2025-01-02",
    time: "1:30 PM",
    pickuptime: "2:00 PM",
    item: "Burger",
    quantity: 1,
    payment: "Cash",
    price: 15.5,
    status: "pending",
    restaurant: "Burger King",
    category: "Fast Food",
    subcategory: "Burger",
    typeOfOrder: "dining",
  },
  {
    id: 15,
    Name: "Alice Green",
    date: "2025-01-03",
    time: "2:00 PM",
    pickuptime: "2:30 PM",
    item: "Sushi",
    quantity: 3,
    payment: "Debit Card",
    price: 45.75,
    status: "pending",
    restaurant: "Sushi World",
    category: "Japanese",
    subcategory: "Sushi",
    typeOfOrder: "takeaway",
  },
  {
    id: 16,
    Name: "Bob White",
    date: "2025-01-04",
    time: "3:00 PM",
    pickuptime: "3:30 PM",
    item: "Tacos",
    quantity: 5,
    payment: "Paypal",
    price: 22.0,
    status: "pending",
    restaurant: "Mexican Grill",
    category: "Mexican",
    subcategory: "Tacos",
    typeOfOrder: "tiffin",
  },
  {
    id: 17,
    Name: "Charlie Brown",
    date: "2025-01-05",
    time: "4:30 PM",
    pickuptime: "5:00 PM",
    item: "Pasta",
    quantity: 2,
    payment: "Credit Card",
    price: 34.5,
    status: "pending",
    restaurant: "Pasta Palace",
    category: "Italian",
    subcategory: "Pasta",
    typeOfOrder: "order",
  },
  {
    id: 18,
    Name: "Diana Blue",
    date: "2025-01-06",
    time: "5:00 PM",
    pickuptime: "5:30 PM",
    item: "Salad",
    quantity: 1,
    payment: "Cash",
    price: 9.99,
    status: "pending",
    restaurant: "Healthy Eats",
    category: "Salads",
    subcategory: "Veg",
    typeOfOrder: "takeaway",
  },
  {
    id: 19,
    Name: "Eve Gray",
    date: "2025-01-07",
    time: "6:00 PM",
    pickuptime: "6:30 PM",
    item: "Steak",
    quantity: 1,
    payment: "Debit Card",
    price: 59.99,
    status: "pending",
    restaurant: "Steakhouse Grill",
    category: "Main Course",
    subcategory: "Wings",
    typeOfOrder: "dining",
  },
  {
    id: 20,
    Name: "Frank Black",
    date: "2025-01-08",
    time: "7:00 PM",
    pickuptime: "7:30 PM",
    item: "Chicken Wings",
    quantity: 4,
    payment: "Credit Card",
    price: 18.0,
    status: "pending",
    restaurant: "Wings",
    category: "Appetizers",
    subcategory: "Wings",
    typeOfOrder: "order",
  },
  {
    id: 21,
    Name: "Grace Red",
    date: "2025-01-09",
    time: "8:00 PM",
    pickuptime: "8:30 PM",
    item: "Fried Rice",
    quantity: 3,
    payment: "Paypal",
    price: 25.5,
    status: "expired",
    restaurant: "Asian Delights",
    category: "Chinese",
    subcategory: "Rice",
    typeOfOrder: "tiffin",
  },
  {
    id: 22,
    Name: "Henry Silver",
    date: "2025-01-10",
    time: "9:00 PM",
    pickuptime: "9:30 PM",
    item: "Ice Cream",
    quantity: 6,
    payment: "Debit Card",
    price: 12.99,
    status: "confirmed",
    restaurant: "Dessert Haven",
    category: "Desserts",
    subcategory: "Ice Cream",
    typeOfOrder: "dining",
  },
];
