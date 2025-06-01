
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, Star, User, Clock } from "lucide-react";

const Index = () => {
  const stats = [
    { label: "Years of Experience", value: "15+" },
    { label: "Successful Surgeries", value: "2,500+" },
    { label: "Research Publications", value: "50+" },
    { label: "Awards Received", value: "12" },
  ];

  const specializations = [
    "General Surgery",
    "Laparoscopic Surgery",
    "Emergency Surgery",
    "Trauma Surgery",
    "Abdominal Surgery",
    "Surgical Oncology",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Leading General Surgeon
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Dr. Funmilola Wuraola is a distinguished General Surgeon at Obafemi Awolowo University 
                Teaching Hospitals Complex, Ile-Ife, dedicated to providing exceptional surgical care 
                through innovative techniques and compassionate patient treatment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/appointments">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Consultation
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    Learn More
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

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Areas of Expertise</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Specialized in comprehensive general surgical procedures with expertise in 
              modern techniques and patient-centered care at OAUTHC.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specializations.map((spec, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{spec}</h3>
                  <p className="text-gray-600 text-sm">
                    Advanced surgical techniques with proven outcomes and minimal recovery time.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Medical Insights</h2>
              <p className="text-lg text-gray-600">
                Stay updated with the latest research and medical advances.
              </p>
            </div>
            <Link to="/blog">
              <Button variant="outline">View All Posts</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Badge className="mb-3">General Surgery</Badge>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Modern Approaches in General Surgery Practice
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Exploring contemporary surgical techniques and their impact on patient 
                    outcomes in general surgery practice...
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
          <h2 className="text-3xl font-bold mb-4">Ready to Take the Next Step?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Schedule a consultation to discuss your surgical needs and treatment options with Dr. Wuraola.
          </p>
          <Link to="/appointments">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Calendar className="w-5 h-5 mr-2" />
              Book Your Appointment
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
