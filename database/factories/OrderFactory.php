<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 50000, 500000);
        $shippingCost = fake()->randomFloat(2, 10000, 25000);
        
        return [
            'order_number' => 'ORD-' . date('Ymd') . '-' . fake()->unique()->numerify('######'),
            'user_id' => User::factory(),
            'subtotal' => $subtotal,
            'shipping_cost' => $shippingCost,
            'total' => $subtotal + $shippingCost,
            'status' => fake()->randomElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
            'payment_status' => fake()->randomElement(['pending', 'paid', 'failed']),
            'payment_method' => fake()->randomElement(['bank_transfer', 'ovo', 'gopay', 'dana', 'credit_card']),
            'shipping_address' => [
                'name' => fake()->name(),
                'phone' => fake()->phoneNumber(),
                'address' => fake()->address(),
                'city' => fake()->city(),
                'province' => fake()->randomElement(['DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Sumatra Utara']),
                'postal_code' => fake()->numerify('#####'),
            ],
            'shipping_service' => fake()->randomElement(['jne', 'jnt', 'sicepat', 'pos']),
            'tracking_number' => fake()->boolean(50) ? fake()->numerify('TRK############') : null,
            'notes' => fake()->boolean(30) ? fake()->sentence() : null,
        ];
    }

    /**
     * Indicate that the order is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'delivered',
            'payment_status' => 'paid',
            'shipped_at' => fake()->dateTimeBetween('-30 days', '-10 days'),
            'delivered_at' => fake()->dateTimeBetween('-10 days', 'now'),
        ]);
    }
}