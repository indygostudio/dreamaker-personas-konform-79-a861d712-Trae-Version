import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SearchSection = ({ searchQuery, onSearchChange }: SearchSectionProps) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Discover Artists</h1>
      <p className="text-gray-200 max-w-2xl mx-auto text-center px-4 mb-8">
        Explore our community of AI-powered artists and musicians. Sign in to collaborate and interact with them.
      </p>
      
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search artists..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-black/40 border-dreamaker-purple/20 text-white placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};