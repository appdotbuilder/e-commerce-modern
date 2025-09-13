import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/app-shell';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    category: {
        id: number;
        name: string;
        slug: string;
    };
    reviews: Review[];
    reviews_count: number;
    reviews_avg_rating: number;
}

interface Review {
    id: number;
    rating: number;
    comment: string;
    is_verified_purchase: boolean;
    created_at: string;
    user: {
        name: string;
    };
}

interface RelatedProduct {
    id: number;
    name: string;
    slug: string;
    price: number;
    first_image: string;
    reviews_count: number;
    average_rating: number;
}

interface Props {
    product: Product;
    relatedProducts: RelatedProduct[];
    [key: string]: unknown;
}

export default function ProductShow({ product, relatedProducts }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number; name: string; email: string } | null } }>().props;
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

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

    const handleAddToCart = () => {
        if (!auth.user) {
            router.get('/login');
            return;
        }

        router.post('/cart', {
            product_id: product.id,
            quantity: quantity,
        });
    };

    const handleAddToWishlist = () => {
        if (!auth.user) {
            router.get('/login');
            return;
        }

        router.post('/wishlist', {
            product_id: product.id,
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <nav className="flex mb-8 text-sm">
                        <Link href="/" className="text-blue-600 hover:underline">Beranda</Link>
                        <span className="mx-2 text-gray-500">/</span>
                        <Link href="/products" className="text-blue-600 hover:underline">Produk</Link>
                        <span className="mx-2 text-gray-500">/</span>
                        <Link 
                            href={`/products?category=${product.category.slug}`} 
                            className="text-blue-600 hover:underline"
                        >
                            {product.category.name}
                        </Link>
                        <span className="mx-2 text-gray-500">/</span>
                        <span className="text-gray-500">{product.name}</span>
                    </nav>

                    {/* Product Detail */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                            {/* Images */}
                            <div>
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                                    <img 
                                        src={product.images[selectedImage] || 'https://via.placeholder.com/500x500?text=No+Image'} 
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {product.images.length > 1 && (
                                    <div className="flex space-x-2 overflow-x-auto">
                                        {product.images.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImage(index)}
                                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                                                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                                                }`}
                                            >
                                                <img 
                                                    src={image} 
                                                    alt={`${product.name} ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div>
                                <div className="mb-4">
                                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                        {product.category.name}
                                    </span>
                                </div>

                                <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

                                {/* Rating */}
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="flex items-center">
                                        {renderStars(product.reviews_avg_rating || 0)}
                                        <span className="ml-2 text-gray-600">
                                            ({product.reviews_avg_rating?.toFixed(1) || '0.0'})
                                        </span>
                                    </div>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-600">{product.reviews_count} ulasan</span>
                                </div>

                                {/* Price */}
                                <div className="mb-6">
                                    <p className="text-3xl font-bold text-blue-600">{formatPrice(product.price)}</p>
                                </div>

                                {/* Stock */}
                                <div className="mb-6">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-700">Stok:</span>
                                        <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {product.stock > 0 ? `${product.stock} tersedia` : 'Habis'}
                                        </span>
                                    </div>
                                </div>

                                {/* Quantity & Actions */}
                                {product.stock > 0 && (
                                    <div className="mb-6">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <label className="text-gray-700 font-medium">Jumlah:</label>
                                            <div className="flex items-center border border-gray-300 rounded-lg">
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                                    className="w-16 px-3 py-2 text-center border-0 focus:outline-none"
                                                    min="1"
                                                    max={product.stock}
                                                />
                                                <button
                                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                                            <Button 
                                                onClick={handleAddToCart}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 text-lg"
                                                size="lg"
                                            >
                                                🛒 Tambah ke Keranjang
                                            </Button>
                                            <Button 
                                                onClick={handleAddToWishlist}
                                                variant="outline"
                                                className="border-red-500 text-red-500 hover:bg-red-50 py-3"
                                                size="lg"
                                            >
                                                ❤️ Wishlist
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {product.stock === 0 && (
                                    <div className="mb-6">
                                        <Button disabled className="w-full py-3 text-lg" size="lg">
                                            😔 Stok Habis
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="border-t border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Deskripsi Produk</h2>
                            <div className="prose max-w-none text-gray-700 leading-relaxed">
                                {product.description.split('\n').map((paragraph, index) => (
                                    <p key={index} className="mb-4">{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                ⭐ Ulasan Pelanggan ({product.reviews_count})
                            </h2>

                            {product.reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {product.reviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className="font-semibold text-gray-800">{review.user.name}</span>
                                                        {review.is_verified_purchase && (
                                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                                ✓ Pembelian Terverifikasi
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {renderStars(review.rating)}
                                                        <span className="text-sm text-gray-500">
                                                            {formatDate(review.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {review.comment && (
                                                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-6xl mb-4">💭</div>
                                    <p className="text-gray-500">Belum ada ulasan untuk produk ini</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">🔗 Produk Terkait</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {relatedProducts.map((relatedProduct) => (
                                        <Link 
                                            key={relatedProduct.id}
                                            href={`/products/${relatedProduct.slug}`}
                                            className="group"
                                        >
                                            <div className="bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
                                                <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                                                    <img 
                                                        src={relatedProduct.first_image || 'https://via.placeholder.com/300x300?text=No+Image'} 
                                                        alt={relatedProduct.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600">
                                                        {relatedProduct.name}
                                                    </h3>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-lg font-bold text-blue-600">
                                                            {formatPrice(relatedProduct.price)}
                                                        </p>
                                                        <div className="flex items-center text-sm">
                                                            {renderStars(relatedProduct.average_rating)}
                                                            <span className="ml-1 text-gray-500">({relatedProduct.reviews_count})</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}