const express = require('express');
const mysql = require('mysql2'); // Use mysql2 for promises
const bcrypt = require('bcryptjs'); // For password hashing
const path = require('path'); // To serve static files

const app = express();
const port = 3000; // You can choose any available port

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (your HTML, CSS, and client-side JS)
app.use(express.static(path.join(__dirname, 'public'))); // Create a 'public' folder for your frontend files

// Database connection configuration
const db = mysql.createConnection({
    host: 'TABLET-H5LHTM4Q',      // Your MySQL server host (from Workbench)
    user: 'root',           // Your MySQL username (from Workbench)
    password: '12345',           // Your MySQL password (leave empty if XAMPP default)
    database: 'Yumlogy',    // The database you created
    port: 3306              // MySQL default port, common for XAMPP
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to MySQL database as ID ' + db.threadId);
});

// Define the root route to serve your login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html')); // Assuming index.html is in 'public'
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Please enter both username and password.' });
    }

    try {
        // Query the database to find the user
        const [rows] = await db.promise().execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            // User not found
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const user = rows[0];

        // Compare the provided password with the hashed password from the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Passwords match - login successful
            // In a real application, you'd typically set up a session or JWT here.
            console.log(`User ${username} logged in successfully.`);
            return res.status(200).json({ message: 'Login successful!', redirectUrl: '/dashboard' }); // You can redirect to a dashboard page
        } else {
            // Passwords don't match
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error during login.' });
    }
});

// Example dashboard route (for successful login redirection)
app.get('/dashboard', (req, res) => {
    res.send('<h1>Welcome to your Dashboard!</h1><p>You have successfully logged in.</p><a href="/">Logout</a>');
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});