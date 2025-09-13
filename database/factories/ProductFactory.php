<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->words(random_int(2, 4), true);
        $price = fake()->randomFloat(2, 10000, 5000000); // IDR format

        return [
            'name' => ucwords($name),
            'slug' => Str::slug($name) . '-' . random_int(1000, 9999),
            'description' => fake()->paragraphs(random_int(2, 4), true),
            'price' => $price,
            'stock' => fake()->numberBetween(0, 100),
            'images' => [
                'https://via.placeholder.com/500x500?text=Product+Image+1',
                'https://via.placeholder.com/500x500?text=Product+Image+2',
                'https://via.placeholder.com/500x500?text=Product+Image+3',
            ],
            'category_id' => Category::factory(),
            'sku' => 'SKU' . fake()->unique()->numerify('######'),
            'weight' => fake()->randomFloat(2, 0.1, 10),
            'is_active' => fake()->boolean(95),
            'is_featured' => fake()->boolean(20),
        ];
    }

    /**
     * Indicate that the product is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the product is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => 0,
        ]);
    }

    /**
     * Indicate that the product is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}