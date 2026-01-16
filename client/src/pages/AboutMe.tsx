import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiLinkedin } from "react-icons/si";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useSEO } from "@/hooks/useSEO";
import { HeaderAd } from "@/components/AdSense";

export default function AboutMe() {
  const { toast } = useToast();

  useSEO({
    title: "About Me - Teyfik ÖZ | Aviation Business Expert - How2TakeOff",
    description: "Hi, I am Teyfik ÖZ. I have experience in Airline Revenue Management, CRM, Data Analytics, Reporting, Sales & Marketing. Learn more about my background and expertise.",
    keywords: "Teyfik ÖZ, aviation revenue management, airline CRM, data analytics, aviation expert, aviation career",
    canonical: "https://how2takeoff.com/about"
  });

  const trackProfileClick = async (type: "linkedin" | "email") => {
    try {
      await apiRequest("POST", "/api/analytics/profile-click", { type });
    } catch (error) {
      console.error("Failed to track profile click:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-4 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <HeaderAd />
        
        <Card className="mt-4 shadow-2xl border-2 border-blue-200">
          <CardHeader className="pb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl sm:text-4xl font-bold flex items-center gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center text-blue-600 text-xl sm:text-2xl font-bold shadow-lg">
                TÖ
              </div>
              About Me
            </CardTitle>
            <p className="text-blue-100 mt-2 text-base sm:text-lg">
              Aviation Expert | Data Analytics Professional | Travel Enthusiast
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6 px-4 sm:px-6 pb-6">
            {/* Profile Summary Card */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 sm:p-6 rounded-xl border-2 border-blue-200 shadow-md">
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                <span className="text-3xl sm:text-4xl">👋</span>
                Welcome!
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                I am <strong className="text-blue-700">Teyfik ÖZ</strong>, an aviation business professional with expertise in Revenue Management, CRM, Data Analytics, and Sales & Marketing.
                I am passionate about transforming aviation data into actionable insights.
              </p>
            </div>

            {/* Main Content */}
            <div className="text-gray-700 leading-relaxed space-y-4 text-base">
              <p>
                Hi, I am Teyfik ÖZ. I have experience in Airline Revenue Management, CRM, Data Analytics, Reporting, Sales & Marketing, and Corporate Sales. 
                Over the years, I have contributed to various projects across different industries, which has helped me develop a broader perspective on business and data-driven decision-making.
              </p>
              
              <p>
                I earned my undergraduate degree in Physics from Istanbul Kültür University and pursued a Master&apos;s degree in Energy Science and Technology at Istanbul Technical University (ITU). 
                During my studies, I also had the opportunity to study at KTH Royal Institute of Technology in Sweden. My passion for science and analytics has always shaped my academic work and professional projects.
              </p>
              
              <p>
                While serving in the Turkish Armed Forces, I became a duty-related disabled veteran due to a health condition. 
                This experience has given me a deeper appreciation for life and a greater sense of purpose in my work and personal journey.
              </p>
              
              <p>
                Outside of work, I love traveling, discovering new places, and immersing myself in different cultures. 
                Scuba diving is one of my greatest passions. As I advance in this field, I hope to contribute to the preservation of marine life and ecosystems. 
                My love for nature and animals is a central part of who I am.
              </p>
              
              <p className="text-lg font-medium text-blue-700">
                And yes—&quot;Good Food, Good Mood&quot; is not just a saying to me. It is a lifestyle.
              </p>
            </div>

            {/* Experience & Education Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-gradient-to-br from-green-50 to-white p-5 sm:p-6 rounded-xl border-2 border-green-200 shadow-md">
                <h3 className="text-xl sm:text-2xl font-bold text-green-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl">💼</span>
                  Professional Experience
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1 text-xl">✓</span>
                    <span>Airline Revenue Management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1 text-xl">✓</span>
                    <span>Customer Relationship Management (CRM)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1 text-xl">✓</span>
                    <span>Data Analytics & Reporting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1 text-xl">✓</span>
                    <span>Sales & Marketing Strategy</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-white p-5 sm:p-6 rounded-xl border-2 border-orange-200 shadow-md">
                <h3 className="text-xl sm:text-2xl font-bold text-orange-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl">🎓</span>
                  Education
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span><strong>MSc</strong> - Energy Science & Technology (ITU)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span><strong>BSc</strong> - Physics (Istanbul Kültür University)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span><strong>Exchange</strong> - KTH Royal Institute (Sweden)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Personal Interests */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 sm:p-6 rounded-xl border-2 border-purple-200 shadow-md">
              <h3 className="text-xl sm:text-2xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                <span className="text-2xl sm:text-3xl">🌟</span>
                Beyond Work
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-gray-700">
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                  <span className="text-3xl">✈️</span>
                  <span className="font-medium">Travel Enthusiast</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                  <span className="text-3xl">🤿</span>
                  <span className="font-medium">Scuba Diving</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                  <span className="text-3xl">🍽️</span>
                  <span className="font-medium">Good Food, Good Mood</span>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 sm:p-8 rounded-xl shadow-xl text-white">
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 flex items-center gap-2">
                <span className="text-3xl sm:text-4xl">📬</span>
                Let&apos;s Connect!
              </h3>
              <p className="text-blue-100 mb-5 text-base sm:text-lg leading-relaxed">
                I am always open to discussing aviation, data analytics, or new opportunities.
                Feel free to reach out!
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 shadow-lg text-base sm:text-lg py-5"
                  onClick={() => {
                    window.open("https://www.linkedin.com/in/teyfik-%C3%B6-a3953935/", "_blank");
                    trackProfileClick("linkedin");
                  }}
                >
                  <SiLinkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                  Connect on LinkedIn
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex items-center justify-center gap-2 bg-white text-purple-600 hover:bg-purple-50 shadow-lg text-base sm:text-lg py-5"
                  onClick={() => {
                    window.location.href = "mailto:teyfikoz@yahoo.com";
                    trackProfileClick("email");
                  }}
                >
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                  Send an Email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
