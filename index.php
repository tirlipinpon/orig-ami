<?php
// Récupérer les données depuis Supabase
require_once 'get-data-supabase.php';
?>
<!doctype html>
<html class="no-js" lang="">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>ORIG-AMI shelter</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="manifest" href="site.webmanifest">
    <link rel="apple-touch-icon" href="icon.png">
    <link rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Quicksand:300,400,500,700">
    <!-- Place favicon.ico in the root directory -->

    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/owlcarousel/owl.carousel.min.css">
    <link rel="stylesheet" href="css/owlcarousel/owl.theme.default.min.css">
    <!--<link rel="stylesheet" href="css/font-awesome/font-awesome.min.css">-->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/>

    <link rel="stylesheet" href="css/promoBulle.css">

    <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
    <script>window.jQuery || document.write('<script src="js/vendor/jquery-3.2.1.min.js"><\/script>')</script>
    <script src="https://www.google-analytics.com/analytics.js" async defer></script>
    <script src="js/vendor/jquery-3.2.1.min.js"></script>

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
    <style>
    .containerBulle2 {
        width: 128px;
        position: sticky;
        z-index: 99999;
        cursor: pointer;
        display: flex;
        visibility: hidden;
        justify-content: center;
        align-items: center;
        height: 174px;
        left: 3px;
        top: 3px;
        border: 4px solid #171b4a;
    }
    </style>

</head>
<body>
<!--[if lte IE 9]>
<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="https://browsehappy.com/">upgrade
    your browser</a> to improve your experience and security.</p>
<![endif]-->

<script>
// $(document).ready(function() {
//     // Assurez-vous que #containerBulle est visible et #containerBulle2 est caché au chargement
//     $('#containerBulle').show();
//     $('#containerBulle2').hide();
//
//     // Gestion du clic sur le body
//     $('body').on('click', function(e) {
//         // Vérifier si le clic est en dehors de #containerBulle et #containerBulle2
//         if (!$(e.target).closest('#containerBulle').length && !$(e.target).closest('#containerBulle2').length) {
//             // Cacher #containerBulle avec un effet de fadeOut
//             $('#containerBulle').fadeOut('slow', function() {
//                 // Après que #containerBulle soit caché, afficher #containerBulle2 avec un effet de fadeIn
//                 $('#containerBulle2').fadeIn('slow').css('visibility', 'visible');
//             });
//         }
//     });
//
//     // Attacher l'événement de clic sur #containerBulle2
//     $('#containerBulle2').on('click', function(e) {
//         // Empêcher la propagation de l'événement clic au body
//         e.stopPropagation();
//         console.log("container 2 clic");
//         // Cacher #containerBulle2 avec un effet de fadeOut
//         $(this).fadeOut('slow', function() {
//             // Après que #containerBulle2 soit caché, afficher #containerBulle avec un effet de fadeIn
//             $('#containerBulle').fadeIn('slow').css('visibility', 'visible');
//         });
//     });
//
//     // Attacher l'événement de clic sur #containerBulle
//     $('#containerBulle').on('click', function(e) {
//         // Empêcher la propagation de l'événement clic au body pour éviter de le cacher
//         e.stopPropagation();
//         console.log("container 1 clic");
//         // Cacher #containerBulle après 2 secondes avec un effet de fadeOut
//         setTimeout(function() {
//             $('#containerBulle').fadeOut('slow', function() {
//                 // Après que #containerBulle soit caché, afficher #containerBulle2 avec un effet de fadeIn
//                 $('#containerBulle2').fadeIn('slow').css('visibility', 'visible');
//             });
//         }, 500); // 2000 ms = 2 secondes
//     });
// });
</script>



   <!-- pub bd
<div id="containerBulle" class="containerBulle">
  <img class="background" src="img/100-bulles-pour-sans-abri.png">
  <div class="logo">BD originale de 48 pages inédites, elle regroupe des dessins et des planches originales de Franquin,
                    Peyo, et d'autres grands noms de la BD belge comme Walthery, Janin, Schuiten, Grenson, les Carpentier...
                    26 € (inclus frais de port pour la Belgique)
                    <a href="#footer">paiement et dons en bas de site</a>
                    </div>
</div>

<div id="containerBulle2" class="containerBulle2">
  <img class="background" style="height: 161px;" src="img/100-bulles-pour-sans-abri.png">
</div>
-->


<div id="langues">
    <a class="selected"  href="index.php">Fr</a> |
    <a href="orig-ami-nl.php">Nl</a> |
    <a href="orig-ami-en.php">En</a>
</div>

<div id="container">
    <header id="logo">
        <img src="img/orig-ami_logo.svg" alt="Orig-Ami">
    </header>
    <menu id="menu">
        <ul>
            <li><a href="#quoi">De quoi s agit-il ?</a></li>
            <li><a href="#geste">Un geste de solidarité</a></li>
            <li><a href="#pourquoi"><strong>ORIG-AMI</strong> ?</a></li>
            <li><a href="#sponsors">Partenaires</a></li>
            <li><a href="#map">Médias</a></li>
        </ul>
    </menu>

    <h1 id="quoi" class="padding50">De quoi s agit-il ?</h1>
    <p class="block-text">L <strong>ORIG-AMI</strong> est un abri en carton. Il est isolant, protecteur de part sa
        structure, repliable
        comme un accordéon,
        transportable comme un sac à dos et recyclable. L abri pour sans-abri a été conçu sur le principe des origamis,
        technique japonaise de pliage du papier.</p>

    <!-- caroussel -->
    <div>
        <div class="owl-carousel owl-theme">
            <?php if (!empty($carouselSlides)): ?>
                <?php foreach ($carouselSlides as $slide): ?>
                    <div class="item">
                        <img src="<?= htmlspecialchars($slide['image_url_full']) ?>" 
                             alt="<?= htmlspecialchars($slide['alt_text']) ?>"
                             title="<?= htmlspecialchars($slide['titre']) ?>"/>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <!-- Images par défaut si aucun slide en base 
                <div class="item"><img src="img/slide/origami-4.png" alt="ORIG-AMI"/></div>
                <div class="item"><img src="img/slide/origami-5.JPG" alt="ORIG-AMI"/></div>
                <div class="item"><img src="img/slide/origami-6.jpg" alt="ORIG-AMI"/></div>
                <div class="item"><img src="img/slide/origami-7.png" alt="ORIG-AMI"/></div>
                <div class="item"><img src="img/slide/origami-8.png" alt="ORIG-AMI"/></div>
                <div class="item"><img src="img/slide/courtesy-Olivier-Pollet.jpg" alt="courtesy-Olivier-Pollet"/></div>
                <div class="item"><img src="img/slide/press-23.jpg" alt="press-23"/></div>
                <div class="item"><img src="img/slide/toit-tente.jpg" alt="toit-tente"/></div>
                <div class="item"><img src="img/slide/origami-1.jpg" alt="ORIG-AMI"/></div>
                <div class="item"><img src="img/slide/origami-2.jpg" alt="ORIG-AMI"/></div>
                <div class="item"><img src="img/slide/origami-3.jpg" alt="ORIG-AMI"/></div>
                <div class="item"><img src="img/slide/origami-4.jpg" alt="ORIG-AMI"/></div>-->
            <?php endif; ?>
        </div>
    </div>

    <div id="geste" class="up-title"></div>
    <div class="title padding50">
        <i class="fa fa-users fa-2x" aria-hidden="true"></i>
        <h1>Un geste de solidarité</h1>
    </div>

    <p class="block-text">Nous vivons dans l’un des pays les plus confortables du monde. Il est difficilement acceptable
        que des êtres humains
        passent la nuit dans la rue, sur les trottoirs, sous nos fenêtres. 
        A Bruxelles, capitale de l’Europe, 6000 personnes
        dorment sur le pavé. Le nombre augmente d’année en année. Tels ces accidentés de la vie, chacun d’entre nous
        pourrait se retrouver à la rue et eux à nôtre place.</p>

    <p class="block-text">Chacun de nous peut soutenir la démarche en parrainant un <strong>ORIG-AMI</strong>
    et un sac de couchage au prix de 30 €. Les tentes sont conçues pour durer dans le temps et les sacs de couchage tiennent à zéro degré.</p>

    <div class="call-to-action">
        <span style="color:white">Parrainer un ORIG-AMI à 30 € <br> au compte n° BE62 0012 6097 7061</span>
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_s-xclick">
            <input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----MIIHZwYJKoZIhvcNAQcEoIIHWDCCB1QCAQExggEwMIIBLAIBADCBlDCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20CAQAwDQYJKoZIhvcNAQEBBQAEgYAxEjgCF1073fE1dbzP6pduQQJJH2BjwmvplolOEpnOxIGlnLUU+2ePlS1+oAxFPGn1vKWlRXWUs/DH2ZpsMHVVSb6reH6QhfH4YhT2yaJIoy/03nDIkWcsPvN/+QY6qO+yJoYVmsvZdFZKWwf2xxcl841GB3P3nuCZTZXACKBaWDELMAkGBSsOAwIaBQAwgeQGCSqGSIb3DQEHATAUBggqhkiG9w0DBwQI+UCstXt6w/OAgcBuTFajG2RHUsqp1qzxE+YcCqZAjStaOjrpuy6PdU7z6rZtbZTD2STJdwPdZekVWEdiSTR/lJbo6xFnAbAOeMgzZxnPEXDQwXCzHx1x/C78GRdIke4u7llDFkWWtpb3L14dUD3sSm0NulDtuMLyn0DOSj7n07PfVFDsPw2y2HcC8Yy/lDOJncey9VtRviOm9PYv1npoaPsMWbKIQ/7yP4tV27hCRkxH2folDqma+3URnRokZUGp9V22BJ3vYkkCrW+gggOHMIIDgzCCAuygAwIBAgIBADANBgkqhkiG9w0BAQUFADCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20wHhcNMDQwMjEzMTAxMzE1WhcNMzUwMjEzMTAxMzE1WjCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20wgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAMFHTt38RMxLXJyO2SmS+Ndl72T7oKJ4u4uw+6awntALWh03PewmIJuzbALScsTS4sZoS1fKciBGoh11gIfHzylvkdNe/hJl66/RGqrj5rFb08sAABNTzDTiqqNpJeBsYs/c2aiGozptX2RlnBktH+SUNpAajW724Nv2Wvhif6sFAgMBAAGjge4wgeswHQYDVR0OBBYEFJaffLvGbxe9WT9S1wob7BDWZJRrMIG7BgNVHSMEgbMwgbCAFJaffLvGbxe9WT9S1wob7BDWZJRroYGUpIGRMIGOMQswCQYDVQQGEwJVUzELMAkGA1UECBMCQ0ExFjAUBgNVBAcTDU1vdW50YWluIFZpZXcxFDASBgNVBAoTC1BheVBhbCBJbmMuMRMwEQYDVQQLFApsaXZlX2NlcnRzMREwDwYDVQQDFAhsaXZlX2FwaTEcMBoGCSqGSIb3DQEJARYNcmVAcGF5cGFsLmNvbYIBADAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBBQUAA4GBAIFfOlaagFrl71+jq6OKidbWFSE+Q4FqROvdgIONth+8kSK//Y/4ihuE4Ymvzn5ceE3S/iBSQQMjyvb+s2TWbQYDwcp129OPIbD9epdr4tJOUNiSojw7BHwYRiPh58S1xGlFgHFXwrEBb3dgNbMUa+u4qectsMAXpVHnD9wIyfmHMYIBmjCCAZYCAQEwgZQwgY4xCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTEWMBQGA1UEBxMNTW91bnRhaW4gVmlldzEUMBIGA1UEChMLUGF5UGFsIEluYy4xEzARBgNVBAsUCmxpdmVfY2VydHMxETAPBgNVBAMUCGxpdmVfYXBpMRwwGgYJKoZIhvcNAQkBFg1yZUBwYXlwYWwuY29tAgEAMAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMxCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xODAxMTQxODMzMTBaMCMGCSqGSIb3DQEJBDEWBBRiwwJC5x+U89xhsK7yMsX5tyFvKTANBgkqhkiG9w0BAQEFAASBgL8nomxLjdjSYjIlXpgm+cCnQf9PelEQ72LEL2n2YhZsUrilE+nkPueGGNm28nPT0IbEld/QZaTelgXY0Kvw10615EDgzy9Hw1ifw5Ao93i8vTTd+mBZu5t07qUGwRNvJjzxAmcMYK3t/Piecf8LD5B6jCnkvIYBCZn/CLsQnLSB-----END PKCS7-----
                ">
            <input type="image" src="https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif" border="0"
                   name="submit" alt="PayPal – The safer, easier way to pay online!">
            <img alt="" border="0" src="https://www.paypalobjects.com/fr_FR/i/scr/pixel.gif" width="1" height="1">
        </form>
    </div>

    <div id="pourquoi" class="up-title"></div>
    <div class="title padding50">
        <span class="fa-stack fa-lg">
            <i class="fa fa-circle fa-stack-2x"></i>
            <i class="fa fa-question fa-stack-1x fa-inverse" aria-hidden="true" style="color: white"></i>
        </span>
        <h1>Pourquoi des <strong>ORIG-AMI</strong> ?</h1>
    </div>

    <p class="block-text">A Bruxelles-ville, l’utilisation des tentes est interdite. Des sans-abris refusent de se
        rendre dans les dortoirs des
        refuges pour des questions de sécurité. Les animaux de compagnie n’y sont pas admis. Les places sont limitées,
        surtout durant l’hiver. Les abris de carton qu’ils assemblent ne sont pas transportables et les services
        communaux
        les embarquent lors des nettoyages.</p>
    <p class="block-text">Le déclencheur de cette démarche a été le retour du froid et l’augmentation de la pauvreté en
        Belgique et du nombre
        de personnes vivant dans la rue.</p>

    <div class="title padding50" id="sponsors">
        <i class="fa fa-puzzle-piece fa-2x" aria-hidden="true"></i>
        <h1>Partenaires</h1>
    </div>


    <p class="block-text">Les plans ont été réalisés par un centre provincial de réinsertion au travail, une cartonnerie
        a fourni le matériel
        et CELLMADE, atelier de la prison de Lantin, les a assemblés. Tout un symbole ! Tout cela en un délai très
        court,
        après les premiers tests menés à Liège. Nous avons la chance de voir plusieurs entreprises nous apporter
        spontanément leur l’aide ce qui va donner un grand coup de pouce pour la poursuite du projet.</p>


    <div class="up-title"></div>
    <p id="soutenir" class="call-to-action">
        <a href="#">Nous soutenir</a>
    </p>


<!--  ==================== -->
     <div class="title padding50" id="sponsors">
            <i class="fa  fa-2x" aria-hidden="true"></i>
            <h1><strong>ORIG-AMI</strong><br> une action d’urgence en faveur des sans-abris<br></h1>
        </div>

    <p class="block-text">

    <strong>Notre stratégie :</strong><br><br>

    - Lancer des levées de fonds et de parrainages<br>
    - Constituer des stocks de tentes et de sacs de couchage<br>
    - Surveiller les places disponibles dans les centres d’accueil<br>
    - Distribuer en maraude et déposer des kits à des associations<br>
    - Sensibiliser via des témoignages et des reportages dans les médias<br>
    - Améliorer le concept des tentes suivant les retours des utilisateurs<br>


    <br>Période concernée : d’octobre à mars, en fonction de la météo et des besoins.
    </p>



      <div class="title padding50" id="sponsors">
                <i class="fa  fa-2x" aria-hidden="true"></i>
                <h1>Ils ont reçu nos tentes</h1>
       </div>
           <div id="beneficiaires">
               <ul>
                <!-- bénéficiaires (données dynamiques depuis Supabase) -->
                <?php foreach ($beneficiaires as $item): ?>
                   <li><a target="_blank" href="<?= htmlspecialchars($item['url']) ?>"><img src="<?= htmlspecialchars($item['image_url_full']) ?>" alt="<?= htmlspecialchars($item['alt_text']) ?>" title="<?= htmlspecialchars($item['title']) ?>" style="width:<?= intval($item['image_width']) ?>px;"/></a></li>
                <?php endforeach; ?>
               </ul>
           </div>




           <div class="title padding50" id="sponsors">
                <i class="fa  fa-2x" aria-hidden="true"></i>
                <h1>Partenaires</h1>
            </div>
    <div id="donateurs">
        <ul>
            <!-- donateurs (données dynamiques depuis Supabase) -->
          
            <?php foreach ($donateurs as $item): ?>
               <li><a target="_blank" href="<?= htmlspecialchars($item['url']) ?>"><img src="<?= htmlspecialchars($item['image_url_full']) ?>" alt="<?= htmlspecialchars($item['alt_text']) ?>" title="<?= htmlspecialchars($item['title']) ?>" style="width:<?= intval($item['image_width']) ?>px;"/></a></li>
            <?php endforeach; ?>
        </ul>
    </div>

    <div id="content">
        <h1 id="firstHeading" class="firstHeading">Nederlandstalige media</h1>
        <div id="bodyContent" class="media-belge">
            <!-- Médias Belgique (données dynamiques depuis Supabase) -->
            <?php foreach ($mediasBelgique as $media): ?>
                <a target="_blank" href="<?= htmlspecialchars($media['url']) ?>" rel="noopener noreferrer">
                    <?= htmlspecialchars($media['titre']) ?>
                </a>
            <?php endforeach; ?>
        </div>
    </div>

    <h1>Médias internationaux</h1>
    <div id="map"></div>

</div>
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


            if (isset($_POST['lema'])) { //email

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


                // validation expected data exists. Name of post incomprehensible because anti-spam
                if (!isset($_POST['fnal']) || // firstname
                    !isset($_POST['lnal']) || // lastname
                    !isset($_POST['lema']) || // email
                    !isset($_POST['ras']) // message
                ) {
                    died('We are sorry, but there appears to be a problem with the form you submitted.');
                }


                $first_name = $_POST['fnal']; // firstname required
                $last_name = $_POST['lnal']; // lastname required
                $society = $_POST['soca']; // society
                $email_from = $_POST['lema']; // email required
                $telephone = $_POST['ltec']; // telephone
                $message = $_POST['ras']; // message required
                $captcha = $_POST['g-recaptcha-response'];

                $error_message = "";
                $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
                $message_regex = '/\b(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)[-A-Z0-9+&@#\/%=~_|$?!:,.]*[A-Z0-9+&@#\/%=~_|$]/i';

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

                if (strlen($message) < 2 || preg_match_all($message_regex, $message) > 0) {
                    $error_message .= 'The Comments you entered do not appear to be valid. URLs are forbidden (anti-spam).<br />';
                }
                if ($captcha == '') {
                    $error_message .= 'The captcha hasn\'t validated';
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
                $headers = 'From: form@orig-ami.eu'. "\r\n" .
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

                <input type="text" id="fna" name="fnal" placeholder="Votre nom *" required>
                <input type="text" id="lna" name="lnal" placeholder="Votre prenom *" required>
                <input type="text" id="lsoc" name="soca" placeholder="Nom de la société">
                <input type="text" id="lem" name="lema" placeholder="Votre Email *" required>
                <input type="text" id="lte" name="ltec" placeholder="Votre téléphone">
                <textarea id="mras" name="ras" placeholder="Ecrire votre message*" required style="height:100px"></textarea>
                <div class="g-recaptcha" data-sitekey="6LdLHfAjAAAAACZYfPYBiNOD3tD2g8ZQlcenoP51"></div>
                <input type="submit" value="Envoyer">
                <span> * champs obligatoire</span>
            </form>
        </div>
    </div>
</div>


<script src="js/owlcarousel/owl.carousel.min.js"></script>
<script type="application/javascript">
    $(document).ready(function () {
        $(".owl-carousel").owlCarousel({
            loop: true,
            margin: 10,
            nav: true,
            items: 1,
            responsiveClass: true,
            video: true,
            navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"]
        });
    });
</script>
<script>
    $('.contacter, #close_modal_contact, #soutenir').on('click', function () {
        $('.outer-flex-container').toggleClass("displayNone");
        $('.outer-flex-container').toggleClass("displayFlex");
    });

    function verifiedCaptcha () {
        var response = grecaptcha.getResponse();

        captchaVerified = false;
        if(response.length != 0)
            captchaVerified = true;
        return captchaVerified;
    }
</script>
<script>
    function initMap() {

        var belgique = {lat: 50.503887, lng: 4.469936};
        var france = {lat: 48.856614, lng: 2.352222};
        var uk = {lat: 55.378051, lng: -3.435973};
        var russia = {lat: 61.524010, lng: 61.524010};
        var spain = {lat: 40.463667, lng: -3.749220};
        var usa = {lat: 37.090240, lng: -95.712891};
        var china = {lat: -25.363, lng: 131.044};
        var brazil = {lat: -14.235004, lng: -51.925280};
        var vietnam = {lat: 14.058324, lng: 108.277199};
        var maroc = {lat: 31.791702, lng: -7.092620};
        var indonesia = {lat: -0.789275, lng: 113.921327};

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 2,
            center: maroc
        });

        var markerBelgique = new google.maps.Marker({
            position: belgique,
            map: map,
            title: 'Belgique'
        });
        var infowindowBelgique = new google.maps.InfoWindow({
            content: '<div id="content">' +
            '<div id="siteNotice"></div>' +
            '<h1 id="firstHeading" class="firstHeading">Belgique</h1>' +
            '<div id="bodyContent">' +
            '<a target="_blank" href="https://bx1.be/categories/news/une-tente-de-carton-pour-isoler-du-froid-loperation-orig-ami-de-retour-aupres-des-sans-abris/">bx1</a>'+
            '<a target="_blank" href="https://www.ln24.be/2021-12-24/pour-info-noel-et-initiatives-solidaires-pour-les-plus-demunis">ln24</a>'+
            '<a target="_blank" href="https://www.flair.be/fr/society/societe/orig-ami-tentes-carton-sans-abris/">flair</a>'+
            '<a target="_blank" href="https://www.sudinfo.be/id289142/article/2020-12-01/des-tentes-en-carton-20-euros-pour-les-sans-abri-bruxelles-liege-namur-charleroi">sudinfo</a>'+
            '<a target="_blank" href="https://www.telesambre.be/orig-ami-des-tentes-en-carton-pour-les-sans-abri">telesambre</a>'+
            '<a target="_blank" href="https://www.flair.be/fr/lifestyle/societe/orig-ami-tentes-en-carton-sans-abris-belgique/">flair</a>'+
            '<a target="_blank" href="https://weekend.levif.be/lifestyle/news/l-operation-orig-ami-renouvelle-son-appel-a-la-solidarite/article-normal-1058117.html?cookie_check=1543260880">levif</a>'+
            '<a target="_blank" href="http://www.lesoir.be/131570/article/2017-12-29/des-abris-en-carton-origamis-distribues-aux-sdf-bruxellois">lesoir</a>' +
            '<a target="_blank" href="https://bx1.be/news/orig-amis-abris-carton-innovants-distribues-aux-sdf-bruxellois/">bx1</a>' +
            '<a target="_blank" href="https://www.rtbf.be/info/regions/bruxelles/detail_des-abris-en-carton-innovants-distribues-aux-sdf-bruxellois?id=9799838">rtbf</a>' +
            '<a target="_blank" href="http://www.levif.be/actualite/belgique/des-abris-en-carton-distribues-aux-sdf-bruxellois/article-normal-776623.html?utm_campaign=Echobox&utm_medium=social_vif&utm_source=Facebook">levif</a>' +
            '<a target="_blank" href="https://bx1.be/news/orig-ami-tentes-carton-pliables-abri/">bx1</a>' +
            '<a target="_blank" href="https://fr.metrotime.be/2017/12/29/actualite/video-abris-carton-innovants-origamis-distribues-aux-sdf-bruxellois/">metrotime</a>' +
            '<a target="_blank" href="http://www.lacapitale.be/169639/article/2017-12-21/des-tentes-en-origami-pour-les-sans-abri">lacapitale</a>' +
            '<a target="_blank" href="https://www.youtube.com/watch?v=m4-RV4C2PaU">youtube</a> ' +
            '</div>' +
            '</div>'
        });
        markerBelgique.addListener('click', function () {
            infowindowBelgique.open(map, markerBelgique);
        });

        var markerFrance = new google.maps.Marker({
            position: france,
            map: map,
            title: 'France'
        });
        var infowindowFrance = new google.maps.InfoWindow({
            content: '<div id="content">' +
            '<div id="siteNotice"></div>' +
            '<h1 id="firstHeading" class="firstHeading">France</h1>' +
            '<div id="bodyContent">' +
            '<a target="_blank" href="http://www.ledauphine.com/france-monde/2017/12/31/en-belgique-des-abris-origami-pour-les-sdf">ledauphine</a>' +
            '<a target="_blank" href="http://www.lalsace.fr/actualite/2017/12/31/en-belgique-des-abris-origami-pour-les-sdf">lalsace</a>' +
            '<a target="_blank" href="https://www.francetvinfo.fr/societe/sdf/belgique-des-abris-en-carton-pliants-distribues-aux-sans-abri_2539197.html">francetvinfo</a>' +
            '<a target="_blank" href="http://www.20minutes.fr/monde/2195027-20171231-belgique-abris-carton-pliables-distribues-sdf-bruxelles">20minutes</a>' +
            '<a target="_blank" href="http://www.dna.fr/actualite/2017/12/31/en-belgique-des-abris-origami-pour-les-sdf">dna</a>' +
            '<a target="_blank" href="https://www.alvinet.com/similaires/belgique-abris-origami-sdf/42511427">alvinet</a>' +
            '<a target="_blank" href="http://www.leprogres.fr/france-monde/2017/12/31/en-belgique-des-abris-origami-pour-les-sdf">leprogres</a>' +
            '<a target="_blank" href="http://www.infoencontinu.com/article/a.php?article=Belgique%3A+Des+abris+en+carton+pliables+distribués+aux+SDF+à+Bruxelles">infoencontinu</a>' +
            '<a target="_blank" href="https://actualites.bridgeward.com/belgique-des-abris-en-carton-pliables-distribues-aux-sdf-a-bruxelles/">actualites.bridgeward</a>' +
            '<a target="_blank" href="http://ectac.over-blog.com/2017/12/ectac-des-abris-en-carton-pliables-distribues-aux-sdf-a-bruxelles.html">ectac</a>' +
            '<a target="_blank" href="https://www.titrespresse.com/5247311712/origami-sdf-belgique">titrespresse</a>' +
            '<a target="_blank" href="https://fr.anygator.com/article/en-belgique-des-abris-origami-pour-les-sdf__5397769">anygator</a>' +
            '<a target="_blank" href="http://www.cnewsmatin.fr/monde/2017-12-31/bruxelles-des-abris-en-carton-pour-les-sdf-771973">cnewsmatin</a>' +
            '</div>' +
            '</div>'
        });
        markerFrance.addListener('click', function () {
            infowindowFrance.open(map, markerFrance);
        });

        var markerUk = new google.maps.Marker({
            position: uk,
            map: map,
            title: 'UK'
        });
        var infowindowUk = new google.maps.InfoWindow({
            content: '<div id="content">' +
            '<div id="siteNotice"></div>' +
            '<h1 id="firstHeading" class="firstHeading">UK</h1>' +
            '<div id="bodyContent">' +
            '<a target="_blank" href="http://www.bbc.com/news/world-europe-42517710">bbc</a>' +
            '<a target="_blank" href="https://www.reuters.com/article/us-belgium-homeless-tents/housing-the-homeless-cardboard-tents-sprout-in-brussels-idUSKBN1ET1HE">reuters</a>' +
            '<a target="_blank" href="https://travelwirenews.com/homeless-in-brussels-receive-portable-cardboard-tents-to-get-through-winter-video-619543/">travelwirenews</a>' +
            '<a target="_blank" href="https://www.rt.com/news/415149-homeless-brussels-cardboard-tents/">rt</a>' +
            '</div>' +
            '</div>'
        });
        markerUk.addListener('click', function () {
            infowindowUk.open(map, markerUk);
        });

        var markerRussia = new google.maps.Marker({
            position: russia,
            map: map,
            title: 'Russia'
        });
        var infowindowRussia = new google.maps.InfoWindow({
            content: '<div id="content">' +
            '<div id="siteNotice"></div>' +
            '<h1 id="firstHeading" class="firstHeading">Russia</h1>' +
            '<div id="bodyContent">' +
            '<a target="_blank" href="http://www.invexnews.com/item-320358-homeless-in-brussels-receive-portable-ca">invexnews</a>' +
            '</div>' +
            '</div>'
        });
        markerRussia.addListener('click', function () {
            infowindowRussia.open(map, markerRussia);
        });

        var markerSpain = new google.maps.Marker({
            position: spain,
            map: map,
            title: 'Spain'
        });
        var infowindowSpain = new google.maps.InfoWindow({
            content: '<div id="content">' +
            '<div id="siteNotice"></div>' +
            '<h1 id="firstHeading" class="firstHeading">Spain</h1>' +
            '<div id="bodyContent">' +
            '<a target="_blank" href="http://www.eltiempo.com/mundo/europa/origami-para-proteger-a-personas-sin-techo-en-bruselas-166642">eltiempo</a>' +
            '</div>' +
            '</div>'
        });
        markerSpain.addListener('click', function () {
            infowindowSpain.open(map, markerSpain);
        });

        var markerUsa = new google.maps.Marker({
            position: usa,
            map: map,
            title: 'Usa'
        });
        var infowindowUsa = new google.maps.InfoWindow({
            content: '<div id="content">' +
            '<div id="siteNotice"></div>' +
            '<h1 id="firstHeading" class="firstHeading">USA</h1>' +
            '<div id="bodyContent">' +
            '<a target="_blank" href="http://news.trust.org/item/20180104135930-fqvsj/">news.trust</a>' +
            '<a target="_blank" href="http://archyworldys.com/social-in-belgium-shelters-origami-for-the-sdf/">archyworldys</a>' +
            '</div>' +
            '</div>'
        });
        markerUsa.addListener('click', function () {
            infowindowUsa.open(map, markerUsa);
        });

        var markerChina = new google.maps.Marker({
            position: china,
            map: map,
            title: 'China'
        });
        var infowindowChina = new google.maps.InfoWindow({
            content: '<div id="content">' +
            '<div id="siteNotice"></div>' +
            '<h1 id="firstHeading" class="firstHeading">China</h1>' +
            '<div id="bodyContent">' +
            '<a target="_blank" href="https://www.nytimes.com/2017/12/30/world/europe/belgium-cardboard-tents-homeless.html">nytimes</a>' +
            '<a target="_blank" href="http://www.xinhuanet.com/english/2017-12/31/c_136862729.htm">xinhuanet</a>' +
            '<a target="_blank" href="http://www.xinhuanet.com/english/2017-12/31/c_136863474.ht">xinhuanet 2</a>' +
            '</div>' +
            '</div>'
        });
        markerChina.addListener('click', function () {
            infowindowChina.open(map, markerChina);
        });

        var markerBrazil = new google.maps.Marker({
            position: brazil,
            map: map,
            title: 'Brazil'
        });
        var infowindowBrazil = new google.maps.InfoWindow({
            content: '<div id="content">' +
            '<div id="siteNotice"></div>' +
            '<h1 id="firstHeading" class="firstHeading">Brazil</h1>' +
            '<div id="bodyContent">' +
            '<a target="_blank" href="https://noticias.uol.com.br/ultimas-noticias/efe/2018/01/03/associacao-belga-cria-origamis-de-papelao-para-proteger-sem-teto-do-frio.htm">noticias</a>' +
            '</div>' +
            '</div>'
        });
        markerBrazil.addListener('click', function () {
            infowindowBrazil.open(map, markerBrazil);
        });

        var markerVietnam = new google.maps.Marker({
            position: vietnam,
            map: map,
            title: 'Vietnam'
        });
        var infowindowVietnam = new google.maps.InfoWindow({
            content: '<div id="content">' +
            '<div id="siteNotice"></div>' +
            '<h1 id="firstHeading" class="firstHeading">Vietnam</h1>' +
            '<div id="bodyContent">' +
            '<a target="_blank" href="https://tuoitre.vn/cau-chuyen-am-long-truoc-dem-giao-thua-20171231181722462.htm">tuoitre</a>' +
            '<a target="_blank" href="https://www.youtube.com/watch?v=NSNURGkxlREc">VTV24</a>' +
            '</div>' +
            '</div>'
        });
        markerVietnam.addListener('click', function () {
            infowindowVietnam.open(map, markerVietnam);
        });

        var markerMaroc = new google.maps.Marker({
            position: maroc,
            map: map,
            title: 'Maroc'
        });
        var infowindowMaroc = new google.maps.InfoWindow({
            content: '<div id="content">' +
            '<div id="siteNotice"></div>' +
            '<h1 id="firstHeading" class="firstHeading">Maroc</h1>' +
            '<div id="bodyContent">' +
            '<a target="_blank" href="http://www.fildactu.ma/divers/lifestyle/en-belgique-des-abris-origami-pour-les-sdf/">fildactu</a>' +
            '</div>' +
            '</div>'
        });
        markerMaroc.addListener('click', function () {
            infowindowMaroc.open(map, markerMaroc);
        });

        var markerIndonesia = new google.maps.Marker({
            position: indonesia,
            map: map,
            title: 'Indonesia'
        });
        var infowindowIndonesia = new google.maps.InfoWindow({
            content: '<div id="content">' +
            '<div id="siteNotice"></div>' +
            '<h1 id="firstHeading" class="firstHeading">Indonesia</h1>' +
            '<div id="bodyContent">' +
            '<a target="_blank" href="http://internasional.republika.co.id/berita/internasional/global/17/12/30/p1riui423-tenda-dari-kardus-dibagikan-untuk-tunawisma-brussels">republika</a>' +
            '</div>' +
            '</div>'
        });
        markerIndonesia.addListener('click', function () {
            infowindowIndonesia.open(map, markerIndonesia);
        });

    }
</script>
<script async defer
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDHQn35UAV4Q4P0CzWir3JhFzsohO9-mq8&callback=initMap"></script>
        <script src="https://www.google.com/recaptcha/enterprise.js" async defer></script>
</body>
</html>




