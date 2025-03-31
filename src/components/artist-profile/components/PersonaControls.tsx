import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { GridIcon, ListIcon, Search } from "lucide-react";

interface PersonaControlsProps {
  viewMode: "grid" | "list";
  sortBy: string;
  searchQuery: string;
  onViewModeChange: (mode: "grid" | "list") => void;
  onSortChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export const PersonaControls = ({
  viewMode,
  sortBy,
  searchQuery,
  onViewModeChange,
  onSortChange,
  onSearchChange,
}: PersonaControlsProps) => {
  return (
    <div className="flex items-center gap-4 mb-6 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 rounded-lg border">
      <div className="flex-1 relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search personas..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="name">Name A-Z</SelectItem>
          <SelectItem value="name-desc">Name Z-A</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-center rounded-md border">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="icon"
          onClick={() => onViewModeChange("grid")}
          className="rounded-r-none"
        >
          <GridIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="icon"
          onClick={() => onViewModeChange("list")}
          className="rounded-l-none"
        >
          <ListIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};