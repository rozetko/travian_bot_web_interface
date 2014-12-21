<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<link rel='stylesheet' type='text/css' href='style/style.css'/>
		<script type='text/javascript' src='js/ajax.js'></script>

		<script type="text/javascript">
			function updateLog(status, headers, responseText) {
				document.getElementById('log').innerHTML = responseText;
			};
		</script>

		<title>Travian bot</title>
	</head>
	<body onload='(function() {getUrl("ajax.php?log=1", updateLog); setTimeout(arguments.callee, 2000)})();'>
		<div id='config'>
			<form action='bot.php' method='POST'>
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

		<div id='logContainer'>
			<h1><span>Log:</span></h1>

			<div id='log'>
			</div>
		</div>
	</body>
</html>