import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Event, CATEGORIES, User, AppTheme, UserType } from '../types';
import { MOCK_BUSINESSES } from '../constants';
import { Search, Plus, Minus, Navigation, X, Lock, Users, MapPin, Share2, Globe, CheckCircle, ChevronRight, Loader2, Calendar, Clock, DollarSign, Camera, Mic } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import ContextMenu from './ui/ContextMenu';

declare global {
  interface Window {
    google: any;
  }
}

interface MapViewProps {
  events: Event[];
  onEventClick: (event: Event, e?: any) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedTime: string;
  onSelectTime: (time: string) => void;
  priceFilter: 'all' | 'paid' | 'free';
  onSelectPriceFilter: (filter: 'all' | 'paid' | 'free') => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  user: User;
  forceCenterEvent?: Event;
  currentCity: string;
  onCityChange: (city: string) => void;
  onCapture?: (file: File) => void;
  isEventSelected?: boolean;
}

const LIGHT_MAP_STYLE = [
  { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "visibility": "on" }] },
  { "featureType": "poi.park", "elementType": "labels", "stylers": [{ "visibility": "on" }] },
  { "featureType": "transit", "stylers": [{ "visibility": "off" }] },
  { "featureType": "road", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }
];

const DARK_MAP_STYLE = [
  { "elementType": "geometry", "stylers": [{ "color": "#0B1120" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca3af" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#0B1120" }] },
  { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "visibility": "on" }] },
  { "featureType": "poi.park", "elementType": "labels", "stylers": [{ "visibility": "on" }] },
  { "featureType": "transit", "stylers": [{ "visibility": "off" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#1F2937" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#111827" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#060914" }] }
];

const CITY_UNLOCK_DATA: Record<string, { count: number, required: number }> = {
  'Valencia': { count: 34, required: 50 },
  'Madrid': { count: 112, required: 200 },
  'Barcelona': { count: 85, required: 150 },
  'Sevilla': { count: 15, required: 60 },
  'Bilbao': { count: 12, required: 45 },
  'Málaga': { count: 22, required: 55 },
};

const TIME_FILTERS = ['Now', 'Tomorrow', '+2', '+3', '+4', '+5', '+6', '+7'];

// Color analizado de la imagen: Coral/Salmón vibrante pero suave
const SPOTIFY_FILTER_CORAL = '#FF8B7D';

const MapView: React.FC<MapViewProps> = ({ 
  events, 
  onEventClick, 
  selectedCategory, 
  onSelectCategory, 
  selectedTime,
  onSelectTime,
  priceFilter,
  onSelectPriceFilter,
  searchTerm,
  onSearchChange,
  user, 
  forceCenterEvent, 
  currentCity, 
  onCityChange, 
  onCapture,
  isEventSelected
}) => {
  const [showUnlockDetails, setShowUnlockDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [showAIPopup, setShowAIPopup] = useState(false);
  const [activeContextMenu, setActiveContextMenu] = useState<{ event: Event, position: { x: number, y: number } } | null>(null);
  
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const userMarkerRef = useRef<any>(null);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const autocompleteRef = useRef<any>(null);
  const overlaysRef = useRef<any[]>([]);

  const isDark = user.theme === AppTheme.DARK;

  const cityStatus = useMemo(() => {
    // Count actual events in this city from the events prop
    const actualEventCount = events.filter(e => 
      e.address.toLowerCase().includes(currentCity.toLowerCase()) || 
      e.tags.some(t => t.toLowerCase() === currentCity.toLowerCase())
    ).length;

    // Count actual businesses in this city
    const actualBusinessCount = MOCK_BUSINESSES.filter(b => 
      b.location.toLowerCase().includes(currentCity.toLowerCase())
    ).length;

    const mockData = CITY_UNLOCK_DATA[currentCity] || { count: 0, required: 50 };
    
    // Use the higher of the counts to ensure cities with events or businesses aren't marked as empty
    return { 
      count: Math.max(actualEventCount, actualBusinessCount, mockData.count), 
      required: mockData.required 
    };
  }, [currentCity, events]);

  const progressPercent = useMemo(() => {
    return (cityStatus.count / cityStatus.required) * 100;
  }, [cityStatus]);

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleRecenterLocation = () => {
    if (mapInstanceRef.current && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(pos);
          mapInstanceRef.current.panTo(pos);
          mapInstanceRef.current.setZoom(15);
          
          // Update or create user marker
          if (userMarkerRef.current) {
            userMarkerRef.current.setPosition(pos);
          } else {
            userMarkerRef.current = new window.google.maps.Marker({
              position: pos,
              map: mapInstanceRef.current,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 2,
              },
              title: 'Your Location'
            });
          }
        },
        (error) => {
          console.error("Error: The Geolocation service failed.", error);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const togglePriceFilter = () => {
    if (priceFilter === 'all') onSelectPriceFilter('paid');
    else if (priceFilter === 'paid') onSelectPriceFilter('free');
    else onSelectPriceFilter('all');
  };

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
          backgroundColor: isDark ? '#0B1120' : '#fdf2f2'
        });
        mapInstanceRef.current = map;
        geocoderRef.current = new window.google.maps.Geocoder();

        map.addListener('idle', () => {
          updateCityNameFromMap();
        });
      } else {
        mapInstanceRef.current.setOptions({ styles: isDark ? DARK_MAP_STYLE : LIGHT_MAP_STYLE });
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
          onSearchChange(''); 
        });
      }
    };

    initMap();
  }, [isDark]);

  // Separate effect for centering to ensure it's fluid and doesn't re-init map
  useEffect(() => {
    if (!mapInstanceRef.current || !forceCenterEvent) return;

    const performCentering = () => {
      // Set zoom first
      mapInstanceRef.current.setZoom(16);
      
      // Pan to the event location
      mapInstanceRef.current.panTo({ lat: forceCenterEvent.lat, lng: forceCenterEvent.lng });
      
      if (isEventSelected) {
        // Position the marker at the top (visible 35% area).
        // The map center is at 50%. We move the center DOWN (positive Y) so the marker appears HIGHER.
        const offset = window.innerHeight * 0.3; 
        
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panBy(0, offset);
          }
        }, 150);
      }
    };

    performCentering();
  }, [forceCenterEvent, isEventSelected]);

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
    const link = `https://horizon.app/join/${currentCity.toLowerCase()}?inviteCode=${user.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (forceCenterEvent) {
      // Find which time filter matches this event's date
      const eventDate = forceCenterEvent.date;
      const baseDate = new Date('2026-03-31');
      const diffTime = new Date(eventDate).getTime() - baseDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) onSelectTime('Now');
      else if (diffDays === 1) onSelectTime('Tomorrow');
      else if (diffDays > 1 && diffDays <= 7) onSelectTime(`+${diffDays}`);
      
      // Also ensure category matches
      if (selectedCategory !== 'All' && selectedCategory !== forceCenterEvent.category) {
        onSelectCategory('All');
      }
    }
  }, [forceCenterEvent]);

  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;
    overlaysRef.current.forEach(overlay => overlay.setMap(null));
    overlaysRef.current = [];

    const filteredEvents = events.filter(e => {
      const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
      const matchesSearch = searchTerm === '' || e.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesPrice = true;
      if (priceFilter === 'paid') matchesPrice = Boolean(e.price && e.price > 0);
      else if (priceFilter === 'free') matchesPrice = !e.price || e.price === 0;
      
      let matchesTime = true;
      if (selectedTime === 'Now') {
        matchesTime = e.date === '2026-03-31';
      } else if (selectedTime === 'Tomorrow') {
        matchesTime = e.date === '2026-04-01';
      } else if (selectedTime.startsWith('+')) {
        const days = parseInt(selectedTime.substring(1));
        const targetDate = new Date('2026-03-31');
        targetDate.setDate(targetDate.getDate() + days);
        const dateStr = targetDate.toISOString().split('T')[0];
        matchesTime = e.date === dateStr;
      }
      
      return matchesCategory && matchesSearch && matchesPrice && matchesTime;
    });

    class CustomMarker extends window.google.maps.OverlayView {
      position: any; div: HTMLElement | null; event: Event;
      longPressTimer: any;
      isLongPress: boolean;
      
      constructor(position: any, event: Event) { 
        super(); 
        this.position = position; 
        this.event = event; 
        this.div = null; 
        this.longPressTimer = null;
        this.isLongPress = false;
      }
      
      onAdd() {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        
        const occupancy = this.event.attendees / this.event.maxCapacity;
        let borderColorClass = 'border-emerald-500'; 
        if (occupancy >= 1) borderColorClass = 'border-red-500';
        else if (occupancy >= 0.8) borderColorClass = 'border-amber-500';
        
        div.innerHTML = `<div class="marker-bubble relative w-12 h-12 rounded-full border-2 ${borderColorClass} shadow-ios bg-white p-[1.5px] cursor-pointer active:scale-90 transition-transform"><img src="${this.event.videoThumbnail}" class="w-full h-full object-cover rounded-full" /></div>`;
        
        const handleStart = (e: any) => {
          this.isLongPress = false;
          this.longPressTimer = setTimeout(() => {
            this.isLongPress = true;
            const bubble = div.querySelector('.marker-bubble');
            if (bubble) {
              bubble.classList.add('scale-105');
              setTimeout(() => bubble.classList.remove('scale-105'), 200);
            }
            
            // Get screen position
            const rect = div.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            setActiveContextMenu({ event: this.event, position: { x, y } });
            
            if (navigator.vibrate) navigator.vibrate(10);
          }, 400);
        };
        
        const handleEnd = () => {
          if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
          }
        };

        div.addEventListener('mousedown', handleStart);
        div.addEventListener('touchstart', handleStart, { passive: true });
        div.addEventListener('mouseup', handleEnd);
        div.addEventListener('mouseleave', handleEnd);
        div.addEventListener('touchend', handleEnd);
        div.addEventListener('touchcancel', handleEnd);

        div.addEventListener('click', (e) => { 
          e.stopPropagation(); 
          if (!this.isLongPress) {
            onEventClick(this.event, e); 
          }
        });
        
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
  }, [events, selectedCategory, searchTerm, onEventClick, selectedTime, priceFilter, isEventSelected]);

  const searchPlaceholder = useMemo(() => {
    const prefix = selectedCategory === 'All' ? 'Search' : `Search ${selectedCategory}`;
    return `${prefix} in ${currentCity}...`;
  }, [selectedCategory, currentCity]);

  return (
    <div className="relative w-full h-full overflow-hidden font-sans bg-transparent">
      <div ref={mapContainerRef} className="w-full h-full z-0 transition-opacity duration-1000" />
      
      {/* CSS to hide Google attribution and simplify UI */}
      <style dangerouslySetInnerHTML={{ __html: `
        .gm-style-cc, .gm-style-mtc, .gm-svpc, .gm-bundled-control { display: none !important; }
        a[href^="https://maps.google.com/maps"] { display: none !important; }
        a[href^="https://www.google.com/intl/en-US_US/help/terms_maps.html"] { display: none !important; }
        .gmnoprint { display: none !important; }
      `}} />
      
      {!isEventSelected && showUnlockDetails && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-fade-in pointer-events-auto" onClick={() => setShowUnlockDetails(false)}>
              <div className={`${isDark ? 'bg-slate-900 border border-white/5' : 'bg-white border border-black/10'} rounded-xl w-full max-w-sm p-10 shadow-2xl animate-scale-in`} onClick={e => e.stopPropagation()}>
                  <div className={`w-16 h-16 ${isDark ? 'bg-accent/10' : 'bg-accent/5'} text-accent rounded-xl flex items-center justify-center mb-6`}>
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

      {!isEventSelected && showAIPopup && (
        <div className="absolute inset-0 z-[110] flex items-center justify-center p-6 bg-black/20 backdrop-blur-[2px] pointer-events-auto" onClick={() => setShowAIPopup(false)}>
          <div 
            className={`${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-black/5'} rounded-xl p-8 shadow-2xl max-w-xs w-full animate-scale-in border`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm font-black tracking-tighter" style={{ color: SPOTIFY_FILTER_CORAL }}>AI SEARCH</div>
              <button onClick={() => setShowAIPopup(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              This feature will be functioning soon and will help you search for:
            </p>
            <ul className={`space-y-2 mb-6 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              <li className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SPOTIFY_FILTER_CORAL }} />
                Events
              </li>
              <li className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SPOTIFY_FILTER_CORAL }} />
                Videos
              </li>
              <li className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SPOTIFY_FILTER_CORAL }} />
                Images
              </li>
            </ul>
            <p className={`text-xs italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              ...with just words, in a more personalized way, and among other things.
            </p>
          </div>
        </div>
      )}

      {/* TOP RIGHT CONTROLS - Positioned below the top filters area */}
      {!isEventSelected && (
        <div className="absolute top-36 right-4 z-20 flex flex-col gap-3 pointer-events-auto">
          <button
            onClick={togglePriceFilter}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg border ${
              priceFilter !== 'all' 
              ? 'bg-primary text-white border-primary' 
              : 'bg-white text-primary border-black/10'
            } active:scale-95`}
            title={`Price filter: ${priceFilter}`}
          >
            <DollarSign size={20} />
            {priceFilter === 'free' && <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[8px] px-1 rounded-full font-bold">FREE</span>}
            {priceFilter === 'paid' && <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] px-1 rounded-full font-bold">PAID</span>}
          </button>
          <button
            onClick={handleRecenterLocation}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg border border-black/10 active:scale-95"
            title="Recenter location"
          >
            <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
          </button>
        </div>
      )}

      {/* FILTROS SUPERIORES */}
      {!isEventSelected && (
        <div className="absolute top-8 left-0 right-0 z-20 px-4 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto flex flex-col gap-1.5">
            
            <div className={`relative shadow-sm rounded-[24px] overflow-hidden backdrop-blur-md border ${isDark ? 'border-white/20' : 'border-black/10'} bg-white`}>
                 <div className="flex items-center px-6 py-2.5">
                    <button 
                      onClick={() => setShowAIPopup(true)}
                      className="mr-3 text-xs font-black tracking-tighter hover:opacity-70 transition-opacity"
                      style={{ color: SPOTIFY_FILTER_CORAL }}
                    >
                      AI
                    </button>
                    {isGeocoding && (
                      <Loader2 className="text-primary w-4 h-4 mr-3 animate-spin" />
                    )}
                    <input 
                       ref={searchInputRef}
                       type="text" 
                       placeholder={searchPlaceholder} 
                       className={`flex-1 bg-transparent focus:outline-none font-bold text-sm text-primary placeholder:text-primary/30`} 
                       value={searchTerm} 
                       onChange={(e) => onSearchChange(e.target.value)}
                    />
                    
                    <div className="flex items-center gap-3 ml-2">
                      <button 
                        onClick={() => setShowUnlockDetails(true)}
                        className={`flex items-center gap-2 px-2 py-1 rounded-xl active:scale-95`}
                      >
                        <div className="relative flex items-center justify-center">
                          <Users size={16} className="text-blue-500" />
                          <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                        </div>
                        <span className={`text-[10px] font-black text-primary`}>{cityStatus.count}/{cityStatus.required}</span>
                      </button>
                      
                      <div className="h-4 w-[1px] bg-gray-200" />
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={handleCameraClick}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors active:scale-90"
                        >
                          <Camera size={18} className="text-gray-900" />
                        </button>
                        <input 
                          ref={cameraInputRef}
                          type="file" 
                          accept="image/*,video/*" 
                          capture="environment" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              onCapture?.(e.target.files[0]);
                            }
                          }}
                        />
                      </div>
                    </div>
                 </div>
                 <div className="w-full h-0.5 bg-primary/5 overflow-hidden">
                    <div className="h-full bg-primary/20 transition-all duration-700" style={{ width: `${progressPercent}%` }} />
                 </div>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth items-center">
                {CATEGORIES.map(cat => {
                    const displayMap: Record<string, { emoji?: string, label: string }> = {
                      'All': { label: 'all' },
                      'Visual Arts': { emoji: '🎨', label: 'visual arts' },
                      'Performance': { emoji: '🎭', label: 'performance' },
                      'Music': { emoji: '🎵', label: 'music' },
                      'Media': { emoji: '🎥', label: 'media' },
                      'Literature': { emoji: '📚', label: 'literature' },
                      'Fashion': { emoji: '👗', label: 'fashion' },
                      'Food': { emoji: '🍽️', label: 'food' },
                      'Heritage': { emoji: '🏛️', label: 'heritage' },
                      'Learning': { emoji: '🎓', label: 'learning' },
                      'Markets': { emoji: '🛍️', label: 'markets' }
                    };
                    const displayData = displayMap[cat] || { label: cat.toLowerCase() };
                    
                    return (
                      <button
                          key={cat}
                          onClick={() => onSelectCategory(cat)}
                          className={`flex-shrink-0 px-5 py-2.5 rounded-full font-bold tracking-widest transition-all border ${isDark ? 'border-white/20' : 'border-black/10'} active:scale-95 ${
                            selectedCategory === cat 
                            ? 'bg-primary text-white shadow-glow-sunset' 
                            : 'bg-white/70 text-primary/80 backdrop-blur-md shadow-sm'
                          }`}
                      >
                          <span className="flex items-center gap-2">
                            {displayData.emoji && (
                              <span className="text-[16px] leading-none -ml-1">
                                {displayData.emoji}
                              </span>
                            )}
                            <span className="text-[10px]">
                              {displayData.label}
                            </span>
                          </span>
                      </button>
                    );
                })}
            </div>
          </div>
        </div>
      )}

      {/* REMOVED OLD PAID FILTER BUTTON POSITION */}

      {!isEventSelected && (
        <div className="absolute bottom-20 left-0 right-0 z-20 px-4 pointer-events-none mb-2">
          <div className="max-w-md mx-auto pointer-events-auto">
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
                {TIME_FILTERS.map(time => (
                    <button
                        key={time}
                        onClick={() => onSelectTime(time)}
                        className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${isDark ? 'border-white/20' : 'border-black/10'} flex items-center gap-2 active:scale-95 ${
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
      )}

      {/* Context Menu */}
      <AnimatePresence>
        {activeContextMenu && (
          <ContextMenu 
            key={`${activeContextMenu.event.id}-${activeContextMenu.position.x}-${activeContextMenu.position.y}`}
            event={activeContextMenu.event}
            position={activeContextMenu.position}
            onClose={() => setActiveContextMenu(null)}
            onAction={(action) => {
              console.log(`Action: ${action} for event: ${activeContextMenu.event.title}`);
              if (action === 'share') {
                if (navigator.share) {
                  navigator.share({
                    title: activeContextMenu.event.title,
                    text: activeContextMenu.event.description,
                    url: window.location.href,
                  });
                }
              } else if (action === 'join') {
                onEventClick(activeContextMenu.event);
              } else if (action === 'similar') {
                onSelectCategory(activeContextMenu.event.category);
              }
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default MapView;