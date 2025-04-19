
import { Bookmark } from "@/types/bookmark";
import { Twitter, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

const platformIcons = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

const platformColors = {
  twitter: "bg-[#1DA1F2] text-white",
  facebook: "bg-[#4267B2] text-white",
  instagram: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white",
  linkedin: "bg-[#0077B5] text-white",
  youtube: "bg-[#FF0000] text-white",
};

export const BookmarkCard = ({ bookmark }: { bookmark: Bookmark }) => {
  const Icon = platformIcons[bookmark.platform];
  const platformColor = platformColors[bookmark.platform] || "bg-primary text-white";

  return (
    <Card className="card-hover gradient-border">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className={`p-2 rounded-lg ${platformColor}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-lg line-clamp-1 gradient-text">{bookmark.title}</h3>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(bookmark.createdAt, { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {bookmark.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{bookmark.description}</p>
        )}
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Visit {bookmark.platform.charAt(0).toUpperCase() + bookmark.platform.slice(1)}
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            ></path>
          </svg>
        </a>
      </CardContent>
    </Card>
  );
};
