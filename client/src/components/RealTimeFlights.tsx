import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { aviationApi, FlightData } from '@/services/aviationApi';
import { 
  Plane, Clock, MapPin, Building, Users, AlertCircle, 
  CheckCircle, XCircle, Calendar, Globe, TrendingUp 
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RealTimeFlights: React.FC = () => {
  const [depIata, setDepIata] = useState('IST');
  const [arrIata, setArrIata] = useState('JFK');
  const [flightStatus, setFlightStatus] = useState('');
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFlights = async () => {
    if (!aviationApi.isApiKeyAvailable()) {
      setError('API anahtarı bulunamadı. Lütfen AVIATIONSTACK_API_KEY ortam değişkenini ayarlayın.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params: any = {
        limit: 20
      };

      if (depIata) params.dep_iata = depIata.toUpperCase();
      if (arrIata) params.arr_iata = arrIata.toUpperCase();
      if (flightStatus) params.flight_status = flightStatus;

      const flightData = await aviationApi.getFlights(params);
      setFlights(flightData);
    } catch (err) {
      setError('Uçuş verileri alınırken bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'landed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'incident': return 'bg-orange-100 text-orange-800';
      case 'diverted': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'landed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'incident': return <AlertCircle className="w-4 h-4" />;
      case 'diverted': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-blue-500" />
            Gerçek Zamanlı Uçuş Takibi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dep-iata">Kalkış Havaalanı (IATA)</Label>
              <Input
                id="dep-iata"
                placeholder="IST"
                value={depIata}
                onChange={(e) => setDepIata(e.target.value)}
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="arr-iata">Varış Havaalanı (IATA)</Label>
              <Input
                id="arr-iata"
                placeholder="JFK"
                value={arrIata}
                onChange={(e) => setArrIata(e.target.value)}
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flight-status">Uçuş Durumu</Label>
              <Select value={flightStatus} onValueChange={setFlightStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tümü" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tümü</SelectItem>
                  <SelectItem value="scheduled">Planlanmış</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="landed">İnmiş</SelectItem>
                  <SelectItem value="cancelled">İptal</SelectItem>
                  <SelectItem value="incident">Olay</SelectItem>
                  <SelectItem value="diverted">Yönlendirilmiş</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={fetchFlights}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Yükleniyor...' : 'Ara'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* API Key Missing Alert */}
      {!aviationApi.isApiKeyAvailable() && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            AviationStack API anahtarı bulunamadı. Gerçek zamanlı uçuş verilerini kullanmak için API anahtarınızı ekleyin.
          </AlertDescription>
        </Alert>
      )}

      {/* Flight Results */}
      <div className="grid grid-cols-1 gap-4">
        {flights.map((flight, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-semibold">{flight.airline.name}</div>
                      <div className="text-sm text-gray-500">{flight.flight.iata}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(flight.flight_status)}>
                    {getStatusIcon(flight.flight_status)}
                    <span className="ml-1 capitalize">{flight.flight_status}</span>
                  </Badge>
                  <div className="text-sm text-gray-500">
                    {flight.flight_date}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Departure */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-medium text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    Kalkış
                  </div>
                  <div className="pl-6 space-y-1">
                    <div className="font-medium">{flight.departure.airport}</div>
                    <div className="text-sm text-gray-500">
                      {flight.departure.iata} / {flight.departure.icao}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Planlanan:</span> {
                        new Date(flight.departure.scheduled).toLocaleString('tr-TR')
                      }
                    </div>
                    {flight.departure.estimated && (
                      <div className="text-sm">
                        <span className="font-medium">Tahmini:</span> {
                          new Date(flight.departure.estimated).toLocaleString('tr-TR')
                        }
                      </div>
                    )}
                    {flight.departure.terminal && (
                      <div className="text-sm">
                        <span className="font-medium">Terminal:</span> {flight.departure.terminal}
                      </div>
                    )}
                    {flight.departure.gate && (
                      <div className="text-sm">
                        <span className="font-medium">Gate:</span> {flight.departure.gate}
                      </div>
                    )}
                    {flight.departure.delay && flight.departure.delay > 0 && (
                      <div className="text-sm text-red-600">
                        <span className="font-medium">Gecikme:</span> {flight.departure.delay} dakika
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrival */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-medium text-blue-600">
                    <MapPin className="w-4 h-4" />
                    Varış
                  </div>
                  <div className="pl-6 space-y-1">
                    <div className="font-medium">{flight.arrival.airport}</div>
                    <div className="text-sm text-gray-500">
                      {flight.arrival.iata} / {flight.arrival.icao}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Planlanan:</span> {
                        new Date(flight.arrival.scheduled).toLocaleString('tr-TR')
                      }
                    </div>
                    {flight.arrival.estimated && (
                      <div className="text-sm">
                        <span className="font-medium">Tahmini:</span> {
                          new Date(flight.arrival.estimated).toLocaleString('tr-TR')
                        }
                      </div>
                    )}
                    {flight.arrival.terminal && (
                      <div className="text-sm">
                        <span className="font-medium">Terminal:</span> {flight.arrival.terminal}
                      </div>
                    )}
                    {flight.arrival.gate && (
                      <div className="text-sm">
                        <span className="font-medium">Gate:</span> {flight.arrival.gate}
                      </div>
                    )}
                    {flight.arrival.delay && flight.arrival.delay > 0 && (
                      <div className="text-sm text-red-600">
                        <span className="font-medium">Gecikme:</span> {flight.arrival.delay} dakika
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Aircraft Info */}
              {flight.aircraft && (
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Uçak Tipi:</span>
                      <div>{flight.aircraft.iata}</div>
                    </div>
                    <div>
                      <span className="font-medium">Kayıt:</span>
                      <div>{flight.aircraft.registration}</div>
                    </div>
                    <div>
                      <span className="font-medium">ICAO:</span>
                      <div>{flight.aircraft.icao}</div>
                    </div>
                    <div>
                      <span className="font-medium">ICAO24:</span>
                      <div>{flight.aircraft.icao24}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Data */}
              {flight.live && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Canlı Veriler</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Konum:</span>
                      <div>{flight.live.latitude.toFixed(4)}, {flight.live.longitude.toFixed(4)}</div>
                    </div>
                    <div>
                      <span className="font-medium">Yükseklik:</span>
                      <div>{flight.live.altitude.toFixed(0)} m</div>
                    </div>
                    <div>
                      <span className="font-medium">Hız:</span>
                      <div>{flight.live.speed_horizontal.toFixed(0)} km/h</div>
                    </div>
                    <div>
                      <span className="font-medium">Yön:</span>
                      <div>{flight.live.direction.toFixed(0)}°</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {flights.length === 0 && !loading && !error && (
        <Card>
          <CardContent className="text-center py-8">
            <Plane className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Belirtilen kriterlere uygun uçuş bulunamadı.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeFlights;