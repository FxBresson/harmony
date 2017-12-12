<?php

require_once('aida.class.php');

require_once('channel.class.php');
require_once('user.class.php');

class Message extends Aida {
    
    protected $channel;
    protected $author;

    public function __construct() {
        $this->pk = 'id_message';
        $this->fields = ['id_channel', 'timestamp', 'id_user', 'content'];
        $this->table_name = 'messages';
    }

    public function hydrate() {

        parent::hydrate();

        $this->channel = new Channel();
        $this->channel->id_channel = $this->id_channel;
        $this->channel->hydrate();
        
        $this->author = new User();
        $this->author->id_user = $this->id_user;
        $this->author->hydrate();

    }

}