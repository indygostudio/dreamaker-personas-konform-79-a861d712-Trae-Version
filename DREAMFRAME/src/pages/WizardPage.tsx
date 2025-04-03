
import React from "react";
import StoryWizard from "../components/wizard/StoryWizard";
import { StoryWizardProvider } from "../contexts/StoryWizardContext";
import { useNavigate } from "react-router-dom";

const WizardPage = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  return (
    <StoryWizardProvider onNavigate={handleNavigate}>
      <StoryWizard />
    </StoryWizardProvider>
  );
};

export default WizardPage;
