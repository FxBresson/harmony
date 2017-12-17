<?php

require_once('utils/aida.class.php');

require_once('models/channel_type.class.php');
require_once('models/user.class.php');

class Channel extends Aida {

    public static $pk = 'id_channel';
    public static $fields = ['id_type', 'position', 'name', 'description', 'id_user'];
    public static $table_name = 'channels';

    protected $type;
    protected $owner;


    public function __construct() {

    }

    public function hydrate() {

        parent::hydrate();
        
        $this->type = new ChannelType();
        $this->type->id_type = $this->id_type;
        $this->type->hydrate();

        $this->owner = new User();
        $this->owner->id_user = $this->id_user;
        $this->owner->hydrate();        

    }
    
    public function messages() {
        $query = "SELECT * FROM ".Message::$table_name." WHERE ".Channel::$pk."=".$this->{Channel::$pk}.";";
        return myFetchAllAssoc($query);
    }

}