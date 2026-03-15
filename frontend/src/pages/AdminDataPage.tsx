import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { farmersAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function AdminDataPage() {
    const [activeTab, setActiveTab] = useState<'farmers' | 'verifications'>('farmers');
    const [farmers, setFarmers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await farmersAPI.getAll({ limit: 100 }); // Fetch first 100
            setFarmers(response.data);
            toast.success('Data refreshed');
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'verified':
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" /> Verified</span>;
            case 'rejected':
                return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" /> Rejected</span>;
            case 'pending':
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Pending</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold w-fit">Unverified</span>;
        }
    };

    return (
        <div className="min-h-screen py-10 px-4 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-earth-900 flex items-center gap-3">
                        <Database className="w-8 h-8 text-bhumi-primary" /> Admin Data Viewer
                    </h1>
                    <p className="text-earth-800/60 font-medium ml-11">Direct access to platform records</p>
                </div>
                <button
                    onClick={fetchData}
                    className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-earth-900 shadow-sm transition-all active:scale-95"
                    title="Refresh Data"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="glass-card rounded-[30px] overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-white/20 bg-white/30">
                    <button
                        onClick={() => setActiveTab('farmers')}
                        className={`px-8 py-4 font-bold text-sm transition-colors ${activeTab === 'farmers' ? 'bg-bhumi-primary text-white' : 'text-earth-800/60 hover:bg-white/50'}`}
                    >
                        Farmers & Land
                    </button>
                    {/* Placeholder for future tabs if needed */}
                </div>

                {/* Table Content */}
                <div className="p-0 overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center text-earth-800/40 font-medium">Loading records...</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-earth-900/5 text-earth-900/60 text-xs uppercase tracking-wider font-bold">
                                <tr>
                                    <th className="p-6">ID</th>
                                    <th className="p-6">Name</th>
                                    <th className="p-6">Khasra No.</th>
                                    <th className="p-6">Coordinates</th>
                                    <th className="p-6">Status</th>
                                    <th className="p-6">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {farmers.map((farmer, idx) => (
                                    <motion.tr
                                        key={farmer.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-white/40 transition-colors"
                                    >
                                        <td className="p-6 font-mono text-xs text-earth-800/60">#{farmer.id}</td>
                                        <td className="p-6 font-bold text-earth-900">{farmer.name}</td>
                                        <td className="p-6 font-mono text-sm">
                                            {farmer.khasra_number || <span className="opacity-30">-</span>}
                                        </td>
                                        <td className="p-6 text-xs font-mono text-earth-800/60">
                                            {farmer.latitude ? `${farmer.latitude}, ${farmer.longitude}` : <span className="opacity-30">Not set</span>}
                                        </td>
                                        <td className="p-6">
                                            <StatusBadge status={farmer.verification_status || 'unverified'} />
                                        </td>
                                        <td className="p-6 text-xs font-bold text-bhumi-primary cursor-pointer hover:underline">
                                            View Details
                                        </td>
                                    </motion.tr>
                                ))}
                                {farmers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-earth-800/40">No records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
