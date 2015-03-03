<?php 
	require_once 'vendor/autoload.php';

	$filename = "bot/salik.json";

	$configString = file_get_contents($filename);
	$config = json_decode($configString, true);

	Twig_Autoloader::register();

	$loader = new Twig_Loader_Filesystem('/var/www/html/views');
	$twig = new Twig_Environment($loader);

	echo $twig->render('bot.html', array(
		'server' => $config['login']['server'],
		'username' => $config['login']['username'],
		'password' => $config['login']['password'],
		'adventures' => $config['adventures']['enable'],
		'build' => $config['build']['enable'],
		'build_delay' => $config['build']['delay'],
		'buildings' => $config['build']['buildingList']
	));
?> 
