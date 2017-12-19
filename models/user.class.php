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
            if ($attr_name === 'avatar') {
                if(isset($_FILES['avatar'])) { 
                    $dossier = realpath('../public/avatar/');
                    $fichier = basename($_FILES['avatar']['name']);
                    $ext = pathinfo($fichier, PATHINFO_EXTENSION);

                    $pathname = $dossier.'/'.$this->username.'#'.$this->battletag.'.'.$ext;
                    if(move_uploaded_file($_FILES['avatar']['tmp_name'], $pathname)) {
                        $this->$attr_name = $pathname;
                    } else {
                        echo 'Echec de l\'upload !';
                    }
                } else {
                    //avatar par défaut
                }
            } else {
                $this->$attr_name = $attr_value;
            }
        } else {
            die('illegal field : '.$attr_name);
        }
    }

    public function channels() {
        return array($this->chanPublic(), $this->chanPrivate());
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
        return myFetchAllAssoc($query);    
    }


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
        $queryUsers = "SELECT id_user, username, avatar, sr, available, battletag FROM ".User::$table_name." WHERE ".User::$pk." != ".$this->{User::$pk}.";";
        $usersList = myFetchAllAssoc($queryUsers);
        $userListIndexed = [];
        foreach($usersList as $index => $user) {
            $userListIndexed[$user['id_user']] = $user;
        }

        $queryFriends = "SELECT * FROM ".User::$friends_table." WHERE (id_user_1=".$this->{User::$pk}." OR id_user_2=".$this->{User::$pk}.") AND status = 1";
        $friendsList = myFetchAllAssoc($queryFriends);
        foreach ($friendsList as $index => $friend) {
            $friendId = $this->{User::$pk} === $friend['id_user_1'] ? $friend['id_user_2'] : $friend['id_user_1'];
            $userListIndexed[$friendId]['friend'] = true;
        }

        $queryDM = "SELECT * FROM ".User::$dm_table." WHERE (id_user_1=".$this->{User::$pk}." OR id_user_2=".$this->{User::$pk}.")";
        $DMList = myFetchAllAssoc($queryDM);
        foreach ($DMList as $index => $dm) {
            $dmId = $this->{User::$pk} === $dm['id_user_1'] ? $dm['id_user_2'] : $dm['id_user_1'];
            $userListIndexed[$dmId]['dm_id_channel'] = $dm['id_channel'];
        }

        $friends = [];
        $others = [];
        foreach($userListIndexed as $index => $user) {
            if (isset($user['friend'])) {
                $friends[] = $user;
            } else {
                $others[] = $user;
            }
        }
        
        return array_merge($friends, $others);
    }



    public static function queryFriends($id1, $id2) {
        return "(id_user1=".$id1." AND id_user2=".$id2.") OR (id_user_1=".$id2." AND id_user_2=".$id1.")";
    }


    public function chanleave() {
        //Check if channel Private
        $id_channel = $_GET['parameter'];

        return myQuery("DELETE FROM ".User::$user_channel_table." WHERE ".Channel::$pk."=".$id_channel." AND ".User::$pk."=".$this->{User::$pk}.";");
    }

    public function inviteSend() {
        //Check if not already invite
        $id_requested_friend = $_GET['parameter'];
        $query = "INSERT INTO ".User::$friends_table." (id_user_1, id_user_2, status) VALUES (".$this->{User::$pk}.",".$id_requested_friend.", 2);";
        myQuery($query);
        return $this->{User::$pk};
    }

    public function inviteAccept() {
        $id_initiator = $_GET['parameter'];

        $query = "UPDATE ".User::$friends_table." SET status=1 WHERE id_user_1=".$id_initiator." AND id_user_2=".$this->{User::$pk}.";";
        return myQuery($query);
    }

    public function inviteRefuse() {
        $id_initiator = $_GET['parameter'];

        $query = "UPDATE ".User::$friends_table." SET status=0 WHERE id_user_1=".$id_initiator." AND id_user_2=".$this->{User::$pk}.";";
        return myQuery($query);
    }
}