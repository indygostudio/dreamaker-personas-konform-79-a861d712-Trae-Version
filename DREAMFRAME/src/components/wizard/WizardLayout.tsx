
import React from "react";
import { Button } from "@/components/ui/button";
import { useStoryWizard } from "../../contexts/StoryWizardContext";
import { Link, useNavigate } from "react-router-dom";
import VideoBackground from "../VideoBackground";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";

interface WizardLayoutProps {
  children: React.ReactNode;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  showFinishButton?: boolean;
  onNextClick?: () => void;
  onBackClick?: () => void;
  pageTitle?: string;
}

const WizardLayout: React.FC<WizardLayoutProps> = ({
  children,
  nextDisabled = false,
  backDisabled = false,
  showFinishButton = false,
  onNextClick,
  onBackClick,
  pageTitle
}) => {
  const { currentStep, setCurrentStep, loadIntoEditor, isLoading } = useStoryWizard();
  const navigate = useNavigate();
  
  const handleNext = async () => {
    if (onNextClick) {
      onNextClick();
    } else if (showFinishButton) {
      const success = await loadIntoEditor();
      if (success) {
        // Navigate to storyboard page after successful load
        navigate("/storyboard");
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      setCurrentStep(Math.max(1, currentStep - 1));
    }
  };
  
  const goToHomePage = () => {
    navigate("/");
  };
  
  // Hide back button on first step
  const isFirstStep = currentStep === 1;
  
  return (
    <div className="min-h-screen flex flex-col backdrop-blur-xl bg-black/40">
      {/* Top navigation bar */}
      <div className="border-b border-white/10 bg-black/60 backdrop-blur-md">
        <div className="container mx-auto">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-white font-bold text-xl">DREAMFRAME</Link>
              
              <div className="flex items-center">
                <StepButton
                  step={1}
                  currentStep={currentStep}
                  onClick={() => setCurrentStep(1)}
                  label="CONCEPT"
                />
                <div className="text-white/30 mx-1">›</div>
                <StepButton
                  step={2}
                  currentStep={currentStep}
                  onClick={() => currentStep >= 2 ? setCurrentStep(2) : null}
                  label="STORYLINE"
                  disabled={currentStep < 2}
                />
                <div className="text-white/30 mx-1">›</div>
                <StepButton
                  step={3}
                  currentStep={currentStep}
                  onClick={() => currentStep >= 3 ? setCurrentStep(3) : null}
                  label="SETTINGS & CAST"
                  disabled={currentStep < 3}
                />
                <div className="text-white/30 mx-1">›</div>
                <StepButton
                  step={4}
                  currentStep={currentStep}
                  onClick={() => currentStep >= 4 ? setCurrentStep(4) : null}
                  label="BREAKDOWN"
                  disabled={currentStep < 4}
                />
                <div className="text-white/30 mx-1">›</div>
                <StepButton
                  step={5}
                  currentStep={currentStep}
                  onClick={() => currentStep >= 5 ? setCurrentStep(5) : null}
                  label="LOAD INTO EDITOR"
                  disabled={currentStep < 5}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation buttons moved to top with centered title */}
      <div className="bg-black/70 backdrop-blur-md border-b border-white/10 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Show Home button only on first step, otherwise show Back button */}
          {isFirstStep ? (
            <Button
              variant="glass"
              onClick={goToHomePage}
              className="border-white/10 hover:bg-black/80 text-white"
            >
              <Home className="mr-2 h-4 w-4" /> Home
            </Button>
          ) : (
            <Button
              variant="glass"
              onClick={handleBack}
              className="border-white/10 hover:bg-black/80 text-white"
              disabled={backDisabled}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          )}
          
          {pageTitle && (
            <h1 className="text-3xl font-bold text-white">{pageTitle}</h1>
          )}
          
          <Button
            onClick={handleNext}
            disabled={nextDisabled || isLoading}
            className="bg-[#0047FF] hover:bg-[#0033CC] text-white"
          >
            {isLoading ? "Loading..." : showFinishButton ? "Finish" : (
              <>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-grow relative">
        <VideoBackground videoSrc="/Videos/KONFORM_BG_03.mp4" opacity={0.2} />
        <div className="container mx-auto px-4 py-8 relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

interface StepButtonProps {
  step: number;
  currentStep: number;
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

const StepButton: React.FC<StepButtonProps> = ({ 
  step, 
  currentStep, 
  onClick, 
  label,
  disabled = false
}) => {
  const isActive = step === currentStep;
  const isPast = currentStep > step;
  
  return (
    <button
      className={`px-4 py-2 rounded font-medium ${
        isActive 
          ? "text-white bg-[#0047FF]" 
          : isPast 
              ? "text-gray-300 hover:text-white" 
              : disabled 
                  ? "text-gray-600 cursor-not-allowed" 
                  : "text-gray-400 hover:text-white"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default WizardLayout;
