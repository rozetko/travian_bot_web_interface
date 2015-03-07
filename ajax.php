<?php
	require_once 'vendor/autoload.php';

	function saveConfig($filename, $config) {
		$configString = json_encode($config, JSON_PRETTY_PRINT);
		file_put_contents($filename, $configString);
	}

	function getConfig($filename) {
		$configString = file_get_contents($filename);

		return json_decode($configString, true);
	}

	function renderConfig($config) {
		Twig_Autoloader::register();

		$loader = new Twig_Loader_Filesystem('/var/www/html/views');
		$twig = new Twig_Environment($loader);

		return $twig->render('config.html', array(
			'server' => $config['login']['server'],
			'username' => $config['login']['username'],
			'password' => $config['login']['password'],
			'adventures' => $config['adventures']['enable'],
			'build' => $config['build']['enable'],
			'build_delay' => $config['build']['delay'],
			'buildings' => $config['build']['buildingList']
		));
	}

	function renderRow($i) {
		Twig_Autoloader::register();

		$loader = new Twig_Loader_Filesystem('/var/www/html/views');
		$twig = new Twig_Environment($loader);


		return $twig->render('row.html', array(
			'row_number' => $i,
			'building' => array(
				'fieldId' => 1,
				'skip' => 1
			)
		));
	}

	function customSort($a, $b) {
		return $a['village'] > $b['village'];
	}

	$filename = "bot/salik.json";

	if (isset($_GET["start"])) {
		exec("python bot/bot.py salik.json start");
	}

	if (isset($_GET["stop"])) {
		exec("python bot/bot.py salik.json stop");
	}

	if (isset($_GET["pause"])) {
		$config = getConfig($filename);
		$config["pause"] = $_GET["pause"];

		saveConfig($filename, $config);
	}

	if (isset($_GET["update"])) {
		$return = array();

		$configString = file_get_contents($filename);
		$config = json_decode($configString, true);

		$log = nl2br(shell_exec("exec tail -n 20 bot/debug.log"));

		if (file_exists("/tmp/bot_salik.pid")) {
			if ($config["pause"]) {
				$return["status"] = "-1";
			}
			else {
				$return["status"] = "1";
			}
		}
		else {
			$return["status"] = "0";
		}

		$return['log_hash'] = crc32($log);
		$return['log'] = $log;

		$return['config_hash'] = crc32($configString);

		echo json_encode($return);
	}

	if (isset($_GET["save_config"])) {			
		$config = getConfig($filename);

		$config['login']['server'] = $_POST['server'];
		$config['login']['username'] = $_POST['username'];
		$config['login']['password'] = $_POST['password'];
		$config['adventures']['enable'] = $_POST['adventures']? 1: 0;
		$config['build']['enable'] = $_POST['build']? 1: 0;
		$config['build']['delay'] = $_POST['build_delay'];

		$config['build']['buildingList'] = array();
	
		foreach ($_POST['village'] as $i => $village) {
			$config['build']['buildingList'][] = array(
				'village' => (int) $village,
				'fieldId' => (int) $_POST['field_id'][$i],
				'to' => (int) $_POST['to'][$i],
				'skip' => $_POST['skip'][$i]? 1: 0,
				'wood' => isset($_POST['wood'][$i])? 1: 0,
				'clay' => isset($_POST['clay'][$i])? 1: 0,
				'iron' => isset($_POST['iron'][$i])? 1: 0,
				'crop' => isset($_POST['crop'][$i])? 1: 0,
			);
		}

		usort($config['build']['buildingList'], 'customSort');

		saveConfig($filename, $config);
	}

	if (isset($_GET["config"])) {
		$config = getConfig($filename);

		echo renderConfig($config);
	}

	if (isset($_GET["row"])) {
		echo renderRow($_GET["row"]);
	}
?>