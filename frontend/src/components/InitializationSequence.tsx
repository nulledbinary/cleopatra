'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Radio, Activity, Globe, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InitializationSequenceProps {
  onComplete: () => void;
}

const steps = [
  { id: 'auth', label: 'Hardware Handshake', icon: Shield, message: 'Cleopatra System Initializing. Securing local environment.' },
  { id: 'ingestion', label: 'Reactive Ingestion', icon: Radio, message: 'Connecting to Intelligence Feeds. ADSB, AIS, and USGS links active.' },
  { id: 'stats', label: 'Statistical Hub', icon: Activity, message: 'Statistical Modeling engines online. Anomaly detection calibrated.' },
  { id: 'global', label: 'Global Intelligence', icon: Globe, message: 'Global Intelligence Sync complete. Mapping tactical sectors.' },
];

export default function InitializationSequence({ onComplete }: InitializationSequenceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const speak = (text: string) => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.pitch = 0.85;
        msg.rate = 0.95;
        const voices = window.speechSynthesis.getVoices();
        const jarvisVoice = voices.find(v => 
          v.name.includes('Google UK English Male') || 
          v.name.includes('Daniel') || 
          v.name.includes('UK English')
        );
        if (jarvisVoice) msg.voice = jarvisVoice;
        window.speechSynthesis.speak(msg);
      }
    };

    const runSequence = async () => {
      // Small delay to let voices load
      await new Promise(r => setTimeout(r, 500));

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        speak(steps[i].message);
        await new Promise(r => setTimeout(r, 2500));
        setCompleted(prev => [...prev, steps[i].id]);
      }

      speak("All systems nominal. Welcome home, Sir.");
      await new Promise(r => setTimeout(r, 2000));
      onComplete();
    };

    runSequence();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="text-center mb-12">
          <motion.h1 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl font-bold tracking-[0.4em] text-[#d4af37] mb-2"
          >
            CLEOPATRA
          </motion.h1>
          <p className="text-[#d4af37]/60 text-xs tracking-widest uppercase">System Initialization in Progress</p>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCurrent = currentStep === index;
            const isCompleted = completed.includes(step.id);

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: index <= currentStep ? 1 : 0.3,
                  x: 0,
                  scale: isCurrent ? 1.02 : 1
                }}
                className={cn(
                  "flex items-center gap-6 p-4 border rounded-lg transition-colors",
                  isCurrent ? "border-[#d4af37] bg-[#d4af37]/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]" : "border-white/5",
                  isCompleted ? "border-[#00e676]/30 bg-[#00e676]/5" : ""
                )}
              >
                <div className={cn(
                  "p-3 rounded-md",
                  isCurrent ? "bg-[#d4af37] text-black" : "bg-white/5 text-[#d4af37]/60",
                  isCompleted ? "bg-[#00e676] text-black" : ""
                )}>
                  <Icon size={24} />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold tracking-widest text-sm">{step.label}</span>
                    {isCompleted && <CheckCircle2 size={16} className="text-[#00e676]" />}
                    {isCurrent && (
                      <motion.div 
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-[10px] text-[#d4af37] font-bold"
                      >
                        SCANNING...
                      </motion.div>
                    )}
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? "100%" : isCurrent ? "60%" : "0%" }}
                      transition={{ duration: 2 }}
                      className={cn(
                        "h-full",
                        isCompleted ? "bg-[#00e676]" : "bg-[#d4af37]"
                      )}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Global Handshake Visualization (Map Placeholder) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: currentStep >= 3 ? 1 : 0 }}
          className="mt-12 aspect-video border border-[#d4af37]/20 rounded-lg bg-black/40 relative overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center">
             <Globe size={64} className="text-[#d4af37]/20 animate-pulse" />
          </div>
          {/* Add a scan line effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-full h-1/2 bg-gradient-to-b from-transparent via-[#d4af37]/10 to-transparent"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
