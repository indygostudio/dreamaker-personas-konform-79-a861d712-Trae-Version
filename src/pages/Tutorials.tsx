
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  readTime: string;
  date: string;
}

const tutorials: Tutorial[] = [
  {
    id: "1",
    title: "Getting Started with AI Voice Generation",
    description: "Learn how to create your first AI-generated voice track using our platform. This comprehensive guide will walk you through the basics.",
    category: "Beginners",
    imageUrl: "/lovable-uploads/1b5fab73-d15a-4f30-b83e-5fef94887940.png",
    readTime: "5 min read",
    date: "Apr 15, 2024"
  },
  {
    id: "2",
    title: "Advanced Voice Training Techniques",
    description: "Deep dive into advanced voice training methods to achieve more natural and expressive AI-generated vocals.",
    category: "Advanced",
    imageUrl: "/lovable-uploads/4fcaace6-9ca6-4012-8e19-966bfcd94cc4.png",
    readTime: "8 min read",
    date: "Apr 14, 2024"
  },
  {
    id: "3",
    title: "Optimizing Your Voice Model",
    description: "Tips and tricks for fine-tuning your voice model to achieve the best possible results.",
    category: "Optimization",
    imageUrl: "/lovable-uploads/6402c060-ac87-482b-af99-e8eeb9005022.png",
    readTime: "6 min read",
    date: "Apr 13, 2024"
  }
];

const categories = ["All", "Beginners", "Advanced", "Optimization", "Tips & Tricks"];

export default function Tutorials() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesCategory = selectedCategory === "All" || tutorial.category === selectedCategory;
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient 46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-6">
            Learn & Create
          </h1>
          <p className="text-xl text-gray-200 text-center max-w-2xl mx-auto">
            Discover tutorials, guides, and best practices for creating amazing AI-generated music
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-dreamaker-purple/80"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tutorials..."
              className="pl-10 bg-black/20 border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map(tutorial => (
            <div
              key={tutorial.id}
              className="bg-black/20 rounded-xl overflow-hidden border border-gray-800 hover:border-dreamaker-purple/50 transition-all duration-300"
            >
              <div className="relative h-48">
                <img
                  src={tutorial.imageUrl}
                  alt={tutorial.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-dreamaker-purple/10">
                    {tutorial.category}
                  </Badge>
                  <span className="text-sm text-gray-400">{tutorial.readTime}</span>
                  <span className="text-sm text-gray-400">• {tutorial.date}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {tutorial.title}
                </h3>
                <p className="text-gray-400 line-clamp-2">
                  {tutorial.description}
                </p>
                <button className="mt-4 text-dreamaker-purple hover:text-dreamaker-purple/80 font-medium">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTutorials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No tutorials found. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
