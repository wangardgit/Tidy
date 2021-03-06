import Axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

class PaymentCards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            card_details:[],
            no_card_details:false,
            credit_card_number: '',
            cvc: '',
            card_holder_name: '',
            expiry_year: '',
            expiry_month: '',
            update_card:false,
            id:this.props.user.data.id,
            customer_id:this.props.user.data.id,
            loading:false,

        };
    }
     
    componentDidMount(){
        Axios.post('/api/get_customer_card',{id:this.props.user.data.id}).then(res=>{
            if(res.data.status == 200){
                this.setState({
                    card_details: res.data.customer_card
                })
            }else{
                this.setState({
                    no_card_details:true
                })
            }
            console.log(this.state.card_details);
        })
    }
      defineProp  ( obj, key, value ) {
        var config = {
          value: value,
          writable: true,
          enumerable: true,
          configurable: true
        };
        Object.defineProperty( obj, key, config );
      };
    handleStateChange(e){
        let state = {};
        this.defineProp( state , e.target.name , e.target.value );
        this.setState(state);
    }
    Update_Profile(e){
        e.preventDefault();
        this.setState({
            loading:true
        })
        Axios.post('/api/update_customer',this.state).then(res=>{
            this.setState({
                loading:false
            })
            if(res.data.status){
                toast.success('Customer Updated SuccessFully.');
                this.props.changeUser({is_login:true,is_apicall:true,data:res.data.customer})
            }
        })
    }

    update_customer_card(){
        this.setState({ loading : true});
        let cardData = {
            card_holder_name: this.state.card_holder_name,
            credit_card_number: this.state.credit_card_number,
            cvc: this.state.cvc,
            expiry_month: this.state.expiry_month,
            expiry_year: this.state.expiry_year,
            id:this.props.user.data.id,
            customer_id:this.props.user.data.id

        }

        Axios.post('/api/update_customer_card',cardData).then(res=>{
            console.log(cardData);
            if(res.data.status == true){
                toast.success('Card updated Successfully');
            
            }else{
                toast.error(res.data.message);
      
            }
        })
        setTimeout(() => {
            this.setState({ loading : false});
          }, 2000);

    }

    update_card(){
        this.setState({
            update_card:true
        })
    }
    credit_card_number(e) {
        this.setState({
            credit_card_number: e.target.value
        })
    }
    cvc(e) {
        this.setState({
            cvc: e.target.value
        })
    }
    expiry_month(e) {
        this.setState({
            expiry_month: e.target.value
        })
    }
    expiry_year(e) {
        this.setState({
            expiry_year: e.target.value
        })
    }
    card_holder_name(e) {
        this.setState({
            card_holder_name: e.target.value
        })
    }
    render() {
        const {loading} = this.state;
        return (
            <div className="tab-pane fade" id="payment" role="tabpanel" aria-labelledby="profile-tab">
            <div className="row">
                <div className="col-sm-12 padding-15">
                    <div className="blog-item profile-shadow">
                        <div className="edit-content">
                            <div className="col-md-12 auth_div">
                                <div className="login_div">
                                    <h1 className="login_page_heading">Payment Cards</h1>
                                    
                                    <div className="card-body">
                                                   {
                                                       this.state.no_card_details ?
                                                       <div className="text-center " >
                                                            Payment Card not Integrated
                                                       </div>
                                                       :
                                                       <div className="row">
                                                        <div className="col-md-4">
                                                        <strong><h6>Name on Card</h6></strong><br></br>
                                                        <h6>{this.state.card_details.card_holder_name}</h6>
                                                        </div>
                                                        <div className="col-md-4">
                                                        <strong><h6>Card Number</h6></strong><br></br>
                                                        <h6>{this.state.card_details.credit_card_number}</h6>
                                                        </div>    
                                                        <div className="col-md-2">
                                                        <strong><h6>CVC</h6></strong><br></br>
                                                        <h6>{this.state.card_details.cvc}</h6>
                                                        </div>   
                                                        <div className="col-md-2">
                                                        <strong><h6>Expiry</h6></strong><br></br>
                                                        <h6>{this.state.card_details.expiry_month}/{this.state.card_details.expiry_year}</h6>
                                                        </div>                                                
                                                    </div>
                                                   }
                                                   <div className="row">
                                                    <button onClick={this.update_card.bind(this)}  className="btn btn-info"> 
                                                    {/* { loading && <i className= 'fa fa-refresh fa-spain'></i>} */}
                                                   {/* { loading && <span >Loading...</span>} */}
                                                   {/* { !loading && <span >Loading...</span>} */}
                                                        {
                                                            this.state.no_card_details ?
                                                             <> Add New Card</> :
                                                             <> Change Card</>
                                                        }
                                                    </button>
                                                   </div>
                                                   {
                                                       this.state.update_card ?
                                                       <div className="card p-3 col-sm-12 mt-5">
                                                                                        <div className="col-sm-12  p-3">
                                                                                            <div className="form-group">
                                                                                                <label className="control-label">Name on Card</label>
                                                                                                <input value={this.state.card_holder_name || ""} onChange={this.card_holder_name.bind(this)} type="name" className="form-control" />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-sm-12">
                                                                                            <div className="form-group">
                                                                                                <label className="control-label">Card Number</label>
                                                                                                <input value={this.state.credit_card_number || ""} onChange={this.credit_card_number.bind(this)} type="number" className="form-control" />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-sm-12 row">
                                                                                            <div className="col-sm-3">
                                                                                                <div className="form-group">
                                                                                                    <label className="control-label">CVC</label>
                                                                                                    <input value={this.state.cvc || ""} onChange={this.cvc.bind(this)} type="number" placeholder="ex. 311" className="form-control" />

                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-sm-1"></div>
                                                                                            <div className="col-sm-3">
                                                                                                <div className="form-group">
                                                                                                    <label className="control-label">Expiration</label>
                                                                                                    <input value={this.state.expiry_month || ""} onChange={this.expiry_month.bind(this)} type="number" placeholder="MM" className="form-control" />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-sm-1"></div>
                                                                                            <div className="col-sm-3">
                                                                                                <div className="form-group">
                                                                                                    <label className="control-label"></label>
                                                                                                    <input value={this.state.expiry_year || ""} onChange={this.expiry_year.bind(this)} type="number" placeholder="YYYY" className="form-control" />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        {
                                                                                            this.state.error_string != ''?
                                                                                            <p className="text-center text-danger">{this.state.error_string}</p>
                                                                                            :null
                                                                                        }
                                                                                        <div className="col-sm-12  text-right p-3">
                                                                                           <button onClick={this.update_customer_card.bind(this)} disabled={loading} className="btn btn-success ">
                                                                                           { loading && <i className= 'fa fa-refresh fa-spain'></i>}
                                                                                            { loading && <span >Loading...</span>}
                                                                                            { !loading && <span >Save</span>} 
                                                                                               </button>
                                                                                        </div>
                                                                                        </div>
                                                    :null
                                                   }
                                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster></Toaster>
        </div>
        );
    }
}
const mapStateToProps = (state) => {
    return{
        user:state.user
    }
}
const mapDispatchToProps = (disptach) => {
    return{
        changeUser:(user)=>{disptach({type:'CHANGE_USER', payload:user})}
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(PaymentCards);
