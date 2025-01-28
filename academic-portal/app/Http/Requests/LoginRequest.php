<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Allow all users to make this request
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'school_code' => 'required|string|size:5', // Ensures exactly 5 characters
            'password' => 'required|string|min:5|max:10',
            'captcha_input' => 'required|string|size:6', // Ensures exactly 6 characters
            'generated_captcha' => 'required|string|size:6', // Ensures exactly 6 characters
        ];
    }

    /**
     * Custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'school_code.required' => 'School code is required.',
            'school_code.size' => 'School code must be exactly 5 characters.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 5 characters.',
            'password.max' => 'Password cannot exceed 10 characters.',
            'captcha_input.required' => 'Captcha input is required.',
            'captcha_input.size' => 'Captcha input must be exactly 6 characters.',
            'generated_captcha.required' => 'Generated captcha is required.',
            'generated_captcha.size' => 'Generated captcha must be exactly 6 characters.',
        ];
    }

    protected function failedValidation(Validator $validator)
        {
            throw new HttpResponseException(response()->json([
                'status' => 'error',
                'message' => 'Validation errors',
                'errors' => $validator->errors(),
            ], 422));
        }
}
