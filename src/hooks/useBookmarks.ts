
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { Bookmark } from "@/types/bookmark";

// Use a mock Supabase for now - REPLACE THESE WITH YOUR ACTUAL SUPABASE CREDENTIALS
const supabaseUrl = "https://your-project-url.supabase.co";
const supabaseKey = "your-anonymous-key";
const supabase = createClient(supabaseUrl, supabaseKey);

const EXAMPLE_BOOKMARKS: Omit<Bookmark, "id" | "createdAt">[] = [
  {
    title: "Learn Web Development - MDN",
    url: "https://developer.mozilla.org/en-US/docs/Learn",
    platform: "youtube",
    description: "Comprehensive web development tutorials from Mozilla"
  },
  {
    title: "React Documentation",
    url: "https://react.dev",
    platform: "facebook",
    description: "Official React documentation and tutorials"
  },
  {
    title: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/handbook/intro.html",
    platform: "twitter",
    description: "Learn TypeScript from the official handbook"
  },
  {
    title: "Web Development Roadmap",
    url: "https://roadmap.sh/frontend",
    platform: "linkedin",
    description: "Frontend development learning path and resources"
  }
];

export const useBookmarks = () => {
  const queryClient = useQueryClient();

  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data: bookmarks } = await supabase
        .from("bookmarks")
        .select("*")
        .order("created_at", { ascending: false });

      // If no bookmarks exist, add example bookmarks
      if (bookmarks && bookmarks.length === 0) {
        const { data: exampleBookmarks } = await supabase.from("bookmarks").insert(
          EXAMPLE_BOOKMARKS.map(bookmark => ({
            ...bookmark,
            user_id: user.user.id,
            is_example: true
          }))
        ).select();
        return exampleBookmarks || [];
      }

      return bookmarks || [];
    }
  });

  const addBookmark = useMutation({
    mutationFn: async (newBookmark: Omit<Bookmark, "id" | "createdAt">) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      // Delete example bookmarks if they exist
      await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.user.id)
        .eq("is_example", true);

      // Add the new bookmark
      const { data, error } = await supabase
        .from("bookmarks")
        .insert([
          {
            ...newBookmark,
            user_id: user.user.id,
            is_example: false
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    }
  });

  return {
    bookmarks,
    isLoading,
    addBookmark: addBookmark.mutate
  };
};
