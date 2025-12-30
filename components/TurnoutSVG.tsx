
import React from 'react';
import { MachineState } from '../types';

interface Props {
  state: MachineState;
  progress: number;
}

const TurnoutSVG: React.FC<Props> = ({ state, progress }) => {
  // 逻辑：
  // 定位（Normal）：上方尖轨密贴基本轨，下方尖轨斥离。
  // 反位（Reverse）：下方尖轨密贴基本轨，上方尖轨斥离。
  // 转换行程设定为 50 像素。
  
  let displacement = 0; // 0 代表定位
  if (state === 'normal') displacement = 0;
  else if (state === 'reverse') displacement = 50;
  else if (state === 'moving_to_reverse') displacement = (progress / 100) * 50;
  else if (state === 'moving_to_normal') displacement = 50 - (progress / 100) * 50;

  // 轨道 Y 坐标定义
  const topStockY = 150;
  const bottomStockY = 350;
  const railWidth = 12;
  const gap = 50; // 斥离值

  return (
    <svg viewBox="0 0 800 600" className="w-full h-full drop-shadow-2xl select-none" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="railGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="machineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 道床与轨枕 */}
      <g id="track-bed">
        {[...Array(16)].map((_, i) => (
          <rect key={i} x={40 + i * 45} y="100" width="22" height="300" fill="#262626" rx="2" />
        ))}
      </g>

      {/* 基本轨 (Stock Rails) - 静态 */}
      <g id="stock-rails">
        {/* 上基本轨 */}
        <rect x="20" y={topStockY - 6} width="760" height={railWidth} fill="url(#railGrad)" rx="1" />
        {/* 下基本轨 */}
        <rect x="20" y={bottomStockY - 6} width="760" height={railWidth} fill="url(#railGrad)" rx="1" />
      </g>

      {/* 尖轨 (Switch Rails) - 动态转换 */}
      <g id="switch-rails">
        {/* 上尖轨: 尖端在左(x=100)，跟端在右(x=700)。定位时贴紧 topStockY，反位时下移 gap */}
        <path 
          d={`M 100 ${topStockY + displacement} L 700 ${topStockY + 30}`} 
          stroke="url(#railGrad)" 
          strokeWidth="10" 
          fill="none" 
          strokeLinecap="round"
          className="transition-all duration-75 ease-linear"
        />
        {/* 下尖轨: 尖端在左(x=100)，反位时贴紧 bottomStockY，定位时上移 gap */}
        <path 
          d={`M 100 ${bottomStockY - (gap - displacement)} L 700 ${bottomStockY - 30}`} 
          stroke="url(#railGrad)" 
          strokeWidth="10" 
          fill="none" 
          strokeLinecap="round"
          className="transition-all duration-75 ease-linear"
        />

        {/* 第一连接杆 (First Connecting Rod) - 位于尖轨尖端附近，连接两尖轨 */}
        <rect 
          x="120" 
          y={topStockY + displacement + 5} 
          width="8" 
          height={bottomStockY - (gap - displacement) - (topStockY + displacement) - 10} 
          fill="#475569" 
          rx="2" 
          className="transition-all duration-75 ease-linear"
        />
      </g>

      {/* ZYJ7 转辙机本体 - 放置在道岔侧面 (下方) */}
      <g id="zyj7-machine-box" transform="translate(100, 420)">
        {/* 基座 */}
        <rect x="0" y="0" width="200" height="140" fill="#0f172a" rx="6" stroke="#334155" strokeWidth="2" />
        <rect x="10" y="10" width="180" height="120" fill="url(#machineGrad)" rx="4" />
        
        {/* 内部机芯示意 */}
        <rect x="30" y="30" width="140" height="80" fill="#1e293b" rx="2" />
        <circle cx="100" cy="70" r="20" fill="#0f172a" stroke="#475569" strokeWidth="1" />
        <text x="100" y="125" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">ZYJ7-A HOST</text>

        {/* 动作杆 (Action Rod) - 从机箱垂直伸向连接杆 */}
        <g id="action-rod-logic">
          {/* 固定套管 */}
          <rect x="50" y="-20" width="15" height="40" fill="#475569" />
          {/* 伸缩动作杆 - 连接点在 x=124 左右（对应连接杆） */}
          <rect 
            x="54" 
            y={bottomStockY - (gap - displacement) - 415} 
            width="7" 
            height={420 - (bottomStockY - (gap - displacement))} 
            fill="#cbd5e1" 
            className="transition-all duration-75 ease-linear"
          />
          {/* 垂直连接轴 */}
          <line 
            x1="57" y1="-10" 
            x2="57" y2={bottomStockY - (gap - displacement) - 420} 
            stroke="#94a3b8" 
            strokeWidth="6" 
            strokeLinecap="round"
          />
        </g>

        {/* 表示杆 (Indication Rod) - 监测尖轨位置 */}
        <g id="indication-rod-logic">
          <rect x="130" y="-15" width="10" height="30" fill="#334155" />
          <line 
            x1="135" y1="0" 
            x2="135" y2={bottomStockY - (gap - displacement) - 420} 
            stroke="#64748b" 
            strokeWidth="3" 
            strokeDasharray="4,2"
          />
          <circle 
            cx="135" 
            cy={bottomStockY - (gap - displacement) - 420} 
            r="4" 
            fill={state.includes('moving') ? "#ef4444" : "#10b981"} 
            filter="url(#glow)"
          />
        </g>
      </g>

      {/* 动态液压管路示意 */}
      <g id="hydraulic-lines" transform="translate(100, 420)">
        <path d="M 180 70 Q 220 70 220 -20" stroke="#1e293b" strokeWidth="4" fill="none" />
        {state.includes('moving') && (
          <circle r="3" fill="#3b82f6">
            <animateMotion dur="0.8s" repeatCount="indefinite" path="M 180 70 Q 220 70 220 -20" />
          </circle>
        )}
      </g>

      {/* 标注文字 */}
      <g fontSize="12" fontWeight="bold" fill="#64748b" pointerEvents="none">
        <text x="350" y="140">基本轨 (Stock Rail)</text>
        <text x="350" y="375">基本轨 (Stock Rail)</text>
        <text x="140" y={topStockY + displacement - 10} fill="#94a3b8" className="transition-all duration-75">尖轨 (Switch Rail)</text>
        <text x="140" y={bottomStockY - (gap - displacement) + 25} fill="#94a3b8" className="transition-all duration-75">尖轨 (Switch Rail)</text>
        
        <text x="310" y="460">转辙机动作杆 (Drive Rod)</text>
        <text x="310" y="490">位置表示杆 (Indication Rod)</text>
        <text x="310" y="520">第一连接杆 (1st Tie Rod)</text>
      </g>

      {/* 方向箭头 */}
      <path d="M 30 250 L 70 250 M 60 240 L 70 250 L 60 260" stroke="#475569" strokeWidth="2" fill="none" />
      <text x="30" y="235" fontSize="10" fill="#475569">行车方向</text>
    </svg>
  );
};

export default TurnoutSVG;
