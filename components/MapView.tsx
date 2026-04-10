import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Event, CATEGORIES, User, AppTheme } from '../types';
import { Search, Plus, Minus, Navigation, X, Lock, Users, MapPin, Share2, Globe, CheckCircle, ChevronRight, Loader2, Calendar, Clock, DollarSign } from 'lucide-react';

declare global {
  interface Window {
    google: any;
  }
}

interface MapViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  user: User;
  forceCenterEvent?: Event;
  currentCity: string;
  onCityChange: (city: string) => void;
}

const LIGHT_MAP_STYLE = [
  { "featureType": "all", "elementType": "geometry.fill", "stylers": [{ "weight": "2.00" }] },
  { "featureType": "all", "elementType": "geometry.stroke", "stylers": [{ "color": "#f1e3e3" }] },
  { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#fdf2f2" }] }, 
  { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] },
  { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -70 }, { "lightness": 20 }] },
  { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#a89999" }] },
  { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#e0e7ff" }] }
];

const DARK_MAP_STYLE = [
  { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }
];

const CITY_UNLOCK_DATA: Record<string, { count: number, required: number }> = {
  'Valencia': { count: 34, required: 50 },
  'Madrid': { count: 112, required: 200 },
  'Barcelona': { count: 85, required: 150 },
  'Sevilla': { count: 15, required: 60 },
  'Bilbao': { count: 12, required: 45 },
  'Málaga': { count: 22, required: 55 },
};

const TIME_FILTERS = ['Now', 'Tomorrow', '+3', '+4', '+5', '+6', '+7', '+8', '+9', '+10'];

// Color analizado de la imagen: Coral/Salmón vibrante pero suave
const SPOTIFY_FILTER_CORAL = '#FF8B7D';

const MapView: React.FC<MapViewProps> = ({ events, onEventClick, selectedCategory, onSelectCategory, user, forceCenterEvent, currentCity, onCityChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTime, setSelectedTime] = useState('Now');
  const [showOnlyPaid, setShowOnlyPaid] = useState(false);
  const [showUnlockDetails, setShowUnlockDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const autocompleteRef = useRef<any>(null);
  const overlaysRef = useRef<any[]>([]);

  const isDark = user.theme === AppTheme.DARK;

  const cityStatus = useMemo(() => {
    return CITY_UNLOCK_DATA[currentCity] || { count: 3, required: 50 };
  }, [currentCity]);

  const progressPercent = useMemo(() => {
    return (cityStatus.count / cityStatus.required) * 100;
  }, [cityStatus]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initMap = () => {
      if (!window.google) {
        setTimeout(initMap, 100);
        return;
      }

      if (!mapInstanceRef.current) {
        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: forceCenterEvent ? { lat: forceCenterEvent.lat, lng: forceCenterEvent.lng } : { lat: 39.4699, lng: -0.3763 },
          zoom: forceCenterEvent ? 16 : 14,
          disableDefaultUI: true,
          gestureHandling: 'greedy', 
          styles: isDark ? DARK_MAP_STYLE : LIGHT_MAP_STYLE,
          backgroundColor: isDark ? '#0f172a' : '#fdf2f2'
        });
        mapInstanceRef.current = map;
        geocoderRef.current = new window.google.maps.Geocoder();

        map.addListener('idle', () => {
          updateCityNameFromMap();
        });
      } else {
        mapInstanceRef.current.setOptions({ styles: isDark ? DARK_MAP_STYLE : LIGHT_MAP_STYLE });
        if (forceCenterEvent) {
          mapInstanceRef.current.panTo({ lat: forceCenterEvent.lat, lng: forceCenterEvent.lng });
          mapInstanceRef.current.setZoom(16);
        }
      }

      if (searchInputRef.current && !autocompleteRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
          types: ['(cities)'],
        });
        autocomplete.bindTo('bounds', mapInstanceRef.current);
        autocompleteRef.current = autocomplete;

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.geometry.location) return;

          mapInstanceRef.current.panTo(place.geometry.location);
          mapInstanceRef.current.setZoom(13);
          
          if (place.name) {
            onCityChange(place.name);
          }
          setSearchTerm(''); 
        });
      }
    };

    initMap();
  }, [isDark, forceCenterEvent]);

  const updateCityNameFromMap = () => {
    if (!geocoderRef.current || !mapInstanceRef.current) return;
    
    const center = mapInstanceRef.current.getCenter();
    setIsGeocoding(true);
    
    geocoderRef.current.geocode({ location: center }, (results: any, status: string) => {
      setIsGeocoding(false);
      if (status === 'OK' && results[0]) {
        const addressComponents = results[0].address_components;
        const cityComp = addressComponents.find((c: any) => 
          c.types.includes('locality') || 
          c.types.includes('administrative_area_level_2') ||
          c.types.includes('administrative_area_level_1')
        );
        
        if (cityComp && cityComp.long_name !== currentCity) {
          onCityChange(cityComp.long_name);
        }
      }
    });
  };

  const handleShare = () => {
    const link = `https://horizon.app/join/${currentCity.toLowerCase()}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;
    overlaysRef.current.forEach(overlay => overlay.setMap(null));
    overlaysRef.current = [];

    const filteredEvents = events.filter(e => {
      const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
      const matchesSearch = searchTerm === '' || e.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPaid = !showOnlyPaid || (e.price && e.price > 0);
      return matchesCategory && matchesSearch && matchesPaid;
    });

    class CustomMarker extends window.google.maps.OverlayView {
      position: any; div: HTMLElement | null; event: Event;
      constructor(position: any, event: Event) { super(); this.position = position; this.event = event; this.div = null; }
      onAdd() {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        
        const occupancy = this.event.attendees / this.event.maxCapacity;
        let borderColorClass = 'border-emerald-500'; 
        if (occupancy >= 1) borderColorClass = 'border-red-500';
        else if (occupancy >= 0.8) borderColorClass = 'border-amber-500';
        
        div.innerHTML = `<div class="relative w-12 h-12 rounded-full border-2 ${borderColorClass} shadow-ios bg-white p-[1.5px] cursor-pointer active:scale-90 transition-transform"><img src="${this.event.videoThumbnail}" class="w-full h-full object-cover rounded-full" /></div>`;
        div.addEventListener('click', (e) => { e.stopPropagation(); onEventClick(this.event); });
        this.div = div;
        this.getPanes().overlayMouseTarget.appendChild(div);
      }
      draw() {
        const overlayProjection = this.getProjection();
        if (!overlayProjection || !this.div) return;
        const pos = overlayProjection.fromLatLngToDivPixel(this.position);
        if (pos) { this.div.style.left = (pos.x - 24) + 'px'; this.div.style.top = (pos.y - 24) + 'px'; }
      }
      onRemove() { if (this.div) { this.div.parentNode?.removeChild(this.div); this.div = null; } }
    }

    filteredEvents.forEach(event => {
      const marker = new CustomMarker(new window.google.maps.LatLng(event.lat, event.lng), event);
      marker.setMap(mapInstanceRef.current);
      overlaysRef.current.push(marker);
    });
  }, [events, selectedCategory, searchTerm, onEventClick, selectedTime]);

  const searchPlaceholder = useMemo(() => {
    const prefix = selectedCategory === 'All' ? 'Search' : `Search ${selectedCategory}`;
    return `${prefix} in ${currentCity}...`;
  }, [selectedCategory, currentCity]);

  return (
    <div className="relative w-full h-full overflow-hidden font-sans bg-transparent">
      <div ref={mapContainerRef} className={`w-full h-full z-0 transition-opacity duration-1000 ${isDark ? 'opacity-70' : 'opacity-80'}`} />
      
      {showUnlockDetails && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-fade-in pointer-events-auto" onClick={() => setShowUnlockDetails(false)}>
              <div className={`${isDark ? 'bg-slate-900 border border-white/5' : 'bg-white border border-black/10'} rounded-[44px] w-full max-w-sm p-10 shadow-2xl animate-scale-in`} onClick={e => e.stopPropagation()}>
                  <div className={`w-16 h-16 ${isDark ? 'bg-accent/10' : 'bg-accent/5'} text-accent rounded-3xl flex items-center justify-center mb-6`}>
                      <Lock size={32} />
                  </div>
                  <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-black'} mb-2 tracking-tighter`}>Unlocking {currentCity}</h2>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8 text-left">
                    We need {cityStatus.required} businesses to activate the full network of local talent in {currentCity}.
                  </p>
                  
                  <div className={`${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'} p-6 rounded-3xl mb-8 border`}>
                      <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-black uppercase text-gray-400">Current Progress</span>
                          <span className={`text-[10px] font-black ${isDark ? 'text-white' : 'text-black'}`}>{cityStatus.count} / {cityStatus.required}</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-200/20 rounded-full overflow-hidden">
                          <div className="h-full bg-sunset-gradient transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                      </div>
                  </div>

                  <button 
                    onClick={handleShare}
                    className={`w-full py-5 rounded-3xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${copied ? 'bg-accent text-white' : 'bg-black text-white shadow-xl active:scale-95'}`}
                  >
                      {copied ? <><CheckCircle size={18} /> Copied</> : <><Share2 size={18} /> Share Link</>}
                  </button>
              </div>
          </div>
      )}

      {/* FILTROS SUPERIORES */}
      <div className="absolute top-8 left-0 right-0 z-20 px-4 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto flex flex-col gap-1.5">
          
          <div className={`relative shadow-sm rounded-[24px] overflow-hidden backdrop-blur-md border ${isDark ? 'border-white/20' : 'border-black/10'} bg-white/70`}>
               <div className="flex items-center px-5 py-4">
                  {isGeocoding ? (
                    <Loader2 className="text-primary w-4 h-4 mr-3 animate-spin" />
                  ) : (
                    <Search className="text-primary/40 w-4 h-4 mr-3" />
                  )}
                  <input 
                     ref={searchInputRef}
                     type="text" 
                     placeholder={searchPlaceholder} 
                     className={`flex-1 bg-transparent focus:outline-none font-bold text-sm text-primary placeholder:text-primary/30`} 
                     value={searchTerm} 
                     onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  
                  <button 
                    onClick={() => setShowUnlockDetails(true)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/20 bg-white/60 active:scale-95`}
                  >
                    <Users size={12} className="text-primary" />
                    <span className={`text-[10px] font-bold text-primary`}>{cityStatus.count}/{cityStatus.required}</span>
                  </button>
               </div>
               <div className="w-full h-0.5 bg-primary/5 overflow-hidden">
                  <div className="h-full bg-primary/20 transition-all duration-700" style={{ width: `${progressPercent}%` }} />
               </div>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
              {CATEGORIES.map(cat => (
                  <button
                      key={cat}
                      onClick={() => onSelectCategory(cat)}
                      className={`flex-shrink-0 px-5 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${isDark ? 'border-white/20' : 'border-black/10'} active:scale-95 ${
                        selectedCategory === cat 
                        ? 'bg-primary text-white shadow-glow-sunset' 
                        : 'bg-white/70 text-primary/80 backdrop-blur-md shadow-sm'
                      }`}
                  >
                      {cat}
                  </button>
              ))}
          </div>
        </div>
      </div>

      {/* PAID FILTER BUTTON */}
      <div className="absolute top-40 left-4 z-20 pointer-events-auto">
        <button
          onClick={() => setShowOnlyPaid(!showOnlyPaid)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-xl border ${
            showOnlyPaid 
            ? 'bg-primary text-white border-primary shadow-glow-sunset' 
            : 'bg-white/70 text-primary backdrop-blur-md border-black/10'
          } active:scale-95`}
          title={showOnlyPaid ? "Showing only paid events" : "Filter paid events"}
        >
          <DollarSign size={18} />
        </button>
      </div>

      <div className="absolute bottom-20 left-0 right-0 z-20 px-4 pointer-events-none mb-2">
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
              {TIME_FILTERS.map(time => (
                  <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`flex-shrink-0 px-5 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${isDark ? 'border-white/20' : 'border-black/10'} flex items-center gap-2 active:scale-95 ${
                        selectedTime === time 
                        ? 'bg-primary text-white shadow-glow-sunset' 
                        : 'bg-white/70 text-primary/80 backdrop-blur-md shadow-sm'
                      }`}
                  >
                      {time === 'Now' && <Clock size={14} />}
                      {time === 'Tomorrow' && <Calendar size={14} />}
                      {time}
                  </button>
              ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default MapView;