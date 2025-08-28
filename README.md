# Jelani-Africa Insurance Agency Website

This is a modern, responsive website for Jelani-Africa, a fictional insurance agency. The project is built with a focus on user experience, providing clients with easy-to-use tools for getting quotes, filing claims, making payments, and managing their accounts.

## Features

The website includes a wide range of features designed to serve both potential and existing clients:

-   **Responsive Design:** A mobile-first approach ensures the site looks and works great on all devices, from smartphones to desktops.
-   **Interactive Quote Wizard:** A step-by-step modal for potential clients to get an estimated insurance quote quickly.
-   **Client Authentication:** A complete login/registration system with features like:
    -   Tabbed interface for Login and Register.
    -   Two-Factor Authentication (2FA) simulation.
    -   Password strength indicator.
    -   "Forgot Password" flow.
    -   Social login placeholders.
-   **Client Dashboard:** A comprehensive, sidebar-navigated dashboard for logged-in users to:
    -   View an overview of their account.
    -   See active policies and their details.
    -   Track claim status with a visual progress tracker.
    -   Access a download center for documents.
    -   Receive notifications.
-   **Advanced Claims Form:** A multi-step claims wizard that allows users to:
    -   Enter policy and incident details in stages.
    -   Upload supporting documents.
    -   Review all information before submission.
    -   Save progress and continue later.
-   **Claim Status Portal:** A public-facing page for clients to track the status of their claim using a reference ID.
-   **Online Payment System:** A secure, multi-step payment wizard supporting various methods like Credit/Debit Card and Mobile Money (M-Pesa, Airtel).
-   **Dynamic Navigation:** The main navigation bar updates based on the user's login state, showing "My Profile" or "Login / Sign Up" accordingly.
-   **Live Support:** A floating WhatsApp button provides an easy way for users to get help.

## Technologies Used

-   **HTML5:** For the structure and content of the web pages.
-   **CSS3:** For styling, layout, and animations. Key features include:
    -   CSS Variables for easy theming.
    -   Flexbox and Grid for modern, responsive layouts.
    -   Keyframe animations for smooth user interface transitions.
-   **JavaScript (ES6+):** For all client-side interactivity, including form wizards, modals, dashboard navigation, and state management using `sessionStorage` and `localStorage`.

## Pages

The project consists of the following key pages:

-   `index.html`: The main landing page.
-   `about.html`: Information about the company, its mission, and founder.
-   `login.html`: The central hub for user login and registration.
-   `dashboard.html`: The client portal for managing policies and claims.
-   `claims.html`: The multi-step form for submitting a new claim.
-   `claim-status.html`: The portal for tracking an existing claim.
-   `payment.html`: The online payment wizard.
-   `forgot-password.html`: The password reset flow.
-   **Service Pages:** Individual pages for each type of insurance (e.g., `car-insurance.html`, `health-insurance.html`).

## How to Run

This is a static website project. No special build process is required. To run the project:

1.  Clone or download the repository.
2.  Open the project folder.
3.  Open the `index.html` file in your web browser.

## File Structure

```
.
├── about.html
├── auth-toggle.js
├── business-insurance.html
├── car-insurance.html
├── claim-status.html
├── claim-status.js
├── claims.html
├── claims-form.js
├── dashboard.html
├── dashboard.js
├── forgot-password.html
├── forgot-password.js
├── health-insurance.html
├── home-insurance.html
├── images/
│   ├── Jelani.jpg
│   └── Rachel.jpg
├── index.html
├── life-insurance.html
├── login.html
├── main.js
├── payment.html
├── payment-wizard.js
├── quote-wizard.js
└── style.css
```