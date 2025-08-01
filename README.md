# HR Management System

A modern full-stack authentication system built with Next.js frontend and Spring Boot backend.

## Features

- **Email-based Authentication**: Simple and secure login/registration using email addresses
- **JWT Token Management**: Secure authentication with JSON Web Tokens
- **Responsive UI**: Modern, responsive design using shadcn/ui components
- **Protected Routes**: Route guards for authenticated and unauthenticated users
- **User Dashboard**: Personalized dashboard displaying user information
- **SSR Hydration Safe**: Proper handling of server-side rendering

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern React component library
- **Axios** - HTTP client with interceptors for API calls
- **js-cookie** - Cookie management for JWT tokens

### Backend
- **Spring Boot 3** - Java application framework
- **Spring Security 6** - Authentication and authorization
- **JWT** - JSON Web Token for stateless authentication
- **MySQL** - Relational database
- **Maven** - Dependency management and build tool

## Project Structure

```
app/
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable React components
│   │   ├── context/       # React context providers
│   │   └── lib/           # Utility functions and API client
│   └── package.json
├── backend/               # Spring Boot backend application
│   ├── src/
│   │   ├── main/java/     # Java source code
│   │   └── test/java/     # Test files
│   └── pom.xml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Java 17+
- MySQL 8+
- Maven 3.6+

### Database Setup

1. Create a MySQL database named `hr_management`
2. Update database credentials in `backend/src/main/resources/application.properties`

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies and build:
   ```bash
   ./mvnw clean install
   ```

3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

The backend will start on `http://localhost:8081`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Protected Routes
- `GET /api/test/user-info` - Get current user information
- `GET /api/test/protected` - Protected endpoint example

## Authentication Flow

1. **Registration**: Users register with email, password, first name, and last name
2. **Login**: Users authenticate using email and password
3. **JWT Token**: Server returns a JWT token upon successful authentication
4. **Token Storage**: Frontend stores the token in HTTP-only cookies
5. **Protected Requests**: Token is automatically included in API requests via Axios interceptors
6. **Route Protection**: Frontend routes are protected based on authentication status

## Key Features

### Email-Only Authentication
- Simplified user experience with email as the primary identifier
- No username field required - users register and login with email only

### Secure Token Management
- JWT tokens stored in HTTP-only cookies
- Automatic token inclusion in API requests
- Token expiration handling with automatic logout

### Responsive Design
- Mobile-first responsive design
- Modern UI components from shadcn/ui
- Consistent styling with Tailwind CSS

### Error Handling
- Comprehensive error handling for API requests
- User-friendly error messages
- Form validation with real-time feedback

## Development

### Running Tests

Backend tests:
```bash
cd backend
./mvnw test
```

### Building for Production

Frontend build:
```bash
cd frontend
npm run build
```

Backend build:
```bash
cd backend
./mvnw clean package
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
