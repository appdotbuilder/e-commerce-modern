import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/app-shell';

interface OrderItem {
    id: number;
    product_name: string;
    price: number;
    quantity: number;
    total: number;
}

interface Order {
    id: number;
    order_number: string;
    total: number;
    status: string;
    payment_status: string;
    payment_method: string;
    created_at: string;
    items: OrderItem[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedOrders {
    data: Order[];
    links: PaginationLink[];
    meta: {
        total: number;
        current_page: number;
        last_page: number;
    };
}

interface Props {
    orders: PaginatedOrders;
    [key: string]: unknown;
}

export default function OrdersIndex({ orders }: Props) {
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
            pending: { label: '⏳ Menunggu', className: 'bg-yellow-100 text-yellow-800' },
            processing: { label: '⚡ Diproses', className: 'bg-blue-100 text-blue-800' },
            shipped: { label: '🚚 Dikirim', className: 'bg-indigo-100 text-indigo-800' },
            delivered: { label: '✅ Selesai', className: 'bg-green-100 text-green-800' },
            cancelled: { label: '❌ Dibatalkan', className: 'bg-red-100 text-red-800' },
        };

        const config = statusConfig[status as keyof typeof statusConfig];
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.className || 'bg-gray-100 text-gray-800'}`}>
                {config?.label || status}
            </span>
        );
    };

    const getPaymentStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: '⏳ Belum Dibayar', className: 'bg-yellow-100 text-yellow-800' },
            paid: { label: '✅ Dibayar', className: 'bg-green-100 text-green-800' },
            failed: { label: '❌ Gagal', className: 'bg-red-100 text-red-800' },
            refunded: { label: '🔄 Dikembalikan', className: 'bg-gray-100 text-gray-800' },
        };

        const config = statusConfig[status as keyof typeof statusConfig];
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.className || 'bg-gray-100 text-gray-800'}`}>
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

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">📦 Riwayat Pesanan</h1>
                        <p className="text-gray-600">Kelola dan pantau status pesanan Anda</p>
                    </div>

                    {orders.data.length > 0 ? (
                        <div className="space-y-6">
                            {orders.data.map((order) => (
                                <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                    <div className="p-6">
                                        {/* Order Header */}
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                    Pesanan #{order.order_number}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(order.created_at)}
                                                </p>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-blue-600">
                                                        {formatPrice(order.total)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {getPaymentMethodLabel(order.payment_method)}
                                                    </p>
                                                </div>
                                                <Link href={`/orders/${order.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        👁️ Detail
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Status Badges */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {getStatusBadge(order.status)}
                                            {getPaymentStatusBadge(order.payment_status)}
                                        </div>

                                        {/* Order Items Preview */}
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-gray-700">
                                                Produk ({order.items.length} item):
                                            </h4>
                                            {order.items.slice(0, 3).map((item) => (
                                                <div key={item.id} className="flex justify-between items-center text-sm bg-gray-50 rounded-lg p-3">
                                                    <div className="flex-1">
                                                        <span className="font-medium text-gray-800">{item.product_name}</span>
                                                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                                                    </div>
                                                    <span className="font-semibold text-gray-700">
                                                        {formatPrice(item.total)}
                                                    </span>
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="text-sm text-gray-500 text-center py-2">
                                                    +{order.items.length - 3} produk lainnya
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-gray-200">
                                            {order.payment_status === 'pending' && (
                                                <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
                                                    💳 Bayar Sekarang
                                                </Button>
                                            )}
                                            {order.status === 'shipped' && (
                                                <Button variant="outline" size="sm">
                                                    📍 Lacak Paket
                                                </Button>
                                            )}
                                            {order.status === 'delivered' && order.payment_status === 'paid' && (
                                                <Button variant="outline" size="sm">
                                                    ⭐ Beri Ulasan
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination */}
                            {orders.links && (
                                <div className="flex justify-center mt-8">
                                    <div className="flex space-x-1">
                                        {orders.links.map((link, index: number) => (
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
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                            <div className="text-8xl mb-6">📦</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Belum Ada Pesanan</h2>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Anda belum melakukan pemesanan apapun. Mari mulai berbelanja untuk 
                                menemukan produk favorit Anda!
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