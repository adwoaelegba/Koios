<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Page</title>
    <style>
        body {
            display: flex;
            margin: 0;
            font-family: Arial, sans-serif;
            background: rgb(31, 31, 36);
            color: #333;
        }
        
        header {
            z-index: 999;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 200px;
            transition: 0.5s ease;
        }
        
        .logo {
            width: 100px;
            height: auto;
        }
        
        .sidebar {
            width: 250px;
            height: 100vh;
            background: #222;
            padding: 20px;
            box-sizing: border-box;
            position: fixed;
            left: 0;
            top: 0;
            display: flex;
            flex-direction: column;
            padding-top: 80px;
        }
        
        .sidebar a {
            color: #fff;
            text-decoration: none;
            padding: 10px 0;
            display: block;
        }
        
        .main-content {
            margin-left: 270px;
            padding: 50px;
            flex: 1;
            color: #fff;
        }
        
        .main-content h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .main-content p {
            font-size: 1.2em;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <header>
      <!--  <img src="../images/koios.png" alt="Logo" class="logo">-->
    </header>
    
    <div class="sidebar">
    <img src="../images/koios.png" alt="Logo" class="logo">
        <a href="www_arsenal.html">Arsenal</a>
        <a href="apple.html">Apple</a>
        <a href="bankofamerica.html">Bank of America</a>
        <a href="bloomberg.html">Bloomberg</a>
        <a href="dailymail.html">Daily Mail</a>
        
    </div>
    
    <div class="main-content">
        <h1>Koios Test Environment</h1>
        <p>This is a  test environment for testing the Koios web extension. Click on any of the links to open a privacy agreement to allow the extension to work</p>
    </div>
</body>
</html>
