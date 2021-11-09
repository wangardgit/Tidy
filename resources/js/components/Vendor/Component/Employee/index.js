import React, {Component} from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import {Link} from 'react-router-dom';
import { img_baseurl } from '../../../Configs/Api';

class Index extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            employees: [],
        }
    }

    componentDidMount(){
      Axios.get(`/api/employee`,{ headers: {
          token: window.localStorage.getItem('testapistring')
      }}).then(res=>{
        console.log(res);
          if(res.data.status == 200) {
              this.setState({
                employees: res.data.employee
              })
          } 
      })
  }

  deleteEmployee(id) {
    let data = {
        id: id
    }
    Axios.post('/api/delete-employee',data).then(res=>{
        Swal.fire({
            icon: 'success',
            title: 'Successfully Deleted',
            showConfirmButton: false,
            timer: 1500
        })
        this.componentDidMount();
    })
}


    render(){
      return (
          <section className="section">
            <div className="section-body">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h4>Employees</h4>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-striped" id="table-1">
                          <thead>
                            <tr>
                              <th className="text-center">
                                #
                              </th>
                              <th>Image</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Username</th>
                              <th>Phone</th>
                              <th>Address</th>
                              <th>Service</th>
                              <th>Service Price</th>
                              <th>Date Of Birth</th>
                              <th>Police Id</th>
                              <th>Vendor</th>
                              <th>Edit</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                                this.state.employees.map((data,index)=>{
                                  return(
                                          <tr key={index}>
                                            <td>{index+1}</td>
                                            <td><img src={img_baseurl+data.image} style={{width:'100px'}}></img></td>
                                            <td>{data.name}</td>
                                            <td>{data.email}</td>
                                            <td>{data.username}</td>
                                            <td>{data.phone}</td>
                                            <td>{data.address}</td>
                                            <td>{data.service}</td>
                                            <td>{data.serviceprice}</td>
                                            <td>{data.dob}</td>
                                            <td><img src={img_baseurl+data.policeidimg} style={{width:'100px'}}></img></td>
                                            <td>{data.vendor_id}</td>
                                            <td><Link to={`/vendor/edit-employee/${data.id}`}><button className="btn btn-outline-primary"> <i  className="fa fa-edit"> </i></button></Link></td>
                                            <td><button onClick={this.deleteEmployee.bind(this,data.id)} className="btn btn-outline-primary"> <i  className="fa fa-trash"> </i></button></td>                 
                                          </tr>
                                        )
                                      })
                            }
                            {
                              this.state.employees.length == 0 ? 
                              <tr><td colSpan="6">No records founded</td></tr>:null
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
      );
    }
}
export default Index;
