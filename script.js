document.getElementById('log-access').addEventListener('click', function() {
    const studentId = document.getElementById('student-id').value;
    if (studentId) {
        fetch('http://localhost:3000/log-access', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ student_id: studentId }),
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                document.getElementById('student-id').value = ''; // Clear input
            })
            .catch(error => console.error('Error:', error));
    } else {
        alert('Please enter a Student ID');
    }
});

// Admin login
document.getElementById('admin-login').addEventListener('click', function() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    fetch('http://localhost:3000/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => {
            if (!response.ok) throw new Error('Invalid credentials');
            return response.json();
        })
        .then(data => {
            alert(data.message);
            document.getElementById('admin-form').style.display = 'none';
            document.getElementById('admin-controls').style.display = 'block'; // Show admin controls
            document.getElementById('search-form').style.display = 'block'; // Show search form for admin
        })
        .catch(error => {
            alert(error.message);
            console.error('Error:', error);
        });
});


// Add User
document.getElementById('add-user').addEventListener('click', function() {
    const studentId = document.getElementById('new-user-id').value;
    const userType = document.getElementById('new-user-type').value;

    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: studentId, user_type: userType }),
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            document.getElementById('new-user-id').value = ''; // Clear input
            document.getElementById('new-user-type').value = ''; // Clear input
        })
        .catch(error => console.error('Error:', error));
});

// Manage User
document.getElementById('manage-user-button').addEventListener('click', function() {
    const userId = document.getElementById('manage-user-id').value;
    const action = document.getElementById('manage-action').value;

    fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            document.getElementById('manage-user-id').value = ''; // Clear input
        })
        .catch(error => console.error('Error:', error));
});

// Search Access Records
document.getElementById('search-access').addEventListener('click', function() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const studentId = document.getElementById('search-id').value;

    fetch(`http://localhost:3000/search-access?startDate=${startDate}&endDate=${endDate}&studentId=${studentId}`)
        .then(response => response.json())
        .then(rows => displaySearchResults(rows))
        .catch(error => console.error('Error:', error));
});

function displaySearchResults(rows) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results
    if (rows.length > 0) {
        rows.forEach(row => {
            const div = document.createElement('div');
            div.textContent = `ID: ${row.student_id}, Timestamp: ${row.timestamp}, Type: ${row.user_type}, Status: ${row.status}`;
            resultsDiv.appendChild(div);
        });
    } else {
        resultsDiv.textContent = 'No records found.';
    }
}

function displaySearchResults(rows) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results
    if (rows.length > 0) {
        rows.forEach(row => {
            const div = document.createElement('div');
            div.textContent = `ID: ${row.student_id}, Timestamp: ${row.timestamp}`;
            resultsDiv.appendChild(div);
        });
    } else {
        resultsDiv.textContent = 'No records found.';
    }
}