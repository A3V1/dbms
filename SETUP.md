# Mentor-Mentee System Setup Guide

This guide will help you set up and run both the frontend and backend components of the Mentor-Mentee System.

## Prerequisites

Before starting, ensure you have the following installed on your system:
- Node.js (v18 or later)
- Python (v3.8 or later)
- Git

## Backend Setup

1. Navigate to the backend directory:
```bash
cd mentor_mentee/backend
```

2. Create and activate a Python virtual environment:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Install the required Python packages:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory with the following content:
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
DATABASE_URL=sqlite:///db.sqlite3
```

5. Run database migrations:
```bash
python manage.py migrate
```

6. Create a superuser (admin):
```bash
python manage.py createsuperuser
```

7. Start the backend server:
```bash
python manage.py runserver
```

The backend will be running at `http://localhost:8000`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd mentor_mentee/frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory with:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be running at `http://localhost:3000`

## Project Structure

### Frontend Dependencies
- Next.js 14
- React 18
- TailwindCSS
- Axios for API calls
- React Query for state management
- Formik & Yup for form handling
- HeadlessUI & HeroIcons for UI components

### Backend Dependencies
- Django 4.2.9
- Django REST Framework
- Simple JWT for authentication
- Django CORS Headers
- DRF-YASG for API documentation

## Common Issues and Solutions

1. CORS Issues:
   - Ensure the frontend URL is listed in `CORS_ALLOWED_ORIGINS` in backend settings
   - Check if the API URL in frontend `.env.local` matches the backend URL

2. Database Issues:
   - Make sure all migrations are applied
   - Check if the database file has correct permissions

3. Authentication Issues:
   - Verify that JWT tokens are being properly stored and sent
   - Check token expiration times in backend settings

## Development Workflow

1. Backend API Development:
   - Create models in Django
   - Create serializers
   - Create views and configure URLs
   - Test with Django REST framework browsable API

2. Frontend Development:
   - Create components in `components/` directory
   - Add pages in `app/` directory
   - Handle API integration in `services/` directory
   - Manage state with React Query and context

## Testing

1. Backend Tests:
```bash
python manage.py test
```

2. Frontend Tests:
```bash
npm run test
```

## Building for Production

1. Backend:
   - Set `DEBUG=False` in `.env`
   - Configure proper database settings
   - Set proper `ALLOWED_HOSTS`

2. Frontend:
```bash
npm run build
npm run start
```

## Additional Resources

- Django Documentation: https://docs.djangoproject.com/
- Next.js Documentation: https://nextjs.org/docs
- Django REST Framework: https://www.django-rest-framework.org/
- TailwindCSS: https://tailwindcss.com/docs

## Support

For any issues or questions:
1. Check the common issues section above
2. Review the relevant documentation
3. Contact the development team

---

Remember to never commit sensitive information like API keys or credentials to version control. 