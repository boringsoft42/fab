# Job Offers Management - Super Admin

This module provides comprehensive job offers management functionality for super administrators in the CEMSE platform.

## Features

### 🔍 **Job Offers Listing**
- View all job offers in the platform
- Search job offers by title, description, location, or municipality
- Filter by status (Active, Paused, Closed, Draft)
- Pagination support
- Real-time statistics (views, applications)

### ➕ **Create Job Offers**
- Comprehensive form with all job offer fields
- Company selection from active companies
- Skills management (required and desired)
- Salary range configuration
- Date management (deadlines, expiration)
- Status and featured options

### ✏️ **Edit Job Offers**
- Full editing capabilities for all job offer fields
- Maintain existing data integrity
- Update company associations
- Modify skills, requirements, and benefits

### 👁️ **View Job Details**
- Complete job offer information display
- Company details and contact information
- Application statistics and recent applications
- Skills, requirements, and benefits
- Important dates and status information

### 🗑️ **Delete Job Offers**
- Secure deletion with confirmation
- Cascade deletion of related records
- Proper error handling

## API Endpoints

### Job Offers Management
- `GET /api/admin/job-offers` - List all job offers with pagination and filters
- `POST /api/admin/job-offers` - Create new job offer
- `GET /api/admin/job-offers/[id]` - Get specific job offer details
- `PUT /api/admin/job-offers/[id]` - Update job offer
- `DELETE /api/admin/job-offers/[id]` - Delete job offer

### Supporting APIs
- `GET /api/admin/companies` - List active companies for dropdown

## Access Control

- **Super Admin Only**: All endpoints require SUPERADMIN role
- **Authentication**: Uses NextAuth session validation
- **Authorization**: Role-based access control

## Database Schema

The job offers management uses the following Prisma models:

- `JobOffer` - Main job offer entity
- `Company` - Company information
- `JobApplication` - Job applications
- `JobQuestion` - Custom questions for applications
- `JobQuestionAnswer` - Answers to custom questions

## Components

### Main Components
- `JobOffersPage` - Main management page with table and actions
- `JobOfferForm` - Comprehensive form for creating/editing job offers
- `JobOfferDetails` - Detailed view component

### Features
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Uses React Query for data management
- **Form Validation**: Zod schema validation
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Proper loading indicators
- **Toast Notifications**: User feedback for actions

## Usage

1. **Access**: Navigate to `/admin/job-offers` as a super admin
2. **View**: Browse all job offers with search and filters
3. **Create**: Click "Create Job Offer" to add new positions
4. **Edit**: Use the actions menu to edit existing job offers
5. **View Details**: Click "View Details" for comprehensive information
6. **Delete**: Use the delete action with confirmation

## Security

- All endpoints validate SUPERADMIN role
- Input validation on both client and server
- SQL injection protection via Prisma ORM
- XSS protection through proper data sanitization

## Future Enhancements

- Bulk operations (import/export)
- Advanced analytics and reporting
- Integration with external job boards
- Automated job posting workflows
- Application management features
