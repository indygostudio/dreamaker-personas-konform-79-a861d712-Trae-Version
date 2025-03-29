import { useNavigate, useLocation } from "react-router-dom";
import { KonformProduct } from "@/pages/KonformProduct";
import { useHeaderStore } from "@/components/konform/store/headerStore";
import { KonformTabs } from "@/components/konform/KonformTabs";
import { useAuth } from "@/hooks/use-auth";
const Konform = () => {
  const { session } = useAuth();
  const location = useLocation();
  const {
    konformHeaderCollapsed,
    setKonformHeaderCollapsed
  } = useHeaderStore();
  
  // Extract any collaboration selected from Dreamaker
  const selectedCollaborationId = location.state?.selectedCollaborationId;
  const collaborationName = location.state?.collaborationName;

  if (session === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-konform-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-dreamaker-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return <KonformProduct />;
  }
  return <div className="min-h-screen bg-gradient-to-br from-black to-konform-bg">
      <div className="max-w-[2400px] mx-auto px-6 py-[66px]">
        <KonformTabs
          selectedCollaborationId={selectedCollaborationId}
          collaborationName={collaborationName}
        />
      </div>
    </div>;
};
export default Konform;