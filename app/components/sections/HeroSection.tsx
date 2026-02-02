import Image from "next/image";

export default function HeroSection({ data }: any) {
  return (
    <section className="relative overflow-hidden pt-20 pb-12 md:pt-32 md:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* คาร์ดหลัก: ปรับ rounded และ padding ตามขนาดหน้าจอ */}
        <div className="hero-gradient-card group relative overflow-hidden rounded-4xl md:rounded-[40px] lg:rounded-[64px] border border-white/50 px-6 py-10 sm:px-10 sm:py-16 lg:px-20 lg:py-24 shadow-2xl">
          
          {/* Background Glows: ซ่อนหรือปรับขนาดบน Mobile เพื่อไม่ให้ฟุ้งจนเกินไป */}
          <div className="hero-glow absolute -right-20 -top-20 h-[300px] w-[300px] md:h-[500px] md:w-[500px] blur-3xl opacity-60" />
          <div className="hero-glow absolute -bottom-20 -left-20 h-[250px] w-[250px] md:h-[400px] md:w-[400px] blur-3xl opacity-40" />

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            
            {/* LEFT CONTENT: ปรับ Text Alignment บน Mobile */}
            <div className="relative z-10 flex flex-col items-center text-center lg:col-span-6 lg:items-start lg:text-left">
              {data.badge && (
                <span className="mb-4 inline-block rounded-full bg-white/80 px-4 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-cyan-600 shadow-sm backdrop-blur-md border border-white">
                  {data.badge}
                </span>
              )}

              <h1 className="text-3xl font-extrabold leading-[1.15] text-gray-900 sm:text-5xl lg:text-6xl">
                {data.title}
              </h1>

              <p className="mt-4 md:mt-6 max-w-md text-base md:text-lg leading-relaxed text-gray-600/90">
                {data.description}
              </p>

              {/* CTA Buttons: ปรับให้แสดง 2 ปุ่มเรียงกันเสมอ */}
{/* CTA Buttons: ปรับปุ่มที่สองให้เด่นขึ้นด้วย Glassmorphism Outline */}
{/* CTA Buttons: ปุ่มที่สองเด่นขึ้นพร้อมลูกศรขยับได้ */}
<div className="mt-8 flex flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 w-full">
  {/* Primary Button */}
  <a
    href={data.ctaPrimary.href}
    className="
      flex-1 sm:flex-none text-center
      bg-[#182A3E] shadow-lg shadow-cyan-500/40 
       sm:px-10 py-2.5 md:py-3 
      rounded-xl md:rounded-2xl 
      text-sm sm:text-lg md:text-xl font-bold text-white hover:text-[#182A3E]
      transition-all duration-300 hover:bg-cyan-600 
      hover:-translate-y-1 active:scale-95 whitespace-nowrap
    "
  >
    {data.ctaPrimary.label}
  </a>

  {/* Secondary Button: เด่นขึ้น + ลูกศรขยับได้ (group-hover) */}
  {data.ctaSecondary && (
    <a
      href={data.ctaSecondary.href}
      className="
        group flex-1 sm:flex-none flex items-center justify-center gap-2 
        sm:px-10 py-2.5 md:py-3 
         shadow-lg shadow-cyan-500/40 
        rounded-xl md:rounded-2xl 
        border-2 border-[#182A3E] bg-cyan-500/5
        text-sm sm:text-lg md:text-xl font-bold text-[#182A3E]
        backdrop-blur-sm
        transition-all duration-300 
        hover:border-cyan-600 hover:bg-cyan-500/10 hover:-translate-y-1  hover:text-cyan-600
        active:scale-95 whitespace-nowrap
      "
    >
      <span>{data.ctaSecondary.label}</span>
      <svg 
        className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ease-out group-hover:translate-x-1.5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2.5" 
          d="M17 8l4 4m0 0l-4 4m4-4H3" 
        />
      </svg>
    </a>
  )}
</div>
            </div>

            {/* RIGHT IMAGE: ปรับขนาดตามหน้าจอ */}
            <div className="relative lg:col-span-6 ">
              <div className="floating-animation relative mx-auto aspect-square w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px] lg:max-w-[500px]">
                {/* Soft Ambient Shadow */}
                <div className="absolute inset-0 m-auto h-3/4 w-3/4 rounded-full bg-black/5 blur-3xl" />

                <Image
                  src={data.image.src}
                  alt={data.image.alt}
                  fill
                  priority
                  className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-w-[768px]) 280px, (max-w-[1024px]) 450px, 500px"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}