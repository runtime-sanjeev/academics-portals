<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Block;

class GetBlockController extends Controller
{
    public function getBlocks(Request $request){
        // Print the request data
        // \Log::info('Request Data: ', $request->all());

        // Build the query
        $blocks = Block::select('block_code', 'block_name')->get();

        // Print the query
        // \Log::info('SQL Query: ' . $query->toSql());

        // $student = $query->get();
        // if($students->isEmpty()){
        //     return response()->json(['error' => 'No records found.'], 404);
        // }
        // return response()->json(["students" => $students], 200);

        if ($blocks) {
            return response()->json([
                'success' => true,
                'blocks' => $blocks
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Blocks not found'
            ], 404);
        }
    }
}
