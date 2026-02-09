Design Handover Summary: Kalsan Auto Spare Parts Platform
This document serves as the final design specification for the software engineering team. It outlines the architectural requirements, visual standards, and functional workflows for the Kalsan Auto Spare Parts desktop and mobile-responsive application.

1. Project Overview

A specialized B2B and B2C e-commerce platform for three-wheeler spare parts, utilizing a Request for Quote (RFQ) model. The system is divided into a high-conversion storefront and a robust administrative control suite.

2. Visual Identity & Brand Standards

The engineer must strictly implement the following color tokens and styles without deviation:

Element	Color Hex	Usage
Primary Navy	#1D428A	Primary buttons, active nav links, brand icons, progress bars.
Secondary Black	#000000	Headlines, primary text, dark mode elements, footer backgrounds.
Base White	#FFFFFF	Global page backgrounds, card backgrounds, input fields.
Accent Blue	#E8F0FE	Hover states, light backgrounds for alerts, sidebar highlights.
Typography: Modern Sans-Serif (Inter or Roboto). Titles: Bold/Black. Body: Regular/Medium.
UI Components: 8px border-radius for buttons/cards. Soft shadows (0px 4px 12px rgba(0,0,0,0.05)).

3. Core Functional Workflows

A. The Inquiry Engine (Storefront)
Price Visibility: Prices are hidden by default across the shop.
Quote Builder: Users add parts to a "Quote List." Upon submission, the system generates a quote_id with a Pending status.
Finalization: When an admin provides prices, the user receives an email. The user logs in, reviews the quote in their account, and clicks "Pay & Finalize" to open the payment modal.
B. Admin Management (Backend)
Quote Processor: Admins must have an interface to input unit_price for each item in a Pending quote.
Inventory Control: Support for bulk CSV imports with validation and brand/category taxonomy management.
CMS: A section-based editor to manage homepage sliders and promo banners without code changes.

4. Screen Inventory (Stored in /doc/prototype/)

The engineering team must refer to the following exported designs:

Homepage: Hero sliders, Brand grid, and Service value props.
Shop & Filters: Sidebar with vehicle model and category filtering.
Product Detail: High-res gallery, specs, and "Add to Quote" action.
Customer Dashboard: Quote history, Order tracking, and Address management.
Admin Suite: Main Dashboard, Quote Management, Product Editor, and System Settings.
Auth & System: Login, Register, 404 Error, and Maintenance pages.
Email Templates: Password Reset, Welcome, and Quote/Price notifications.

5. Mobile Responsiveness

Implement a "Mobile First" approach for the storefront.
Use bottom-sheet drawers for filters.
Ensure all quote management features are accessible and touch-optimized on mobile devices.

6. Technical Handover Note

Refer to the Database Schema Recommendation (provided in previous documentation) for the Quote-to-Order state machine. Ensure all transactional emails are triggered via the defined SMTP settings in the System Settings module.

The prototype designs in /doc/prototype/ are the final source of truth for all UI/UX implementation.