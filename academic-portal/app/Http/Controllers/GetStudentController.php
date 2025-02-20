<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student; 

class GetStudentController extends Controller
{
    public function getStudent(Request $request)
    {
        $schoolCode = $request->input('school_code'); 
        $search = $request->input('search');  
        $perPage = $request->input('per_page', 10); 

        if (!$schoolCode) {
            return response()->json(['error' => 'Missing school_code in request.'], 400);
        }

        \Log::info('Querying students table', ['school_code' => $schoolCode]);

        $query = Student::where('school_code', $schoolCode)
            ->select('id', 'student_code', 'student_name', 'student_category', 'processed');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('student_name', 'LIKE', "%{$search}%")
                  ->orWhere('student_code', 'LIKE', "%{$search}%")
                  ->orWhere('student_category', 'LIKE', "%{$search}%");
            });
        }

        $students = $query->paginate($perPage);

        if ($students->isEmpty()) {
            return response()->json(['error' => 'No records found.'], 404);
        }

        $students->getCollection()->transform(function($student) {
            $student->actions = $student->processed == 'Y' 
                ? ['view' => route('student.view', ['id' => $student->id])]
                : [
                    'edit' => route('student.edit', ['id' => $student->id]),
                    'delete' => route('student.delete', ['id' => $student->id])
                ];

            return $student;
        });

        return response()->json(["students" => $students], 200);
    }
}
