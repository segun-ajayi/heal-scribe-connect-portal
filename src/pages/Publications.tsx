
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Calendar, User } from "lucide-react";

const Publications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const publications = [
    {
      id: 1,
      title: "Minimally Invasive Cardiac Surgery: A 10-Year Retrospective Analysis",
      authors: "Mitchell S., Johnson R., Williams K., Davis M.",
      journal: "Journal of Cardiovascular Surgery",
      year: "2023",
      category: "Research",
      citations: 45,
      impact: "High",
      abstract: "This retrospective study analyzes outcomes from 1,200 minimally invasive cardiac procedures over a 10-year period, demonstrating significant improvements in patient recovery times and surgical outcomes.",
      doi: "10.1016/j.jcvs.2023.04.012"
    },
    {
      id: 2,
      title: "Robotic-Assisted Valve Repair: Technical Innovations and Clinical Outcomes",
      authors: "Mitchell S., Thompson A., Lee C.",
      journal: "Annals of Thoracic Surgery",
      year: "2023",
      category: "Research",
      citations: 32,
      impact: "High",
      abstract: "A comprehensive review of robotic-assisted valve repair techniques, including novel approaches that have reduced operative time by 30% while maintaining excellent clinical outcomes.",
      doi: "10.1016/j.athoracsur.2023.02.018"
    },
    {
      id: 3,
      title: "Patient-Centered Care in Cardiovascular Surgery: A Quality Improvement Initiative",
      authors: "Mitchell S., Brown P., Garcia L., Anderson T.",
      journal: "Quality in Healthcare",
      year: "2022",
      category: "Quality Improvement",
      citations: 28,
      impact: "Medium",
      abstract: "Implementation of a patient-centered care model in cardiovascular surgery, resulting in improved patient satisfaction scores and reduced readmission rates.",
      doi: "10.1007/s11748-022-01834-7"
    },
    {
      id: 4,
      title: "Machine Learning Applications in Cardiovascular Risk Assessment",
      authors: "Chen H., Mitchell S., Rodriguez M., Kumar V.",
      journal: "Nature Digital Medicine",
      year: "2022",
      category: "Technology",
      citations: 67,
      impact: "High",
      abstract: "Development and validation of machine learning algorithms for cardiovascular risk assessment, achieving 94% accuracy in predicting surgical outcomes.",
      doi: "10.1038/s41746-022-00621-3"
    },
    {
      id: 5,
      title: "Economic Impact of Early Intervention in Cardiovascular Disease",
      authors: "Mitchell S., Park J., Wilson R.",
      journal: "Health Economics Review",
      year: "2022",
      category: "Health Economics",
      citations: 19,
      impact: "Medium",
      abstract: "Cost-effectiveness analysis of early cardiovascular intervention programs, demonstrating significant healthcare cost savings and improved patient outcomes.",
      doi: "10.1186/s13561-022-00384-2"
    },
    {
      id: 6,
      title: "Novel Biomarkers in Cardiac Surgery: Predictive Value and Clinical Applications",
      authors: "Taylor K., Mitchell S., Murphy D., Clark A.",
      journal: "Circulation Research",
      year: "2021",
      category: "Research",
      citations: 89,
      impact: "High",
      abstract: "Identification and validation of novel biomarkers that predict cardiac surgical outcomes with high accuracy, potentially revolutionizing preoperative risk assessment.",
      doi: "10.1161/CIRCRESAHA.121.319245"
    }
  ];

  const categories = ["all", "Research", "Quality Improvement", "Technology", "Health Economics"];

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.journal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || pub.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            Advancing cardiovascular medicine through rigorous research and evidence-based practice. 
            Explore Dr. Mitchell's contributions to medical literature and scientific advancement.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Publications</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1,200+</div>
              <div className="text-gray-600">Citations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
              <div className="text-gray-600">Journal Impact Factor</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">8</div>
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
        <div className="space-y-6">
          {filteredPublications.map((publication) => (
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
                  <p className="text-sm text-gray-500">DOI: {publication.doi}</p>
                </div>
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm">
                    View Full Text
                  </Button>
                  <Button variant="ghost" size="sm">
                    Export Citation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
