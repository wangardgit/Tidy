import React, { Component } from 'react';
import Swal from 'sweetalert2';
import Axios from 'axios';
import toast from 'react-hot-toast';

class EditReview extends Component {

    constructor(props){
        super(props);
        this.state = {
        get_name: '',
        get_designation: '',
        get_comment: '',
        get_rating: '',
        get_image: '',
        status: '',
        loading:false,
        };
    }

    componentDidMount() {  
        Axios.get(`/api/edit-review/${this.props.match.params.id}`).then(res=>{
            console.log("cdm");
            console.log(res.data.data);
            if(res.data.status == 200) {
                this.setState({
                    get_name : res.data.data.name,
                    get_designation : res.data.data.designation,
                    get_comment : res.data.data.comment,
                    get_rating : res.data.data.rating,
                    get_image : res.data.data.image,
                    status : res.data.data.status
                    
                })
            }
        })
    }

    get_name(e){
        this.setState({
            get_name : e.target.value
        })
    }

    get_designation(e){
        this.setState({
            get_designation : e.target.value
        })
    }

    get_comment(e){
        this.setState({
            get_comment : e.target.value
        })
    }

    get_rating(e){
        this.setState({
            get_rating : e.target.value
        })
    }

    status(e){
        this.setState({
            status : e.target.value
        })
    }


    updateReview(event) {
        this.setState({ loading : true});
        event.preventDefault();
        let reviewData = {
            get_name : this.state.get_name,
            get_designation : this.state.get_designation,
            get_comment : this.state.get_comment,
            get_rating : this.state.get_rating,
            get_image : this.state.get_image,
            status : this.state.status,
            id: this.props.match.params.id
        }

        let Configs = {
            headers: {
                token: window.localStorage.getItem('testapistring')
            }
        }
        Axios.put(`/api/review/${this.props.match.params.id}`, reviewData , Configs).then(res=>{
            
            if(res.data.status == 200){
                toast.success('Review Updated Successfully',{position: "bottom-center"});
                this.props.history.push('/admin/list-reviews');
            //     Swal.fire({
            //         icon: 'success',
            //         title: 'Review updated Successfully',
            //         showConfirmButton: false,
            //         timer: 1500
            //     })
            // } else {
            //     Swal.fire({
            //         icon: 'error',
            //         title: res.data.msg,
            //         showConfirmButton: false,
            //         timer: 1500
            //     })
            }
        })
        setTimeout(() => {
            this.setState({ loading : false});
          }, 2000);
    }

    get_image(event) {
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
        Axios.post('/api/image_upload', formData, Configs).then(res => {

            if (res.data.status == 200) {
                toast.success('Image Uploaded.');
                this.setState({
                    get_image:res.data.url,
                    loading:false
                })
            } else {
                toast.error(res.data.msg);
                this.setState({
                    loading:false
                })
            }
        })
        

    }

    
    render() { 
        const {loading} = this.state;
        return ( 
            <div id="page-content">
                <div className="row">
                <div className="col-sm-12">
                <div className="panel panel-bordered">
                <div className="panel-heading">
                    <h4 className="panel-title">Reviews</h4>
                </div>
            <div className="panel-body">
                    <div className="row">
                        <div className="col-sm-12">
                        <div className="col-sm-12">
                                <div className="form-group">
                                    <label htmlFor="price">Name</label>
                                    <input 
                                    onChange={this.get_name.bind(this)}
                                    value={this.state.get_name} 
                                    type="text" 
                                    className="form-control"/>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group">
                                    <label htmlFor="price">Designation</label>
                                    <input 
                                    onChange={this.get_designation.bind(this)}
                                    value={this.state.get_designation} 
                                    type="text" 
                                    className="form-control" />
                                </div>
                            </div>

                            <div className="col-sm-12">
                                <div className="form-group">
                                    <label htmlFor="price">Rating</label>
                                    <input 
                                    onChange={this.get_rating.bind(this)} 
                                    value={this.state.get_rating} 
                                    type="text" 
                                    className="form-control" />
                                </div>
                            </div>

                            <div className="col-sm-12">
                                <div className="form-group">
                                <label htmlFor="type">Status:</label>
                                    <select className="form-control" name="type" value={this.state.status} onChange={this.status.bind(this)}>
                                        <option value="">Select</option>
                                        <option value={1}>Publish</option>
                                        <option value={0}>Discard</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="price">User Image</label>
                                        <input 
                                        onChange={this.get_image.bind(this)}
                                        type="file"></input>
                                    </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="price">Comment</label>
                                    <textarea
                                        onChange={this.get_comment.bind(this)} 
                                        value={this.state.get_comment} 
                                        style={{height:'100px',width:'100%'}}
                                    ></textarea>
                            </div>
                            
                            <div className="panel-footer text-right">
                                <button 
                                onClick={this.updateReview.bind(this)} 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading}>
                                    { loading && <i className= 'fa fa-refresh fa-spain'></i>}
                                    { loading && <span > Loading...</span>}
                                     { !loading && <span >Save</span>}
                                            </button>
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
 
export default EditReview;