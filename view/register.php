
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Koios-Register</title>
    <!-- Font Awesome CDN link  -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css">

    <!--JQuery libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
</head>
<body>
  
    <header>
    <img src="../images/koios.png" alt="Logo" class="logo">
    </header>

    <div class="form">
        <!--form end -->
        <!--sign in -->
        <form autocomplete="off" class="sign-up" action="../actions/customer_action.php" method="post" enctype="multipart/form-data">
            <i class="fa-solid fa-user-plus"></i>
            <input class="user-input" type="text" name="fullName" id="fullName" placeholder="Full Name">
            <input class="user-input" type="email" name="email"  id="email" placeholder="Email">
            <input class="user-input" type="text" name="role" id="role" placeholder="Role">
            <input class="user-input" type="password" name="password" id="password" placeholder="Password">
            <input class="user-input" type="text" name="phone" id="phone" placeholder="Phone">
            <button class="button" type="submit">Register</button>

            <div class="options-2">
                <p>Already Registered? <a href="login.php">Sign In</a></p>

            </div>
        </form>
    </div>

</body>
</html>