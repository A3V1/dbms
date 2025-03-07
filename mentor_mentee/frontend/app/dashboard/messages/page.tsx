'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MessageSquare, Send, Search, Paperclip, User, ChevronRight, Clock, Check } from 'lucide-react';
import Link from 'next/link';
import { messageAPI, Message, Contact } from '@/services/api';

export default function Messages() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await messageAPI.getContacts();
        setContacts(data);
      } catch (err: any) {
        console.error('Error fetching contacts:', err);
        setError(err.message || 'Failed to fetch contacts');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      const fetchMessages = async () => {
        setLoadingMessages(true);
        try {
          const data = await messageAPI.getConversation(selectedContact.id);
          setMessages(data);
          
          // Mark unread messages as read
          const unreadMessages = data.filter(
            (message: Message) => !message.is_read && message.sender.id === selectedContact.id
          );
          
          if (unreadMessages.length > 0) {
            await Promise.all(
              unreadMessages.map((message: Message) => messageAPI.markAsRead(message.id))
            );
            
            // Update the contact's unread count in the contacts list
            setContacts(contacts.map(contact => 
              contact.id === selectedContact.id 
                ? { ...contact, unread_count: 0 } 
                : contact
            ));
          }
        } catch (err: any) {
          console.error('Error fetching messages:', err);
          setError(err.message || 'Failed to fetch messages');
        } finally {
          setLoadingMessages(false);
        }
      };

      fetchMessages();
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredContacts = contacts.filter(contact => {
    const fullName = `${contact.first_name} ${contact.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || contact.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !selectedContact) return;

    try {
      const sentMessage = await messageAPI.sendMessage(selectedContact.id, newMessage);
      
      // Add the new message to the messages list
      setMessages([...messages, sentMessage]);
      
      // Update the last message in the contacts list
      setContacts(contacts.map(contact => 
        contact.id === selectedContact.id 
          ? { 
              ...contact, 
              last_message: {
                content: newMessage,
                created_at: new Date().toISOString(),
                is_read: false
              }
            } 
          : contact
      ));
      
      setNewMessage('');
    } catch (err: any) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
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
      <div className="h-[calc(100vh-64px)] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center">
            <MessageSquare className="mr-2 h-6 w-6 text-blue-500" />
            Messages
          </h1>
        </div>

        <div className="flex-1 flex overflow-hidden bg-white rounded-lg shadow">
          {/* Contacts Sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4 border-r">
            <div className="p-4 border-b">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-200px)]">
              {filteredContacts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No contacts found
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div 
                    key={contact.id}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${selectedContact?.id === contact.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {contact.profile_picture ? (
                          <img 
                            src={contact.profile_picture} 
                            alt={`${contact.first_name} ${contact.last_name}`}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${contact.role === 'mentor' ? 'bg-blue-500' : 'bg-green-500'}`}>
                            {contact.first_name[0]}{contact.last_name[0]}
                          </div>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {contact.first_name} {contact.last_name}
                          </p>
                          {contact.last_message && (
                            <p className="text-xs text-gray-500">
                              {formatMessageTime(contact.last_message.created_at)}
                            </p>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          {contact.last_message ? (
                            <p className="text-xs text-gray-500 truncate max-w-[150px]">
                              {contact.last_message.content}
                            </p>
                          ) : (
                            <p className="text-xs text-gray-500">
                              No messages yet
                            </p>
                          )}
                          {contact.unread_count > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full">
                              {contact.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Content */}
          <div className="hidden md:flex md:flex-1 flex-col">
            {selectedContact ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center">
                    {selectedContact.profile_picture ? (
                      <img 
                        src={selectedContact.profile_picture} 
                        alt={`${selectedContact.first_name} ${selectedContact.last_name}`}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${selectedContact.role === 'mentor' ? 'bg-blue-500' : 'bg-green-500'}`}>
                        {selectedContact.first_name[0]}{selectedContact.last_name[0]}
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {selectedContact.first_name} {selectedContact.last_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedContact.role.charAt(0).toUpperCase() + selectedContact.role.slice(1)}
                      </p>
                    </div>
                  </div>
                  <Link 
                    href={`/dashboard/profile/${selectedContact.id}`}
                    className="text-blue-500 hover:underline text-sm flex items-center"
                  >
                    <User className="h-4 w-4 mr-1" />
                    <span>View Profile</span>
                  </Link>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                          <p>No messages yet</p>
                          <p className="text-sm">Start the conversation by sending a message</p>
                        </div>
                      ) : (
                        messages.map((message) => {
                          // Check if the sender is the current user (not the selected contact)
                          const isCurrentUser = message.sender.id !== selectedContact.id;
                          return (
                            <div 
                              key={message.id}
                              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                <p>{message.content}</p>
                                <div className={`text-xs mt-1 flex items-center ${isCurrentUser ? 'text-blue-100 justify-end' : 'text-gray-500'}`}>
                                  <span>{formatMessageTime(message.created_at)}</span>
                                  {isCurrentUser && (
                                    <span className="ml-1 flex items-center">
                                      {message.is_read ? (
                                        <Check className="h-3 w-3" />
                                      ) : (
                                        <Clock className="h-3 w-3" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center">
                    <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-full px-4 py-2 ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                    />
                    <button 
                      className="p-2 ml-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversation selected</h3>
                  <p className="text-gray-500">
                    Select a contact to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile View - Show selected contact or prompt to select */}
          <div className="flex-1 md:hidden">
            {selectedContact ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center">
                    <button 
                      className="mr-2 text-gray-500"
                      onClick={() => setSelectedContact(null)}
                    >
                      <ChevronRight className="h-5 w-5 transform rotate-180" />
                    </button>
                    {selectedContact.profile_picture ? (
                      <img 
                        src={selectedContact.profile_picture} 
                        alt={`${selectedContact.first_name} ${selectedContact.last_name}`}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${selectedContact.role === 'mentor' ? 'bg-blue-500' : 'bg-green-500'}`}>
                        {selectedContact.first_name[0]}{selectedContact.last_name[0]}
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {selectedContact.first_name} {selectedContact.last_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedContact.role.charAt(0).toUpperCase() + selectedContact.role.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto h-[calc(100vh-250px)]">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                          <p>No messages yet</p>
                          <p className="text-sm">Start the conversation by sending a message</p>
                        </div>
                      ) : (
                        messages.map((message) => {
                          // Check if the sender is the current user (not the selected contact)
                          const isCurrentUser = message.sender.id !== selectedContact.id;
                          return (
                            <div 
                              key={message.id}
                              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-xs rounded-lg px-4 py-2 ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                <p>{message.content}</p>
                                <div className={`text-xs mt-1 flex items-center ${isCurrentUser ? 'text-blue-100 justify-end' : 'text-gray-500'}`}>
                                  <span>{formatMessageTime(message.created_at)}</span>
                                  {isCurrentUser && (
                                    <span className="ml-1 flex items-center">
                                      {message.is_read ? (
                                        <Check className="h-3 w-3" />
                                      ) : (
                                        <Clock className="h-3 w-3" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center">
                    <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-full px-4 py-2 ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                    />
                    <button 
                      className="p-2 ml-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversation selected</h3>
                  <p className="text-gray-500">
                    Select a contact to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 