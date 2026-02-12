
import React, { useState } from 'react';
import { AppState, AnalysisResult as AnalysisResultType } from './types';
import { analyzeTradingBehavior } from './services/geminiService';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import AnalysisResult from './components/AnalysisResult';
import LoadingOverlay from './components/LoadingOverlay';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    isAnalyzing: false,
    image: null,
    result: null,
    error: null,
  });

  const handleImageSelect = async (base64: string) => {
    setState(prev => ({ ...prev, isAnalyzing: true, image: base64, error: null }));
    
    try {
      const result = await analyzeTradingBehavior(base64);
      setState(prev => ({ ...prev, isAnalyzing: false, result }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        error: err.message || "未知错误，可能是行情太惨烈导致断网了。" 
      }));
    }
  };

  const reset = () => {
    setState({
      isAnalyzing: false,
      image: null,
      result: null,
      error: null,
    });
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-red-500/30">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl relative z-10">
        {!state.image && !state.isAnalyzing && (
          <div className="animate-in fade-in duration-1000">
            <div className="mb-12 text-center">
              <span className="text-xs font-black tracking-widest text-blue-500 uppercase bg-blue-500/10 px-4 py-2 rounded-full mb-6 inline-block border border-blue-500/20">
                Professional Roast Engine v1.0
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                每个韭菜，<br className="md:hidden" />都需要一次灵魂的拷问。
              </h2>
            </div>
            <FileUploader onImageSelect={handleImageSelect} disabled={state.isAnalyzing} />
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md">
                <h4 className="font-bold text-red-400 mb-1">精准打击</h4>
                <p className="text-xs text-slate-400">识别各种心理偏差、追涨、频繁交易等散户通病。</p>
              </div>
              <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md">
                <h4 className="font-bold text-blue-400 mb-1">毒舌回复</h4>
                <p className="text-xs text-slate-400">不温不火不是我们的风格，我们要的是让你破防。</p>
              </div>
              <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md">
                <h4 className="font-bold text-slate-300 mb-1">隐私安全</h4>
                <p className="text-xs text-slate-400">图片仅供AI鉴定，我们甚至不想保存你的亏损记录。</p>
              </div>
            </div>
          </div>
        )}

        {state.isAnalyzing && (
          <div className="max-w-xl mx-auto">
            <LoadingOverlay />
          </div>
        )}

        {state.error && (
          <div className="max-w-xl mx-auto text-center p-8 glass-panel rounded-3xl border-red-500/50">
            <div className="text-red-500 mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">出错了！</h3>
            <p className="text-slate-400 mb-6">{state.error}</p>
            <button 
              onClick={reset}
              className="px-6 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
            >
              换一张图试试
            </button>
          </div>
        )}

        {state.result && state.image && !state.isAnalyzing && (
          <AnalysisResult 
            data={state.result} 
            image={state.image} 
            onReset={reset} 
          />
        )}
      </main>

      <footer className="py-8 text-center text-slate-600 text-xs tracking-widest border-t border-white/5 mt-auto relative z-10 bg-black/20 backdrop-blur-sm">
        &copy; 2024 复盘侠 TRADING LAB. 版权没有，翻录不究，反正是为了扎心。
      </footer>
    </div>
  );
};

export default App;
