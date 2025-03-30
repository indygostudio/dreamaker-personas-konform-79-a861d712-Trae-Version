import { AudioSystemShowcase } from "../examples/AudioSystemShowcase";

export function AudioSystemDemoPage() {
  return (
    <div className="min-h-screen py-12 px-4 pt-[84px] bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Unified Audio System Demo
        </h1>
        
        <p className="text-lg text-center text-gray-300 mb-12">
          Experience the new premium audio playback system with enhanced visualizations
        </p>
        
        <AudioSystemShowcase />
        
        <div className="mt-12 text-center text-sm text-gray-400">
          <p>This demo showcases the new unified audio system implemented across the application.</p>
          <p>The same system powers all audio playback in personas, artist profiles, and cards.</p>
        </div>
      </div>
    </div>
  );
}