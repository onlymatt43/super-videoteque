interface PreviewPlayerProps {
  active: boolean;
  src: string;
}

export const PreviewPlayer = ({ active, src }: PreviewPlayerProps) => (
  <div
    className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-0'}`}
  >
    {active && (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
      />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent" />
  </div>
);
