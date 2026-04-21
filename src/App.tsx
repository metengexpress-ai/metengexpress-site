import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  Star, 
  Menu, 
  X,
  Smartphone,
  Tv,
  Box,
  ArrowRight,
  Facebook,
  History,
  Navigation,
  FileText,
  QrCode,
  Scan,
  Camera,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { Order, ProductType, Driver, VehicleType } from './types';
import { CONTACT_INFO, calculatePrice, PRICING_RULES, MOCK_DRIVERS } from './constants';

// --- Components ---

const RouteMap = ({ progress }: { progress: number }) => (
  <div className="relative w-full h-48 bg-slate-900 rounded-[2rem] overflow-hidden border border-white/10 mb-10 shadow-2xl">
    {/* Grid Background */}
    <div className="absolute inset-0 opacity-20" style={{ 
      backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', 
      backgroundSize: '20px 20px' 
    }}></div>

    {/* SVG Route */}
    <svg className="absolute inset-0 w-full h-full p-8" viewBox="0 0 400 150" fill="none" preserveAspectRatio="xMidYMid meet">
      <path 
        d="M20 120 C 100 120, 150 30, 250 80 S 380 40, 380 40" 
        stroke="#1E293B" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeDasharray="8 8"
      />
      <motion.path 
        d="M20 120 C 100 120, 150 30, 250 80 S 380 40, 380 40" 
        stroke="#3B82F6" 
        strokeWidth="6" 
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progress / 100 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />
      
      {/* Nodes */}
      <circle cx="20" cy="120" r="6" fill="#3B82F6" />
      <circle cx="380" cy="40" r="8" fill="#EF4444" />
      
      {/* Animated Ping at Current Position */}
      <motion.circle 
        cx="20" 
        cy="120" 
        r="12" 
        fill="#3B82F6" 
        style={{ 
          offsetPath: "path('M20 120 C 100 120, 150 30, 250 80 S 380 40, 380 40')",
          offsetRotate: "auto"
        }}
        animate={{ 
          offsetDistance: `${progress}%`,
        }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        className="opacity-20"
      />
    </svg>

    {/* Labels */}
    <div className="absolute bottom-6 left-8">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Origem (Hub)</span>
      </div>
    </div>
    <div className="absolute top-6 right-8 text-right">
      <div className="flex items-center gap-2 justify-end">
        <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Destino Final</span>
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      </div>
    </div>

    {/* Car Icon following the path */}
    <motion.div 
      className="absolute z-20 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
      style={{ 
        offsetPath: "path('M20 120 C 100 120, 150 30, 250 80 S 380 40, 380 40')",
        offsetRotate: "auto",
        top: -8, // Center offset
        left: -8
      }}
      animate={{ 
        offsetDistance: `${progress}%`,
      }}
      transition={{ duration: 2.5, ease: "easeInOut" }}
    >
      <Truck className="w-6 h-6 rotate-y-180" />
    </motion.div>
  </div>
);

const Tracking = () => {
  const [orderId, setOrderId] = useState('');
  const [trackingData, setTrackingData] = useState<{ status: string, location: number, distanceLeft: string, checkpoints: any[] } | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [nextUpdate, setNextUpdate] = useState(10); // minutes

  useEffect(() => {
    let timer: any;
    if (trackingData) {
      timer = setInterval(() => {
        setNextUpdate(prev => (prev > 1 ? prev - 1 : 10));
      }, 60000); // Update every real minute for simulation
    }
    return () => clearInterval(timer);
  }, [trackingData]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.length > 3) {
      setTrackingData({
        status: 'Motorista em trânsito',
        location: 65,
        distanceLeft: '2.4 km',
        checkpoints: [
          { time: '09:00', title: 'Pedido Confirmado', completed: true, desc: 'MetengExpress validou o seu pedido e atribuiu uma viatura elite.' },
          { time: '10:30', title: 'Recolhido na Origem', completed: true, desc: 'Motorista Fernando Bongo efectuou a recolha segura no Ponto de Partida.' },
          { time: '11:15', title: 'Em trânsito pela Cidade', completed: true, desc: 'Viatura monitorizada a passar pelas principais vias de acesso.' },
          { time: '12:00', title: 'Destino: Entrega Final', completed: false, desc: 'Previsão de chegada no ponto final em 10 minutos.' },
        ]
      });
    } else {
      setTrackingData(null);
    }
  };

  return (
    <section className="py-24 px-8 bg-transparent">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold mb-4 text-slate-900 leading-tight">Rastreamento de Alta Precisão</h2>
          <p className="text-slate-500">Transparência total desde a origem até ao destino final em Luanda.</p>
        </div>
        
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 mb-12 bg-white p-2 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100">
          <input 
            type="text" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Nº da Encomenda (Ex: MT-2026)" 
            className="flex-1 px-8 py-4 bg-transparent outline-none font-mono text-lg"
          />
          <button className="btn-primary px-12 py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
            Localizar Agora <Navigation className="w-5 h-5" />
          </button>
        </form>

        {trackingData && (
          <div className="grid lg:grid-cols-3 gap-8">
             <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50"
            >
              {/* Route Map Visualization */}
              <RouteMap progress={trackingData.location} />

              <div className="flex justify-between items-center mb-10 border-b pb-8">
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Distância Restante</p>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-600 rounded-full animate-ping"></div>
                    <span className="text-3xl font-black text-slate-900">{trackingData.distanceLeft}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Estado da Carga</p>
                  <span className="text-sm font-black text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">{trackingData.status}</span>
                </div>
              </div>

              <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                {trackingData.checkpoints.map((cp, i) => (
                  <div key={i} className="relative flex gap-6 items-start">
                    <div className={`mt-1 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 transition-colors duration-500 ${cp.completed ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-base font-bold ${cp.completed ? 'text-slate-900' : 'text-slate-400'}`}>{cp.title}</p>
                        <span className="text-[10px] font-black text-slate-300 italic">{cp.time}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed">{cp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="space-y-6"
            >
               <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl overflow-hidden border border-white/10">
                      <img src="https://picsum.photos/seed/driver1/150/150" alt="Motorista" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Fernando Bongo</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest leading-none mt-1">Toyota Hilux (MetengDriver)</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.open(`tel:${CONTACT_INFO.phone}`)}
                    className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" /> Ligar para Motorista
                  </button>
               </div>

               <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-2">Notificações Inteligentes</h4>
                  <p className="text-[10px] text-blue-800/70 mb-4 uppercase tracking-widest font-bold">Actualização de localização a cada 10 minutos</p>
                  
                  <div className="space-y-4">
                    <button 
                      onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                      className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                        notificationsEnabled 
                        ? 'bg-green-600 text-white shadow-lg' 
                        : 'bg-white text-blue-600 border border-blue-200'
                      }`}
                    >
                      {notificationsEnabled ? '✓ Notificações Activas' : 'Activar Avisos Automáticos'}
                    </button>
                    
                    {notificationsEnabled && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 p-4 rounded-xl border border-blue-100"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold text-slate-400">PRÓXIMO AVISO EM:</span>
                          <span className="text-xs font-black text-blue-600">{nextUpdate} MIN</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                          <motion.div 
                            className="bg-blue-600 h-full"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(10 - nextUpdate) * 10}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-blue-50">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Histórico de Alertas (Hoje)</p>
                          <div className="space-y-3">
                            <div className="flex gap-3 items-start">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1 shrink-0"></div>
                              <p className="text-[10px] text-slate-600 font-medium">11:15 - Motorista em Viana, trânsito moderado.</p>
                            </div>
                            <div className="flex gap-3 items-start">
                              <div className="w-1.5 h-1.5 bg-blue-300 rounded-full mt-1 shrink-0"></div>
                              <p className="text-[10px] text-slate-500 font-medium">11:05 - Passagem pelo Túnel do Prenda.</p>
                            </div>
                            <div className="flex gap-3 items-start">
                              <div className="w-1.5 h-1.5 bg-blue-200 rounded-full mt-1 shrink-0"></div>
                              <p className="text-[10px] text-slate-400 font-medium">10:55 - Início do percurso via Expressa.</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
               </div>

               <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Previsão de Chegada</h4>
                  <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hora Estimada</p>
                      <p className="text-sm font-black text-slate-900 text-lg">12:15 - 12:30</p>
                    </div>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

const Promotions = () => (
  <section className="py-24 px-8 bg-blue-600 overflow-hidden relative">
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
    
    <div className="max-w-7xl mx-auto relative z-10 text-white">
      <div className="flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            Promoções de Abril
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Use o código <span className="text-blue-300">METENG10</span> e ganhe 10% de desconto!
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Promoção válida para entregas de eletrônicos acima de 10.000 Kz. A tecnologia nunca esteve tão perto de si.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-10 rounded-[3rem] border border-white/20 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4 opacity-70">Desconto Exclusivo</p>
          <div className="text-6xl font-black mb-6">10%</div>
          <button 
            onClick={() => {}} 
            className="w-full bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20"
          >
            Copiar Código
          </button>
        </div>
      </div>
    </div>
  </section>
);

const Careers = () => {
  const [formData, setFormData] = useState({
    email: '',
    nif: '',
    zone: '',
    vehicleType: 'carro' as VehicleType,
    vehicleModel: '',
    vehiclePlate: '',
    vehicleColor: '',
    vehicleCondition: '',
    licenseCategory: 'B',
    itLevel: 'Básico',
    portfolio: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá MetengExpress! Candidatura MetengDriver:
E-mail: ${formData.email}
NIF: ${formData.nif}
Zona: ${formData.zone}
Veículo: ${formData.vehicleType} - ${formData.vehicleModel}
Matrícula: ${formData.vehiclePlate}
Cor: ${formData.vehicleColor}
Estado: ${formData.vehicleCondition}
Categoria CNH: ${formData.licenseCategory}
Nível de TI: ${formData.itLevel}
Portfólio: ${formData.portfolio}`;
    
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(text)}`);
  };

  return (
    <section className="py-24 px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-4xl font-extrabold text-slate-900 mb-8 tracking-tighter">Seja um MetengDriver</h2>
            <p className="text-lg text-slate-500 mb-12 leading-relaxed">
              Junte-se à frota de elite em Luanda. Operamos com os mais altos padrões de segurança e profissionalismo.
            </p>
            
            <h3 className="text-xl font-bold text-slate-900 mb-6">Requisitos & Benefícios MetengElite</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
              {[
                { t: 'Carta de Condução', d: 'Angola (B, C1, C2, D)', icon: <ShieldCheck className="w-4 h-4 text-red-600" /> },
                { t: 'Padrão Profissional', d: 'Cartão Elite & Uniforme', icon: <CreditCard className="w-4 h-4 text-blue-600" /> },
                { t: 'Remuneração Premium', d: 'Ganhos acima da média', icon: <Star className="w-4 h-4 text-yellow-600" /> },
                { t: 'Seguro Meteng Protege', d: 'Sua carga 100% segura', icon: <Box className="w-4 h-4 text-green-600" /> },
                { t: 'Flexibilidade Total', d: 'Seu tempo, suas regras', icon: <Clock className="w-4 h-4 text-purple-600" /> },
                { t: 'Comunidade Driver', d: 'Networking em Luanda', icon: <MessageCircle className="w-4 h-4 text-blue-400" /> }
              ].map((b, i) => (
                <div key={i} className="flex flex-col gap-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-slate-50 w-8 h-8 rounded-lg flex items-center justify-center">{b.icon}</div>
                  <span className="text-sm font-bold text-slate-900">{b.t}</span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{b.d}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/50 h-fit"
          >
            <h3 className="text-2xl font-black mb-8 text-slate-900 italic">Candidatura Instantânea</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">E-MAIL PROFISSIONAL</label>
                  <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="seu@email.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 font-medium text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">NIF (SAPE)</label>
                  <input required type="text" value={formData.nif} onChange={(e) => setFormData({...formData, nif: e.target.value})} placeholder="Obrigatório" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 font-medium text-sm" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">TIPO DE VEÍCULO</label>
                  <select required value={formData.vehicleType} onChange={(e) => setFormData({...formData, vehicleType: e.target.value as VehicleType})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 font-medium text-sm">
                    <option value="carro">Carro de Passeio</option>
                    <option value="carrinha">Carrinha (Pick-up)</option>
                    <option value="mota_2">Mota 2 Rodas</option>
                    <option value="mota_3">Mota 3 Rodas (Kupipila)</option>
                    <option value="camiao">Camião de Carga</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">MODELO DO VEÍCULO</label>
                  <input required type="text" value={formData.vehicleModel} onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})} placeholder="Ex: Toyota Hilux" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 font-medium text-sm" />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">MATRÍCULA</label>
                  <input required type="text" value={formData.vehiclePlate} onChange={(e) => setFormData({...formData, vehiclePlate: e.target.value})} placeholder="LD-00-00-XX" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 font-medium text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">COR</label>
                  <input required type="text" value={formData.vehicleColor} onChange={(e) => setFormData({...formData, vehicleColor: e.target.value})} placeholder="Branco, Azul..." className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 font-medium text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">ESTADO</label>
                  <input required type="text" value={formData.vehicleCondition} onChange={(e) => setFormData({...formData, vehicleCondition: e.target.value})} placeholder="Ex: Óptimo" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 font-medium text-sm" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">QUAL É O SEU NÍVEL DE TI?</label>
                  <select required value={formData.itLevel} onChange={(e) => setFormData({...formData, itLevel: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 font-medium text-sm">
                    <option value="Básico">Básico</option>
                    <option value="Médio">Médio (Familiarizado)</option>
                    <option value="Avançado">Avançado (Expert)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">LINK DO PORTFÓLIO / CV</label>
                  <input required type="url" value={formData.portfolio} onChange={(e) => setFormData({...formData, portfolio: e.target.value})} placeholder="https://..." className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 font-medium text-sm" />
                </div>
              </div>

              <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase block">CATEGORIA DA CARTA (ANGOLA)</label>
                <div className="flex flex-wrap gap-2">
                  {['A', 'B', 'C1', 'C2', 'D1', 'D2'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({...formData, licenseCategory: cat})}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        formData.licenseCategory === cat 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-white text-slate-500 border border-slate-100 hover:border-blue-200'
                      }`}
                    >
                      Cat. {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center cursor-pointer hover:bg-slate-50 transition-colors">
                <Camera className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carregar Foto do Motorista</p>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">ZONA DE PREFERÊNCIA</label>
                <select required value={formData.zone} onChange={(e) => setFormData({...formData, zone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 font-medium text-sm">
                  <option value="">Seleccione a sua área de Luanda</option>
                  <option>Zango (Económica)</option>
                  <option>Benfica (Litoral)</option>
                  <option>Talatona (Premium)</option>
                  <option>Kilamba (Residencial)</option>
                  <option>Viana / Estalagem</option>
                  <option>Cacuaco (Logística)</option>
                  <option>Cazenga / Sambizanga</option>
                  <option>Mutamba / Alvalade</option>
                  <option>Camama / Rocha Pinto</option>
                  <option>Maianga / Samba</option>
                  <option>Morro Bento / Gamek</option>
                  <option>Hoji Ya Henda</option>
                </select>
              </div>

              <button className="btn-primary w-full py-5 rounded-2xl font-black text-sm shadow-2xl shadow-blue-200/60 mt-4 uppercase tracking-widest group">
                Enviar Candidatura <ArrowRight className="w-4 h-4 inline-block ml-2 group-hover:translate-x-2 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="fixed bottom-24 right-8 z-[60]">
       <AnimatePresence>
         {isOpen && (
           <motion.div 
             initial={{ opacity: 0, y: 20, scale: 0.9 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, y: 20, scale: 0.9 }}
             className="bg-white w-80 mb-6 rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
           >
             <div className="bg-blue-700 p-6 text-white text-center">
                <p className="font-bold text-lg">Meteng Suporte</p>
                <p className="text-xs opacity-70">Normalmente respondemos em 5m</p>
             </div>
             <div className="h-64 p-6 overflow-y-auto bg-slate-50/50">
                <div className="bg-blue-100 p-3 rounded-2xl rounded-tl-none text-xs text-blue-900 mb-4 max-w-[80%]">
                  Olá! Como podemos ajudar na sua entrega hoje?
                </div>
             </div>
             <div className="p-4 border-t bg-white flex gap-2">
                <input type="text" placeholder="Escreva aqui..." className="flex-1 text-sm outline-none" />
                <button className="text-blue-600 hover:scale-110 transition-transform"><X className="w-5 h-5 rotate-45" /></button>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
       
       <button 
         onClick={() => setIsOpen(!isOpen)}
         className="bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95"
       >
         {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
       </button>
    </div>
  );
};

const OrderHistory = () => {
  const history = [
    { id: 'MT-4589', date: '12 Abr 2026', type: 'Eletrônicos', status: 'Entregue', price: '5.500 Kz', from: 'Londres', to: 'Ítalo' },
    { id: 'MT-4572', date: '08 Abr 2026', type: 'Eletrodomésticos', status: 'Entregue', price: '12.000 Kz', from: 'Kero Gabela', to: 'Ibengo' },
    { id: 'MT-4541', date: '02 Abr 2026', type: 'Acessórios', status: 'Cancelado', price: '3.000 Kz', from: 'Londres', to: 'Vila Alice' },
  ];

  return (
    <section className="py-24 px-8 bg-transparent">
       <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">Seu Histórico</h2>
              <p className="text-slate-500">Acompanhe suas transações anteriores na MetengExpress.</p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-xl text-blue-700 text-xs font-bold flex items-center gap-2">
              <FileText className="w-4 h-4" /> Exportar PDF
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Código</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Trajeto</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {history.map((order, i) => (
                    <motion.tr 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="hover:bg-slate-50/50 transition-colors cursor-default"
                    >
                      <td className="px-8 py-6 font-mono text-xs font-bold text-blue-600">{order.id}</td>
                      <td className="px-8 py-6 text-sm text-slate-500 font-medium">{order.date}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                          {order.from} <ArrowRight className="w-3 h-3 text-slate-300" /> {order.to}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs">
                        <span className={`px-3 py-1 rounded-full font-bold ${
                          order.status === 'Entregue' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right font-black text-slate-900">{order.price}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
       </div>
    </section>
  );
};

const Navbar = ({ onNavigate, currentTab }: { onNavigate: (tab: string) => void, currentTab: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: 'home', label: 'Início' },
    { id: 'history', label: 'Histórico' },
    { id: 'cursos', label: 'Cursos' },
    { id: 'services', label: 'Serviços' },
    { id: 'pricing', label: 'Preços' },
    { id: 'track', label: 'Rastrear' },
    { id: 'request', label: 'Solicitar' },
    { id: 'careers', label: 'Trabalhe Conosco' },
    { id: 'contact', label: 'Contato' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-8 w-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
              ME
            </div>
            <span className="text-xl font-bold tracking-tight text-blue-900">
              MetengExpress
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`text-sm font-medium transition-colors ${
                  currentTab === tab.id ? 'text-blue-700' : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a 
              href={`https://wa.me/${CONTACT_INFO.whatsapp}`} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 font-semibold text-blue-700 text-sm hover:underline"
            >
              <Phone className="w-4 h-4" /> {CONTACT_INFO.phone}
            </a>
            <button 
              onClick={() => window.open(`https://wa.me/${CONTACT_INFO.whatsapp}`)}
              className="btn-primary px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-blue-200/50"
            >
              WhatsApp
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    onNavigate(tab.id);
                    setIsOpen(false);
                  }}
                  className={`text-left text-lg font-medium ${
                    currentTab === tab.id ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onNavigate }: { onNavigate: (tab: string) => void }) => (
  <section className="pt-32 pb-20 px-8">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
          <Clock className="w-3 h-3" />
          <span>Logística Rápida em Luanda</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
          Logística Rápida,<br />
          <span className="text-blue-600">Sem Complicação.</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
          Sua entrega de eletrodomésticos e eletrônicos em Luanda com segurança total e preço justo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            onClick={() => onNavigate('request')}
            className="btn-primary px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 group shadow-xl shadow-blue-200/50"
          >
            Solicitar Entrega
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => onNavigate('pricing')}
            className="bg-white text-slate-700 border border-slate-200 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            Ver Preços
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
      >
        <div className="aspect-square bg-blue-100 rounded-[2rem] overflow-hidden rotate-3 absolute -z-10 w-full"></div>
        <img 
          src="https://picsum.photos/seed/delivery/800/800" 
          alt="Delivery Service" 
          className="rounded-[2rem] shadow-2xl relative z-10 w-full h-full object-cover -rotate-3 hover:rotate-0 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 flex items-center gap-4 border border-gray-50">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="text-green-600 w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Entregue hoje</div>
            <div className="text-xl font-bold">1,240+ Encomendas</div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const Services = ({ onSelectProduct }: { onSelectProduct: (product: string) => void }) => {
  const [expanded, setExpanded] = useState<number | null>(null);

  const items = [
    {
      title: 'Eletrodomésticos',
      desc: 'Geladeiras, TVs, Micro-ondas e muito mais.',
      icon: <Tv className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50',
      details: [
        'Geladeiras e Frigoríficos',
        'Fogões e Fornos',
        'Máquinas de Lavar Roupa/Loiça',
        'Micro-ondas e Air Fryers',
        'Ar Condicionados',
        'Televisores de Grandes Dimensões',
        'Arcas Congeladoras'
      ]
    },
    {
      title: 'Eletrônicos',
      desc: 'Smartphones, Laptops, PCs e Tablets.',
      icon: <Smartphone className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-100',
      details: [
        'iPhones e Androids (Séries S, Note)',
        'MacBooks e Laptops Gamer',
        'Desktops e Workstations',
        'Monitores de Alta Resolução',
        'Tablets e iPads',
        'Consolas de Jogos (PS5, Xbox)',
        'Sistemas de Som e Home Cinema'
      ]
    },
    {
      title: 'Acessórios & Informática',
      desc: 'Tudo o que precisa para os seus dispositivos.',
      icon: <Box className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-200',
      details: [
        'Baterias para Laptops e UPS',
        'Smartwatches e Pulseiras Inteligentes',
        'Carregadores Originais e Cabos Rápidos',
        'Cabos HDMI, VGA, USB-C e DisplayPort',
        'Cabos de Rede e Equipamento de Fibra',
        'Ratos, Teclados e Headsets',
        'Discos Externos e Memórias RAM'
      ]
    },
    {
      title: 'Cargas Frágeis & Urgentes',
      desc: 'Segurança absoluta para itens delicados e prazos críticos.',
      icon: <CheckCircle className="w-6 h-6 text-red-600" />,
      color: 'bg-red-50',
      details: [
        '⚠️ Veículo: Carrinhas ou Carros com Suspensão Reforçada',
        '📦 Cliente: Embalagem reforçada obrigatória',
        '⏱️ Prazo Urgente: Entrega prioritária (Moto ou Carro)',
        '💎 Itens de Cristal e Vidro',
        '💊 Medicamentos e Equipamento Médico',
        '📑 Documentos Jurídicos Confidenciais',
        '⚖️ Seguro de Carga de Alto Valor Integrado'
      ]
    },
    {
      title: 'Soluções para Negócios',
      desc: 'Gestão total de entregas para a sua empresa ou loja.',
      icon: <Truck className="w-6 h-6 text-blue-600" />,
      color: 'bg-green-50',
      details: [
        '🤝 Equipa Meteng assume todas as suas vendas',
        '📋 Contratos Flexíveis: Diário, Semanal ou Mensal',
        '💰 Pagamento Centralizado e Facturação Pro',
        '🚀 Escalabilidade garantida sem custos fixos',
        '📱 Dashboard de monitorização de frota',
        '🔄 Gestão de Devoluções e Reclamações'
      ]
    },
    {
      title: 'Afiliação de Motoristas',
      desc: 'Seja um parceiro oficial e ganhe estabilidade.',
      icon: <History className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-50',
      details: [
        '🛑 Opção para Motoristas Cansados: Equipa de Apoio',
        '⏳ Limites de Carga: Max 5/dia ou 3/hora (Saúde)',
        '🏢 Estabilidade: Contrato de Prestação de Serviço',
        '💵 Pagamentos garantidos pela plataforma',
        '🛡️ Suporte Jurídico e Documental',
        '📈 Plano de Carreira e Bónus de Performance'
      ]
    }
  ];

  return (
    <section className="py-24 bg-white/50 px-8 border-y border-slate-200" id="servicos">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 underline decoration-blue-600 underline-offset-8">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Nossos Serviços Elite</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Especialistas em transporte de equipamentos sensíveis e de alto valor.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              onClick={() => setExpanded(expanded === i ? null : i)}
              className={`p-8 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden ${
                expanded === i ? 'bg-slate-900 border-slate-900 shadow-2xl scale-[1.02]' : 'bg-white border-slate-100 hover:border-blue-200 shadow-sm'
              }`}
            >
              <div className={`${item.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              
              <h3 className={`text-xl font-bold mb-2 transition-colors ${expanded === i ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
              <p className={`text-sm mb-6 transition-colors ${expanded === i ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
              
              <AnimatePresence>
                {expanded === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 pt-4 border-t border-white/10"
                  >
                    {item.details.map((detail, idx) => (
                      <div 
                        key={idx} 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(detail);
                        }}
                        className="flex items-center gap-2 text-xs text-slate-300 hover:text-blue-400 transition-colors py-1"
                      >
                        <CheckCircle className="w-3 h-3 text-blue-500 shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                    <button className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all uppercase tracking-widest">
                      Solicitar Entrega Agora
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {!expanded && (
                <div className="absolute bottom-6 right-8 text-blue-600 font-black text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform cursor-pointer">
                  Ver Lista +
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CollectionTypes = () => {
  const collectionItems = [
    { name: 'Encomenda Rápida', color: 'bg-blue-600', icon: <Package className="w-5 h-5 text-white" /> },
    { name: 'Documento Seguro', color: 'bg-green-600', icon: <FileText className="w-5 h-5 text-white" /> },
    { name: 'Carga Frágil', color: 'bg-red-600', icon: <Box className="w-5 h-5 text-white" /> },
    { name: 'Item Especial', color: 'bg-slate-900', icon: <Star className="w-5 h-5 text-white" /> },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 text-center">Tipos de Coleta Disponíveis</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {collectionItems.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-4 group cursor-pointer">
              <div className={`${item.color} w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CourseSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    itLevel: 'Básico',
    portfolio: '',
    interest: 'Fibra Óptica'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Inscrição Meteng Academy:
Nome: ${formData.name}
E-mail: ${formData.email}
Curso: ${formData.interest}
Nível TI: ${formData.itLevel}
Portfólio: ${formData.portfolio}`;
    
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(text)}`);
  };

  return (
    <section className="py-32 bg-slate-50 px-8 border-y border-slate-200 overflow-hidden relative" id="cursos">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600"></div>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
          >
             <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-100/50 text-blue-700 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-200">
               <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
               Meteng Academy Internacional
             </div>
             <h2 className="text-5xl font-black text-slate-900 mb-8 tracking-tighter leading-none">
               Formação <span className="text-blue-600">Elite</span> em<br />Tecnologia Digital
             </h2>
             <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-xl">
               Prepare-se para o mercado de trabalho angolano com a certificação prática da MetengExpress. Especialização real em Fibra Óptica e Redes.
             </p>
             
             <div className="grid sm:grid-cols-2 gap-8">
               {[
                 { t: 'Instrutores de Elite', d: 'Profissionais no ativo' },
                 { t: 'Laboratório Prático', d: 'Equipamento real' },
                 { t: 'Estágio Garantido', d: 'Na nossa rede logística' },
                 { t: 'Diplomas Pro', d: 'Reconhecidos em Luanda' }
               ].map((feature, i) => (
                 <div key={i} className="flex gap-4 items-start">
                   <div className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center shrink-0">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900 text-sm">{feature.t}</h4>
                      <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">{feature.d}</p>
                   </div>
                 </div>
               ))}
             </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="relative"
          >
            <div className="absolute -z-10 inset-0 bg-blue-600/5 rounded-[4rem] rotate-3 translate-x-4"></div>
            <div className="bg-slate-900 p-10 lg:p-12 rounded-[4rem] shadow-3xl text-white border border-white/5 relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              
              <div className="relative z-10 text-center mb-8 border-b border-white/10 pb-8">
                  <h3 className="text-3xl font-black italic tracking-tighter mb-2">Inscrição Academy</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Preencha os requisitos de acesso</p>
              </div>

              <form className="relative z-10 space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 tracking-widest uppercase">NOME COMPLETO</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="Seu nome" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 tracking-widest uppercase">E-MAIL</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="seu@email.com" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 tracking-widest uppercase">NÍVEL EM TI</label>
                    <select value={formData.itLevel} onChange={(e) => setFormData({...formData, itLevel: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500">
                      <option value="Iniciante" className="bg-slate-900">Iniciante / Zero</option>
                      <option value="Intermediário" className="bg-slate-900">Intermediário</option>
                      <option value="Avançado" className="bg-slate-900">Avançado / Profissional</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 tracking-widest uppercase">CERTIFICAÇÃO DESEJADA</label>
                    <select value={formData.interest} onChange={(e) => setFormData({...formData, interest: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500">
                      <option value="Fibra Óptica" className="bg-slate-900">Fibra Óptica Elite</option>
                      <option value="Redes Cisco" className="bg-slate-900">Redes e Infraestrutura</option>
                      <option value="Segurança" className="bg-slate-900">Cibersegurança</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 tracking-widest uppercase">O SEU PORTFÓLIO / CV (URL)</label>
                  <input required type="url" value={formData.portfolio} onChange={(e) => setFormData({...formData, portfolio: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="https://linkedin.com/in/..." />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full py-5 bg-blue-600 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-700 hover:shadow-2xl shadow-blue-900/50 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    Candidatar-se ao Curso <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
              
              <div className="relative z-10 mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Início das Aulas</p>
                  <p className="text-xl font-black text-blue-400">Dia 1 Mensal</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mensalidade</p>
                  <p className="text-xl font-black text-white">10.000 Kz</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Pricing = ({ onNavigate, onSelectProduct }: { onNavigate: (tab: string) => void, onSelectProduct: (p: string) => void }) => {
  const [distRange, setDistRange] = useState(5);

  return (
    <section className="py-24 px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Preços Justos MetengElite</h3>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Otimize por Distância & Categoria</h2>
          
          <div className="flex justify-center gap-4 mb-12">
            {[5, 10, 20].map((d) => (
              <button 
                key={d}
                onClick={() => setDistRange(d)}
                className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all border ${
                  distRange === d 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-200' 
                  : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200'
                }`}
              >
                {d} KM
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {(Object.entries(PRICING_RULES) as [ProductType, typeof PRICING_RULES['small']][]).map(([key, rule]) => (
            <div 
              key={key} 
              onClick={() => {
                onSelectProduct(key === 'small' ? 'Fones/Acessórios' : key === 'medium' ? 'TV/Laptop' : key === 'large' ? 'Geladeira' : 'Urgente');
                onNavigate('request');
              }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden group cursor-pointer hover:border-blue-600 hover:scale-[1.02] transition-all"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-200">
                  {key === 'small' ? <Smartphone className="w-5 h-5" /> : key === 'medium' ? <Tv className="w-5 h-5" /> : key === 'large' ? <Box className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                </div>

                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">
                  {key === 'small' ? 'Compacto' : key === 'medium' ? 'Executivo' : key === 'large' ? 'Industrial' : 'Especial'}
                </h3>
                <p className="text-slate-400 text-[10px] font-medium mb-6 leading-relaxed">
                  {key === 'small' ? 'Ideal para acessórios' : key === 'medium' ? 'TVs e Computadores' : key === 'large' ? 'Linha Branca' : 'Cargas Frágeis & Urgentes'}
                </p>

                <div className="mt-auto">
                  <p className="text-3xl font-black text-blue-700">
                    {(rule.basePrice + (distRange > 5 ? (distRange - 5) * rule.perKmExtra : 0)).toLocaleString()} <span className="text-sm font-bold">Kz</span>
                  </p>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-2">{key === 'special' ? 'Preço Base Especial' : `Cálculo para ${distRange}km`}</p>
                  
                  <div className="mt-6 flex items-center gap-2 text-blue-600 font-bold text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                    SOLICITAR AGORA <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const RequestDelivery = ({ preselectedProduct = '', onResetProduct = () => {} }: { preselectedProduct?: string, onResetProduct?: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    origin: '',
    destination: '',
    type: 'small' as ProductType,
    urgency: 'normal' as 'normal' | 'express' | 'urgent',
    cargoType: 'normal' as 'normal' | 'fragile' | 'special',
    distance: 0,
    specificProduct: preselectedProduct || '',
    selectedDriverId: '',
  });

  const [showStores, setShowStores] = useState(false);
  const [showDrivers, setShowDrivers] = useState(false);
  const [storeSearch, setStoreSearch] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('Luanda');
  const [simulatedPrice, setSimulatedPrice] = useState<number | null>(null);

  const stores = [
    { name: 'Kero Gabela', area: 'Gabela', province: 'Luanda', price: 'Standard' },
    { name: 'Loja Central Eletrónica', area: 'Baixa de Luanda', province: 'Luanda', price: 'Económica' },
    { name: 'Digital Express', area: 'Viana Park', province: 'Luanda', price: 'Económica' },
    { name: 'Benguela Tech', area: 'Zona Industrial', province: 'Benguela', price: 'Standard' },
    { name: 'Huambo Digital', area: 'Centro Cidade', province: 'Huambo', price: 'Económica' },
    { name: 'Lobito Express', area: 'Porto', province: 'Benguela', price: 'Premium' }
  ];

  const filteredStores = stores.filter(s => 
    (provinceFilter === 'Todas' || s.province === provinceFilter) &&
    (s.name.toLowerCase().includes(storeSearch.toLowerCase()) || s.area.toLowerCase().includes(storeSearch.toLowerCase()))
  );

  const selectedDriver = MOCK_DRIVERS.find(d => d.id === formData.selectedDriverId);

  React.useEffect(() => {
    if (preselectedProduct) setFormData(prev => ({ ...prev, specificProduct: preselectedProduct }));
  }, [preselectedProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    const price = calculatePrice(
      formData.type, 
      parseFloat(formData.distance.toString()) || 0, 
      formData.urgency,
      formData.cargoType
    );
    setSimulatedPrice(price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá MetengExpress! Solicitação de Entrega:
Nome: ${formData.name}
Phone: ${formData.phone}
Item: ${formData.specificProduct || formData.type}
Origem: ${formData.origin}
Destino: ${formData.destination}
Província: ${provinceFilter}
Urgência: ${formData.urgency}
Carga: ${formData.cargoType}
Motorista Selecionado: ${selectedDriver ? `${selectedDriver.name} (${selectedDriver.id})` : 'Melhor disponível'}
Preço Estimado: ${simulatedPrice?.toLocaleString()} Kz`;
    
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(text)}`);
    onResetProduct();
  };

  return (
    <section className="py-24 px-8 bg-transparent">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden"
        >
          <div className="bg-slate-900 p-10 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10"><Box className="w-40 h-40" /></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black">Solicitação Elite</h2>
              <p className="text-sm text-slate-400 mt-2">Logística personalizada em todo o território nacional</p>
            </div>
            <div className="text-right relative z-10">
              <p className="text-4xl font-black text-blue-400">
                {simulatedPrice ? `${simulatedPrice.toLocaleString()} Kz` : '---'}
              </p>
            </div>
          </div>
          
          <form className="p-10 space-y-8" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">NOME COMPLETO</label>
                <input required name="name" value={formData.name} onChange={handleChange} placeholder="Seu nome" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-500 flex font-bold text-sm outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">PRODUTO / ITEM</label>
                <input required name="specificProduct" value={formData.specificProduct} onChange={handleChange} placeholder="Ex: iPhone 15 Pro Max" className="w-full px-6 py-4 bg-blue-50 border border-blue-100 text-blue-900 rounded-2xl focus:border-blue-500 font-bold text-sm outline-none" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">PRIORIDADE DE ENTREGA</label>
                <div className="flex gap-4">
                  {(['normal', 'express', 'urgent'] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setFormData({...formData, urgency: u})}
                      className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase transition-all border ${
                        formData.urgency === u ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200'
                      }`}
                    >
                      {u === 'normal' ? 'Normal' : u === 'express' ? 'Expresso' : '🔥 Urgente'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">TIPO DE CARGA (ESPECIAL)</label>
                <div className="flex gap-4">
                  {(['normal', 'fragile', 'special'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({...formData, cargoType: c})}
                      className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase transition-all border ${
                        formData.cargoType === c ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200'
                      }`}
                    >
                      {c === 'normal' ? 'Normal' : c === 'fragile' ? 'Frágil' : '💎 Especial'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">SELECIONAR MOTORISTA ELITE (PONTUAÇÃO ALTA)</label>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {MOCK_DRIVERS.sort((a, b) => b.rating - a.rating).map((driver) => (
                  <button
                    key={driver.id}
                    type="button"
                    onClick={() => setFormData({...formData, selectedDriverId: driver.id})}
                    className={`flex-shrink-0 w-64 p-4 rounded-[2rem] border transition-all text-left ${
                      formData.selectedDriverId === driver.id ? 'bg-blue-50 border-blue-600 shadow-md' : 'bg-white border-slate-100 hover:border-blue-200 shadow-sm'
                    }`}
                  >
                    <div className="flex gap-4 items-center">
                      <img src={driver.photo} alt={driver.name} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{driver.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-[10px] font-black text-slate-500">{driver.rating} • {driver.vehicle.type}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
               <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">ORIGEM (RECOLHA)</label>
                <div className="flex gap-2">
                  <input required name="origin" value={formData.origin} onChange={handleChange} placeholder="Bairro ou Loja" className="flex-1 px-4 py-4 bg-white border border-slate-100 rounded-xl font-bold text-sm outline-none" />
                  <button type="button" onClick={() => setShowStores(true)} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-700 transition-all flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Lojas
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">DESTINO FINAL</label>
                <input required name="destination" value={formData.destination} onChange={handleChange} placeholder="Endereço Completo" className="w-full px-4 py-4 bg-white border border-slate-100 rounded-xl font-bold text-sm outline-none" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
               <div className="flex gap-4">
                 <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest tracking-tight">Seguro incluído</span>
                 </div>
                 <button type="button" onClick={handleCalculate} className="text-xs font-bold text-blue-600 underline">Calcular Preço</button>
               </div>
               <button type="submit" className="btn-primary px-12 py-5 rounded-2xl font-black uppercase text-sm shadow-2xl flex items-center gap-3">
                 Solicitar via WhatsApp <ArrowRight />
               </button>
            </div>
          </form>
        </motion.div>

        <AnimatePresence>
          {showStores && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-3xl fixed inset-4 md:inset-20 z-[80] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-slate-900 leading-none tracking-tighter">Directório MetengLojas</h3>
                <button onClick={() => setShowStores(false)} className="text-slate-400 hover:text-slate-900 border p-2 rounded-xl transition-all"><X /></button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-10">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Filtrar por nome ou bairro..." 
                    value={storeSearch}
                    onChange={(e) => setStoreSearch(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 font-bold"
                  />
                  <Package className="absolute left-4 top-4 text-slate-300 w-5 h-5" />
                </div>
                <div className="flex gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  {['Luanda', 'Benguela', 'Huambo', 'Todas'].map(p => (
                    <button 
                      key={p} 
                      onClick={() => setProvinceFilter(p)}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                        provinceFilter === p ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {filteredStores.map((shop, i) => (
                  <motion.div 
                    layout
                    key={i} 
                    onClick={() => { setFormData(prev => ({ ...prev, origin: shop.name })); setShowStores(false); }} 
                    className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-600 cursor-pointer transition-all flex justify-between items-center group relative overflow-hidden"
                  >
                    <div className="relative z-10">
                      <p className="font-black text-slate-900 text-lg mb-1">{shop.name}</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{shop.area} ({shop.province})</p>
                      </div>
                    </div>
                    <div className="relative z-10 bg-white px-4 py-2 rounded-xl text-[9px] font-black uppercase text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">{shop.price}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const Contact = () => (
  <section className="py-24 px-8 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter">Locais de Operação</h2>
          <p className="text-slate-500 mb-12 text-lg leading-relaxed">
            Nossa base logística estratégica permite atender toda Luanda, com presença forte nos principais pontos comerciais.
          </p>

          <div className="space-y-6">
            {[
              { title: 'Sede Central', detail: 'Centro Logístico Principal', stores: 'Baixa de Luanda', query: 'Baixa de Luanda Angola' },
              { title: 'Hub Viana', detail: 'Distribuição Rápida', stores: 'Viana Park, Estalagem', query: 'Viana Luanda Angola' },
              { title: 'Ponto Talatona', detail: 'Serviço Premium & Elite', stores: 'Belas Shopping, SIAC', query: 'Talatona Luanda Angola' }
            ].map((loc, i) => (
              <a 
                key={i} 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.query)}`}
                target="_blank"
                rel="noreferrer"
                className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform"><MapPin className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{loc.title}</h4>
                  <p className="text-xs text-slate-500 mb-2">{loc.detail}</p>
                  <p className="text-[10px] font-bold text-blue-600 italic">Perto de: {loc.stores}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 border-t pt-10">
            <div>
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Central de Apoio</p>
               <a 
                 href={`https://wa.me/${CONTACT_INFO.whatsapp}`} 
                 target="_blank" 
                 rel="noreferrer"
                 className="text-xl font-bold text-slate-900 hover:text-green-600 transition-colors"
                >
                  MetengExpress
                </a>
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Administração</p>
               <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors uppercase underline">{CONTACT_INFO.email}</a>
            </div>
          </div>
        </div>

        <div className="rounded-[3rem] overflow-hidden shadow-2xl h-[600px] border border-slate-100 relative group grayscale hover:grayscale-0 transition-all duration-700">
          <iframe 
            title="MetengExpress Location"
            width="100%" 
            height="100%" 
            frameBorder="0" 
            src={`https://www.google.com/maps/embed/v1/place?key=REPLACE_WITH_KEY&q=Luanda+Angola`}
          />
          <div className="absolute top-8 right-8 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 pointer-events-none group-hover:scale-105 transition-transform">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status da Rede</p>
             <p className="text-xs font-bold text-green-600 flex items-center gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               Zonas de Luanda Ativas
             </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Feedback = ({ onShowRating }: { onShowRating: () => void }) => (
  <section className="py-24 px-4 bg-blue-600">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-4 gap-8">
        <div>
          <h2 className="text-4xl font-bold text-white mb-4">O que dizem nossos clientes</h2>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />)}
          </div>
        </div>
        <button 
          onClick={onShowRating}
          className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-50 transition-all flex items-center gap-2"
        >
          Avaliar Entregador <Star className="w-4 h-4" />
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { name: 'João Manuel', text: 'Entregaram minha geladeira em tempo recorde. Muito profissionais!', stars: 5 },
          { name: 'Maria Santos', text: 'Excelente serviço. O rastreamento me deixou muito tranquila.', stars: 5 },
          { name: 'Pedro Paulo', text: 'Melhor empresa de entregas em Luanda. Recomendo!', stars: 5 }
        ].map((f, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20 text-white italic">
            <p className="text-lg mb-6">"{f.text}"</p>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold not-italic">
                {f.name[0]}
              </div>
              <div className="not-italic">
                <div className="font-bold">{f.name}</div>
                <div className="text-sm opacity-60">Cliente Verificado</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const DriverIDCard = ({ driver }: { driver: Driver }) => {
  const [showBack, setShowBack] = useState(false);

  return (
    <div 
      className="relative w-72 h-[420px] cursor-pointer perspective-1000 group mx-auto"
      onClick={() => setShowBack(!showBack)}
    >
      <motion.div 
        className="w-full h-full relative transition-all duration-500 preserve-3d"
        animate={{ rotateY: showBack ? 180 : 0 }}
      >
        {/* Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-slate-900 rounded-[2rem] border-4 border-blue-600 p-8 flex flex-col items-center text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
          <div className="w-24 h-24 rounded-2xl border-2 border-white/20 overflow-hidden mb-6 mt-4 shadow-2xl">
            <img src={driver.photo} alt={driver.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <h4 className="text-white font-black text-xl tracking-tighter mb-1">{driver.name}</h4>
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">MetengDriver Elite</p>
          
          <div className="space-y-3 w-full bg-white/5 p-4 rounded-2xl border border-white/10 text-left">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-green-500" />
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">CNH Categoria B</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-3 h-3 text-blue-500" />
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">{driver.vehicle.model}</span>
            </div>
          </div>
          
          <div className="mt-auto flex flex-col items-center">
             <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < Math.floor(driver.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}`} />
                ))}
             </div>
             <p className="text-[9px] text-white/50 font-black uppercase">Clique p/ Verso</p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-[2rem] border-4 border-slate-900 p-8 flex flex-col items-center justify-center rotate-y-180">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Validação Digital</p>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner mb-6 flex flex-col items-center">
            <QrCode className="w-32 h-32 text-slate-900 mb-2" />
            <p className="text-[8px] font-mono text-slate-400 uppercase">ID: {driver.id}-ELITE</p>
          </div>
          <p className="text-[10px] text-slate-500 font-bold leading-relaxed text-center px-4">
            Escanear via MetengApp para validar identidade e condições do veículo.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const QRScanModal = ({ onScan }: { onScan: (driverId: string) => void, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
       <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white max-w-sm w-full rounded-[3rem] p-10 text-center"
      >
        <div className="relative w-full aspect-square bg-slate-50 rounded-3xl mb-8 flex items-center justify-center overflow-hidden border border-slate-100">
           <div className="absolute inset-8 border-2 border-dashed border-blue-600 rounded-2xl animate-pulse"></div>
           <Scan className="w-16 h-16 text-slate-300" />
           <div className="absolute top-1/2 left-0 w-full h-0.5 bg-blue-600/50 shadow-[0_0_20px_rgba(37,99,235,0.5)] animate-scan"></div>
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">Leitor QR Meteng</h3>
        <p className="text-xs text-slate-500 mb-8">Posicione o cartão do motorista no foco da câmera.</p>
        
        <div className="flex flex-col gap-4">
          {MOCK_DRIVERS.map(d => (
            <button 
              key={d.id}
              onClick={() => onScan(d.id)}
              className="py-4 bg-slate-100 rounded-2xl text-xs font-black uppercase text-slate-600 hover:bg-blue-600 hover:text-white transition-all"
            >
              Simular Scan: {d.name}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const DriverProfileModal = ({ driver, onClose }: { driver: Driver, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white max-w-lg w-full rounded-[3rem] overflow-hidden shadow-3xl"
      >
        <div className="bg-slate-900 p-8 pb-16 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white"><X /></button>
          <div className="flex items-center gap-6">
            <img src={driver.photo} alt={driver.name} className="w-20 h-20 rounded-2xl border-2 border-white/20" referrerPolicy="no-referrer" />
            <div>
              <h3 className="text-2xl font-black">{driver.name}</h3>
              <p className="text-blue-400 text-xs font-black uppercase tracking-widest">{driver.id} • Motorista Verificado</p>
            </div>
          </div>
        </div>
        
        <div className="p-8 -mt-10 bg-white rounded-t-[3rem] space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contacto</p>
              <p className="text-sm font-bold">{driver.phone}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avaliação</p>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold">{driver.rating}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-slate-900 italic text-lg border-b pb-2">Detalhes do Veículo</h4>
            <div className="grid gap-4">
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-xs text-slate-400 font-bold uppercase">Modelo</span>
                <span className="text-sm font-black">{driver.vehicle.model}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-xs text-slate-400 font-bold uppercase">Matrícula</span>
                <span className="text-sm font-black">{driver.vehicle.plate}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-xs text-slate-400 font-bold uppercase">Cor</span>
                <span className="text-sm font-black">{driver.vehicle.color}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-xs text-slate-400 font-bold uppercase">Estado</span>
                <span className="text-sm font-black text-green-600">{driver.vehicle.condition}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-700 transition-all"
          >
            Confirmar Identidade
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const DriverRatingModal = ({ onClose }: { onClose: () => void }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [criteria, setCriteria] = useState({ puntuality: 0, care: 0, politeness: 0 });

  const renderStars = (val: number, setVal: (n: number) => void, label: string) => (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} onClick={() => setVal(s)} className="transition-transform active:scale-90">
            <Star className={`w-5 h-5 ${s <= val ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white max-w-lg w-full rounded-[3rem] p-10 text-center relative shadow-3xl"
      >
        <button onClick={onClose} className="absolute top-8 right-10 text-slate-300 hover:text-slate-900 transition-colors"><X className="w-6 h-6" /></button>
        
        <div className="bg-blue-600 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-200">
          <Truck className="w-8 h-8" />
        </div>
        
        <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter">Avaliação Moderada de Entrega</h3>
        <p className="text-sm text-slate-500 mb-10">Sua opinião ajuda-nos a manter o selo MetengElite em Luanda.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
          {renderStars(criteria.puntuality, (n) => setCriteria({...criteria, puntuality: n}), 'Pontualidade')}
          {renderStars(criteria.care, (n) => setCriteria({...criteria, care: n}), 'Cuidado')}
          {renderStars(criteria.politeness, (n) => setCriteria({...criteria, politeness: n}), 'Simpatia')}
        </div>

        <div className="flex justify-center gap-4 mb-10">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className="transition-transform"
            >
              <Star 
                className={`w-12 h-12 transition-colors duration-300 ${
                  star <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-100'
                }`} 
              />
            </button>
          ))}
        </div>
        
        <textarea 
          placeholder="Algo a destacar sobre o trajeto efectuado? (Opcional)"
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm outline-none focus:border-blue-500 mb-8 min-h-[120px] shadow-inner font-medium"
        />
        
        <button 
          onClick={() => { alert('Obrigado pelo seu feedback de elite!'); onClose(); }}
          className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-slate-300"
        >
          Finalizar Avaliação
        </button>
      </motion.div>
    </div>
  );
};

const Footer = () => (
  <footer className="py-12 bg-white border-t px-8 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex flex-col gap-4">
        <div>© {new Date().getFullYear()} MetengExpress Logística Lda.</div>
        <a 
          href={`https://${CONTACT_INFO.facebook}`} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
        >
          <Facebook className="w-4 h-4" /> Facebook
        </a>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        <a 
          href={`mailto:${CONTACT_INFO.email}`} 
          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
        >
          <Mail className="w-3 h-3" /> {CONTACT_INFO.email}
        </a>
        <a 
          href={`https://wa.me/${CONTACT_INFO.whatsapp}`} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 hover:text-green-600 transition-colors"
        >
          <MessageCircle className="w-3 h-3" /> MetengExpress
        </a>
        <a 
          href={CONTACT_INFO.mapsUrl}
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
        >
          <MapPin className="w-3 h-3" /> {CONTACT_INFO.address}
        </a>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [tab, setTab] = useState('home');
  const [initialProduct, setInitialProduct] = useState('');
  const [showRating, setShowRating] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [scannedDriverId, setScannedDriverId] = useState<string | null>(null);

  const scannedDriver = MOCK_DRIVERS.find(d => d.id === scannedDriverId);

  const renderContent = () => {
    switch (tab) {
      case 'home': return (
        <>
          <Hero onNavigate={setTab} />
          {/* Elite Identity Card Section */}
          <section className="py-24 px-8 bg-slate-50 border-y border-slate-200 overflow-hidden">
             <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
               <div className="max-w-xl text-center lg:text-left">
                  <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">Identidade Elite</h3>
                  <h2 className="text-4xl font-extrabold text-slate-900 mb-8 tracking-tighter">O Cartão MetengElite em Suas Mãos</h2>
                  <p className="text-lg text-slate-500 mb-10 leading-relaxed">
                    Cada motorista MetengExpress possui um cartão de identificação único. Na parte de trás, o QR Code permite que valide instantaneamente quem está à sua porta.
                  </p>
                  <button 
                    onClick={() => setShowScan(true)}
                    className="group bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all flex items-center gap-3 mx-auto lg:mx-0 shadow-2xl"
                  >
                    Abrir Leitor QR <Scan className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  </button>
               </div>
               <div className="relative">
                  <div className="absolute -inset-10 bg-blue-600/5 rounded-full blur-3xl"></div>
                  <DriverIDCard driver={MOCK_DRIVERS[0]} />
               </div>
             </div>
          </section>
          <Feedback onShowRating={() => setShowRating(true)} />
          <CollectionTypes />
          <Services onSelectProduct={(p) => { setInitialProduct(p); setTab('request'); }} />
          <CourseSection />
        </>
      );
      case 'history': return <OrderHistory />;
      case 'cursos': return <CourseSection />;
      case 'services': return <Services onSelectProduct={(p) => { setInitialProduct(p); setTab('request'); }} />;
      case 'pricing': return <Pricing onNavigate={setTab} onSelectProduct={setInitialProduct} />;
      case 'track': return <Tracking />;
      case 'request': return <RequestDelivery preselectedProduct={initialProduct} onResetProduct={() => setInitialProduct('')} />;
      case 'careers': return <Careers />;
      case 'contact': return <Contact />;
      default: return (
        <>
          <Hero onNavigate={setTab} />
          <Feedback onShowRating={() => setShowRating(true)} />
        </>
      );
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Navbar onNavigate={setTab} currentTab={tab} />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      <ChatSupport />

      <AnimatePresence>
        {showRating && <DriverRatingModal onClose={() => setShowRating(false)} />}
        {showScan && <QRScanModal onScan={(id) => { setScannedDriverId(id); setShowScan(false); }} onClose={() => setShowScan(false)} />}
        {scannedDriver && <DriverProfileModal driver={scannedDriver} onClose={() => setScannedDriverId(null)} />}
      </AnimatePresence>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 group"
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute right-full mr-4 bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-100 pointer-events-none mb-2">
          Contacte-nos agora!
        </span>
      </a>
    </div>
  );
}
