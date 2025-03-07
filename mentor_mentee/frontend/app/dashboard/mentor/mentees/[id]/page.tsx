'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { userAPI, type Mentee } from '@/services/api';
import { User, Mail, Phone, Book, Target, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MenteeDetails() {
  const params = useParams();
  const menteeId = Number(params.id);

  const [mentee, setMentee] = useState<Mentee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenteeDetails = async () => {
      try {
        const data = await userAPI.getMenteeDetails(menteeId);
        setMentee(data);
      } catch (err: any) {
        console.error('Error fetching mentee details:', err);
        setError(err.message || 'Failed to fetch mentee details');
      } finally {
        setLoading(false);
      }
    };

    if (menteeId) {
      fetchMenteeDetails();
    }
  }, [menteeId]);

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

  if (!mentee) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/mentor"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold">Mentee Details</h1>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Schedule Meeting
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Send Message
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-blue-500 text-white p-6">
            <div className="flex items-center gap-6">
              {mentee.user.profile_picture ? (
                <img 
                  src={mentee.user.profile_picture} 
                  alt={`${mentee.user.first_name} ${mentee.user.last_name}`}
                  className="h-24 w-24 rounded-full border-4 border-white"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-blue-700 flex items-center justify-center text-white text-3xl border-4 border-white">
                  {mentee.user.first_name[0]}{mentee.user.last_name[0]}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold">
                  {mentee.user.first_name} {mentee.user.last_name}
                </h2>
                <p className="text-blue-100">{mentee.program}</p>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{mentee.user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{mentee.user.phone_number}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Program Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Program Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Program</p>
                    <p className="font-medium">{mentee.program}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">
                      {new Date(mentee.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-medium">
                      {new Date(mentee.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 py-1 rounded text-sm ${
                      mentee.status === 'active' ? 'bg-green-100 text-green-700' :
                      mentee.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {mentee.status.charAt(0).toUpperCase() + mentee.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm text-blue-600">{mentee.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 rounded-full h-2" 
                        style={{ width: `${mentee.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Completed Tasks</p>
                      <p className="text-2xl font-semibold">12/15</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Attendance Rate</p>
                      <p className="text-2xl font-semibold">95%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Weekly Progress Meeting</p>
                      <p className="text-sm text-gray-500">March 15, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Book className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Completed Frontend Module</p>
                      <p className="text-sm text-gray-500">March 10, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Set New Learning Goals</p>
                      <p className="text-sm text-gray-500">March 5, 2024</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Mentor Notes</h3>
                <div className="space-y-3">
                  <textarea
                    className="w-full h-32 p-2 border rounded-lg resize-none"
                    placeholder="Add notes about the mentee's progress..."
                  />
                  <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 