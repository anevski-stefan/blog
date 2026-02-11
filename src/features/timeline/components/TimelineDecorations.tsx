export function TimelineDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
      <div className="absolute top-20 left-[10%] w-32 h-32 border border-home-accent/10 rounded-full float delay-0"></div>
      <div className="absolute top-1/3 right-[5%] w-24 h-24 border border-pink-500/10 rotate-45 float float-delay-1"></div>
      <div className="absolute bottom-1/4 left-[15%] w-20 h-20 border border-home-accent/10 rounded-lg float float-delay-2"></div>
      <div className="absolute top-2/3 right-[15%] w-16 h-16 border border-purple-500/10 rounded-full float float-delay-3"></div>
    </div>
  )
}
