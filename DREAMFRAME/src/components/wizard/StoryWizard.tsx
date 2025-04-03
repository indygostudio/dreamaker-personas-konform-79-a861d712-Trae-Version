
import React from "react";
import { useStoryWizard } from "../../contexts/StoryWizardContext";
import ConceptStep from "./ConceptStep";
import StorylineStep from "./StorylineStep";
import SettingsStep from "./SettingsStep";
import BreakdownStep from "./BreakdownStep";
import FinalStep from "./FinalStep";
import WizardLayout from "./WizardLayout";

const StoryWizard: React.FC = () => {
  const { currentStep } = useStoryWizard();
  
  // Determine the page title based on current step
  const getPageTitle = () => {
    switch (currentStep) {
      case 1:
        return "Create Your Concept";
      case 2:
        return "Develop Your Storyline";
      case 3:
        return "Settings & Cast";
      case 4:
        return "Scene Breakdown";
      case 5:
        return "Ready to Load";
      default:
        return "Create Your Story";
    }
  };
  
  // Determine if the current step is the final step
  const isLastStep = currentStep === 5;
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ConceptStep />;
      case 2:
        return <StorylineStep />;
      case 3:
        return <SettingsStep />;
      case 4:
        return <BreakdownStep />;
      case 5:
        return <FinalStep />;
      default:
        return <ConceptStep />;
    }
  };
  
  return (
    <WizardLayout 
      pageTitle={getPageTitle()}
      showFinishButton={isLastStep}
    >
      <div className="h-full w-full flex-1 flex dark-glass-card overflow-auto">
        {renderStep()}
      </div>
    </WizardLayout>
  );
};

export default StoryWizard;
