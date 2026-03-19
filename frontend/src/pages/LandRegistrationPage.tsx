import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Camera, Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { farmersAPI } from '../utils/api';

export default function LandRegistrationPage() {
    const { id } = useParams<{ id: string }>(); // Farmer ID should be passed or context
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form State
    const [khasraNumber, setKhasraNumber] = useState('');
    const [location, setLocation] = useState({ lat: '', lng: '' });
    const [image, setImage] = useState<string | null>(null);
    const [verificationResult, setVerificationResult] = useState<any>(null);

    // Video/Camera Ref
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    // Proactive Location Request
    React.useEffect(() => {
        handleGetLocation();
    }, []);

    // Get Location
    const handleGetLocation = () => {
        if (navigator.geolocation) {
            toast.loading('Fetching location...', { id: 'geo' });
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude.toFixed(6),
                        lng: position.coords.longitude.toFixed(6)
                    });
                    toast.success('Location fetched!', { id: 'geo' });
                },
                (error) => {
                    toast.error('Unable to retrieve location.', { id: 'geo' });
                    console.error(error);
                }
            );
        } else {
            toast.error('Geolocation not supported');
        }
    };

    // Camera Handlers
    const startCamera = async () => {
        try {
            setIsCameraOpen(true);
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            toast.error('Could not access camera');
        }
    };

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setImage(dataUrl);

            // Stop camera
            const stream = videoRef.current.srcObject as MediaStream;
            stream?.getTracks().forEach(track => track.stop());
            setIsCameraOpen(false);
            toast.success('Photo captured!');
        }
    };

    // File Upload Handler
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                toast.success('Image uploaded!');
            };
            reader.readAsDataURL(file);
        }
    };

    // Submit Handler
    const handleSubmit = async () => {
        if (!khasraNumber || !location.lat || !image) {
            toast.error('Please fill all fields and provide an image.');
            return;
        }

        setLoading(true);
        try {
            // Use real AI verification via chatbotAPI which connects to Python service
            const formData = new FormData();

            // Convert base64 to Blob if needed, but our API takes base64 or FormData
            // In LandRegistrationPage, 'image' is already a data URL (base64)
            // Let's check how chatbotAPI.verifyDocument is implemented

            const response = await farmersAPI.verifyLand(id || '1', {
                khasra_number: khasraNumber,
                latitude: location.lat,
                longitude: location.lng,
                image_url: image, // Now sending the actual base64 image
            });

            setVerificationResult(response.data);
            toast.success('Land details submitted for AI verification!');

        } catch (error: any) {
            console.error('Submission error:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Submission failed.';
            toast.error(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    if (verificationResult) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card max-w-lg w-full p-8 rounded-3xl text-center"
                >
                    <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl ${verificationResult.is_verified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        {verificationResult.is_verified ? <CheckCircle className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
                    </div>

                    <h2 className="text-3xl font-black text-earth-900 mb-2">
                        {verificationResult.is_verified ? 'Verification Successful!' : 'Verification Pending'}
                    </h2>

                    <p className="text-earth-800/60 mb-8">
                        {verificationResult.is_verified
                            ? 'Your land has been successfully verified by Bhumi AI.'
                            : 'Your document is under manual review. Please check back later.'}
                    </p>

                    <div className="bg-white/40 p-4 rounded-xl mb-8 border border-white/40">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold opacity-50">AI CONFIDENCE</span>
                            <span className="text-lg font-black text-bhumi-primary">{Math.round(verificationResult.verification.ai_confidence * 100)}%</span>
                        </div>
                        <div className="h-3 w-full bg-white/50 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${verificationResult.verification.ai_confidence * 100}%` }}
                                className={`h-full ${verificationResult.is_verified ? 'bg-green-500' : 'bg-yellow-500'}`}
                            />
                        </div>
                    </div>

                    <button onClick={() => navigate('/dashboard')} className="btn-primary w-full">
                        Return to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-earth-900 mb-4 tracking-tight">
                    Register Your <span className="text-bhumi-primary">Land Details</span>
                </h1>
                <p className="text-lg text-earth-800/60 font-medium max-w-2xl mx-auto">
                    Add your property information to get personalized scheme recommendations and authenticate land ownership.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Card: Land Information */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="glass-card p-8 rounded-[40px]"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-bhumi-primary/10 rounded-xl">
                            <MapPin className="w-6 h-6 text-bhumi-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-earth-900">Land Information</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-earth-900/60 mb-2">
                                Khasra Number (खसरा नंबर)
                            </label>
                            <input
                                type="text"
                                value={khasraNumber}
                                onChange={(e) => setKhasraNumber(e.target.value)}
                                placeholder="Enter Khasra Number e.g., 123/45"
                                className="w-full p-4 bg-white/50 border border-white/40 rounded-2xl focus:ring-2 focus:ring-bhumi-primary/20 outline-none transition-all placeholder:text-earth-800/20 font-bold text-earth-900"
                            />
                            <p className="text-xs text-earth-800/40 mt-2 font-medium">Find this on your land revenue records</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-earth-900/60 mb-2">
                                Location Coordinates
                            </label>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <input
                                    readOnly
                                    value={location.lat}
                                    placeholder="Latitude"
                                    className="p-3 bg-white/30 border border-white/20 rounded-xl text-center font-mono text-sm"
                                />
                                <input
                                    readOnly
                                    value={location.lng}
                                    placeholder="Longitude"
                                    className="p-3 bg-white/30 border border-white/20 rounded-xl text-center font-mono text-sm"
                                />
                            </div>
                            <button
                                onClick={handleGetLocation}
                                className="w-full py-3 bg-white border border-gray-200 rounded-xl font-bold text-earth-900 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                <MapPin className="w-4 h-4" /> Get Current Location
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Right Card: Property Images */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-8 rounded-[40px]"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-green-500/10 rounded-xl">
                            <Camera className="w-6 h-6 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-earth-900">Property Images</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Live Capture Area */}
                        {isCameraOpen ? (
                            <div className="aspect-video bg-black rounded-2xl overflow-hidden relative">
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                <button
                                    onClick={capturePhoto}
                                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-white rounded-full font-bold shadow-lg"
                                >
                                    Capture
                                </button>
                            </div>
                        ) : image ? (
                            <div className="aspect-video bg-black/5 rounded-2xl overflow-hidden relative group">
                                <img src={image} alt="Property" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setImage(null)} className="text-white font-bold">Remove</button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={startCamera}
                                className="w-full py-10 bg-white/50 border-2 border-dashed border-bhumi-primary/30 rounded-3xl flex flex-col items-center justify-center gap-3 text-bhumi-primary hover:bg-bhumi-primary/5 transition-all group"
                            >
                                <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                    <Camera className="w-8 h-8" />
                                </div>
                                <span className="font-bold">Live Capture</span>
                            </button>
                        )}

                        {!isCameraOpen && (
                            <>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white/80 text-gray-500">Or</span>
                                    </div>
                                </div>

                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <button className="w-full py-3 bg-white border border-gray-200 rounded-xl font-bold text-earth-900 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                        <Upload className="w-4 h-4" /> Upload Property Images
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-12 text-center"
            >
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-premium px-12 py-4 bg-bhumi-primary text-white text-lg shadow-bhumi-primary/30 hover:shadow-bhumi-primary/50"
                >
                    {loading ? 'Submitting...' : 'Submit Land Details'}
                </button>
            </motion.div>
        </div>
    );
}

// Add delayProp to motion.div definition if needed or just ignore TS error for now as it's just a prop
