
import { CollapsibleSection } from "../daw/CollapsibleSection";
import { ProjectInformation } from "../daw/sections/ProjectInformation";
import { PluginSettings } from "../daw/sections/PluginSettings";
import { useState } from "react";

export const ProjectView = () => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    info: false,
    parameters: false,
    plugins: false,
    routing: false
  });

  const handleToggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="space-y-6">
      <CollapsibleSection
        title="Project Information"
        sectionId="info"
        isCollapsed={collapsedSections.info}
        onToggle={handleToggleSection}
      >
        <ProjectInformation />
      </CollapsibleSection>

      <CollapsibleSection
        title="Project Parameters"
        sectionId="parameters"
        isCollapsed={collapsedSections.parameters}
        onToggle={handleToggleSection}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Tempo: <span className="text-white">128 BPM</span></p>
            <p className="text-gray-400">Time Signature: <span className="text-white">4/4</span></p>
            <p className="text-gray-400">Key: <span className="text-white">C Minor</span></p>
          </div>
          <div>
            <p className="text-gray-400">Sample Rate: <span className="text-white">48kHz</span></p>
            <p className="text-gray-400">Bit Depth: <span className="text-white">24-bit</span></p>
            <p className="text-gray-400">Buffer Size: <span className="text-white">256</span></p>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Plugin Manager"
        sectionId="plugins"
        isCollapsed={collapsedSections.plugins}
        onToggle={handleToggleSection}
      >
        <PluginSettings />
      </CollapsibleSection>

      <CollapsibleSection
        title="Signal Routing"
        sectionId="routing"
        isCollapsed={collapsedSections.routing}
        onToggle={handleToggleSection}
      >
        <div className="p-4 bg-black/40 rounded-lg">
          <p className="text-gray-400">Signal routing matrix will be displayed here</p>
        </div>
      </CollapsibleSection>
    </div>
  );
};
