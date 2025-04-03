
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StoryboardPage from "./pages/StoryboardPage";
import NotFound from "./pages/NotFound";
import { StoryboardProvider } from "./contexts/StoryboardContext";
import { AIServiceProvider } from "./contexts/AIServiceContext";
import { StoryWizardProvider } from "./contexts/StoryWizardContext";
import WizardPage from "./pages/WizardPage";
import "./App.css";

// Create the query client instance outside the component
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AIServiceProvider>
          <StoryboardProvider>
            <StoryWizardProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner theme="dark" position="top-right" />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/wizard" element={<WizardPage />} />
                    <Route path="/storyboard" element={<StoryboardPage />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </StoryWizardProvider>
          </StoryboardProvider>
        </AIServiceProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
