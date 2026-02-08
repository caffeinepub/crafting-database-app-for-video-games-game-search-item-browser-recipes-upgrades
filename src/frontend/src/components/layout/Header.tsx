import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <img 
            src="/assets/generated/app-logo.dim_512x512.png" 
            alt="Crafting Compendium Logo" 
            className="h-10 w-10"
          />
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight">Crafting Compendium</span>
            <span className="text-xs text-muted-foreground">Your Workshop Reference</span>
          </div>
        </Link>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: '/' })}
          className="gap-2"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Home</span>
        </Button>
      </div>
    </header>
  );
}
