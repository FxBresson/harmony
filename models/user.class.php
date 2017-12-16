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

    protected function getChannels() {
        return myFetchAssoc("SELECT * FROM ".User::$user_channel_table." WHERE ".User::$pk."=".$this->{User::$pk}.";");
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