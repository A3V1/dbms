export const getRoleFromToken = (token: string): 'mentor' | 'mentee' | 'admin' => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Decoded token payload:', payload);
    
    // Check for role in payload
    if (!payload.role) {
      console.error('No role found in token payload');
      throw new Error('No role found in token');
    }
    
    // Validate role is one of the expected values
    const role = payload.role.toLowerCase();
    if (!['mentor', 'mentee', 'admin'].includes(role)) {
      console.error('Invalid role found in token:', role);
      throw new Error('Invalid role in token');
    }
    
    return role as 'mentor' | 'mentee' | 'admin';
  } catch (error) {
    console.error('Error decoding token:', error);
    throw error;
  }
}; 