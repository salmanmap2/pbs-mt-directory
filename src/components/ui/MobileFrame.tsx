'use client';

export function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Mobile: full screen */}
      <div className="lg:hidden h-screen w-full">
        {children}
      </div>

      {/* Desktop: centered mobile frame */}
      <div className="hidden lg:flex h-screen w-full items-center justify-center bg-[#070708]">
        {/* dot grid background */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1a1a1f 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        {/* phone frame — height follows viewport with max cap */}
        <div className="relative z-10 flex flex-col rounded-[2.5rem] border border-[#2d2f36] overflow-hidden shadow-2xl"
          style={{ width: '390px', height: 'min(844px, calc(100vh - 32px))' }}>
          {children}
        </div>
      </div>
    </>
  );
}