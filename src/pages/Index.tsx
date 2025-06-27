import { useMemo } from "react";
import { usePublicContent } from "@/hooks/usePublicContent";
import { InlineText } from "@/components/ui/InlineText";
import { InlineTextarea } from "@/components/ui/InlineTextarea";
import { InlineLink } from "@/components/ui/InlineLink";
import { InlineImage } from "@/components/ui/InlineImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Star } from "lucide-react";

const Index = () => {
    const { data: content = [], isLoading, isError } = usePublicContent();

    const homeContent = useMemo(() => content.filter(item => item.page === "home"), [content]);

    const byId = useMemo(() => Object.fromEntries(homeContent.map(i => [i.id, i])), [homeContent]);

    const get = (id: string) => byId[id]?.value || "";
    const getHref = (id: string) => byId[id]?.href || "";
    const getAlt = (id: string) => byId[id]?.alt || "";

    if (isLoading) return <div className="py-32 text-center">Loading homepage...</div>;
    if (isError) return <div className="py-32 text-center text-red-600">Failed to load homepage content.</div>;

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <InlineText
                                id="home-hero-title"
                                defaultValue={get("home-hero-title")}
                                className="text-4xl md:text-5xl font-bold mb-6"
                                as="h1"
                            />
                            <InlineTextarea
                                id="home-hero-subtitle"
                                defaultValue={get("home-hero-subtitle")}
                                previewClassName="text-xl text-blue-100 mb-8"
                            />
                            <div className="flex flex-col sm:flex-row gap-4">
                                <InlineLink
                                    id="home-hero-cta1"
                                    defaultLabel={get("home-hero-cta1")}
                                    defaultHref={getHref("home-hero-cta1")}
                                    as={Button}
                                    componentProps={{
                                        size: "lg",
                                        href: getHref("home-hero-cta1"),
                                        className: "bg-white text-blue-600 hover:bg-gray-100",
                                        startIcon: <Calendar className="w-5 h-5 mr-2" />,
                                    }}
                                />
                                <InlineLink
                                    id="home-hero-cta2"
                                    defaultLabel={get("home-hero-cta2")}
                                    defaultHref={getHref("home-hero-cta2")}
                                    as={Button}
                                    componentProps={{
                                        size: "lg",
                                        variant: "outline",
                                        href: getHref("home-hero-cta2"),
                                        className: "border-white text-blue-600 hover:bg-white hover:text-blue-600",
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center">
                                <InlineImage
                                    id="home-hero-image"
                                    defaultSrc={get("home-hero-image")}
                                    defaultAlt={getAlt("home-hero-image") || "Doctor illustration"}
                                    imgClassName="w-100 h-100 object-contain rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <InlineText
                                id="home-blog-title"
                                defaultValue={get("home-blog-title")}
                                className="text-3xl font-bold text-gray-900 mb-4"
                                as="h1"
                            />
                            <InlineText
                                id="home-blog-subtitle"
                                defaultValue={get("home-blog-subtitle")}
                                className="text-lg text-gray-600"
                                as="p"
                            />
                        </div>
                        <InlineLink
                            id="home-blog-cta"
                            defaultLabel={get("home-blog-cta")}
                            defaultHref={getHref("home-blog-cta")}
                            as={Button}
                            componentProps={{ variant: "outline" }}
                        />
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <Card key={i} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <Badge className="mb-3">General Surgery</Badge>
                                    <h3 className="font-semibold text-gray-900 mb-3">
                                        Modern Approaches in General Surgery Practice
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {get("home-blog-description")}
                                    </p>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Clock className="w-4 h-4 mr-1" />
                                        <span className="mr-4">5 min read</span>
                                        <Star className="w-4 h-4 mr-1" />
                                        <span>4.8 rating</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <InlineText
                        id="home-cta-title"
                        defaultValue={get("home-cta-title")}
                        className="text-3xl font-bold mb-4"
                        as="h2"
                    />
                    <InlineText
                        id="home-cta-subtitle"
                        defaultValue={get("home-cta-subtitle")}
                        className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
                        as="p"
                    />
                    <InlineLink
                        id="home-cta-button"
                        defaultLabel={get("home-cta-button")}
                        defaultHref={getHref("home-cta-button")}
                        as={Button}
                        componentProps={{
                            size: "lg",
                            href: getHref("home-cta-button"),
                            className: "bg-white text-blue-600 hover:bg-gray-100",
                            startIcon: <Calendar className="w-5 h-5 mr-2" />,
                        }}
                    />
                </div>
            </section>
        </div>
    );
};

export default Index;