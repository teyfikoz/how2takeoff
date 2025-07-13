import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { aviationApi, FlightData, AirlineData, AirportData } from '@/services/aviationApi';
import { 
  Plane, Building, MapPin, TrendingUp, AlertTriangle, 
  CheckCircle, Database, RefreshCw, Activity 
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ApiIntegrationDashboard: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [recentFlights, setRecentFlights] = useState<FlightData[]>([]);
  const [topAirlines, setTopAirlines] = useState<AirlineData[]>([]);
  const [popularAirports, setPopularAirports] = useState<AirportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const checkApiStatus = async () => {
    if (!aviationApi.isApiKeyAvailable()) {
      setApiStatus('unavailable');
      return;
    }
    
    try {
      // Test API with a simple request
      await aviationApi.getFlights({ limit: 1 });
      setApiStatus('available');
    } catch (error) {
      setApiStatus('unavailable');
    }
  };

  const fetchDashboardData = async () => {
    if (apiStatus !== 'available') return;
    
    setLoading(true);
    try {
      // Fetch recent flights
      const flights = await aviationApi.getFlights({ 
        limit: 5,
        flight_status: 'active'
      });
      setRecentFlights(flights);

      // Fetch top airlines
      const airlines = await aviationApi.getAirlines({ limit: 8 });
      setTopAirlines(airlines);

      // Fetch popular airports
      const airports = await aviationApi.getAirports({ limit: 6 });
      setPopularAirports(airports);

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  useEffect(() => {
    if (apiStatus === 'available') {
      fetchDashboardData();
    }
  }, [apiStatus]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'unavailable': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-yellow-500 animate-pulse" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'API Aktif';
      case 'unavailable': return 'API Kullanılamıyor';
      default: return 'Kontrol Ediliyor...';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* API Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-500" />
              AviationStack API Durumu
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(apiStatus)}>
                {getStatusIcon(apiStatus)}
                <span className="ml-1">{getStatusText(apiStatus)}</span>
              </Badge>
              {apiStatus === 'available' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchDashboardData}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                  Yenile
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {apiStatus === 'unavailable' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                AviationStack API anahtarı bulunamadı veya API'ye erişilemiyor. 
                Gerçek zamanlı uçuş verilerini kullanmak için API anahtarınızı ekleyin.
              </AlertDescription>
            </Alert>
          )}
          
          {apiStatus === 'available' && lastUpdate && (
            <div className="text-sm text-gray-600">
              Son güncelleme: {lastUpdate.toLocaleString('tr-TR')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Flights */}
      {apiStatus === 'available' && recentFlights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Aktif Uçuşlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentFlights.map((flight, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Plane className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium">{flight.airline.name}</div>
                      <div className="text-sm text-gray-600">{flight.flight.iata}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {flight.departure.iata} → {flight.arrival.iata}
                    </div>
                    <div className="text-xs text-gray-500">
                      {flight.flight_status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Airlines */}
      {apiStatus === 'available' && topAirlines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-500" />
              Havayolu Şirketleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {topAirlines.map((airline, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="font-medium text-sm">{airline.airline_name}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {airline.iata_code} / {airline.icao_code}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {airline.country_name}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Popular Airports */}
      {apiStatus === 'available' && popularAirports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              Havaalanları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {popularAirports.map((airport, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-sm">{airport.airport_name}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {airport.iata_code} / {airport.icao_code}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {airport.country_name}
                  </div>
                  {airport.timezone && (
                    <div className="text-xs text-gray-500 mt-1">
                      {airport.timezone}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Integration Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            API Entegrasyonu Avantajları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Gerçek Zamanlı Veriler</h4>
              <p className="text-sm text-gray-600">
                Canlı uçuş takibi, gecikme bilgileri ve uçuş durumları
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Kapsamlı Havayolu Veritabanı</h4>
              <p className="text-sm text-gray-600">
                Dünya genelindeki havayolu şirketleri ve uçak tipleri
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Havaalanı Bilgileri</h4>
              <p className="text-sm text-gray-600">
                IATA/ICAO kodları, zaman dilimi ve konum bilgileri
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Rota Analizi</h4>
              <p className="text-sm text-gray-600">
                Havayolu rotaları ve uçuş programı verileri
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiIntegrationDashboard;