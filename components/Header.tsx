
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 px-4 text-center border-b border-white/10">
      <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter">
        <span className="text-red-500">复盘</span>
        <span className="text-blue-500">侠</span>
      </h1>
      <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
        上传交易截图，让AI老兵撕下你的伪装。
        <span className="block mt-1 font-medium text-red-400/80 italic">温馨提示：心脏脆弱者请立即关闭。</span>
      </p>
    </header>
  );
};

export default Header;
