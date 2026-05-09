let messagesList = [];

// Utility function to prevent XSS attacks
function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Load and display messages
async function renderMessages() {
  try {
      const response = await fetch('../api/messages/list.php', { credentials: 'include' });
      const result = await response.json();
      
      const table = document.getElementById("messageTable");
      table.innerHTML = "";

      if (result.success && result.data && result.data.length > 0) {
          messagesList = result.data;
          messagesList.forEach((msg) => {
              const date = new Date(msg.created_at).toLocaleDateString();
              const currentStatus = msg.status || 'unread'; // Safely handle older NULL records
              table.innerHTML += `
                <tr>
                  <td>${escapeHTML(msg.name)}</td>
                  <td>${escapeHTML(msg.email)}</td>
                  <td>${escapeHTML(msg.subject)}</td>
                  <td>${date}</td>
                  <td>
                    <span style="font-weight: bold; color: ${currentStatus === 'unread' ? '#ff9800' : '#1f7a4c'};">
                        ${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button class="action-btn edit-btn" onclick="viewMessage(${msg.message_id})">View</button>
                    ${currentStatus === 'unread' ? `<button class="action-btn edit-btn" onclick="updateMessageStatus(${msg.message_id}, 'read')">Mark Read</button>` : ''}
                    ${currentStatus !== 'replied' ? `<button class="action-btn edit-btn" onclick="updateMessageStatus(${msg.message_id}, 'replied')">Replied</button>` : ''}
                    <button class="action-btn delete-btn" onclick="deleteMessage(${msg.message_id})">Delete</button>
                  </td>
                </tr>
              `;
          });
      } else {
          table.innerHTML = "<tr><td colspan='6' style='text-align: center; padding: 20px;'>No messages yet</td></tr>";
      }
  } catch (error) {
      console.error("Error fetching messages:", error);
      document.getElementById("messageTable").innerHTML = "<tr><td colspan='6' style='text-align: center; color: red;'>Failed to load data</td></tr>";
  }
}

// Handle form submission
document.getElementById("messageForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", document.getElementById("senderName").value);
  formData.append("email", document.getElementById("senderEmail").value);
  formData.append("subject", document.getElementById("messageSubject").value);
  formData.append("message", document.getElementById("messageBody").value);

  try {
      const response = await fetch('../api/messages/create.php', {
          method: 'POST',
          body: formData,
          credentials: 'include'
      });
      const result = await response.json();

      if (result.success) {
          alert("Message saved successfully!");
          this.reset();
          renderMessages();
      } else {
          alert("Error: " + (result.message || "Could not save message."));
      }
  } catch (error) {
      console.error("Error saving message:", error);
      alert("An error occurred while saving the message.");
  }
});

// View message details
function viewMessage(id) {
  const msg = messagesList.find(m => m.message_id == id);
  if (msg) {
      alert(`From: ${msg.name}\nEmail: ${msg.email}\nSubject: ${msg.subject}\nDate: ${new Date(msg.created_at).toLocaleString()}\n\nMessage:\n${msg.message}`);
  }
}

// Update Message Status
async function updateMessageStatus(id, status) {
    try {
        const formData = new FormData();
        formData.append('message_id', id);
        formData.append('status', status);

        const response = await fetch('../api/messages/update.php', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        const result = await response.json();

        if (result.success) {
            renderMessages();
        } else {
            alert("Error updating message: " + (result.message || "Unknown error"));
        }
    } catch (error) {
        console.error("Error updating message:", error);
        alert("An error occurred while updating the message status.");
    }
}

// Delete message
async function deleteMessage(id) {
  if (confirm("Are you sure you want to delete this message?")) {
      try {
          const formData = new FormData();
          formData.append('message_id', id);

          const response = await fetch('../api/messages/delete.php', {
              method: 'POST',
              body: formData,
              credentials: 'include'
          });
          const result = await response.json();

          if (result.success) {
              renderMessages();
          } else {
              alert("Error deleting message: " + (result.message || "Unknown error"));
          }
      } catch (error) {
          console.error("Error deleting message:", error);
          alert("An error occurred while deleting the message.");
      }
  }
}

// Initial render
document.addEventListener('DOMContentLoaded', renderMessages);
