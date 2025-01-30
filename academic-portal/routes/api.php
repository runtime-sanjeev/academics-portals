<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GetStudentController;

Route::post('login', [AuthController::class, 'login']);
Route::post('getCounts', [DashboardController::class, 'studentCounts']); 
Route::post('getStudent', [GetStudentController::class, 'getStudent']);
Route::get('/student/view/{id}', [StudentController::class, 'viewStudent'])->name('student.view');
Route::get('/student/edit/{id}', [StudentController::class, 'editStudent'])->name('student.edit');
Route::delete('/student/delete/{id}', [StudentController::class, 'deleteStudent'])->name('student.delete');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });    
    Route::get('logout', [AuthController::class, 'logout']);
});
