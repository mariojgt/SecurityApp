<?php

namespace App\Http\Controllers;

use App\Models\Vulnerability;
use Illuminate\Http\Request;

class VulnerabilitiesController extends Controller
{

    public function index()
    {
        return Vulnerability::paginate(10);
    }


    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
        ]);

        $vulnerability = Vulnerability::create($validatedData);

        return response()->json([
            'message' => 'Vulnerability created successfully!',
            'data' => $vulnerability,
        ], 201);
    }

    public function show(Vulnerability $vulnerability)
    {
        return response()->json($vulnerability, 200);
    }

    public function update(Request $request, Vulnerability $vulnerability)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
        ]);

        $vulnerability->update($validatedData);

        return response()->json([
            'message' => 'Vulnerability updated successfully!',
            'data' => $vulnerability,
        ], 200);
    }

    public function destroy(Vulnerability $vulnerability)
    {
        $vulnerability->delete();

        return response()->json([
            'message' => 'Vulnerability deleted successfully!',
        ], 200);
    }
}
