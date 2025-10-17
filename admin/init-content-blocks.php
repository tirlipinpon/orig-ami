<?php
/**
 * Script d'initialisation des blocs de contenu
 * À exécuter UNE SEULE FOIS pour remplir la table orig_ami_content_blocks
 */

$supabaseUrl = 'https://zmgfaiprgbawcernymqa.supabase.co';
$supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZ2ZhaXByZ2Jhd2Nlcm55bXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ2NTc0MjEsImV4cCI6MjA0MDIzMzQyMX0.sBq7sR7JhRZCg36xvt13yt_f398oWbHUfdUwa9yoox0';

// Définir les blocs de contenu en FR, EN, NL
$contentBlocks = [
    // 1. De quoi s'agit-il ?
    [
        'block_key' => 'what_is_it',
        'language' => 'fr',
        'title' => 'De quoi s agit-il ?',
        'content' => '<p>L <strong>ORIG-AMI</strong> est un abri en carton. Il est isolant, protecteur de part sa structure, repliable comme un accordéon, transportable comme un sac à dos et recyclable. L abri pour sans-abri a été conçu sur le principe des origamis, technique japonaise de pliage du papier.</p>',
        'ordre' => 1
    ],
    [
        'block_key' => 'what_is_it',
        'language' => 'en',
        'title' => 'What is it about ?',
        'content' => '<p>The <strong>ORIG-AMI</strong> is a cardboard shelter. It is insulating, protective due to its structure, folding like an accordion, transportable as a backpack and recyclable. The shelter for the homeless was conceived on the principal of origami, a Japanese technique of folding paper.</p>',
        'ordre' => 1
    ],
    [
        'block_key' => 'what_is_it',
        'language' => 'nl',
        'title' => 'Waarover gaat het ?',
        'content' => '<p>De <strong>ORIG-AMI</strong> is een kartonnen schuilplaats. Hij is isolerend, beschermend door zijn structuur, vouwbaar als een accordeon, mee te nemen als een rugzak en recyclebaar. Deze schuilplaats voor daklozen is ontworpen volgens het principe van de origami, de Japanse vouwtechniek van papier.</p>',
        'ordre' => 1
    ],
    
    // 2. Un geste de solidarité
    [
        'block_key' => 'solidarity_gesture',
        'language' => 'fr',
        'title' => 'Un geste de solidarité',
        'content' => '<p>Nous vivons dans l\'un des pays les plus confortables du monde. Il est difficilement acceptable que des êtres humains passent la nuit dans la rue, sur les trottoirs, sous nos fenêtres. A Bruxelles, capitale de l\'Europe, 6000 personnes dorment sur le pavé. Le nombre augmente d\'année en année. Tels ces accidentés de la vie, chacun d\'entre nous pourrait se retrouver à la rue et eux à nôtre place.</p><p>Chacun de nous peut soutenir la démarche en parrainant un <strong>ORIG-AMI</strong> et un sac de couchage au prix de 30 €. Les tentes sont conçues pour durer dans le temps et les sacs de couchage tiennent à zéro degré.</p>',
        'ordre' => 2
    ],
    [
        'block_key' => 'solidarity_gesture',
        'language' => 'en',
        'title' => 'A gesture of solidarity',
        'content' => '<p>We live in one of the most comfortable countries in the world. It is hardly acceptable that human beings spend the night in the street, on the sidewalks, under our windows. In Brussels, the capital of Europe, 6000 people sleep on the pavement. The number is increasing year by year. Like those casualties of life, each of us could end up on the street and them in our place.</p><p>Each of us can support the process by sponsoring an <strong>ORIG-AMI</strong> and a sleeping bag for € 30. The tents are designed to last over time and the sleeping bags hold zero degrees.</p>',
        'ordre' => 2
    ],
    [
        'block_key' => 'solidarity_gesture',
        'language' => 'nl',
        'title' => 'Een gebaar van solidariteit',
        'content' => '<p>We leven in een van de meest comfortabele landen ter wereld. Het is nauwelijks aanvaardbaar dat mensen de nacht doorbrengen op straat, op de voetpaden, onder onze ramen. In Brussel, de hoofdstad van Europa, slapen 6000 mensen op de stoep. Het aantal stijgt jaar na jaar. Net als deze slachtoffers van het leven, zou ieder van ons op straat kunnen belanden en zij in onze plaats.</p><p>Ieder van ons kan de actie ondersteunen de schenking van een <strong>ORIG-AMI</strong> en een slaapzak voor € 30. De tenten zijn ontworpen om lang mee te gaan en de slaapzakken zijn vriesweer bestendig.</p>',
        'ordre' => 2
    ],
    
    // 3. Pourquoi des ORIG-AMI ?
    [
        'block_key' => 'why_origami',
        'language' => 'fr',
        'title' => 'Pourquoi des ORIG-AMI ?',
        'content' => '<p>A Bruxelles-ville, l\'utilisation des tentes est interdite. Des sans-abris refusent de se rendre dans les dortoirs des refuges pour des questions de sécurité. Les animaux de compagnie n\'y sont pas admis. Les places sont limitées, surtout durant l\'hiver. Les abris de carton qu\'ils assemblent ne sont pas transportables et les services communaux les embarquent lors des nettoyages.</p><p>Le déclencheur de cette démarche a été le retour du froid et l\'augmentation de la pauvreté en Belgique et du nombre de personnes vivant dans la rue.</p>',
        'ordre' => 3
    ],
    [
        'block_key' => 'why_origami',
        'language' => 'en',
        'title' => 'Why ORIG-AMI ?',
        'content' => '<p>In Brussels city, the use of tents is prohibited. Homeless people refuse to go to shelter dormitories for security reasons. Pets are not allowed. Places are limited, especially during the winter. The cardboard shelters they assemble are not transportable and the communal services embark them during the cleanings. The trigger for this approach was the return of the cold and the increase in poverty in Belgium and the number of people living on the streets.</p>',
        'ordre' => 3
    ],
    [
        'block_key' => 'why_origami',
        'language' => 'nl',
        'title' => 'Waarom ORIG-AMI ?',
        'content' => '<p>In Brussel-stad is het gebruik van tenten verboden. Daklozen weigeren om veiligheidsredenen naar de slaapzalen van de schuilplaatsen te gaan. Hun huisdieren zijn er niet toegelaten. De plaatsen zijn beperkt, vooral in de winter. De kartonnen beschermingen die ze zelf samenvouwen zijn niet verplaatsbaar en de gemeentelijke diensten ruimen ze op tijdens de schoonmaakbeurten. De aanleiding voor deze actie was de terugkeer van de grote kou en de toename van de armoede in België en van het aantal mensen dat op straat leeft.</p>',
        'ordre' => 3
    ],
    
    // 4. Partenaires
    [
        'block_key' => 'partners',
        'language' => 'fr',
        'title' => 'Partenaires',
        'content' => '<p>Les plans ont été réalisés par un centre provincial de réinsertion au travail, une cartonnerie a fourni le matériel et CELLMADE, atelier de la prison de Lantin, les a assemblés. Tout un symbole ! Tout cela en un délai très court, après les premiers tests menés à Liège. Nous avons la chance de voir plusieurs entreprises nous apporter spontanément leur l\'aide ce qui va donner un grand coup de pouce pour la poursuite du projet.</p>',
        'ordre' => 4
    ],
    [
        'block_key' => 'partners',
        'language' => 'en',
        'title' => 'Partners',
        'content' => '<p>The plans were carried out by a provincial reintegration center at work, a cardboard box provided the materials and CELLMADE, Lantin prison workshop, assembled them. All a symbol! All this in a very short time, after the first tests in Liege. We are fortunate to see several companies spontaneously bring their help which will give a big boost for the continuation of the project.</p>',
        'ordre' => 4
    ],
    [
        'block_key' => 'partners',
        'language' => 'nl',
        'title' => 'Partners',
        'content' => '<p>De plannen werden uitgevoerd door een provinciaal centrum voor werk-reïntegratie, een kartonbedrijf heeft het materiaal geleverd en CELLMADE, de werkplaats van de gevangenis van Lantin, heeft alles geassembleerd. Een heel symbool! Dit alles op een zeer korte termijn, na de eerste tests uitgevoerd in Luik. We hebben het geluk dat meerdere bedrijven spontaan hun hulp aanbieden, wat een grote stimulans is voor de voortzetting van het project.</p>',
        'ordre' => 4
    ],
    
    // 5. ORIG-AMI une action d'urgence
    [
        'block_key' => 'emergency_action',
        'language' => 'fr',
        'title' => 'ORIG-AMI<br>une action d\'urgence en faveur des sans-abris',
        'content' => '<p><strong>Notre stratégie :</strong></p><ul><li>Lancer des levées de fonds et de parrainages</li><li>Constituer des stocks de tentes et de sacs de couchage</li><li>Surveiller les places disponibles dans les centres d\'accueil</li><li>Distribuer en maraude et déposer des kits à des associations</li><li>Sensibiliser via des témoignages et des reportages dans les médias</li><li>Améliorer le concept des tentes suivant les retours des utilisateurs</li></ul><p><br>Période concernée : d\'octobre à mars, en fonction de la météo et des besoins.</p>',
        'ordre' => 5
    ],
    [
        'block_key' => 'emergency_action',
        'language' => 'en',
        'title' => 'ORIG-AMI<br>emergency action in favor of the homeless',
        'content' => '<p><strong>Our strategy :</strong></p><ul><li>Launch fundraising and sponsorships</li><li>Stock up on tents and sleeping bags</li><li>Monitor available places in reception centers</li><li>Distribute marauding and drop off kits to associations</li><li>Raise awareness through testimonials and media reports</li><li>Improve the concept of tents based on user feedback</li></ul><p><br>Period concerned: from October to March, depending on the weather and needs.</p>',
        'ordre' => 5
    ],
    [
        'block_key' => 'emergency_action',
        'language' => 'nl',
        'title' => 'ORIG-AMI<br>noodactie ten gunste van daklozen',
        'content' => '<p><strong>Onze strategie :</strong></p><ul><li>Opstarten van fondsenwerving en sponsoring</li><li>Opslaan tenten en slaapzakken in</li><li>Opvolgen van beschikbare plaatsen in opvangcentra</li><li>Droppen van kits aan daklozen en leveren aan verenigingen</li><li>Bewustwording vergroten door getuigenissen en mediaberichten</li><li>Verbeteren van het concept van de tenten op basis van feedback van gebruikers</li></ul><p><br>Betrokken periode: van oktober tot maart, afhankelijk van het weer en de behoeften.</p>',
        'ordre' => 5
    ]
];

echo "🚀 Initialisation des blocs de contenu...\n\n";

$success = 0;
$errors = 0;

foreach ($contentBlocks as $block) {
    echo "📝 Ajout de '{$block['title']}' ({$block['language']})... ";
    
    $ch = curl_init("{$supabaseUrl}/rest/v1/orig_ami_content_blocks");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "apikey: {$supabaseKey}",
        "Authorization: Bearer {$supabaseKey}",
        "Content-Type: application/json",
        "Prefer: return=representation"
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($block));
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 201) {
        echo "✅ OK\n";
        $success++;
    } else {
        echo "❌ ERREUR (HTTP {$httpCode})\n";
        echo "Réponse: {$response}\n";
        $errors++;
    }
}

echo "\n";
echo "==========================================\n";
echo "✅ Réussis : {$success}\n";
echo "❌ Erreurs : {$errors}\n";
echo "==========================================\n";
echo "\n";

if ($errors === 0) {
    echo "🎉 Tous les blocs de contenu ont été créés avec succès !\n";
    echo "Vous pouvez maintenant les éditer depuis l'interface admin.\n";
} else {
    echo "⚠️ Certains blocs n'ont pas pu être créés.\n";
    echo "Vérifiez que la table existe et que les RLS policies sont correctes.\n";
}
?>

