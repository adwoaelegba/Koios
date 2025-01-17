
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Koios-About</title>
    <!--favicon
    <link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="./favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">-->
    
    <!-- Font Awesome CDN link  -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css">
    <link rel="stylesheet" href="../css/aboutCSS.css">

    <!--JQuery libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
</head>
<body>
  
    <header>
    <img src="../images/koios.png" alt="Logo" class="logo">
    </header>

    <!-- Introduce the tool guide -->
  <div class="section active" id="section1">
    <img src="../images/koiosguide.png" alt="Koios Guide" class="slide-up">
    <h1>Hi, I am Koios!</h1>
    <p>
      The titan of knowledge and your privacy agreement summary guide. I'll help you understand privacy policies effortlessly.
    </p>
  </div>

  <div class="section" id="section2">
  <img src="../images/shake.png" alt="Handshake" class="slide-up">
    <h1>Seamless Web Integration</h1>
    <p>
      I merge seamlessly with the web pages you visit, providing you with summaries side by side with privacy policies.
    </p>
  </div>

  <div class="section" id="section3">
  <img src="../images/understanding.webp" alt="Understanding" class="slide-up">
    <h1>Understand Privacy Agreements in Minutes</h1>
    <p>
      My goal is to make sure you understand privacy agreements by providing you with interactive, easy to understand scenarios. You'll never be confused with me by your side!
    </p>
  </div>

  <script>
    // JavaScript to switch sections automatically
    const sections = document.querySelectorAll(".section");
    let currentIndex = 0;

    function showNextSection() {
      // Hide current section
      sections[currentIndex].classList.remove("active");
      
      // Move to next section
      currentIndex = (currentIndex + 1) % sections.length;
      
      // Show next section
      sections[currentIndex].classList.add("active");
    }

    // Switch sections every 3 minutes (180000 ms)
   // setInterval(showNextSection, 180000);

    // For testing, you can temporarily set this to 5 seconds:
     setInterval(showNextSection, 5000);
  </script>
</body>
</html>