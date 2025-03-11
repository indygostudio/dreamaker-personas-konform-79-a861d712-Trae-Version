interface FeatureCard {
  title: string;
  description: string;
}

export const FeatureCards = () => {
  const features: FeatureCard[] = [
    {
      title: "AI-Powered Artists",
      description: "Create virtual artists with unique personalities, styles, and voices using advanced AI technology.",
    },
    {
      title: "Collaboration Tools",
      description: "Work together with other creators and virtual artists to produce amazing music.",
    },
    {
      title: "Music Distribution",
      description: "Share your music with the world and build your audience through our platform.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {features.map((feature, index) => (
        <div key={index} className="bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
          <h3 className="text-2xl font-bold mb-4 font-syne">{feature.title}</h3>
          <p className="text-gray-400">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};