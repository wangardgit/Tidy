import Axios from 'axios';
import { data } from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import {Link} from 'react-router-dom';
import toast from 'react-hot-toast';

class BookingsFeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceBookings: [],
            qoutes:[],
            loading:true,
            vendor_id:this.props.vendor.data.vendor_id,
        };
    }

    componentDidMount(){
        Axios.post('/api/get_vendor_booking_requests',{vendor_id:this.props.vendor.data.vendor_id}).then(res=>
            {
                // console.log(res);
                this.setState({
                    serviceBookings: res.data,
                    vendor_id:this.props.vendor.data.vendor_id,
                    loading:false
                })
                
        })
        // Axios.post('/api/get_vendor_qoutes',{vendor_id:this.props.vendor.data.vendor_id}).then(res=>
        //     {
        //         // console.log(res.data);
        //         this.setState({
        //             qoutes : res.data.qoutes,
        //             vendor_id:this.props.vendor.data.vendor_id
        //         })
        //     })
        
    }

    RequestAccept(id) {
        this.setState({ loading : true});
        let data = {
            id:id,
            vendor_id:this.props.vendor.data.vendor_id
        }
        Axios.post('/api/accept_booking', data).then(res=>{
            console.log(res);
            if(res.data.status == 200){
                toast.success('Booking Accepted',{position:'bottom-center'});
                // Swal.fire({
                //     icon: 'success',
                //     title: 'Booking Accepted',
                //     showConfirmButton: false,
                //     timer: 1500
                // })
            } else {
                toast.error(res.data.msg);
                // Swal.fire({
                //     icon: 'error',
                //     title: res.data.msg,
                //     showConfirmButton: false,
                //     timer: 1500
                // })
            }
        })
        setTimeout(() => {
            this.setState({ loading : false});
          }, 2000);
    }

    render() {
        const {loading} = this.state;
        return (
            <div>
                 {/* {
                    this.state.loading ?
                   
                        <div id="displayspinner text-center mt-5 " className="text-center" style={{ display: 'block', }}>
                            <div className="spinner-border  ml-2 text-dark spinner_format" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                        : */}
                <section className="section">
                    <div className="section-body">
                        <h2>Bookings Feed </h2>
                        <div className="row">
                            {
                            this.state.serviceBookings.map((data)=>{
                                return(
                                    <div className="card col-sm-12">
                                        <div className="col-sm-12">
                                            <div>
                                                <div className="card-content col-sm-12">
                                                <h3>{data.service.name}</h3>
                                            
                                                {
                                                    data.booking_information.resident_type == "House" ?
                                                
                                                   <>
                                                    {
                                                        data.service.residential_type == "1" ?
                                                        <>
                                                      <h4><button onClick={this.RequestAccept.bind(this,data.booking.id)} disabled={loading}  className="btn btn-outline-success ml-auto">
                                                      { loading && <i className= 'fa fa-refresh fa-spain'></i>}
                                                   { loading && <span >Loading...</span>}
                                                   { !loading && <span >Accept</span>}
                                                       
                                                          </button></h4> 

                                                      <h4><Link to={`/vendor/booking-details/${data.booking_id}`}><button  className="btn btn-outline-success ml-auto">Details</button></Link></h4>
                                                   </> :
                                                    //  <h4><Link to={`/vendor/create-quote/${data.booking_id}`}><button  className="btn btn-outline-success ml-auto">Qoute</button></Link></h4>
                                                    // <>
                                                    // {
                                                         
                                                    //         this.state.qoutes.map((data)=>{
                                                    //             return(
                                                        data.vendor_qoute == null ?
                                                        <h4><Link to={`/vendor/create-quote/${data.booking_id}`}><button  className="btn btn-outline-success ml-auto">Qoute</button></Link></h4>
                                                        :
                                                        data.booking_id == data.vendor_qoute.booking_id ?
                                                        <>
                                                        
                                                       
                                                        <h4><Link to={`/vendor/edit_quote/${data.vendor_qoute.booking_id}`}><button  className="btn btn-outline-success ml-auto">Edit Quote</button></Link></h4>
                                                        
                                                    
                                                        </>
                                                        : null
                                                     
                                                     
                                                    }
                                                    </>
                                                    : null
                                                    
                                                      
                                                }
                                                {
                                                    data.service.residential_type == "0" ?
                                                     
                                                         
                                                        data.vendor_qoute == null ?
                                                      
                                                         <>
                                                        
                                                        <div className="divid-line"/>
                                                       <div className="card-detail-left">
                                                           <ul>
                                                               <li>Customer Name:</li>
                                                               <li>Phone:</li>
                                                               <li>Booking Type: </li>
                                                                <li>Address: </li>
                                                               <li>Date:</li>
                                                               <li>Qoute: </li>
                                                           </ul>
                                                       </div>
                                                       <div className="card-detail-right">
                                                           <ul>
                                                            <li>{data.customer.customer.first_name+ ' '+data.customer.customer.last_name}</li>
                                                            <li>{data.customer.customer.phone}</li>
                                                               <li>{data.booking_type == 1 ? "One Time" : "Recurring"}</li>
                                                               <li>{data.booking_information.location_address}</li>
                                                               <li>{data.booking.date}</li>
                                                               <li>${data.booking.booking_totals}</li>
                                                           </ul>
                                                       </div>
                                                        </>
                                                        :
                                                        <>
                                                          <div className="divid-line"/>
                                                       <div className="card-detail-left">
                                                           <ul>
                                                               <li>Customer Name:</li>
                                                               <li>Phone:</li>
                                                               <li>Booking Type: </li>
                                                                <li>Address: </li>
                                                               <li>Date:</li>
                                                               <li>Qoute: </li>
                                                           </ul>
                                                       </div>
                                                       <div className="card-detail-right">
                                                           <ul>
                                                           <li>{data.customer.customer.first_name+ ' '+data.customer.customer.last_name}</li>
                                                           <li>{data.customer.customer.phone}</li>
                                                               <li>{data.booking_type == 1 ? "One Time" : "Recurring"}</li>
                                                               <li>{data.booking_information.location_address}</li>
                                                               <li>{data.booking.date}</li>
                                                               <li>${data.booking.booking_totals}</li>
                                                           </ul>
                                                       </div>
                                                       </>
                                                    : 
                                                     <>
                                                   <div className="divid-line"/>
                                                       <div className="card-detail-left">
                                                           <ul>
                                                               <li>Customer Name:</li>
                                                               <li>Phone:</li>
                                                               <li>Booking Type: </li>
                                                                <li>Address: </li>
                                                               <li>Date:</li>
                                                               <li>Qoute: </li>
                                                           </ul>
                                                       </div>
                                                       <div className="card-detail-right">
                                                           <ul>
                                                           <li>{data.customer.customer.first_name+ ' '+data.customer.customer.last_name}</li>
                                                           <li>{data.customer.customer.phone}</li>
                                                               <li>{data.booking_type == 1 ? "One Time" : "Recurring"}</li>
                                                               <li>{data.booking_information.location_address}</li>
                                                               <li>{data.booking.date}</li>
                                                                <li>${data.booking.booking_totals}</li>
                                                       </ul>
                                                   </div>
                                                    </> 
                                                            }  
                                               
                                                
                                                {/* onClick={this.handleAccept.bind(this,data.id)}    */}
                                                {/* <div className="divid-line"/>
                                                    <div className="card-detail-left">
                                                        <ul>
                                                            <li>Booking Type: </li>
                                                            <li>Residential Type:</li>
                                                            <li>Price:</li>
                                                        </ul>
                                                    </div>
                                                    <div className="card-detail-right">
                                                        <ul>
                                                            <li>{data.booking_type == 1 ? "One Time" : "Recurring"}</li>
                                                            <li>{data.service.type}</li>
                                                            <li>${data.booking.booking_totals}</li>
                                                        </ul>
                                                    </div> */}
                                            </div>
                                            </div>
                                        </div>
                            </div>
                                )
                            })
                        }
                        {
                                            this.state.serviceBookings.length == 0 ? 
                                            <h1 style={{margin:'auto', height:'70vh', display:'flex', alignItems: 'center', justifyContent: 'center'}}>No Data Founded</h1>:null
                                        }
                        </div>
                    </div>
                </section>
    {/* } */}
            </div>
        );
    }
}
const mapStateToProps = (state) =>{
    return{
        vendor:state.vendor
    }
}
export default connect(mapStateToProps)(BookingsFeed);