<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\District;

class GetDistrictsController extends Controller
{
    public function getDistricts(Request $request){
        // Print the request data
        // \Log::info('Request Data: ', $request->all());

        // Build the query
        $districts = District::select('district_code', 'district_name')->get();

        // Print the query
        // \Log::info('SQL Query: ' . $query->toSql());

        // $student = $query->get();
        // if($students->isEmpty()){
        //     return response()->json(['error' => 'No records found.'], 404);
        // }
        // return response()->json(["students" => $students], 200);

        if ($districts) {
            return response()->json([
                'success' => true,
                'districts' => $districts
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Districts not found'
            ], 404);
        }
    }
}
