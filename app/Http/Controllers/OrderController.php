<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display the user's orders.
     */
    public function index()
    {
        $orders = Order::with(['items.product'])
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(10);

        return Inertia::render('orders/index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order)
    {
        // Check if order belongs to user
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->load(['items.product']);

        return Inertia::render('orders/show', [
            'order' => $order,
        ]);
    }
}