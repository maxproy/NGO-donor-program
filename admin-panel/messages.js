// Load and display messages
function renderMessages() {
  const messages = getMessages();
  const table = document.getElementById("messageTable");

  table.innerHTML = "";

  if (messages.length === 0) {
    table.innerHTML = "<tr><td colspan='5' style='text-align: center; padding: 20px;'>No messages yet</td></tr>";
    return;
  }

  messages.forEach((message, index) => {
    const date = new Date(message.date).toLocaleDateString();
    table.innerHTML += `
      <tr>
        <td>${message.senderName}</td>
        <td>${message.senderEmail}</td>
        <td>${message.subject}</td>
        <td>${date}</td>
        <td>
          <button class="action-btn edit-btn" onclick="viewMessage(${index})">View</button>
          <button class="action-btn delete-btn" onclick="deleteMessage(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// Handle form submission
document.getElementById("messageForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const newMessage = {
    senderName: document.getElementById("senderName").value,
    senderEmail: document.getElementById("senderEmail").value,
    subject: document.getElementById("messageSubject").value,
    body: document.getElementById("messageBody").value,
    date: new Date().toISOString()
  };

  const messages = getMessages();
  messages.push(newMessage);
  saveMessages(messages);

  alert("Message sent successfully!");
  this.reset();
  renderMessages();
});

// View message details
function viewMessage(index) {
  const messages = getMessages();
  const message = messages[index];
  alert(`From: ${message.senderName}\nEmail: ${message.senderEmail}\nSubject: ${message.subject}\n\nMessage:\n${message.body}`);
}

// Delete message
function deleteMessage(index) {
  if (confirm("Are you sure you want to delete this message?")) {
    let messages = getMessages();
    messages.splice(index, 1);
    saveMessages(messages);
    renderMessages();
  }
}

// Initial render
renderMessages();
