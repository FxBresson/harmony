<?php

require_once('utils/aida.class.php');

require_once('models/channel.class.php');

class User extends Aida {

    public static $pk = 'id_user';
    public static $table_name = 'users';
    public static $fields = ['username', 'avatar', 'email', 'password', 'sr', 'available', 'battletag'];

    public static $user_channel_table = 'users_in_channels';
    public static $friends_table = 'friends';

    public function __construct() {
    }

    public function __set($attr_name, $attr_value) {
        if (in_array($attr_name, get_class($this)::$fields) || $attr_name === get_class($this)::$pk) {
            if ($attr_name === 'password') {
                $this->$attr_name = password_hash($attr_value, PASSWORD_DEFAULT);
            } else {
                $this->$attr_name = $attr_value;
            }
        } else {
            die('illegal field : '.$attr_name);
        }
    }

    public function channels() {
        $channels = Channel::$table_name;
        $prefix = function($field) {
            return Channel::$table_name.".".$field;
        };
        $map = array_map($prefix, Channel::$fields);
        array_unshift($map, $prefix(Channel::$pk));
        $channels_fields = implode(', ', $map);
        $users_in_channels = User::$user_channel_table;
        $query =  "SELECT ".$channels_fields." FROM ".$channels." LEFT JOIN ".$users_in_channels." USING(".Channel::$pk.") WHERE ".$channels.".id_type = 1 OR ".$channels.".id_type = 2 AND ".$users_in_channels.".".User::$pk." = ".$this->{User::$pk}.";";
        return myFetchAllAssoc($query);
    }

    protected function leaveChannel($id_channel) {
        return myQuery("DELETE FROM ".User::$user_channel_table." WHERE ".Channel::$pk."=".$id_channel." AND ".User::$pk."=".$this->{User::$pk}.";");
    }

    protected function sendInvite($id_requested_friend) {
        $query = "INSERT INTO ".User::$friends_table." (id_user_1, id_user_2, status) VALUES (".$this->{User::$pk}.",".$id_requested_friend.", 2);";
        return $insert = myQuery($query);
    }

    protected function acceptInvite($id_invite) {
        $query = "UPDATE ".User::$friends_table." SET status=1 WHERE id=".$id_invite.";";
        return $update = myQuery($query);
    }

    protected function refuseInvite($id_invite) {
        $query = "UPDATE ".User::$friends_table." SET status=1 WHERE id=".$id_invite.";";
        return $update = myQuery($query);
    }
}