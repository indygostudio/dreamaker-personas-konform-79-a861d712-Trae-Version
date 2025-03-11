import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { KonformProduct } from "@/pages/KonformProduct";
import { useHeaderStore } from "@/components/konform/store/headerStore";
import { KonformTabs } from "@/components/konform/KonformTabs";
const Konform = () => {
  const [session, setSession] = useState(null);
  const {
    konformHeaderCollapsed,
    setKonformHeaderCollapsed
  } = useHeaderStore();
  useEffect(() => {
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setSession(session);
    });
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  if (!session) {
    return <KonformProduct />;
  }
  return <div className="min-h-screen bg-gradient-to-br from-black to-konform-bg">
      <div className="max-w-[2400px] mx-auto px-6 py-[66px]">
        <KonformTabs />
      </div>
    </div>;
};
export default Konform;