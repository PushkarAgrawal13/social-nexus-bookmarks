
import { useState } from "react";
import { BookmarkCard } from "@/components/BookmarkCard";
import { AddBookmarkDialog } from "@/components/AddBookmarkDialog";
import { Input } from "@/components/ui/input";
import { Bookmark } from "@/types/bookmark";
import { Search, Bookmark as BookmarkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [search, setSearch] = useState("");

  const handleAddBookmark = (newBookmark: Omit<Bookmark, "id" | "createdAt">) => {
    const bookmark: Bookmark = {
      ...newBookmark,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setBookmarks([bookmark, ...bookmarks]);
  };

  const filteredBookmarks = bookmarks.filter(
    (bookmark) =>
      bookmark.title.toLowerCase().includes(search.toLowerCase()) ||
      bookmark.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary/90 to-purple-600/90 text-white py-12 px-4 mb-8">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center">
                <BookmarkIcon className="mr-3 h-8 w-8" /> Social Bookmarks
              </h1>
              <p className="text-primary-foreground/90 text-lg md:text-xl">
                Keep all your social media bookmarks in one place
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" className="bg-white text-primary hover:bg-white/90">
                <Link to="/login">Login</Link>
              </Button>
              <AddBookmarkDialog onAddBookmark={handleAddBookmark} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-5xl px-4">
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 bg-white shadow-sm"
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Bookmarks Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
          {filteredBookmarks.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-200 rounded-xl bg-white/60 backdrop-blur-sm">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <BookmarkIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {bookmarks.length === 0
                  ? "Your bookmark collection is empty"
                  : "No matching bookmarks found"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">
                {bookmarks.length === 0
                  ? "Start adding your favorite social media links by clicking the button above!"
                  : "Try adjusting your search query to find what you're looking for."}
              </p>
              {bookmarks.length === 0 && <AddBookmarkDialog onAddBookmark={handleAddBookmark} />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
