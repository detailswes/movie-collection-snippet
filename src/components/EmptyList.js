"use client";
import Link from "next/link";
import LogoutIcon from "assets/images/icons/logout.svg";
import { useLogout } from "hooks/useLogout";

const EmptyList = () => {
  const handleLogout = useLogout();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Logout button — top right */}
      <div className="flex justify-end p-6">
        <button onClick={handleLogout} className="flex items-center gap-2">
          <span className="text-base hidden sm:block font-bold text-white">
            Logout
          </span>
          <LogoutIcon />
        </button>
      </div>

      {/* Centred empty state */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-24">
        {/* Film-reel illustration (pure SVG — no external dependency) */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-8 opacity-40"
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="56" stroke="#2BD17E" strokeWidth="4" />
          <circle cx="60" cy="60" r="18" stroke="#2BD17E" strokeWidth="4" />
          {/* Sprocket holes */}
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x = 60 + 38 * Math.cos(rad);
            const y = 60 + 38 * Math.sin(rad);
            return <circle key={deg} cx={x} cy={y} r="6" stroke="#2BD17E" strokeWidth="3" />;
          })}
        </svg>

        <h2 className="mb-4">Your movie list is empty</h2>
        <p className="text-white/60 mb-10 max-w-xs">
          Start building your personal collection by adding your first movie.
        </p>

        <Link href="/movies/add">
          <button className="button w-52">
            + Add your first movie
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EmptyList;
