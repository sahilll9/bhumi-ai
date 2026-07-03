import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { MapPin, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for regions and their activity points
const regions = [
  {
    id: 'india',
    name: 'All India Overview',
    center: [22.0, 80.0] as [number, number],
    zoom: 5,
    points: [
      { name: "Nashik Hub", coordinates: [19.9975, 73.7898], priority: "High", metric: "3,400+ Active" },
      { name: "Pune Basin", coordinates: [18.5204, 73.8567], priority: "Low", metric: "1,200+ Active" },
      { name: "Nagpur Belt", coordinates: [21.1458, 79.0882], priority: "Med", metric: "2,100+ Active" },
      { name: "Ludhiana", coordinates: [30.9010, 75.8573], priority: "High", metric: "4,100+ Active" },
      { name: "Lucknow Regional", coordinates: [26.8467, 80.9462], priority: "High", metric: "5,000+ Active" },
      { name: "Ahmedabad", coordinates: [23.0225, 72.5714], priority: "Low", metric: "900+ Active" },
      { name: "Bhopal", coordinates: [23.2599, 77.4126], priority: "High", metric: "3,800+ Active" },
      { name: "Patna", coordinates: [25.5941, 85.1376], priority: "Med", metric: "2,400+ Active" }
    ]
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra Hubs',
    center: [19.75, 75.7139] as [number, number],
    zoom: 7,
    points: [
      { name: "Nashik Hub", coordinates: [19.9975, 73.7898], priority: "High", metric: "3,400+ Active" },
      { name: "Pune Basin", coordinates: [18.5204, 73.8567], priority: "Low", metric: "1,200+ Active" },
      { name: "Nagpur Belt", coordinates: [21.1458, 79.0882], priority: "Med", metric: "2,100+ Active" },
      { name: "Aurangabad", coordinates: [19.8762, 75.3433], priority: "High", metric: "3,100+ Active" },
      { name: "Solapur", coordinates: [17.6599, 75.9064], priority: "Med", metric: "1,800+ Active" },
      { name: "Amravati", coordinates: [20.9320, 77.7523], priority: "Low", metric: "850+ Active" }
    ]
  },
  {
    id: 'punjab',
    name: 'Punjab Belt',
    center: [31.1471, 75.3412] as [number, number],
    zoom: 8,
    points: [
      { name: "Ludhiana", coordinates: [30.9010, 75.8573], priority: "High", metric: "4,100+ Active" },
      { name: "Patiala", coordinates: [30.3398, 76.3924], priority: "Low", metric: "1,100+ Active" },
      { name: "Amritsar", coordinates: [31.6340, 74.8723], priority: "Med", metric: "2,500+ Active" },
      { name: "Jalandhar", coordinates: [31.3260, 75.5762], priority: "High", metric: "3,200+ Active" }
    ]
  },
  {
    id: 'up',
    name: 'Uttar Pradesh',
    center: [26.8467, 80.9462] as [number, number],
    zoom: 7,
    points: [
      { name: "Lucknow Regional", coordinates: [26.8467, 80.9462], priority: "High", metric: "5,000+ Active" },
      { name: "Varanasi Area", coordinates: [25.3176, 82.9739], priority: "Med", metric: "2,800+ Active" },
      { name: "Kanpur", coordinates: [26.4499, 80.3319], priority: "High", metric: "4,500+ Active" },
      { name: "Agra", coordinates: [27.1767, 78.0081], priority: "Low", metric: "1,200+ Active" },
      { name: "Prayagraj", coordinates: [25.4358, 81.8463], priority: "Med", metric: "2,200+ Active" }
    ]
  }
];

// Component to handle map view updates
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 2,
      easeLinearity: 0.25
    });
  }, [center, zoom, map]);
  return null;
}

export default function ActivityMap() {
  const [selectedRegionId, setSelectedRegionId] = useState('india');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const currentRegion = regions.find(r => r.id === selectedRegionId) || regions[0];

  const getMarkerColor = (priority: string) => {
    switch(priority) {
      case 'High': return '#f97316'; // orange-500
      case 'Med': return '#eab308';  // yellow-500
      default: return '#4ade80';     // green-400
    }
  };

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden rounded-[40px] shadow-lg border border-white/20 bg-white/50">
      
      {/* Map Container */}
      <MapContainer 
        center={currentRegion.center} 
        zoom={currentRegion.zoom} 
        style={{ width: '100%', height: '100%', zIndex: 0 }}
        zoomControl={false}
        attributionControl={false}
      >
        {/* Modern, clean map tiles (CartoDB Positron) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapController center={currentRegion.center} zoom={currentRegion.zoom} />

        {/* Render Activity Points */}
        {currentRegion.points.map((point, index) => (
          <CircleMarker
            key={`${selectedRegionId}-${point.name}-${index}`}
            center={point.coordinates as [number, number]}
            radius={point.priority === 'High' ? 12 : point.priority === 'Med' ? 9 : 6}
            pathOptions={{
              fillColor: getMarkerColor(point.priority),
              fillOpacity: 0.6,
              color: getMarkerColor(point.priority),
              weight: 2
            }}
          >
            <Popup className="rounded-xl overflow-hidden shadow-xl border-0">
              <div className="p-1 min-w-[140px]">
                <h4 className="font-bold text-earth-900 mb-1">{point.name}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: getMarkerColor(point.priority) }} />
                  {point.priority} Priority
                </div>
                <div className="bg-earth-50 rounded-lg p-2 text-xs font-semibold text-earth-800">
                  {point.metric}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Floating Selection Menu */}
      <div className="absolute top-6 left-6 z-[1000]">
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50 text-earth-900 font-bold hover:bg-white transition-all group"
          >
            <div className="bg-bhumi-primary/10 p-2 rounded-xl group-hover:bg-bhumi-primary/20 transition-colors">
              <MapPin className="w-5 h-5 text-bhumi-primary" />
            </div>
            {currentRegion.name}
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden"
              >
                <div className="p-2 space-y-1">
                  {regions.map((region) => (
                    <button
                      key={region.id}
                      onClick={() => {
                        setSelectedRegionId(region.id);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-between ${
                        selectedRegionId === region.id 
                          ? 'bg-bhumi-primary text-white shadow-md' 
                          : 'text-earth-700 hover:bg-earth-50'
                      }`}
                    >
                      {region.name}
                      {selectedRegionId === region.id && (
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-6 right-6 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-xl flex flex-col gap-3">
        <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Activity Zones</div>
        <div className="flex items-center gap-3 text-sm font-bold text-earth-900">
          <div className="w-3.5 h-3.5 rounded-full bg-[#f97316] shadow-[0_0_10px_rgba(249,115,22,0.5)] border-2 border-white" /> High Priority
        </div>
        <div className="flex items-center gap-3 text-sm font-bold text-earth-900">
          <div className="w-3 h-3 rounded-full bg-[#eab308] shadow-[0_0_10px_rgba(234,179,8,0.3)] border-2 border-white" /> Medium Activity
        </div>
        <div className="flex items-center gap-3 text-sm font-bold text-earth-900">
          <div className="w-2.5 h-2.5 rounded-full bg-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.3)] border-2 border-white" /> Stable Zone
        </div>
      </div>

      {/* Adding custom css for Leaflet popups */}
      <style>{`
        .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
        }
        .leaflet-popup-content {
          margin: 12px 14px !important;
        }
        .leaflet-popup-tip {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
