# 🌍 NGO Project - Making a Difference in East Africa

**Status:** Active Development  
**Last Updated:** April 30, 2026  

**Vision:** To create a transparent, efficient, and donor-friendly platform that empowers humanitarian organizations to maximize their impact in East Africa by efficiently managing resources and maintaining strong donor relationships.

---

## 🚀 Quick Start

No installation required! The application uses browser `localStorage` for data persistence.

**Open in a web browser:**
* **For Users/Donors:** Open `Users-panel/index.html` in your browser.
* **For Admin:** Open `admin-panel/admin-login.html` in your browser.

**Browser Compatibility:**
* Chrome (recommended)
* Firefox
* Safari
* Edge

---

## 📖 Usage Guide

### For Donors
1. **Visit the Landing Page** (`Users-panel/index.html`)
   * Explore our mission, programs, and impact.
   * Learn about our work in Kenya, Uganda, and South Sudan.
2. **Make a Donation**
   * Click the "Donate Now" button.
   * Select a program (Child Protection, Clean Water, Education, Health & Nutrition).
   * Choose donation type (one-time or monthly).
   * Select or enter an amount.
   * Choose payment method (Credit Card, PayPal, or Mobile Money).
   * Complete the transaction.
3. **Track Your Impact**
   * Receive donation confirmations.
   * View impact stories and fund allocation.

### For NGO Administrators
1. **Access the Admin Dashboard**
   * Navigate to `admin-panel/admin-login.html`.
   * Log in with admin credentials.
2. **Dashboard Overview**
   * View total donations collected, monitor donor count, check monthly donation targets, and see recent donation entries.
3. **Manage Donors**
   * Go to the "Donors" section to add new profiles, edit information, delete records, and view contact details.
4. **Track Donations**
   * Access the "Donations" section to view, filter, search, and export recorded contributions.
5. **Generate Reports**
   * Go to the "Reports" section for financial summaries, donation trends, and compliance reports.
6. **Manage Communications**
   * Access the "Messages" section to send thank-you messages to donors and track communication history.

---

## 💾 Data Storage
The application currently uses **browser localStorage** to persist data:
* Donor information and donations are stored locally on the browser.
* *Note: Data is browser-specific and will be lost if the browser cache is cleared. Data is not automatically synced to a server (see Future Enhancements).*

---

## 🎨 Key Components

### Donation Form Intelligence
* URL-based course pre-selection (e.g., `?course=education`).
* Dynamic payment method switching with required field validation.
* PayPal SDK integration for secure payments.
* Mobile money and credit card form handling.

### Admin Dashboard
* Real-time statistics cards.
* Responsive sidebar navigation.
* Interactive donor management table.
* Secure logout functionality.

---

## 🔐 Security Features
* Admin authentication (currently local).
* Session management.
* Form validation on both client-side.
* Password protection for admin access.

---

## 🗺️ Operational Focus
We operate across East Africa with focus areas in:
* 🇰🇪 **Kenya**
* 🇺🇬 **Uganda**
* 🇸🇸 **South Sudan**

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
2. Donation form loads with pre-selected program.
3. User chooses payment method (JavaScript dynamically shows relevant payment fields).
4. Form data is validated and stored in `localStorage`.
5. Confirmation is displayed to the user.

**Admin Workflow:**
1. Admin logs in via authentication.
2. Session persists using browser storage.
3. Dashboard displays aggregated donation data.
4. Admin can perform CRUD operations on donors.
5. Reports can be generated from stored data.

---

## 🚧 Future Enhancements
- [ ] Backend API development (Node.js, Python, or Django)
- [ ] Database implementation (MongoDB, PostgreSQL)
- [ ] User authentication and registration
- [ ] Email notification system
- [ ] SMS thank-you messages
- [ ] Advanced analytics dashboard
- [ ] Real-time data synchronization
- [ ] Multi-language support
- [ ] Mobile-responsive optimization
- [ ] Payment gateway integration (Mpesa, Stripe)
- [ ] Volunteer management system
- [ ] Event scheduling platform

---

## 🤝 Contributing
We welcome contributions from developers and designers! Here's how to help:

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/YourFeatureName
