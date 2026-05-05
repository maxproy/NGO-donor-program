/**
 * Donation Management JavaScript
 * Handles AJAX calls to donation PHP APIs
 */

class DonationManager {
    constructor(apiBasePath = '../api/donations/') {
        this.apiBasePath = apiBasePath;
    }

    /**
     * Create a new donation
     */
    async createDonation(donationData) {
        try {
            const formData = new FormData();
            Object.keys(donationData).forEach(key => {
                if (typeof donationData[key] === 'object') {
                    formData.append(key, JSON.stringify(donationData[key]));
                } else {
                    formData.append(key, donationData[key]);
                }
            });

            const response = await fetch(this.apiBasePath + 'create.php', {
                method: 'POST',
                body: formData
            });

            return await response.json();
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    /**
     * Get all donations with optional filters
     */
    async getDonations(filters = {}) {
        try {
            const queryString = new URLSearchParams(filters).toString();
            const response = await fetch(this.apiBasePath + 'list.php?' + queryString);
            return await response.json();
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    /**
     * Get a single donation by ID
     */
    async getDonation(donationId) {
        try {
            const response = await fetch(this.apiBasePath + 'get.php?donation_id=' + donationId);
            return await response.json();
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    /**
     * Update donation status or details
     */
    async updateDonation(donationId, updateData) {
        try {
            const formData = new FormData();
            formData.append('donation_id', donationId);
            Object.keys(updateData).forEach(key => {
                if (typeof updateData[key] === 'object') {
                    formData.append(key, JSON.stringify(updateData[key]));
                } else {
                    formData.append(key, updateData[key]);
                }
            });

            const response = await fetch(this.apiBasePath + 'update.php', {
                method: 'POST',
                body: formData
            });

            return await response.json();
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    /**
     * Delete a donation
     */
    async deleteDonation(donationId) {
        try {
            const formData = new FormData();
            formData.append('donation_id', donationId);

            const response = await fetch(this.apiBasePath + 'delete.php', {
                method: 'POST',
                body: formData
            });

            return await response.json();
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    /**
     * Get donation statistics
     */
    async getStatistics(filters = {}) {
        try {
            const queryString = new URLSearchParams(filters).toString();
            const response = await fetch(this.apiBasePath + 'stats.php?' + queryString);
            return await response.json();
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    /**
     * Format donation data for display
     */
    formatDonation(donation) {
        return {
            ...donation,
            formattedAmount: '$' + parseFloat(donation.amount).toFixed(2),
            formattedDate: new Date(donation.donation_date).toLocaleDateString(),
            statusBadge: this.getStatusBadge(donation.status)
        };
    }

    /**
     * Get status badge color/class
     */
    getStatusBadge(status) {
        const badges = {
            'completed': { class: 'badge-success', label: 'Completed' },
            'pending': { class: 'badge-warning', label: 'Pending' },
            'failed': { class: 'badge-danger', label: 'Failed' },
            'cancelled': { class: 'badge-secondary', label: 'Cancelled' },
            'processing': { class: 'badge-info', label: 'Processing' }
        };
        return badges[status] || { class: 'badge-secondary', label: status };
    }
}

// Initialize donation manager
const donationManager = new DonationManager();

// Example usage in donation form
document.addEventListener('DOMContentLoaded', () => {
    const donationForm = document.getElementById('donationForm');
    
    if (donationForm) {
        donationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const donationData = {
                donor_id: document.getElementById('donor_id')?.value || '',
                program: document.getElementById('program')?.value || document.getElementById('COURSE')?.value || '',
                donation_plan: document.getElementById('donation_plan')?.value || 'one-time',
                amount: document.getElementById('other_amount')?.value || document.getElementById('amount')?.value || 0,
                payment_method: document.getElementById('payment_method')?.value || '',
                transaction_id: document.getElementById('transaction_id')?.value || ''
            };

            const result = await donationManager.createDonation(donationData);

            if (result.success) {
                alert('Donation created successfully!');
                donationForm.reset();
                // Redirect or refresh as needed
            } else {
                alert('Error: ' + result.message);
            }
        });
    }
});

/**
 * Load and display donations table
 */
async function loadDonationsTable(containerId, filters = {}) {
    const result = await donationManager.getDonations(filters);

    if (!result.success) {
        document.getElementById(containerId).innerHTML = '<p>Error loading donations: ' + result.message + '</p>';
        return;
    }

    let html = '<table class="donations-table"><thead><tr>';
    html += '<th>ID</th><th>Donor</th><th>Program</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th>';
    html += '</tr></thead><tbody>';

    result.data.forEach(donation => {
        const formatted = donationManager.formatDonation(donation);
        html += `<tr>
                    <td>${donation.donation_id}</td>
                    <td>${donation.donor_name || 'N/A'}</td>
                    <td>${donation.program}</td>
                    <td>${formatted.formattedAmount}</td>
                    <td><span class="badge ${formatted.statusBadge.class}">${formatted.statusBadge.label}</span></td>
                    <td>${formatted.formattedDate}</td>
                    <td>
                        <button onclick="viewDonation(${donation.donation_id})">View</button>
                        <button onclick="deleteDonation(${donation.donation_id})">Delete</button>
                    </td>
                </tr>`;
    });

    html += '</tbody></table>';
    html += `<p>Total: ${result.pagination.total} donations</p>`;

    document.getElementById(containerId).innerHTML = html;
}

/**
 * View donation details
 */
async function viewDonation(donationId) {
    const result = await donationManager.getDonation(donationId);
    if (result.success) {
        alert(JSON.stringify(result.data, null, 2));
    } else {
        alert('Error: ' + result.message);
    }
}

/**
 * Delete donation with confirmation
 */
async function deleteDonation(donationId) {
    if (confirm('Are you sure you want to delete this donation?')) {
        const result = await donationManager.deleteDonation(donationId);
        if (result.success) {
            alert('Donation deleted successfully!');
            location.reload();
        } else {
            alert('Error: ' + result.message);
        }
    }
}
