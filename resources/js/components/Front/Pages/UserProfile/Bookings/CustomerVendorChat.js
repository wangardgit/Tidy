import Axios from 'axios';
import React, { Component } from 'react';
import toast from 'react-hot-toast';
import { connect } from 'react-redux';

class CustomerVendorChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages:[],
            no_messages:[],
            newmessage:'',
            chat:{id:0},
            assignedVendor:'',
            loading:false,
        };
    }
     componentDidMount(){
        Axios.post('/api/get_booking_by_id',{id:this.props.booking_id}).then(res=>{
            this.setState({
                assignedVendor: res.data.data,
            })
        });
       setInterval(()=>{
        
        Axios.post('/api/get_vendor_customer_messages',{customer_id:this.props.user.data.id,booking_id:this.props.booking_id}).then(res=>{
            if(res.data.status == 200){
                if(this.state.messages.length > 0){
                    if(this.state.messages[this.state.messages.length-1].id != res.data.messages[res.data.messages.length - 1].id 
                        && 
                        this.state.messages[this.state.messages.length-1].sender != res.data.messages[res.data.messages.length - 1].sender 
                        ){
                        console.log('audio playing');
                        this.audioRef.play();

                    }
                }
             this.setState({
                 messages:res.data.messages,
                 no_messages:false,
             })
            }else{
             this.setState({
                 no_messages:true
             })
            }
         })
         this.set_scroll();
       },4000)
    
     }
     handle_new_message(e){
        this.setState({
            newmessage:e.target.value
        })
    }
    set_scroll(){
        var d = $('#messages_div');
        d.scrollTop(d.prop("scrollHeight"));
    }
    send_message(e){
        this.setState({ loading : true});
        e.preventDefault();
        let array = this.state.messages;
        let newmsg = {
            chat_id: this.state.chat.id,
            message: this.state.newmessage,
            sender:'c',
            customer_id:this.props.user.data.id,
            vendor_id:this.state.assignedVendor.vendor_id,
            booking_id:this.props.booking_id
        }
        array.push(newmsg);
        this.setState({
            messages:array
        },function(){
            this.set_scroll();
            this.setState({
                newmessage:''
            })
        })
    
        Axios.post('/api/customer_ven_message_sender',newmsg).then(res=>{
            console.log(res);
            toast.success('message sent');
            Axios.post('/api/get_vendor_customer_messages',{customer_id:this.props.user.data.id,booking_id:this.props.booking_id}).then(res=>{
                if(res.data.status == 200){
                 this.setState({
                     messages:res.data.messages,
                     no_messages:false,
                 })
                }else{
                 this.setState({
                     no_messages:true
                 })
                }
             })
        })
        setTimeout(() => {
            this.setState({ loading : false});
          }, 2000);
    }
    render() {
        const {loading} = this.state;
        return (
            
            <div >
            <div className="row">
                <div className="col-sm-12 padding-15">
                    <div className="blog-item profile-shadow">
                        <div className="edit-content">
                            <div className="col-md-12 auth_div">
                                <div className="login_div">
                                    {/* <h1 className="login_page_heading">Chat With Vendor</h1> */}
                 <audio ref={(input) => {this.audioRef = input}} src="/audio/text_sound.mp3" />
                   
                    <div className="messaging">
                        <div className="inbox_msg">
                        {
                               !this.state.no_messages?
                                    <div className="mesgs col-md-12">

                                   
                                    <hr></hr>

                                    <div id="messages_div"  className="msg_history">
                                        {
                                            this.state.messages.map((msg,index)=>{
                                                return(
                                                    <div key={index} className={msg.sender == 'c' ? "outgoing_msg" : 'incoming_msg '}>
                                                        <div className={msg.sender == this.props.user.data.id ? "hide_img" : 'incoming_msg_img'}> 
                                                        {/* <img src={img_base+msg.profile_image} alt="sunil" /> */}
                                                         </div>
                                                        <div className={msg.sender == 'c' ? "sent_msg" : ' received_msg'}>
                                                            <div className={msg.sender == 'c' ? "" : 'received_withd_msg'}>
                                                                <p>{msg.message}</p>
                                                                <span className="time_date">{msg.time}    |  {msg.date}</span></div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                            </div>
                            :
                            <>
                            {
                                this.state.assignedVendor.vendor_status == 1 ?
                                <div>
                                    <img style={{width:'180px',marginTop:'100px',marginBottom:'100px'}} src="/images/nomessages.png"></img>
                                    <br></br>
                                    <h3>
                                    No Messages Existed. <br></br> Please send a message to start a chat with vendor on this booking</h3>
                                </div>
                                :null
                                
                            }
                            
                            </>
                            }
                            {
                                this.state.assignedVendor.vendor_status == 1 ?
                                <div className="comment-respond ">
                                        <form >
                                            <div className="row pt-5">
                                                <div className="col-md-10">
                                                    <div className="form-inputs">
                                                        <input value={this.state.newmessage || ""} className="form-control input_box" onChange={this.handle_new_message.bind(this)} placeholder="Type Message Here" type="text" />
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <button  onClick={this.send_message.bind(this)} disabled={loading} href="#" className="bk-btn2">
                                                        { loading && <i className= 'fa fa-refresh fa-spain'></i>}
                                                        { loading && <span >Sending</span>}
                                                        { !loading && <span >Send</span>}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    :
                                    <h3>Vendor Assigning process is not completed yet (You can chat with vendor,once the process is completed)</h3>
                            }
                            
                        </div>
                    </div></div>
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                    
        );
    }
}
const mapStateToProps = (state) =>{
    return{
        user:state.user
    }
}
export default connect(mapStateToProps)(CustomerVendorChat);
