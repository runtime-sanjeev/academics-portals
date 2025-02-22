<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\State;

class GetStateController extends Controller
{
   public function getStates(Request $request){

    $state = State::select('state_code','state_name')->get();

        if ($state->isNotEmpty()) {
            return response()->json([
                'success' => true,
                'states' => $state
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'State not found'
        ], 404);
   }
}
