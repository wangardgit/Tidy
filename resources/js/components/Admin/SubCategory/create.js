import Axios from 'axios';
import React , { Component } from 'react';
import img_baseurl from '../../Configs/Api';
import Swal from 'sweetalert2';

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:'',
            category_id: '',
            categories: [],
            image: '',
            display: false,
            loading:false
        };
    }

    componentDidMount(){
        Axios.get(`/api/category`,{ headers: {
            token: window.localStorage.getItem('testapistring')
        }}).then(res=>{
            if(res.data.status == 200) {
                this.setState({
                    categories: res.data.categories
                })
            } 
        })
    }

    category(event) {
        this.setState({
            name: event.target.value
        })
    }

    getCategory(event) {
        this.setState({
            category_id: event.target.value
        })
    }

    getImage(event) {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            const promises = files.map(file => {
                return (new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.addEventListener('load', (ev) => {
                        resolve(ev.target.result);
                    });
                    reader.addEventListener('error', reject);
                    reader.readAsDataURL(file);
                }))
            });
            Promise.all(promises).then(images => {
                this.setState({
                    image: images[0]
                })
            }, error => { console.error(error); });
        }
    }

    createcategory(event) {
        
        event.preventDefault();
        let senderData = {
            name: this.state.name,
            category_id: this.state.category_id,
            image: this.state.image,
        }
        let Configs = {
            headers: {
                token: window.localStorage.getItem('testapistring')
            }
        }
        this.setState({
            loading: true
        })
        Axios.post('/api/subcategory', senderData , Configs).then(res=>{
            this.setState({
                loading: false
            })
            if(res.data.status == 200){
                this.props.history.push('/admin/list-subcategory');
                Swal.fire({
                    icon: 'success',
                    title: 'SubCategory Added Successfully',
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

    render() {
        return (

            <div id="page-content">
            <div className="row">
                <div className="col-sm-12">
                <div className="panel panel-bordered">
                    <div className="panel-heading">
                    <h3 className="panel-title">SubCategory</h3>
                    </div>
                    <div className="panel-body">
                    <div className="panel">
                        <form encType="multipart/form-data">
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                    <label htmlFor="category_id">Category:</label>
                                        <select className="form-control" name="category_id" onChange={this.getCategory.bind(this)}>
                                            <option value="">Select</option>
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
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="price">Name:</label>
                                        <input onChange={this.category.bind(this)} type="text" className="form-control" id="price" placeholder="Enter Price" name="price"/>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                            <span className="pull-left btn btn-primary btn-file">
                                                Upload Image <input type="file" onChange={this.getImage.bind(this)} />
                                            </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel-footer text-right">
                            <button onClick={this.createcategory.bind(this)} type="submit" className="btn btn-primary">Submit</button>
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