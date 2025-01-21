import { useState } from 'react';
import { Calendar, Loader, Search, Plus, Edit2, Trash2, Filter } from 'lucide-react';
import CreateEventDialog from '../components/CreateEventDialog';

export default function CalendarView() {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Team Meeting',
      description: 'Weekly team sync',
      start: '2025-01-18T10:00:00',
      end: '2025-01-18T11:00:00',
      location: 'Virtual (Google Meet)',
      attendees: ['john@example.com', 'jane@example.com'],
    },
    {
      id: 2,
      title: 'Project Kickoff',
      description: 'New project kickoff meeting',
      start: '2025-01-19T14:00:00',
      end: '2025-01-19T15:00:00',
      location: 'Office Room 301',
      attendees: ['alice@example.com', 'bob@example.com'],
    },
  ]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const locations = [...new Set(events.map(event => event.location))];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Mock fetching events
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = filterType === 'all' || event.location === filterType;
    const eventDate = new Date(event.start);
    const matchesDateRange = (!startDate || eventDate >= new Date(startDate)) &&
                           (!endDate || eventDate <= new Date(endDate));
    
    return matchesSearch && matchesLocation && matchesDateRange;
  });

  const formatDate = (dateStr: string, formatStr: string = 'dd MMM yyyy, hh:mm a') => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCreateEvent = async (eventData: any) => {
    const newEvent = {
      id: events.length + 1,
      ...eventData,
    };
    setEvents([...events, newEvent]);
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter((event) => event.id !== eventId));
    }
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
    setFilterType('all');
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Calendar Events</h2>
            <p className="text-sm text-gray-500">View and manage your upcoming events</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </button>
            <button
              onClick={fetchEvents}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Sync Events</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Start date"
            />
          </div>

          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="End date"
            />
          </div>

          <div className="flex space-x-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendees
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEvents.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No events found
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {event.title}
                    </div>
                    {event.description && (
                      <div className="text-sm text-gray-500">
                        {event.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(event.start)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.location}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {event.attendees.join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-600 hover:text-red-900 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CreateEventDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateEvent}
      />
    </div>
  );
}