
export const FeatureCards = () => {
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
      <div className="relative overflow-hidden bg-black border border-blue-500/20 hover:border-blue-500/60 transition-all duration-300 p-8 rounded-lg shadow-lg hover:shadow-blue-500/20 group">
        <div className="relative z-10">
          <h3 className="text-xl font-semibold mb-4 font-syne text-white group-hover:text-blue-400 transition-colors">AI Voice Generation</h3>
          <p className="text-gray-400 font-syne group-hover:text-gray-300 transition-colors">
            Generate unique, expressive voices for your virtual artist using advanced AI voice synthesis. Create voices that capture any style, emotion, or character with remarkable realism and flexibility. Perfect for crafting distinct vocal identities that stand out in the digital landscape.
          </p>
        </div>
      </div>
      
      <div className="relative overflow-hidden bg-black border border-sky-500/20 hover:border-sky-500/60 transition-all duration-300 p-8 rounded-lg shadow-lg hover:shadow-sky-500/20 group">
        <div className="relative z-10">
          <h3 className="text-xl font-semibold mb-4 font-syne text-white group-hover:text-sky-400 transition-colors">Style Transfer</h3>
          <p className="text-gray-400 font-syne group-hover:text-gray-300 transition-colors">
            Transform your compositions by applying different musical styles and genres seamlessly. Our sophisticated AI analyzes the core elements of your music and intelligently applies the characteristics of any genre - from classical to EDM, jazz to hip-hop. Experiment with unlimited creative possibilities while maintaining your original vision.
          </p>
        </div>
      </div>
      
      <div className="relative overflow-hidden bg-black border border-indigo-500/20 hover:border-indigo-500/60 transition-all duration-300 p-8 rounded-lg shadow-lg hover:shadow-indigo-500/20 group">
        <div className="relative z-10">
          <h3 className="text-xl font-semibold mb-4 font-syne text-white group-hover:text-indigo-400 transition-colors">Persona Creation</h3>
          <p className="text-gray-400 font-syne group-hover:text-gray-300 transition-colors">
            Design fully realized virtual artists with rich backstories, visual identities, and personality traits. Build memorable characters with distinct musical preferences, creative visions, and artistic trajectories. Our AI helps craft consistent, believable personas that can evolve and grow with your creative vision across all your projects.
          </p>
        </div>
      </div>
    </div>;
};
