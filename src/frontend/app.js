document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');
    const responseMessage = document.getElementById('responseMessage');

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission

        // Collect form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            date: document.getElementById('date').value,
            time: document.getElementById('time').value
        };

        try {
            // Send the data to the server using Fetch API
            const response = await fetch('/api/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                responseMessage.style.color = 'green';
                responseMessage.textContent = 'Booking successful!';
                bookingForm.reset(); // Reset the form fields
            } else {
                responseMessage.style.color = 'red';
                responseMessage.textContent = `Error: ${result.message}`;
            }
        } catch (error) {
            responseMessage.style.color = 'red';
            responseMessage.textContent = 'An unexpected error occurred.';
            console.error('Error:', error);
        }
    });
});
