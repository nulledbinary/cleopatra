'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [evacuations, setEvacuations] = useState<any[]>([]);
  const [atmosData, setAtmosData] = useState<any[]>([]);
  const [jarvisActive, setJarvisActive] = useState(false);

  useEffect(() => {
    // Fetch stats from Rust backend
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
    
    // Attempt fetch every 10s if active
    if (jarvisActive) {
      fetchStats();
      const interval = setInterval(fetchStats, 10000);
      return () => clearInterval(interval);
    }
  }, [jarvisActive]);

  const triggerJarvis = () => {
    if (jarvisActive) return;
    
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance("Welcome home, Sir");
      msg.pitch = 0.8;
      msg.rate = 0.9;
      
      const voices = window.speechSynthesis.getVoices();
      const jarvisVoice = voices.find(v => 
        v.name.includes('Google UK English Male') || 
        v.name.includes('Daniel') || 
        v.name.includes('UK English') ||
        v.name.includes('Great Britain')
      );
      if (jarvisVoice) msg.voice = jarvisVoice;
      
      window.speechSynthesis.speak(msg);
      setJarvisActive(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-mono">
      {!jarvisActive ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <h1 className="text-4xl font-bold mb-8 text-[#d4af37] tracking-[0.2em]">CLEOPATRA OSINT</h1>
          <button 
            onClick={triggerJarvis}
            className="px-8 py-4 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all rounded-md tracking-widest text-lg shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          >
            INITIALIZE SYSTEM
          </button>
        </div>
      ) : (
        <div>
          <header className="mb-12 border-b border-[#d4af37]/30 pb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-[0.2em] text-[#d4af37]">CLEOPATRA</h1>
              <p className="text-sm text-gray-400 mt-2">HIGH-PERFORMANCE SIEM & OSINT DASHBOARD</p>
            </div>
            <div className="text-right text-xs tracking-wider">
              <p className="text-[#00e5ff] mb-1">RUST BACKEND: CONNECTED</p>
              <p className="text-[#00e676]">STATISTICAL MODULES: ONLINE</p>
            </div>
          </header>

          <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Anomaly Detection Panel */}
            <div className="bg-[#111] border border-gray-800 p-6 rounded-lg shadow-lg shadow-red-900/10 hover:border-red-900/50 transition-colors">
              <h2 className="text-xl font-semibold mb-4 text-[#ff3d3d] border-b border-[#ff3d3d]/30 pb-2">
                Flight Anomalies
              </h2>
              {anomalies.length > 0 ? (
                <ul className="space-y-4">
                  {anomalies.map((anom, i) => (
                    <li key={i} className="bg-black/50 p-3 rounded border border-red-500/20">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-red-400">{anom.callsign}</span>
                        <span className="text-[10px] px-2 py-1 bg-red-900/30 text-red-300 rounded tracking-widest">LVL {anom.severity}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">{anom.reason}</p>
                      <p className="text-[10px] text-gray-500 mt-1">Lat: {anom.lat}, Lng: {anom.lng}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No anomalies detected.</p>
              )}
            </div>

            {/* Evacuation Routing Panel */}
            <div className="bg-[#111] border border-gray-800 p-6 rounded-lg shadow-lg shadow-yellow-900/10 hover:border-yellow-900/50 transition-colors">
              <h2 className="text-xl font-semibold mb-4 text-[#ffd700] border-b border-[#ffd700]/30 pb-2">
                Evacuation Routes
              </h2>
              {evacuations.length > 0 ? (
                <ul className="space-y-4">
                  {evacuations.map((evac, i) => (
                    <li key={i} className="bg-black/50 p-3 rounded border border-yellow-500/20">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-yellow-400">{evac.name}</span>
                        <span className="text-[10px] tracking-widest text-yellow-600">{evac.risk_level}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-2">Safe Zones: {evac.safe_zones.length} points mapped</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No active evacuation routes.</p>
              )}
            </div>

            {/* Atmospheric Panel */}
            <div className="bg-[#111] border border-gray-800 p-6 rounded-lg shadow-lg shadow-blue-900/10 hover:border-blue-900/50 transition-colors">
              <h2 className="text-xl font-semibold mb-4 text-[#00e5ff] border-b border-[#00e5ff]/30 pb-2">
                Atmospheric Intel
              </h2>
              {atmosData.length > 0 ? (
                <ul className="space-y-4">
                  {atmosData.map((data, i) => (
                    <li key={i} className="bg-black/50 p-3 rounded border border-blue-500/20">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-400">{data.pressure_hpa} hPa</span>
                        <span className="text-[10px] font-bold tracking-widest text-blue-300 bg-blue-900/30 px-2 py-1 rounded">{data.trend}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-2">Location: {data.lat}, {data.lng}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Awaiting atmospheric data.</p>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
