
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, User } from "lucide-react";

const About = () => {
  const achievements = [
    {
      year: "2023",
      title: "Excellence in Cardiovascular Surgery Award",
      organization: "American Heart Association",
      description: "Recognized for outstanding contributions to cardiovascular surgery and patient care."
    },
    {
      year: "2022",
      title: "Distinguished Physician Award",
      organization: "State Medical Board",
      description: "Honored for leadership in medical education and surgical innovation."
    },
    {
      year: "2021",
      title: "Research Excellence Grant",
      organization: "National Institutes of Health",
      description: "Awarded $2.5M grant for research in minimally invasive cardiac procedures."
    },
    {
      year: "2020",
      title: "Top Doctor Recognition",
      organization: "Medical Excellence Magazine",
      description: "Selected as one of the top cardiovascular surgeons in the region."
    }
  ];

  const certifications = [
    {
      title: "Board Certified Cardiovascular Surgeon",
      issuer: "American Board of Thoracic Surgery",
      year: "2010"
    },
    {
      title: "Advanced Cardiac Life Support (ACLS)",
      issuer: "American Heart Association",
      year: "2024"
    },
    {
      title: "Robotic Surgery Certification",
      issuer: "Intuitive Surgical Inc.",
      year: "2019"
    },
    {
      title: "Minimally Invasive Surgery Specialist",
      issuer: "Society of American Gastrointestinal Surgeons",
      year: "2018"
    }
  ];

  const experience = [
    {
      position: "Chief of Cardiovascular Surgery",
      institution: "Metropolitan Medical Center",
      period: "2018 - Present",
      description: "Leading a team of 12 surgeons and overseeing all cardiovascular surgical procedures. Implemented new protocols that reduced surgical complications by 25%."
    },
    {
      position: "Senior Cardiovascular Surgeon",
      institution: "University Hospital",
      period: "2012 - 2018",
      description: "Performed over 1,500 cardiac procedures including complex valve repairs and coronary bypasses. Established the minimally invasive cardiac surgery program."
    },
    {
      position: "Cardiac Surgery Fellow",
      institution: "Johns Hopkins Hospital",
      period: "2009 - 2012",
      description: "Specialized training in adult cardiac surgery with focus on valve repair and coronary artery disease treatment."
    },
    {
      position: "General Surgery Resident",
      institution: "Massachusetts General Hospital",
      period: "2004 - 2009",
      description: "Comprehensive surgical training with rotations in trauma, vascular, and cardiac surgery departments."
    }
  ];

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Dr. Sarah Mitchell, MD, FACS</h1>
          <p className="text-xl text-gray-600 mb-6">
            Board-Certified Cardiovascular Surgeon
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary">15+ Years Experience</Badge>
            <Badge variant="secondary">2,500+ Surgeries</Badge>
            <Badge variant="secondary">50+ Publications</Badge>
          </div>
        </div>

        {/* Bio Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">About Dr. Mitchell</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">
                Dr. Sarah Mitchell is a renowned cardiovascular surgeon with over 15 years of experience 
                in treating complex heart conditions. She graduated summa cum laude from Harvard Medical 
                School and completed her residency at Massachusetts General Hospital, followed by a 
                fellowship in cardiovascular surgery at Johns Hopkins Hospital.
              </p>
              <p className="mb-4">
                Dr. Mitchell's expertise lies in minimally invasive cardiac surgery, robotic-assisted 
                procedures, and complex valve repairs. She has pioneered several innovative surgical 
                techniques that have been adopted worldwide, significantly improving patient outcomes 
                and reducing recovery times.
              </p>
              <p>
                Beyond her surgical practice, Dr. Mitchell is actively involved in medical research 
                and education. She has published over 50 peer-reviewed articles in leading medical 
                journals and regularly speaks at international conferences. Her commitment to advancing 
                the field of cardiovascular surgery has earned her numerous awards and recognitions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Professional Experience */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Calendar className="w-6 h-6 mr-2" />
              Professional Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                    <Badge variant="outline">{exp.period}</Badge>
                  </div>
                  <p className="text-blue-600 font-medium mb-2">{exp.institution}</p>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Awards and Achievements */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Star className="w-6 h-6 mr-2" />
              Awards & Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-blue-100 text-blue-800">{achievement.year}</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                  <p className="text-blue-600 text-sm font-medium mb-2">{achievement.organization}</p>
                  <p className="text-gray-700 text-sm">{achievement.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Certifications & Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {certifications.map((cert, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-1">{cert.title}</h3>
                  <p className="text-blue-600 text-sm font-medium">{cert.issuer}</p>
                  <p className="text-gray-500 text-sm">Issued: {cert.year}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
