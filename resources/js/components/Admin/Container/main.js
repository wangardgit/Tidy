import React, { Component } from 'react';
import Header from '../Navigation/header';
import Sidebar from '../Navigation/Sidebar';

import {Route, BrowserRouter} from 'react-router-dom';
// Service
import ServiceCreate from '../ServicePricing/create';
import ServiceList from '../ServicePricing/List';
import ServiceEdit from '../ServicePricing/edit';

// Service Extra
import ServiceExtraCreate from '../ServiceExtra/create';
import ServiceExtraList from '../ServiceExtra/list';
import ServiceExtraEdit from '../ServiceExtra/edit';
// States
import StateCreate from '../State/create';
import StateEdit from '../State/edit';
import StateList from '../State/list';

// City
import CityCreate from '../City/create';
import CityEdit from '../City/edit';
import CityList from '../City/list';

// Category
import CategoryCreate from '../Category/create';
import CategoryEdit from '../Category/edit';
import CategoryList from '../Category/index';
// SubCategory
import SubCategoryCreate from '../SubCategory/create';
import SubCategoryEdit from '../SubCategory/edit';
import SubCategoryList from '../SubCategory/index';
// Customer
import CustomerList from '../Customers/list';
import CreateCustomer from '../Customers/create';
import EditCustomer from '../Customers/edit';
import CustomerBookingDetails from '../Customers/CustomersBookings';

// Vendor
import VendorsList from '../Vendors/list';
import VendorInfo from '../Vendors/show';
import CreateVendor from '../Vendors/create';
// Setting
import SettingList from '../Settings/index';
import HomeContent from '../Settings/homeContent';
import ReviewMod from '../Reviews/reviews'
import ListReviews from '../Reviews/listreviews';
import EditReview from '../Reviews/editreviews';

import UrlMeta from '../Settings/UrlMeta';
import Index from '../Settings/UrlList';
import UrlEdit from '../Settings/UrlEdit';


import Servicechecklist from '../Settings/Servicechecklist';
import AddServiceCheck from '../Settings/Addservicecheck';
import EditServiceCheck from '../Settings/ServiceCheckEdit';

import HolidayCreate from '../Holidays/create';
import HolidayEdit from '../Holidays/edit';
import HolidayList from '../Holidays/index';

import CreateQuestion from '../Questions/create';
import EditQuestion from '../Questions/edit';
import ListQuestion from '../Questions/index';

import Faqpage from '../Faqs/FaqsPage';
import AddFaq from '../Faqs/AddFaqs';
import EditFaq from '../Faqs/edit';
import GiftCardsList from '../GiftCards/GiftcardsList';
import Create from '../ManageServiceContent/create';
import Edit from '../ManageServiceContent/edit';
import ManageServiceContent from '../ManageServiceContent/ManageServiceContent';

// Emails
import CreateEmails from '../Emails/create';
import EditEmails from '../Emails/edit';
import ListEmails from '../Emails/list';

import VendorMessages from '../Messages/VendorMessages';
import CustomerMessages from '../Messages/CustomerMessages';


import EditPage from '../ManagePages/Edit';
import AddPage from '../ManagePages/create';
import ManagePages from '../ManagePages/ManagePagesContent';

//SMS
import CreateSms from '../Sms/create';
import EditSms from '../Sms/edit';
import SmsList from '../Sms/list';

//Bookings
import PendingBookings from '../Bookings/Pending_Bookings';

import PaymentsList from '../ManageAccounts/Payments';
import VendorWithdrawRequestsList from '../ManageAccounts/VendorwithdrawRequests';

import AllBookings from '../Bookings/AllBookings';
import AssignVendorBookings from '../Bookings/AssignVendorBooking';
import BookingDetails from '../Bookings/Bookingdetails';
import ServiceDetails from '../Bookings/ServiseDetails';
import Dashboard from '../Dashboard/dashboard';
import { Toaster } from 'react-hot-toast';







class Main extends Component {
    render() {
        return (
            <div id="container" className="effect aside-float aside-bright mainnav-lg">
                <Header></Header>
                <div className="boxed">
                    <div id="content-container">
                        {/*Service Pricing*/}
                        <Route path="/admin/dashboard" component={Dashboard}></Route>
                        <Route path="/admin/create-service" component={ServiceCreate}></Route>
                        <Route path="/admin/edit-service/:id" component={ServiceEdit}></Route>
                        <Route path="/admin/list-service" component={ServiceList}></Route>
                        {/*Service Extra*/}
                        <Route path="/admin/create-service-extra" component={ServiceExtraCreate}></Route>
                        <Route path="/admin/edit-service-extra/:id" component={ServiceExtraEdit}></Route>
                        <Route path="/admin/list-service-extra" component={ServiceExtraList}></Route>

                        {/*State*/}
                        <Route path="/admin/create-state" component={StateCreate}></Route>
                        <Route path="/admin/edit-state/:id" component={StateEdit}></Route>
                        <Route path="/admin/list-state" component={StateList}></Route>

                        {/*City*/}
                        <Route path="/admin/create-city" component={CityCreate}></Route>
                        <Route path="/admin/edit-city/:id" component={CityEdit}></Route>
                        <Route path="/admin/list-city" component={CityList}></Route>

                        {/*Category*/}
                        <Route path="/admin/create-category" component={CategoryCreate}></Route>
                        <Route path="/admin/edit-category/:id" component={CategoryEdit}></Route>
                        <Route path="/admin/list-category" component={CategoryList}></Route>

                        {/*SubCategory*/}
                        <Route path="/admin/create-subcategory" component={SubCategoryCreate}></Route>
                        <Route path="/admin/edit-subcategory/:id" component={SubCategoryEdit}></Route>
                        <Route path="/admin/list-subcategory" component={SubCategoryList}></Route>

                        {/*Public Holidays*/}
                        <Route path="/admin/create-holiday" component={HolidayCreate}></Route>
                        <Route path="/admin/edit-holiday/:id" component={HolidayEdit}></Route>
                        <Route path="/admin/list-holidays" component={HolidayList}></Route>

                        {/*Question */}
                        <Route path="/admin/create-question" component={CreateQuestion}></Route>
                        <Route path="/admin/edit-question/:id" component={EditQuestion}></Route>
                        <Route path="/admin/list-question" component={ListQuestion}></Route>

                        <Route path="/admin/customer-list" component={CustomerList}></Route>
                        <Route path="/admin/create-customer" component={CreateCustomer}></Route>
                        <Route path="/admin/edit-customer/:id" component={EditCustomer}></Route>
                        <Route path="/admin/customer-all-bookings-details/:id" component={CustomerBookingDetails}></Route>

                        <Route path="/admin/vendor-list" component={VendorsList}></Route>
                        <Route path="/admin/vendor-info/:id" component={VendorInfo}></Route>
                        <Route path="/admin/create-vendor" component={CreateVendor}></Route>

                        <Route path="/admin/setting-list" component={SettingList}></Route>
                        <Route path="/admin/home-content" component={HomeContent}></Route>
                        <Route path="/admin/create-review" component={ReviewMod}></Route>
                        <Route path="/admin/list-reviews" component={ListReviews}></Route>
                        <Route path="/admin/edit-review/:id" component={EditReview}></Route>
                        
                        <Route path="/admin/url-meta" component={UrlMeta}></Route>
                        <Route path="/admin/url-meta-list" component={Index}></Route>
                        <Route path="/admin/url-edit/:id" component={UrlEdit}></Route>

                        <Route path="/admin/service_check_list" component={Servicechecklist}></Route>
                        <Route path="/admin/add_service_check" component={AddServiceCheck}></Route>
                        <Route path="/admin/edit_service_check/:id" component={EditServiceCheck}></Route>


                        <Route path="/admin/add-faq" component={AddFaq}></Route>
                        <Route path="/admin/edit-faq/:id" component={EditFaq}></Route>
                        <Route path="/admin/faqs" component={Faqpage}></Route>
                        
                        <Route path="/admin/gift-cards" component={GiftCardsList}></Route>

                        <Route path="/admin/create-service-content" component={Create}></Route>
                        <Route path="/admin/edit-service-content/:id" component={Edit}></Route>
                        <Route path="/admin/manage-services-content" component={ManageServiceContent}></Route>


                        <Route path="/admin/create-emails" component={CreateEmails}></Route>
                        <Route path="/admin/edit-email/:id" component={EditEmails}></Route>
                        <Route path="/admin/emails" component={ListEmails}></Route>


                        <Route path="/admin/vendor-messages" component={VendorMessages}></Route>

                        <Route path="/admin/customer-messages" component={CustomerMessages}></Route>

                        <Route path="/admin/create-page" component={AddPage}></Route>
                        <Route path="/admin/manage-pages" component={ManagePages}></Route>
                        <Route path="/admin/edit-page/:id" component={EditPage}></Route>

                        <Route path="/admin/create-sms" component={CreateSms}></Route>
                        <Route path="/admin/edit-sms/:id" component={EditSms}></Route>
                        <Route path="/admin/sms" component={SmsList}></Route>

                        <Route path="/admin/pending-bookings" component={PendingBookings} ></Route>

                        <Route path="/admin/payments_list" component={PaymentsList} ></Route>
                        <Route path="/admin/vendor_withdraw_requests_list" component={VendorWithdrawRequestsList} ></Route>

                        <Route path="/admin/get-all-bookings" component={AllBookings} ></Route>
                        <Route path="/admin/assign-vendor/:id" component={AssignVendorBookings} ></Route>
                        <Route path="/admin/customer-bookings-details/:id" component={BookingDetails} ></Route>
                        <Route path="/admin/service-details/:id" component={ServiceDetails} ></Route>

                    </div>
                    <Sidebar></Sidebar>
                </div>
                <Toaster></Toaster>
            </div>
        );
    }
}

export default Main;