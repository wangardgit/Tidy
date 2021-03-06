<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Employee;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\VendorAuthMeta;
use App\EmployeeAuthMeta;
use App\Empbooking;
use App\Category;
use App\SubCategory;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $emp = Employee::where('delete_status', 0)->get();
        $response = [
            'status' => 200,
            'employee' => $emp
        ];
        return $response;
    }

    public function show(Request $request){
        $employeelist = Employee::where('vendor_id',$request->id)->first();
        if($employeelist){
        $response=[
            'status' => 200,
            'message' => 'Success',
            'data' => $employeelist,
        ];
        }else{
        $response=[
            'status' => 401,
            'message' => 'No data found',
        ];
        }
        return $response;
    }

    // public function accepted_bookings(Request $request) {
    //     $bookings = Booking::where('vendor_id',$request->vendorId)
    //                         ->where('vendor_status',1)
    //                         ->with('service','sub_service' , 'information')
    //                         ->get();
    //     return response()->json([
    //         'status' => true,
    //         'message' => "Vendor Bookings",
    //         'data' => $bookings
    //     ]);
    // }

    public function get_vendor_booking_requests(Request $request){
        $vbr = VendorBookingRequest::where('vendor_id',$request->vendor_id)->with('booking','booking_information')->get();
        if(sizeof($vbr) > 0){
            foreach($vbr as $v){
                $v->service = Category::where('id',$v->booking['service_id'])->first();
                $v->sub_service = SubCategory::where('id',$v->booking['sub_service_id'])->first();
            }
        }
        return $vbr;
    }

    public function employee_bookings(Request $request){
        $e_bookings = Empbooking::where('employee_id' , $request->employeeId)
                                ->with('booking_information','booking')
                                ->get();
        if(sizeof($e_bookings) > 0){
            foreach($e_bookings as $eb){
                $eb ->service = Category::where('id', $eb->booking['service_id'])->first();
                $eb ->sub_service = SubCategory::where('id',$eb->booking['sub_service_id'])->first();
            }
        }
        return response()->json([
            'status' => true,
            'message' => "Employee Bookings",
            'data' => $e_bookings
        ]);
    }

    public function employee_check_auth(Request $request){
        $employee_auth = EmployeeAuthMeta::where('token',$request->token)
            ->where('ip',$request->ip())
            ->first();
        if($employee_auth){
            $response = ['status' => 200 , 'employee'=>$employee_auth];
            return $response;
        }else{
        $response = ['status' => 401 , 'msg' => 'Sorry, Incorrect Token'];
            return $response;
        }
    }

    public function update_employee_profile(Request $request){
        $u_employee = Employee::where('id' , $request->id) -> update([
            'name' => $request->f_name,
            'username' => $request->e_username
        ]);

        $response = [
            'status' => 200,
            'message' => "Employee Profile Updated",
            'data' => $u_employee,
        ];
        return $response;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    public function employee_login(Request $request) {
        $validator = Validator::make($request->all(), [
            'username' => 'required',
            'password' => 'required',
        ]);
        if($validator->fails()){
            return response()->json([
                'status' => 401,
                'errors' => $validator->messages(),
                'message' => $validator->errors()->first()
            ]);
        }else{
            $Emp = Employee::where('username', $request->username)->first();
            if($Emp){
                if($Emp->status) {
                    if(Hash::check($request->password, $Emp->password)){
                        $meta_check = EmployeeAuthMeta::where('employee_id',$Emp->id)
                                        ->where('ip',$request->ip())
                                        ->first();
                        if($meta_check){
                            $token = $meta_check->token;
                        } else {
                            $meta = new EmployeeAuthMeta();
                            $meta->employee_id = $Emp->id;
                            $meta->ip = $request->ip();
                            $meta->token = Hash::make(time());
                            $new_time = date('H:i', strtotime('+15 minutes'));
                            $meta->token_valid_till = $new_time;
                            $meta->save();
                            $token = $meta->token;
                        }
                        $Emp->token = $token;
                        return response()->json([
                           'status' => 200,     
                           'message' => "Successfull login",
                           'data' => $Emp, 
                        ]);
                    }else{
                        return response()->json([
                            'status' => 401,     
                            'message' => "Invalid Password",
                            'data' => null, 
                         ]);
                    }
                } else {
                    return response()->json([
                        'status' => 401,     
                        'message' => "Sorry you are no approved from the admin yet",
                        'data' => null, 
                     ]);
                }
                
            }else{
                return response()->json([
                    'status' => 401,     
                    'message' => "Invalid Email",
                    'data' => null, 
                 ]);
            }
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // return $request;
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'username' => 'required',
            'password' => 'required',
            'phone' => 'required|min:09|max:09',
        ]);
        if($validator->fails()){
            $response = ['status' => 219 , 'msg' => $validator->errors()->first() , 
            'errors' => $validator->errors()];
            return $response;
        }else{
            $vendor = VendorAuthMeta::where('token', $request->token)->first();
            $emp = new Employee();
            $emp->name = $request->name;
            $emp->username = $request->username;
            $emp->password = Hash::make($request->password);
            $emp->email = $request->email;
            $emp->phone = $request->phonenumber.''.$request->phone;
            $emp->address = $request->address;
            $emp->dob = $request->dob;
            $emp->service = $request->service;
            $emp->work = $request->work;
            $emp->serviceprice = $request->serviceprice;
            $emp->password_string = $request->password;
            if($vendor){
                $emp->vendor_id = $vendor->vendor_id;
            } else {
                $response = ['status' => 219 , 'msg' => 'vendor not found' , 
                'errors' => 'vendor not found'];
                return $response;
            }            
            $emp->save();
            if ($request->image != $emp->image) {
                $name = time() . '.' . explode('/', explode(':', substr($request->image, 0, strpos($request->image, ';')))[1])[1];
                \Image::make($request->image)->save(public_path('images/') . $name);
                Employee::where('id', $emp->id)->update([
                    'image' => $name,
                ]);
            }
            if ($request->policeidimg != $emp->policeidimg) {
                $name = time() . '.' . explode('/', explode(':', substr($request->policeidimg, 0, strpos($request->policeidimg, ';')))[1])[1];
                \Image::make($request->policeidimg)->save(public_path('images/') . $name);
                Employee::where('id', $emp->id)->update([
                    'policeidimg' => $name,
                ]);
            }

            
            $response = ['status' => 200 , 'msg' => 'Employee added successfully' , 
                ];
                return $response;
        }
    }

    public function edit($id)
    {
        $employee = Employee::find($id);
        $response = [
            'status' => 200 ,
            'employee' => $employee
        ];
        return $response;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // return $request; 
        $employee = Employee::find($request->id);
        $employee->name = $request->name;
        $employee->username = $request->username;
        $employee->password = Hash::make($request->password);
        $employee->email = $request->email;
        $employee->phone = $request->phone;
        $employee->address = $request->address;
        $employee->service = $request->service;
        $employee->dob = $request->dob;
        $employee->work = $request->work;
        $employee->serviceprice = $request->serviceprice;
        $employee->password_string = $request->password;
        $employee->save();
        if ($request->image != $employee->image) {
            $name = time() . '.' . explode('/', explode(':', substr($request->image, 0, strpos($request->image, ';')))[1])[1];
            \Image::make($request->image)->save(public_path('images/') . $name);
            Employee::where('id', $request->id)->update([
                'image' => $name,
            ]); 
        } 
        if ($request->policeidimg != $employee->policeidimg) {
            $name = time() . '.' . explode('/', explode(':', substr($request->policeidimg, 0, strpos($request->policeidimg, ';')))[1])[1];
            \Image::make($request->policeidimg)->save(public_path('images/') . $name);
            Employee::where('id', $employee->id)->update([
                'policeidimg' => $name,
            ]);
        }
        $response = ['status' => 200 ,
            'msg' => 'Subcategory updated successfully.'];
        return $response;
    }

    public function delete_employee(Request $request) {
        
        $user = Employee::where('id', $request->id)->update([
            'delete_status' => true, 
        ]);
        $response = [
            'status' => 200,
            'msg' => 'Employee deleted successfully', 
        ];
        return $response;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
    public function employee_list(Request $request){
        $employeelist = Employee::where('vendor_id',$request->vendor_id)->get();
        if($employeelist){
        $response=[
            'status' => 200,
            'message' => 'Success',
            'data' => $employeelist,
        ];
        }else{
        $response=[
            'status' => 401,
            'message' => 'No data found',
        ];
        }
        return $response;
    }
}
