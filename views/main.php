<!DOCTYPE html>

<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>{% block title %}{% endblock %}</title>
    <link rel="stylesheet" href="assets/css/main.css">
</head>

<body class="{% block bodyClass %}{% endblock %}">
    
    {% if action is defined %}

        <header>
            <img src="assets/images/harmony_logo.png" alt="harmony_logo">
            <h1>Harmony</h1>
        </header>
    
    {% endif %}    

    {% block content %}{% endblock %}

    <script type="text/javascript" src="{{socketUrl}}"></script>
    <script src="./assets/js/app.js"></script>

</body>

</html>