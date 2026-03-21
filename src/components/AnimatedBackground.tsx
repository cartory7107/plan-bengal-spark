const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 gradient-bg-soft" />
    <div className="orb-1 absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-200/40 to-teal-200/30 blur-3xl" />
    <div className="orb-2 absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-green-200/30 to-cyan-200/20 blur-3xl" />
    <div className="orb-3 absolute bottom-20 left-1/4 w-72 h-72 rounded-full bg-gradient-to-br from-teal-200/30 to-emerald-100/20 blur-3xl" />
    <div className="orb-4 absolute -bottom-20 right-1/3 w-64 h-64 rounded-full bg-gradient-to-br from-green-100/40 to-emerald-200/20 blur-3xl" />
  </div>
);

export default AnimatedBackground;
