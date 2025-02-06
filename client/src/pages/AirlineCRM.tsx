import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiAirchina } from "react-icons/si";
import { Users, TrendingUp, Calculator, PieChart, Target, UserCheck, DollarSign, Brain, Sparkles } from "lucide-react";

export default function AirlineCRM() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <SiAirchina className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Airline CRM Analytics - Basit Anlatım ✈️
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Havayollarının müşteri ilişkilerini nasıl yönettiğini basit bir şekilde anlatan rehber.
          </p>
        </header>

        {/* CRM Nedir? */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              CRM Nedir? 🤔
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              CRM (Customer Relationship Management - Müşteri İlişkileri Yönetimi), 
              havayollarının yolcularını daha iyi tanımak ve onlara daha iyi hizmet 
              vermek için kullandığı bir sistemdir.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Ne İşe Yarar? 🎯</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Yeni yolcular bulmaya yardımcı olur
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Mevcut yolcuları mutlu eder
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Yolcuların başka havayollarına geçmesini önler
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Her yolcudan daha fazla gelir elde etmeye yardımcı olur
                  </li>
                </ul>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Örnek 💡</h3>
                <p>
                  Bir iş insanının genelde son dakika uçuş rezervasyonu yaptığını fark eden 
                  havayolu, ona özel son dakika fırsatları sunar. Böylece hem yolcu mutlu 
                  olur, hem de havayolu daha çok bilet satar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Önemli Hesaplamalar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-500" />
              Önemli Hesaplamalar 🧮
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Yeni Müşteri Maliyeti */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Yeni Müşteri Maliyeti
                </h3>
                <p className="text-gray-600 mt-2">
                  Bir yeni yolcu kazanmak için harcanan para
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <p className="text-sm font-medium">Formül:</p>
                  <div className="mt-2 p-2 bg-white rounded border text-sm">
                    Yeni Müşteri Maliyeti = 
                    <div className="border-t mt-1 pt-1">
                      Pazarlama Giderleri ÷ Yeni Müşteri Sayısı
                    </div>
                  </div>
                  <p className="text-sm mt-2 text-gray-600">
                    Örnek: 500.000₺ ÷ 10.000 yeni yolcu = 50₺/yolcu
                  </p>
                </div>
              </div>

              {/* Müşteri Tutma Maliyeti */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Müşteri Tutma Maliyeti
                </h3>
                <p className="text-gray-600 mt-2">
                  Mevcut yolcuları memnun etmek için harcanan para
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <p className="text-sm font-medium">Formül:</p>
                  <div className="mt-2 p-2 bg-white rounded border text-sm">
                    Müşteri Tutma Maliyeti =
                    <div className="border-t mt-1 pt-1">
                      Sadakat Programı Giderleri ÷ Mevcut Müşteri Sayısı
                    </div>
                  </div>
                  <p className="text-sm mt-2 text-gray-600">
                    Örnek: 200.000₺ ÷ 50.000 yolcu = 4₺/yolcu
                  </p>
                </div>
              </div>

              {/* Müşteri Yaşam Boyu Değeri */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Müşteri Yaşam Boyu Değeri
                </h3>
                <p className="text-gray-600 mt-2">
                  Bir yolcunun uzun vadede getirdiği toplam gelir
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <p className="text-sm font-medium">Hesaplama Örneği:</p>
                  <div className="mt-2 p-2 bg-white rounded border text-sm">
                    <ul className="space-y-1">
                      <li>• Ortalama bilet: 600₺</li>
                      <li>• Yıllık uçuş: 2 kez</li>
                      <li>• Sadakat süresi: 5 yıl</li>
                      <li className="border-t mt-1 pt-1 font-medium">
                        Toplam = 600₺ × 2 × 5 = 6.000₺
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Müşteri Tipleri */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Müşteri Tipleri 👥
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Yeni Müşteriler 🆕",
                  description: "İlk kez uçacak yolcular",
                  strategy: "Hoş geldin indirimleri, ilk uçuşa özel hediyeler"
                },
                {
                  title: "Sadık Müşteriler ⭐",
                  description: "Sürekli bizimle uçan yolcular",
                  strategy: "Mil puanları, özel check-in, ücretsiz bagaj hakkı"
                },
                {
                  title: "Kaybedilen Müşteriler 😢",
                  description: "12+ aydır uçuş yapmayan yolcular",
                  strategy: "Özel geri dönüş kampanyaları, kişiye özel teklifler"
                },
                {
                  title: "Risk Altındaki Müşteriler ⚠️",
                  description: "Uçuş sıklığı azalan yolcular",
                  strategy: "Erken müdahale, özel teklifler, anket ve geri bildirim"
                }
              ].map((type) => (
                <div key={type.title} className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold">{type.title}</h3>
                  <p className="text-gray-600 mt-2">{type.description}</p>
                  <div className="bg-blue-50 p-4 rounded-lg mt-4">
                    <p className="text-sm font-medium">Nasıl İlgileniyoruz:</p>
                    <p className="text-sm mt-1">{type.strategy}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Başarı Hikayeleri */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Başarı Hikayeleri 🌟
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  title: "Yapay Zeka ile Müşteri Kazanımı",
                  problem: "Genel reklamlar yeterince etkili değildi",
                  solution: [
                    "Yapay zeka ile müşteri davranışlarını analiz ettiler",
                    "Kişiye özel reklamlar gösterdiler",
                    "Reklam bütçesini daha akıllıca kullandılar"
                  ],
                  results: [
                    "Müşteri kazanma maliyeti %30 düştü",
                    "Reklam tıklanma oranı %18 arttı",
                    "E-posta açılma oranı 3 kat arttı"
                  ]
                },
                {
                  title: "Sadakat Programı Başarısı",
                  problem: "Yolcular sık uçmasına rağmen az harcıyordu",
                  solution: [
                    "Kademeli sadakat programı başlattılar",
                    "Kişiye özel kampanyalar sundular",
                    "Dinamik fiyatlandırma kullandılar"
                  ],
                  results: [
                    "Müşteri değeri %25 arttı",
                    "Üst kademe üyelerin harcaması %40 arttı",
                    "Ek hizmet geliri %12 yükseldi"
                  ]
                }
              ].map((story) => (
                <div key={story.title} className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold">{story.title}</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="font-medium">Problem:</p>
                      <p className="text-gray-600">{story.problem}</p>
                    </div>
                    <div>
                      <p className="font-medium">Çözüm:</p>
                      <ul className="list-disc pl-5 text-gray-600">
                        {story.solution.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-medium">Sonuçlar:</p>
                      <ul className="mt-2 space-y-1">
                        {story.results.map((result, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-green-500">🚀</span>
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <footer className="mt-12 text-center text-gray-500 text-sm border-t pt-6">
          <p>IATA ve ICAO standartlarına uygun olarak hazırlanmıştır</p>
          <p className="mt-2">© Aviation Performance Analytics</p>
        </footer>
      </div>
    </div>
  );
}