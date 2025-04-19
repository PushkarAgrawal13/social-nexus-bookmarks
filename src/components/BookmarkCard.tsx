
import { Bookmark } from "@/types/bookmark";
import { Twitter, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const platformIcons = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

export const BookmarkCard = ({ bookmark }: { bookmark: Bookmark }) => {
  const Icon = platformIcons[bookmark.platform];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-2">
        <Icon className="h-5 w-5 text-violet-500" />
        <h3 className="font-semibold text-lg">{bookmark.title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">{bookmark.description}</p>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-600 hover:text-violet-700 text-sm underline"
        >
          Visit Link
        </a>
      </CardContent>
    </Card>
  );
};
