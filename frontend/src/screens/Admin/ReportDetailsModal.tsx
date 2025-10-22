import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { X, Clock, Loader, CheckCircle, XCircle, AlertCircle, Mail, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface ReportDetails {
    report_id: number;
    title: string;
    email: string;
    description: string;
    status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
    reported_at: string;
    user_id: number;
}

type ReportDetailsModalProps = {
    reportId: number;
    isOpen: boolean;
    onClose: () => void;
    onStatusUpdate?: () => void;
    isAdmin?: boolean;
};

const statusConfig = {
    pending: {
        label: 'Oczekujące',
        icon: Clock,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200'
    },
    in_progress: {
        label: 'W trakcie',
        icon: Loader,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200'
    },
    resolved: {
        label: 'Rozwiązane',
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200'
    },
    rejected: {
        label: 'Odrzucone',
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200'
    }
};

export default function ReportDetailsModal({ 
    reportId, 
    isOpen, 
    onClose, 
    onStatusUpdate,
    isAdmin = false 
}: ReportDetailsModalProps) {
    const [report, setReport] = useState<ReportDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    useEffect(() => {
        if (isOpen && reportId) {
            fetchReportDetails();
        }
    }, [isOpen, reportId]);

    const fetchReportDetails = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get<ReportDetails>(`/reports/${reportId}`);
            setReport(response.data);
            setSelectedStatus(response.data.status);
        } catch (err: any) {
            toast.error('Błąd podczas pobierania szczegółów zgłoszenia');
            console.error(err);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        if (!selectedStatus || selectedStatus === report?.status) {
            toast.error('Wybierz inny status');
            return;
        }

        try {
            setUpdatingStatus(true);
            await axiosInstance.patch(`/reports/${reportId}`, {
                status: selectedStatus
            });

            toast.success('Status zgłoszenia został zaktualizowany');
            
            if (onStatusUpdate) {
                onStatusUpdate();
            }
            
            fetchReportDetails();
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            const errorMsg = typeof detail === 'string'
                ? detail
                : Array.isArray(detail)
                    ? detail.map((e: any) => e.msg).join(', ')
                    : 'Błąd przy aktualizacji statusu';
            toast.error(errorMsg);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen || !report) return null;

    const statusInfo = statusConfig[report.status];
    const StatusIcon = statusInfo.icon;

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl relative mx-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition"
                >
                    <X size={24} />
                </button>

                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">{report.title}</h1>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.bg} ${statusInfo.border} border`}>
                            <StatusIcon size={18} className={statusInfo.color} />
                            <span className={`text-sm font-medium ${statusInfo.color}`}>
                                {statusInfo.label}
                            </span>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <Mail size={16} />
                                <span className="text-sm font-medium">Email</span>
                            </div>
                            <p className="text-gray-900 break-all">{report.email}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <User size={16} />
                                <span className="text-sm font-medium">ID Użytkownika</span>
                            </div>
                            <p className="text-gray-900">{report.user_id}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <Calendar size={16} />
                                <span className="text-sm font-medium">Data zgłoszenia</span>
                            </div>
                            <p className="text-gray-900 text-sm">{formatDate(report.reported_at)}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <AlertCircle size={18} />
                            Opis problemu
                        </h3>
                        <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                            {report.description}
                        </p>
                    </div>

                    {/* Status Update (Admin Only) */}
              
                        <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                            <h3 className="text-sm font-semibold text-blue-900 mb-3">
                                Zmień status (Admin)
                            </h3>
                            
                            <div className="flex gap-3">
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    disabled={updatingStatus}
                                >
                                    <option value="pending">Oczekujące</option>
                                    <option value="in_progress">W trakcie</option>
                                    <option value="resolved">Rozwiązane</option>
                                    <option value="rejected">Odrzucone</option>
                                </select>

                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={updatingStatus || selectedStatus === report.status}
                                    className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
                                >
                                    {updatingStatus ? 'Zapisywanie...' : 'Zaktualizuj'}
                                </button>
                            </div>
                        </div>
                  

                    {/* Close Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded font-medium hover:bg-gray-300 transition"
                        >
                            Zamknij
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}