<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->randomElement([
            'Elektronik',
            'Pakaian Pria',
            'Pakaian Wanita',
            'Makanan & Minuman',
            'Perawatan & Kecantikan',
            'Peralatan Rumah Tangga',
            'Olahraga & Outdoor',
            'Buku & Alat Tulis',
            'Mainan & Hobi',
            'Otomotif'
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->paragraph(),
            'image_url' => 'https://via.placeholder.com/300x200?text=' . urlencode($name),
            'is_active' => fake()->boolean(90),
        ];
    }

    /**
     * Indicate that the category is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}