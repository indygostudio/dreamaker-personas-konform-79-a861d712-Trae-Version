import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Mic2, User, Image, FileText, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VoiceCloning } from "@/components/persona/profile/voice-design/VoiceCloning";

interface TabContentProps {
  title: string;
  description: string;
}

const VoiceCloningContent = ({ title, description }: TabContentProps) => (
  <div className="glass-panel p-6 rounded-xl">
    <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
    <p className="text-gray-300 mb-6">{description}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-panel p-4 rounded-xl border border-purple-500/20 hover:border-purple-500/60 transition-all">
        <h3 className="text-xl font-semibold text-white mb-2">Voice Training</h3>
        <p className="text-gray-400">Upload voice samples and train our AI to clone any voice with remarkable accuracy. Fine-tune accent, pitch, and emotional range.</p>
      </div>
      <div className="glass-panel p-4 rounded-xl border border-purple-500/20 hover:border-purple-500/60 transition-all">
        <h3 className="text-xl font-semibold text-white mb-2">Voice Customization</h3>
        <p className="text-gray-400">Adjust vocal characteristics like breathiness, vibrato, and tone to create unique vocal signatures for your personas.</p>
      </div>
      <div className="glass-panel p-4 rounded-xl border border-purple-500/20 hover:border-purple-500/60 transition-all">
        <h3 className="text-xl font-semibold text-white mb-2">Genre Adaptation</h3>
        <p className="text-gray-400">Optimize voices for specific musical genres, from rap and pop to classical and electronic music.</p>
      </div>
      <div className="glass-panel p-4 rounded-xl border border-purple-500/20 hover:border-purple-500/60 transition-all">
        <h3 className="text-xl font-semibold text-white mb-2">Multilingual Support</h3>
        <p className="text-gray-400">Create personas that can sing and speak in multiple languages with authentic pronunciation and inflection.</p>
      </div>
    </div>
  </div>
);

const CharacterDevelopmentContent = ({ title, description }: TabContentProps) => (
  <div className="glass-panel p-6 rounded-xl">
    <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
    <p className="text-gray-300 mb-6">{description}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-panel p-4 rounded-xl border border-blue-500/20 hover:border-blue-500/60 transition-all">
        <h3 className="text-xl font-semibold text-white mb-2">Persona Backstory</h3>
        <p className="text-gray-400">Craft detailed character histories, motivations, and artistic journeys that give depth to your AI personas.</p>
      </div>
      <div className="glass-panel p-4 rounded-xl border border-blue-500/20 hover:border-blue-500/60 transition-all">
        <h3 className="text-xl font-semibold text-white mb-2">Personality Traits</h3>
        <p className="text-gray-400">Define unique personality characteristics that influence how your persona creates and interacts with audiences.</p>
      </div>
      <div className="glass-panel p-4 rounded-xl border border-blue-500/20 hover:border-blue-500/60 transition-all">
        <h3 className="text-xl font-semibold text-white mb-2">Artistic Influences</h3>
        <p className="text-gray-400">Specify musical and artistic influences that shape your persona's creative style and output.</p>
      </div>
      <div className="glass-panel p-4 rounded-xl border border-blue-500/20 hover:border-blue-500/60 transition-all">
        <h3 className="text-xl font-semibold text-white mb-2">Evolution System</h3>
        <p className="text-gray-400">Create personas that grow and evolve over time, developing their style based on interactions and creative output.</p>
      </div>
    </div>
  </div>
);

const VisualIdentityContent = ({ title, description }: TabContentProps) => (
  <div className="glass-panel p-6 rounded-xl">
    <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
    <p className="text-gray-300 mb-6">{description}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 hover:border-emerald-500/60 transition-all">
        <h3 className="text-xl font-semibold text-white mb-2">AI Avatar Generation</h3>
        <p className="text-gray-400">Create stunning, realistic avatars for your personas using our advanced image generation technology.</p>
      </div>
      <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 hover:border-emerald-500/60 transition-all">
        <h3 className="text-xl font-semibold text-white mb-2">Style Consistency</h3>
        <p className="text-gray-400">Maintain visual consistency across all persona content with style-matching algorithms.</p>
      </div>
      <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 hover:border-emerald-500/60 transition-all">
        <h3 className="text-xl font-semibold text-white mb-2">Brand Elements</h3>
        <p className="text-gray-400">Design logos, color schemes, and visual motifs that reinforce your persona's unique brand identity.</p>
      </div>
      <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 hover:border-emerald-500/60 transition-all">
        <h3 className="text-xl font-semibold text-white mb-2">Animation Options</h3>
        <p className="text-gray-400">Bring your personas to life with customizable animations and dynamic visual elements.</p>
      </div>
    </div>
  </div>
);

const ContentGenerationContent = ({ title, description }: TabContentProps) => (
  <div className="glass-panel p-6 rounded-xl">
    <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
    <p className="text-gray-300 mb-6">{description}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-panel p-4 rounded-xl border border-pink-500/20 hover:border-pink-500/60 transition-all">
        <h3 className="text-xl font-semibold text-white mb-2">Lyric Generation</h3>
        <p className="text-gray-400">Create original lyrics in your persona's unique style and voice, with control over themes and emotional tone.</p>
      </div>
      <div className="glass-panel p-4 rounded-xl border border-pink-500/20 hover:border-pink-500/60 transition-all">
        <h3 className="text-xl font-semibold text-white mb-2">Music Composition</h3>
        <p className="text-gray-400">Generate musical compositions tailored to your persona's genre and style preferences.</p>
      </div>
      <div className="glass-panel p-4 rounded-xl border border-pink-500/20 hover:border-pink-500/60 transition-all">
        <h3 className="text-xl font-semibold text-white mb-2">Social Media Content</h3>
        <p className="text-gray-400">Automatically create engaging social posts and interactions that maintain your persona's authentic voice.</p>
      </div>
      <div className="glass-panel p-4 rounded-xl border border-pink-500/20 hover:border-pink-500/60 transition-all">
        <h3 className="text-xl font-semibold text-white mb-2">Collaborative Creation</h3>
        <p className="text-gray-400">Enable your personas to collaborate with each other or with human artists to create unique content.</p>
      </div>
    </div>
  </div>
);

export const PersonaTabs = () => {
  const [activeTab, setActiveTab] = useState("voice-cloning");
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
        <TabsList className="flex justify-center items-center gap-2 w-full rounded-full mb-4 p-1.5 bg-black/60 backdrop-blur-xl">
          <TabsTrigger 
            value="voice-cloning" 
            className="flex-1 w-full min-width-[120px] px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
            text-white/80 data-[state=active]:bg-[#9333EA]/10 data-[state=active]:text-white data-[state=active]:border-[#9333EA]/20 data-[state=active]:shadow-[0_4px_20px_rgba(147,51,234,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#9333EA]/10 hover:text-white hover:border-[#9333EA]/20 hover:shadow-[0_4px_20px_rgba(147,51,234,0.3)] hover:-translate-y-0.5 text-center"
          >
            <Mic2 className="w-4 h-4 mr-2" />
            VOICE CLONING
          </TabsTrigger>
          <TabsTrigger 
            value="character-development" 
            className="flex-1 min-width-[120px] px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
            text-white/80 data-[state=active]:bg-[#9333EA]/10 data-[state=active]:text-white data-[state=active]:border-[#9333EA]/20 data-[state=active]:shadow-[0_4px_20px_rgba(147,51,234,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#9333EA]/10 hover:text-white hover:border-[#9333EA]/20 hover:shadow-[0_4px_20px_rgba(147,51,234,0.3)] hover:-translate-y-0.5 text-center"
          >
            <User className="w-4 h-4 mr-2" />
            CHARACTER DEVELOPMENT
          </TabsTrigger>
          <TabsTrigger 
            value="visual-identity" 
            className="flex-1 min-width-[120px] px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
            text-white/80 data-[state=active]:bg-[#9333EA]/10 data-[state=active]:text-white data-[state=active]:border-[#9333EA]/20 data-[state=active]:shadow-[0_4px_20px_rgba(147,51,234,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#9333EA]/10 hover:text-white hover:border-[#9333EA]/20 hover:shadow-[0_4px_20px_rgba(147,51,234,0.3)] hover:-translate-y-0.5 text-center"
          >
            <Image className="w-4 h-4 mr-2" />
            VISUAL IDENTITY
          </TabsTrigger>
          <TabsTrigger 
            value="content-generation" 
            className="flex-1 min-width-[120px] px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
            text-white/80 data-[state=active]:bg-[#9333EA]/10 data-[state=active]:text-white data-[state=active]:border-[#9333EA]/20 data-[state=active]:shadow-[0_4px_20px_rgba(147,51,234,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#9333EA]/10 hover:text-white hover:border-[#9333EA]/20 hover:shadow-[0_4px_20px_rgba(147,51,234,0.3)] hover:-translate-y-0.5 text-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            CONTENT GENERATION
          </TabsTrigger>
        </TabsList>

        <div className="mt-2">
          <TabsContent value="voice-cloning">
            <div className="glass-panel p-6 rounded-xl">
              <h2 className="text-3xl font-bold text-white mb-4">Voice Cloning Technology</h2>
              <p className="text-gray-300 mb-6">Our advanced voice cloning technology allows you to create incredibly realistic AI voices that capture the nuance and character of any vocal style. Upload samples, train models, and fine-tune every aspect of your persona's voice.</p>
              <VoiceCloning personaId="default" />
            </div>
          </TabsContent>
          <TabsContent value="character-development">
            <CharacterDevelopmentContent 
              title="Character Development" 
              description="Build rich, compelling personas with detailed backstories, unique personality traits, and artistic influences. Our character development system helps you create virtual artists that feel authentic and engaging."
            />
          </TabsContent>
          <TabsContent value="visual-identity">
            <VisualIdentityContent 
              title="Visual Identity Creation" 
              description="Design stunning visual representations for your personas with our AI-powered image generation tools. Create consistent visual branding across all persona content."
            />
          </TabsContent>
          <TabsContent value="content-generation">
            <ContentGenerationContent 
              title="Content Generation" 
              description="Empower your personas to create original content including lyrics, music, and social media posts. Our AI-powered content generation tools help your personas express themselves authentically."
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>