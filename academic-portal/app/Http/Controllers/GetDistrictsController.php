<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\District;

class GetDistrictsController extends Controller
{
    public function getDistricts(Request $request)
    {
        $districts = District::select('district_code', 'district_name')->get();

        if ($districts->isNotEmpty()) {
            return response()->json([
                'success' => true,
                'districts' => $districts
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Districts not found'
        ], 404);
    }
}
