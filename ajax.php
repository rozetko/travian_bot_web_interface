<?php
	if (!empty($_GET["log"]))
		echo nl2br(shell_exec("exec tail -n 20 bot_log.out"));
?>