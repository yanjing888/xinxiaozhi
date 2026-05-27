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
  { rank: 1, title: 'ADD / ADDI 算术指令', prompt: '请详解 RISC-V ADD 和 ADDI 指令的编码格式与示例' },
  { rank: 2, title: 'LW / SW 内存访问', prompt: '请解释 RISC-V 中 lw 和 sw 指令的寻址方式，并给出加载/store 示例' },
  { rank: 3, title: 'BEQ / BNE 分支跳转', prompt: '请说明 RISC-V 条件分支指令的编码和跳转范围计算方法' },
  { rank: 4, title: 'ECALL / EBREAK 异常', prompt: '请解释 ecall 和 ebreak 在 RISC-V 中的作用及触发场景' },
  { rank: 5, title: 'CSR 读写指令', prompt: '请介绍 csrrw、csrrs、csrrc 三条 CSR 访问指令的用法' },
  { rank: 6, title: 'Pipeline Hazard 流水线冒险', prompt: '请讲解 RISC-V 五级流水线中的三种冒险及常见解决方法' },
  { rank: 7, title: 'ABI 调用约定', prompt: '请说明 RISC-V RV32I 的函数调用约定和寄存器保存规则' },
  { rank: 8, title: '中断与异常处理', prompt: '请描述 RISC-V 机器模式下的中断处理流程和 mtvec 配置' },
]

export const toolItems: ToolItem[] = [
  {
    id: 'code-gen',
    icon: Code2,
    title: '汇编代码生成',
    description: '根据需求描述生成可直接烧录的 RISC-V 汇编',
    prompt: '我需要一段 RISC-V RV32I 汇编程序，请根据我的需求生成完整可编译代码：',
  },
  {
    id: 'simulator',
    icon: Terminal,
    title: '指令模拟执行',
    description: '逐步模拟指令执行，展示寄存器变化',
    prompt: '请逐步模拟以下 RISC-V 指令的执行过程，展示每条指令后的寄存器状态：',
  },
  {
    id: 'board-status',
    icon: Cpu,
    title: '开发板连接指南',
    description: 'OpenOCD / GDB 连接与烧录步骤',
    prompt: '请提供 RISC-V 开发板通过 OpenOCD 和 GDB 连接调试的详细步骤：',
  },
  {
    id: 'debug',
    icon: Bug,
    title: '常见调试问题',
    description: '链接错误、对齐异常、启动失败排查',
    prompt: '我在 RISC-V 开发中遇到了问题，请帮我分析可能原因和排查步骤：',
  },
  {
    id: 'optimize',
    icon: Zap,
    title: '代码优化建议',
    description: '指令级优化与性能分析',
    prompt: '请分析以下 RISC-V 代码并给出指令级优化建议：',
  },
  {
    id: 'manual',
    icon: BookOpen,
    title: '指令手册速查',
    description: '快速查询指令编码与语义',
    prompt: '请提供以下 RISC-V 指令的编码格式、操作语义和汇编示例：',
  },
]

export const navItems = [
  { id: 'home', label: '工作台', icon: Cpu },
  { id: 'tools', label: '工具箱', icon: Terminal },
  { id: 'history', label: '对话记录', icon: BookOpen },
]
