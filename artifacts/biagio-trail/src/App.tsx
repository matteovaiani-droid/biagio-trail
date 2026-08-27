import { type ReactNode, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import { AppShell } from "@/components/AppShell";

import { HomePage } from "@/pages/HomePage";
import { TrailsPage } from "@/pages/TrailsPage";
import { TrailDetailPage } from "@/pages/TrailDetailPage";
import { FavoritesPage } from "@/pages/FavoritesPage";
import { SupabaseTest } from "@/pages/SupabaseTest";
import { SettingsPage, type Settings } from "@/pages/SettingsPage";

import { TrailsApiTest } from "@/pages/TrailsApiTest";

import { Route, Switch, useLocation, Router as WouterRouter } from "wouter";

const queryClient = new QueryClient();

function Router() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("biagio-favorites") ?? "[]",
      ) as string[];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<Settings>(() => {
    try {
      return {
        distanceUnit: "km",
        notifications: true,
        offlineMaps: false,
        ...JSON.parse(localStorage.getItem("biagio-settings") ?? "{}"),
      };
    } catch {
      return {
        distanceUnit: "km",
        notifications: true,
        offlineMaps: false,
      };
    }
  });

  useEffect(() => {
    localStorage.setItem("biagio-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("biagio-settings", JSON.stringify(settings));
  }, [settings]);

  const toggleFavorite = (id: string) =>
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );

  const updateSettings = (patch: Partial<Settings>) =>
    setSettings((current) => ({
      ...current,
      ...patch,
    }));

  const shared = {
    favorites,
    onToggleFavorite: toggleFavorite,
    unit: settings.distanceUnit,
  };

  return (
    <RoutedErrorBoundary>
      <AppShell>
        <Switch>
          <Route path="/supabase-test">
            <SupabaseTest />
          </Route>

          <Route path="/">
            <HomePage {...shared} />
          </Route>

          <Route path="/trails">
            <TrailsPage {...shared} />
          </Route>

          <Route path="/api-test">
            <TrailsApiTest />
          </Route>

          <Route path="/trails/:id">
            <TrailDetailPage {...shared} />
          </Route>

          <Route path="/favorites">
            <FavoritesPage {...shared} />
          </Route>

          <Route path="/settings">
            <SettingsPage settings={settings} onUpdate={updateSettings} />
          </Route>

          <Route component={NotFound} />
        </Switch>
      </AppShell>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>

        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
