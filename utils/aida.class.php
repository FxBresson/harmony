<?php

include('dbtools.php');

class Aida {

    protected $pk = null;
    protected $table_name = null;
    protected $fields = [];

    public function __get($attr_name) {
        if (in_array($attr_name, $this->fields) || $attr_name === $this->pk) {
            return $this->$attr_name;
        } else {
            die('illegal field : '.$attr_name);
        }
    }

    public function __set($attr_name, $attr_value) {
        if (in_array($attr_name, $this->fields) || $attr_name === $this->pk) {
            $this->$attr_name = $attr_value;
        } else {
            die('illegal field : '.$attr_name);
        }
    }

    public function hydrate() {
        if ($this->{$this->pk} == null ) {
            die('fatal error');
        }

        $query = "SELECT * FROM ".$this->table_name." WHERE ".$this->pk." = ".$this->{$this->pk};
        $results = myFetchAssoc($query);

        foreach ($results as $field => $value) {
            if ($field != $this->pk) {
                $this->$field = $value;
            }
        }
    }


    public function save() {
        $values = [];
        foreach ($this->fields as $field) {
            if (isset($this->{$field})) {
                $values[] = is_string($this->{$field}) ? "'".$this->{$field}."'" : $this->{$field};
            } else {
                $values[] = 'NULL';
            }
        }

        if (!isset($this->{$this->pk})) {
            //Insert
            $query = "INSERT INTO ".$this->table_name." (".implode(", ", $this->fields).") VALUES (".implode(", ", $values).");";
            var_dump($query);

            $insert = myQuery($query);

            var_dump($insert);
            echo '<br>';

        } else {
            //update
            $arr = [];
            foreach($this->fields as $index => $field) {
                $arr[] = $field.'='.$values[$index];
            }
            $query = "UPDATE ".$this->table_name." SET ".implode(", ", $arr)." WHERE ".$this->pk."=".$this->{$this->pk}.";";
            $update = myQuery($query);
        }
    }

}
