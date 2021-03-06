import React, {Component} from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { data } from 'jquery';

class Empbookings extends Component{

    constructor(props) {
        super(props);
        this.state = {
            EmployeeBookings: [], 
            loading: true,
        };
        
    }

    componentDidMount(){
        let payload = {
            employeeId: this.props.employee.data.employee_id
        }
        Axios.post('/api/employee-bookings', payload).then(res=>
            {
                console.log(res);
            if(res.data.status == true){
                this.setState({
                    EmployeeBookings: res.data.data,
                    loading: false
                },function() {
                    console.log('this.state.EmployeeBookings');
                })
            }
        })
    }

    render(){
        return(
            <div>
                <section className="section">
                    <div className="section-body">
                        <h2>Assigned Bookings</h2>
                        <div className="row">
                            {
                                this.state.EmployeeBookings.map((data,index)=>{
                                    console.log(data);
                                    return(
                                        <div className="card col-sm-12">
                                <div className="col-sm-12">
                                    <div>
                                        <div className="card-content col-sm-12">
                                        <h3>{data.service.name}</h3>
                                        <h4><button onClick={()=>{window.open('/vendor-employee/booking-details/'+data.booking_id,'_blank')}} 
                                                    key={index} style={{cursor:'pointer'}} 
                                                    className="btn btn-outline-success ml-auto">Manage Booking</button></h4>
                                        <div className="divid-line"/>
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
                                                    <li>{data.booking_information.resident_type}</li>
                                                    <li>${data.booking.booking_totals}</li>
                                                </ul>
                                            </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                                    )
                                }
                                )}
                            
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}



const mapStateToProps = (state) =>{
    return{
        employee:state.employee
    }
}
export default connect(mapStateToProps)(Empbookings);