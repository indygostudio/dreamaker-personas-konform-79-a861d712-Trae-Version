
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
import { VideoBackground } from "@/components/persona/VideoBackground";

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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderColor: '#8B5CF6',
    boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
    color: '#fff'
  };

  const cardStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderColor: '#8B5CF6',
    boxShadow: '0 0 15px rgba(139, 92, 246, 0.2)',
    color: '#fff'
  };

  const headingStyle = {
    color: '#fff',
    textShadow: '0 0 10px rgba(139, 92, 246, 0.5)'
  };

  const buttonStyle = {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: '#8B5CF6',
    color: '#fff',
    boxShadow: '0 0 10px rgba(139, 92, 246, 0.2)'
  };

  const textStyle = {
    color: '#fff'
  };

  const iconStyle = {
    color: '#8B5CF6'
  };

  const inputStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderColor: '#8B5CF6',
    color: '#fff',
    boxShadow: '0 0 10px rgba(139, 92, 246, 0.2)'
  };

  return (
    <div className="text-white space-y-8 relative">
      {/* Video Background with gradient overlay */}
      <div className="absolute inset-0 z-0 rounded-lg overflow-hidden">
        <VideoBackground
          videoUrl={persona.video_url || null}
          isHovering={false}
          continuePlayback={true}
          reverseOnEnd={true}
          autoPlay={true}
          darkness={0.7}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
      </div>
      
      <div 
        className="rounded-xl p-6 border border-opacity-20 relative z-10" 
        style={sectionStyle}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold" style={headingStyle}>Personas Overview</h3>
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

      {/* New Owner and Stats Section */}
      <div 
        className="rounded-xl p-6 border border-opacity-20 relative z-10 mt-8" 
        style={sectionStyle}
      >
        <h3 className="text-2xl font-semibold mb-4" style={headingStyle}>Persona Owner & Statistics</h3>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Owner Information */}
          <div className="flex-1 flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2" style={{ borderColor: colors.primary }}>
              <img 
                src={persona.creator_avatar_url || persona.avatar_url || '/placeholder.svg'} 
                alt="Creator" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-medium text-lg" style={textStyle}>Created by</h4>
              <p className="text-xl font-semibold" style={{ color: colors.primary }}>
                {persona.creator_name || persona.owner_name || 'Unknown Creator'}
              </p>
              <p className="text-sm opacity-70" style={textStyle}>
                {new Date(persona.created_at || Date.now()).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          {/* Statistics */}
          <div className="flex-1">
            <h4 className="font-medium mb-3" style={textStyle}>Persona Statistics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-opacity-20" style={cardStyle}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h5 className="font-medium" style={textStyle}>Likes</h5>
                    <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                      {persona.likes_count || 0}
                    </p>
                  </div>
                  <Star className="w-8 h-8 opacity-20" style={iconStyle} />
                </CardContent>
              </Card>
              
              <Card className="border border-opacity-20" style={cardStyle}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h5 className="font-medium" style={textStyle}>Users</h5>
                    <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                      {persona.user_count || 0}
                    </p>
                  </div>
                  <Mic className="w-8 h-8 opacity-20" style={iconStyle} />
                </CardContent>
              </Card>
              
              <Card className="border border-opacity-20" style={cardStyle}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h5 className="font-medium" style={textStyle}>Followers</h5>
                    <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                      {persona.followers_count || 0}
                    </p>
                  </div>
                  <Music className="w-8 h-8 opacity-20" style={iconStyle} />
                </CardContent>
              </Card>
            </div>
          </div>
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
