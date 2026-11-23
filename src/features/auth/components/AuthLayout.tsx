import { Outlet, Link } from "react-router-dom";
import { Music2 } from "lucide-react";

const PHOTO = "/images/Sound Of Hope Foundation/PXL_20260302_130028324.jpg";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left — full-height photo with overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={PHOTO}
          alt="Students learning violin at Sound of Hope Foundation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-primary/40" />

        {/* Content over photo */}
        <div className="relative flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Music2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-700 text-lg">Sound of Hope Foundation</span>
          </Link>

          {/* Quote */}
          <div className="space-y-4">
            <blockquote className="font-heading font-300 text-2xl leading-relaxed italic">
              "Music gives a soul to the universe, wings to the mind, flight to
              the imagination, and life to everything."
            </blockquote>
            <p className="text-white/60 text-sm">— Plato</p>
          </div>

          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Sound of Hope Foundation
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <Music2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-700 text-foreground">Sound of Hope Foundation</span>
          </div>

          <Outlet />

          {/* Staff link — small and discreet at bottom */}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Are you a staff member?{" "}
            <a
              href="http://localhost:5165"
              className="text-primary hover:underline font-medium"
            >
              Go to the staff portal →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
