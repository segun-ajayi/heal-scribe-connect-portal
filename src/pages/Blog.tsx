
import {useMemo, useState} from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Clock, User, Calendar } from "lucide-react";
import {useBlogs, usePublications, usePublicContent} from "@/hooks/usePublicContent.ts";
import {InlineText} from "@/components/ui/InlineText.tsx";

const Blog = () => {
  const { data: content = [], isLoading, isError } = usePublicContent();
  const [page, setPage] = useState(1);

  const { data: blogPosts = undefined, isLoading: isLoadingBlogs } = useBlogs(page);

  const blogContent = useMemo(
      () => content.filter((item) => item.page === "blog"),
      [content]
  );

  const byId = useMemo(
      () => Object.fromEntries(blogContent.map((i) => [i.id, i])),
      [blogContent]
  );

  const get = (id: string) => byId[id]?.value || "";
  const getAlt = (id: string) => byId[id]?.alt || "";

  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", ...(blogPosts?.categories?.map(cat => cat.name) || [])];

  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts?.data?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts?.data?.find(post => post.featured);
  const regularPosts = filteredPosts?.filter(post => !post.featured || searchTerm || selectedCategory !== "All");

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <InlineText
              id="blog-hero-title"
              defaultValue={get("blog-hero-title")}
              className="text-4xl font-bold text-gray-900 mb-4"
              as="h1"
          />
          <InlineText
              id="blog-hero-subtitle"
              defaultValue={get("blog-hero-subtitle")}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              as="p"
          />
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
                  <span>{featuredPost.totalRatings}</span>
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
          {regularPosts?.map((post) => (
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
                    {post.totalRatings}
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

        {filteredPosts?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
