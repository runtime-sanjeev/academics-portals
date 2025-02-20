<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Block;

class GetBlockController extends Controller
{
    public function getBlocks(Request $request)
    {
        $blocks = Block::select('block_code', 'block_name')->get();

        if ($blocks->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Blocks not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'blocks' => $blocks
        ], 200);
    }
}
