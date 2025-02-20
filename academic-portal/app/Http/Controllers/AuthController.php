<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    /*   Login Start   */

    public function login(LoginRequest $request)
    {
        // Validate the request data
        $data = $request->validated();

        // Check if the user exists by school_code
        $user = User::where('school_code', $data['school_code'])->first();
        if (!$user) {
            return response()->json(['error' => 'Invalid school code. Please try again!'], 422);
        }

        // Handle the first-time login scenario (when `pass` field is blank)
        if (empty($user->pass)) {
            if ($data['password'] !== $user->password) {
                return response()->json(['error' => 'Invalid credentials. Please try again!'], 422);
            }
            $user->pass = Hash::make($data['password']);
            $user->save();
        }

        // Verify the hashed password for subsequent logins
        if (!Hash::check($data['password'], $user->pass)) {
            return response()->json(['error' => 'Invalid credentials. Please try again!'], 422);
        }

        // Verify captcha
        if ($data['captcha_input'] !== $data['generated_captcha']) {
            return response()->json(['error' => 'Invalid captcha code. Please try again!'], 422);
        }

        // Check if the account is locked
        if ($user->school_allowed == 0) {
            return response()->json(['error' => 'Account is locked. Please contact support!'], 422);
        }

        // Update user's login attempt counter
        $user->attempt = 1;
        $user->save();

        // Generate a token for the user
        $token = $user->createToken('main')->plainTextToken;

        // Return the success response
        return response()->json([
            'token' => $token,
            'user' => $user,
            'message' => 'Login successful',
        ]);
    }
    
    /*   Login End   */

    /*   Logout Start */

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully'], 200);
    }
}
