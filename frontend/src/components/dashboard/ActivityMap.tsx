import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { motion } from 'framer-motion';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json";

// Mock coordinates for major hubs to show activity
const markers = [
    { markerOffset: -15, name: "Nashik Hub", coordinates: [73.7898, 19.9975], active: true, priority: "High" },
    { markerOffset: -15, name: "Pune Basin", coordinates: [73.8567, 18.5204], active: true, priority: "Low" },
    { markerOffset: 25, name: "Nagpur Belt", coordinates: [79.0882, 21.1458], active: true, priority: "Med" },
    { markerOffset: -15, name: "Aurangabad", coordinates: [75.3433, 19.8762], active: true, priority: "High" },
    { markerOffset: -15, name: "Ludhiana", coordinates: [75.8573, 30.9010], active: true, priority: "High" },
    { markerOffset: 25, name: "Patiala", coordinates: [76.3924, 30.3398], active: true, priority: "Low" },
    { markerOffset: 25, name: "Varanasi Area", coordinates: [82.9739, 25.3176], active: true, priority: "Med" },
    { markerOffset: 15, name: "Lucknow Regional", coordinates: [80.9462, 26.8467], active: true, priority: "High" },
    { markerOffset: -15, name: "Ahmedabad", coordinates: [72.5714, 23.0225], active: true, priority: "Low" },
    { markerOffset: 25, name: "Bhopal", coordinates: [77.4126, 23.2599], active: true, priority: "High" },
    { markerOffset: -15, name: "Patna", coordinates: [85.1376, 25.5941], active: true, priority: "Med" }
];

export default function ActivityMap() {
    return (
        <div className="relative w-full h-[400px] sm:h-[500px] flex items-center justify-center overflow-hidden rounded-[40px]">
            {/* Background styling for the map container */}
            <div className="absolute inset-0 bg-gradient-to-br from-bhumi-primary/5 to-transparent pointer-events-none" />

            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 850,
                    center: [80, 22] // Centered perfectly on India
                }}
                className="w-full h-full animate-in fade-in duration-1000"
            >
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="rgba(74, 222, 128, 0.05)"
                                stroke="rgba(28, 25, 23, 0.15)"
                                strokeWidth={0.75}
                                style={{
                                    default: { outline: 'none' },
                                    hover: { fill: 'rgba(74, 222, 128, 0.2)', outline: 'none', transition: 'all 0.3s' },
                                    pressed: { outline: 'none' },
                                }}
                            />
                        ))
                    }
                </Geographies>

                {markers.map(({ name, coordinates, markerOffset, priority }) => (
                    // @ts-ignore
                    <Marker key={name} coordinates={coordinates as [number, number]}>
                        <circle r={priority === 'High' ? 6 : 4} fill={priority === 'High' ? "#f97316" : priority === 'Med' ? "#eab308" : "#4ade80"} className="opacity-90 drop-shadow-md" />
                        <motion.circle
                            r={priority === 'High' ? 18 : priority === 'Med' ? 12 : 8}
                            fill={priority === 'High' ? "#f97316" : priority === 'Med' ? "#eab308" : "#4ade80"}
                            className="opacity-40 mix-blend-multiply"
                            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.1, 0.4] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
                        />
                        <text
                            textAnchor="middle"
                            y={markerOffset}
                            style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fill: "#1c1917", fontWeight: 800, textShadow: "0px 0px 4px rgba(255,255,255,0.9)" }}
                        >
                            {name}
                        </text>
                    </Marker>
                ))}
            </ComposableMap>

            {/* Map Legend */}
            <div className="absolute bottom-6 right-6 glass-card p-4 rounded-2xl border border-white/40 shadow-lg flex flex-col gap-3 pointer-events-none bg-white/80 backdrop-blur-xl">
                <div className="flex items-center gap-3 text-sm font-bold text-earth-900">
                    <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.5)]" /> High Priority Alert
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-earth-900">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]" /> Medium Activity
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-earth-900">
                    <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.3)]" /> Stable Zone
                </div>
            </div>
        </div>
    );
}
