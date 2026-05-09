const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('contactName').value);
    formData.append('email', document.getElementById('contactEmail').value);
    formData.append('subject', document.getElementById('contactSubject').value);
    formData.append('message', document.getElementById('contactMessage').value);

    try {
      const response = await fetch('../api/messages/create.php', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        alert(result.message || 'Thank you for your message.');
        contactForm.reset();
      } else {
        alert('Error: ' + (result.message || 'Unable to send your message.'));
      }
    } catch (error) {
      console.error('Error sending contact message:', error);
      alert('An error occurred while sending your message. Please try again later.');
    }
  });
}