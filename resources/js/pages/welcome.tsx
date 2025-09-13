import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    image_url: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    first_image: string;
    category: Category;
    reviews_count: number;
    average_rating: number;
}

interface Props {
    categories: Category[];
    featuredProducts: Product[];
    latestProducts: Product[];
    [key: string]: unknown;
}

export default function Welcome({ categories, featuredProducts }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number; name: string; email: string } | null } }>().props;

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
            {/* Navigation */}
            <nav className="bg-white shadow-lg border-b-4 border-blue-500">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="text-3xl">🛒</div>
                            <h1 className="text-2xl font-bold text-blue-600">ShopMart</h1>
                        </div>
                        
                        <div className="hidden md:flex items-center space-x-6">
                            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">Beranda</Link>
                            <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium">Produk</Link>
                            {auth.user ? (
                                <div className="flex items-center space-x-4">
                                    <Link href="/cart" className="text-gray-700 hover:text-blue-600">🛒 Keranjang</Link>
                                    <Link href="/wishlist" className="text-gray-700 hover:text-blue-600">❤️ Wishlist</Link>
                                    <Link href="/orders" className="text-gray-700 hover:text-blue-600">📦 Pesanan</Link>
                                    <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                        Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link href="/login">
                                        <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                                            Masuk
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button className="bg-blue-600 hover:bg-blue-700">
                                            Daftar
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            🛍️ ShopMart Indonesia
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100">
                            Platform e-commerce modern untuk semua kebutuhan belanja Anda
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                                <div className="text-3xl mb-2">📱</div>
                                <div className="text-sm">Elektronik</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                                <div className="text-3xl mb-2">👕</div>
                                <div className="text-sm">Fashion</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                                <div className="text-3xl mb-2">🍕</div>
                                <div className="text-sm">Makanan</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                                <div className="text-3xl mb-2">🏠</div>
                                <div className="text-sm">Rumah Tangga</div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/products">
                                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3">
                                    🔍 Jelajahi Produk
                                </Button>
                            </Link>
                            {!auth.user && (
                                <Link href="/register">
                                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3">
                                        📝 Daftar Sekarang
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            🏪 Kategori Populer
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Temukan berbagai kategori produk berkualitas dengan harga terbaik
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <Link 
                                key={category.id} 
                                href={`/products?category=${category.slug}`}
                                className="group"
                            >
                                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 border-2 border-transparent group-hover:border-blue-500">
                                    <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-50 rounded-t-xl flex items-center justify-center">
                                        <div className="text-4xl">
                                            {category.name.includes('Elektronik') && '📱'}
                                            {category.name.includes('Pakaian') && '👕'}
                                            {category.name.includes('Makanan') && '🍕'}
                                            {category.name.includes('Perawatan') && '💄'}
                                            {category.name.includes('Rumah') && '🏠'}
                                            {category.name.includes('Olahraga') && '⚽'}
                                            {category.name.includes('Buku') && '📚'}
                                            {!category.name.match(/Elektronik|Pakaian|Makanan|Perawatan|Rumah|Olahraga|Buku/) && '🛍️'}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-800 text-center group-hover:text-blue-600">
                                            {category.name}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            ⭐ Produk Unggulan
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Produk pilihan terbaik dengan rating tertinggi dari pelanggan
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <Link 
                                key={product.id}
                                href={`/products/${product.slug}`}
                                className="group"
                            >
                                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                                    <div className="aspect-square bg-gray-100 rounded-t-xl overflow-hidden">
                                        <img 
                                            src={product.first_image || 'https://via.placeholder.com/300x300?text=No+Image'} 
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                {product.category.name}
                                            </span>
                                            <div className="flex items-center text-sm">
                                                {renderStars(product.average_rating)}
                                                <span className="ml-1 text-gray-500">({product.reviews_count})</span>
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600">
                                            {product.name}
                                        </h3>
                                        <p className="text-lg font-bold text-blue-600">
                                            {formatPrice(product.price)}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    
                    <div className="text-center mt-8">
                        <Link href="/products">
                            <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                                Lihat Semua Produk →
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            🚀 Kenapa Memilih ShopMart?
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🚚</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Pengiriman Cepat</h3>
                            <p className="text-gray-600">Ekspedisi terpercaya: JNE, J&T, SiCepat, dan POS Indonesia</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">💳</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Pembayaran Aman</h3>
                            <p className="text-gray-600">Transfer bank, OVO, GoPay, Dana, dan kartu kredit</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">📞</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Layanan 24/7</h3>
                            <p className="text-gray-600">Customer service siap membantu Anda kapan saja</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {!auth.user && (
                <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            🎉 Siap Mulai Berbelanja?
                        </h2>
                        <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                            Daftar sekarang dan dapatkan pengalaman belanja online terbaik dengan berbagai produk berkualitas
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3">
                                    📝 Daftar Gratis
                                </Button>
                            </Link>
                            <Link href="/products">
                                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3">
                                    🔍 Lihat Produk
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="text-2xl">🛒</div>
                                <h3 className="text-xl font-bold">ShopMart</h3>
                            </div>
                            <p className="text-gray-300">
                                Platform e-commerce modern untuk semua kebutuhan belanja Anda
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Kategori</h4>
                            <ul className="space-y-2 text-gray-300">
                                <li><Link href="/products" className="hover:text-white">Elektronik</Link></li>
                                <li><Link href="/products" className="hover:text-white">Fashion</Link></li>
                                <li><Link href="/products" className="hover:text-white">Makanan</Link></li>
                                <li><Link href="/products" className="hover:text-white">Rumah Tangga</Link></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Layanan</h4>
                            <ul className="space-y-2 text-gray-300">
                                <li>Pengiriman Cepat</li>
                                <li>Pembayaran Aman</li>
                                <li>Customer Service</li>
                                <li>Garansi Produk</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Kontak</h4>
                            <div className="space-y-2 text-gray-300">
                                <p>📧 info@shopmart.com</p>
                                <p>📞 (021) 123-4567</p>
                                <p>📍 Jakarta, Indonesia</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
                        <p>&copy; 2024 ShopMart Indonesia. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}