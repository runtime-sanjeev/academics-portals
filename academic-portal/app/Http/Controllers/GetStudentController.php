<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Student; 

class GetStudentController extends Controller
{
    public function getStudent(Request $request){

        $schoolCode = $request->input('school_code'); 
        $search = $request->input('search');  // Search input
        $perPage = $request->input('per_page', 10); // Default 10 records per page

        // $schoolCode = $request->input('school_code'); 
        if (!$schoolCode) {
            return response()->json(['error' => 'Missing school_code in request.'], 400);
        }

        // Log request data for debugging
        \Log::info('Querying students table', ['school_code' => $schoolCode]);
        $query = Student::where('school_code', $schoolCode);
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('student_name', 'LIKE', "%{$search}%")
                  ->orWhere('student_code', 'LIKE', "%{$search}%")
                  ->orWhere('student_category', 'LIKE', "%{$search}%");
            });
        }
        $students = Student::where('school_code', $schoolCode)
        ->select('id', 'student_code', 'student_name', 'student_category','processed') 
        ->paginate($perPage);

        if($students->isEmpty()){
            return response()->json(['error' => 'No records found.'], 404);
        }
        // if($students->isNotEmpty()){            
        //  return response()->json(["students" => $students], 200);

        // }

        // Prepare the data to include the button logic
       // Modify response to include actions
    $students->getCollection()->transform(function($student) {
        $student->actions = [];

        if ($student->processed == 'Y') {
            $student->actions = [
                'view' => route('student.view', ['id' => $student->id]),
            ];
        } else {
            $student->actions = [
                'edit' => route('student.edit', ['id' => $student->id]),
                'delete' => route('student.delete', ['id' => $student->id])
            ];
        }

        return $student;
    });
     return response()->json(["students" => $students], 200);
    }
}
