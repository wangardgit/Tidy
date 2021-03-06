import Axios from 'axios';
import React , { Component } from 'react';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page_title: '',
            content:'',
            error_string:'',
            loading:false,
        };
    }

   
    title(event) {
        this.setState({
            page_title: event.target.value
        })
    }

    content(event) {
        this.setState({
            content: event
        })
    }
  


    createPage(event) {
        this.setState({ loading : true});
        event.preventDefault();
    
        Axios.post('/api/add_page', this.state).then(res=>{
           
            if(res.data.status == 200){
                toast.success('Page Added Successfully',{position: "bottom-center"});
                this.props.history.push('/admin/manage-pages');
               
            } else {
                toast.error('Error - '+res.data.msg,{position: "bottom-center"});
            }
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
                <div className="col-sm-12">
                <div className="panel panel-bordered">
                    <div className="panel-heading">
                    <h3 className="panel-title">Add Pages</h3>
                    </div>
                    <div className="panel-body">
                    <div className="panel">
                        <form encType="multipart/form-data">
                        <div className="panel-body">
                            <div className="row">
                                
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="price">Page Title</label>

                                        <input className="form-control"  onChange={this.title.bind(this)} type="text"></input>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="price">Page Content:</label>
                                        <ReactQuill  
                                        onChange={this.content.bind(this)}
                                        />
                                    </div>
                                </div>   
                            </div>
                        </div>
                        {
                            this.state.error_string != '' ?
                            <p className="text-center text-danger">{this.state.error_string}</p>
                            :
                            null
                        }
                        <div className="panel-footer text-right">
                            <button onClick={this.createPage.bind(this)} type="submit" disabled={loading} className="btn btn-primary">
                            { loading && <i className= 'fa fa-refresh fa-spain'></i>}
                                    { loading && <span > Loading...</span>}
                                     { !loading && <span >Submit</span>}
                                </button>
                        </div>
                        </form>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        );
    }
}

export default Create;