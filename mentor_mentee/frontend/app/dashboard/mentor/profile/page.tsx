'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { User, Mail, Phone, Award, Calendar, Edit, Save, X } from 'lucide-react';
import Link from 'next/link';
import { userAPI } from '@/services/api';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'mentor' | 'mentee' | 'admin';
  official_mail_id: string;
  phone_number: string;
  prn_id_no: string;
  profile_picture: string | null;
  additional_info: {
    [key: string]: any;
  };
}

export default function MentorProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userAPI.getProfile();
        if (data.role !== 'mentor') {
          throw new Error('Unauthorized: Only mentors can access this page');
        }
        setProfile(data);
        setEditedProfile(data);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };

  const handleSave = async () => {
    try {
      const updatedProfile = await userAPI.updateProfile(editedProfile);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile as UserProfile);
    setIsEditing(false);
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

  if (!profile) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <User className="mr-2 h-6 w-6 text-blue-500" />
            Mentor Profile
          </h1>
          {!isEditing ? (
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                onClick={handleSave}
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                onClick={handleCancel}
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Profile Header */}
          <div className="bg-blue-500 text-white p-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-shrink-0 mb-4 md:mb-0">
                {profile.profile_picture ? (
                  <img 
                    src={profile.profile_picture} 
                    alt={`${profile.first_name} ${profile.last_name}`}
                    className="h-24 w-24 rounded-full border-4 border-white"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-blue-700 flex items-center justify-center text-white text-3xl border-4 border-white">
                    {profile.first_name[0]}{profile.last_name[0]}
                  </div>
                )}
              </div>
              <div className="md:ml-6 text-center md:text-left">
                <h2 className="text-2xl font-bold">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        name="first_name" 
                        value={editedProfile.first_name} 
                        onChange={handleInputChange}
                        className="bg-blue-600 text-white border border-blue-400 rounded px-2 py-1 w-32"
                      />
                      <input 
                        type="text" 
                        name="last_name" 
                        value={editedProfile.last_name} 
                        onChange={handleInputChange}
                        className="bg-blue-600 text-white border border-blue-400 rounded px-2 py-1 w-32"
                      />
                    </div>
                  ) : (
                    `${profile.first_name} ${profile.last_name}`
                  )}
                </h2>
                <p className="text-blue-100 mt-1">Mentor</p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {isEditing ? (
                      <input 
                        type="email" 
                        name="email" 
                        value={editedProfile.email} 
                        onChange={handleInputChange}
                        className="bg-blue-600 text-white border border-blue-400 rounded px-2 py-1 w-48"
                      />
                    ) : (
                      <span>{profile.email}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="phone_number" 
                        value={editedProfile.phone_number} 
                        onChange={handleInputChange}
                        className="bg-blue-600 text-white border border-blue-400 rounded px-2 py-1 w-32"
                      />
                    ) : (
                      <span>{profile.phone_number}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium">{profile.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Official Email</p>
                    {isEditing ? (
                      <input 
                        type="email" 
                        name="official_mail_id" 
                        value={editedProfile.official_mail_id} 
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <p className="font-medium">{profile.official_mail_id}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">PRN ID</p>
                    <p className="font-medium">{profile.prn_id_no}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium">Mentor</p>
                  </div>
                </div>
              </div>

              {/* Mentor Statistics */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Mentorship Statistics</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Active Mentees</p>
                    <p className="font-medium">5</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed Mentorships</p>
                    <p className="font-medium">12</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Upcoming Meetings</p>
                    <p className="font-medium">3</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Average Rating</p>
                    <p className="font-medium text-yellow-500">4.8/5.0</p>
                  </div>
                </div>
              </div>

              {/* Expertise Areas */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Areas of Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Web Development</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Data Science</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Machine Learning</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Cloud Computing</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">DevOps</span>
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <p className="font-medium">Best Mentor of the Month - February 2024</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <p className="font-medium">100% Mentee Satisfaction Rate</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <p className="font-medium">Successfully Completed 10+ Mentorships</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 