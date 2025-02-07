<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student; 

class GetExistingStudentController extends Controller
{
    public function getStudentData(Request $request)
    {
        // Validate request input
        $request->validate([
            'school_code' => 'required|string',
            'studId' => 'required|integer'
        ]);

        // Log the request data
        \Log::info('Request Data:', $request->all());

        // Fetch student data
        $student = Student::where('processed', 'N')
            ->where('school_code', $request->school_code)
            ->find($request->studId); // `find` is better when querying by `id`

        if ($student) {
            return response()->json([
                'success' => true,
                'student' => $student
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        }
    }
}
