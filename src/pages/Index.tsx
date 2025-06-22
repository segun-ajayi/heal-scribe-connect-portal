import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Star, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePublicContent } from '@/hooks/usePublicContent';

const Index = () => {
  const { data: content = [], isLoading, isError } = usePublicContent();

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
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {getValue('home-hero-title')}
                </h1>
                <p className="text-xl text-blue-100 mb-8">
                  {getValue('home-hero-subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={getHref('home-hero-cta1')}>
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                      <Calendar className="w-5 h-5 mr-2" />
                      {getValue('home-hero-cta1')}
                    </Button>
                  </Link>
                  <Link to={getHref('home-hero-cta2')}>
                    <Button
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-blue-600"
                    >
                      {getValue('home-hero-cta2')}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center">
                  <User className="w-40 h-40 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {(homeContentBySection['Statistics'] || []).map(stat => (
                  <div key={stat.id} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specializations Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Areas of Expertise</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {getValue('home-specializations-subtitle')}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(homeContentBySection['Specializations'] || []).map(item => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.value}</h3>
                      <p className="text-gray-600 text-sm">{specializationDescription}</p>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {getValue('home-blog-title')}
                </h2>
                <p className="text-lg text-gray-600">{getValue('home-blog-subtitle')}</p>
              </div>
              <Link to="/blog">
                <Button variant="outline">View All Posts</Button>
              </Link>
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
            <h2 className="text-3xl font-bold mb-4">{getValue('home-cta-title')}</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {getValue('home-cta-subtitle')}
            </p>
            <Link to={getHref('home-cta-button')}>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Calendar className="w-5 h-5 mr-2" />
                {getValue('home-cta-button')}
              </Button>
            </Link>
          </div>
        </section>
      </div>
  );
};

export default Index;