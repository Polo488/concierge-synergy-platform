
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Maintenance from "./pages/Maintenance";
import Cleaning from "./pages/Cleaning";
import Calendar from "./pages/Calendar";
import Properties from "./pages/Properties";
import Billing from "./pages/Billing";
import MoyenneDuree from "./pages/MoyenneDuree";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/cleaning" element={<Cleaning />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/moyenne-duree" element={<MoyenneDuree />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
