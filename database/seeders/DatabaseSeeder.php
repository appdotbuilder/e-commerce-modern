<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Cart;
use App\Models\Review;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        $user = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@ecommerce.com',
        ]);

        // Create additional users
        $users = User::factory(10)->create();

        // Create categories
        $categories = [
            ['name' => 'Elektronik', 'description' => 'Produk elektronik seperti smartphone, laptop, dan gadget lainnya'],
            ['name' => 'Pakaian Pria', 'description' => 'Fashion dan pakaian untuk pria'],
            ['name' => 'Pakaian Wanita', 'description' => 'Fashion dan pakaian untuk wanita'],
            ['name' => 'Makanan & Minuman', 'description' => 'Produk makanan dan minuman segar'],
            ['name' => 'Perawatan & Kecantikan', 'description' => 'Produk perawatan dan kecantikan'],
            ['name' => 'Peralatan Rumah Tangga', 'description' => 'Peralatan dan perlengkapan rumah tangga'],
            ['name' => 'Olahraga & Outdoor', 'description' => 'Peralatan olahraga dan aktivitas outdoor'],
            ['name' => 'Buku & Alat Tulis', 'description' => 'Buku, majalah, dan alat tulis'],
        ];

        foreach ($categories as $categoryData) {
            $category = Category::create([
                'name' => $categoryData['name'],
                'slug' => \Illuminate\Support\Str::slug($categoryData['name']),
                'description' => $categoryData['description'],
                'image_url' => 'https://via.placeholder.com/300x200?text=' . urlencode($categoryData['name']),
                'is_active' => true,
            ]);

            // Create products for each category
            $products = Product::factory(random_int(8, 15))->create([
                'category_id' => $category->id,
            ]);

            // Make some products featured
            $products->take(random_int(2, 4))->each(function ($product) {
                $product->update(['is_featured' => true]);
            });

            // Create reviews for some products
            $products->each(function ($product) use ($users) {
                if (fake()->boolean(70)) {
                    Review::factory(random_int(1, 8))->create([
                        'product_id' => $product->id,
                        'user_id' => $users->random()->id,
                    ]);
                }
            });
        }

        // Create some cart items for the test user
        $randomProducts = Product::inRandomOrder()->take(5)->get();
        foreach ($randomProducts as $product) {
            Cart::create([
                'user_id' => $user->id,
                'product_id' => $product->id,
                'quantity' => random_int(1, 3),
            ]);
        }
    }
}
