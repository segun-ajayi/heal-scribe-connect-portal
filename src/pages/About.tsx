import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, User } from "lucide-react";
import { useMemo } from "react";
import { usePublicContent } from "@/hooks/usePublicContent";
import { InlineText } from "@/components/ui/InlineText";
import { InlineTextarea } from "@/components/ui/InlineTextarea";
import { ExperienceList } from "@/components/about/ExperienceList";
import { AwardList } from "@/components/about/AwardList";
import { CertificationList } from "@/components/about/CertificationList";
import {InlineImage} from "@/components/ui/InlineImage.tsx";

const About = () => {
  const { data: content = [], isLoading, isError } = usePublicContent();

  const aboutContent = useMemo(
      () => content.filter((item) => item.page === "about"),
      [content]
  );

  const byId = useMemo(
      () => Object.fromEntries(aboutContent.map((i) => [i.id, i])),
      [aboutContent]
  );

  const get = (id: string) => byId[id]?.value || "";
  const getAlt = (id: string) => byId[id]?.alt || "";

  const grouped = useMemo(() => {
    const result: Record<string, Record<string, string[]>> = {};
    for (const item of aboutContent) {
      const match = item.id.match(/^about-(\w+)(\d+)-/);
      if (match) {
        const [, section, index] = match;
        result[section] ||= {};
        result[section][index] ||= [];
        result[section][index].push(item.id);
      }
    }
    return result;
  }, [aboutContent]);

  if (isLoading) {
    return <div className="py-32 text-center">Loading About page...</div>;
  }

  if (isError) {
    return (
        <div className="py-32 text-center text-red-600">
          Failed to load About content.
        </div>
    );
  }

  return (
      <div className="min-h-screen py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">

              <InlineImage
                  id="home-hero-image"
                  defaultSrc={get("about-hero-image")}
                  defaultAlt={getAlt("home-hero-image") || "Doctor illustration"}
                  imgClassName="w-31 h-31 object-contain rounded-full"
              />
            </div>
            <InlineText
                id="about-hero-name"
                defaultValue={get("about-hero-name")}
                className="text-4xl font-bold text-gray-900 mb-4"
                as="h1"
            />
            <InlineText
                id="about-hero-title"
                defaultValue={get("about-hero-title")}
                className="text-xl text-gray-600 mb-6"
                as="p"
            />
            <div className="flex justify-center space-x-4">
              <Badge variant="secondary">
                <InlineText
                    id="about-badge-1"
                    defaultValue={get("about-badge-1")}
                    className=""
                />
              </Badge>
              <Badge variant="secondary">
                <InlineText
                    id="about-badge-2"
                    defaultValue={get("about-badge-2")}
                    className=""
                />
              </Badge>
              <Badge variant="secondary">
                <InlineText
                    id="about-badge-3"
                    defaultValue={get("about-badge-3")}
                    className=""
                />
              </Badge>
            </div>
          </div>

          {/* Bio Section */}
          <Card className="mb-12">
            <CardHeader>
              <InlineText
                  id="about-summary-title"
                  defaultValue={get("about-summary-title")}
                  className="text-2xl"
                  as="h2"
              />
            </CardHeader>
            <CardContent className="prose max-w-none text-gray-700 space-y-4">
              <InlineTextarea id="about-bio-para1" defaultValue={get("about-bio-para1")} />
              <InlineTextarea id="about-bio-para2" defaultValue={get("about-bio-para2")} />
              <InlineTextarea id="about-bio-para3" defaultValue={get("about-bio-para3")} />
            </CardContent>
          </Card>

          {/* Experience Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Calendar className="w-6 h-6 mr-2" />
                <InlineText id="about-experience-title" defaultValue={get("about-experience-title")} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ExperienceList get={get} />
            </CardContent>
          </Card>

          {/* Awards Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Star className="w-6 h-6 mr-2" />
                <InlineText id="about-awards-title" defaultValue={get("about-awards-title")} />
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <AwardList get={get} />
            </CardContent>
          </Card>

          {/* Certifications Section */}
          <Card>
            <CardHeader>
              <InlineText id="about-certifications-title" defaultValue={get("about-certifications-title")} className="text-2xl" />
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <CertificationList get={get} />
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default About;