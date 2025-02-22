<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GetStudentController;
use App\Http\Controllers\GetExistingStudentController;
use App\Http\Controllers\GetDistrictsController;
use App\Http\Controllers\GetBlockController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\GetStateController;

Route::post('login', [AuthController::class, 'login']);
Route::post('getCounts', [DashboardController::class, 'studentCounts']); 
Route::post('getStudent', [GetStudentController::class, 'getStudent']);
Route::get('/student/view/{id}', [StudentController::class, 'viewStudent'])->name('student.view');
Route::get('/student/edit/{id}', [StudentController::class, 'editStudent'])->name('student.edit');
Route::delete('/student/delete/{id}', [StudentController::class, 'deleteStudent'])->name('student.delete');
Route::post('getStudentData', [GetExistingStudentController::class, 'getStudentData']);
Route::get('getDistricts', [GetDistrictsController::class, 'getDistricts']);
Route::get('getBlocks', [GetBlockController::class, 'getBlocks']);
Route::get('subjects', [SubjectController::class, 'getSubjects']);
Route::get('getStates', [GetStateController::class, 'getStates']);


// Route::get('/subjects/{category}', [SubjectController::class, 'getSubjects']);


// Route::post('/student/create', [StudentController::class, 'createStudent'])->name('student.create');
// Route::put('/student/update/{id}', [StudentController::class, 'updateStudent'])->name('student.update');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });    
    Route::get('logout', [AuthController::class, 'logout']);
});
