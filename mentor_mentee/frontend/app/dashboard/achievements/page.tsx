'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Award, Plus, Search, Filter, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { achievementAPI, Achievement } from '@/services/api';

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await achievementAPI.getAll();
        setAchievements(data);
      } catch (err: any) {
        console.error('Error fetching achievements:', err);
        setError(err.message || 'Failed to fetch achievements');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = 
      achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${achievement.mentor.user.first_name} ${achievement.mentor.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (achievement.mentee && `${achievement.mentee.user.first_name} ${achievement.mentee.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'recent') return matchesSearch && new Date(achievement.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    return matchesSearch;
  });

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
            <Award className="mr-2 h-6 w-6 text-yellow-500" />
            Achievements
          </h1>
          <Link 
            href="/dashboard/achievements/new" 
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            <span>New Achievement</span>
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
              placeholder="Search achievements..."
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
              <option value="all">All Achievements</option>
              <option value="recent">Recent (Last 7 days)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <div 
              key={achievement.id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="bg-yellow-100 p-4 flex justify-between items-center">
                <h3 className="font-semibold text-lg">{achievement.name}</h3>
                {achievement.badge_icon && (
                  <div className="h-10 w-10 bg-yellow-500 rounded-full flex items-center justify-center text-white">
                    <Award className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-gray-600 mb-4">{achievement.description}</p>
                <div className="text-sm text-gray-500 mb-2">
                  <span className="font-semibold">Mentor:</span> {achievement.mentor.user.first_name} {achievement.mentor.user.last_name}
                </div>
                {achievement.mentee && (
                  <div className="text-sm text-gray-500 mb-2">
                    <span className="font-semibold">Mentee:</span> {achievement.mentee.user.first_name} {achievement.mentee.user.last_name}
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  <span className="font-semibold">Awarded:</span> {new Date(achievement.created_at).toLocaleDateString()}
                </div>
                <div className="mt-4 flex justify-end">
                  <Link 
                    href={`/dashboard/achievements/${achievement.id}`}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No achievements found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? `No achievements match your search for "${searchTerm}"`
                : "There are no achievements to display"}
            </p>
            <Link 
              href="/dashboard/achievements/new" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Achievement
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 