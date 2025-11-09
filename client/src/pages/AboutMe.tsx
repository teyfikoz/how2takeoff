import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiLinkedin } from "react-icons/si";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useSEO } from '@/hooks/useSEO';
import { HeaderAd } from '@/components/AdSense';

export default function AboutMe() {
  const { toast } = useToast();

  useSEO({
    title: 'About Me - Teyfik ÖZ | Aviation Business Expert - How2TakeOff',
    description: 'Hi, I\'m Teyfik ÖZ. I have experience in Airline Revenue Management, CRM, Data Analytics, Reporting, Sales & Marketing. Learn more about my background and expertise.',
    keywords: 'Teyfik ÖZ, aviation revenue management, airline CRM, data analytics, aviation expert, aviation career',
    canonical: 'https://how2takeoff.com/about'
  });

  const trackProfileClick = async (type: 'linkedin' | 'email') => {
    try {
      await apiRequest('POST', '/api/analytics/profile-click', { type });
    } catch (error) {
      console.error('Failed to track profile click:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <HeaderAd />
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">About Me</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-lg">
            <p>Hi, I'm Teyfik ÖZ. I have experience in Airline Revenue Management, CRM, Data Analytics, Reporting, Sales & Marketing, and Corporate Sales. Over the years, I've contributed to various projects across different industries, which has helped me develop a broader perspective on business and data-driven decision-making.</p>
            
            <p>I earned my undergraduate degree in Physics from Istanbul Kültür University and pursued a Master's degree in Energy Science and Technology at Istanbul Technical University (ITU). During my studies, I also had the opportunity to study at KTH Royal Institute of Technology in Sweden. My passion for science and analytics has always shaped my academic work and professional projects.</p>
            
            <p>While serving in the Turkish Armed Forces, I became a duty-related disabled veteran due to a health condition. This experience has given me a deeper appreciation for life and a greater sense of purpose in my work and personal journey.</p>
            
            <p>Outside of work, I love traveling, discovering new places, and immersing myself in different cultures. Scuba diving is one of my greatest passions. As I advance in this field, I hope to contribute to the preservation of marine life and ecosystems. My love for nature and animals is a central part of who I am.</p>
            
            <p>And yes—"Good Food, Good Mood" isn't just a saying to me. It's a lifestyle.</p>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">📌 Contact Information</h3>
              <div className="space-y-2">
                <p>👤 Teyfik ÖZ</p>
                <div className="flex flex-wrap gap-4">
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