# Donation Management API Documentation

## Overview
This API provides complete donation management functionality, replacing the JavaScript array logic with a server-side PHP solution backed by MySQL database.

## API Endpoints

### 1. Create Donation
**Endpoint:** `POST /api/donations/create.php`

**Parameters:**
- `donor_id` (int, required) - ID of the donor
- `program` (string, required) - Program name
- `donation_plan` (string, required) - "one-time" or "monthly"
- `amount` (float, required) - Donation amount
- `payment_method` (string, required) - "credit_card", "paypal", "mobile", or "bank_transfer"
- `transaction_id` (string, optional) - Transaction reference
- `payment_details` (JSON, optional) - Additional payment details

**Example Request:**
```javascript
const donationData = {
    donor_id: 1,
    program: 'Education',
    donation_plan: 'one-time',
    amount: 100.00,
    payment_method: 'credit_card',
    transaction_id: 'TXN123456'
};

const result = await donationManager.createDonation(donationData);
```

**Response:**
```json
{
    "success": true,
    "message": "Donation created successfully",
    "donation_id": 45,
    "data": {
        "donation_id": 45,
        "donor_id": 1,
        "program": "Education",
        "donation_plan": "one-time",
        "amount": 100.00,
        "payment_method": "credit_card",
        "status": "pending",
        "donation_date": "2026-05-05 10:30:00"
    }
}
```

### 2. List Donations
**Endpoint:** `GET /api/donations/list.php`

**Query Parameters:**
- `donor_id` (int, optional) - Filter by donor
- `program` (string, optional) - Filter by program name
- `status` (string, optional) - Filter by status (pending, completed, failed, cancelled, processing)
- `limit` (int, default: 100) - Number of results per page
- `offset` (int, default: 0) - Pagination offset
- `sort_by` (string, default: "donation_date") - Sort column
- `sort_order` (string, default: "DESC") - Sort order (ASC/DESC)

**Example Request:**
```javascript
const result = await donationManager.getDonations({
    program: 'Education',
    status: 'completed',
    limit: 20,
    offset: 0
});
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "donation_id": 45,
            "donor_id": 1,
            "donor_name": "John Doe",
            "donor_email": "john@example.com",
            "program": "Education",
            "donation_plan": "one-time",
            "amount": 100.00,
            "payment_method": "credit_card",
            "status": "completed",
            "transaction_id": "TXN123456",
            "donation_date": "2026-05-05 10:30:00",
            "updated_at": "2026-05-05 10:30:00"
        }
    ],
    "pagination": {
        "total": 150,
        "limit": 20,
        "offset": 0,
        "page": 1
    }
}
```

### 3. Get Single Donation
**Endpoint:** `GET /api/donations/get.php`

**Query Parameters:**
- `donation_id` (int, required) - Donation ID

**Example Request:**
```javascript
const result = await donationManager.getDonation(45);
```

**Response:**
```json
{
    "success": true,
    "data": {
        "donation_id": 45,
        "donor_id": 1,
        "donor_name": "John Doe",
        "donor_email": "john@example.com",
        "donor_phone": "+1234567890",
        "country": "USA",
        "city": "New York",
        "program": "Education",
        "donation_plan": "one-time",
        "amount": 100.00,
        "payment_method": "credit_card",
        "payment_details": {
            "card_last_four": "4242",
            "authorization_code": "AUTH123"
        },
        "status": "completed",
        "transaction_id": "TXN123456",
        "donation_date": "2026-05-05 10:30:00",
        "updated_at": "2026-05-05 10:30:00"
    }
}
```

### 4. Update Donation
**Endpoint:** `POST /api/donations/update.php`

**Parameters:**
- `donation_id` (int, required) - Donation ID
- `status` (string, optional) - New status
- `transaction_id` (string, optional) - Transaction ID
- `payment_details` (JSON, optional) - Updated payment details

**Valid Status Values:**
- `pending` - Initial state
- `processing` - Payment processing
- `completed` - Successfully completed
- `failed` - Payment failed
- `cancelled` - Donation cancelled

**Example Request:**
```javascript
const result = await donationManager.updateDonation(45, {
    status: 'completed',
    transaction_id: 'TXN123456'
});
```

**Response:**
```json
{
    "success": true,
    "message": "Donation updated successfully",
    "donation_id": 45
}
```

### 5. Delete Donation
**Endpoint:** `POST /api/donations/delete.php`

**Parameters:**
- `donation_id` (int, required) - Donation ID

**Example Request:**
```javascript
const result = await donationManager.deleteDonation(45);
```

**Response:**
```json
{
    "success": true,
    "message": "Donation deleted successfully",
    "donation_id": 45
}
```

### 6. Get Statistics
**Endpoint:** `GET /api/donations/stats.php`

**Query Parameters:**
- `donor_id` (int, optional) - Filter statistics by donor
- `program` (string, optional) - Filter statistics by program

**Example Request:**
```javascript
const result = await donationManager.getStatistics({
    program: 'Education'
});
```

**Response:**
```json
{
    "success": true,
    "summary": {
        "total_donations": 150,
        "completed_donations": 120,
        "pending_donations": 25,
        "failed_donations": 5,
        "total_amount": 15000.50,
        "completed_amount": 12500.00,
        "average_amount": 100.00,
        "max_amount": 5000.00,
        "min_amount": 10.00
    },
    "by_program": [
        {
            "program": "Education",
            "count": 50,
            "total": 5000.00,
            "completed_total": 4500.00
        }
    ],
    "by_status": [
        {
            "status": "completed",
            "count": 120,
            "total": 12500.00
        }
    ]
}
```

## Usage Examples

### In HTML Forms
```html
<form id="donationForm">
    <input type="hidden" id="donor_id" value="1">
    <select id="program" required>
        <option value="">Select Program</option>
        <option value="Education">Education</option>
        <option value="Healthcare">Healthcare</option>
    </select>
    
    <select id="donation_plan" required>
        <option value="one-time">One-time</option>
        <option value="monthly">Monthly</option>
    </select>
    
    <input type="number" id="amount" placeholder="Amount" step="0.01" required>
    
    <select id="payment_method" required>
        <option value="">Select Payment Method</option>
        <option value="credit_card">Credit Card</option>
        <option value="paypal">PayPal</option>
        <option value="mobile">Mobile Payment</option>
    </select>
    
    <button type="submit">Donate</button>
</form>
```

### Display Donations Table
```html
<div id="donationsContainer"></div>

<script>
// Load donations on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDonationsTable('donationsContainer', {
        limit: 50
    });
});
</script>
```

### Admin Dashboard Statistics
```javascript
// Get stats for dashboard
const stats = await donationManager.getStatistics();

// Update UI with stats
document.getElementById('totalDonations').textContent = stats.summary.total_donations;
document.getElementById('totalAmount').textContent = stats.summary.total_amount;
document.getElementById('completedAmount').textContent = stats.summary.completed_amount;
```

## Database Schema

The donations are stored in the `donations` table with the following structure:

```sql
CREATE TABLE donations (
    donation_id INT PRIMARY KEY AUTO_INCREMENT,
    donor_id INT NOT NULL,
    program VARCHAR(100) NOT NULL,
    donation_plan VARCHAR(20) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_details JSON,
    status VARCHAR(20) DEFAULT 'pending',
    transaction_id VARCHAR(100),
    donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES donors(donor_id) ON DELETE CASCADE
);
```

## Configuration

Update the database credentials in `config/db.php`:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'ngo_project');
```

## File Structure

```
project-root/
├── api/
│   └── donations/
│       ├── create.php      # Create new donation
│       ├── list.php        # List all donations with filters
│       ├── get.php         # Get single donation
│       ├── update.php      # Update donation
│       ├── delete.php      # Delete donation
│       └── stats.php       # Get statistics
├── config/
│   └── db.php              # Database configuration
├── includes/
│   └── session.php         # Session management
└── Users-panel/
    └── donation-handler.js # JavaScript client library
```

## Error Handling

All endpoints return JSON responses. Check the `success` field to determine if the request was successful:

```javascript
const result = await donationManager.createDonation(data);
if (result.success) {
    // Handle success
    console.log(result.data);
} else {
    // Handle error
    console.error(result.message);
}
```

## Security Notes

1. All inputs are validated server-side
2. Passwords use bcrypt hashing
3. SQL prepared statements prevent SQL injection
4. Implement session validation for sensitive operations
5. Use HTTPS in production
6. Validate payment details before processing
