import { useLocation } from "react-router-dom";
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

  // DEBUG: Log session state to understand the issue
  console.log('[DEBUG] Konform session state:', {
    sessionExists: !!session,
    sessionType: session ? typeof session : 'null/undefined',
    isNull: session === null,
    isUndefined: session === undefined
  });

  // Show loading spinner while session is being determined (null)
  if (session === null) {
    console.log('[DEBUG] Showing loading spinner - session is null');
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-konform-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-dreamaker-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show product page when user is not authenticated (session is undefined or false)
  if (!session) {
    console.log('[DEBUG] Showing product page - session is falsy but not null');
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