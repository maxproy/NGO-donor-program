document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Auto-select the "Course" based on URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const courseParam = urlParams.get('course');
    
    if (courseParam) {
        const courseSelect = document.getElementById('COURSE');
        if (courseSelect) {
            courseSelect.value = courseParam;
        }
    }

    // 2. Handle Donation Plan Toggle (One-time vs Monthly)
    const typeBtns = document.querySelectorAll('.type-btn');
    const planInput = document.getElementById('donation_plan');

    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            planInput.value = btn.getAttribute('data-type');
        });
    });

    // 3. Handle Amount Selection Grid
    const amountBtns = document.querySelectorAll('.amount-btn');
    const amountInput = document.getElementById('amount');
    const otherAmountInput = document.getElementById('other_amount');

    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const selectedAmount = btn.getAttribute('data-amount');
            amountInput.value = selectedAmount;

            if (selectedAmount === 'other') {
                otherAmountInput.style.display = 'block';
                otherAmountInput.setAttribute('required', 'true');
                otherAmountInput.focus(); 
            } else {
                otherAmountInput.style.display = 'none';
                otherAmountInput.removeAttribute('required');
                otherAmountInput.value = ''; 
            }
        });
    });

    // 4. Handle Payment Method Toggle & Required Attributes
    const payBtns = document.querySelectorAll('.pay-btn');
    const paymentInput = document.getElementById('payment_method');
    const standardSubmitBtn = document.getElementById('standard-submit-btn');
    
    const ccFields = document.getElementById('credit_card_fields');
    const ppFields = document.getElementById('paypal_fields');
    const mmFields = document.getElementById('mobile_fields');

    const ccInputs = document.querySelectorAll('.cc-input');
    const mmInputs = document.querySelectorAll('.mm-input');

    function toggleRequired(inputs, isRequired) {
        inputs.forEach(input => {
            if (isRequired) {
                input.setAttribute('required', 'true');
            } else {
                input.removeAttribute('required');
            }
        });
    }

    payBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            payBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const method = btn.getAttribute('data-method');
            paymentInput.value = method;

            ccFields.style.display = 'none';
            ppFields.style.display = 'none';
            mmFields.style.display = 'none';
            
            toggleRequired(ccInputs, false);
            toggleRequired(mmInputs, false);

            if (method === 'credit_card') {
                ccFields.style.display = 'block';
                toggleRequired(ccInputs, true);
                standardSubmitBtn.style.display = 'block';
            } else if (method === 'paypal') {
                ppFields.style.display = 'block';
                standardSubmitBtn.style.display = 'none'; // Hide standard button for PayPal
            } else if (method === 'mobile') {
                mmFields.style.display = 'block';
                toggleRequired(mmInputs, true);
                standardSubmitBtn.style.display = 'block';
            }
        });
    });

    // 4.5 Handle Standard Form Submission (Credit Card / Mobile)
    const donationForm = document.querySelector('form');
    if (donationForm) {
        donationForm.addEventListener('submit', async (e) => {
            // Allow PayPal button to handle its own flow without standard submission
            if (paymentInput.value === 'paypal') {
                e.preventDefault();
                return;
            }
            
            e.preventDefault();
            const formData = new FormData(donationForm);
            
            let finalAmount = amountInput.value === 'other' ? otherAmountInput.value : amountInput.value;
            formData.set('amount', finalAmount);
            
            const programInput = document.getElementById('COURSE');
            if (programInput && !formData.get('program')) {
                formData.set('program', programInput.value);
            }

            try {
                const response = await fetch('../api/donations/create.php', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                
                if (result.success) {
                    const method = formData.get('payment_method');
                    const program = formData.get('program');
                    window.location.href = `thank-you.html?amount=${finalAmount}&program=${encodeURIComponent(program)}&method=${encodeURIComponent(method)}&id=${result.donation_id}`;
                } else {
                    alert("Error processing donation: " + result.message);
                }
            } catch (error) {
                console.error("Error saving to database:", error);
                alert("An error occurred while communicating with our server.");
            }
        });
    }

    // 5. PayPal SDK Integration Logic
    if (typeof paypal !== 'undefined') {
        paypal.Buttons({
            createOrder: (data, actions) => {
                let finalAmount = amountInput.value;
                if (finalAmount === 'other') {
                    finalAmount = otherAmountInput.value;
                }

                if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
                    alert("Please select or enter a valid donation amount first.");
                    return actions.reject(); 
                }

                return actions.order.create({
                    purchase_units: [{
                        amount: { value: finalAmount },
                        description: "Donation to NGO Impact - " + document.getElementById('COURSE').value
                    }]
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then(async function(orderData) {
                    console.log('Capture result', orderData);
                    
                    // 1. Gather the donation form data
                    const formData = new FormData();
                    const donorIdInput = document.getElementById('donor_id');
                    if (donorIdInput && donorIdInput.value) {
                        formData.append('donor_id', donorIdInput.value);
                    }
                    
                    const programInput = document.getElementById('COURSE');
                    formData.append('program', programInput ? programInput.value : 'General');
                    
                    const planInput = document.getElementById('donation_plan');
                    formData.append('donation_plan', planInput ? planInput.value : 'one-time');
                    
                    formData.append('amount', orderData.purchase_units[0].amount.value);
                    formData.append('payment_method', 'paypal');
                    formData.append('transaction_id', orderData.id);
                    formData.append('payment_details', JSON.stringify(orderData));

                    // 2. Send the transaction data to your PHP backend
                    try {
                        const response = await fetch('../api/donations/create.php', {
                            method: 'POST',
                            body: formData
                        });
                        const result = await response.json();
                        
                        if (result.success) {
                            // Redirect to the thank you page with receipt details
                            const finalAmount = orderData.purchase_units[0].amount.value;
                            const program = programInput ? programInput.value : 'General';
                            window.location.href = `thank-you.html?amount=${finalAmount}&program=${encodeURIComponent(program)}&method=paypal&id=${result.donation_id}&tx=${orderData.id}`;
                        } else {
                            alert("Payment successful, but failed to save record: " + result.message);
                        }
                    } catch (error) {
                        console.error("Error saving to database:", error);
                        alert("Payment successful, but there was an error communicating with our server.");
                    }
                });
            },
            onError: (err) => {
                console.error('PayPal Checkout onError', err);
                alert("There was an error processing your PayPal payment. Please try again.");
            }
        }).render('#paypal-button-container');
    }
});