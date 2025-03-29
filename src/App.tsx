
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { AppRoutes } from "./routes";
import { ThemeProvider } from "./components/providers/theme-provider";
import { AdminModeProvider } from "./contexts/AdminModeContext";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./integrations/supabase/client";
import { AudioProvider } from "./components/providers/AudioProvider";
// Removed unused import: MockGroupPersonaCard

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <AdminModeProvider>
          <ThemeProvider defaultTheme="dark" storageKey="dreamaker-theme">
            <AudioProvider>
              <BrowserRouter>
                <AppRoutes />
                <Toaster />
              </BrowserRouter>
            </AudioProvider>
          </ThemeProvider>
        </AdminModeProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;
