
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Star, Calendar, User, ExternalLink } from "lucide-react";

const Publications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const publicationsPerPage = 5;

  const publications = [
    {
      id: 1,
      title: "Laparoscopic Surgery Outcomes in Resource-Limited Settings: A Nigerian Experience",
      authors: "Wuraola F., Adebayo O., Ogunlana A., Salami B.",
      journal: "West African Journal of Medicine",
      year: "2023",
      category: "Research",
      citations: 25,
      impact: "High",
      abstract: "This study analyzes outcomes from 500 laparoscopic procedures performed in a Nigerian teaching hospital over 3 years, demonstrating the feasibility and safety of minimally invasive surgery in resource-limited settings.",
      doi: "10.4314/wajm.v42i2.8",
      journalUrl: "https://www.ajol.info/index.php/wajm"
    },
    {
      id: 2,
      title: "Emergency General Surgery During COVID-19 Pandemic: Lessons from a Nigerian Teaching Hospital",
      authors: "Wuraola F., Ogundipe K., Ibrahim M.",
      journal: "Nigerian Journal of Surgery",
      year: "2023",
      category: "Research",
      citations: 18,
      impact: "Medium",
      abstract: "A comprehensive review of emergency surgical procedures during the COVID-19 pandemic, highlighting adaptations in surgical protocols and outcomes in a resource-constrained environment.",
      doi: "10.4103/njs.njs_45_22",
      journalUrl: "https://www.njsurgery.com"
    },
    {
      id: 3,
      title: "Cost-Effectiveness of Early Appendectomy vs Conservative Management in Rural Nigeria",
      authors: "Wuraola F., Adesanya T., Olawale J.",
      journal: "African Health Sciences",
      year: "2022",
      category: "Health Economics",
      citations: 32,
      impact: "High",
      abstract: "Economic analysis comparing early surgical intervention versus conservative management for acute appendicitis in rural Nigerian communities, demonstrating significant cost savings with early intervention.",
      doi: "10.4314/ahs.v22i3.12",
      journalUrl: "https://www.bioline.org.br/ahs"
    },
    {
      id: 4,
      title: "Surgical Site Infection Prevention in Tropical Climates: A Quality Improvement Study",
      authors: "Adeyemi R., Wuraola F., Okonkwo U., Davies P.",
      journal: "Tropical Medicine and International Health",
      year: "2022",
      category: "Quality Improvement",
      citations: 29,
      impact: "High",
      abstract: "Implementation of evidence-based infection prevention protocols in tropical surgical settings, achieving 40% reduction in surgical site infections through systematic quality improvement measures.",
      doi: "10.1111/tmi.13745",
      journalUrl: "https://onlinelibrary.wiley.com/journal/13653156"
    },
    {
      id: 5,
      title: "Training General Surgery Residents in Low-Resource Settings: A Competency-Based Approach",
      authors: "Wuraola F., Bakare A., Suleiman H.",
      journal: "Medical Education Online",
      year: "2022",
      category: "Medical Education",
      citations: 22,
      impact: "Medium",
      abstract: "Development and validation of a competency-based surgical training curriculum adapted for resource-limited settings, improving resident surgical skills and patient outcomes.",
      doi: "10.1080/10872981.2022.2074524",
      journalUrl: "https://www.tandfonline.com/journals/zmeo20"
    },
    {
      id: 6,
      title: "Hernia Repair Techniques in Nigeria: Comparing Mesh vs Non-Mesh Repairs",
      authors: "Wuraola F., Okafor C., Nwosu D.",
      journal: "Hernia: The World Journal of Hernia and Abdominal Wall Surgery",
      year: "2021",
      category: "Research",
      citations: 41,
      impact: "High",
      abstract: "Comparative study of 800 hernia repairs using mesh versus traditional non-mesh techniques, evaluating long-term outcomes, recurrence rates, and cost-effectiveness in the Nigerian context.",
      doi: "10.1007/s10029-021-02438-7",
      journalUrl: "https://link.springer.com/journal/10029"
    },
    {
      id: 7,
      title: "Trauma Surgery Outcomes in a Nigerian Level 1 Trauma Center",
      authors: "Olumide A., Wuraola F., Kehinde S., Adeoye T.",
      journal: "World Journal of Surgery",
      year: "2021",
      category: "Research",
      citations: 35,
      impact: "High",
      abstract: "Analysis of trauma surgery outcomes over 2 years at a major Nigerian trauma center, identifying key factors affecting morbidity and mortality in emergency surgical cases.",
      doi: "10.1007/s00268-021-06180-x",
      journalUrl: "https://link.springer.com/journal/268"
    },
    {
      id: 8,
      title: "Breast Cancer Surgery in Nigeria: Challenges and Innovations",
      authors: "Wuraola F., Ajayi I., Ogunbiyi O.",
      journal: "Annals of African Medicine",
      year: "2021",
      category: "Research",
      citations: 28,
      impact: "Medium",
      abstract: "Comprehensive review of breast cancer surgical management in Nigeria, highlighting innovative approaches to overcome resource limitations and improve patient outcomes.",
      doi: "10.4103/aam.aam_67_20",
      journalUrl: "https://www.annalsafrmed.org"
    }
  ];

  const categories = ["all", "Research", "Quality Improvement", "Medical Education", "Health Economics"];

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.journal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || pub.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPublications.length / publicationsPerPage);
  const startIndex = (currentPage - 1) * publicationsPerPage;
  const endIndex = startIndex + publicationsPerPage;
  const currentPublications = filteredPublications.slice(startIndex, endIndex);

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Research Publications</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advancing surgical medicine through rigorous research and evidence-based practice. 
            Explore Dr. Wuraola's contributions to medical literature and surgical advancement.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">30+</div>
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
          {currentPublications.map((publication) => (
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
                        {publication.year}
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
                      {publication.citations} citations
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
                    <a href={publication.journalUrl} target="_blank" rel="noopener noreferrer">
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
                Showing {startIndex + 1}-{Math.min(endIndex, filteredPublications.length)} of {filteredPublications.length} publications
              </div>
            </CardContent>
          </Card>
        )}

        {filteredPublications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No publications found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Publications;
