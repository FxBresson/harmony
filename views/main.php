<!DOCTYPE html>

<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>{% block title %}{% endblock %}</title>
    <link rel="stylesheet" href="assets/css/main.css">
</head>

<body class="{% block bodyClass %}{% endblock %}">

    {% if action is defined %}

        {% block content %}{% endblock %}

    {% else %}

        {% block channel %}{% endblock %}
        {% block private %}{% endblock %}
        {% block chat %}{% endblock %}
        {% block user %}{% endblock %}

        <script src="https://unpkg.com/vue"></script>
        {% block vuejs %}{% endblock %}

    {% endif %}

</body>

</html>