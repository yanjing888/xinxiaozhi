import {
  Code2,
  Cpu,
  Bug,
  Terminal,
  Zap,
  BookOpen,
  Layers,
  type LucideIcon,
} from 'lucide-react'

export interface QuickChip {
  label: string
  prompt: string
}

export interface ReferenceItem {
  rank: number
  title: string
  prompt: string
}

export interface ToolItem {
  id: string
  icon: LucideIcon
  title: string
  description: string
  prompt: string
}

/** 对话输入框上方的快捷 chips */
export const quickChips: QuickChip[] = [
  {
    label: 'ADDI 执行流程',
    prompt: '请讲解 addi 指令在 RISC-V 单周期 CPU 中的执行流程，包括取指、译码、立即数扩展、ALU 运算和写回。',
  },
  {
    label: '3-8 译码器',
    prompt: '请为孪生平台生成 Lab2 风格的 3-8 译码器 student_top.sv，说明 virtual_sw 与 virtual_led 的 I/O 映射。',
  },
  {
    label: 'student_top 接口',
    prompt: '请说明孪生平台 student_top 的标准接口，以及 virtual_sw、virtual_key、virtual_led、virtual_seg 各自的用途和连接规则。',
  },
  {
    label: 'MMIO 地址',
    prompt: '请讲解 RISC-V 上板 MMIO 地址映射（SW、KEY、LED、数码管），并说明与 RARS 调试地址的区别。',
  },
  {
    label: '电子钟设计',
    prompt: '请为孪生平台生成电子钟 student_top.sv，包含时/分/秒计数、调时调分按键和 virtual_seg 数码管显示。',
  },
]

/** 首页左侧：热门问题（完整可发送的问题） */
export const referenceItems: ReferenceItem[] = [
  {
    rank: 1,
    title: 'ADDI 在单周期 CPU 中怎么执行',
    prompt:
      '请讲解 addi 指令在 RISC-V 单周期 CPU 中的执行流程，包括取指、译码、立即数扩展、ALU 运算、寄存器写回，以及实验中的易错点。',
  },
  {
    rank: 2,
    title: 'Lab2：3-8 译码器 student_top 怎么写',
    prompt:
      '请为 XC7K325T 孪生平台生成 3-8 译码器的 student_top.sv 完整代码，使用 virtual_sw[2:0] 作输入、virtual_sw[3:5] 作使能、virtual_led[7:0] 作输出，并说明 I/O 映射和孪生平台验证步骤。',
  },
  {
    rank: 3,
    title: 'student_top 标准接口与 virtual 信号',
    prompt:
      '请说明孪生平台 student_top 的固定接口（w_clk_50Mhz、w_clk_rst、virtual_key、virtual_sw、virtual_led、virtual_seg），以及 AI 生成代码时必须遵守的规则。',
  },
  {
    rank: 4,
    title: 'virtual_seg 数码管位域怎么接',
    prompt:
      '请讲解孪生平台 virtual_seg[39:0] 的位域划分（每组 10 位：段码、DP、片选），并以电子钟或 Lab6 计数器为例说明如何连接。',
  },
  {
    rank: 5,
    title: 'Moore 状态机 student_top 示例',
    prompt:
      '请为孪生平台生成 Lab5 风格的 4 状态 Moore 状态机 student_top.sv，输入 x 来自 virtual_sw[0]，状态输出到 virtual_led[1:0]，并给出完整代码。',
  },
  {
    rank: 6,
    title: 'MMIO 地址映射和 LED / KEY / SW 访问',
    prompt:
      '请讲解 RISC-V CPU 物理上板的 MMIO 地址映射（SW、KEY、LED、数码管），并说明 RARS 调试地址和上板地址空间的区别及使用注意点。',
  },
  {
    rank: 7,
    title: 'UART 孪生平台 0x80 状态回读',
    prompt:
      '请说明 twin_controller 的 UART 通信协议：如何控制 virtual_sw/key、0x80 状态回读命令、以及回传的 18 字节数据格式。',
  },
  {
    rank: 8,
    title: 'JK / D 触发器孪生实验怎么接',
    prompt:
      '请讲解 Lab4 JK 触发器或 D 触发器在孪生平台上的接法，包括 virtual_sw 复位/输入信号、virtual_led 输出 q/qb，以及分频 clk_en 的作用。',
  },
]

/** 首页右侧：实用工具（任务模板，点击后作为首条消息发送） */
export const toolItems: ToolItem[] = [
  {
    id: 'concept-explain',
    icon: BookOpen,
    title: '概念讲解',
    description: 'RISC-V / CPU / 数字电路概念，按结论、原理、实验作用、易错点讲解',
    prompt:
      '请按“结论、原理、实验中的作用、易错点”的结构，讲解以下 RISC-V、CPU 设计或数字电路概念：',
  },
  {
    id: 'twin-student-top',
    icon: Layers,
    title: '孪生平台 student_top 生成',
    description: '生成可在孪生平台直接运行的 student_top.sv，含 I/O 映射与验证步骤',
    prompt:
      '请为 XC7K325T 孪生平台生成完整 student_top.sv。要求：只修改 student_top、固定接口不变、使用 virtual_sw/key/led/seg，给出 I/O 映射和孪生平台验证步骤，不要 Testbench。实验需求：',
  },
  {
    id: 'riscv-code',
    icon: Code2,
    title: 'RISC-V 模块代码生成',
    description: '生成 ALU、CPU 子模块等可综合代码，含 Testbench 和上板说明',
    prompt:
      '请根据下面需求生成 RISC-V / CPU 相关的完整 SystemVerilog 代码，要求可综合，并给出 Testbench、接口说明和 Vivado 验证步骤：',
  },
  {
    id: 'interface-check',
    icon: Bug,
    title: '代码 / 接口检查',
    description: '检查 student_top 端口、virtual 映射、位宽、复位与平台规范是否一致',
    prompt:
      '请检查下面这段 Verilog/SystemVerilog 代码：端口是否完整、位宽是否匹配、复位逻辑是否正确、virtual_sw/key/led/seg 映射是否符合孪生平台规范，并给出具体修改建议。代码如下：',
  },
  {
    id: 'board-debug',
    icon: Zap,
    title: 'Vivado / 孪生 / 上板排错',
    description: '综合、仿真、孪生平台、LED 不亮、数码管不显示等问题排查',
    prompt:
      '我在 Vivado 综合实现、仿真、孪生平台验证或物理板上板时遇到下面问题，请按可能原因、排查步骤和修改建议帮我分析：',
  },
  {
    id: 'contest-qa',
    icon: Cpu,
    title: '竞赛资料问答',
    description: '查询赛题、提交物、组别、赛区和评分要求',
    prompt:
      '请根据知识库中的竞赛资料回答这个问题；如果资料中没有明确依据，请直接说明没有找到明确依据。问题是：',
  },
]

export const navItems = [
  { id: 'home', label: '工作台', icon: Cpu },
  { id: 'tools', label: '工具箱', icon: Terminal },
]
