
import {useState, useEffect, useMemo} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Star, Calendar, User, ExternalLink } from "lucide-react";
import {usePublications, usePublicContent} from '@/hooks/usePublicContent';
import {useRecentBlogPosts} from "@/hooks/useAdminData.ts";
import {InlineText} from "@/components/ui/InlineText.tsx";
import {InlineTextarea} from "@/components/ui/InlineTextarea.tsx"; // adjust path as needed
// import { Publication } from '@/types';


const Publications = () => {

  const { data: content = [], isLoading, isError } = usePublicContent();
  const [page, setPage] = useState(1);

  const { data: myPublications = undefined, isLoading: isLoadingPublications } = usePublications(page);
  console.log('My POPO: ', myPublications);
  const publicationContent = useMemo(
      () => content.filter((item) => item.page === "publications"),
      [content]
  );

  const byId = useMemo(
      () => Object.fromEntries(publicationContent.map((i) => [i.id, i])),
      [publicationContent]
  );

  const get = (id: string) => byId[id]?.value || "";
  const getAlt = (id: string) => byId[id]?.alt || "";


  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const publicationsPerPage = 5;

  const categories = ["all", ...(myPublications?.categories?.map(cat => cat.name) || [])];

  const filteredPublications = myPublications?.data?.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.journal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || pub.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPublications?.length / publicationsPerPage);
  const startIndex = (currentPage - 1) * publicationsPerPage;
  const endIndex = startIndex + publicationsPerPage;
  const currentPublications = filteredPublications?.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <InlineText
              id="publications-hero-title"
              defaultValue={get("publications-hero-title")}
              className="text-4xl font-bold text-gray-900 mb-4"
              as="h1"
          />
          <InlineText
              id="publications-hero-subtitle"
              defaultValue={get("publications-hero-subtitle")}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              as="p"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{ myPublications?.data?.length }</div>
              <div className="text-gray-600">Publications</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">800+</div>
              <div className="text-gray-600">Citations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
              <div className="text-gray-600">Journal Impact Factor</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
              <div className="text-gray-600">Years Publishing</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search publications by title, author, or journal..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Publications List */}
        <div className="space-y-6 mb-8">
          {currentPublications?.map((publication) => (
            <Card key={publication.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-gray-900 mb-2">
                      {publication.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {publication.authors}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(publication.published_at).getFullYear()}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{publication.category}</Badge>
                      <Badge className={getImpactColor(publication.impact)}>
                        {publication.impact} Impact
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="w-4 h-4 mr-1" />
                      {/*{publication.citations} citations*/}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-blue-600 font-medium mb-2">{publication.journal}</p>
                  <p className="text-gray-700 mb-3">{publication.abstract}</p>
                  <p className="text-sm text-gray-500 mb-3">DOI: {publication.doi}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={publication.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View in Journal
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm">
                    Export Citation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="p-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              
              <div className="text-center mt-4 text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredPublications?.length)} of {filteredPublications.length} publications
              </div>
            </CardContent>
          </Card>
        )}

        {filteredPublications?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No publications found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Publications;
