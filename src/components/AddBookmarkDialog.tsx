
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bookmark, SocialPlatform } from "@/types/bookmark";
import { BookmarkPlus, Link as LinkIcon, Loader2 } from "lucide-react";
import { isValidUrl, normalizeUrl, extractTitleFromUrl } from "@/utils/urlUtils";
import { useToast } from "@/hooks/use-toast";

interface AddBookmarkDialogProps {
  onAddBookmark: (bookmark: Omit<Bookmark, "id" | "createdAt">) => void;
}

export const AddBookmarkDialog = ({ onAddBookmark }: AddBookmarkDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState<SocialPlatform>("twitter");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const detectTitle = async () => {
      if (!url || !isValidUrl(normalizeUrl(url))) return;
      
      setIsLoading(true);
      try {
        const detectedTitle = await extractTitleFromUrl(normalizeUrl(url));
        setTitle(detectedTitle);
      } catch (error) {
        console.error("Failed to detect title:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(detectTitle, 500);
    return () => clearTimeout(timeoutId);
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const normalizedUrl = normalizeUrl(url);
    if (!isValidUrl(normalizedUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive"
      });
      return;
    }

    onAddBookmark({
      title,
      url: normalizedUrl,
      description,
      platform,
    });
    
    setOpen(false);
    setTitle("");
    setUrl("");
    setDescription("");
    setPlatform("twitter");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-primary/25 transition-all duration-300">
          <BookmarkPlus className="h-5 w-5" />
          Add Bookmark
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Add New Bookmark
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10"
                placeholder="https://example.com"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title {isLoading && <Loader2 className="inline animate-spin ml-2" />}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter title or wait for auto-detection"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a brief description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select value={platform} onValueChange={(value: SocialPlatform) => setPlatform(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
            Add Bookmark
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
