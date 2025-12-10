import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { mockBlogs } from "@/data/mockData";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const blog = mockBlogs.find((b) => b.id === id);

  if (!blog) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl text-muted-foreground mb-4">Blog not found</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </MainLayout>
    );
  }

  const isOwner = user?.id === blog.authorId || user?.id === "current";

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied to clipboard!" });
  };

  const handleDelete = () => {
    toast({ title: "Blog deleted successfully" });
    navigate("/");
  };

  return (
    <MainLayout>
      <article className="max-w-3xl mx-auto animate-fade-in">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="text-5xl">{blog.emoji}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="font-display font-bold text-3xl md:text-4xl leading-tight">
              {blog.title}
            </h1>
            
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/create?edit=${blog.id}`} className="flex items-center">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-4">
            <Link to={`/profile/${blog.author.id}`}>
              <Avatar className="h-12 w-12">
                <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link
                to={`/profile/${blog.author.id}`}
                className="font-medium hover:text-primary transition-colors"
              >
                {blog.author.name}
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {format(new Date(blog.createdAt), "MMMM d, yyyy")}
              </div>
            </div>
          </div>
        </header>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {blog.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-full">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {blog.content}
          </p>
        </div>

        {/* Action Bar */}
        <div className="sticky bottom-6 flex items-center justify-center gap-2 bg-card/80 backdrop-blur-md border border-border rounded-full px-4 py-2 w-fit mx-auto shadow-lg">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-2 rounded-full",
              isLiked && "text-destructive"
            )}
            onClick={handleLike}
          >
            <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
            <span>{blog.likes + likeCount}</span>
          </Button>

          <Button variant="ghost" size="sm" className="gap-2 rounded-full">
            <MessageCircle className="h-5 w-5" />
            <span>{blog.comments}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 rounded-full"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
            <span>{blog.shares}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn("rounded-full", isBookmarked && "text-primary")}
            onClick={handleBookmark}
          >
            <Bookmark className={cn("h-5 w-5", isBookmarked && "fill-current")} />
          </Button>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this blog?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your blog post.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </article>
    </MainLayout>
  );
}
