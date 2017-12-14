<?php

include('dbtools.php');

class Aida {

    public static $pk = null;
    public static $table_name = null;
    public static $fields = [];

    public function __get($attr_name) {
        if (in_array($attr_name, get_class($this)::$fields) || $attr_name === get_class($this)::$pk) {
            return $this->$attr_name;
        } else {
            die('illegal field : '.$attr_name);
        }
    }

    public function __set($attr_name, $attr_value) {
        if (in_array($attr_name, get_class($this)::$fields) || $attr_name === get_class($this)::$pk) {
            $this->$attr_name = $attr_value;
        } else {
            die('illegal field : '.$attr_name);
        }
    }

    public function hydrate() {
        if ($this->{get_class($this)::$pk} == null ) {
            die('fatal error');
        }

        $query = "SELECT * FROM ".get_class($this)::$table_name." WHERE ".get_class($this)::$pk." = ".$this->{get_class($this)::$pk};
        $results = myFetchAssoc($query);

        if (!empty($results)) {
            foreach ($results as $field => $value) {
                if ($field != get_class($this)::$pk) {
                    $this->{$field} = $value;
                }
            } 
        }
    }

    public function save() {
        $values = [];
        foreach (get_class($this)::$fields as $field) {
            if (isset($this->{$field})) {
                $values[] = is_string($this->{$field}) ? "'".$this->{$field}."'" : $this->{$field};
            } else {
                $values[] = 'NULL';
            }
        }

        if (!isset($this->{get_class($this)::$pk})) {
            //Insert
            $query = "INSERT INTO ".get_class($this)::$table_name." (".implode(", ", get_class($this)::$fields).") VALUES (".implode(", ", $values).");";
            var_dump($query);

            return $insert = myQuery($query);

        } else {
            //update
            $arr = [];
            foreach(get_class($this)::$fields as $index => $field) {
                $arr[] = $field.'='.$values[$index];
            }
            $query = "UPDATE ".get_class($this)::$table_name." SET ".implode(", ", $arr)." WHERE ".get_class($this)::$pk."=".$this->{get_class($this)::$pk}.";";
            
            return $update = myQuery($query);
        }
    }

    public function delete() {
        return $query = "DELETE FROM ".get_class($this)::$table_name." WHERE ".get_class($this)::$pk."=".$this->{get_class($this)::$pk}.";";
    }

    public static function selectAll() {
        $query = "SELECT * FROM ".get_class($this)::$table_name;
        return $results = myFetchAssoc($query);
    }

}
