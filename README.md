AppointEase – Online Healthcare Appointment Booking System
<img width="1536" height="1024" alt="ChatGPT Image Aug 15, 2026, 12_56_28 AM" src="https://github.com/user-attachments/assets/340a48c6-0793-417c-b717-6af3efd97ce0" />

AppointEase is a cloud-powered web application for discovering doctors, viewing available appointment slots, booking appointments, and managing existing bookings.

🔗 Project Links

GitHub: https://github.com/thegraxwizard/online-appointment-booking

Live Application: https://main.d2yyergjlqip7g.amplifyapp.com/

📌 Problem Statement

Traditional healthcare appointment scheduling can be time-consuming for patients and difficult to manage manually. Patients need a simple way to discover doctors, check available time slots, book appointments, and manage their bookings.

🎯 Objective

To develop a secure, cloud-powered healthcare appointment booking application that allows users to:

Browse available doctors

View doctor details and specialties

Check real-time appointment availability

Book an available appointment slot

View existing appointments

Cancel appointments

✨ Main Features

Doctor listing and specialty-based browsing

Doctor details and experience information

Appointment slot availability

Online appointment booking

My Appointments dashboard

Appointment cancellation

Persistent cloud database

Responsive modern interface

Cloud deployment using AWS Amplify

🏗️ Architecture

                         ┌─────────────────┐
                         │      User       │
                         └────────┬────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │      AWS Amplify        │
                    │       Hosting           │
                    │   React + Vite App      │
                    └────────────┬────────────┘
                                 │
                                 │ HTTPS / API
                                 ▼
                    ┌─────────────────────────┐
                    │        Supabase         │
                    │   Backend-as-a-Service  │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   PostgreSQL Database   │
                    ├─────────────────────────┤
                    │ Doctors                 │
                    │ Appointment Slots        │
                    │ Appointments             │
                    └─────────────────────────┘

Application workflow

User
 ↓
Browse Doctors
 ↓
Select Doctor
 ↓
View Available Slots
 ↓
Enter Patient Details
 ↓
Book Appointment
 ↓
Appointment Stored in Supabase PostgreSQL
 ↓
View / Cancel from My Appointments

🧰 Technology Stack

Layer

Technology

Frontend

React

Build Tool

Vite

Programming Language

JavaScript

Styling

CSS

Backend / BaaS

Supabase

Database

PostgreSQL

Database Security

Supabase Row Level Security (RLS)

Cloud Platform

AWS

Cloud Hosting

AWS Amplify Hosting

Source Control

Git + GitHub

Development

Visual Studio Code

AI / Vibe Coding

ChatGPT

☁️ Cloud Strategy

The application follows a managed cloud architecture.

AWS Amplify hosts and deploys the React/Vite frontend.

GitHub acts as the source-code repository.

AWS Amplify is connected to the GitHub main branch for automated deployments.

Supabase provides the managed backend and PostgreSQL database.

Appointment data is persisted in the cloud rather than browser-local storage.

Row Level Security (RLS) policies are configured in Supabase for database access control.

🗄️ Database

The application uses PostgreSQL through Supabase.

Main tables

doctors

Stores doctor information such as name, specialty, experience and profile information.

appointment_slots

Stores doctor availability, appointment date/time and slot availability status.

appointments

Stores patient booking information and the selected appointment slot.

The appointment workflow updates the database when a slot is booked or cancelled.

🚀 Deployment

The project is deployed using AWS Amplify Hosting.

Deployment workflow

Local Development
       ↓
     Git
       ↓
    GitHub
       ↓
AWS Amplify detects push
       ↓
npm run build
       ↓
AWS Amplify deploys build
       ↓
Public HTTPS application

The main branch is configured as the production branch in AWS Amplify.

💻 Run Locally

1. Clone the repository

git clone https://github.com/thegraxwizard/online-appointment-booking.git
cd online-appointment-booking

2. Install dependencies

npm install

3. Configure environment variables

Create a .env file in the project root:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

Do not commit .env to GitHub.

4. Start the development server

npm run dev

5. Build for production

npm run build

🤖 AI-Assisted / Vibe Coding

AI-assisted development was used to accelerate application development, debugging, integration and UI refinement.

The primary AI tool used during development was ChatGPT.

Important development tasks assisted by AI included:

React component development

Supabase integration

Database interaction logic

Debugging environment-variable issues

AWS Amplify deployment configuration

UI refinement

Git and GitHub workflow guidance

The prompts used during development are documented separately in the project report.

🧪 Testing

The application was tested through the following workflow:

Load the deployed application.

Browse doctors.

Select a doctor.

View available appointment slots.

Book an appointment.

Verify the appointment in My Appointments.

Verify the booking is persisted in Supabase.

Cancel the appointment.

Verify the appointment state changes correctly.

📸 Screenshots

Screenshots of the following application states can be added to the repository/report:

Home page

Doctors page

Appointment booking page

My Appointments page

Supabase appointments table

AWS Amplify deployment page

🔐 Security Notes

Supabase credentials are stored using environment variables.

.env is excluded through .gitignore.

The frontend uses the Supabase publishable key rather than a privileged server key.

Database access is protected using Supabase RLS policies.

🔮 Future Enhancements

Possible future improvements include:

Patient authentication

Doctor/admin dashboard

Email or SMS appointment notifications

Appointment rescheduling

Payment integration

Doctor availability management

Mobile application

Multi-language support

📄 Academic Activity

This project was developed as an individual cloud-computing application activity using AI-assisted / Vibe Coding techniques.

The accompanying academic report documents the problem statement, objective, cloud concepts, prompts used, screenshots, blockers, learning reflection and deployment details.
