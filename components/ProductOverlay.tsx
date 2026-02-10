
import React from 'react';
import { Product } from '../types';
import { ShoppingBag, Clock, QrCode, TrendingUp, AlertTriangle, Truck, Gift, Tag, Star } from 'lucide-react';

interface ProductOverlayProps {
  product: Product;
  flashSaleTime: number | null;
  className?: string;
  showShipping?: boolean;
  showBundle?: boolean;
  discountActive?: boolean;
}

export const ProductOverlay: React.FC<ProductOverlayProps> = ({ 
    product, flashSaleTime, className, showShipping, showBundle, discountActive 
}) => {
  
  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isLowStock = product.stockStatus === 'YELLOW' || product.stockStatus === 'RED';
  const isSoldOut = product.stock === 0;
  const currentPrice = discountActive ? (product.price * 0.85).toFixed(2) : product.price.toFixed(2);

  return (
    <div className={`absolute bottom-8 left-8 z-50 w-[480px] animate-[slideUp_0.5s] font-sans ${className}`}>
        
        {/* TOP BADGES STACK */}
        <div className="flex flex-col items-start gap-1 mb-[-4px] relative z-10 pl-2">
            {showShipping && (
                <div className="bg-blue-600 text-white font-black text-[10px] px-3 py-1 rounded-t-md flex items-center gap-1.5 shadow-lg uppercase tracking-wide animate-[slideUp_0.2s]">
                    <Truck size={12} /> Free Priority Shipping
                </div>
            )}
            
            {showBundle && (
                <div className="bg-purple-600 text-white font-black text-[10px] px-3 py-1 rounded-t-md flex items-center gap-1.5 shadow-lg uppercase tracking-wide animate-[slideUp_0.3s]">
                    <Gift size={12} /> Exclusive Bundle Deal
                </div>
            )}
        </div>

        {/* MAIN CONTAINER */}
        <div className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden flex relative border-2 border-white/20">
            
            {/* FLASH SALE TIMER STRIP */}
            {flashSaleTime !== null && !isSoldOut && (
                <div className="absolute top-0 left-0 w-full h-8 bg-red-600 text-white flex items-center justify-between px-4 z-20">
                    <span className="font-black text-xs italic tracking-widest flex items-center gap-2">
                        <Clock size={14} className="animate-pulse" /> FLASH SALE ENDS
                    </span>
                    <span className="font-mono font-bold text-lg">{formatTime(flashSaleTime)}</span>
                </div>
            )}

            {/* SOLD OUT OVERLAY */}
            {isSoldOut && (
                <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="border-4 border-red-600 text-red-500 font-black text-4xl px-8 py-2 transform -rotate-12 uppercase tracking-widest shadow-2xl">
                        Sold Out
                    </div>
                </div>
            )}

            {/* LEFT: PRODUCT IMAGE */}
            <div className={`w-40 bg-gray-100 p-4 flex items-center justify-center relative ${flashSaleTime !== null ? 'mt-8' : ''}`}>
                <img src={product.imageUrl} className="max-w-full max-h-full object-contain drop-shadow-xl" />
                {isLowStock && !isSoldOut && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[9px] font-black px-2 py-1 rounded shadow-md flex items-center gap-1 animate-pulse">
                        <AlertTriangle size={10} /> {product.stock < 5 ? 'LAST PIECES' : 'SELLING FAST'}
                    </div>
                )}
            </div>

            {/* RIGHT: INFO & BUY */}
            <div className={`flex-1 p-4 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50 relative ${flashSaleTime !== null ? 'pt-10' : ''}`}>
                
                {/* Title */}
                <h2 className="font-black text-gray-900 text-lg leading-tight mb-1">{product.name}</h2>
                
                {/* Rating / Review Snippet */}
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-yellow-400">
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                    </div>
                    <span className="text-[9px] text-gray-500 font-bold">(482 Reviews)</span>
                </div>

                {/* Price Block */}
                <div className="flex items-baseline gap-3 mb-3">
                    <span className={`text-4xl font-black tracking-tighter ${discountActive ? 'text-red-600' : 'text-gray-900'}`}>
                        ${currentPrice}
                    </span>
                    {(discountActive || flashSaleTime !== null) && (
                        <div className="flex flex-col leading-none">
                            <span className="text-xs text-gray-400 line-through font-bold">${product.price.toFixed(2)}</span>
                            {discountActive && <span className="text-[10px] font-black text-red-600 uppercase">Save 15%</span>}
                        </div>
                    )}
                </div>

                {/* Variants Chips */}
                {product.variants && (
                    <div className="flex gap-1 mb-3">
                        {product.variants.map((v, i) => (
                            <span key={i} className="text-[9px] font-bold text-gray-600 bg-gray-200 px-2 py-0.5 rounded border border-gray-300">
                                {v}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer / Social Proof */}
                <div className="mt-auto pt-2 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full">
                        <TrendingUp size={12} />
                        <span>{product.salesCount} purchased live!</span>
                    </div>
                </div>
            </div>

            {/* QR CODE STRIP */}
            <div className={`w-24 bg-[#111] flex flex-col items-center justify-center p-2 text-white text-center border-l border-gray-800 ${flashSaleTime !== null ? 'mt-8' : ''}`}>
                <div className="bg-white p-1 rounded mb-1">
                    <QrCode size={64} className="text-black" />
                </div>
                <span className="text-[9px] font-black uppercase leading-tight tracking-wide text-yellow-400">SCAN TO BUY</span>
            </div>
        </div>
    </div>
  );
};
