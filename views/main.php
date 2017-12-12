<!DOCTYPE html>

<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>{% block title %}{% endblock %}</title>

</head>

<body>

    <header>Chat</header>

    {% block content %}{% endblock %}
<script type="text/javascript">
	// Need to get the current url origin
	var body 		= document.getElementsByTagName('body')[0]
	var urlSocket 	= window.location.origin+":3000/socket.io/socket.io.js"
	var script 		= document.createElement('script')
	var script2 	= document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script2.setAttribute('type', 'text/javascript')
    script.setAttribute('src', urlSocket)
    script2.setAttribute('src', './assets/js/app.js')
    console.log(script)
    console.log(body)
    body.appendChild(script)
    body.appendChild(script2)
</script>
<?php  ?>
<script type="text/javascript" src="http://harmony:3000/socket.io/socket.io.js"></script>
<script src="./assets/js/app.js"></script>
</body>

</html>