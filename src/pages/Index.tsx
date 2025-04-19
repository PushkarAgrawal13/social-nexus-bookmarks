
import { useState } from "react";
import { BookmarkCard } from "@/components/BookmarkCard";
import { AddBookmarkDialog } from "@/components/AddBookmarkDialog";
import { Input } from "@/components/ui/input";
import { Bookmark } from "@/types/bookmark";
import { Search } from "lucide-react";

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold text-center mb-4">Social Bookmarks</h1>
        <p className="text-gray-600 text-center mb-6">
          Keep all your social media bookmarks in one place
        </p>
        <AddBookmarkDialog onAddBookmark={handleAddBookmark} />
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Search bookmarks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBookmarks.map((bookmark) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} />
        ))}
        {filteredBookmarks.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-8">
            {bookmarks.length === 0
              ? "Add your first bookmark by clicking the button above!"
              : "No bookmarks found matching your search."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
