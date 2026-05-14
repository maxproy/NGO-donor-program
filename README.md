# 🌍 NGO Project - Making a Difference in East Africa

**Status:** Active Development  
**Last Updated:** May 14, 2026  

> **Vision:** To create a transparent, efficient, and donor-friendly platform that empowers humanitarian organizations to maximize their impact in East Africa by efficiently managing resources and [...]

---

## 🚀 Quick Start

To get the project up and running on your local machine, follow these steps.

### Prerequisites
You need a local server environment with PHP and MySQL.
*   XAMPP (cross-platform)
*   WAMP (for Windows)
*   MAMP (for macOS)

### 1. Database Setup
Import the `database/database.sql` file into your MySQL database (e.g., via phpMyAdmin). This will create the necessary tables and schema.

### 2. Configuration
Copy the contents of `config/db.php` and update the credentials to match your local database setup.

```php
// In config/db.php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_db_user');
define('DB_PASSWORD', 'your_db_password');
define('DB_NAME', 'ngo_project');
```

### 3. Admin User Setup
The admin panel is protected. You need to create an admin user in the `admin_users` table.

**Insert the Admin User:**
Execute the following SQL query in your database, using your desired plain text password.

```sql
INSERT INTO `admin_users` (`username`, `password`, `role`) 
VALUES ('admin', 'your_plaintext_password_here', 'admin');
```

### 4. Run the Application
Place the project files in your server's web directory (e.g., `htdocs` for XAMPP) and navigate to the application in your browser.

*   **User Panel:** `http://localhost/NGO-Project/Users-panel/`
*   **Admin Panel:** `http://localhost/NGO-Project/admin-panel/admin-login.html`

**Browser Compatibility:**
*   Chrome (recommended), Firefox, Safari, Edge

---

## 💻 Technology Stack

*   **Backend:** PHP 7.4+
*   **Database:** MySQL
*   **Frontend:** HTML5, CSS3, JavaScript (ES6+ Asynchronous Fetch API)
*   **Server Environment:** Apache/Nginx

### Language Composition

| Language   | Percentage |
|------------|-----------|
| JavaScript | 33.7%     |
| PHP        | 30.2%     |
| HTML       | 21.0%     |
| CSS        | 15.1%     |

---

## 📂 Project Structure

```
NGO-Project/
├── admin-panel/        # Admin-facing dashboard and management pages
│   ├── admin-auth.js   # Client-side session check
│   ├── donor.js        # CRUD logic for donors
│   ├── script.js       # Dashboard stats logic
│   └── *.html          # Admin HTML files
├── api/                # Backend PHP API endpoints
│   ├── admin/          # Admin-specific actions (login, etc.)
│   └── donations/      # CRUD and stats for donations
├── config/
│   └── db.php          # Database connection settings
├── database/
│   └── database.sql    # SQL schema file
├── includes/
│   └── session.php     # Server-side session handling
├── Users-panel/        # Public-facing user pages
│   ├── donation-handler.js # Client-side library for donation API
│   └── *.html          # User HTML files
├── DONATIONS_API.md    # Detailed API documentation for donations
└── README.md           # This file
```

---

## 📖 API Documentation

This project features a comprehensive RESTful API for managing donations. For detailed information on endpoints, parameters, and example responses, please see the **DONATIONS_API.md** file.

---

## 📖 Usage Guide

### For Donors
1.  **Visit the Landing Page** (`Users-panel/index.html`) to explore our mission and programs.
2.  **Make a Donation** by clicking "Donate Now", filling out the secure form, and choosing a payment method.
3.  **Track Your Impact** through confirmations and impact stories.

### For NGO Administrators
1.  **Log In** at `admin-panel/admin-login.html` with the credentials you created.
2.  **View Dashboard** for a real-time overview of key metrics.
3.  **Manage Donors** in the "Donors" section (add, edit, delete).
4.  **Track Donations** in the "Donations" section (view, filter, search).
5.  **Generate Reports** for financial summaries and trend analysis.
6.  **Manage Communications** to send messages to donors.

---

## 🎨 Key Components

*   **Donation Form Intelligence:** URL-based program pre-selection, dynamic payment fields, and integrated payment SDKs.
*   **Admin Dashboard:** Real-time statistic cards and interactive data tables for full control over records.
*   **Decoupled Backend:** A clean PHP/MySQL backend API handles all data logic, separate from the frontend presentation.

---

## 🔐 Security Features

*   **Admin Authentication:** Secure login and session management for protected routes.
*   **SQL Injection Prevention:** Use of prepared statements in all database queries.
*   **Password Hashing:** Donor passwords are securely hashed using `password_hash()` (Note: Admin login is configured for plain text locally).
*   **Server-Side Validation:** All incoming data is validated on the server to ensure integrity.

---

## 🗺️ Operational Focus
We operate across East Africa with focus areas in:
*   🇰🇪 **Kenya**
*   🇺🇬 **Uganda**
*   🇸🇸 **South Sudan**

**Program Areas:**
* **Child Protection:** Ensuring safety and rights for vulnerable children.
* **Clean Water:** Providing safe drinking water to rural communities.
* **Education:** Supporting schools and learning resources.
* **Health & Nutrition:** Improving medical access and nutrition programs.

**📈 Impact Metrics:**
* **12+** Communities Reached
* **5,000+** Lives Impacted
* **3** Active Countries

---

## 🎓 Getting Started with Development

### Understanding the Code Flow

**Donation Flow:**
1. User selects a program from the landing page.
2. User fills out the donation form.
3. On submission, JavaScript sends the data to the `POST /api/donations/create.php` endpoint.
4. The PHP backend validates the data and inserts it into the `donations` table in the MySQL database.
5. A success or error message is returned to the user.

**Admin Workflow:**
1. Admin logs in via `admin-login.html`, which calls the `POST /api/admin/login.php` endpoint.
2. Upon success, a PHP session is created on the server.
3. Each admin page is protected by `admin-auth.js`, which verifies the active session with the server.
4. The dashboard fetches data from the API (e.g., `GET /api/donations/stats.php`).
5. Admin performs CRUD operations by calling the relevant API endpoints.

---

## 🚧 Future Enhancements
- [x] Backend API development (PHP)
- [x] Database implementation (MySQL)
- [x] User authentication and registration
- [ ] **Email Notification System:** Automate thank-you emails and receipts.
- [ ] **SMS Integration:** Send SMS thank-you messages.
- [ ] **Advanced Analytics:** A more detailed analytics dashboard with charts.
- [ ] **Payment Gateway Integration:** Add Stripe and M-Pesa.
- [ ] **Volunteer Management Module:** A system for managing volunteers.
- [ ] **Event Scheduling Platform:** For organizing NGO events.
- [ ] **Mobile-Responsive Optimization:** Further enhance mobile views.
- [ ] **Multi-language Support**.

---

## 🤝 Contributing
We welcome contributions from developers and designers! Here's how to help:

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/YourFeatureName
