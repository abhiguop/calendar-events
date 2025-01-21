import { useState } from 'react';
import { X } from 'lucide-react';

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: any) => Promise<void>;
}

export default function CreateEventDialog({ isOpen, onClose, onSubmit }: CreateEventDialogProps) {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    start: '',
    startTime: '',
    end: '',
    endTime: '',
    location: '',
    attendees: ''
  });

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const formattedEvent = {
      ...eventData,
      start: `${eventData.start}T${eventData.startTime}`,
      end: `${eventData.end}T${eventData.endTime}`,
      attendees: eventData.attendees.split(',').map(email => email.trim())
    };
    await onSubmit(formattedEvent);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Event</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              value={eventData.title}
              onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={eventData.description}
              onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                required
                value={eventData.start}
                onChange={(e) => setEventData({ ...eventData, start: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                required
                value={eventData.startTime}
                onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                required
                value={eventData.end}
                onChange={(e) => setEventData({ ...eventData, end: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                required
                value={eventData.endTime}
                onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={eventData.location}
              onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Office or Virtual Meeting URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Attendees (comma-separated emails)
            </label>
            <input
              type="text"
              value={eventData.attendees}
              onChange={(e) => setEventData({ ...eventData, attendees: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="john@example.com, jane@example.com"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}