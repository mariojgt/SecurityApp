<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vulnerability;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VulnerabilitiesControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test retrieving all vulnerabilities (index).
     */
    public function test_can_get_all_vulnerabilities(): void
    {
        // Create some vulnerabilities
        Vulnerability::factory()->count(3)->create();

        // Send a request to get all vulnerabilities
        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson('/api/vulnerabilities');

        // Assert the response
        $response->assertStatus(200);
    }

    /**
     * Test creating a new vulnerability (store).
     */
    public function test_can_create_vulnerability(): void
    {
        $user = User::factory()->create();

        // Data to create a vulnerability
        $data = [
            'title' => 'New Vulnerability',
            'description' => 'This is a new vulnerability description',
        ];

        // Send a POST request to create the vulnerability
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/vulnerabilities', $data);

        // Assert the response
        $response->assertStatus(201)
                 ->assertJson([
                     'message' => 'Vulnerability created successfully!',
                     'data' => [
                         'title' => 'New Vulnerability',
                         'description' => 'This is a new vulnerability description',
                     ],
                 ]);

        // Assert the vulnerability exists in the database
        $this->assertDatabaseHas('vulnerabilities', $data);
    }

    /**
     * Test retrieving a single vulnerability (show).
     */
    public function test_can_show_vulnerability(): void
    {
        // Create a vulnerability
        $vulnerability = Vulnerability::factory()->create();

        // Send a GET request to retrieve the vulnerability
        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson("/api/vulnerabilities/{$vulnerability->id}");

        // Assert the response
        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $vulnerability->id,
                     'title' => $vulnerability->title,
                     'description' => $vulnerability->description,
                 ]);
    }

    /**
     * Test updating a vulnerability (update).
     */
    public function test_can_update_vulnerability(): void
    {
        // Create a vulnerability
        $vulnerability = Vulnerability::factory()->create();

        // New data for the update
        $data = [
            'title' => 'Updated Vulnerability Title',
            'description' => 'Updated description.',
        ];

        // Send a PUT request to update the vulnerability
        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->putJson("/api/vulnerabilities/{$vulnerability->id}", $data);

        // Assert the response
        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Vulnerability updated successfully!',
                     'data' => [
                         'title' => 'Updated Vulnerability Title',
                         'description' => 'Updated description.',
                     ],
                 ]);

        // Assert the vulnerability exists in the database with the updated data
        $this->assertDatabaseHas('vulnerabilities', $data);
    }

    /**
     * Test deleting a vulnerability (destroy).
     */
    public function test_can_delete_vulnerability(): void
    {
        // Create a vulnerability
        $vulnerability = Vulnerability::factory()->create();

        // Send a DELETE request to remove the vulnerability
        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->deleteJson("/api/vulnerabilities/{$vulnerability->id}");

        // Assert the response
        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Vulnerability deleted successfully!',
                 ]);

        // Assert the vulnerability no longer exists in the database
        $this->assertDatabaseMissing('vulnerabilities', ['id' => $vulnerability->id]);
    }
}
