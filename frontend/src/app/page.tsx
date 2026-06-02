'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TacticalMap from '@/components/TacticalMap';
import InitializationSequence from '@/components/InitializationSequence';
import { Activity, Shield, Wind, Navigation, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [evacuations, setEvacuations] = useState<any[]>([]);
  const [atmosData, setAtmosData] = useState<any[]>([]);
  const [jarvisActive, setJarvisActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [anomRes, evacRes, atmosRes] = await Promise.all([
          fetch('http://localhost:8080/api/stats/anomalies'),
          fetch('http://localhost:8080/api/evacuation'),
          fetch('http://localhost:8080/api/atmospheric')
        ]);
        
        if (anomRes.ok) setAnomalies(await anomRes.json());
        if (evacRes.ok) setEvacuations(await evacRes.json());
        if (atmosRes.ok) setAtmosData(await atmosRes.json());
      } catch (err) {
        console.error("Failed to connect to Rust backend", err);
      }
    };
    
    if (jarvisActive) {
      fetchStats();
      const interval = setInterval(fetchStats, 10000);
      return () => clearInterval(interval);
    }
  }, [jarvisActive]);

  const handleInitComplete = () => {
    setIsInitializing(false);
    setJarvisActive(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono selection:bg-[#d4af37] selection:text-black">
      <AnimatePresence>
        {isInitializing && (
          <InitializationSequence onComplete={handleInitComplete} />
        )}
      </AnimatePresence>

      {!jarvisActive && !isInitializing ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1a1a] to-[#0a0a0a]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold mb-4 text-[#d4af37] tracking-[0.5em] drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              CLEOPATRA
            </h1>
            <p className="text-[#d4af37]/40 tracking-[0.3em] mb-12 text-sm uppercase">Advanced SIEM & OSINT Platform</p>
            
            <button 
              onClick={() => setIsInitializing(true)}
              className="group relative px-12 py-5 overflow-hidden border border-[#d4af37] text-[#d4af37] transition-all rounded-sm hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]"
            >
              <div className="absolute inset-0 bg-[#d4af37] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 font-bold tracking-[0.2em] group-hover:text-black">INITIALIZE SYSTEM</span>
            </button>
          </motion.div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 h-screen flex flex-col"
        >
          {/* Tactical Header */}
          <header className="flex justify-between items-center mb-4 border-b border-[#d4af37]/20 pb-4 bg-[#111]/50 p-4 rounded-t-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#d4af37] rounded-sm flex items-center justify-center text-black font-bold text-xl shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                C
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-[0.2em] text-[#d4af37]">CLEOPATRA OSINT</h1>
                <div className="flex gap-4 mt-1 text-[10px] tracking-widest text-[#d4af37]/60 uppercase">
                  <span className="flex items-center gap-1"><Shield size={10} /> Secure</span>
                  <span className="flex items-center gap-1 text-[#00e5ff]"><Activity size={10} /> Active Scanning</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 text-[10px] tracking-widest font-bold">
              <div className="text-right">
                <p className="text-gray-500 mb-1">DATA INGESTION</p>
                <p className="text-[#00e676]">NOMINAL / 1.2 GBPS</p>
              </div>
              <div className="text-right border-l border-white/10 pl-8">
                <p className="text-gray-500 mb-1">SYSTEM UPTIME</p>
                <p className="text-[#d4af37]">0.02:14:55</p>
              </div>
            </div>
          </header>

          <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden mb-4">
            {/* Left Sidebar: Statistics & Alerts */}
            <div className="col-span-3 flex flex-col gap-4 overflow-y-auto pr-2">
              {/* Anomalies Panel */}
              <Panel title="Anomalies" icon={AlertTriangle} color="#ff3d3d">
                {anomalies.map((anom, i) => (
                  <div key={i} className="mb-3 p-3 bg-red-950/20 border border-red-500/20 rounded-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-red-400 text-xs">{anom.callsign}</span>
                      <span className="text-[9px] px-1 bg-red-900/40 rounded">CRITICAL</span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-tight">{anom.reason}</p>
                  </div>
                ))}
              </Panel>

              {/* Evacuation Panel */}
              <Panel title="Corridors" icon={Navigation} color="#ffd700">
                {evacuations.map((evac, i) => (
                  <div key={i} className="mb-3 p-3 bg-yellow-950/20 border border-yellow-500/20 rounded-sm">
                    <span className="font-bold text-yellow-400 text-xs block mb-1">{evac.name}</span>
                    <p className="text-[9px] text-gray-400">Risk: <span className="text-yellow-200">{evac.risk_level}</span></p>
                  </div>
                ))}
              </Panel>
            </div>

            {/* Center: Tactical Map */}
            <div className="col-span-6 relative">
              <TacticalMap anomalies={anomalies} zoom={5} center={[120.9842, 14.5995]} />
              
              {/* Overlay HUD elements */}
              <div className="absolute top-4 left-4 pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md border border-[#d4af37]/30 p-2 rounded-sm">
                  <p className="text-[9px] text-[#d4af37] font-bold tracking-[0.2em] mb-1 uppercase">Tactical Sector 7G</p>
                  <div className="flex items-center gap-4 text-[10px]">
                    <span className="text-blue-400">14.5995° N</span>
                    <span className="text-blue-400">120.9842° E</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar: Atmospheric & SIEM Logs */}
            <div className="col-span-3 flex flex-col gap-4 overflow-y-auto pl-2">
               <Panel title="Atmospheric" icon={Wind} color="#00e5ff">
                {atmosData.map((data, i) => (
                  <div key={i} className="mb-3 p-3 bg-blue-950/20 border border-blue-500/20 rounded-sm flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-blue-400">{data.pressure_hpa} hPa</p>
                      <p className="text-[9px] text-gray-500">{data.lat}, {data.lng}</p>
                    </div>
                    <span className="text-[9px] font-bold text-blue-300">{data.trend}</span>
                  </div>
                ))}
              </Panel>

              <Panel title="System Logs" icon={Activity} color="#00e676">
                <div className="space-y-2 font-mono text-[9px] text-gray-500">
                  <p><span className="text-gray-700">[22:45:01]</span> SIG_INGEST_SYNC_COMPLETE</p>
                  <p><span className="text-gray-700">[22:45:12]</span> ANOMALY_DETECTION_PASS_SUCCESS</p>
                  <p><span className="text-gray-700">[22:45:30]</span> REFRESHING_ATMOS_VECTORS</p>
                  <p className="text-green-900 animate-pulse">_ LISTENING_FOR_PULSE...</p>
                </div>
              </Panel>
            </div>
          </div>

          {/* Tactical Footer */}
          <footer className="h-8 border-t border-white/5 flex items-center justify-between px-4 text-[9px] text-gray-600 tracking-widest uppercase">
            <span>Cleopatra v0.4.4-stable</span>
            <div className="flex gap-6">
              <span>LATENCY: 12ms</span>
              <span className="text-green-900 font-bold">● ONLINE</span>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
  );
}

function Panel({ title, icon: Icon, color, children }: { title: string, icon: any, color: string, children: React.ReactNode }) {
  return (
    <div className="bg-[#111]/80 backdrop-blur-sm border border-white/5 rounded-lg overflow-hidden flex flex-col">
      <div className="p-3 border-b border-white/5 flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-2">
          <Icon size={14} style={{ color }} />
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color }}>{title}</h2>
        </div>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="w-1 h-1 rounded-full bg-white/20" />
        </div>
      </div>
      <div className="p-4 flex-1">
        {children}
      </div>
    </div>
  );
}
