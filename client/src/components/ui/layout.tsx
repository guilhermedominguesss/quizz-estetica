import React from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Ambient Background Elements - Optimized for Mobile */}
      <div 
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(circle at 0% 0%, hsl(var(--primary) / 0.08) 0%, transparent 50%),
            radial-gradient(circle at 100% 30%, hsl(var(--secondary) / 0.1) 0%, transparent 40%),
            radial-gradient(circle at 20% 90%, hsl(var(--accent) / 0.15) 0%, transparent 50%)
          `
        }}
      />

      <main className={cn(
        "w-full max-w-md z-10 relative",
        "transition-all duration-500 ease-in-out",
        className
      )}>
        {children}
      </main>

      <footer className="mt-8 text-center text-muted-foreground text-xs z-10 opacity-60">
        <p>&copy; 2024 Premium Beauty Analytics. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(
    "bg-card/90 border border-white/20 shadow-xl rounded-3xl p-8 md:p-10",
    "transform transition-all duration-300 hover:shadow-2xl",
    className
  )}>
    {children}
  </div>
);

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "w-full py-4 px-6 rounded-xl font-semibold tracking-wide transition-all duration-300 active:scale-95 flex items-center justify-center gap-2",
          variant === 'primary' 
            ? "bg-gradient-to-r from-primary to-[#8B5228] text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:brightness-110" 
            : "bg-transparent border border-primary/30 text-primary hover:bg-primary/5",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full bg-white/50 border border-border rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
