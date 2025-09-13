import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/app-shell';

interface Review {
    id: number;
    rating: number;
    comment: string | null;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    first_image: string;
    category: {
        name: string;
    };
    reviews: Review[];
    average_rating: number;
}

interface WishlistItem {
    id: number;
    created_at: string;
    product: Product;
}

interface Props {
    wishlistItems: WishlistItem[];
    [key: string]: unknown;
}

export default function WishlistIndex({ wishlistItems }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, index) => (
            <span key={index} className={index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}>
                ⭐
            </span>
        ));
    };

    const addToCart = (productId: number) => {
        router.post('/cart', {
            product_id: productId,
            quantity: 1,
        });
    };

    const removeFromWishlist = (wishlistId: number) => {
        router.delete(`/wishlist/${wishlistId}`);
    };

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">❤️ Wishlist</h1>
                        <p className="text-gray-600">Produk favorit yang ingin Anda beli</p>
                    </div>

                    {wishlistItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {wishlistItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                                    <div className="relative">
                                        <div className="aspect-square bg-gray-100 overflow-hidden">
                                            <Link href={`/products/${item.product.slug}`}>
                                                <img 
                                                    src={item.product.first_image || 'https://via.placeholder.com/300x300?text=No+Image'} 
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </Link>
                                        </div>
                                        
                                        {/* Remove from wishlist button */}
                                        <button
                                            onClick={() => removeFromWishlist(item.id)}
                                            className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
                                            title="Hapus dari wishlist"
                                        >
                                            <span className="text-red-500">💔</span>
                                        </button>

                                        {/* Stock badge */}
                                        {item.product.stock === 0 && (
                                            <div className="absolute top-2 left-2">
                                                <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                                                    Stok Habis
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <div className="mb-2">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                {item.product.category.name}
                                            </span>
                                        </div>

                                        <Link 
                                            href={`/products/${item.product.slug}`}
                                            className="block"
                                        >
                                            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600">
                                                {item.product.name}
                                            </h3>
                                        </Link>

                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center text-sm">
                                                {renderStars(item.product.average_rating)}
                                                <span className="ml-1 text-gray-500">
                                                    ({item.product.reviews?.length || 0})
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-xl font-bold text-blue-600 mb-4">
                                            {formatPrice(item.product.price)}
                                        </p>

                                        <div className="space-y-2">
                                            {item.product.stock > 0 ? (
                                                <>
                                                    <Button 
                                                        onClick={() => addToCart(item.product.id)}
                                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                                        size="sm"
                                                    >
                                                        🛒 Tambah ke Keranjang
                                                    </Button>
                                                    <div className="text-center">
                                                        <Link href={`/products/${item.product.slug}`}>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm"
                                                                className="text-blue-600 hover:text-blue-700 text-xs"
                                                            >
                                                                Lihat Detail →
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </>
                                            ) : (
                                                <Button 
                                                    disabled 
                                                    className="w-full"
                                                    size="sm"
                                                >
                                                    😔 Stok Habis
                                                </Button>
                                            )}
                                        </div>

                                        <p className="text-xs text-gray-500 text-center mt-3">
                                            Ditambahkan {new Date(item.created_at).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                            <div className="text-8xl mb-6">💔</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Wishlist Kosong</h2>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Anda belum menambahkan produk apapun ke wishlist. Mari jelajahi 
                                produk-produk menarik dan simpan yang Anda sukai!
                            </p>
                            <Link href="/products">
                                <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
                                    🛍️ Jelajahi Produk
                                </Button>
                            </Link>
                        </div>
                    )}

                    {wishlistItems.length > 0 && (
                        <div className="mt-12 bg-blue-50 rounded-xl p-6 text-center">
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">
                                💡 Tips Belanja Cerdas
                            </h3>
                            <p className="text-blue-700 max-w-2xl mx-auto">
                                Pantau terus produk favorit Anda di wishlist! Kadang ada diskon atau 
                                restock yang membuat harga lebih menarik. Jangan lewatkan kesempatan emas!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}