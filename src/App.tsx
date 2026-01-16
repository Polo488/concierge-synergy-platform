
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RoutePermission } from "./components/auth/RoutePermission";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Maintenance from "./pages/Maintenance";
import Cleaning from "./pages/Cleaning";
import Calendar from "./pages/Calendar";
import Properties from "./pages/Properties";
import Billing from "./pages/Billing";
import MoyenneDuree from "./pages/MoyenneDuree";
import Upsell from "./pages/Upsell";
import Users from "./pages/Users";
import InsightsAlerts from "./pages/InsightsAlerts";
import QualityStats from "./pages/QualityStats";
import GuestExperience from "./pages/GuestExperience";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from "./contexts/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes - require authentication */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                  
                  <Route path="/properties" element={
                    <RoutePermission permission="properties">
                      <Properties />
                    </RoutePermission>
                  } />
                  
                  <Route path="/inventory" element={
                    <RoutePermission permission="inventory">
                      <Inventory />
                    </RoutePermission>
                  } />
                  
                  <Route path="/maintenance" element={
                    <RoutePermission permission="maintenance">
                      <Maintenance />
                    </RoutePermission>
                  } />
                  
                  <Route path="/cleaning" element={
                    <RoutePermission permission="cleaning">
                      <Cleaning />
                    </RoutePermission>
                  } />
                  
                  <Route path="/quality-stats" element={
                    <RoutePermission permission="cleaning">
                      <QualityStats />
                    </RoutePermission>
                  } />
                  
                  <Route path="/calendar" element={
                    <RoutePermission permission="calendar">
                      <Calendar />
                    </RoutePermission>
                  } />
                  
                  <Route path="/billing" element={
                    <RoutePermission permission="billing">
                      <Billing />
                    </RoutePermission>
                  } />
                  
                  <Route path="/moyenne-duree" element={
                    <RoutePermission permission="moyenneDuree">
                      <MoyenneDuree />
                    </RoutePermission>
                  } />
                  
                  <Route path="/upsell" element={
                    <RoutePermission permission="upsell">
                      <Upsell />
                    </RoutePermission>
                  } />
                  
                  <Route path="/users" element={
                    <RoutePermission permission="users">
                      <Users />
                    </RoutePermission>
                  } />
                  
                  <Route path="/insights" element={
                    <RoutePermission permission="properties">
                      <InsightsAlerts />
                    </RoutePermission>
                  } />
                  
                  <Route path="/guest-experience" element={
                    <RoutePermission permission="guestExperience">
                      <GuestExperience />
                    </RoutePermission>
                  } />
                </Route>
              </Route>
              
              {/* Catch all for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
