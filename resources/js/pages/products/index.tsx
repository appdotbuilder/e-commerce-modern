import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/app-shell';

interface Category {
    id: number;
    name: string;
    slug: string;
    products_count: number;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    first_image: string;
    category: {
        id: number;
        name: string;
    };
    reviews_count: number;
    average_rating: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedProducts {
    data: Product[];
    links: PaginationLink[];
    meta: {
        total: number;
        current_page: number;
        last_page: number;
    };
}

interface Props {
    products: PaginatedProducts;
    categories: Category[];
    filters: {
        category?: string;
        min_price?: number;
        max_price?: number;
        search?: string;
        sort?: string;
    };
    [key: string]: unknown;
}

export default function ProductIndex({ products, categories, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');

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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/products', {
            ...filters,
            search: searchQuery,
        }, { preserveState: true });
    };

    const handlePriceFilter = () => {
        router.get('/products', {
            ...filters,
            min_price: minPrice,
            max_price: maxPrice,
        }, { preserveState: true });
    };

    const handleSortChange = (sort: string) => {
        router.get('/products', {
            ...filters,
            sort,
        }, { preserveState: true });
    };

    const handleCategoryFilter = (categorySlug: string) => {
        router.get('/products', {
            ...filters,
            category: categorySlug === filters.category ? '' : categorySlug,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        router.get('/products');
    };

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">🛍️ Semua Produk</h1>
                        <p className="text-gray-600">Temukan produk berkualitas dengan harga terbaik</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Filters Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">🔍 Filter</h2>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={clearFilters}
                                        className="text-blue-600"
                                    >
                                        Reset
                                    </Button>
                                </div>

                                {/* Search */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cari Produk
                                    </label>
                                    <form onSubmit={handleSearch} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Nama produk..."
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <Button type="submit" size="sm">
                                            🔍
                                        </Button>
                                    </form>
                                </div>

                                {/* Categories */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Kategori</h3>
                                    <div className="space-y-2">
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() => handleCategoryFilter(category.slug)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                    filters.category === category.slug
                                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                {category.name} ({category.products_count})
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Rentang Harga</h3>
                                    <div className="space-y-2">
                                        <input
                                            type="number"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            placeholder="Harga minimum"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="number"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            placeholder="Harga maximum"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <Button 
                                            onClick={handlePriceFilter}
                                            className="w-full"
                                            size="sm"
                                        >
                                            Terapkan Filter Harga
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        <div className="lg:col-span-3">
                            {/* Sort & Results Info */}
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white rounded-lg shadow-md p-4">
                                <p className="text-gray-600 mb-4 sm:mb-0">
                                    Menampilkan {products.data.length} dari {products.meta.total} produk
                                </p>
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-gray-700">Urutkan:</label>
                                    <select
                                        value={filters.sort || 'latest'}
                                        onChange={(e) => handleSortChange(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="latest">Terbaru</option>
                                        <option value="price_low">Harga Terendah</option>
                                        <option value="price_high">Harga Tertinggi</option>
                                        <option value="name">Nama A-Z</option>
                                        <option value="rating">Rating Tertinggi</option>
                                    </select>
                                </div>
                            </div>

                            {/* Products Grid */}
                            {products.data.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                        {products.data.map((product) => (
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

                                    {/* Pagination */}
                                    {products.links && (
                                        <div className="flex justify-center">
                                            <div className="flex space-x-1">
                                                {products.links.map((link, index: number) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => link.url && router.get(link.url)}
                                                        disabled={!link.url}
                                                        className={`px-3 py-2 rounded-lg text-sm ${
                                                            link.active
                                                                ? 'bg-blue-600 text-white'
                                                                : link.url
                                                                ? 'bg-white text-gray-700 hover:bg-gray-100 border'
                                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                                    <div className="text-6xl mb-4">😔</div>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Produk Tidak Ditemukan</h3>
                                    <p className="text-gray-500 mb-4">Coba ubah filter pencarian atau kata kunci yang berbeda</p>
                                    <Button onClick={clearFilters} className="bg-blue-600 hover:bg-blue-700">
                                        Reset Filter
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}