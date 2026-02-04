import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { useEffect } from "react";

// Definiamo il base path per GitHub Pages
const base = "/pentatonic-bouncer";

function Router() {
  return (
    /* Usiamo WouterRouter per definire la base di tutti gli URL */
    <WouterRouter base={base}>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.code === 'Space') {
        e.preventDefault();
        const playPauseButton = document.querySelector('[data-testid="button-play-pause"]') as HTMLButtonElement;
        playPauseButton?.click();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        const resetButton = document.querySelector('[data-testid="button-reset"]') as HTMLButtonElement;
        resetButton?.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}

function App() {
  useKeyboardShortcuts();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
