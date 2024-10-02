<?php

namespace App\Http\Controllers;

use App\Models\Vulnerability;
use Illuminate\Http\Request;

class VulnerabilitiesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retrieve and return all vulnerabilities as JSON
        return Vulnerability::paginate(10);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate and store the new vulnerability
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

    /**
     * Display the specified resource.
     */
    public function show(Vulnerability $vulnerability)
    {
        // Return the specific vulnerability as JSON
        return response()->json($vulnerability, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Vulnerability $vulnerability)
    {
        // Validate and update the vulnerability
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vulnerability $vulnerability)
    {
        // Delete the vulnerability
        $vulnerability->delete();

        return response()->json([
            'message' => 'Vulnerability deleted successfully!',
        ], 200);
    }
}
