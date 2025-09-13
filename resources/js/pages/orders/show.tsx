import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/app-shell';

interface OrderItem {
    id: number;
    product_name: string;
    price: number;
    quantity: number;
    total: number;
    product: {
        id: number;
        slug: string;
        first_image: string;
    };
}

interface Order {
    id: number;
    order_number: string;
    subtotal: number;
    shipping_cost: number;
    total: number;
    status: string;
    payment_status: string;
    payment_method: string;
    shipping_address: {
        name: string;
        phone: string;
        address: string;
        city: string;
        province: string;
        postal_code: string;
    };
    shipping_service: string;
    tracking_number?: string;
    created_at: string;
    shipped_at?: string;
    delivered_at?: string;
    items: OrderItem[];
}

interface Props {
    order: Order;
    [key: string]: unknown;
}

export default function OrderShow({ order }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: '⏳ Menunggu Konfirmasi', className: 'bg-yellow-100 text-yellow-800' },
            processing: { label: '⚡ Sedang Diproses', className: 'bg-blue-100 text-blue-800' },
            shipped: { label: '🚚 Dalam Pengiriman', className: 'bg-indigo-100 text-indigo-800' },
            delivered: { label: '✅ Pesanan Selesai', className: 'bg-green-100 text-green-800' },
            cancelled: { label: '❌ Dibatalkan', className: 'bg-red-100 text-red-800' },
        };

        const config = statusConfig[status as keyof typeof statusConfig];
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config?.className || 'bg-gray-100 text-gray-800'}`}>
                {config?.label || status}
            </span>
        );
    };

    const getPaymentStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: '⏳ Belum Dibayar', className: 'bg-yellow-100 text-yellow-800' },
            paid: { label: '✅ Sudah Dibayar', className: 'bg-green-100 text-green-800' },
            failed: { label: '❌ Pembayaran Gagal', className: 'bg-red-100 text-red-800' },
            refunded: { label: '🔄 Dikembalikan', className: 'bg-gray-100 text-gray-800' },
        };

        const config = statusConfig[status as keyof typeof statusConfig];
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config?.className || 'bg-gray-100 text-gray-800'}`}>
                {config?.label || status}
            </span>
        );
    };

    const getPaymentMethodLabel = (method: string) => {
        const methods = {
            bank_transfer: '🏧 Transfer Bank',
            ovo: '🟠 OVO',
            gopay: '💚 GoPay',
            dana: '🔵 Dana',
            credit_card: '💳 Kartu Kredit',
        };
        return methods[method as keyof typeof methods] || method;
    };

    const getShippingServiceLabel = (service: string) => {
        const services = {
            jne: 'JNE',
            jnt: 'J&T Express',
            sicepat: 'SiCepat',
            pos: 'Pos Indonesia',
        };
        return services[service as keyof typeof services] || service;
    };

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <nav className="flex mb-8 text-sm">
                        <Link href="/orders" className="text-blue-600 hover:underline">Riwayat Pesanan</Link>
                        <span className="mx-2 text-gray-500">/</span>
                        <span className="text-gray-500">#{order.order_number}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Order Details */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Order Info */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                            📦 Pesanan #{order.order_number}
                                        </h1>
                                        <p className="text-gray-600">
                                            Dipesan pada {formatDate(order.created_at)}
                                        </p>
                                    </div>
                                    <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                                        {getStatusBadge(order.status)}
                                        {getPaymentStatusBadge(order.payment_status)}
                                    </div>
                                </div>

                                {/* Order Timeline */}
                                <div className="border-l-4 border-blue-200 pl-6 space-y-4">
                                    <div className="relative">
                                        <div className="absolute -left-8 w-4 h-4 bg-blue-500 rounded-full"></div>
                                        <div>
                                            <p className="font-medium text-gray-800">Pesanan Dibuat</p>
                                            <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                                        </div>
                                    </div>

                                    {order.payment_status === 'paid' && (
                                        <div className="relative">
                                            <div className="absolute -left-8 w-4 h-4 bg-green-500 rounded-full"></div>
                                            <div>
                                                <p className="font-medium text-gray-800">Pembayaran Dikonfirmasi</p>
                                                <p className="text-sm text-gray-600">Status: Lunas</p>
                                            </div>
                                        </div>
                                    )}

                                    {order.shipped_at && (
                                        <div className="relative">
                                            <div className="absolute -left-8 w-4 h-4 bg-indigo-500 rounded-full"></div>
                                            <div>
                                                <p className="font-medium text-gray-800">Pesanan Dikirim</p>
                                                <p className="text-sm text-gray-600">{formatDate(order.shipped_at)}</p>
                                                {order.tracking_number && (
                                                    <p className="text-sm text-gray-600">
                                                        Resi: <span className="font-mono">{order.tracking_number}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {order.delivered_at && (
                                        <div className="relative">
                                            <div className="absolute -left-8 w-4 h-4 bg-green-600 rounded-full"></div>
                                            <div>
                                                <p className="font-medium text-gray-800">Pesanan Diterima</p>
                                                <p className="text-sm text-gray-600">{formatDate(order.delivered_at)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h2 className="text-xl font-semibold mb-4">📋 Produk yang Dipesan</h2>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                            <div className="w-16 h-16 flex-shrink-0">
                                                <img 
                                                    src={item.product?.first_image || 'https://via.placeholder.com/64x64?text=No+Image'} 
                                                    alt={item.product_name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            </div>
                                            
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-800 line-clamp-2">
                                                    {item.product_name}
                                                </h3>
                                                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                                    <span>{formatPrice(item.price)} × {item.quantity}</span>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-bold text-gray-800">
                                                    {formatPrice(item.total)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary & Actions */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Actions */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold mb-4">⚡ Aksi</h3>
                                <div className="space-y-3">
                                    {order.payment_status === 'pending' && (
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                            💳 Bayar Sekarang
                                        </Button>
                                    )}
                                    
                                    {order.status === 'shipped' && order.tracking_number && (
                                        <Button variant="outline" className="w-full">
                                            📍 Lacak Paket
                                        </Button>
                                    )}
                                    
                                    {order.status === 'delivered' && (
                                        <Button variant="outline" className="w-full">
                                            ⭐ Beri Ulasan
                                        </Button>
                                    )}

                                    <Button variant="outline" className="w-full">
                                        📞 Hubungi Customer Service
                                    </Button>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold mb-4">💰 Ringkasan Pembayaran</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span>{formatPrice(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Ongkos Kirim</span>
                                        <span>{formatPrice(order.shipping_cost)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2">
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span>Total</span>
                                            <span className="text-blue-600">{formatPrice(order.total)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 mb-1">Metode Pembayaran:</p>
                                    <p className="font-medium">{getPaymentMethodLabel(order.payment_method)}</p>
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold mb-4">🚚 Informasi Pengiriman</h3>
                                
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-1">Kurir:</p>
                                    <p className="font-medium">{getShippingServiceLabel(order.shipping_service)}</p>
                                </div>

                                {order.tracking_number && (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 mb-1">Nomor Resi:</p>
                                        <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                                            {order.tracking_number}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Alamat Pengiriman:</p>
                                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                                        <p className="font-medium">{order.shipping_address.name}</p>
                                        <p className="text-gray-600">{order.shipping_address.phone}</p>
                                        <p className="text-gray-700 mt-1">
                                            {order.shipping_address.address}<br />
                                            {order.shipping_address.city}, {order.shipping_address.province}<br />
                                            {order.shipping_address.postal_code}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}