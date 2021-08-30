import React, { Component } from 'react';
import { img_baseurl } from '../../../Configs/Api';
import Axios from 'axios';
import { connect } from 'react-redux';
import toast from 'react-hot-toast';
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auth_type:1,
            email:'',
            password:'',
            form_error:false,
            error_string:''
        };
    }
    set_auth_type(val){
        if(val == 2){
            window.open("/vendor-login" , "_blank")
        }
        this.setState({
            auth_type:val
        })
        
    }
    email(e){
        this.setState({
            email:e.target.value
        })
    }
    password(e){
        this.setState({
            password:e.target.value
        })
    }
    login(e){
        e.preventDefault();
        Axios.post('/api/customer-login',this.state).then(res=>{
            if(res.data.status == 200){
                console.log(res);
                window.localStorage.setItem('cus_token',res.data.customer.token);
                this.props.changeUser({is_login:true,data:res.data.customer});
                // if(!res.data.customer.stripe_id){
                //     this.props.CHANGE_AUTH_TYPE('customer_card');
                // }

                // this.props.history.push('/');
            }else{
                this.setState({
                    form_error:true,
                    error_string:res.data.message,

                })
                toast.error('Error - '+res.data.message)
            }
        })
    }
    render() { 
        return (
            <React.Fragment>
            {/* <div className="back_image"></div> */}
           
            <div className="row">
               
                {/* <div className="login_img_div">
                        <img src={img_baseurl+"login-img.png"}></img>
                    </div> */}
               
                <div className="col-md-12 auth_div">
                    <div className="login_div"> 
                        {/* <div className="auth-site-logo">
                            <img className="logo" src={img_baseurl+"site-logo.png"} alt="Indico"/>
                        </div> */}
                        <h1 className="login_page_heading">Login</h1>
                        <div className="form_div">
                            <form>
                            <div class="form-group input_div ">
                                <label className="input_label">Email</label>
                                <input onChange={this.email.bind(this)} type="email" 
                                class="form-control auth_input_box" autoFocus 
                                />
                            </div>
                            <div class="form-group input_div ">
                                <label className="input_label">Password</label>
                                <input onChange={this.password.bind(this)} 
                                    type="password" class="form-control auth_input_box" 
                                     aria-describedby="emailHelp" 
                                />
                            </div>
                            {/* <div >
                                <div className="row ml-0">   
                                    <div className="col-md-6 row">
                                    <input onChange={this.set_auth_type.bind(this,1)} 
                                        checked={this.state.auth_type == 1}
                                        value={this.state.auth_type || " "}
                                    type="radio" className="mt-2 " name="auth_type" value="Customer"></input>
                                        <p className="radio_label">Customer</p>
                                    </div>
                                    <div className="col-md-6 row">
                                    <input onChange={this.set_auth_type.bind(this,2)} 
                                        checked={this.state.auth_type == 2 }
                                        value={this.state.auth_type || " "}
                                         type="radio" className="mt-2 "
                                          name="auth_type" value="Vendor">
                                    </input>
                                        <p className="radio_label">Vendor</p>
                                    </div>
                                </div>  
                            </div> */}
                            <div>
                                {
                                    this.state.form_error ?
                                    <p className="text-danger">{this.state.error_string}</p>
                                    :null
                                }
                            </div>
                                <div className="input_div">
                                    <button  onClick={this.login.bind(this)} className="btn submit_button btn-info">Login</button>
                                </div>
                            </form>
                            <div>
                                <hr></hr>
                                <p className="auth_divider_text">Are You New to TidyHome ? <span> <a  onClick={()=>{this.props.CHANGE_AUTH_TYPE('signup')}}>Sign Up</a></span></p>

                              
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4"></div>
            </div>
            </React.Fragment>
        );
    }
}
 
const mapDispatchToProps = (disptach) => {
    return{
        changeUser:(user)=>{disptach({type:'CHANGE_USER', payload:user})},
        CHANGE_AUTH_TYPE:(type)=>{disptach({type:'CHANGE_AUTH_TYPE',payload:type})}
    }
}
 
export default connect(null,mapDispatchToProps)(Login);