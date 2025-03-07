'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Calendar, Plus, Search, Filter, ChevronDown, Clock, Video, MapPin, Check, X } from 'lucide-react';
import Link from 'next/link';
import { meetingAPI, Meeting } from '@/services/api';

export default function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await meetingAPI.getAll();
        setMeetings(data);
      } catch (err: any) {
        console.error('Error fetching meetings:', err);
        setError(err.message || 'Failed to fetch meetings');
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = 
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${meeting.mentor.user.first_name} ${meeting.mentor.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${meeting.mentee.user.first_name} ${meeting.mentee.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'pending') return matchesSearch && meeting.status === 'pending';
    if (filterBy === 'accepted') return matchesSearch && meeting.status === 'accepted';
    if (filterBy === 'completed') return matchesSearch && meeting.status === 'completed';
    if (filterBy === 'rejected') return matchesSearch && meeting.status === 'rejected';
    if (filterBy === 'upcoming') {
      const now = new Date();
      const meetingDate = new Date(meeting.scheduled_at);
      return matchesSearch && meetingDate > now && (meeting.status === 'accepted' || meeting.status === 'pending');
    }
    
    return matchesSearch;
  });

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Meeting['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
        return <Check className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      case 'completed':
        return <Check className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleStatusChange = async (meetingId: number, newStatus: Meeting['status']) => {
    try {
      await meetingAPI.updateStatus(meetingId, newStatus);
      // Update the local state
      setMeetings(meetings.map(meeting => 
        meeting.id === meetingId ? { ...meeting, status: newStatus } : meeting
      ));
    } catch (err: any) {
      console.error('Error updating meeting status:', err);
      alert('Failed to update meeting status. Please try again.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <Calendar className="mr-2 h-6 w-6 text-blue-500" />
            Meetings
          </h1>
          <Link 
            href="/dashboard/meetings/new" 
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule Meeting</span>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <option value="all">All Meetings</option>
              <option value="upcoming">Upcoming Meetings</option>
              <option value="pending">Pending Approval</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Meetings List */}
        <div className="space-y-4">
          {filteredMeetings.map((meeting) => (
            <div 
              key={meeting.id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold">{meeting.title}</h3>
                      <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center ${getStatusColor(meeting.status)}`}>
                        {getStatusIcon(meeting.status)}
                        <span className="ml-1">{meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}</span>
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{meeting.description}</p>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(meeting.scheduled_at).toLocaleDateString()} at {new Date(meeting.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Clock className="mr-1.5 h-4 w-4 flex-shrink-0" />
                      <span>{meeting.duration} minutes</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          {meeting.mentor.user.first_name[0]}{meeting.mentor.user.last_name[0]}
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {meeting.mentor.user.first_name} {meeting.mentor.user.last_name}
                        </p>
                        <p className="text-xs text-gray-500">Mentor</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                          {meeting.mentee.user.first_name[0]}{meeting.mentee.user.last_name[0]}
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {meeting.mentee.user.first_name} {meeting.mentee.user.last_name}
                        </p>
                        <p className="text-xs text-gray-500">Mentee</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    {meeting.meeting_mode === 'online' ? (
                      <Video className="mr-1.5 h-4 w-4 text-blue-500" />
                    ) : (
                      <MapPin className="mr-1.5 h-4 w-4 text-red-500" />
                    )}
                    <span>{meeting.meeting_mode === 'online' ? 'Online Meeting' : 'In-person Meeting'}</span>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    {meeting.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(meeting.id, 'accepted')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Accept
                        </button>
                        <button 
                          onClick={() => handleStatusChange(meeting.id, 'rejected')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <X className="mr-1 h-4 w-4" />
                          Reject
                        </button>
                      </>
                    )}
                    {meeting.status === 'accepted' && new Date(meeting.scheduled_at) < new Date() && (
                      <button 
                        onClick={() => handleStatusChange(meeting.id, 'completed')}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Mark as Completed
                      </button>
                    )}
                    <Link 
                      href={`/dashboard/meetings/${meeting.id}`}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMeetings.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No meetings found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? `No meetings match your search for "${searchTerm}"`
                : "There are no meetings to display"}
            </p>
            <Link 
              href="/dashboard/meetings/new" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 