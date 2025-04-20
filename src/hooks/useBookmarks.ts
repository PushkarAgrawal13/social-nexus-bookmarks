
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { Bookmark } from "@/types/bookmark";
import { useToast } from "@/hooks/use-toast";

const supabase = createClient(
  "https://your-project-url.supabase.co",
  "your-anon-key"
);

const EXAMPLE_BOOKMARKS: Omit<Bookmark, "id" | "createdAt">[] = [
  {
    title: "React Documentation - Learn React",
    url: "https://react.dev",
    platform: "facebook",
    description: "The official React documentation with interactive examples and comprehensive guides"
  },
  {
    title: "MDN Web Docs - JavaScript",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    platform: "twitter",
    description: "Mozilla's JavaScript documentation and tutorials"
  },
  {
    title: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/",
    platform: "linkedin",
    description: "Official TypeScript documentation and guides"
  },
  {
    title: "Tailwind CSS - Documentation",
    url: "https://tailwindcss.com/docs",
    platform: "youtube",
    description: "Learn Tailwind CSS through comprehensive documentation"
  }
];

export const useBookmarks = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Authentication required",
          description: "Please log in to access your bookmarks",
          variant: "destructive"
        });
        return [];
      }

      const { data: bookmarks } = await supabase
        .from("bookmarks")
        .select("*")
        .order("created_at", { ascending: false });

      if (bookmarks && bookmarks.length === 0) {
        const { data: exampleBookmarks } = await supabase
          .from("bookmarks")
          .insert(
            EXAMPLE_BOOKMARKS.map(bookmark => ({
              ...bookmark,
              user_id: user.user.id,
              is_example: true
            }))
          )
          .select();
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

      if (error) {
        toast({
          title: "Error adding bookmark",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      toast({
        title: "Bookmark added",
        description: "Your bookmark has been saved successfully"
      });

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
