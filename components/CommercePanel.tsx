
import React from 'react';
import { Product, StreamDestination } from '../types';
import { ShoppingBag, DollarSign, TrendingUp, MonitorPlay, Zap, Package, Tag, Clock, Share2, Globe, MessageCircle, AlertTriangle, Play, RefreshCw, Box, Music, Volume2, CheckCircle, Gift, Truck, Pin, Activity, AlertOctagon, Film } from 'lucide-react';

interface CommercePanelProps {
  products: Product[];
  revenue: number;
  destinations: StreamDestination[];
  activeProductId: string | null;
  flashSaleTimeRemaining: number | null;
  onToggleProduct: (id: string) => void;
  onTriggerAd: () => void;
  onStartFlashSale: (minutes: number) => void;
  onNextProduct: () => void;
  onSimulatePurchase: () => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onToggleMusic: () => void;
  onPlayDemo: () => void;
  // New triggers
  onToggleShipping: () => void;
  onToggleBundle: () => void;
  onApplyDiscount: () => void;
  onPinMessage: () => void;
}

export const CommercePanel: React.FC<CommercePanelProps> = ({ 
    products, revenue, destinations, activeProductId, flashSaleTimeRemaining,
    onToggleProduct, onTriggerAd, onStartFlashSale, onNextProduct, onSimulatePurchase,
    onUpdateProduct, onToggleMusic, onPlayDemo,
    onToggleShipping, onToggleBundle, onApplyDiscount, onPinMessage
}) => {
  
  const activeProduct = products.find(p => p.id === activeProductId);

  // --- BUTTON COMPONENT (Broadcast Style) ---
  const ActionBtn = ({ label, icon, color, onClick, large, disabled, active }: any) => (
      <button 
        onClick={onClick}
        disabled={disabled}
        className={`
            relative flex flex-col items-center justify-center rounded-lg border-b-4 transition-all active:scale-95 shadow-md
            ${large ? 'h-24 col-span-2' : 'h-16'}
            ${disabled ? 'bg-gray-800 border-gray-900 text-gray-600 cursor-not-allowed' : 
              color === 'green' ? 'bg-green-700 border-green-900 text-white hover:bg-green-600' :
              color === 'red' ? 'bg-red-700 border-red-900 text-white hover:bg-red-600' :
              color === 'yellow' ? 'bg-yellow-600 border-yellow-800 text-black hover:bg-yellow-500' :
              color === 'blue' ? 'bg-blue-700 border-blue-900 text-white hover:bg-blue-600' :
              color === 'purple' ? 'bg-purple-700 border-purple-900 text-white hover:bg-purple-600' :
              color === 'orange' ? 'bg-orange-700 border-orange-900 text-white hover:bg-orange-600' :
              color === 'pink' ? 'bg-pink-700 border-pink-900 text-white hover:bg-pink-600' :
              'bg-gray-700 border-gray-900 text-white hover:bg-gray-600'
            }
            ${active ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''}
        `}
      >
          <div className="mb-1">{icon}</div>
          <span className="text-[10px] font-black uppercase tracking-wide leading-tight text-center">{label}</span>
      </button>
  );

  const handleLowStock = () => {
      if (activeProductId) onUpdateProduct(activeProductId, { stockStatus: 'RED' });
  };

  const handleSoldOut = () => {
      if (activeProductId) onUpdateProduct(activeProductId, { stock: 0, stockStatus: 'RED' });
  };

  return (
    <div className="flex h-full bg-[#111] overflow-hidden font-sans">
      
      {/* LEFT: 1-TOUCH COMMAND CENTER */}
      <div className="w-80 bg-[#151515] border-r border-gray-800 flex flex-col p-4 overflow-y-auto">
          <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-4 flex items-center gap-2"><Zap size={14}/> Live Actions</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Row 1: Primary Control */}
              <ActionBtn 
                label={activeProductId ? "HIDE PRODUCT" : "PRODUCT ON AIR"} 
                color={activeProductId ? "green" : "gray"} 
                icon={<ShoppingBag size={20}/>} 
                onClick={() => activeProduct ? onToggleProduct(activeProduct.id) : onToggleProduct(products[0].id)}
              />
              <ActionBtn label="NEXT PRODUCT" color="blue" icon={<RefreshCw size={20}/>} onClick={onNextProduct} />

              {/* Row 2: Sales Triggers */}
              <ActionBtn label="APPLY DISCOUNT" color="orange" icon={<Tag size={18}/>} onClick={onApplyDiscount} disabled={!activeProductId} />
              <ActionBtn label="FLASH SALE (5m)" color="purple" icon={<Clock size={18}/>} onClick={() => onStartFlashSale(5)} />

              {/* Row 3: Urgency */}
              <ActionBtn label="LOW STOCK ALERT" color="yellow" icon={<AlertTriangle size={18}/>} onClick={handleLowStock} disabled={!activeProductId} />
              <ActionBtn label="SOLD OUT" color="red" icon={<Box size={18}/>} onClick={handleSoldOut} disabled={!activeProductId} />

              {/* Row 4: Engagement */}
              <ActionBtn label="PIN MESSAGE" color="blue" icon={<Pin size={18}/>} onClick={onPinMessage} />
              <ActionBtn label="BUNDLE OFFER" color="pink" icon={<Gift size={18}/>} onClick={onToggleBundle} disabled={!activeProductId} />

              {/* Row 5: Info & Media */}
              <ActionBtn label="SHIPPING INFO" color="gray" icon={<Truck size={18}/>} onClick={onToggleShipping} />
              <ActionBtn label="PLAY DEMO CLIP" color="gray" icon={<Play size={18}/>} onClick={onPlayDemo} />

              {/* Row 6: Audio & Sim */}
              <ActionBtn label="MUSIC BED" color="gray" icon={<Music size={18}/>} onClick={onToggleMusic} />
              {/* NOTE: Simulate purchase is key for demos/testing but maybe hide in 'real' prod. Keeping for demo. */}
              {/* <ActionBtn label="SIMULATE BUY" color="green" icon={<TrendingUp size={18}/>} onClick={onSimulatePurchase} disabled={!activeProductId} /> */}
          </div>

          {/* STREAM HEALTH PANEL */}
          <div className="bg-[#0a0a0a] rounded-lg p-3 border border-gray-800 mt-auto">
              <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2">
                      <Activity size={12}/> Stream Health
                  </span>
                  <div className="flex items-center gap-1 text-[9px] text-green-500 bg-green-900/20 px-1.5 py-0.5 rounded border border-green-800">
                      <CheckCircle size={10}/> OPTIMAL
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="flex justify-between bg-[#1a1a1a] p-1.5 rounded">
                      <span className="text-gray-500">BITRATE</span>
                      <span className="text-white font-bold">6000K</span>
                  </div>
                  <div className="flex justify-between bg-[#1a1a1a] p-1.5 rounded">
                      <span className="text-gray-500">FPS</span>
                      <span className="text-white font-bold">59.94</span>
                  </div>
                  <div className="flex justify-between bg-[#1a1a1a] p-1.5 rounded">
                      <span className="text-gray-500">DROPS</span>
                      <span className="text-white font-bold">0</span>
                  </div>
                  <div className="flex justify-between bg-[#1a1a1a] p-1.5 rounded">
                      <span className="text-gray-500">BUFFER</span>
                      <span className="text-green-400 font-bold">2.5s</span>
                  </div>
              </div>
              <div className="mt-2 w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[12%]"></div>
              </div>
              <div className="text-[9px] text-gray-600 text-right mt-0.5">ENCODER LOAD: 12%</div>
          </div>
      </div>

      {/* CENTER: INVENTORY LIVE */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f0f0f]">
          {/* Header Stats */}
          <div className="h-16 bg-[#1a1a1a] border-b border-gray-800 flex items-center px-6 gap-8">
              <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase">Live Revenue</div>
                  <div className="text-2xl font-black text-green-500 font-mono tracking-tighter flex items-center gap-2">
                      <DollarSign size={20} />
                      {revenue.toLocaleString()}
                  </div>
              </div>
              <div className="h-8 w-[1px] bg-gray-700"></div>
              <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase">Flash Sale</div>
                  <div className={`text-2xl font-black font-mono tracking-tighter ${flashSaleTimeRemaining ? 'text-red-500 animate-pulse' : 'text-gray-600'}`}>
                      {flashSaleTimeRemaining ? `${Math.floor(flashSaleTimeRemaining/60)}:${(flashSaleTimeRemaining%60).toString().padStart(2,'0')}` : '--:--'}
                  </div>
              </div>
              
              {/* Simulate Purchase Button for Demo */}
              <button 
                  onClick={onSimulatePurchase}
                  className="ml-auto flex items-center gap-2 bg-green-900/30 hover:bg-green-900/50 border border-green-700 text-green-400 px-3 py-1.5 rounded text-xs font-bold transition-all active:scale-95"
                  title="Simulate a user purchase event"
              >
                  <TrendingUp size={14} /> SIMULATE BUY
              </button>

              <div className="">
                  <button className="flex items-center gap-2 bg-[#222] hover:bg-[#333] border border-gray-700 text-gray-300 px-3 py-1.5 rounded text-xs font-bold">
                      <RefreshCw size={12} /> SYNC SHOPIFY
                  </button>
              </div>
          </div>

          {/* Inventory Grid */}
          <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2"><Package size={14}/> Active Inventory</h3>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                  {products.map(prod => (
                      <div key={prod.id} className={`relative bg-[#1a1a1a] border rounded-xl overflow-hidden group transition-all ${prod.id === activeProductId ? 'border-green-500 ring-2 ring-green-500/30' : 'border-gray-800'}`}>
                          
                          <div className="flex h-32">
                              <div className="w-32 bg-white p-2 flex items-center justify-center relative">
                                  <img src={prod.imageUrl} className={`max-w-full max-h-full object-contain ${prod.stock === 0 ? 'grayscale opacity-50' : ''}`} />
                                  {prod.stock === 0 && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                          <span className="text-[10px] font-black text-white bg-red-600 px-2 py-1 rounded transform -rotate-12">SOLD OUT</span>
                                      </div>
                                  )}
                              </div>
                              <div className="flex-1 p-3 flex flex-col">
                                  <div className="flex justify-between items-start">
                                      <h4 className="font-bold text-sm text-gray-200 line-clamp-1">{prod.name}</h4>
                                      <span className={`w-2 h-2 rounded-full ${prod.stock > 10 ? 'bg-green-500' : prod.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                                  </div>
                                  <div className="text-xs font-mono font-bold text-green-400 mt-1">${prod.price}</div>
                                  
                                  <div className="mt-auto flex justify-between text-[10px] text-gray-500 bg-[#111] p-1.5 rounded">
                                      <span>Stock: <strong className={prod.stock === 0 ? 'text-red-500' : prod.stock < 10 ? 'text-yellow-500' : 'text-white'}>{prod.stock}</strong></span>
                                      <span>Sold: <strong className="text-white">{prod.salesCount}</strong></span>
                                  </div>
                              </div>
                          </div>

                          {prod.id === activeProductId && (
                              <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded animate-pulse shadow-md flex items-center gap-1">
                                  <Activity size={8} /> LIVE
                              </div>
                          )}
                          
                          <div className="flex border-t border-gray-800 divide-x divide-gray-800">
                              <button 
                                onClick={() => onToggleProduct(prod.id)}
                                className={`flex-1 py-2 text-[10px] font-bold hover:bg-[#252525] transition-colors ${prod.id === activeProductId ? 'text-red-400' : 'text-gray-400'}`}
                              >
                                  {prod.id === activeProductId ? 'HIDE OVERLAY' : 'SHOW OVERLAY'}
                              </button>
                              <button className="px-3 hover:bg-[#252525] text-gray-400">
                                  <Share2 size={12}/>
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* RIGHT: STREAM ROUTING & ALWAYS ON */}
      <div className="w-64 bg-[#151515] border-l border-gray-800 flex flex-col p-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2"><Globe size={14}/> Stream Routing</h3>
          
          <div className="space-y-3 mb-6">
              {destinations.map(dest => (
                  <div key={dest.id} className="bg-[#1a1a1a] border border-gray-700 rounded p-3">
                      <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-xs text-white">{dest.platform}</span>
                          <div className={`w-2 h-2 rounded-full ${dest.status === 'LIVE' ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
                      </div>
                      <div className="text-[10px] text-gray-500">{dest.viewers} viewers</div>
                      <div className="h-1 w-full bg-gray-800 rounded mt-2 overflow-hidden">
                          <div className="h-full bg-blue-500 w-[80%]"></div>
                      </div>
                  </div>
              ))}
          </div>

          <div className="mt-auto p-4 bg-blue-900/10 border border-blue-800 rounded-lg">
              <h4 className="text-blue-400 font-bold text-xs mb-2 flex items-center gap-2"><MonitorPlay size={12}/> Always-On Mode</h4>
              <p className="text-[10px] text-blue-200 leading-relaxed mb-3">
                  Run recorded content as live while maintaining real-time inventory and chat interactions.
              </p>
              
              <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <div className="w-3 h-3 rounded-full border border-gray-600"></div>
                      <span>Chat Bot: Active</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <div className="w-3 h-3 rounded-full border border-gray-600"></div>
                      <span>Stock Sync: Active</span>
                  </div>
              </div>

              <button className="w-full mt-3 py-2 bg-blue-900/40 border border-blue-700 rounded text-blue-300 text-[10px] font-bold hover:bg-blue-800 flex items-center justify-center gap-2">
                  <Film size={12} /> ENABLE MOCK LIVE
              </button>
          </div>
      </div>

    </div>
  );
};
