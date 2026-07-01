export function LoginBackground() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/login-bg.jpg)' }}
      />
      <div className="absolute inset-0 bg-slate-950/40" />

      <div className="absolute inset-x-0 bottom-0 hidden p-10 lg:block xl:p-14">
        <div className="max-w-lg">
          <p className="mb-3 text-sm font-medium tracking-widest text-cyan-300/90 uppercase">
            RISC-V Intelligent Assistant
          </p>
          <h2 className="text-3xl font-bold leading-tight text-white xl:text-4xl">
            芯小智
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/80">
            面向指令集、CPU 实验、SystemVerilog 与上板调试的智能助教平台
          </p>
        </div>
      </div>
    </div>
  )
}
