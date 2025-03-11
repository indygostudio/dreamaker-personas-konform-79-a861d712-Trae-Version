import { useEffect, useState } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AuthError } from "@supabase/supabase-js";
import { Separator } from "@/components/ui/separator";
import { Music, Mic, Users, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { VideoBackground } from "@/components/dreamaker/VideoBackground";
const Auth = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect");
  const mode = searchParams.get("mode");
  const [isLoading, setIsLoading] = useState(true);
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const {
          data: {
            session
          },
          error
        } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
          setErrorMessage(getErrorMessage(error));
          return;
        }
        if (session) {
          const {
            data: validSession,
            error: validationError
          } = await supabase.auth.refreshSession();
          if (validationError || !validSession.session) {
            setErrorMessage("Session expired. Please sign in again.");
            return;
          }
          const {
            data: profile,
            error: profileError
          } = await supabase.from("profiles").select("onboarding_completed").eq("id", session.user.id).single();
          if (profileError) {
            console.error("Profile check error:", profileError);
            setErrorMessage("Error checking user profile. Please try again.");
            return;
          }
          navigate(`/artists/${session.user.id}`);
          if (!profile?.onboarding_completed) {
            setShowOnboarding(true);
          }
        }
      } catch (error: any) {
        console.error("Session check error:", error);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      if (event === "SIGNED_IN" && session) {
        try {
          const {
            data: profile
          } = await supabase.from("profiles").select("onboarding_completed").eq("id", session.user.id).single();
          const {
            error: rewardsError
          } = await supabase.from('user_rewards').upsert({
            user_id: session.user.id,
            points: 0,
            level: 1
          }, {
            onConflict: 'user_id'
          });
          if (rewardsError) {
            console.error("Error initializing rewards:", rewardsError);
          }
          navigate(`/artists/${session.user.id}`);
          if (!profile?.onboarding_completed) {
            setShowOnboarding(true);
          }
        } catch (error) {
          console.error("Error during post-sign in setup:", error);
          setErrorMessage("Error setting up user account. Please try again.");
        }
      }
      if (event === "SIGNED_OUT") {
        setErrorMessage("");
        setShowOnboarding(false);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  const getErrorMessage = (error: AuthError) => {
    console.error("Auth error:", error);
    switch (error.message) {
      case "Invalid login credentials":
        return "Invalid email or password. Please check your credentials and try again.";
      case "Email not confirmed":
        return "Please verify your email address before signing in.";
      case "Email already registered":
        return "This email is already registered. Please try signing in instead.";
      default:
        return error.message;
    }
  };
  const features = [{
    icon: <Music className="w-6 h-6 text-dreamaker-purple-light" />,
    title: "AI-Powered Music Creation",
    description: "Generate unique tracks and collaborate with AI personas"
  }, {
    icon: <Mic className="w-6 h-6 text-dreamaker-purple-light" />,
    title: "Advanced Voice Synthesis",
    description: "Create custom vocal performances with AI technology"
  }, {
    icon: <Users className="w-6 h-6 text-dreamaker-purple-light" />,
    title: "Collaborative Platform",
    description: "Work with other artists and share your creations"
  }, {
    icon: <Sparkles className="w-6 h-6 text-dreamaker-purple-light" />,
    title: "Professional Tools",
    description: "Access industry-standard DAW features and VST plugins"
  }];
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-dreamaker-bg">
        <div className="text-white text-center">
          <p>Loading...</p>
        </div>
      </div>;
  }
  return <>
      <div className="min-h-screen flex flex-col md:flex-row bg-dreamaker-bg pt-20">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-start items-center text-white relative overflow-hidden" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="absolute inset-0 z-0">
            <VideoBackground videoUrl="/Videos/Gen-3 Alpha 1222913568, Dreamlike clouds in , imagepng, M 5.mp4" isHovering={isHovering} continuePlayback={true} reverseOnEnd={true} darkness={40} />
            <div className="absolute inset-0 bg-gradient-to-b from-dreamaker-purple/10 via-dreamaker-bg/60 to-dreamaker-bg/90 z-10"></div>
          </div>
          
          <div className="max-w-lg space-y-8 animate-fade-up relative z-20">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold gradient-text mb-2 text-white">Welcome to DREAMAKER</h1>
              <p className="text-xl text-gray-300">
                Your AI-powered music creation journey starts here
              </p>
              <div className="flex items-center gap-2 text-dreamaker-purple-light">
                <span>Join our community of creators</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            
            <div className="grid gap-6">
              {features.map((feature, index) => <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-dreamaker-gray/50 transition-colors duration-300">
                  <div className="p-3 bg-dreamaker-purple/20 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 p-8 backdrop-blur-sm min-h-screen bg-zinc-950">
          <div className="max-w-md mx-auto">
            {errorMessage && <Alert variant="destructive" className="animate-fade-in mb-6">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>}
            
            <div className="bg-dreamaker-gray rounded-lg p-6 shadow-xl border border-dreamaker-purple/20">
              <h2 className="text-2xl font-bold text-white mb-6">
                {mode === "signup" ? "Create Your Account" : "Welcome Back"}
              </h2>
              <SupabaseAuth supabaseClient={supabase} appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#9747FF',
                    brandAccent: '#B47EFF',
                    defaultButtonBackground: '#1E1E1E',
                    defaultButtonBackgroundHover: '#2D2D2D',
                    inputBackground: '#1E1E1E',
                    inputBorder: '#2D2D2D',
                    inputBorderHover: '#3D3D3D',
                    inputBorderFocus: '#9747FF'
                  }
                }
              },
              className: {
                container: 'bg-transparent',
                label: 'text-white',
                button: 'bg-dreamaker-purple hover:bg-dreamaker-purple-light text-white',
                input: 'bg-dreamaker-gray border-dreamaker-purple'
              }
            }} providers={[]} />
            </div>

            <div className="text-center text-sm text-gray-400 mt-6">
              <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
            </div>
          </div>
        </div>
      </div>
      <OnboardingWizard open={showOnboarding} onOpenChange={setShowOnboarding} />
    </>;
};
export default Auth;