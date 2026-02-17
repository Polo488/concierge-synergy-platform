
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { SignatureProvider } from "./contexts/SignatureContext";
import { OperationsProvider } from "./contexts/OperationsContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RoutePermission } from "./components/auth/RoutePermission";
import { TutorialProvider } from "./contexts/TutorialContext";
import { TutorialOverlay } from "./components/tutorial/TutorialOverlay";
import { PortalLayout } from "./components/portal/PortalLayout";

// App pages
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Maintenance from "./pages/Maintenance";
import Cleaning from "./pages/Cleaning";
import Calendar from "./pages/Calendar";
import Properties from "./pages/Properties";
import Billing from "./pages/Billing";
import MoyenneDuree from "./pages/MoyenneDuree";
import Upsell from "./pages/Upsell";
import UserManagement from "./pages/UserManagement";
import InsightsAlerts from "./pages/InsightsAlerts";
import QualityStats from "./pages/QualityStats";
import GuestExperience from "./pages/GuestExperience";
import Agenda from "./pages/Agenda";
import Messaging from "./pages/Messaging";
import HRPlanning from "./pages/HRPlanning";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import SignatureAdmin from "./pages/SignatureAdmin";
import Sign from "./pages/Sign";
import OwnerPortal from "./pages/OwnerPortal";
import LegalWatch from "./pages/LegalWatch";
import WelcomeGuide from "./pages/WelcomeGuide";
import WelcomeGuidePublic from "./pages/WelcomeGuidePublic";
import Transitory from "./pages/Transitory";
import IdeaBox from "./pages/IdeaBox";
import NotFound from "./pages/NotFound";

// Portal pages
import PortalHome from "./pages/portal/PortalHome";
import PortalProduit from "./pages/portal/PortalProduit";
import PortalModules from "./pages/portal/PortalModules";
import PortalTarifs from "./pages/portal/PortalTarifs";
import PortalSecurite from "./pages/portal/PortalSecurite";
import PortalContact from "./pages/portal/PortalContact";

import { LanguageProvider } from "./contexts/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <LanguageProvider>
          <TutorialProvider>
            <OperationsProvider>
              <BrowserRouter>
                <AuthProvider>
                  <SignatureProvider>
                  <Toaster />
                  <Sonner />
                  <TutorialOverlay />
                  <Routes>
                    {/* Portal routes (public) */}
                    <Route element={<PortalLayout />}>
                      <Route path="/" element={<PortalHome />} />
                      <Route path="/produit" element={<PortalProduit />} />
                      <Route path="/modules" element={<PortalModules />} />
                      <Route path="/tarifs" element={<PortalTarifs />} />
                      <Route path="/securite" element={<PortalSecurite />} />
                      <Route path="/contact" element={<PortalContact />} />
                    </Route>
                    
                    {/* Connexion redirect */}
                    <Route path="/connexion" element={<Navigate to="/login" replace />} />
                    
                    {/* Login page */}
                    <Route path="/login" element={<Login />} />
                    
                    {/* Public signing page */}
                    <Route path="/sign" element={<Sign />} />

                    {/* Public welcome guide */}
                    <Route path="/welcome/:token" element={<WelcomeGuidePublic />} />
                    
                    {/* Protected app routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route element={<Layout />}>
                        <Route path="/app" element={<Dashboard />} />
                      
                      <Route path="/app/properties" element={
                        <RoutePermission permission="properties">
                          <Properties />
                        </RoutePermission>
                      } />
                      
                      <Route path="/app/inventory" element={
                        <RoutePermission permission="inventory">
                          <Inventory />
                        </RoutePermission>
                      } />
                      
                      <Route path="/app/maintenance" element={
                        <RoutePermission permission="maintenance">
                          <Maintenance />
                        </RoutePermission>
                      } />
                      
                      <Route path="/app/cleaning" element={
                        <RoutePermission permission="cleaning">
                          <Cleaning />
                        </RoutePermission>
                      } />
                      
                      <Route path="/app/quality-stats" element={
                        <RoutePermission permission="cleaning">
                          <QualityStats />
                        </RoutePermission>
                      } />
                      
                      <Route path="/app/calendar" element={
                        <RoutePermission permission="calendar">
                          <Calendar />
                        </RoutePermission>
                      } />
                      
                      <Route path="/app/billing" element={
                        <RoutePermission permission="billing">
                          <Billing />
                        </RoutePermission>
                      } />
                      
                      <Route path="/app/moyenne-duree" element={
                        <RoutePermission permission="moyenneDuree">
                          <MoyenneDuree />
                        </RoutePermission>
                      } />
                      
                      <Route path="/app/upsell" element={
                        <RoutePermission permission="upsell">
                          <Upsell />
                        </RoutePermission>
                      } />
                      
                      <Route path="/app/user-management" element={
                        <RoutePermission permission="users">
                          <UserManagement />
                        </RoutePermission>
                      } />
                      
                      <Route path="/app/insights" element={
                        <RoutePermission permission="properties">
                          <InsightsAlerts />
                        </RoutePermission>
                      } />
                      
                      <Route path="/app/guest-experience" element={
                        <RoutePermission permission="guestExperience">
                          <GuestExperience />
                        </RoutePermission>
                      } />
                      
                      <Route path="/app/agenda" element={
                        <RoutePermission permission="agenda">
                          <Agenda />
                        </RoutePermission>
                      } />
                      
                      <Route path="/app/messaging" element={
                        <RoutePermission permission="messaging">
                          <Messaging />
                        </RoutePermission>
                      } />
                      
                      <Route path="/app/hr-planning" element={
                        <RoutePermission permission="hrPlanning">
                          <HRPlanning />
                        </RoutePermission>
                      } />
                      
                      <Route path="/app/onboarding" element={
                        <RoutePermission permission="onboarding">
                          <Onboarding />
                        </RoutePermission>
                      } />
                      
                      <Route path="/app/signature" element={
                        <RoutePermission permission="onboarding">
                          <SignatureAdmin />
                      </RoutePermission>
                      } />
                      
                      <Route path="/app/owner" element={
                        <RoutePermission permission="ownerPortal">
                          <OwnerPortal />
                        </RoutePermission>
                      } />
                      <Route path="/app/owner/onboarding" element={
                        <RoutePermission permission="ownerPortal">
                          <OwnerPortal />
                        </RoutePermission>
                      } />
                      <Route path="/app/owner/invoices" element={
                        <RoutePermission permission="ownerPortal">
                          <OwnerPortal />
                        </RoutePermission>
                      } />
                      <Route path="/app/owner/documents" element={
                        <RoutePermission permission="ownerPortal">
                          <OwnerPortal />
                        </RoutePermission>
                      } />
                      <Route path="/app/owner/revenue" element={
                        <RoutePermission permission="ownerPortal">
                          <OwnerPortal />
                        </RoutePermission>
                      } />
                      <Route path="/app/owner/notifications" element={
                        <RoutePermission permission="ownerPortal">
                          <OwnerPortal />
                        </RoutePermission>
                      } />
                      
                      <Route path="/app/legal-watch" element={
                        <RoutePermission permission="legalWatch">
                          <LegalWatch />
                        </RoutePermission>
                      } />

                      <Route path="/app/welcome-guide" element={
                        <RoutePermission permission="welcomeGuide">
                          <WelcomeGuide />
                        </RoutePermission>
                      } />

                      <Route path="/app/transitory" element={
                        <RoutePermission permission="transitory">
                          <Transitory />
                        </RoutePermission>
                      } />

                      <Route path="/app/idea-box" element={
                        <RoutePermission permission="ideaBox">
                          <IdeaBox />
                        </RoutePermission>
                      } />
                    </Route>
                  </Route>
                  
                  {/* Catch all for 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                  </SignatureProvider>
              </AuthProvider>
            </BrowserRouter>
          </OperationsProvider>
        </TutorialProvider>
      </LanguageProvider>
    </TooltipProvider>
  </ThemeProvider>
</QueryClientProvider>
);

export default App;
