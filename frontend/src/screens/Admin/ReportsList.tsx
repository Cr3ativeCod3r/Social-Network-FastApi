import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { AlertCircle, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import Pagination from '../../modules/Notes/components/Pagination';
import ReportDetailsModal from './ReportDetailsModal';

interface Report {
    report_id: number;
    title: string;
    status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
    reported_at: string;
    user_id: number;
}

interface ReportsResponse {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    items: Report[];
}

type ReportsListProps = {
    refreshTrigger?: number;
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

export default function ReportsList({ refreshTrigger}: ReportsListProps) {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const pageSize = 20;

    useEffect(() => {
        fetchReports();
    }, [page, statusFilter, refreshTrigger]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const params: any = {
                page,
                page_size: pageSize
            };
            
            if (statusFilter) {
                params.status_filter = statusFilter;
            }

            const response = await axiosInstance.get<ReportsResponse>('/reports/', { params });
            
            setReports(response.data.items || []);
            setTotalPages(response.data.total_pages || 1);
        } catch (err: any) {
            toast.error('Błąd podczas pobierania zgłoszeń');
            console.error(err);
        } finally {
            setLoading(false);
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

    const handleReportClick = (reportId: number) => {
        setSelectedReportId(reportId);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedReportId(null);
    };

    const handleStatusUpdate = () => {
        fetchReports();
    };

    return (
        <div className="space-y-4 max-w-4xl mx-auto">
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filtruj według statusu
                </label>
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                    className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    <option value="">Wszystkie</option>
                    <option value="pending">Oczekujące</option>
                    <option value="in_progress">W trakcie</option>
                    <option value="resolved">Rozwiązane</option>
                    <option value="rejected">Odrzucone</option>
                </select>
            </div>

            {loading && (
                <div className="flex justify-center items-center py-12">
                    <Loader className="animate-spin text-blue-600" size={40} />
                </div>
            )}

            {!loading && reports.length === 0 && (
                <div className="bg-white p-12 rounded-lg shadow text-center">
                    <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600 text-lg">Brak zgłoszeń</p>
                </div>
            )}

            {!loading && reports.length > 0 && (
                <div className="space-y-3">
                    {reports.map((report) => {
                        const statusInfo = statusConfig[report.status];
                        const StatusIcon = statusInfo.icon;

                        return (
                            <div
                                key={report.report_id}
                                onClick={() => handleReportClick(report.report_id)}
                                className={`bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow border ${statusInfo.border} cursor-pointer animate-fade-in`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {report.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Zgłoszono: {formatDate(report.reported_at)}
                                        </p>
                                    </div>

                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusInfo.bg}`}>
                                        <StatusIcon size={16} className={statusInfo.color} />
                                        <span className={`text-sm font-medium ${statusInfo.color}`}>
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && reports.length > 0 && totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}
            {selectedReportId && (
                <ReportDetailsModal
                    reportId={selectedReportId}
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onStatusUpdate={handleStatusUpdate}
                />
            )}
        </div>
    );
}