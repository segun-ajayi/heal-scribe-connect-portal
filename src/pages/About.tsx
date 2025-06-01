
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, User } from "lucide-react";

const About = () => {
  const achievements = [
    {
      year: "2023",
      title: "Excellence in General Surgery Award",
      organization: "Nigerian Medical Association",
      description: "Recognized for outstanding contributions to general surgery and patient care in Nigeria."
    },
    {
      year: "2022",
      title: "Distinguished Physician Award",
      organization: "Medical and Dental Council of Nigeria",
      description: "Honored for leadership in medical education and surgical innovation."
    },
    {
      year: "2021",
      title: "Research Excellence Grant",
      organization: "TETFund Nigeria",
      description: "Awarded research grant for studies in minimally invasive surgical procedures."
    },
    {
      year: "2020",
      title: "Top Surgeon Recognition",
      organization: "West African College of Surgeons",
      description: "Selected as one of the top general surgeons in West Africa."
    }
  ];

  const certifications = [
    {
      title: "Fellow of the West African College of Surgeons (FWACS)",
      issuer: "West African College of Surgeons",
      year: "2015"
    },
    {
      title: "Fellow of the National Postgraduate Medical College (FMPCS)",
      issuer: "National Postgraduate Medical College of Nigeria",
      year: "2014"
    },
    {
      title: "Advanced Trauma Life Support (ATLS)",
      issuer: "American College of Surgeons",
      year: "2024"
    },
    {
      title: "Laparoscopic Surgery Certification",
      issuer: "Society of Laparoendoscopic Surgeons",
      year: "2019"
    }
  ];

  const experience = [
    {
      position: "Senior Consultant General Surgeon",
      institution: "Obafemi Awolowo University Teaching Hospitals Complex Ile-Ife",
      period: "2018 - Present",
      description: "Leading general surgery department and overseeing all surgical procedures. Implemented new protocols that improved surgical outcomes and reduced complications."
    },
    {
      position: "Consultant General Surgeon",
      institution: "Obafemi Awolowo University Teaching Hospitals Complex Ile-Ife",
      period: "2015 - 2018",
      description: "Performed over 2,000 general surgical procedures including emergency surgeries, elective operations, and minimally invasive procedures."
    },
    {
      position: "Senior Registrar",
      institution: "University College Hospital Ibadan",
      period: "2012 - 2015",
      description: "Advanced surgical training with focus on general surgery, trauma surgery, and emergency surgical procedures."
    },
    {
      position: "Registrar",
      institution: "Lagos University Teaching Hospital",
      period: "2009 - 2012",
      description: "Comprehensive surgical training with rotations in various surgical specialties including general surgery, orthopedics, and plastic surgery."
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Dr. Funmilola Wuraola, MBBS, FWACS, FMPCS</h1>
          <p className="text-xl text-gray-600 mb-6">
            Senior Consultant General Surgeon
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary">12+ Years Experience</Badge>
            <Badge variant="secondary">2,000+ Surgeries</Badge>
            <Badge variant="secondary">30+ Publications</Badge>
          </div>
        </div>

        {/* Bio Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">About Dr. Wuraola</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">
                Dr. Funmilola Wuraola is a distinguished general surgeon with over 12 years of experience 
                in treating complex surgical conditions. She graduated with distinction from the College of 
                Medicine, University of Lagos, and completed her residency training through the National 
                Postgraduate Medical College of Nigeria and West African College of Surgeons.
              </p>
              <p className="mb-4">
                Dr. Wuraola's expertise lies in general surgery, emergency surgical procedures, and 
                minimally invasive surgical techniques. She has pioneered several innovative surgical 
                approaches that have been adopted across Nigeria, significantly improving patient outcomes 
                and reducing recovery times in resource-limited settings.
              </p>
              <p>
                Beyond her surgical practice at Obafemi Awolowo University Teaching Hospitals Complex, 
                Dr. Wuraola is actively involved in medical research and education. She has published 
                over 30 peer-reviewed articles in leading medical journals and regularly speaks at 
                national and international conferences. Her commitment to advancing surgical care in 
                Nigeria has earned her numerous awards and recognitions.
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
