import Axios from 'axios';
import { data } from 'jquery';
import React, { Component } from 'react';
import toast from 'react-hot-toast';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';

class BookingsFeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            price:"",
            proposal:"",
            vendor_id:"",
            booking_id:"",
            id:this.props.match.params.id,
            serviceBookings: [],
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
                    booking_id:this.props.match.params.id
                })
                
        })
       
        }

    getQuotePrice(event) {
        this.setState({
            price: event.target.value
        })
    }
    getProposal(event) {
        this.setState({
            proposal: event.target.value
        })
    }
    createQuote(event) {
        this.setState({ loading : true});
        event.preventDefault();
        let senderData = {
            vendor_id: this.state.vendor_id,
            booking_id: this.props.match.params.id,
            price:this.state.price,
            proposal:this.state.proposal
        }
        let Configs = {
            headers: {
                token: window.localStorage.getItem('testapistring')
            }
        }
        // console.log(senderData);
        Axios.post('/api/create_quote', senderData , Configs).then(res=>{
            if(res.data.status == 200){
                toast.success('Create Quote Successfully',{position: "bottom-center"});
                this.props.history.push('/vendor/bookings-feed');
              
            } else {
                toast.error(res.data.msg,{position: "bottom-center"});
             
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
                <section className="section">
                    <div className="section-body">
                        <h2>Create Qoute </h2>
                        <div className="row">
                        <div className="card col-sm-12">
                                        <div className="col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="name">Qoute Price</label>
                                        <input value={this.state.price} onChange={this.getQuotePrice.bind(this)} className="form-control"  type="text"></input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name">Proposal</label>
                                        <textarea value={this.state.proposal} onChange={this.getProposal.bind(this)} className="form-control"  type="text"></textarea>
                                    </div>
                                    <div className="col-sm-12">
                                    <div className="form-group">
                                    <button 
                            onClick={this.createQuote.bind(this)} disabled={loading}
                            type="submit" className="btn btn-primary">
                                    { loading && <i className= 'fa fa-refresh fa-spain'></i>}
                                                   { loading && <span >Loading...</span>}
                                                   { !loading && <span >Submit</span>}
                               
                                </button>
                                    </div>
                                </div>
                                </div>
                               
                       
                        </div>
                    </div></div>
                </section>
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