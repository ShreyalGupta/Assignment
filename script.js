
    let token = '';

    // Function to make API calls
    async function makeApiCall(url, method, headers, body) {
    try {
    const response = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(body),
});

    if (response.status === 401) {
    throw new Error('Invalid Authorization');
}

    if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'API Error');
}

    return await response.json();
} catch (error) {
    throw error;
}
}

    // Function to authenticate the user
    async function authenticateUser() {
    const login_id = document.getElementById('login_id').value;
    const password = document.getElementById('password').value;

    try {
    const authResponse = await makeApiCall('https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp', 'POST', {
    'Content-Type': 'application/json',
}, {
    login_id,
    password,
});

    token = authResponse.token;

    // Show the customer list screen after successful authentication
    showCustomerList();
} catch (error) {
    document.getElementById('login-error').textContent = error.message;
}
}

    // Function to get the customer list
    async function getCustomerList() {
    try {
    const customerListResponse = await makeApiCall('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list', 'GET', {
    'Authorization': `Bearer ${token}`,
});

    const customerList = document.getElementById('customer-list');
    customerList.innerHTML = '';

    customerListResponse.forEach(customer => {
    const row = document.createElement('tr');
    row.innerHTML = `
                        <td>${customer.first_name}</td>
                        <td>${customer.last_name}</td>
                        <td>${customer.email}</td>
                        <td>${customer.phone}</td>
                        <td>
                            <button onclick="deleteCustomer('${customer.uuid}')">Delete</button>
                            <button onclick="showUpdateCustomerScreen('${customer.uuid}', '${customer.first_name}', '${customer.last_name}', '${customer.email}', '${customer.phone}')">Update</button>
                        </td>
                    `;
    customerList.appendChild(row);
});
} catch (error) {
    // Handle errors
}
}

    // Function to add a new customer
    async function addCustomer() {
    const new_first_name = document.getElementById('new_first_name').value;
    const new_last_name = document.getElementById('new_last_name').value;
    const new_email = document.getElementById('new_email').value;
    const new_phone = document.getElementById('new_phone').value;

    try {
    await makeApiCall('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp', 'POST', {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
}, {
    cmd: 'create',
    first_name: new_first_name,
    last_name: new_last_name,
    email: new_email,
    phone: new_phone,
});

    // Clear the input fields and show the customer list screen
    document.getElementById('new_first_name').value = '';
    document.getElementById('new_last_name').value = '';
    document.getElementById('new_email').value = '';
    document.getElementById('new_phone').value = '';
    document.getElementById('add-customer-error').textContent = '';

    showCustomerList();
} catch (error) {
    document.getElementById('add-customer-error').textContent = error.message;
}
}

    // Function to delete a customer
    async function deleteCustomer(uuid) {
    try {
    await makeApiCall('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp', 'POST', {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
}, {
    cmd: 'delete',
    uuid,
});

    // Refresh the customer list after successful deletion
    getCustomerList();
} catch (error) {
    // Handle errors
}
}

    // Function to switch to the customer list screen
    function showCustomerList() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('customer-list-screen').style.display = 'block';
    document.getElementById('add-customer-screen').style.display = 'none';
    document.getElementById('update-customer-screen').style.display = 'none';
    getCustomerList();
}

    // Function to switch to the add customer screen
    function showAddCustomerScreen() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('customer-list-screen').style.display = 'none';
    document.getElementById('add-customer-screen').style.display = 'block';
    document.getElementById('update-customer-screen').style.display = 'none';
}

    // Function to switch to the update customer screen
    function showUpdateCustomerScreen(uuid, first_name, last_name, email, phone) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('customer-list-screen').style.display = 'none';
    document.getElementById('add-customer-screen').style.display = 'none';
    document.getElementById('update-customer-screen').style.display = 'block';

    // Populate the update form fields
    document.getElementById('update_first_name').value = first_name;
    document.getElementById('update_last_name').value = last_name;
    document.getElementById('update_email').value = email;
    document.getElementById('update_phone').value = phone;

    // Set a custom attribute to store the customer's UUID
    document.getElementById('update_customer_uuid').setAttribute('data-uuid', uuid);
}

    // Function to update a customer
    async function updateCustomer() {
    const uuid = document.getElementById('update_customer_uuid').getAttribute('data-uuid');
    const update_first_name = document.getElementById('update_first_name').value;
    const update_last_name = document.getElementById('update_last_name').value;
    const update_email = document.getElementById('update_email').value;
    const update_phone = document.getElementById('update_phone').value;

    try {
    await makeApiCall('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp', 'POST', {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
}, {
    cmd: 'update',
    uuid,
    first_name: update_first_name,
    last_name: update_last_name,
    email: update_email,
    phone: update_phone,
});

    // Clear the input fields and show the customer list screen
    document.getElementById('update_first_name').value = '';
    document.getElementById('update_last_name').value = '';
    document.getElementById('update_email').value = '';
    document.getElementById('update_phone').value = '';
    document.getElementById('update-customer-error').textContent = '';

    showCustomerList();
} catch (error) {
    document.getElementById('update-customer-error').textContent = error.message;
}
}

    // Function to handle logout
    function logout() {
    token = '';
    document.getElementById('login_id').value = '';
    document.getElementById('password').value = '';
    document.getElementById('login-error').textContent = '';
    document.getElementById('new_first_name').value = '';
    document.getElementById('new_last_name').value = '';
    document.getElementById('new_email').value = '';
    document.getElementById('new_phone').value = '';
    document.getElementById('add-customer-error').textContent = '';
    document.getElementById('update_first_name').value = '';
    document.getElementById('update_last_name').value = '';
    document.getElementById('update_email').value = '';
    document.getElementById('update_phone').value = '';
    document.getElementById('update-customer-error').textContent = '';

    document.getElementById('login-screen').style.display = 'block';
    document.getElementById('customer-list-screen').style.display = 'none';
    document.getElementById('add-customer-screen').style.display = 'none';
    document.getElementById('update-customer-screen').style.display = 'none';
}

