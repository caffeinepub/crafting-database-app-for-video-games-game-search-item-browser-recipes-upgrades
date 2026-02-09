import { Heart, Activity } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-muted/30">
      <div className="container py-6">
        <div className="flex flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            © 2026. Built with <Heart className="h-3.5 w-3.5 fill-current text-red-500" /> using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
          <Link
            to="/diagnostics"
            className="flex items-center gap-1.5 text-xs text-muted-foreground/70 hover:text-foreground transition-colors"
          >
            <Activity className="h-3 w-3" />
            Diagnostics
          </Link>
        </div>
      </div>
    </footer>
  );
}
