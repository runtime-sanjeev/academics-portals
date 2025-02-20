<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\LanguageOne;
use App\Models\LanguageTwo;
use App\Models\Additional;

class SubjectController extends Controller
{
    public function getSubjects()
    {
        $languageOne = LanguageOne::all();
        $languageTwo = LanguageTwo::all();
        $additional = Additional::all();

        return response()->json([
            'language_one' => $languageOne,
            'language_two' => $languageTwo,
            'additional' => $additional
        ]);
    }
}
