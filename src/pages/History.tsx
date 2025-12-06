import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistoryStore } from '../store/historyStore';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import type { SortOption } from '../types/research.types';
import { Search, Calendar, Eye, Trash2, AlertCircle, Clock, FileText } from 'lucide-react';

export function History() {
  const navigate = useNavigate();
  const {
    isLoading,
    searchQuery,
    sortBy,
    fetchHistory,
    deleteItem,
    setSearchQuery,
    setSortBy,
    getFilteredAndSortedItems,
  } = useHistoryStore();

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredItems = getFilteredAndSortedItems();

  const handleDelete = async (id: string) => {
    await deleteItem(id);
    setDeleteConfirmId(null);
  };

  const handleViewFull = (id: string) => {
    navigate(`/result/${id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Research History
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-11">
            View and manage your previous research gap analyses
          </p>
        </div>
        <LoadingState count={5} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Research History
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 ml-11">
          View and manage your previous research gap analyses
        </p>
      </div>

      {/* Search and Sort Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by topic or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              data-testid="history-search"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none pl-4 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
              data-testid="history-sort"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="topic">By Topic</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Results Count */}
        {filteredItems.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FileText className="w-4 h-4" />
            <span>
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'}
              {searchQuery && ' for your search'}
            </span>
          </div>
        )}
      </div>

      {/* History Items List */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title="No history items found"
          description={
            searchQuery
              ? 'Try adjusting your search query'
              : 'Start by generating your first research gap analysis'
          }
          actionLabel={searchQuery ? undefined : 'Generate Research Gaps'}
          onAction={searchQuery ? undefined : () => navigate('/')}
        />
      ) : (
        <div className="space-y-4" data-testid="history-list">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
              data-testid="history-item"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Topic with Icon */}
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.topic}
                    </h3>
                  </div>
                  
                  {/* Date with Icon */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(item.date)}</span>
                  </div>
                  
                  {/* Preview */}
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
                    {item.preview}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex lg:flex-col gap-3">
                  <button
                    onClick={() => handleViewFull(item.id)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 text-sm font-medium shadow-sm hover:shadow-md whitespace-nowrap"
                    data-testid="view-full-button"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Full</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:scale-105 text-sm font-medium shadow-sm hover:shadow-md whitespace-nowrap"
                    data-testid="delete-button"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Delete Confirmation Dialog */}
              {deleteConfirmId === item.id && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                  data-testid="delete-confirmation-dialog"
                  onClick={() => setDeleteConfirmId(null)}
                >
                  <div
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Warning Icon */}
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                      <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
                      Confirm Deletion
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
                      Are you sure you want to delete this history item? This action cannot be undone.
                    </p>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                        data-testid="cancel-delete-button"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm hover:shadow-md"
                        data-testid="confirm-delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
