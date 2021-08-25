import Axios from 'axios';
import React, { Component } from 'react';
import Swal from 'sweetalert2'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


class CreateEmail extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
        this.state = {
            email_title:'',
            
            email_content:''
            
            
        };
        
    }
    email_title(e){
        
        this.setState({
            email_title:e.target.value
        })
    }
   
    handleChange(value){
        
        this.setState({
            email_content:value
        })
    }
    
    save(e){
        e.preventDefault();
        Axios.post('/api/create-emails',this.state).then(res=>{
            
            if(res.data.status == 200){
                Swal.fire({
                    icon: 'success',
                    title: 'Email Added Successfully',
                    showConfirmButton: false,
                    timer: 1500
                }) 
                this.props.history.push('/admin/emails')
            }else{
                this.setState({
                    error_string:res.data.msg
                })
            }
        })
    }
    render() {
        return (
            <div id="page-content">
                <div className="panel">
                 <div className="panel-heading">
                        <h3 className="panel-title">Emails</h3>
                    </div>
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="form-group">
                                    <label htmlFor="price">Email Title</label>
                                    <input onChange={this.email_title.bind(this)} type="text" className="form-control" id="email_title"/>
                                   
                                </div>
                            </div>
                           
                            
                                 
                                   
                         </div>
                         <label htmlFor="price">Email Content</label>
                         <ReactQuill onChange={this.handleChange}  id="email_content"/>
                           
                                   
                               
                            
                        {
                            this.state.error_string != ''?
                            <p className="text-danger text-center">{this.state.error_string}</p>
                            :null
                        }
                        
                        </div>
                         
                        <div className="panel-footer text-right">
                            <button

                                onClick={this.save.bind(this)} type="submit" className="btn btn-primary">
                                Save
                                 </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateEmail;