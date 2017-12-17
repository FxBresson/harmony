<?php

require_once('utils/aida.class.php');

require_once('models/channel.class.php');
require_once('models/user.class.php');

class Message extends Aida {

    public static $pk = 'id_message';
    public static $fields = ['id_channel', 'timestamp', 'id_user', 'content'];
    public static $table_name = 'messages';

    protected $channel;
    protected $author;

    public function __construct() {

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