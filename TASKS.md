# Project Features Status

This document tracks the features needed for the Real Estate Web Application.

## Authentication
- [x] **Login**: User login with credentials.
- [x] **Register**: New user registration.
- [x] **Sign Out**: Securely sign out.
- [ ] **Forgot Password**: Password reset functionality.

## Public Interface
- [x] **Landing Page**: Listing of all "APPROVED" properties.
- [x] **Property Details**: Dedicated page for individual property details (`/properties/[id]`).
- [x] **Search & Filter**: Search properties by title, location, or price range.
- [x] **Pagination**: Paginate property listings on the home page.
- [x] **Contact Agent**: Functional contact form or logic on property details page.

## User Dashboard (Agents/Sellers)
- [x] **View My Properties**: List all properties created by the logged-in user.
- [x] **Create Listing**: Form to submit a new property.
- [x] **Edit Listing**: Edit details of existing properties.
- [x] **Delete Listing**: Remove a property listing.
- [x] **Image Management**: 
    - [x] Upload images.
    - [x] Preview images in grid.
    - [x] Reorder images.
    - [x] Delete images.
- [x] **Draft Status**: Save listings as drafts before publishing.

## Admin Dashboard
- [x] **Admin Layout**: Base layout for admin pages.
- [x] **View All Properties**: List all properties (Pending, Approved, Rejected).
- [x] **Moderation**: 
    - [x] Approve properties.
    - [x] Reject properties.
- [x] **User Management**: View and manage users (optional but recommended).

## General / UI
- [x] **Responsive Design**: Mobile-friendly layout.
- [x] **Theme Support**: Dark and Light mode toggle.
- [x] **Navigation**: Working navigation links between pages.
- [x] **Loading States**: Better loading skeletons/indicators for data fetching.
- [x] **Error Handling**: Comprehensive error pages (404, 500) and toast notifications.

## Database
- [x] **Schema**: Users and Properties tables defined.
- [x] **Migrations**: Tables created in Postgres.

## Next Steps / Priority
1. Implement **Validation/Moderation** actions in Admin Dashboard (Approve/Reject).
2. Add **Search and Filter** to the homepage.
3. Improve **UI polish** (Loading states, Toasts).
