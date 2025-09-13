import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/app-shell';

interface CartItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        slug: string;
        price: number;
        stock: number;
        first_image: string;
        category: {
            name: string;
        };
    };
}

interface Props {
    cartItems: CartItem[];
    subtotal: number;
    [key: string]: unknown;
}

export default function CartIndex({ cartItems, subtotal }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const updateQuantity = (cartId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        
        router.patch(`/cart/${cartId}`, {
            quantity: newQuantity,
        });
    };

    const removeFromCart = (cartId: number) => {
        router.delete(`/cart/${cartId}`);
    };

    const proceedToCheckout = () => {
        router.get('/checkout');
    };

    const shippingCost = 15000; // Default shipping cost
    const total = subtotal + shippingCost;

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">🛒 Keranjang Belanja</h1>
                        <p className="text-gray-600">Kelola produk yang ingin Anda beli</p>
                    </div>

                    {cartItems.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold mb-4">Produk dalam Keranjang ({cartItems.length})</h2>
                                        <div className="space-y-4">
                                            {cartItems.map((item) => (
                                                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                                    <div className="w-20 h-20 flex-shrink-0">
                                                        <img 
                                                            src={item.product.first_image || 'https://via.placeholder.com/80x80?text=No+Image'} 
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    </div>
                                                    
                                                    <div className="flex-1">
                                                        <Link 
                                                            href={`/products/${item.product.slug}`}
                                                            className="font-semibold text-gray-800 hover:text-blue-600 line-clamp-2"
                                                        >
                                                            {item.product.name}
                                                        </Link>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {item.product.category.name}
                                                        </p>
                                                        <p className="text-lg font-bold text-blue-600 mt-2">
                                                            {formatPrice(item.product.price)}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                disabled={item.quantity <= 1}
                                                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="px-4 py-2 text-center min-w-[3rem]">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                disabled={item.quantity >= item.product.stock}
                                                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-red-500 hover:text-red-700 p-2"
                                                            title="Hapus dari keranjang"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>

                                                    <div className="text-right min-w-[6rem]">
                                                        <p className="text-lg font-bold text-gray-800">
                                                            {formatPrice(item.product.price * item.quantity)}
                                                        </p>
                                                        {item.quantity >= item.product.stock && (
                                                            <p className="text-xs text-red-500 mt-1">
                                                                Stok terbatas
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-4">
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold mb-4">💰 Ringkasan Pesanan</h2>
                                        
                                        <div className="space-y-3 mb-6">
                                            <div className="flex justify-between text-gray-600">
                                                <span>Subtotal ({cartItems.length} produk)</span>
                                                <span>{formatPrice(subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Ongkos Kirim</span>
                                                <span>{formatPrice(shippingCost)}</span>
                                            </div>
                                            <div className="border-t border-gray-200 pt-3">
                                                <div className="flex justify-between text-lg font-bold text-gray-800">
                                                    <span>Total</span>
                                                    <span className="text-blue-600">{formatPrice(total)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Button 
                                            onClick={proceedToCheckout}
                                            className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg"
                                            size="lg"
                                        >
                                            💳 Lanjut ke Checkout
                                        </Button>

                                        <div className="mt-4 text-center">
                                            <Link href="/products" className="text-blue-600 hover:underline text-sm">
                                                ← Lanjut Berbelanja
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Info */}
                                <div className="mt-6 bg-blue-50 rounded-xl p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-blue-600">🔒</span>
                                        <h3 className="font-semibold text-blue-800">Pembayaran Aman</h3>
                                    </div>
                                    <p className="text-sm text-blue-700">
                                        Transaksi Anda dilindungi dengan enkripsi SSL dan sistem keamanan berlapis
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                            <div className="text-8xl mb-6">🛒</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Keranjang Belanja Kosong</h2>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Sepertinya Anda belum menambahkan produk apapun ke keranjang. 
                                Mari mulai berbelanja untuk menemukan produk favorit Anda!
                            </p>
                            <Link href="/products">
                                <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
                                    🛍️ Mulai Berbelanja
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}