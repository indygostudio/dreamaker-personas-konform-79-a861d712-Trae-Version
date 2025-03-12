import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl: string;
  author: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Introducing AI-Powered Music Generation",
    excerpt: "Learn how our new AI models can help you create professional-quality music in minutes.",
    date: "April 15, 2024",
    category: "Product Updates",
    imageUrl: "/public/lovable-uploads/c589acaa-fd9a-47bc-a181-2508ab0dbaf2.png",
    author: "Alex Chen"
  },
  {
    id: "2",
    title: "5 Ways to Use Personas in Your Music Production",
    excerpt: "Discover creative techniques for incorporating AI personas into your workflow.",
    date: "April 10, 2024",
    category: "Tutorials",
    imageUrl: "/public/lovable-uploads/b5b69b2c-5acc-4e9c-80a5-cec2f13703d5.png",
    author: "Maya Johnson"
  },
  {
    id: "3",
    title: "The Future of Audio Production with KONFORM",
    excerpt: "Explore how our professional DAW is changing the landscape of music creation.",
    date: "April 5, 2024",
    category: "Industry Insights",
    imageUrl: "/public/lovable-uploads/7c40c35f-6869-4605-8ca1-37c9dd0d24d5.png",
    author: "David Williams"
  },
  {
    id: "4",
    title: "Behind the Scenes: How We Built Dreamaker",
    excerpt: "An inside look at the technology and vision behind our flagship music generation platform.",
    date: "March 28, 2024",
    category: "Company News",
    imageUrl: "/public/lovable-uploads/4fcaace6-9ca6-4012-8e19-966bfcd94cc4.png",
    author: "Sarah Miller"
  },
  {
    id: "5",
    title: "AI Vocalists vs. Human Singers: A Comparison",
    excerpt: "We analyze the strengths and limitations of AI-generated vocals in modern music production.",
    date: "March 20, 2024",
    category: "Industry Insights",
    imageUrl: "/public/lovable-uploads/6ceede82-7822-439b-89e9-302abd648d82.png",
    author: "James Rodriguez"
  },
  {
    id: "6",
    title: "Getting Started with Dreamaker: A Beginner's Guide",
    excerpt: "Everything you need to know to start creating amazing music with our AI platform.",
    date: "March 15, 2024",
    category: "Tutorials",
    imageUrl: "/public/lovable-uploads/a4975e49-91b3-4923-85ca-6916aa5bd37e.png",
    author: "Emily Zhang"
  }
];

const CATEGORIES = [
  "All",
  "Product Updates",
  "Tutorials",
  "Industry Insights",
  "Company News"
];

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-dreamaker-bg text-white">
      {/* Header Section */}
      <div className="relative py-20 px-4 bg-gradient-to-b from-black to-dreamaker-bg">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Blog</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Insights, tutorials, and updates from the world of AI-powered music production
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              type="text" 
              placeholder="Search articles..." 
              className="pl-10 bg-black/40 border-blue-900/30 text-white" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(category => (
              <Badge 
                key={category} 
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 ${selectedCategory === category ? 'bg-blue-600' : 'hover:bg-blue-900/30'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredPosts.map(post => (
            <Card 
              key={post.id} 
              className="bg-black/60 backdrop-blur-xl border border-blue-900/20 overflow-hidden hover:border-blue-500/30 transition-all duration-300 group"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                  <Calendar size={14} />
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <Badge variant="outline" className="text-xs bg-blue-900/20 text-blue-400">
                    {post.category}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">By {post.author}</span>
                  <Button variant="link" className="text-blue-400 p-0 hover:text-blue-300">
                    Read More
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-8 mb-16">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-gray-300">Get the latest updates, tutorials, and insights delivered to your inbox</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow bg-black/40 border-blue-900/30"
            />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;