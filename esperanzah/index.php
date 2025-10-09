<!doctype html>
<html class="no-js" lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Foundation for Sites</title>
      <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="css/foundation.css">
    <link rel="stylesheet" href="css/font-awesome.css">
    <link rel="stylesheet" href="css/quicksand.css">
    <link rel="stylesheet" href="css/app.css">
    <link rel="stylesheet" href="../css/style.css">

      <!-- Global site tag (gtag.js) - Google Analytics -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-58625776-3"></script>
      <script>
          window.dataLayer = window.dataLayer || [];
          function gtag() {
              dataLayer.push(arguments);
          }
          gtag('js', new Date());

          gtag('config', 'UA-58625776-3');
      </script>


  </head>
  <body>
  <div class="row align-center"><div class="column small-6 medium-4 large-4"><img src="images/orig-ami_logo.svg" alt="logo Orig-ami" id="logo"/></div></div>
  <div class="row align-center"><div class="column small-12 medium-12 large-12">
  <img data-interchange="[images/esperanzah-banner-848w.jpg, small], [images/esperanzah-banner-1064w.jpg, medium], [images/esperanzah-banner-1280w.jpg, large]"/>
  <img src="images/esperanzah-banner-1280w.jpg"/>
  </div></div>

  <div class="row align-center">
  <div class= "column small-12 medium-12 large-10">
  <h1>Opération Orig-ami « Give a shelter » <br><span>au festival Esperanzah</span></h1>
  <p>Vous décidez de soutenir notre action en louant un ORIG-AMI pour la durée du festival.</p>

  <h3>Concrètement, voici comment ça se passe :</h3>
  <div class="info">
   <p><i class="fa fa-check-square-o icon"></i></p>
  <p>Vous venez les mains dans les poches, équipés de votre sac de couchage et de votre matelas.
  Pour la somme de 30€, nous mettons à votre disposition un ORIG-AMI ainsi qu’une bâche isolante.</p><br>
   <p><i class="fa fa-map-marker icon"></i></p>
  <p>Vous pouvez les récupérer directement sur place.</p><br>
   <p><i class="fa fa-thermometer-half icon"></i></p>
  <p>A la fin de votre séjour, nous récupérons les ORIG-AMI et après restauration, nous les distribuerons aux sans-abris dès les premiers froids.</p><br>
  <p><i class="fa fa-heart icon"></i></p>
  <p>Grâce à votre générosité, ils disposeront d’un abri temporaire, isolant, privatif, repliable, transportable et recyclable pour se protéger des grands froids.</p>
  </div>
  <br>
  <p>En collaboration avec le Festival Esperanzah qui partage nos valeurs de solidarité, de générosité et de respect de l’Autre. </p>
  </div>
  </div>

  <div class="row align-center">
  <div class="column-12">
  <a class="button expanded" href="">
  <h2>Parrainer un ORIG-AMI à 30 €</h2>
  <p>au compte n° <span>BE62 0012 6097 7061</span><br>
  avec la communication <span>«esperanzah»</span></p>
  </a>
  </div>
  </div>



<ul class="menu align-center hide-for-small-only">
    <li><a href="http://orig-ami.eu/#quoi">De quoi s'agit-il ?</a></li>
    <li><a href="http://orig-ami.eu/#geste">Un geste de solidarité</a></li>
    <li><a href="http://orig-ami.eu/#pourquoi">ORIG-AMI ?</a></li>
    <li><a href="http://orig-ami.eu/#sponsors">Partenaires</a></li>
    <li><a href="http://orig-ami.eu/#map">Médias</a></li>
</ul>

<ul class="vertical menu align-center show-for-small-only">
    <li><a href="http://orig-ami.eu/#quoi">De quoi s'agit-il ?</a></li>
    <li><a href="http://orig-ami.eu/#geste">Un geste de solidarité</a></li>
    <li><a href="http://orig-ami.eu/#pourquoi">ORIG-AMI ?</a></li>
    <li><a href="http://orig-ami.eu/#sponsors">Partenaires</a></li>
    <li><a href="http://orig-ami.eu/#map">Médias</a></li>
</ul>



  <footer id="footer">
      <div id="foot-container">
          <div class="suivre">
              <h2>Nous suivre</h2>
              <a target="_blank" href="https://www.facebook.com/Origami-homeless-shelter-1522481734535413/">
                  <i class="fa fa-facebook-square fa-2x" aria-hidden="true"></i>
              </a>
              <a href=""></a>
          </div>
          <div class="coordonees">
              <h2>Coordonnées</h2>
              <p>
                  <!--                <a href="http://www.cultures-com.org/" target="_blank"> Cultures & Communications asbl</a><br>-->
                  <i class="fa fa-phone" aria-hidden="true"></i> <a href="tel:+32478236785">+32 (0)478 23 67 85</a><br>
                  TVA : BE0447664601<br>
                  bank account : BE62 0012 6097 7061
              </p>
          </div>
          <div id="contact" class="contacter">
              <h2>Nous contacter</h2>
              <i class="fa fa-envelope fa-2x" aria-hidden="true"></i>
              <?php


            if (isset($_POST['email'])) {

                // EDIT THE 2 LINES BELOW AS REQUIRED
                $email_to = "contact@orig-ami.eu";
                $email_subject = "Contact from orig-ami.eu";

                function died($error)
                {
                    // your error code can go here
                    echo "We are very sorry, but there were error(s) found with the form you submitted. ";
                    echo "These errors appear below.<br /><br />";
              echo $error . "<br /><br />";
              echo "Please go back and fix these errors.<br /><br />";
              die();
              }


              // validation expected data exists
              if (!isset($_POST['firstname']) ||
              !isset($_POST['lastname']) ||
              !isset($_POST['email']) ||
              !isset($_POST['message'])
              ) {
              died('We are sorry, but there appears to be a problem with the form you submitted.');
              }


              $first_name = $_POST['firstname']; // required
              $last_name = $_POST['lastname']; // required
              $society = $_POST['society'];
              $email_from = $_POST['email']; // required
              $telephone = $_POST['telephone'];
              $message = $_POST['message']; // required

              $error_message = "";
              $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';

              if (!preg_match($email_exp, $email_from)) {
              $error_message .= 'The Email Address you entered does not appear to be valid.<br />';
              }

              $string_exp = "/^[A-Za-z .'-]+$/";

              if (!preg_match($string_exp, $first_name)) {
              $error_message .= 'The First Name you entered does not appear to be valid.<br />';
              }

              if (!preg_match($string_exp, $last_name)) {
              $error_message .= 'The Last Name you entered does not appear to be valid.<br />';
              }

              if (strlen($message) < 2) {
              $error_message .= 'The Comments you entered do not appear to be valid.<br />';
              }

              if (strlen($error_message) > 0) {
              died($error_message);
              }

              $email_message = "Form details below.\n\n";


              function clean_string($string)
              {
              $bad = array("content-type", "bcc:", "to:", "cc:", "href");
              return str_replace($bad, "", $string);
              }


              $email_message .= "First Name: " . clean_string($first_name) . "\n";
              $email_message .= "Last Name: " . clean_string($last_name) . "\n";
              $email_message .= "Society: " . clean_string($society) . "\n";
              $email_message .= "Email: " . clean_string($email_from) . "\n";
              $email_message .= "Telephone: " . clean_string($telephone) . "\n";
              $email_message .= "Message: " . clean_string($message) . "\n";

              // create email headers
              $headers = 'From: ' . $email_from . "\r\n" .
              'Reply-To: ' . $email_from . "\r\n" .
              'X-Mailer: PHP/' . phpversion();
              if (mail($email_to, $email_subject, $email_message, $headers)) {

              }
              ?>

              <!-- include your own success html here -->

              <p><strong>Merci de nous avoir contacté.<br>Nous prendrons contact avec vous très bientôt.</strong></p>

              <?php

            }
            ?>

          </div>
      </div>

  </footer>

  <div class="outer-flex-container displayNone">
      <div class="inner-flex-container">
          <div class="container">
              <button id="close_modal_contact">X</button>
              <form name="contactform" method="POST" action="#contact">

                  <input type="text" id="fname" name="firstname" placeholder="Votre nom *" required>
                  <input type="text" id="lname" name="lastname" placeholder="Votre prenom *" required>
                  <input type="text" id="lsociety" name="society" placeholder="Nom de la société">
                  <input type="email" id="lemail" name="email" placeholder="Votre Email *" required>
                  <input type="text" id="ltel" name="telephone" placeholder="Votre téléphone">
                  <textarea id="subject" name="message" placeholder="Ecrire votre message*" required
                            style="height:100px"></textarea>
                  <!--                <div class="g-recaptcha" data-sitekey="6LeYqT8UAAAAAMpRIzYmprwYAIYvDiMAfBcVYEtI"></div>-->
                  <input type="submit" value="Envoyer">
                  <span> * champs obligatoire</span>

              </form>
          </div>
      </div>
  </div>

  <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
  <script>window.jQuery || document.write('<script src="../js/vendor/jquery-3.2.1.min.js"><\/script>')</script>
  <script src="https://www.google-analytics.com/analytics.js" async defer></script>
  <script src="../js/vendor/jquery-3.2.1.min.js"></script>

  </body>
</html>
<script>
    $('.contacter, #close_modal_contact, #soutenir').on('click', function () {
        $('.outer-flex-container').toggleClass("displayNone");
        $('.outer-flex-container').toggleClass("displayFlex");
    });
</script>
<script src='https://www.google.com/recaptcha/api.js'></script>
