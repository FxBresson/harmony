<?php

require_once('aida.class.php');

require_once('genre.class.php');
require_once('distributeur.class.php');

class Film extends Aida {

    public $genre;
    public $distributeur;

    public function __construct() {
        $this->pk = 'id_film';
        $this->fields = ['id_genre', 'id_distributeur', 'titre', 'resum', 'date_debut_affiche', 'date_fin_affiche', 'duree_minutes', 'annee_production'];
         $this->table_name = 'films';
    }

    public function hydrate() {
        
        parent::hydrate();

        $this->genre = new Genre();
        $this->genre->id_genre = $this->id_genre;
        $this->genre->hydrate();

        $this->distributeur = new Distributeur();
        $this->distributeur->id_distributeur = $this->id_distributeur;
        $this->distributeur->hydrate();
    }

}