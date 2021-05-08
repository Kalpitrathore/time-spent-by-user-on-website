# How to get time spent by users on a webpage using Node.js?

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1u00tt9x8gymt3uygo5r.png)

## Introduction
As the internet users increasing exponentially, It is very important for enterprises to know how a user interacts with their website so that they can improve user experience accordingly.

In this article, We will be going to talk about how to get time spent by users on a webpage using simple Javascript and Node.js. At first, We will try to understand the concept or working behind it then will implement it using code. 

## Working
Before deep dive into the code, Let's try to understand the working behind it with the help of the below flow chart.
![Alt Text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ngube2wayp2xty8asfpj.png)

## Implementation
Let's get some hands dirty on code.

1) Create a project folder.
```
mkdir time-spent-by-user && cd time-spent-by-user
```

2) Initialize npm in the folder.
```
npm init -y
```

3) Install the required dependencies.
```
npm install --save express
npm install --save ejs
```

4) Create an "app.js" file & write some code in it.
```
//app.js
const express = require('express');
const ejs = require('ejs');
const bodyParser= require('body-parser');
const app = express()
const port = 80

app.set('view engine', 'ejs');
app.use(bodyParser.json());

var analytics = {};

// It will render home page
app.get('/', (req, res) => {    
    res.render('index');
})
// ------------------------

// It will render dashboard page
app.get('/dashboard', (req, res) => {
    res.render('dashboard', {"analytics": analytics});
})
// ------------------------

// It will catch the data sent from "sendBeacon" method on home page
app.post('/updatetimespentonpage', bodyParser.text(), function(req,res){  
    var body = JSON.parse(req.body)    
    analytics[body["uid"]] = (analytics[body["uid"]]) ? (analytics[body["uid"]] + body["timeSpentOnPage"]) : (body["timeSpentOnPage"]);
    res.send({"status": "done"});
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
```

5) Create a "views" folder.
```
mkdir views && cd views
```

6) Create an "index.ejs" file in the views folder & write some code in it.
```
<!--index.ejs-->
<html>
   <head>
      <title>Home page</title>
   </head>
   <body>
      User Id: <span id="uid"></span> </br>
      Time spent on this page: <span id="time-spent">0s</span>
   </body>
   <script type="text/javascript">
    
    // Check if uid already exist in cookie.     
    if (!getCookie("uid")) {

        // if not, then create a new uid and store it in cookie.
        document.cookie = "uid=U" + (Date.now().toString(36)).toUpperCase() + "; expires=Thu, 18 Dec 2030 12:00:00 UTC; path=/";
    }
    // -------------------------------------------

    document.getElementById('uid').innerHTML = getCookie("uid");
    

    // This setInterval function increment the value of "timeSpent" variable each second.
    var timeSpent = 0;
    var timeSpentInterval = setInterval(
        function() {
            timeSpent++;
            document.getElementById('time-spent').innerHTML = timeSpent + "s";
        }, 1000);
    // ---------------------------------------------

    // The beforeunload event triggers right before unloading of the window has begun
    window.addEventListener("beforeunload", function() {

        // When user close or refresh the web page, sendBeacon method asynchronously sends a small amount of data over HTTP to a web server.
        navigator.sendBeacon('http://localhost/updatetimespentonpage', JSON.stringify({
            uid: getCookie("uid"),
            timeSpentOnPage: timeSpent
        }))
    });
    // ---------------------------------------------

    // Method used to get cookie
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    // -----------------------------------
   </script>
</html>
```

7) Create "dashboard.ejs" file & write some code in it.
```
<!--dashboard.ejs-->
<html>
    <head>
        <title>Dashboard</title>
        <style type="text/css">
            table, th, td {
                border: 1px solid black;
                border-collapse: collapse;
                padding: 10px;
            }
        </style>
    </head>
    <body>
        <h2>Dashboard</h2>
        <table>
            <tr>                
                <th>User Id</th>
                <th>Time Spent</th>
            </tr>            
                <%  
                    var total_time_spent = 0                    
                    for(i in analytics)
                    {
                        %>
                        <tr>
                            <td><%= i %></td>
                            <td><%= analytics[i] %>s</td>
                        </tr>
                        <%
                            total_time_spent = total_time_spent + analytics[i];
                    }
                %>
                <tr>
                    <%
                        if(Object.keys(analytics).length>0){
                    %>
                        <th>Total Users: <%= Object.keys(analytics).length %></th>
                        <th>Avg Time Spent: <%= (total_time_spent/Object.keys(analytics).length).toFixed(2) %>s</th>
                    <%
                        }
                        else{
                    %>
                        <td>NA</td>
                        <td>NA</td>
                    <%
                        }
                    %>
                </tr>            
        </table>
    </body>
</html>
```

8) Execute the "app.js" file.
```
//if you are inside the views folder
cd ..
node app.js
```

9) Open a browser & point to [http://localhost](http://localhost), It will show you "UID" & time spent by you on the webpage.
![Alt Text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0rdc23tkos0hei6wnbeb.png)

10) Now, Close the browser tab & point to [http://localhost/dashboard](http://localhost/dashboard)
![Alt Text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w3dz9w5uzblnuo1f4uak.png)

11) Here you can see the list of all the users with their corresponding time spent on the page.

## Conclusion
When the user closes or refreshes the home page, It fires the "beforeunload" event & lets the "sendBeacon" method send the time spent data to the server asynchronously. The server catches the data & store it in a variable (You can use a traditional database as well).

sendBeacon is intended to be used for sending analytics data to a web server, & avoids some of the problems with legacy techniques for sending analytics, Such as the use of XMLHttpRequest, [Read more here](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)

Check out the [github](https://github.com/Kalpitrathore/time-spent-by-user-on-website) code if you'd like to get sample implementation.

For more updates, follow me on [Twitter](https://twitter.com/kalpitrathore).
