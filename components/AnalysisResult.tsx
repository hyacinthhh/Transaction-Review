
import React, { useState } from 'react';
import { AnalysisResult as AnalysisResultType } from '../types';

interface Props {
  data: AnalysisResultType;
  image: string;
  onReset: () => void;
}

const AnalysisResult: React.FC<Props> = ({ data, image, onReset }) => {
  const [copied, setCopied] = useState(false);

  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-blue-400';
    if (score > 50) return 'text-yellow-400';
    return 'text-red-500';
  };

  const handleShare = async () => {
    const shareText = `【复盘侠·交易行为鉴定】\n我的交易段位：${data.title}\n得分：${data.score}\n老兵点评：${data.roast}\n#股市复盘 #韭菜鉴定`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '复盘侠交易鉴定报告',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText + "\n" + window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        alert('分享失败，请手动截图。');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Summary Card */}
      <div className="glass-panel rounded-3xl overflow-hidden relative">
        <div className="p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="relative shrink-0">
            <div className={`text-6xl font-black ${getScoreColor(data.score)}`}>
              {data.score}
            </div>
            <div className="text-xs text-slate-500 text-center uppercase tracking-widest font-bold">交易分</div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
              鉴定结果
            </div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
              {data.title}
            </h2>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {data.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-lg border border-white/5">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* The Roast Box */}
        <div className="bg-red-500/5 border-t border-red-500/10 p-8">
          <div className="text-red-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3L14.017 3C14.017 1.89543 14.9124 1 16.017 1H19.017C21.2261 1 23.017 2.79086 23.017 5V15C23.017 17.2091 21.2261 19 19.017 19H17.017L14.017 21ZM1 21L1 18C1 16.8954 1.89543 16 3 16H6C6.55228 16 7 15.5523 7 15V9C7 8.44772 6.55228 8 6 8H3C1.89543 8 1 7.10457 1 6V3L1 3C1 1.89543 1.89543 1 3 1H6C8.20914 1 10 2.79086 10 5V15C10 17.2091 8.20914 19 6 19H4L1 21Z" />
            </svg>
          </div>
          <p className="text-xl md:text-2xl font-medium text-slate-200 leading-relaxed italic">
            "{data.roast}"
          </p>
        </div>
      </div>

      {/* Analysis Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel p-8 rounded-3xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
            痛点剖析
          </h3>
          <div className="space-y-6">
            {data.behaviorAnalysis.map((item, idx) => (
              <div key={idx} className="group">
                <div className="text-red-400 font-bold mb-1 flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 border border-red-500/30 rounded uppercase">Issue {idx + 1}</span>
                  {item.point}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-3xl bg-blue-500/5">
            <h3 className="text-lg font-bold text-white mb-4">老兵的临终关怀（建议）</h3>
            <p className="text-blue-400 font-medium italic text-lg leading-relaxed">
              "{data.suggestion}"
            </p>
          </div>
          
          <div className="rounded-3xl overflow-hidden h-48 relative border border-white/10">
            <img src={image} alt="Original Record" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent flex items-end p-4">
              <span className="text-xs font-bold text-slate-500 uppercase">源数据归档</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pb-12">
        <button 
          onClick={onReset}
          className="w-full sm:w-auto px-8 py-4 bg-white text-slate-950 font-black rounded-2xl hover:bg-slate-200 transition-all transform hover:scale-105 active:scale-95 shadow-xl"
        >
          我不服，再来一发
        </button>
        <button 
          onClick={handleShare}
          className={`w-full sm:w-auto px-8 py-4 ${copied ? 'bg-green-600' : 'bg-blue-600'} text-white font-black rounded-2xl hover:opacity-90 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {copied ? '已复制！' : '分享扎心报告'}
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;
