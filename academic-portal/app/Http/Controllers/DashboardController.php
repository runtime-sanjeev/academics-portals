<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Student; 

class DashboardController extends Controller
{
    public function studentCounts(Request $request)
    {
        $schoolCode = $request->input('school_code'); 
        if (!$schoolCode) {
            return response()->json(['error' => 'Missing school_code in request.'], 400);
        }

        // Log request data for debugging
        \Log::info('Querying students table', ['school_code' => $schoolCode]);
        
        // Get student counts by category
        $categoryCounts = Student::where('school_code', $schoolCode)
            ->select('student_category', DB::raw('COUNT(*) as count'))
            ->groupBy('student_category')
            ->pluck('count', 'student_category');

        
        $processedCounts = Student::where('school_code', $schoolCode)
            ->select('student_category', 'processed', DB::raw('COUNT(*) as count'))
            ->groupBy('student_category', 'processed')
            ->get();

       
        $studentCounts = [
            'total' => [
                'REGULAR' => $categoryCounts->get('REGULAR', 0),
                'PRIVATE' => $categoryCounts->get('PRIVATE', 0),
                'EX-REGULAR' => $categoryCounts->get('EX-REGULAR', 0),
            ],
            'processed' => [
                'REGULAR' => ['processed' => 0, 'unprocessed' => 0],
                'PRIVATE' => ['processed' => 0, 'unprocessed' => 0],
                'EX-REGULAR' => ['processed' => 0, 'unprocessed' => 0],
            ],
        ];

       
        foreach ($processedCounts as $count) {
            $category = strtoupper($count->student_category);
            $status = ($count->processed === 'Y') ? 'processed' : 'unprocessed';
        
            if (isset($studentCounts['processed'][$category])) {
                $studentCounts['processed'][$category][$status] = $count->count;
            }
        }

        return response()->json(['studentCounts' => $studentCounts])
            ->header('Cache-Control', 'no-cache, must-revalidate')
            ->header('Expires', 'Fri, 01 Jan 1990 00:00:00 GMT');
    }
}
