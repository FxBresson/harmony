<?php

require_once('utils/aida.class.php');

require_once('models/channel_type.class.php');
require_once('models/user.class.php');

class Channel extends Aida {

    public static $pk = 'id_channel';
    public static $fields = ['id_type', 'position', 'name', 'description', 'id_user'];
    public static $table_name = 'channels';
    public static $user_channel_table = 'users_in_channels';

    protected $type;
    protected $owner;

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
        $query = "SELECT * FROM ".Message::$table_name." LEFT JOIN users USING(id_user) WHERE ".Channel::$pk."=".$this->{Channel::$pk}.";";
        return myFetchAllAssoc($query);
    }

    public function save() {
        parent::save();
        $this->{Channel::$pk} = getLastId();
        $this->addOwner();
    }

    public function addOwner() {
        $query = "INSERT INTO ".get_class($this)::$user_channel_table." (id_user, id_channel) VALUES (".$this->id_user.", ".$this->{Channel::$pk}.");";
        return myQuery($query);
    }
}