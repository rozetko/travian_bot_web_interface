<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<link rel='stylesheet' type='text/css' href='style/style.css'/>
		<script type='text/javascript' src='js/ajax.js' />

		<title>Travian bot</title>
	</head>
	<body>
		<div id='config'>
			<form action='config.php' method='POST'>
				<?php 
					$saved = False;
					$fileName = "salik.json";

					$config = $_POST["config"];

					if (empty($config))
						$config = file_get_contents($fileName);
					else
					{
						echo "Config saved successfully";
						file_put_contents($fileName, $config);
					}

					$rows = count(file($fileName));

					echo "<textarea name='config' rows=", $rows, " cols=70>", $config, "</textarea><br>";
				?>
				<input type='submit' value='Save'> 
			</form>
		</div>

		<div id='log'>
			<h1><span>Log:</span></h1>

			<?php
			    $log = shell_exec("exec tail bot_log.out");
			    echo nl2br($log);
			?>
		</div>
	</body>
</html>