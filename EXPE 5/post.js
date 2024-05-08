var http = require('http');
var querystring = require('querystring');

function onRequest(req, res) {
    let body = '';
    req.on('data', function(chunk) {
        body += chunk;
    });

    req.on('end', function() {
        var qs = querystring.parse(body);
        var name = qs["name"];
        var id = qs["id"];
        var gender = qs["gender"];
        var branch = qs["branch"];
        var mobileno = qs["mobileno"];
        var address = qs["address"];

        var htmlResponse = `
            <html>
            <head>
                <title>Employee Details</title>
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
                        background-color: #f2f2f2;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                </style>
            </head>
            <body>
                <h1 style="text-align: center;">Employee Details</h1>
                <table>
                    <tr>
                        <th>Name</th>
                        <th>ID</th>
                        <th>Gender</th>
                        <th>Branch</th>
                        <th>Mobile No</th>
                        <th>Address</th>
                    </tr>
                    <tr>
                        <td>${name}</td>
                        <td>${id}</td>
                        <td>${gender}</td>
                        <td>${branch}</td>
                        <td>${mobileno}</td>
                        <td>${address}</td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(htmlResponse);
        res.end();
    });
}

http.createServer(onRequest).listen(9000);
console.log('Server is running on port 9000...');