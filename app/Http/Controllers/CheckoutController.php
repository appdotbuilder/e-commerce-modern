<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    /**
     * Display the checkout form.
     */
    public function index()
    {
        $cartItems = Cart::with(['product.category'])
            ->where('user_id', auth()->id())
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Keranjang belanja kosong');
        }

        $subtotal = $cartItems->sum(function ($item) {
            return $item->quantity * (float) $item->product->price;
        });

        $shippingServices = [
            'jne' => ['name' => 'JNE', 'price' => 15000],
            'jnt' => ['name' => 'J&T Express', 'price' => 12000],
            'sicepat' => ['name' => 'SiCepat', 'price' => 13000],
            'pos' => ['name' => 'Pos Indonesia', 'price' => 10000],
        ];

        return Inertia::render('checkout/index', [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
            'shippingServices' => $shippingServices,
        ]);
    }

    /**
     * Process the order.
     */
    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|array',
            'shipping_address.name' => 'required|string|max:255',
            'shipping_address.phone' => 'required|string|max:20',
            'shipping_address.address' => 'required|string',
            'shipping_address.city' => 'required|string|max:100',
            'shipping_address.province' => 'required|string|max:100',
            'shipping_address.postal_code' => 'required|string|max:10',
            'shipping_service' => 'required|string|in:jne,jnt,sicepat,pos',
            'payment_method' => 'required|string|in:bank_transfer,ovo,gopay,dana,credit_card',
        ]);

        $cartItems = Cart::with('product')
            ->where('user_id', auth()->id())
            ->get();

        if ($cartItems->isEmpty()) {
            return back()->with('error', 'Keranjang belanja kosong');
        }

        $shippingCosts = [
            'jne' => 15000,
            'jnt' => 12000,
            'sicepat' => 13000,
            'pos' => 10000,
        ];

        $subtotal = $cartItems->sum(function ($item) {
            return $item->quantity * (float) $item->product->price;
        });

        $shippingCost = $shippingCosts[$request->shipping_service];
        $total = $subtotal + $shippingCost;

        DB::transaction(function () use ($request, $cartItems, $subtotal, $shippingCost, $total) {
            // Create order
            $order = Order::create([
                'order_number' => 'ORD-' . date('Ymd') . '-' . random_int(100000, 999999),
                'user_id' => auth()->id(),
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'total' => $total,
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $request->payment_method,
                'shipping_address' => $request->shipping_address,
                'shipping_service' => $request->shipping_service,
            ]);

            // Create order items
            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'product_name' => $cartItem->product->name,
                    'price' => $cartItem->product->price,
                    'quantity' => $cartItem->quantity,
                    'total' => $cartItem->quantity * (float) $cartItem->product->price,
                ]);

                // Update product stock
                $cartItem->product->decrement('stock', $cartItem->quantity);
            }

            // Clear cart
            Cart::where('user_id', auth()->id())->delete();
        });

        return redirect()->route('orders.index')
            ->with('success', 'Pesanan berhasil dibuat. Silakan lakukan pembayaran.');
    }
}