<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    /**
     * Display the wishlist.
     */
    public function index()
    {
        $wishlistItems = Wishlist::with(['product.category', 'product.reviews'])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('wishlist/index', [
            'wishlistItems' => $wishlistItems,
        ]);
    }

    /**
     * Add item to wishlist.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $exists = Wishlist::where('user_id', auth()->id())
            ->where('product_id', $request->product_id)
            ->exists();

        if ($exists) {
            return back()->with('info', 'Produk sudah ada di wishlist');
        }

        Wishlist::create([
            'user_id' => auth()->id(),
            'product_id' => $request->product_id,
        ]);

        return back()->with('success', 'Produk berhasil ditambahkan ke wishlist');
    }

    /**
     * Remove item from wishlist.
     */
    public function destroy(Wishlist $wishlist)
    {
        // Check if wishlist belongs to user
        if ($wishlist->user_id !== auth()->id()) {
            abort(403);
        }

        $wishlist->delete();

        return back()->with('success', 'Produk berhasil dihapus dari wishlist');
    }
}