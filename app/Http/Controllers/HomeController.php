<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index()
    {
        $categories = Category::active()
            ->with('products')
            ->take(8)
            ->get();

        $featuredProducts = Product::active()
            ->featured()
            ->inStock()
            ->with(['category', 'reviews'])
            ->withCount('reviews')
            ->take(8)
            ->get();

        $latestProducts = Product::active()
            ->inStock()
            ->with(['category', 'reviews'])
            ->withCount('reviews')
            ->latest()
            ->take(12)
            ->get();

        return Inertia::render('welcome', [
            'categories' => $categories,
            'featuredProducts' => $featuredProducts,
            'latestProducts' => $latestProducts,
        ]);
    }
}