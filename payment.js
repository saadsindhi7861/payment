document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const referralCodeInput = document.getElementById('referralCode');
    const payWithReferral = document.getElementById('payWithReferral');
    const payWithoutReferral = document.getElementById('payWithoutReferral');
    const validReferralCodes = ['ALTWEB', 'AZWEB', 'SAHWEB', 'ARYWEB', 'MUNWEB', 'ARMWEB', 'CASTLEWEB', 'CODECRUSH', 'SULWEB',]; // Add your valid referral codes here
    const notificationMessage = document.createElement('div'); // Create a div for notifications
    notificationMessage.style.color = 'red';
    notificationMessage.style.marginTop = '10px';
    notificationMessage.style.fontSize = '14px';

    // Razorpay Integration
    const initiatePayment = (amount, description) => {
        const options = {
            key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay Key
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            name: 'AI & Coding',
            description: description,
            handler: function (response) {
                alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
                // Submit data to server
                const formData = new FormData(document.getElementById('paymentForm'));
                formData.append('paymentId', response.razorpay_payment_id);

                fetch('process_payment.php', {
                    method: 'POST',
                    body: formData
                }).then(response => response.json())
                  .then(data => alert(data.message))
                  .catch(error => console.error('Error:', error));
            },
            prefill: {
                name: document.getElementById('studentName').value,
                email: document.getElementById('email').value
            }
        };
        const rzp = new Razorpay(options);
        rzp.open();
    };

    // Manage Payment Links
    referralCodeInput.addEventListener('input', () => {
        const referralCode = referralCodeInput.value.trim();
        if (validReferralCodes.includes(referralCode)) {
            payWithReferral.disabled = false;
            payWithoutReferral.disabled = true;
            if (notificationMessage.parentNode) {
                notificationMessage.parentNode.removeChild(notificationMessage); // Remove old notification if exists
            }
            alert('Congratulations! Your referral code is valid. You can proceed with the discounted payment.');
        } else {
            payWithReferral.disabled = true;
            payWithoutReferral.disabled = false;
            if (referralCode !== '') {
                notificationMessage.textContent = 'Referral code is invalid. Please try again.';
                // Add the notification to the form
                const formContainer = document.querySelector('.form-container');
                formContainer.appendChild(notificationMessage);
            } else {
                // Remove the notification if the input is empty
                if (notificationMessage.parentNode) {
                    notificationMessage.parentNode.removeChild(notificationMessage);
                }
            }
        }
    });

    // Payment Buttons
    payWithReferral.addEventListener('click', () => {
        const referralCode = referralCodeInput.value.trim();
        if (validReferralCodes.includes(referralCode)) {
            initiatePayment(999, 'Payment with Referral Code'); // Referral discount applied
        } else {
            alert('Invalid referral code. Please try again.');
        }
    });

    payWithoutReferral.addEventListener('click', () => {
        initiatePayment(1299, 'Payment without Referral Code'); // No referral discount
    });
});
