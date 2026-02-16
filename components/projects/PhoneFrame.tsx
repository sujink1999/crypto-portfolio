export default function PhoneFrame({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="relative w-[260px] shrink-0">
      {/* Phone shell */}
      <div className="rounded-[2.5rem] border-[6px] border-white/10 bg-black overflow-hidden shadow-2xl">
        {/* Screen */}
        <img
          src={src}
          alt={alt}
          className="w-full h-auto"
        />
        {/* Bottom bar */}
        <div className="flex justify-center py-2 bg-black">
          <div className="w-28 h-1 bg-white/15 rounded-full" />
        </div>
      </div>
    </div>
  );
}
