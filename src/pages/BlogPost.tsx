
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Star, Calendar, Clock, User, ArrowLeft, Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const BlogPost = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(127);

  // Mock blog post data - in a real app, this would come from an API
  const blogPost = {
    id: parseInt(id || "1"),
    title: "The Future of Minimally Invasive Heart Surgery",
    content: `
      <div class="prose max-w-none">
        <p class="text-lg text-gray-700 mb-6">Cardiovascular surgery has undergone remarkable transformation over the past decade, with minimally invasive techniques leading the charge toward better patient outcomes and faster recovery times.</p>
        
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Revolutionary Techniques</h2>
        <p class="mb-4">The integration of robotic technology and advanced imaging systems has enabled surgeons to perform complex cardiac procedures through small incisions, dramatically reducing patient trauma and improving precision.</p>
        
        <h3 class="text-xl font-semibold text-gray-900 mb-3">Key Advantages:</h3>
        <ul class="list-disc pl-6 mb-6">
          <li>Reduced surgical trauma and scarring</li>
          <li>Shorter hospital stays (2-3 days vs. 7-10 days)</li>
          <li>Faster return to normal activities</li>
          <li>Lower risk of infection</li>
          <li>Improved cosmetic outcomes</li>
        </ul>
        
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Clinical Outcomes</h2>
        <p class="mb-4">Recent studies from our institution demonstrate that patients undergoing minimally invasive cardiac procedures show:</p>
        
        <div class="bg-blue-50 p-6 rounded-lg mb-6">
          <h4 class="font-semibold text-blue-900 mb-2">Research Findings:</h4>
          <ul class="text-blue-800">
            <li>• 40% reduction in post-operative complications</li>
            <li>• 50% faster recovery to baseline function</li>
            <li>• 90% patient satisfaction rate</li>
            <li>• Significant cost savings for healthcare systems</li>
          </ul>
        </div>
        
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Looking Forward</h2>
        <p class="mb-4">The future holds even more promise with the development of AI-assisted surgical planning, enhanced haptic feedback systems, and improved imaging technologies that will further refine these techniques.</p>
        
        <p class="mb-4">As we continue to push the boundaries of what's possible in cardiac surgery, our commitment remains unwavering: providing the best possible outcomes for our patients while minimizing the impact of surgical intervention on their lives.</p>
        
        <div class="bg-gray-50 p-6 rounded-lg">
          <h4 class="font-semibold text-gray-900 mb-2">About the Author</h4>
          <p class="text-gray-700">Dr. Sarah Mitchell is a board-certified cardiovascular surgeon with over 15 years of experience in minimally invasive cardiac procedures. She has performed over 2,500 successful surgeries and published extensively on surgical innovation.</p>
        </div>
      </div>
    `,
    author: "Dr. Sarah Mitchell",
    date: "March 15, 2024",
    readTime: "8 min read",
    category: "Innovation",
    currentRating: 4.9,
    totalRatings: 156,
    comments: 23
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
    toast({
      title: liked ? "Removed from favorites" : "Added to favorites",
      description: liked ? "Post removed from your favorites" : "Post added to your favorites",
    });
  };

  const handleRatingSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Choose a rating from 1 to 5 stars",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Rating submitted",
      description: `Thank you for rating this article ${rating} stars!`,
    });
    setRating(0);
  };

  const handleCommentSubmit = () => {
    if (!comment.trim()) {
      toast({
        title: "Please enter a comment",
        description: "Your comment cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Comment submitted",
      description: "Your comment has been posted successfully!",
    });
    setComment("");
  };

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/blog">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <Badge className="bg-blue-100 text-blue-800">{blogPost.category}</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`${liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
              >
                <Heart className={`w-5 h-5 mr-1 ${liked ? 'fill-current' : ''}`} />
                {likes}
              </Button>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {blogPost.title}
            </h1>
            
            <div className="flex items-center text-gray-600 mb-6">
              <User className="w-5 h-5 mr-2" />
              <span className="mr-6">{blogPost.author}</span>
              <Calendar className="w-5 h-5 mr-2" />
              <span className="mr-6">{blogPost.date}</span>
              <Clock className="w-5 h-5 mr-2" />
              <span className="mr-6">{blogPost.readTime}</span>
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              <span>{blogPost.currentRating} ({blogPost.totalRatings} ratings)</span>
            </div>
          </CardContent>
        </Card>

        {/* Article Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
          </CardContent>
        </Card>

        {/* Rating Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Rate this article</h3>
            <div className="flex items-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`text-2xl transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-500'
                      : 'text-gray-300'
                  }`}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
              <span className="ml-4 text-gray-600">
                {rating > 0 && `You rated: ${rating} star${rating > 1 ? 's' : ''}`}
              </span>
            </div>
            <Button onClick={handleRatingSubmit} className="bg-blue-600 hover:bg-blue-700">
              Submit Rating
            </Button>
          </CardContent>
        </Card>

        {/* Comment Section */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Comments ({blogPost.comments})
            </h3>
            
            <div className="mb-6">
              <Textarea
                placeholder="Share your thoughts about this article..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mb-4"
                rows={4}
              />
              <Button onClick={handleCommentSubmit} className="bg-blue-600 hover:bg-blue-700">
                Post Comment
              </Button>
            </div>

            {/* Sample Comments */}
            <div className="space-y-6">
              <div className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-medium">JD</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Dr. John Davis</p>
                    <p className="text-sm text-gray-500">March 16, 2024</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Excellent overview of the current state of minimally invasive cardiac surgery. 
                  The data you've presented aligns perfectly with our own institutional outcomes. 
                  Looking forward to implementing some of these techniques.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-medium">MR</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Maria Rodriguez, RN</p>
                    <p className="text-sm text-gray-500">March 15, 2024</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  As a cardiac nurse, I've witnessed firsthand the benefits of these procedures 
                  for patients. The reduced recovery time and improved quality of life outcomes 
                  are truly remarkable.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogPost;
