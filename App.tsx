
import React, { useState, useEffect, useRef } from 'react';
import { MachineState, ChatMessage } from './types';
import { STEPS, CIRCUIT_NODES } from './constants';
import TurnoutSVG from './components/TurnoutSVG';
import AIChat from './components/AIChat';

const App: React.FC = () => {
  const [state, setState] = useState<MachineState>('normal');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const handleOperate = (target: 'normal' | 'reverse') => {
    if (state === target || state.includes('moving')) return;

    const newState = target === 'reverse' ? 'moving_to_reverse' : 'moving_to_normal';
    setState(newState);
    setProgress(0);
    setCurrentStep(0);

    let p = 0;
    const interval = setInterval(() => {
      p += 1;
      setProgress(p);
      const stepIdx = Math.min(Math.floor((p / 100) * 4), 3);
      setCurrentStep(stepIdx);
      
      if (p >= 100) {
        clearInterval(interval);
        setState(target);
      }
    }, 40);
  };

  const getActiveNodes = () => {
    if (state === 'normal') return CIRCUIT_NODES.normal;
    if (state === 'reverse') return CIRCUIT_NODES.reverse;
    return CIRCUIT_NODES.transition;
  };

  const activeSteps = state.includes('moving') ? STEPS[state] : (state === 'normal' ? STEPS.moving_to_normal : STEPS.moving_to_reverse);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0b0f1a] text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="px-8 py-5 border-b border-slate-800 flex justify-between items-center shrink-0 bg-[#0f172a]/80 backdrop-blur-md z-10 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-6 h-6">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">ZYJ7 电液转辙机仿真教学平台</h1>
            <p className="text-xs text-slate-500 font-medium">Railway Turnout Simulation v2.1 (Realistic Logic)</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleOperate('normal')}
            disabled={state.includes('moving')}
            className={`px-6 py-2.5 rounded-xl transition-all font-bold text-sm flex items-center gap-2 ${state === 'normal' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'}`}
          >
            <div className={`w-2 h-2 rounded-full ${state === 'normal' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></div>
            定位 (Normal)
          </button>
          <button 
            onClick={() => handleOperate('reverse')}
            disabled={state.includes('moving')}
            className={`px-6 py-2.5 rounded-xl transition-all font-bold text-sm flex items-center gap-2 ${state === 'reverse' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'}`}
          >
            <div className={`w-2 h-2 rounded-full ${state === 'reverse' ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`}></div>
            反位 (Reverse)
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden p-6 gap-6">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex-1 bg-[#131a2b] rounded-3xl border border-slate-800/60 relative overflow-hidden flex flex-col p-8 shadow-inner">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">机械状态实时仿真</h2>
                <p className="text-lg font-bold text-slate-200">
                  {state === 'normal' ? '定位密贴 (Locked)' : state === 'reverse' ? '反位密贴 (Locked)' : '转换动作中...'}
                </p>
              </div>
              <div className="bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${state.includes('moving') ? 'bg-blue-400 animate-ping' : 'bg-green-500'}`}></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Machine {state.includes('moving') ? 'Active' : 'Standby'}</span>
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center min-h-0">
              <TurnoutSVG state={state} progress={progress} />
            </div>
            
            {state.includes('moving') && (
              <div className="absolute bottom-10 left-10 right-10 space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                  <span>Converting</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/30">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(59,130,246,0.6)]" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="h-44 bg-[#131a2b] rounded-3xl border border-slate-800/60 p-6 flex flex-col shadow-inner">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-5">继电器节点监控</h2>
            <div className="flex-1 grid grid-cols-4 gap-6">
              {getActiveNodes().map(node => (
                <div key={node.id} className={`group relative p-4 rounded-2xl border transition-all duration-500 flex flex-col justify-center items-center gap-3 ${node.connected ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-400' : 'bg-slate-900/30 border-slate-800 text-slate-600'}`}>
                  {node.connected && (
                    <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  )}
                  <div className={`w-3 h-3 rounded-full transition-all duration-500 ${node.connected ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)] scale-110' : 'bg-slate-700'}`}></div>
                  <span className="text-xs font-black tracking-wide uppercase">{node.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-[420px] flex flex-col gap-6 shrink-0">
          <div className="bg-[#131a2b] rounded-3xl border border-slate-800/60 p-8 shadow-inner">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">转换流程详解</h2>
            <div className="space-y-6">
              {activeSteps.map((step, idx) => (
                <div 
                  key={idx} 
                  className={`group relative pl-8 py-1 transition-all duration-500 ${idx === currentStep && state.includes('moving') ? 'opacity-100 translate-x-2' : 'opacity-30 translate-x-0'}`}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full transition-all duration-500 ${idx === currentStep && state.includes('moving') ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-800'}`}></div>
                  <div className="text-sm font-black text-slate-100 uppercase tracking-tight">{step.title}</div>
                  <div className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 min-h-0">
            <AIChat />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
