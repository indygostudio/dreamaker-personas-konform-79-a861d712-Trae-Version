import { VideoBackground } from "@/components/dreamaker/VideoBackground";
import { motion } from "framer-motion";

export const About = () => {
  return (
    <div className="min-h-screen relative bg-black flex flex-col">
      {/* Video Background with gradient overlay */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <VideoBackground
          videoUrl="/Videos/KONFORM_BG_04.mp4"
          isHovering={false}
          continuePlayback={true}
          reverseOnEnd={true}
          autoPlay={true}
          darkness={0.7}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl font-bold mb-8 text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
            About Dreamaker
          </h1>
          <div className="space-y-6 text-lg text-gray-300">
            <p>
              Dreamaker is a revolutionary platform that combines artificial intelligence with music creation, enabling artists and producers to explore new frontiers in sound and creativity. Our mission is to empower creators with cutting-edge AI tools while preserving the authenticity and emotion that makes music truly special.
            </p>
            <p>
              Through our suite of products - Konform, Personas, and the AI Marketplace - we're building a comprehensive ecosystem where technology meets artistry. Whether you're a seasoned producer or just starting your musical journey, Dreamaker provides the tools and community to help bring your vision to life.
            </p>
            <p>
              Our team consists of passionate musicians, developers, and AI researchers working together to push the boundaries of what's possible in music production. We believe in a future where AI enhances human creativity rather than replacing it, and we're committed to developing tools that inspire and empower artists worldwide.
            </p>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="p-6 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-300">
            <h3 className="text-xl font-bold mb-4 text-white">Innovation</h3>
            <p className="text-gray-400">
              Pushing the boundaries of music production with state-of-the-art AI technology and creative tools.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-300">
            <h3 className="text-xl font-bold mb-4 text-white">Community</h3>
            <p className="text-gray-400">
              Building a vibrant ecosystem of artists, producers, and creators who inspire and support each other.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-300">
            <h3 className="text-xl font-bold mb-4 text-white">Future</h3>
            <p className="text-gray-400">
              Shaping the future of music creation through the seamless integration of AI and human creativity.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;