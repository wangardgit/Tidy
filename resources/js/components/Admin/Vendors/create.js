import React, { Component } from 'react';
import Axios from 'axios';
import { MAP_PLACES_API_KEY } from '../../Configs/Api';
import 'react-tabs/style/react-tabs.css';
import Autocomplete from 'react-google-autocomplete';
import '../../Vendor/admin.css';
import Swal from 'sweetalert2';
import SignUpRequest from '../../Vendor/Auth/SignUpRequest';
import toast from 'react-hot-toast';



class CreateVendor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btn_loading: false,
            insurance_certificate_type: 'own',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            address: '',
            phone: '',
            phonenumber:'+61',
            dob: '',
            australian_business_number: '',
            type_of_business: 'sole',
            business_name: '',
            trading: '',
            insurance_certificate: '',
            credit_card_number: '',
            cvc: '',
            expiry_date: '',
            card_holder_name: '',
            duration_of_insu_charges: '',
            expiry_year: '',
            expiry_month: '',
            error_string: '',
            businessname: '',
            step: 1,
            services: [],
            vendor_id: this.props.match.params.vendor_id,
            photo_id: [],
            Npc: [],
            ic: [],
            btn1_prg: 0,
            btn2_prg: 0,
            btn2_prg: 0,
            customer: {},
            agree_check: false,
            addresses:[],
            radius:0,
            places:'',
            lat:0,
            long:0,
            loc_address:'',
            loading:false,



        }
        console.log(this.state)
    }

    first_name(e) {
        this.setState({
            first_name: e.target.value
        });
    }

    last_name(e) {
        this.setState({
            last_name: e.target.value
        })
    }
    email(e) {
        this.setState({
            email: e.target.value
        })
    }
    getPassword(e) {
        this.setState({
            password: e.target.value
        })
    }
    phone(e) {
        this.setState({
            phone: e.target.value
        })
    }
    phonenumber(e){
        this.setState({
            phonenumber:e.target.value
        })
    }
    address(e) {
        this.setState({
            address: e.target.value
        })
    }
    dob(e){
        this.setState({
            dob: e.target.value
        })
    }
    australian_business_number(e) {
        this.setState({
            australian_business_number: e.target.value
        })
    }
    type_of_business(e) {
        this.setState({
            type_of_business: e.target.value
        })
    }
    change_step(step) {
        this.setState({
            step: step,
            error_string: ''
        }, function () {
            window.scrollTo(0, 0);
        })
    }
    business_name(e) {
        this.setState({
            business_name: e.target.value
        })
    }
    trading(e) {
        this.setState({
            trading: e.target.value
        })
    }

    radius(e){
        this.setState({
            radius:e.target.value
        })
    }

    componentDidMount() {
        Axios.post('/api/get-services').then(res => {
            this.setState({
                services: res.data.data
            })
        })
    }

    SelectService(index) {
        let temp = this.state.services;
        temp[index].check = !temp[index].check;
        this.setState({
            services: temp
        })
    }

    validate_vendor(e) {
        this.setState({ loading : true});
        e.preventDefault();
        console.log(this.state);
        // let payload = this.state;
        // delete payload.step;
        // console.log(payload)
        Axios.post('/api/validate_vendor', this.state).then(res => {
            console.log(res)
            if (res.data.status) {
                console.log(this.state)
                this.setState({
                    step:2,
                    error_string: '',
                })

            } else {
                this.setState({
                    error_string: res.data.message
                })
            }
        })
        setTimeout(() => {
            this.setState({ loading : false});
          }, 2000);
    }

    validate_services() {
        this.setState({ loading : true});
        let payload = {
            services: this.state.services,
            vendor_id: this.props.match.params.vendor_id
        }
        let check = false;
        this.state.services.map((data, index) => {
            if (data.check) {
                check = true;
            }
        })
        
        if (check) {
            this.setState({
                step: 3,
                error_string: ''
            }, function () {
                window.scrollTo(0, 0);
            })
        } else {
            this.setState({
                error_string: 'Please Select at least One Service'
            })
        }
        
        setTimeout(() => {
            this.setState({ loading : false});
          }, 2000);
    }
    
    submit_services() {
        let payload = {
            services: this.state.services,
            vendor_id: this.props.match.params.vendor_id
        }
        let check = false;
        this.state.services.map((data, index) => {
            if (data.check) {
                check = true;
            }
        })
        if (check) {
            this.setState({
                btn_loading: true
            })
            Axios.post('/api/save_vendor_services', payload).then(res => {
                this.setState({
                    btn_loading: false
                })
                this.props.history.push('/vendor-signup/3/' + this.props.match.params.vendor_id);
                console.log(res);
            })
        } else {
            this.setState({
                error_string: 'Please Selct at least One Service'
            })
        }

    }

    AddAddress(){
        console.log(this.state.places);
        let temp = this.state.addresses;
        temp.push({address:this.state.loc_address,lat:this.state.lat,long:this.state.long,radius:this.state.radius})
        this.setState({
            addresses:temp
        })
        console.log(temp)
    }

    places(place){

        let lat  = place.geometry.location.lat();
        let long = place.geometry.location.lng();
        this.setState({
            places:place,
            lat:lat,
            long:long,
            loc_address:place.formatted_address
        })
    }

    validate_addresses(){
        this.setState({ loading : true});
        if(this.state.addresses.length > 0){
            this.setState({
                step:4,
                error_string:''
            })
            setTimeout(() => {
                this.setState({ loading : false});
              }, 2000);
        }else{
            this.setState({
                error_string:'Please enter atleast one address.'
            })
            setTimeout(() => {
                this.setState({ loading : false});
              }, 2000);
        }
      
    }

    removeAddress(index) {
        let NPC_ = this.state.addresses;
        NPC_.splice(index, 1);
        this.setState({
            addresses: NPC_
        })
    }

    upload_NPC(event) {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        formData.append('token', window.localStorage.getItem('al'));
        let Configs = {
            headers: {
                token: window.localStorage.getItem('al'),
                'content-type': false,
                'mime-type': "multipart/form-data",
            },
            onUploadProgress: progressEvent => {
                this.setState({
                    btn2_prg: Math.round((progressEvent.loaded * 100) / progressEvent.total)
                })
            }
        }
        this.setState({
            loading: true,
        })
        Axios.post('/api/file_upload', formData, Configs).then(res => {

            if (res.data.status == 200) {
                let temp = this.state.Npc;
                temp.push({ url: res.data.url, title: 'National Police Check' })
                this.setState({
                    btn2_prg: false,
                    Npc: temp
                })
                Swal.fire({
                    icon: 'success',
                    title: 'File Uploaded Successfully',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: res.data.msg,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        })

    }

    removeNPC(index) {
        let NPC_ = this.state.Npc;
        NPC_.splice(index, 1);
        this.setState({
            Npc: NPC_
        })
    }

    upload_photo_id(event) {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        formData.append('token', window.localStorage.getItem('al'));
        let Configs = {
            headers: {
                token: window.localStorage.getItem('al'),
                'content-type': false,
                'mime-type': "multipart/form-data",
            },
            onUploadProgress: progressEvent => {
                this.setState({
                    progress: Math.round((progressEvent.loaded * 100) / progressEvent.total)
                })
            }
        }
        this.setState({
            loading: true,
        })
        Axios.post('/api/file_upload', formData, Configs).then(res => {

            if (res.data.status == 200) {
                let temp = this.state.photo_id;
                temp.push({ url: res.data.url, title: 'Photo ID' })
                this.setState({
                    btn2_prg: false,
                    photo_id: temp
                })
                Swal.fire({
                    icon: 'success',
                    title: 'File Uploaded Successfully',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: res.data.msg,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        })

    }

    removePhotoId(index) {
        let NPC_ = this.state.photo_id
        NPC_.splice(index, 1);
        this.setState({
            photo_id: NPC_
        })
    }

    card_holder_name(e) {
        this.setState({
            card_holder_name: e.target.value
        })
    }

    upload_insurance(event) {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        formData.append('token', window.localStorage.getItem('al'));
        let Configs = {
            headers: {
                token: window.localStorage.getItem('al'),
                'content-type': false,
                'mime-type': "multipart/form-data",
            },
            onUploadProgress: progressEvent => {
                this.setState({
                    btn1_prg: Math.round((progressEvent.loaded * 100) / progressEvent.total)
                })
            }
        }
        this.setState({
            loading: true,
        })
        Axios.post('/api/file_upload', formData, Configs).then(res => {

            if (res.data.status == 200) {
                let temp = this.state.ic;
                temp.push({ url: res.data.url, title: 'Insurance Certificate' })
                this.setState({
                    btn1_prg: false,
                    ic: temp
                })
                Swal.fire({
                    icon: 'success',
                    title: 'File Uploaded Successfully',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: res.data.msg,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        })

    }

    removeIC(index) {
        let NPC_ = this.state.ic;
        NPC_.splice(index, 1);
        this.setState({
            ic: NPC_
        })
    }

    InsuranceType() {
        this.setState({
            insurance_certificate_type: this.state.insurance_certificate_type == 'admin' ? 'own' : 'admin'
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

    async validate_documents() {
        this.setState({ loading : true});
        this.setState({
            error_string: ''
        })
        if (this.state.ic.length == 0) {
            if (this.state.insurance_certificate_type == 'own') {
                this.setState({
                    error_string: 'Please Upload Public Insurance Certificate'
                })
            }
        } else if (this.state.Npc.length == 0) {
            if (this.state.type_of_business == 'sole') {
                this.setState({
                    error_string: 'Please Upload National Police Check'
                })
            }
        } else if (this.state.photo_id.length == 0) {
            this.setState({
                error_string: 'Please Upload  Photo Id'
            })
        } else {
            this.setState({
                step: 5,
                error_string: ''
            }, function () {
                window.scrollTo(0, 0);
            })
        }
        if (this.state.insurance_certificate_type == 'admin') {
            await this.validate_card();
        }
        setTimeout(() => {
            this.setState({ loading : false});
          }, 2000);
    }

    agree_check() {
        this.setState({
            agree_check: !this.state.agree_check
        })
    }

    validate_card() {
        Axios.post('/api/validate_card', this.state).then(res => {
            if (res.data.status) {
                this.setState({
                    customer: res.data.customer,
                    step: 4
                })
            } else {
                this.setState({
                    error_string: res.data.message
                })
            }

        })
    }

    submit_request() {
        this.setState({ loading : true});
        Axios.post('/api/submit_vendor_request', this.state).then(res => {
            if (res.data.status == 200) {
                this.setState({
                    step: 6,
                    error_string: ''
                }, function () {
                    window.scrollTo(0, 0);
                })
            } else {
                this.setState({
                    error_string: 'Sorry. we are unable to submit your request.'
                })
            }
            toast.success('Vendor Added Successfully',{position: "bottom-center"});
        })
        setTimeout(() => {
            this.setState({ loading : false});
          }, 2000);
    }

    render() {
        const {loading} = this.state;
        return (
            <div id="page-content">
            <div className="row">
                <div className="col-md-12">
                <div className="panel panel-bordered">                    
                <div className="panel-body">
                <div className="container-fluid" id="grad1">
                <div className="row justify-content-center mt-0 ">
                    <div className="col-11 col-md-12 col-md-12 col-lg-12  p-0 mt-3 mb-2">
                        <div className="card card-signin p-3 animate_auth_modal  px-0 pt-4 pb-0 mt-3 mb-3">
                            <h2 className="text-center" style={{ fontSize: '48px' }} ><strong>Create Vendor</strong></h2>
                            <p className="text-center">Fill all form fields then click Next</p>
                            <div className = "row">
                                <div className="col-md-12 mx-0">
                                    {
                                        this.state.step == 1 ?
                                        <div>
                                            <div className="row">
                                                <div className="col-md-1"></div>
                                                    <div className="col-md-12">
                                                        <div className="panel">
                                                            <form className="mb-5">
                                                                <div className="panel-body">
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <div className="form-group">
                                                                                <label className="control-label">Firstname</label>
                                                                                <input value={this.state.first_name || ""} onChange={this.first_name.bind(this)} type="firstname" name="firstname" className="form-control" />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="form-group">
                                                                                <label className="control-label">Lastname</label>
                                                                                <input value={this.state.last_name || ""} onChange={this.last_name.bind(this)} type="lastname" name="lastname" className="form-control" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div className="form-group">
                                                                                <label className="control-label">Email</label>
                                                                                <input value={this.state.email || ""} onChange={this.email.bind(this)} type="email" name="email" className="form-control" />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="form-group">
                                                                                <label className="control-label">Phone</label>
                                                                                <div className="row">
                                                                                <div className="col-sm-3">
                                            
                                                                           <select value={this.state.phonenumber || ""}  onChange={this.phonenumber.bind(this)} type="number"  className="form-control auth_input_box">
                                                                         <option>+61</option>
                                                                      {/* <option>+61</option> */}
                                                                            </select>
                                                                                    </div>
                                                                                    <div className="col-sm-9">
                                                                                <input value={this.state.phone || ""} onChange={this.phone.bind(this)} type="phone" name="phone" className="form-control" />
                                                                            </div>
                                                                            </div> </div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="form-group">
                                                                                <label className="control-label">Date of Birth</label>
                                                                                <input value={this.state.dob || ""} onChange={this.dob.bind(this)} type="date" name="dob" className="form-control" />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-12">
                                                                            <div className="form-group">
                                                                                <label className="control-label">Address</label>
                                                                                <input value={this.state.address || ""} onChange={this.address.bind(this)} type="text" name="address" className="form-control" />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-12">
                                                                            <div className="form-group">
                                                                                <label className="control-label">Australian Business Number</label>
                                                                                <p style={{ fontSize: '12px' }} className="mb-1 py-1">Please note your name on this application must match the first and last
                                                                                    name registered to your ABN. If you do not have ABN yet, click here to <a target="blank" href="https://www.abr.gov.au/business-super-funds-charities/applying-abn">learn more</a>.</p>
                                                                                <input value={this.state.australian_business_number || ""} onChange={this.australian_business_number.bind(this)} type="number" className="form-control" />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-12">
                                                                            <div className="form-group">
                                                                                <label className="control-label">Type of Business</label>
                                                                                <select value={this.state.type_of_business || ""} onChange={this.type_of_business.bind(this)} type="text" className="form-control" >
                                                                                    <option>-- Select type of business--</option>
                                                                                    <option value={'sole'}>Sole trader</option>
                                                                                    <option value={'company'}>Company</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-12">
                                                                            <div className="form-group">
                                                                                <label className="control-label">Business Name</label>
                                                                                <input value={this.state.business_name || ""} onChange={this.business_name.bind(this)} type="text" className="form-control" />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-12">
                                                                            <div className="form-group">
                                                                                <label className="control-label">Trading as (optional)</label>
                                                                                <input value={this.state.trading || ""} onChange={this.trading.bind(this)} type="text" className="form-control" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    

                                                                </div>
                                                                {
                                                                    this.state.error_string != '' ?
                                                                        <p className="text-danger text-center">{this.state.error_string}</p>
                                                                        : null
                                                                }
                                                                    <div className="panel-footer text-right">
                                                                        <button onClick={this.validate_vendor.bind(this)} disabled={loading} className="btn btn-success" type="submit">
                                                                            {/* {
                                                                                this.state.btn_loading ?
                                                                                    <div id="displayspinner" style={{ display: 'block', }}>
                                                                                        <div className="spinner-border  ml-2 text-light spinner_format" role="status">
                                                                                            <span className="sr-only">Loading...</span>
                                                                                        </div>
                                                                                    </div>
                                                                                : <>Next</>
                                                                            } */}
                                                                             { loading && <i className= 'fa fa-refresh fa-spain'></i>}
                                                                             { loading && <span > Loading...</span>}
                                                                              { !loading && <span >Next</span>}
                                                                             </button>
                                                                    </div>
                                                            </form>
                                                        </div>
                                            </div>
                                            <div className="col-md-3"></div>

                                            </div>

                                        </div>
                                        : null
                                    }
                                    {
                                                this.state.step == 2 ?
                                                    <div >
                                                        <div className="row">
                                                            <div className="col-md-offset-4"></div>
                                                            <div className="col-md-10">
                                                                <div className="panel">
                                                                    <div className="panel-heading">
                                                                        <h3 className="text-center center_title">Select Services</h3>
                                                                    </div>

                                                                    <div className="panel-body">
                                                                        <div className="row">
                                                                            {
                                                                                this.state.services.map((data, index) => {
                                                                                    return (
                                                                                        <div onClick={this.SelectService.bind(this, index)} key={index} className="p-2">
                                                                                            <button className={!data.check ? "btn btn-outline-info" : "btn btn-success"}>
                                                                                                {data.check ?
                                                                                                    <i className="fas fa-check"></i>
                                                                                                    : null
                                                                                                }
                                                                                                {data.name}
                                                                                            </button>
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>

                                                                    </div>
                                                                    {
                                                                        this.state.error_string != '' ?
                                                                            <p className="text-danger text-center">{this.state.error_string}</p>
                                                                            : null
                                                                    }

                                                                    <div className="panel-footer row mt-5">
                                                                        <div className="text-left">
                                                                            <button  className="btn btn-info   " type="submit">
                                                                                {
                                                                                    this.state.btn_loading ?
                                                                                        <div id="displayspinner" style={{ display: 'block', }}>
                                                                                            <div className="spinner-border  ml-2 text-light spinner_format" role="status">
                                                                                                <span className="sr-only">Loading...</span>
                                                                                            </div>
                                                                                        </div>
                                                                                        : <>Previous</>
                                                                                }
                                                                            </button>
                                                                        </div>
                                                                        <div className="text-right ml-auto">
                                                                            <button onClick={this.validate_services.bind(this)} className="btn btn-success " disabled={loading} type="submit">
                                                                                {/* {
                                                                                    this.state.btn_loading ?
                                                                                        <div id="displayspinner" style={{ display: 'block', }}>
                                                                                            <div className="spinner-border  ml-2 text-light spinner_format" role="status">
                                                                                                <span className="sr-only">Loading...</span>
                                                                                            </div>
                                                                                        </div>
                                                                                        : <>Next</>
                                                                                } */}
                                                                                { loading && <i className= 'fa fa-refresh fa-spain'></i>}
                                                                             { loading && <span > Loading...</span>}
                                                                                 { !loading && <span >Next</span>}
                                                                                  </button>
                                                                           
                                                                        </div>

                                                                    </div>

                                                                    {/*===================================================*/}
                                                                    {/*End Block Styled Form */}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-1"></div>
                                                        </div>

                                                    </div>
                                                    : null
                                            }
                                            {
                                                this.state.step == 3 ?
                                                    <div >
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <label className="control-label">Enter Address</label>
                                                            <Autocomplete
                                                                apiKey={MAP_PLACES_API_KEY}
                                                                options={{types:'sublocality'}}
                                                                onPlaceSelected={(place) => {
                                                                    this.places(place);
                                                                }}
                                                                style={{ width: '100%' }}
                                                                className="form-control input_box fontSize = 40px"
                                                            />
                                                        </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label className="control-label">How far from your address would you like to work in km's</label>
                                                                <input value={this.state.radius || ""} onChange={this.radius.bind(this)} type="number" placeholder="Enter Radius" className="form-control" />
                                                            </div>
                                                            
                                                        </div>
                                                        <div className="col-md-12">
                                                            <button onClick={this.AddAddress.bind(this)} className="btn btn-info" style={{width:'100%',borderRadius:'0px'}}>Add Address</button>
                                                                
                                                            <table className="table table-hover table-light table-striped mt-2 fontSize = 40px">
                                                                                        <tbody>
                                                                                            {
                                                                                                this.state.addresses.map((data, index) => {
                                                                                                    return (
                                                                                                        <tr key={index}>
                                                                                                            <td>{data.address}</td>
                                                                                                            <td onClick={this.removeAddress.bind(this, index)}><i className="fas fa-times"></i></td>
                                                                                                        </tr>
                                                                                                    )
                                                                                                })
                                                                                            }
                                                                                        </tbody>
                                                                                    </table>
                                                        </div>
                                                        {
                                                                                this.state.error_string != '' ?
                                                                                    <p className="text-danger text-center">{this.state.error_string}</p>
                                                                                    : null
                                                                            }
                                                                            <div className="panel-footer col-md-12 row mt-5">
                                                                                <div className="text-left">
                                                                                    <button onClick={this.change_step.bind(this, 2)} className="btn btn-info   " type="submit">
                                                                                        {
                                                                                            this.state.btn_loading ?
                                                                                                <div id="displayspinner" style={{ display: 'block', }}>
                                                                                                    <div className="spinner-border  ml-2 text-light spinner_format" role="status">
                                                                                                        <span className="sr-only">Loading...</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                                : <>Previous</>
                                                                                        }
                                                                                    </button>
                                                                                </div>
                                                                                <div className="text-right ml-auto">
                                                                                    <button onClick={this.validate_addresses.bind(this)} disabled={loading}  className="btn btn-success   " type="submit">
                                                                                            { loading && <i className= 'fa fa-refresh fa-spain'></i>}
                                                                                           { loading && <span > loading</span>}
                                                                                          { !loading && <span > Next</span>}
                                                                                    </button>
                                                                                </div>

                                                                            </div>
                                                    </div>
                                                    : null
                                            }
                                            {
                                                this.state.step == 4 ?
                                                    <div >
                                                        <div className="row">
                                                            <div className="col-md-1"></div>
                                                            <div className="col-md-10">
                                                                <div className="panel">
                                                                    <div className="panel-heading">
                                                                        <h3 className="text-center center_title">Upload or Buy Insurance Certificate</h3>
                                                                    </div>
                                                                    <div >
                                                                        <div >
                                                                            <div className="py-4">

                                                                                <div className="  card p-3 form-group">
                                                                                    <label className="control-label p-2">National Police Check (Only for sole trader)  </label>
                                                                                    <input style={{ border: '0px' }} onChange={this.upload_NPC.bind(this)} type="file" className="form-control col-md-8" />
                                                                                    <table className="table table-hover table-light table-striped mt-2">
                                                                                        <tbody>
                                                                                            {
                                                                                                this.state.Npc.map((data, index) => {
                                                                                                    return (
                                                                                                        <tr key={index}>
                                                                                                            <td>{data.url}</td>
                                                                                                            <td onClick={this.removeNPC.bind(this, index)}><i className="fas fa-times"></i></td>
                                                                                                        </tr>
                                                                                                    )
                                                                                                })
                                                                                            }
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                                <div className="  card p-3 form-group">
                                                                                    <label className="control-label p-2">Photo ID  </label>
                                                                                    <input style={{ border: '0px' }} onChange={this.upload_photo_id.bind(this)} type="file" className="form-control col-md-8" />
                                                                                    <table className="table table-hover table-light table-striped mt-2">
                                                                                        <tbody>
                                                                                            {
                                                                                                this.state.photo_id.map((data, index) => {
                                                                                                    return (
                                                                                                        <tr key={index}>
                                                                                                            <td>{data.url}</td>
                                                                                                            <td onClick={this.removePhotoId.bind(this, index)}><i className="fas fa-times"></i></td>
                                                                                                        </tr>
                                                                                                    )
                                                                                                })
                                                                                            }
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                                <div className="  card p-3 form-group">
                                                                                    <label className="control-label p-2">Public Liability Insurance  </label>
                                                                                    <input style={{ border: '0px' }} onChange={this.upload_insurance.bind(this)} type="file" className="form-control col-md-8" />

                                                                                    <table className="table table-hover table-light table-striped mt-2">
                                                                                        <tbody>
                                                                                            {
                                                                                                this.state.ic.map((data, index) => {
                                                                                                    return (
                                                                                                        <tr key={index}>
                                                                                                            <td>{data.url}</td>
                                                                                                            <td onClick={this.removeIC.bind(this, index)}><i className="fas fa-times"></i></td>
                                                                                                        </tr>
                                                                                                    )
                                                                                                })
                                                                                            }
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>


                                                                            </div>
                                                                            <div className="d-flex">
                                                                                <input className="mt-1" onChange={this.InsuranceType.bind(this)} checked={this.state.insurance_certificate_type == 'admin'} type="checkbox" ></input>
                                                                                <label className="control-label ml-1"> Buy Public Liability Certificate from TidyHome</label>


                                                                            </div>
                                                                            {
                                                                                this.state.insurance_certificate_type == 'admin' ?
                                                                                    <div className="card p-3">
                                                                                        <div className="col-md-12 card p-3">
                                                                                            <div className="form-group">
                                                                                                <label className="control-label">Name on Card</label>
                                                                                                <input value={this.state.card_holder_name || ""} onChange={this.card_holder_name.bind(this)} type="name" className="form-control" />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-md-12">
                                                                                            <div className="form-group">
                                                                                                <label className="control-label">Card Number</label>
                                                                                                <input value={this.state.credit_card_number || ""} onChange={this.credit_card_number.bind(this)} type="number" className="form-control" />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-md-12 row">
                                                                                            <div className="col-md-3">
                                                                                                <div className="form-group">
                                                                                                    <label className="control-label">CVC</label>
                                                                                                    <input value={this.state.cvc || ""} onChange={this.cvc.bind(this)} type="number" placeholder="ex. 311" className="form-control" />

                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-1"></div>
                                                                                            <div className="col-md-3">
                                                                                                <div className="form-group">
                                                                                                    <label className="control-label">Expiration</label>
                                                                                                    <input value={this.state.expiry_month || ""} onChange={this.expiry_month.bind(this)} type="number" placeholder="MM" className="form-control" />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-1"></div>
                                                                                            <div className="col-md-3">
                                                                                                <div className="form-group">
                                                                                                    <label className="control-label"></label>
                                                                                                    <input value={this.state.expiry_year || ""} onChange={this.expiry_year.bind(this)} type="number" placeholder="YYYY" className="form-control" />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>

                                                                                        <p>You will be charged 5$ per month</p>
                                                                                    </div>
                                                                                    : null
                                                                            }
                                                                            {
                                                                                this.state.error_string != '' ?
                                                                                    <p className="text-danger text-center">{this.state.error_string}</p>
                                                                                    : null
                                                                            }
                                                                            <div className="panel-footer row mt-5">
                                                                                <div className="text-left">
                                                                                    <button onClick={this.change_step.bind(this, 3)} className="btn btn-info   " type="submit">
                                                                                        {
                                                                                            this.state.btn_loading ?
                                                                                                <div id="displayspinner" style={{ display: 'block', }}>
                                                                                                    <div className="spinner-border  ml-2 text-light spinner_format" role="status">
                                                                                                        <span className="sr-only">Loading...</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                                : <>Previous</>
                                                                                        }
                                                                                    </button>
                                                                                </div>
                                                                                <div className="text-right ml-auto">
                                                                                    <button onClick={this.validate_documents.bind(this)}  className="btn btn-success   " type="submit">
                                                                                        {/* {
                                                                                            this.state.btn_loading ?
                                                                                                <div id="displayspinner" style={{ display: 'block', }}>
                                                                                                    <div className="spinner-border  ml-2 text-light spinner_format" role="status">
                                                                                                        <span className="sr-only">Loading...</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                                : <>Next</>
                                                                                        } */}
                                                                                        {/* { loading && <i className= 'fa fa-refresh fa-spain'></i>}
                                                                                           { loading && <span > loading</span>}
                                                                                          { !loading && <span > Next</span>} */}
                                                                                          Next</button>
                                                                                </div>

                                                                            </div>



                                                                        </div>
                                                                        {/* <Tabs>
                                                                                <TabList>
                                                                                    <Tab onClick={this.InsuranceType.bind(this, 'admin')}>Buy Public Liability Insurance</Tab>
                                                                                    <Tab onClick={this.InsuranceType.bind(this, 'own')}>Upload Documents</Tab>
                                                                                </TabList>

                                                                                <TabPanel>
                                                                                   
                                                                                </TabPanel>
                                                                                <TabPanel>
                                                                                    
                                                                                </TabPanel>
                                                                            </Tabs> */}

                                                                    </div>
                                                                </div>


                                                                {/*===================================================*/}
                                                                {/*End Block Styled Form */}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3"></div>
                                                    </div>


                                                    : null
                                            }
                                            {
                                                this.state.step == 5 ?
                                                    <div>
                                                        <div className="panel-heading">
                                                            <h3 className="text-center center_title">Preview Request</h3>
                                                        </div>
                                                        <div className="card p-3">
                                                            <div className="panel-heading">
                                                                <h5 className="text-left center_title">Personal Information</h5>
                                                            </div>
                                                            <label className="control-label p-2">Name  </label>
                                                            <p>{this.state.first_name} {this.state.last_name}</p>
                                                            <label className="control-label p-2">Email  </label>
                                                            <p>{this.state.email}</p>
                                                            <label className="control-label p-2">Phone  </label>
                                                            <p>{this.state.phone}</p>
                                                            <label className="control-label p-2">Date of Birth  </label>
                                                            <p>{this.state.dob}</p>
                                                            <label className="control-label p-2">Australian Business Number  </label>
                                                            <p>{this.state.australian_business_number}</p>
                                                            <label className="control-label p-2">Type Of Business  </label>
                                                            <p>{this.state.type_of_business}</p>
                                                            <label className="control-label p-2">Business Name  </label>
                                                            <p>{this.state.business_name}</p>

                                                        </div>
                                                        <div className="card p-3 mt-2">
                                                            <div className="panel-heading">
                                                                <h5 className="text-left center_title">Selected Services</h5>
                                                            </div>
                                                            <label className="control-label p-2">Services  </label>
                                                            {
                                                                this.state.services.map((data, index) => {
                                                                    return (
                                                                        <>
                                                                            {
                                                                                data.check ?
                                                                                    <div>
                                                                                        {data.name}
                                                                                    </div>
                                                                                    : null
                                                                            }
                                                                        </>
                                                                    )
                                                                })
                                                            }


                                                        </div>

                                                        <div className="panel-footer row mt-5 px-3">
                                                            <div className="text-left">
                                                                <button onClick={this.change_step.bind(this, 4)} className="btn btn-info   " type="submit">
                                                                    {
                                                                        this.state.btn_loading ?
                                                                            <div id="displayspinner" style={{ display: 'block', }}>
                                                                                <div className="spinner-border  ml-2 text-light spinner_format" role="status">
                                                                                    <span className="sr-only">Loading...</span>
                                                                                </div>
                                                                            </div>
                                                                            : <>Previous</>
                                                                    }
                                                                </button>
                                                            </div>
                                                            <div className="text-right ml-auto">
                                                                <button onClick={this.submit_request.bind(this)}  className="btn btn-success   " type="submit">
                                                                    {/* {
                                                                        this.state.btn_loading ?
                                                                            <div id="displayspinner" style={{ display: 'block', }}>
                                                                                <div className="spinner-border  ml-2 text-light spinner_format" role="status">
                                                                                    <span className="sr-only">Loading...</span>
                                                                                </div>
                                                                            </div>
                                                                            : <>Submit</>
                                                                    } */}
                                                                    {/* { loading && <i className= 'fa fa-refresh fa-spain'></i>}
                                                                   { loading && <span > Loading...</span>}
                                                                   { !loading && <span >Submit</span>} */}
                                                                   Submit    </button>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    : null
                                            }
                                            {
                                                this.state.step == 6 ?
                                                    <SignUpRequest {...this.props}></SignUpRequest>
                                                    : null
                                            }

                                </div>

                            </div>
                        </div>
                        
                    </div>

                </div>

            </div>
            </div>  
            </div>
            </div>
            </div>
            </div>
           
        );
    }
}

export default CreateVendor;