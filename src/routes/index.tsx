
import { Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import Index from "../pages/Index";
import PersonaProfile from "../pages/PersonaProfile";
import Auth from "../pages/Auth";
import ArtistBrowser from "../pages/ArtistBrowser";
import Konform from "../pages/Konform";
import { ArtistProfile } from "../pages/ArtistProfile";
import KonformProduct from "../pages/KonformProduct";
import { DreamakerProduct } from "../pages/DreamakerProduct";
import MediaProfilePage from "../pages/MediaProfilePage";
import { Pricing } from "../pages/Pricing";
import { Privacy } from "../pages/Privacy";
import Blog from "../pages/Blog";
import { Earn } from "../pages/Earn";
export const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/personas/:id" element={<PersonaProfile />} />
          <Route path="/artists" element={<ArtistBrowser />} />
          <Route path="/artists/:id" element={<ArtistProfile />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/konform" element={<Konform />} />
          <Route path="/konform-product" element={<KonformProduct />} />
          <Route path="/dreamaker" element={<DreamakerProduct />} />
          <Route path="/media/:id" element={<MediaProfilePage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/earn" element={<Earn />} />
        </Routes>
      </div>
    </>
  );
};
