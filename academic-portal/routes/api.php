<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Route::post('login', [AuthController::class, 'login']);
// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });


// Route::post('dashboard', [AuthController::class, 'dashboard']);
// Route::post('logout', [AuthController::class, 'logout']);


Route::post('login', [AuthController::class, 'login']);
Route::post('dashboard', [AuthController::class, 'dashboard']);
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
            return $request->user();
        });   
    Route::get('logout', [AuthController::class, 'logout']);
    // return $request->user();
});
