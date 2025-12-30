
import { StepInfo } from './types';

export const STEPS: Record<string, StepInfo[]> = {
  moving_to_reverse: [
    { title: "启动阶段", desc: "1DQJ励磁，切断表示电路。2DQJ转极，接通反位启动电路。" },
    { title: "解锁阶段", desc: "油泵启动产生液压，锁闭杆回缩，完成转辙机解锁。" },
    { title: "转换阶段", desc: "高压油推动动作油缸，带动尖轨从定位向反位移动。" },
    { title: "锁闭与表示", desc: "尖轨到达反位，锁闭杆伸出完成锁闭。FBJ励磁，给出反位表示。" }
  ],
  moving_to_normal: [
    { title: "启动阶段", desc: "1DQJ励磁，切断表示电路。2DQJ转极，接通定位启动电路。" },
    { title: "解锁阶段", desc: "油泵反向运转或换向阀动作，锁闭杆解锁。" },
    { title: "转换阶段", desc: "液压驱动尖轨向定位方向转换。" },
    { title: "锁闭与表示", desc: "尖轨归位，机械锁闭。DBJ励磁，给出定位表示。" }
  ]
};

export const CIRCUIT_NODES = {
  normal: [
    { id: '1DQJ', name: '1DQJ (初级启动)', connected: false, type: 'relay' },
    { id: '2DQJ', name: '2DQJ (极性保持)', connected: true, type: 'relay' },
    { id: 'DBJ', name: 'DBJ (定位表示)', connected: true, type: 'relay' },
    { id: 'FBJ', name: 'FBJ (反位表示)', connected: false, type: 'relay' },
  ],
  reverse: [
    { id: '1DQJ', name: '1DQJ (初级启动)', connected: false, type: 'relay' },
    { id: '2DQJ', name: '2DQJ (极性保持)', connected: true, type: 'relay' },
    { id: 'DBJ', name: 'DBJ (定位表示)', connected: false, type: 'relay' },
    { id: 'FBJ', name: 'FBJ (反位表示)', connected: true, type: 'relay' },
  ],
  transition: [
    { id: '1DQJ', name: '1DQJ (初级启动)', connected: true, type: 'relay' },
    { id: '2DQJ', name: '2DQJ (极性保持)', connected: true, type: 'relay' },
    { id: 'DBJ', name: 'DBJ (定位表示)', connected: false, type: 'relay' },
    { id: 'FBJ', name: 'FBJ (反位表示)', connected: false, type: 'relay' },
  ]
};
