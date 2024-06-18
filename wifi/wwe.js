const http = require('http');
const url = require('url');
const querystring = require('querystring');
const { MongoClient } = require('mongodb');

// MongoDB connection URI including the database name
const uri = 'mongodb://localhost:27017/wifi';
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectDB();

async function onRequest(req, res) {
    const path = url.parse(req.url).pathname;
    console.log('Request for ' + path + ' received');

    const query = url.parse(req.url).query;
    const params = querystring.parse(query);

    if (req.url.includes("/insert")) {
        await insertData(req, res, params);
    } else if (req.url.includes("/delete")) {
        await deleteData(req, res, params.email);
    } else if (req.url.includes("/update")) {
        await updateData(req, res, params);
    } else if (req.url.includes("/display")) {
        await displayTable(req, res);
    }
}

async function insertData(req, res, params) {
    try {
        const database = client.db('wifi');
        const collection = database.collection('reg');

        const registration = {
            rollno: params.rollno,
            name: params.name,
            sex: params.sex,
            course: params.course,
            branch: params.branch,
            duration: params.duration,
            roomno: params.roomno,
            email: params.email,
            device: params.device,
            make: params.make,
            model: params.model,
            serialno: params.serialno,
            macaddress: params.macaddress,
            osversion: params.osversion,
            antivirus: params.antivirus
        };

        const result = await collection.insertOne(registration);
        console.log(`${result.insertedCount} document inserted`);

        var htmlResponse = `
            <html>
            <head>
                <title>Wi-Fi Registration Details</title>
                <style>
                    table {
                        width: 80%;
                        margin: auto;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #ccc;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #ff5050;
                        color: white;
                    }
                    td {
                        background-color: #6a6a6a;
                        color: white;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                </style>
            </head>
            <body>
                <h1 style="text-align: center;">Wi-Fi Registration Details</h1>
                <table>
                    <tr>
                        <th>Roll Number</th>
                        <th>Name</th>
                        <th>Sex</th>
                        <th>Course</th>
                        <th>Branch</th>
                        <th>Course Duration</th>
                        <th>Hostel Room No</th>
                        <th>Email</th>
                        <th>Device</th>
                        <th>Make</th>
                        <th>Model</th>
                        <th>Serial No</th>
                        <th>MAC Address</th>
                        <th>OS Version</th>
                        <th>Antivirus</th>
                    </tr>
                    <tr>
                        <td>${params.rollno}</td>
                        <td>${params.name}</td>
                        <td>${params.sex}</td>
                        <td>${params.course}</td>
                        <td>${params.branch}</td>
                        <td>${params.duration}</td>
                        <td>${params.roomno}</td>
                        <td>${params.email}</td>
                        <td>${params.device}</td>
                        <td>${params.make}</td>
                        <td>${params.model}</td>
                        <td>${params.serialno}</td>
                        <td>${params.macaddress}</td>
                        <td>${params.osversion}</td>
                        <td>${params.antivirus}</td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(htmlResponse);
        res.end();
    } catch (error) {
        console.error('Error inserting data:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

async function deleteData(req, res, email) {
    try {
        const database = client.db('wifi');
        const collection = database.collection('reg');

        const filter = { email: email };

        const result = await collection.deleteOne(filter);
        console.log(`${result.deletedCount} document deleted`);

        if (result.deletedCount === 1) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Document deleted successfully');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Document not found');
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

async function updateData(req, res, params) {
    try {
        const database = client.db('wifi');
        const collection = database.collection('reg');

        const filter = { email: params.email };

        const updateDoc = {
            $set: {
                macaddress: params.macaddress
            }
        };

        const result = await collection.updateOne(filter, updateDoc);
        console.log(`${result.modifiedCount} document updated`);

        if (result.modifiedCount === 1) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Registration details updated successfully');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Email not found');
        }
    } catch (error) {
        console.error('Error updating data:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

async function displayTable(req, res) {
    try {
        const database = client.db('wifi');
        const collection = database.collection('reg');

        const cursor = collection.find({});
        const registrations = await cursor.toArray();

        let tableHtml = `
            <html>
                <head>
                    <title>Wi-Fi Registrations</title>
                    <style>
                    table {
                        width: 80%;
                        margin: auto;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #ccc;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #ff5050;
                        color: white;
                    }
                    td {
                        background-color: #6a6a6a;
                        color: white;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    </style>
                </head>
                <body>
                    <h2 style="text-align:center;">Wi-Fi Registrations</h2>
                    <table>
                        <tr>
                            <th>Roll Number</th>
                            <th>Name</th>
                            <th>Sex</th>
                            <th>Course</th>
                            <th>Branch</th>
                            <th>Course Duration</th>
                            <th>Hostel Room No</th>
                            <th>Email</th>
                            <th>Device</th>
                            <th>Make</th>
                            <th>Model</th>
                            <th>Serial No</th>
                            <th>MAC Address</th>
                            <th>OS Version</th>
                            <th>Antivirus</th>
                        </tr>
        `;

        registrations.forEach(registration => {
            tableHtml += `
                <tr>
                    <td>${registration.rollno}</td>
                    <td>${registration.name}</td>
                    <td>${registration.sex}</td>
                    <td>${registration.course}</td>
                    <td>${registration.branch}</td>
                    <td>${registration.duration}</td>
                    <td>${registration.roomno}</td>
                    <td>${registration.email}</td>
                    <td>${registration.device}</td>
                    <td>${registration.make}</td>
                    <td>${registration.model}</td>
                    <td>${registration.serialno}</td>
                    <td>${registration.macaddress}</td>
                    <td>${registration.osversion}</td>
                    <td>${registration.antivirus}</td>
                </tr>
            `;
        });

        tableHtml += `
                    </table>
                </body>
            </html>
        `;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(tableHtml);
        res.end();
    } catch (error) {
        console.error('Error displaying table:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

// Create HTTP server
http.createServer(onRequest).listen(7050);
console.log('Server is running...');
