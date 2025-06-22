import { useMemo } from 'react';
import { usePublicContent } from '@/hooks/usePublicContent';
import { InlineText } from '@/components/ui/InlineText';
import { InlineTextarea } from '@/components/ui/InlineTextarea';
import { InlineLink } from '@/components/ui/InlineLink';
import { InlineImage } from '@/components/ui/InlineImage';
import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Calendar, Clock, Star} from "lucide-react";

const Index = () => {
  const { data: content = [], isLoading, isError } = usePublicContent();

  console.log('Conco: ', content);

  const homeContent = useMemo(
      () => content.filter(item => item.page === 'home'),
      [content]
  );

  const homeContentById = useMemo(() => {
    return Object.fromEntries(homeContent.map(item => [item.id, item]));
  }, [homeContent]);

  const homeContentBySection = useMemo(() => {
    return homeContent.reduce<Record<string, typeof homeContent>>((acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    }, {});
  }, [homeContent]);

  const getValue = (id: string) => homeContentById[id]?.value || '';
  const getHref = (id: string) => homeContentById[id]?.href || '';
  const getAlt = (id: string) => homeContentById[id]?.alt || '';

  if (isLoading) {
    return <div className="py-32 text-center">Loading homepage...</div>;
  }

  if (isError) {
    return <div className="py-32 text-center text-red-600">Failed to load homepage content.</div>;
  }

  const specializationDescription = getValue('home-specialization-description');

  return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <InlineText
                    id="home-hero-title"
                    defaultValue={getValue('home-hero-title')}
                    className="text-4xl md:text-5xl font-bold mb-6"
                    as="h1"
                />
                <InlineTextarea
                    id="home-hero-subtitle"
                    defaultValue={getValue('home-hero-subtitle')}
                    previewClassName="text-xl text-blue-100 mb-8"
                    rows={3}
                />
                <div className="flex flex-col sm:flex-row gap-4">
                    <InlineLink
                        id="home-hero-cta1"
                        defaultLabel={getValue('home-hero-cta1')}
                        defaultHref={getHref('home-hero-cta1')}
                        as={Button}
                        componentProps={{
                            asChild: true,
                            href: getHref('home-hero-cta1'),
                            size: 'lg',
                            className: 'bg-white text-blue-600 hover:bg-gray-100',
                            startIcon: <Calendar className="w-5 h-5 mr-2" />,
                        }}
                    />
                    <InlineLink
                        id="home-hero-cta2"
                        defaultLabel={getValue('home-hero-cta2')}
                        defaultHref={getHref('home-hero-cta2')}
                        as={Button}
                        componentProps={{
                            asChild: true,
                            size: 'lg',
                            variant: 'outline',
                            className: 'border-white text-blue-600 hover:bg-white hover:text-blue-600',
                        }}
                    />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center">
                  <InlineImage
                      id="home-hero-image"
                      defaultSrc={getValue('home-1750604364419')}
                      defaultAlt={getAlt('home-1750604364419') || 'Doctor illustration'}
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
                    defaultValue={getValue('home-blog-title')}
                    className="text-3xl font-bold text-gray-900 mb-4"
                    as="h1"
                />
                <InlineText
                    id="home-blog-subtitle"
                    defaultValue={getValue('home-blog-subtitle')}
                    className="text-lg text-gray-600"
                    as="p"
                />
              </div>
                <InlineLink
                    id="home-1750608553525"
                    defaultLabel={getValue('home-1750608553525')}
                    defaultHref={getHref('home-1750608553525')}
                    as={Button}
                    componentProps={{
                        variant: "outline"
                    }}
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
                        {getValue('home-blog-description')}
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
                  defaultValue={getValue('home-cta-title')}
                  className="text-3xl font-bold mb-4"
                  as="h2"
              />
              <InlineText
                  id="home-cta-subtitle"
                  defaultValue={getValue('home-cta-subtitle')}
                  className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
                  as="p"
              />
              <InlineLink
                  id="home-cta-button"
                  defaultLabel={getValue('home-cta-button')}
                  defaultHref={getHref('home-cta-button')}
                  as={Button}
                  componentProps={{
                      asChild: true,
                      size: 'lg',
                      className: 'bg-white text-blue-600 hover:bg-gray-100',
                      startIcon: <Calendar className="w-5 h-5 mr-2" />,
                  }}
              />
          </div>
        </section>
      </div>
  );
};

export default Index;