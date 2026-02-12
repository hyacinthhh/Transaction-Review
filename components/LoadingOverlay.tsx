
import React, { useState, useEffect } from 'react';

const LoadingOverlay: React.FC = () => {
  const [msgIdx, setMsgIdx] = useState(0);
  const messages = [
    "正在扫描你的反向操作...",
    "正在计算你为券商贡献的佣金...",
    "正在分析你高位站岗的英姿...",
    "正在识别你的'满仓踏空'基因...",
    "正在联系心理医生（划掉）AI大模型...",
    "别急，你的亏损很精彩，AI需要时间消化..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center p-20 glass-panel rounded-3xl border-red-500/20">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-red-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-red-500 font-black animate-pulse">ROI</span>
        </div>
      </div>
      <p className="text-xl font-bold text-white mb-2 animate-bounce">
        鉴定中...
      </p>
      <p className="text-slate-400 text-sm italic transition-all duration-500 h-6">
        {messages[msgIdx]}
      </p>
    </div>
  );
};

export default LoadingOverlay;
