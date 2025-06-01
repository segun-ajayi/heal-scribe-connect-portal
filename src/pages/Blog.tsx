
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Clock, User, Calendar } from "lucide-react";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const blogPosts = [
    {
      id: 1,
      title: "The Future of Minimally Invasive Heart Surgery",
      excerpt: "Exploring how robotic technology and advanced imaging are revolutionizing cardiac procedures, making them safer and more precise than ever before.",
      author: "Dr. Sarah Mitchell",
      date: "March 15, 2024",
      readTime: "8 min read",
      category: "Innovation",
      rating: 4.9,
      likes: 127,
      comments: 23,
      image: "cardiac-surgery",
      featured: true
    },
    {
      id: 2,
      title: "Understanding Heart Valve Disease: Prevention and Treatment",
      excerpt: "A comprehensive guide to heart valve disorders, including early warning signs, prevention strategies, and the latest treatment options available.",
      author: "Dr. Sarah Mitchell",
      date: "March 8, 2024",
      readTime: "6 min read",
      category: "Patient Education",
      rating: 4.8,
      likes: 89,
      comments: 15,
      image: "heart-anatomy"
    },
    {
      id: 3,
      title: "Recovery After Heart Surgery: What to Expect",
      excerpt: "Detailed insights into the post-operative journey, including timeline expectations, rehabilitation exercises, and tips for optimal recovery.",
      author: "Dr. Sarah Mitchell",
      date: "February 28, 2024",
      readTime: "7 min read",
      category: "Recovery",
      rating: 4.7,
      likes: 156,
      comments: 34,
      image: "recovery"
    },
    {
      id: 4,
      title: "Breakthrough Research in Cardiac Regenerative Medicine",
      excerpt: "Latest developments in stem cell therapy and tissue engineering that could transform how we treat heart disease in the coming decades.",
      author: "Dr. Sarah Mitchell",
      date: "February 20, 2024",
      readTime: "10 min read",
      category: "Research",
      rating: 4.9,
      likes: 203,
      comments: 41,
      image: "research"
    },
    {
      id: 5,
      title: "Nutrition and Heart Health: Evidence-Based Recommendations",
      excerpt: "Scientific insights into dietary approaches that support cardiovascular health, backed by the latest nutritional research and clinical studies.",
      author: "Dr. Sarah Mitchell",
      date: "February 12, 2024",
      readTime: "5 min read",
      category: "Prevention",
      rating: 4.6,
      likes: 98,
      comments: 19,
      image: "nutrition"
    },
    {
      id: 6,
      title: "Managing Anxiety Before Heart Surgery",
      excerpt: "Practical strategies and psychological insights to help patients and families cope with pre-surgical anxiety and build confidence.",
      author: "Dr. Sarah Mitchell",
      date: "February 5, 2024",
      readTime: "6 min read",
      category: "Patient Care",
      rating: 4.8,
      likes: 142,
      comments: 28,
      image: "patient-care"
    }
  ];

  const categories = ["All", "Innovation", "Patient Education", "Recovery", "Research", "Prevention", "Patient Care"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured || searchTerm || selectedCategory !== "All");

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Medical Insights & Research</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed with the latest developments in cardiovascular medicine, patient care insights, 
            and evidence-based medical research from Dr. Mitchell and the broader medical community.
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search articles by title or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Featured Post */}
        {!searchTerm && selectedCategory === "All" && featuredPost && (
          <Card className="mb-12 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-64 md:h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <User className="w-24 h-24 text-white opacity-50" />
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <Badge className="mb-3 bg-blue-100 text-blue-800">Featured</Badge>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{featuredPost.title}</h2>
                <p className="text-gray-700 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="mr-4">{featuredPost.date}</span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="mr-4">{featuredPost.readTime}</span>
                  <Star className="w-4 h-4 mr-1" />
                  <span>{featuredPost.rating}</span>
                </div>
                <Link to={`/blog/${featuredPost.id}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700">Read Full Article</Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <User className="w-16 h-16 text-white opacity-50" />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline">{post.category}</Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="w-4 h-4 mr-1" />
                    {post.rating}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="mr-4">{post.date}</span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-3">❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                  <Link to={`/blog/${post.id}`}>
                    <Button variant="outline" size="sm">Read More</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
