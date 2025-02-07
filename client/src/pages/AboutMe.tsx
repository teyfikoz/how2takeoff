import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiLinkedin } from "react-icons/si";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AboutMe() {
  const { toast } = useToast();

  const trackProfileClick = async (type: 'linkedin' | 'email') => {
    try {
      await apiRequest('POST', '/api/analytics/profile-click', { type });
    } catch (error) {
      console.error('Failed to track profile click:', error);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">About Me</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <p>Hi! I'm Teyfik ÖZ. I have experience in Airline Revenue Management, CRM, Data Analytics, Reporting, Sales & Marketing, and Corporate Sales. Throughout my career, I've had the opportunity to work on various projects across different industries, which has helped me gain a deeper understanding of business dynamics and develop a broader perspective.</p>

            <p>I completed my undergraduate studies in Physics at Istanbul Kültür University, then pursued a Master's degree in Energy Science and Technology at Istanbul Technical University (ITU). Additionally, I had the opportunity to study at Kungliga Tekniska Högskolan (KTH) in Sweden. My passion for science and analytics has also been reflected in my academic research.</p>

            <p>Outside of work, I love traveling, exploring new places, and experiencing different cultures. Scuba diving, being in nature, and spending time with animals bring me great joy. I also firmly believe in the connection between good food and a good mood, which is why "Good Food, Good Mood" is more than just a phrase to me—it's a way of life.</p>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">📌 Contact Information</h3>
              <div className="space-y-2">
                <p>👤 Teyfik ÖZ</p>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {
                      window.open('https://www.linkedin.com/in/teyfik-%C3%B6-a3953935/', '_blank');
                      trackProfileClick('linkedin');
                    }}
                  >
                    <SiLinkedin className="w-5 h-5" />
                    LinkedIn Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {
                      window.location.href = 'mailto:teyfikoz@yahoo.com';
                      trackProfileClick('email');
                    }}
                  >
                    <Mail className="w-5 h-5" />
                    Email: teyfikoz@yahoo.com
                  </Button>
                </div>
                <p className="mt-4">Feel free to reach out! 😊</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
