import {
  Code2,
  Cpu,
  Bug,
  Terminal,
  Zap,
  BookOpen,
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

export const quickChips: QuickChip[] = [
  { label: '指令解释', prompt: '请解释 RISC-V 中 addi 指令的格式、操作语义和典型使用场景' },
  { label: '生成汇编', prompt: '请生成一段 RISC-V RV32I 汇编代码，实现两个整数相加并存储结果' },
  { label: '调试帮助', prompt: '我的 RISC-V 程序在加载段地址对齐上报错，可能原因有哪些？如何排查？' },
  { label: 'CSR 详解', prompt: '请详细解释 mstatus 寄存器中 MIE 和 MPIE 位的含义及切换流程' },
  { label: 'C 语言内联', prompt: '请展示如何在 C 语言中使用内联汇编编写 RISC-V 自定义指令调用' },
]

export const referenceItems: ReferenceItem[] = [
  { rank: 1, title: 'ADDI 在单周期 CPU 中怎么执行', prompt: '请讲解 addi 指令在 RISC-V 单周期 CPU 中的执行流程，包括取指、译码、立即数扩展、ALU 运算、寄存器写回。' },
  { rank: 2, title: 'LW / SW 数据通路和地址计算', prompt: '请解释 lw 和 sw 指令在单周期 CPU 中的数据通路、地址计算方式、存储器读写控制信号以及实验中的易错点。' },
  { rank: 3, title: 'BEQ / BNE 分支判断和 PC 更新', prompt: '请讲解 beq 和 bne 指令如何完成分支比较、立即数偏移生成以及 PC 更新，并说明常见设计错误。' },
  { rank: 4, title: 'ALU 控制信号如何设计', prompt: '请说明 RISC-V 单周期 CPU 中 ALUControl 如何由 opcode、funct3、funct7 生成，并结合常见算术/逻辑指令举例。' },
  { rank: 5, title: '寄存器堆 rs1 / rs2 / rd 读写规则', prompt: '请讲解 RISC-V 寄存器堆中 rs1、rs2、rd 的读写规则，特别是 x0、写使能、时钟边沿和数据冒险相关注意点。' },
  { rank: 6, title: '立即数扩展 IMMGEN 怎么实现', prompt: '请讲解 RISC-V RV32I 中 I/S/B/U/J 型立即数的拼接、符号扩展方式，以及 IMMGEN 模块实现时的易错点。' },
  { rank: 7, title: 'student_top 标准接口说明', prompt: '请说明竞赛/实验中 student_top 的标准接口，包括 w_clk_50Mhz、w_clk_rst、virtual_key、virtual_sw、virtual_led、virtual_seg 的用途和连接注意事项。' },
  { rank: 8, title: 'MMIO 地址映射和 LED / KEY / SW 访问', prompt: '请讲解上板 MMIO 地址映射中 SW、KEY、LED、数码管的访问方式，并说明 RARS 调试地址和上板地址空间的区别。' },
]

export const toolItems: ToolItem[] = [
  {
    id: 'concept-explain',
    icon: BookOpen,
    title: '概念讲解',
    description: '按结论、原理、实验作用、易错点讲清楚核心概念',
    prompt: '请按“结论、原理、实验中的作用、易错点”的结构，讲解这个 RISC-V/CPU 设计概念：',
  },
  {
    id: 'systemverilog-code',
    icon: Code2,
    title: 'SystemVerilog 代码生成',
    description: '生成完整可综合代码，并附带接口说明和验证步骤',
    prompt: '请根据下面需求生成完整 SystemVerilog 代码，要求可综合、接口清晰，并给出 Testbench 和验证步骤：',
  },
  {
    id: 'testbench-gen',
    icon: Terminal,
    title: 'Testbench 生成',
    description: '为模块生成可运行仿真激励和结果检查方式',
    prompt: '请为下面这个 Verilog/SystemVerilog 模块生成可运行 Testbench，包含时钟、复位、关键输入激励和预期结果检查：',
  },
  {
    id: 'interface-check',
    icon: Bug,
    title: '接口/信号检查',
    description: '检查端口、位宽、未声明信号和平台接口映射',
    prompt: '请检查下面这段 Verilog/SystemVerilog 代码的接口、端口位宽、未声明信号、复位逻辑和 student_top/virtual_* 映射是否存在问题：',
  },
  {
    id: 'board-debug',
    icon: Zap,
    title: 'Vivado/仿真/上板排错',
    description: '定位综合、仿真、下载、LED 不亮等实验问题',
    prompt: '我在 Vivado/仿真/上板验证时遇到下面问题，请按可能原因、排查步骤和修改建议帮我分析：',
  },
  {
    id: 'contest-qa',
    icon: Cpu,
    title: '竞赛资料问答',
    description: '查询赛题、提交物、组别、赛区和评分要求',
    prompt: '请根据知识库中的竞赛资料回答这个问题；如果资料中没有明确依据，请直接说明没有找到明确依据：',
  },
]

export const navItems = [
  { id: 'home', label: '工作台', icon: Cpu },
  { id: 'tools', label: '工具箱', icon: Terminal },
]
