<?php

require_once('utils/aida.class.php');

require_once('models/channel.class.php');
require_once('models/message.class.php');

class User extends Aida {

    public static $pk = 'id_user';
    public static $table_name = 'users';
    public static $fields = ['username', 'avatar', 'email', 'password', 'sr', 'available', 'battletag'];

    public static $user_channel_table = 'users_in_channels';
    public static $friends_table = 'friends';
    public static $dm_table = 'dm';


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
        return array($this->publicChannels(), $this->privateChannels());
    }

    public function chanPublic() {
        $channels = Channel::$table_name;
        $query =  "SELECT * FROM ".$channels." WHERE ".$channels.".id_type = 1;";
        return myFetchAllAssoc($query);
    }

    public function chanPrivate() {
        $channels = Channel::$table_name;
        $users_in_channels = User::$user_channel_table;
        $prefix = function($field) {
            return Channel::$table_name.".".$field;
        };
        $map = array_map($prefix, Channel::$fields);
        array_unshift($map, $prefix(Channel::$pk));
        $channels_fields = implode(', ', $map);
        $query =  "SELECT ".$channels_fields." FROM ".$channels." LEFT JOIN ".$users_in_channels." USING(".Channel::$pk.") WHERE ".$channels.".id_type = 2 AND ".$users_in_channels.".".User::$pk." = ".$this->{User::$pk}.";";
        return myFetchAllAssoc($query);    }


    public function createDM() {
        $id_user_dmed = $_GET['parameter'];

        //check if not already DM

        $channel = new Channel();
        $channel->id_type = 3;
        $channel->name = $this->{User::$pk}.'|'.$id_user_dmed;
        $channel->id_user = $this->{User::$pk};
        $channel->save();
        $last_inserted = getLastId();

        $query = "INSERT INTO ".User::$dm_table." (id_user_1, id_user_2, id_channel) VALUES (".$this->{User::$pk}.",".$id_user_dmed.", ".$last_inserted.");";
        myQuery($query);
        return $last_inserted;
    }


    public function userList() {
        $list = User::selectAll();
        $queryUsers = "SELECT id_user, username, avatar, sr, available, battletag FROM ".User::$table_name;
        $usersList = myFetchAllAssoc($queryUsers);
        $userListProper = [];
        foreach($usersList as $index => $user) {
            $userListProper[$user['id_user']] = $user;
        }

        $queryFriends = "SELECT * FROM ".User::$friends_table." WHERE (id_user_1=".$this->{User::$pk}." OR id_user_2=".$this->{User::$pk}.") AND status = 1";
        $friendsList = myFetchAllAssoc($queryFriends);
        foreach ($friendsList as $index => $friend) {
            $friendId = $this->{User::$pk} === $friend['id_user_1'] ? $friend['id_user_2'] : $friend['id_user_1'];
            $userListProper[$friendId]['friend'] = true;
        }

        $queryDM = "SELECT * FROM ".User::$dm_table." WHERE (id_user_1=".$this->{User::$pk}." OR id_user_2=".$this->{User::$pk}.")";
        $DMList = myFetchAllAssoc($queryDM);
        foreach ($DMList as $index => $dm) {
            $dmId = $this->{User::$pk} === $dm['id_user_1'] ? $dm['id_user_2'] : $dm['id_user_1'];
            $userListProper[$dmId]['dm_id_channel'] = $dm['id_channel'];
        }

        return $userListProper;
    }


    public static function queryFriends($id1, $id2) {
        return "(id_user1=".$id1." AND id_user2=".$id2.") OR (id_user_1=".$id2." AND id_user_2=".$id1.")";
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