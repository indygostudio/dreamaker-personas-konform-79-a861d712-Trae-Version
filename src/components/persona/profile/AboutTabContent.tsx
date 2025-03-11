
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Music, Star, Clock, Check, Edit2, Save } from "lucide-react";
import type { Persona } from "@/types/persona";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { UseMutationResult } from "@tanstack/react-query";

interface AboutTabContentProps {
  persona: Persona;
  isOwner: boolean;
  isAboutEditing: boolean;
  aboutForm: {
    description: string;
    voice_type: string;
    genre_specialties: string[];
    artist_category: string;
    vocal_style: string;
  };
  setAboutForm: React.Dispatch<React.SetStateAction<{
    description: string;
    voice_type: string;
    genre_specialties: string[];
    artist_category: string;
    vocal_style: string;
  }>>;
  handleAboutEditClick: () => void;
  handleAboutSave: () => void;
  updateMutation: UseMutationResult<any, unknown, any, unknown>;
}

export const AboutTabContent: React.FC<AboutTabContentProps> = ({
  persona,
  isOwner,
  isAboutEditing,
  aboutForm,
  setAboutForm,
  handleAboutEditClick,
  handleAboutSave,
  updateMutation
}) => {
  const { colors } = useColorScheme();

  const sectionStyle = {
    backgroundColor: colors.background,
    borderColor: colors.primary,
    color: colors.text
  };

  const cardStyle = {
    backgroundColor: `${colors.secondary}`,
    borderColor: `${colors.primary}`,
    color: colors.text
  };

  const headingStyle = {
    color: colors.text
  };

  const buttonStyle = {
    backgroundColor: colors.primary,
    color: colors.text
  };

  const textStyle = {
    color: colors.text
  };

  const iconStyle = {
    color: colors.primary
  };

  const inputStyle = {
    backgroundColor: `${colors.background}`,
    borderColor: colors.primary,
    color: colors.text
  };

  return (
    <div className="text-white space-y-8">
      <div 
        className="rounded-xl p-6 border border-opacity-20" 
        style={sectionStyle}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold" style={headingStyle}>Voice Overview</h3>
          {isOwner && (
            isAboutEditing ? (
              <Button 
                onClick={handleAboutSave} 
                variant="outline" 
                className="gap-2 hover:opacity-80" 
                disabled={updateMutation.isPending}
                style={buttonStyle}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            ) : (
              <Button 
                onClick={handleAboutEditClick} 
                variant="outline" 
                className="gap-2 hover:opacity-80"
                style={buttonStyle}
              >
                <Edit2 className="w-4 h-4" />
                Edit Details
              </Button>
            )
          )}
        </div>

        {isAboutEditing ? (
          <div className="space-y-4">
            <Textarea 
              value={aboutForm.description} 
              onChange={e => setAboutForm(prev => ({
                ...prev,
                description: e.target.value
              }))} 
              style={inputStyle}
              className="border-opacity-30" 
              placeholder="Enter voice description..." 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block" style={{ color: colors.text + '90' }}>Voice Type</label>
                <Input 
                  value={aboutForm.voice_type} 
                  onChange={e => setAboutForm(prev => ({
                    ...prev,
                    voice_type: e.target.value
                  }))} 
                  style={inputStyle}
                  className="border-opacity-30" 
                  placeholder="e.g., Smooth Rock" 
                />
              </div>
              <div>
                <label className="text-sm mb-2 block" style={{ color: colors.text + '90' }}>Genre Specialties</label>
                <Input 
                  value={aboutForm.genre_specialties.join(", ")} 
                  onChange={e => setAboutForm(prev => ({
                    ...prev,
                    genre_specialties: e.target.value.split(",").map(g => g.trim())
                  }))} 
                  style={inputStyle}
                  className="border-opacity-30" 
                  placeholder="e.g., Rock, Pop, Blues" 
                />
              </div>
              <div>
                <label className="text-sm mb-2 block" style={{ color: colors.text + '90' }}>Artist Category</label>
                <Input 
                  value={aboutForm.artist_category} 
                  onChange={e => setAboutForm(prev => ({
                    ...prev,
                    artist_category: e.target.value
                  }))} 
                  style={inputStyle}
                  className="border-opacity-30" 
                  placeholder="e.g., Singer, Rapper, Producer" 
                />
              </div>
              <div>
                <label className="text-sm mb-2 block" style={{ color: colors.text + '90' }}>Vocal Style</label>
                <Input 
                  value={aboutForm.vocal_style} 
                  onChange={e => setAboutForm(prev => ({
                    ...prev,
                    vocal_style: e.target.value
                  }))} 
                  style={inputStyle}
                  className="border-opacity-30" 
                  placeholder="e.g., Raspy, Smooth, Powerful" 
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="leading-relaxed" style={textStyle}>
              {persona.description || "A versatile AI voice designed for professional music production. Perfect for creating smooth, emotive vocals with natural phrasing and authentic expression."}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <Card className="border border-opacity-20" style={cardStyle}>
                <CardContent className="p-4 flex items-start space-x-3">
                  <Mic className="w-5 h-5" style={iconStyle} />
                  <div>
                    <h4 className="font-medium" style={textStyle}>Voice Type</h4>
                    <p style={{ color: colors.text + '80' }} className="text-sm">
                      {persona.voice_type || "Smooth Rock"}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-opacity-20" style={cardStyle}>
                <CardContent className="p-4 flex items-start space-x-3">
                  <Music className="w-5 h-5" style={iconStyle} />
                  <div>
                    <h4 className="font-medium" style={textStyle}>Genre</h4>
                    <p style={{ color: colors.text + '80' }} className="text-sm">
                      {persona.genre_specialties?.join(", ") || "Rock, Pop, Blues"}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-opacity-20" style={cardStyle}>
                <CardContent className="p-4 flex items-start space-x-3">
                  <Star className="w-5 h-5" style={iconStyle} />
                  <div>
                    <h4 className="font-medium" style={textStyle}>Rating</h4>
                    <p style={{ color: colors.text + '80' }} className="text-sm">4.8/5.0</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-opacity-20" style={cardStyle}>
                <CardContent className="p-4 flex items-start space-x-3">
                  <Clock className="w-5 h-5" style={iconStyle} />
                  <div>
                    <h4 className="font-medium" style={textStyle}>Generation Time</h4>
                    <p style={{ color: colors.text + '80' }} className="text-sm">~30 seconds</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      <div 
        className="rounded-xl p-6 border border-opacity-20" 
        style={sectionStyle}
      >
        <h3 className="text-2xl font-semibold mb-4" style={headingStyle}>Perfect For</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["Professional music production", "Commercial projects", "Cover songs", "Original compositions", "Demo recordings", "Backup vocals"].map(useCase => (
            <div key={useCase} className="flex items-center space-x-2">
              <Check className="w-5 h-5" style={iconStyle} />
              <span style={{ color: colors.text + '90' }}>{useCase}</span>
            </div>
          ))}
        </div>
      </div>

      <div 
        className="rounded-xl p-6 border border-opacity-20" 
        style={sectionStyle}
      >
        <h3 className="text-2xl font-semibold mb-6" style={headingStyle}>Voice Characteristics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg mb-4" style={headingStyle}>Tone Quality</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: colors.text + '80' }}>Warmth</span>
                  <span style={{ color: colors.text + '80' }}>85%</span>
                </div>
                <Slider defaultValue={[85]} max={100} step={1} disabled />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: colors.text + '80' }}>Clarity</span>
                  <span style={{ color: colors.text + '80' }}>90%</span>
                </div>
                <Slider defaultValue={[90]} max={100} step={1} disabled />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg mb-4" style={headingStyle}>Performance</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: colors.text + '80' }}>Expression</span>
                  <span style={{ color: colors.text + '80' }}>88%</span>
                </div>
                <Slider defaultValue={[88]} max={100} step={1} disabled />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: colors.text + '80' }}>Consistency</span>
                  <span style={{ color: colors.text + '80' }}>95%</span>
                </div>
                <Slider defaultValue={[95]} max={100} step={1} disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
