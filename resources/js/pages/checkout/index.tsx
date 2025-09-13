import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/app-shell';

interface CartItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
        first_image: string;
    };
}

interface ShippingService {
    name: string;
    price: number;
}

interface Props {
    cartItems: CartItem[];
    subtotal: number;
    shippingServices: Record<string, ShippingService>;
    [key: string]: unknown;
}

export default function CheckoutIndex({ cartItems, subtotal, shippingServices }: Props) {
    const [formData, setFormData] = useState({
        shipping_address: {
            name: '',
            phone: '',
            address: '',
            city: '',
            province: '',
            postal_code: '',
        },
        shipping_service: 'jne',
        payment_method: 'bank_transfer',
    });

    const [isProcessing, setIsProcessing] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleInputChange = (field: string, value: string) => {
        if (field.startsWith('shipping_address.')) {
            const addressField = field.replace('shipping_address.', '');
            setFormData(prev => ({
                ...prev,
                shipping_address: {
                    ...prev.shipping_address,
                    [addressField]: value,
                },
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        router.post('/checkout', formData, {
            onFinish: () => setIsProcessing(false),
        });
    };

    const selectedShipping = shippingServices[formData.shipping_service];
    const total = subtotal + selectedShipping.price;

    const paymentMethods = {
        bank_transfer: { name: '🏧 Transfer Bank', icon: '🏧' },
        ovo: { name: '🟠 OVO', icon: '🟠' },
        gopay: { name: '💚 GoPay', icon: '💚' },
        dana: { name: '🔵 Dana', icon: '🔵' },
        credit_card: { name: '💳 Kartu Kredit', icon: '💳' },
    };

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">💳 Checkout</h1>
                        <p className="text-gray-600">Lengkapi informasi untuk menyelesaikan pesanan Anda</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Shipping & Payment Info */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Shipping Address */}
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                                        <span className="mr-2">📍</span>
                                        Alamat Pengiriman
                                    </h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nama Lengkap *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.shipping_address.name}
                                                onChange={(e) => handleInputChange('shipping_address.name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Masukkan nama lengkap"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nomor Telepon *
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.shipping_address.phone}
                                                onChange={(e) => handleInputChange('shipping_address.phone', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="08xxxxxxxxxx"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Alamat Lengkap *
                                            </label>
                                            <textarea
                                                required
                                                value={formData.shipping_address.address}
                                                onChange={(e) => handleInputChange('shipping_address.address', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Kota *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.shipping_address.city}
                                                onChange={(e) => handleInputChange('shipping_address.city', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Nama kota"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Provinsi *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.shipping_address.province}
                                                onChange={(e) => handleInputChange('shipping_address.province', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Nama provinsi"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Kode Pos *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.shipping_address.postal_code}
                                                onChange={(e) => handleInputChange('shipping_address.postal_code', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="12345"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Method */}
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                                        <span className="mr-2">🚚</span>
                                        Pilih Kurir
                                    </h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(shippingServices).map(([key, service]) => (
                                            <label key={key} className="cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="shipping_service"
                                                    value={key}
                                                    checked={formData.shipping_service === key}
                                                    onChange={(e) => handleInputChange('shipping_service', e.target.value)}
                                                    className="sr-only"
                                                />
                                                <div className={`border-2 rounded-lg p-4 transition-all ${
                                                    formData.shipping_service === key 
                                                        ? 'border-blue-500 bg-blue-50' 
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}>
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-semibold">{service.name}</span>
                                                        <span className="font-bold text-blue-600">
                                                            {formatPrice(service.price)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Estimasi 2-3 hari kerja
                                                    </p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                                        <span className="mr-2">💳</span>
                                        Metode Pembayaran
                                    </h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(paymentMethods).map(([key, method]) => (
                                            <label key={key} className="cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value={key}
                                                    checked={formData.payment_method === key}
                                                    onChange={(e) => handleInputChange('payment_method', e.target.value)}
                                                    className="sr-only"
                                                />
                                                <div className={`border-2 rounded-lg p-4 transition-all ${
                                                    formData.payment_method === key 
                                                        ? 'border-blue-500 bg-blue-50' 
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-2xl">{method.icon}</span>
                                                        <span className="font-semibold">{method.name}</span>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-4">
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold mb-4">📋 Ringkasan Pesanan</h2>
                                        
                                        {/* Cart Items */}
                                        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                                            {cartItems.map((item) => (
                                                <div key={item.id} className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 flex-shrink-0">
                                                        <img 
                                                            src={item.product.first_image || 'https://via.placeholder.com/48x48?text=No+Image'} 
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-800 line-clamp-2">
                                                            {item.product.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {item.quantity}x {formatPrice(item.product.price)}
                                                        </p>
                                                    </div>
                                                    <div className="text-sm font-semibold text-gray-800">
                                                        {formatPrice(item.product.price * item.quantity)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Price Breakdown */}
                                        <div className="space-y-3 mb-6">
                                            <div className="flex justify-between text-gray-600">
                                                <span>Subtotal</span>
                                                <span>{formatPrice(subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Ongkir ({selectedShipping.name})</span>
                                                <span>{formatPrice(selectedShipping.price)}</span>
                                            </div>
                                            <div className="border-t border-gray-200 pt-3">
                                                <div className="flex justify-between text-lg font-bold text-gray-800">
                                                    <span>Total</span>
                                                    <span className="text-blue-600">{formatPrice(total)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Button 
                                            type="submit"
                                            disabled={isProcessing}
                                            className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg"
                                            size="lg"
                                        >
                                            {isProcessing ? (
                                                <>⏳ Memproses Pesanan...</>
                                            ) : (
                                                <>🛒 Buat Pesanan</>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppShell>
    );
}