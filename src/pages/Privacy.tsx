import { motion } from 'framer-motion';
import { VideoBackground } from '@/components/dreamaker/VideoBackground';
import { NavigationButton } from '@/components/persona/profile/header/NavigationButton';

export const Privacy = () => {
  return (
    <div className="min-h-screen relative bg-black">
      {/* Video Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
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
      <div className="relative z-10 container mx-auto px-4 py-24">
        {/* Back Button - positioned above the content */}
        <div className="mb-6">
          <NavigationButton />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-8 text-white text-center">Privacy Policy</h1>
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-8 space-y-6 text-gray-300">
            <p className="text-sm text-gray-400">Last Revised on October 2nd, 2024</p>

            <div className="space-y-6">
              <p>
                Welcome to the Privacy Policy for Dreamaker, operated by Dreamaker AI ("Company," "we" or "us"). 
                This Privacy Policy describes how we collect, use and disclose information from our users, 
                including with respect to our website, AI-powered music creation platform, persona management system, 
                voice modeling services, and related features (collectively, the "Services").
              </p>

              <p>
                For purposes of this Privacy Policy, "you" and "your" means you as the user of the Services. 
                If you use the Services on behalf of a company or other entity then "you" includes you and that entity, 
                and you represent and warrant that (a) you are an authorized representative of the entity with the 
                authority to bind the entity to these Terms, and (b) you agree to these Terms on the entity's behalf.
              </p>

              <div className="border-t border-white/10 pt-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Types of Information We Collect</h2>
                <p>We may collect the following categories of information from you ("Information"):</p>
                <ul className="list-disc pl-6 space-y-3 mt-4">
                  <li>
                    <span className="font-semibold text-white">Personal Information</span> - Information that identifies 
                    you, such as your name, email address, payment information, and account credentials. This includes 
                    registration data, voice samples for AI modeling, and persona creation details.
                  </li>
                  <li>
                    <span className="font-semibold text-white">Usage Information</span> - Data about how you interact 
                    with our Services, including AI-generated content, music creation patterns, and feature usage statistics.
                  </li>
                  <li>
                    <span className="font-semibold text-white">Content Information</span> - Any content you create, 
                    upload, or generate using our Services, including music, voice models, personas, and related metadata.
                  </li>
                </ul>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h2 className="text-2xl font-bold mb-4 text-white">How We Collect Your Information</h2>
                <ul className="list-disc pl-6 space-y-3">
                  <li>Direct collection when you create an account or use our Services</li>
                  <li>Automated collection through cookies and similar technologies</li>
                  <li>Generated data from your use of our AI and music creation tools</li>
                  <li>Information from third-party services you connect to your account</li>
                </ul>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Cookie Usage</h2>
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc pl-6 space-y-3 mt-4">
                  <li>
                    <span className="font-semibold text-white">Essential Cookies</span> - Required for basic platform 
                    functionality and security.
                  </li>
                  <li>
                    <span className="font-semibold text-white">Performance Cookies</span> - Help us understand and 
                    improve how users interact with our Services.
                  </li>
                  <li>
                    <span className="font-semibold text-white">Functionality Cookies</span> - Remember your preferences 
                    and settings for a better experience.
                  </li>
                </ul>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h2 className="text-2xl font-bold mb-4 text-white">How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-3">
                  <li>To provide and improve our AI-powered music creation services</li>
                  <li>To develop and train our voice modeling and persona creation systems</li>
                  <li>To personalize your experience and recommend relevant features</li>
                  <li>To maintain the security and integrity of our platform</li>
                  <li>To communicate with you about our Services and updates</li>
                </ul>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your information, 
                  including encryption, access controls, and regular security assessments. However, no method 
                  of transmission over the Internet or electronic storage is 100% secure.
                </p>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-3 mt-4">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Correct or update your personal information</li>
                  <li>Request deletion of your personal data</li>
                  <li>Object to or restrict certain processing activities</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                  <br />
                  <a href="mailto:privacy@dreamaker.ai" className="text-blue-400 hover:text-blue-300">
                    privacy@dreamaker.ai
                  </a>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};