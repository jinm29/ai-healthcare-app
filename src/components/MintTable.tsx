import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { CalendarEvent } from '../types';
import { Calendar, Clock, Layers, Hash, ChevronUp, ChevronDown, Filter, Eye, EyeOff, Cpu } from 'lucide-react';
import { ClaimButton } from './ClaimButton';

interface MintTableProps {
  events: CalendarEvent[];
  onRefresh?: () => void;
}

type SortField = 'type' | 'chain' | 'title' | 'date' | 'timeUntil';
type SortDirection = 'asc' | 'desc';

export const MintTable: React.FC<MintTableProps> = ({ events, onRefresh }) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [hideMatured, setHideMatured] = useState<boolean>(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'xenft':
        return <Layers className="w-4 h-4" />;
      case 'single':
        return <Hash className="w-4 h-4" />;
      case 'cointool':
        return <Calendar className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'xenft':
        return 'XenFT';
      case 'single':
        return 'Single Mint';
      case 'cointool':
        return 'Cointool Batch';
      default:
        return type;
    }
  };

  const formatDate = (date: Date): string => {
    try {
      // Check if date is valid
      if (!date || isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const getTimeUntil = (date: Date): { text: string, className: string, isMatured: boolean } => {
    try {
      if (!date || isNaN(date.getTime())) {
        return { text: 'Invalid Date', className: 'text-gray-500', isMatured: false };
      }
      
      const now = new Date();
      const timeUntil = date.getTime() - now.getTime();
      const daysUntil = Math.floor(timeUntil / (1000 * 60 * 60 * 24));
      const isPast = timeUntil < 0;

      if (isPast) {
        return { text: 'Matured', className: 'text-red-600', isMatured: true };
      } else if (daysUntil === 0) {
        return { text: 'Today', className: 'text-yellow-600', isMatured: false };
      } else {
        return { text: `${daysUntil} days`, className: 'text-green-600', isMatured: false };
      }
    } catch (error) {
      console.error('Error calculating time until:', error);
      return { text: 'Unknown', className: 'text-gray-500', isMatured: false };
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events;

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === typeFilter);
    }

    // Apply matured filter
    if (hideMatured) {
      filtered = filtered.filter(event => {
        const timeInfo = getTimeUntil(event.start);
        return !timeInfo.isMatured;
      });
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'type':
          aValue = getTypeLabel(a.type);
          bValue = getTypeLabel(b.type);
          break;
        case 'chain':
          aValue = a.chain;
          bValue = b.chain;
          break;
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'date':
          aValue = a.start.getTime();
          bValue = b.start.getTime();
          break;
        case 'timeUntil':
          aValue = a.start.getTime() - new Date().getTime();
          bValue = b.start.getTime() - new Date().getTime();
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      } else {
        const comparison = aValue - bValue;
        return sortDirection === 'asc' ? comparison : -comparison;
      }
    });

    return sorted;
  }, [events, sortField, sortDirection, typeFilter, hideMatured]);

  const uniqueTypes = useMemo(() => {
    const types = Array.from(new Set(events.map(event => event.type)));
    return types.map(type => ({ value: type, label: getTypeLabel(type) }));
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No mints found. Connect your wallet to see your XEN mints.
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1 bg-gray-800 border border-gray-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all" className="bg-gray-800 text-white">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type.value} value={type.value} className="bg-gray-800 text-white">{type.label}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={() => setHideMatured(!hideMatured)}
          className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors ${
            hideMatured 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700'
          }`}
        >
          {hideMatured ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {hideMatured ? 'Show Matured' : 'Hide Matured'}
        </button>

        <div className="text-sm text-gray-500">
          Showing {filteredAndSortedEvents.length} of {events.length} mints
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800 data-table">
          <thead>
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-green-400 transition-colors"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center gap-1">
                  Type
                  {getSortIcon('type')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-green-400 transition-colors"
                onClick={() => handleSort('chain')}
              >
                <div className="flex items-center gap-1">
                  Chain
                  {getSortIcon('chain')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-green-400 transition-colors"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center gap-1">
                  Title
                  {getSortIcon('title')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-green-400 transition-colors"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-1">
                  Maturity Date
                  {getSortIcon('date')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-green-400 transition-colors"
                onClick={() => handleSort('timeUntil')}
              >
                <div className="flex items-center gap-1">
                  Time Until
                  {getSortIcon('timeUntil')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Claim
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredAndSortedEvents.map((event, index) => {
              const timeInfo = getTimeUntil(event.start);
              const isPast = timeInfo.isMatured;

              return (
                <tr key={index} className={`${isPast ? 'opacity-60' : ''} hover:bg-white/5 transition-colors`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-green-500/10">
                        {getTypeIcon(event.type)}
                      </div>
                      <span className="text-sm font-medium text-gray-300">
                        {getTypeLabel(event.type)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {event.chain}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {event.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {formatDate(event.start)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`${timeInfo.className} font-medium`}>{timeInfo.text}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <ClaimButton 
                      chainId={event.chainId || 1}
                      type={event.type}
                      isMatured={timeInfo.isMatured}
                      onSuccess={onRefresh}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredAndSortedEvents.length === 0 && events.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          No mints match the current filters.
        </div>
      )}
    </div>
  );
}; 