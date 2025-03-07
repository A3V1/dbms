'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { userAPI, type Mentee } from '@/services/api';
import { User, Mail, Phone, Book, Target, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function MentorDashboard() {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const data = await userAPI.getMentees();
        setMentees(data);
      } catch (err: any) {
        console.error('Error fetching mentees:', err);
        setError(err.message || 'Failed to fetch mentees');
      } finally {
        setLoading(false);
      }
    };

    fetchMentees();
  }, []);

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
          <h1 className="text-2xl font-bold">My Mentees</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Schedule Meeting
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Send Message
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentees.map((mentee) => (
            <div key={mentee.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {mentee.user.profile_picture ? (
                    <img 
                      src={mentee.user.profile_picture} 
                      alt={`${mentee.user.first_name} ${mentee.user.last_name}`}
                      className="h-16 w-16 rounded-full"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl">
                      {mentee.user.first_name[0]}{mentee.user.last_name[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">
                      {mentee.user.first_name} {mentee.user.last_name}
                    </h3>
                    <p className="text-gray-500">{mentee.program}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{mentee.user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{mentee.user.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Started: {new Date(mentee.start_date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-blue-600">{mentee.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 rounded-full h-2" 
                      style={{ width: `${mentee.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between">
                    <Link
                      href={`/dashboard/mentor/mentees/${mentee.id}`}
                      className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                      View Details
                    </Link>
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
            </div>
          ))}
        </div>

        {mentees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No mentees assigned yet.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 