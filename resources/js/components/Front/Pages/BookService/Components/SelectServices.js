import Axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import $ from 'jquery';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import toast from 'react-hot-toast';

class SelectServices extends Component {
    constructor(props) {
      var today = new Date(),

    dateToday = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();

     
      var today = new Date(),
      time = (today.getHours())
      + ':' + today.getMinutes();
      // currentDate = today.getFullYear() 
      // + '-' + (today.getMonth() + 1)
      //  + '-' + today.getDate();
        super(props);
        this.state = {
          currentTime: time,
          currentDate: dateToday,
            service_type:1,
            categories:[],
            sub_categories:[],
            service_id:0,
            sub_service_id:0,
            recurring:1,
            date:'',
            todaydate:[
              '07:00',
              '08:00',
              '09:00',
              '10:00',
              '11:00',
              '12:00',
              '13:00',
              '14:00',
              '15:00',
              '16:00',
              '17:00',
              '18:00',
              '19:00',
              '20:00'
              ],
            todayTime:[],
            time:'7:00am',
            error_string:'',
            date_flexible:0,
            time_flexible:0,
            custom_days:[
              {check:0},
              {check:0},
              {check:0},
              {check:0},
              {check:0},
              {check:0},
              {check:0}
            ],
            is_custom:0,
            custom_recurring:1,
            loading:false,
        };
    }
    service_type(val){
        this.setState({
            service_type:val
        })
    }
    componentDidMount(){
        console.log(this.props)
        this.setState({
          date:this.props.select_service_state.date,
          time:this.props.select_service_state.time,
          service_type:this.props.select_service_state.service_type ? this.props.select_service_state.service_type : 1 ,
          recurring:this.props.select_service_state.recurring ? this.props.select_service_state.recurring : 1
        })
        Axios.post('/api/getallcategory').then(res => {
          console.log(res);
            this.setState({
                service_id:window.localStorage.getItem('service'),
                sub_service_id:window.localStorage.getItem('sub_service'),
                categories:res.data.categories
            },function(){
              this.select_category(window.localStorage.getItem('service'));
            })
        }) 
        
        // var input = document.getElementById("date");
        // input.dateFormat = "dd/mm/yy";
        // var today = new Date();
        // var day = today.getDate();
        // // Set month to string to add leading 0
        // var mon = new String(today.getMonth()+1); //January is 0!
        // var yr = today.getFullYear();
        
        //   if(mon.length < 2) { mon = "0" + mon; }
        
        //   var date = new String( yr + '-' + mon + '-' + day );
        //   this.setState({
        //     date:date
        //   })
        // input.disabled = false; 
        // input.setAttribute('min', date);
        // var date = new Date();
        // date.setDate(date.getDate()-1);
        // var $j = jQuery.noConflict();
        // $j(document).ready(function(){
        //   $j('.datepicker').datepicker({
        //     format: 'dd-mm-yyyy',
        //     startDate: date
        // })
        // })
      
       
    }
    custom_day(index){
      let temp = this.state.custom_days;
      temp[index].check = !this.state.custom_days[index].check;
      this.setState({
        custom_days:temp
      })
    }
    select_category(id){
      let temp = this.state.categories;
      temp.map((data,index)=>{
          if(data.id == id){
            this.setState({
                service_id:data.id,
                sub_categories:data.subcategory
            })
          }
      })
    }
    select_sub_category(e){
        this.setState({
            sub_service_id:e.target.value
        })
    }
    select_recurring(val){
      if(val == 5){
        this.setState({
          is_custom:1,
          recurring:val
        })
      }else{
        this.setState({
          recurring:val,
          is_custom:0
      })
      }
       
    }
    custom_recurring(val){
      this.setState({
        custom_recurring:val
      })
    }
    Submit(e){
      // console.log(e);
      this.setState({ loading : true});
        e.preventDefault();
        Axios.post('/api/validate_select_service',this.state).then(res=>{
          if(res.data.status){
            this.props.select_service(this.state);
            this.props.change_step(2);
          }else{
              
            toast.error(res.data.message,{position: "bottom-center"});
          }
        })
        setTimeout(() => {
          this.setState({ loading : false});
        }, 2000);
    }
    
    date(e){
      this.setState({
        date:e
      })
     
      let data = {
              date: e
          }
          Axios.post('/api/date_checker',data).then(res=>{  
            console.log(res);
                this.setState({
                  todayTime:res.data.todayTime,
                })
                if(res.data.status != 200)
                if(this.state.currentTime > "20:00")
                {
                 toast.error('Please Select Upcomming date. we Can not book any booking in Current date after 8PM',{position: "bottom-center"});
                }
                else{
                  null
                }
            })
    }
  
  
    time(e){
      this.setState({
        time:e.target.value
      })
    }
    date_flexible(e){
      this.setState({
        date_flexible:e.target.value
      })
    }
    time_flexible(e){
      this.setState({
        time_flexible:e.target.value
      })
    }
    componentDidUpdate(){
      console.log(this.props)
    }
    render() {
      const {loading} = this.state;
        return (
            <div className>
            <div id="headingOne">
            </div>
            <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
              <div>
                <h2 className="title text-center">
                  Book your cleaning service</h2>
                <div className="divider-line" />
                <form className="services-page">
                  <h3>Select Service{this.state.currentDateTime}</h3>
                  <div className="row">
                 <div className="col-md-12">
                  
                  <select value={this.state.service_id} onChange={(e)=>{this.select_category(e.target.value)}} name="gender" className="input--style-1 form-control col-md-12">
                          <option disabled="disabled" selected="selected">Please Select</option>
                          {
                              this.state.categories.map((data,index)=>{
                                  return(
                                    <option key={index} value={data.id}>{data.name}</option>
                        
                                  )
                              })
                          }
                    </select>
                  </div>
                 </div>
                 {
                     this.state.sub_categories.length > 0 ? 
                     <>
                     <h3 className="mt-3">Select Sub Service</h3>
                        <div className="row">
                        <div className="col-md-12">
                        
                        <select onChange={this.select_sub_category.bind(this)} value={this.state.sub_service_id} className="input--style-1 form-control col-md-12">
                                <option  default="selected">Please Select</option>  
                                {
                                  this.state.sub_categories.map((data,index)=>{
                                    return(
                                    <option key={index} value={data.id}>{data.name}</option>
                                      
                                    )
                                  })
                                }
                                </select>
                        </div>
                        </div>
                     </>
                     :null
                 }
                  <div className="divider-line" />
                  <h3>Service Requested</h3>
                    <p>When would you like us to come?</p>
                    <div className="row">
                   
                    <div className="col-md-6">
                      <div>
                      {/* value={this.state.date || ""} */}
                        {/* <input value=""   id="date_" onChange={this.date.bind(this)}
                         className="input--style-1 datepicker" min="1990-01-01" max="2035-12-31" placeholder="dd-mm-yyyy" name="date" /> */}
                        {/* <i className="zmdi zmdi-calendar-note input-icon js-btn-calendar" /> */}
                        <DatePicker id="example-datepicker"
                          dateFormat={"dd/MM/yyyy"}
                         selected={this.state.date} 
                         className="input--style-1 col-md-12"
                         placeholderText="dd/mm/yyyy"
                         minDate={new Date()}
                        //  showDisabledMonthNavigation
                          onChange={(date)=>{this.date(date)}}
                          checked={this.state.date == null} />

                      </div>
                      <span className="d-flex" style={{marginTop:"10px"}}>
                      <input onChange={this.date_flexible.bind(this)} type="checkbox" className="col-sm-1" style={{marginTop:"5px"}}></input> {
                          
                          }I am flexible with the date +/- 1 day 
                      </span>
                    </div>
                    {
                            this.state.date != null  ?
                            <div className="col-md-6">
                     
                        {/* <div className="input--stydle-1" > */}
                          <select  value={this.state.time || ""} onChange={this.time.bind(this)} name="gender"   className="col-md-12 input--style-1">
                            {/* <option disabled="disabled" selected="selected">Time to</option> */}
                            {/* <option>Select Time</option> */}
                           {
                             this.state.todayTime != '' ? 
                                this.state.todayTime.map((data,index)=>{
                                return(
                                  <option>{ 
                                    data   
                                    }</option>
                                   
                                   
                                )
                            })
                            :
                            this.state.currentTime < "20:00" ?
                             this.state.todaydate.map((data,index)=>{
                                return(

                                  this.state.currentTime < data  ?
                                  <option>{ 
                                     data  
                                    }</option>
                                    : null
                                    
                                    
                                    )
                                  })
                                  :
                                  <option selected >Please Select Any Coming Date </option>
                                
                           }
                          
                         
                            
                            {/* {
                                        
                                        
                                                this.state.todayTime.map((data,index)=>{
                                                    return(
                                                      // this.state.currentMint < 
                                                      this.state.currentTime < data ?
                                                      <option>{ 
                                                        data + '' + this.state.currentTime  
                                                        }</option>
                                                       :
                                                       null

                                                    )
                                                })
                                            } */}
                            {/* <option value={'7:00am'}>{this.state.currentTime < '7' ? "7:00am" : "" }</option>
                            <option>{this.state.currentTime < '8' ? "8:00am" : "" }</option>
                            <option>9:00am</option>
                            <option>10:00am</option>
                            <option>11:00am</option>
                            <option>12:00pm</option>
                            <option>01:00pm</option>
                            <option>02:00pm</option>
                            <option>03:00pm</option>
                            <option>04:00pm</option>
                            <option>05:00pm</option>
                            <option>06:00pm</option>
                            <option>07:00pm</option>
                            <option>08:00pm</option> */}
                            {/* <option>09:00pm</option> */}
                          </select>
                          
                        {/* </div> */}
                      <span className="d-flex" style={{marginTop:"10px"}}>
                      <input  onChange={this.time_flexible.bind(this)}  type="checkbox" className="col-sm-1" style={{marginTop:"5px"}}></input>I am flexible with the time +/- 2 hours 
                      </span>
                    </div>
                   : null }
                    
                    {/* <div className="col-md-3">
                      <div className="inpust-group">
                        <div className="input--stydle-1">
                          <select name="gender" className="col-md-12 input--style-1">
                            <option disabled="disabled"  selected="selected">Time to</option>
                            <option>8:00am</option>
                            <option>9:00am</option>
                            <option>10:00am</option>
                            <option>11:00am</option>
                            <option>12:00am</option>
                            <option>01:00pm</option>
                            <option>02:00pm</option>
                            <option>03:00pm</option>
                            <option>04:00pm</option>
                            <option>05:00pm</option>
                            <option>06:00pm</option>
                            <option>07:00pm</option>
                            <option>08:00pm</option>
                            <option>09:00pm</option>
                          </select>
                          <div className="select-dropdown" />
                        </div>
                      </div>
                    </div> */}
                  </div>
                  <div className="divider-line" />
                  <h3>How Often?</h3>
                  {/* <p>It's all about matching you with the perfect cleaner for your home. Scheduling is flexible. Cancel or reschedule anytime.</p> */}
                  <div className="label-box-wrap">
                    <span className="wpcf7-form-control-wrap first_as_label1 ml-auto mr-auto">
                    <span className="wpcf7-form-control wpcf7-radio">
                        <span  onClick={this.service_type.bind(this,1)} className="wpcf7-list-item1 wpcf7-list-item first"><br />
                          <label><input checked={this.state.service_type == 1}   name="first_as_label1"  type="radio"  />
                          <span className="wpcf7-list-item-label1">One Time</span></label><br />
                        </span>
                        <span onClick={this.service_type.bind(this,2)} className="wpcf7-list-item1 wpcf7-list-item "><br />
                          <label><input checked={this.state.service_type == 2}  name="first_as_label1" type="radio"  />
                          <span className="wpcf7-list-item-label ">Recurring</span></label><br />
                        </span>
                      </span>
                    </span>
                  </div>
                  {
                      this.state.service_type == 2 ?
                      <>
                      <div className="label-box-wrap">
                    <span className="wpcf7-form-control-wrap first_as_label">
                    <span  className="wpcf7-form-control wpcf7-radio"><span onClick={this.select_recurring.bind(this,1)} className="wpcf7-list-item first"><br />
                          <label><input checked={this.state.recurring == 1} name="first_as_label" defaultValue="One Time Service daily" type="radio"  /><span className="wpcf7-list-item-label">Daily</span></label><br />
                        </span><span onClick={this.select_recurring.bind(this,2)} className="wpcf7-list-item"><br />
                          <label><input checked={this.state.recurring == 2} name="first_as_label" defaultValue="Weekly Discount" type="radio" />
                          <span className="wpcf7-list-item-label">Weekly<br /></span>
                           </label><br />
                        </span><span onClick={this.select_recurring.bind(this,3)} className="wpcf7-list-item"><br />
                          <label><input checked={this.state.recurring == 3} name="first_as_label" defaultValue="Every 2 Weeks  Discount" type="radio" /><span className="wpcf7-list-item-label">Fornightly  <br /></span></label>
                        </span><span onClick={this.select_recurring.bind(this,4)} className="wpcf7-list-item last"><br />
                          <label><input checked={this.state.recurring == 4} name="first_as_label" defaultValue="Every 4 Weeks Discount" type="radio" /><span className="wpcf7-list-item-label">Monthly  <br /></span></label>
                        </span>
                        <span onClick={this.select_recurring.bind(this,5)} className="wpcf7-list-item last"><br />
                          <label><input checked={this.state.recurring == 5} name="first_as_label" defaultValue="Every 4 Weeks Discount" type="radio" /><span className="wpcf7-list-item-label">Custom  <br /></span></label>
                        </span>
                      </span>
                    </span>
                   
                  </div>
                  {
                    this.state.is_custom == 1 ?
                    <>
                    <div className="row">
                    <div className="d-flex col-md-2" style={{width:"100%"}}>
                      <input onChange={this.custom_day.bind(this,0)} type="checkbox" className="col-sm-6 mt-1 "style={{width:"75%"}}></input>
                      Monday
                      </div>
                      <div className="d-flex col-md-2"style={{width:"100%"}}>
                      <input onChange={this.custom_day.bind(this,1)} type="checkbox" className="col-sm-6 mt-1"style={{width:"75%"}}></input>
                      Tuesday
                      </div>
                      <div className="d-flex col-md-2"style={{width:"100%"}}>
                      <input onChange={this.custom_day.bind(this,2)} type="checkbox" className="col-sm-6 mt-1"style={{width:"75%"}}></input>
                      Wednesday
                      </div>
                      <span className="d-flex col-md-2"style={{width:"100%"}}>
                      <input onChange={this.custom_day.bind(this,3)} type="checkbox" className="col-sm-6 mt-1"style={{width:"75%"}}></input>
                      Thursday
                      </span>
                      <span className="d-flex col-md-2"style={{width:"100%"}}>
                      <input onChange={this.custom_day.bind(this,4)} type="checkbox" className="col-sm-6 mt-1"style={{width:"75%"}}></input>
                      Friday
                      </span>
                      <span className="d-flex col-md-2"style={{width:"100%"}}>
                      <input onChange={this.custom_day.bind(this,5)} type="checkbox" className="col-sm-6 mt-1"style={{width:"75%"}}></input>
                      Saturday
                      </span>
                      <span className="d-flex col-md-2"style={{width:"100%"}}>
                      <input onChange={this.custom_day.bind(this,6)} type="checkbox" className="col-sm-6 mt-1"style={{width:"75%"}}></input>
                      Sunday
                      </span>
                    </div>
                    <br></br>
                    <div className="row">
                    <div className="d-flex col-md-2"style={{width:"100%"}}>
                      <input style={{width:"75%"}} onChange={this.custom_recurring.bind(this,1)} type="radio" checked={this.state.custom_recurring == 1} className="col-sm-6 mt-1 "></input>
                      Weekly
                      </div>
                      <div className="d-flex col-md-2"style={{width:"100%"}}>
                      <input style={{width:"75%"}} onChange={this.custom_recurring.bind(this,2)} type="radio" checked={this.state.custom_recurring == 2} className="col-sm-6 mt-1"></input>
                      Fornightly
                      </div>
                      <div className="d-flex col-md-2"style={{width:"100%"}}>
                      <input style={{width:"75%"}} onChange={this.custom_recurring.bind(this,3)} type="radio" checked={this.state.custom_recurring == 3} className="col-sm-6 mt-1"></input>
                      Monthly
                      </div>
                     
                    </div>
                    </>
                    :null 

                  }
                  </>
                  :null
                  }
                  <div className="divider-line" />
                  {
                    this.state.error_string != '' ?
                    <p className="text-center text-danger">{this.state.error_string}</p>
                    :null
                  }
                  <div className="row">
                    <div className="col-md-9" />
                    <div className="col-md-3">
                      <button onClick={this.Submit.bind(this)} disabled={loading} 
                     
                      className="p-t-20 btn btn-success btn--radius btn--green" type="submit" id="#collapseTwo">
                      
                       { loading && <i className= 'fa fa-refresh fa-spain'></i>}
                      { loading && <span >Loading...</span>}
                      { !loading && <span > Next</span>}
      
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>    
        );
    }
}
const mapDispatchToProps = (dispatch) => {
    return{
          change_step:(step)=>{
          dispatch({type:'CHANGE_BOOKING_STEP',payload:step})
        },
        select_service:(data)=>{dispatch({type:'CHANGE_SELECT_SERVICE',payload:data})}
    }
}
const mapStateToProps = (state) => {
  return{
    select_service_state:state.select_service_state
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(SelectServices);
