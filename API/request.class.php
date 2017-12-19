<?php

set_include_path('../');

require_once('utils/dbtools.php');
require_once('models/user.class.php');
require_once('models/channel.class.php');
require_once('models/channel_type.class.php');
require_once('models/message.class.php');


class Request {

    public static $status = array(
        100 => 'Continue',
        101 => 'Switching Protocols',
        200 => 'OK',
        201 => 'Created',
        202 => 'Accepted',
        203 => 'Non-Authoritative Information',
        204 => 'No Content',
        205 => 'Reset Content',
        206 => 'Partial Content',
        300 => 'Multiple Choices',
        301 => 'Moved Permanently',
        302 => 'Found',
        303 => 'See Other',
        304 => 'Not Modified',
        305 => 'Use Proxy',
        306 => '(Unused)',
        307 => 'Temporary Redirect',
        400 => 'Bad Request',
        401 => 'Unauthorized',
        402 => 'Payment Required',
        403 => 'Forbidden',
        404 => 'Not Found',
        405 => 'Method Not Allowed',
        406 => 'Not Acceptable',
        407 => 'Proxy Authentication Required',
        408 => 'Request Timeout',
        409 => 'Conflict',
        410 => 'Gone',
        411 => 'Length Required',
        412 => 'Precondition Failed',
        413 => 'Request Entity Too Large',
        414 => 'Request-URI Too Long',
        415 => 'Unsupported Media Type',
        416 => 'Requested Range Not Satisfiable',
        417 => 'Expectation Failed',
        500 => 'Internal Server Error',
        501 => 'Not Implemented',
        502 => 'Bad Gateway',
        503 => 'Service Unavailable',
        504 => 'Gateway Timeout',
        505 => 'HTTP Version Not Supported'
    );

    public $_content_type = "application/json";

    protected $_code = 200;
    protected $method;
    protected $classname;
    protected $returnedData;

    public function __construct(){
        $this->method = $_SERVER['REQUEST_METHOD'];

        if (isset($_GET['classname'])) {
            $this->classname = ucfirst($_GET['classname']);

            $this->returnedData = $this->processRequest();

            $this->sendResponse();
        }

    }

    private function processRequest() {
        switch ($this->method) {

            case 'GET': 
                if (!isset($_GET['id'])) {
                    return $this->classname::selectAll();
                } else {
                    $object = new $this->classname;
                    $object->{$this->classname::$pk} = $_GET['id'];
                    $object->hydrate();
                    if (!isset($_GET['method'])) {
                        return $object;
                    } else {
                        return $object->{$_GET['method']}();
                    }
                }

                break;

            case 'POST':
                $object = new $this->classname();
                if (isset($_GET['id'])) {
                    $object->{$this->classname::$pk} = $_GET['id'];
                    $object->hydrate();
                }
                if(isset($_POST)) {
                    foreach($_POST as $attribute => $value) {
                        if (in_array($attribute, $this->classname::$fields)) {
                            $object->{$attribute} = $value;
                        }
                    }
                }
                if(isset($_FILES)) {
                    foreach($_FILES as $attribute => $value) {
                        if (in_array($attribute, $this->classname::$fields)) {
                            $object->{$attribute} = $value;
                        }
                    }
                }

                return $object->save();
                break;

            case 'DELETE':
                if (isset($_GET['id'])) {
                    $object = new $this->classname;
                    $object->{$this->classname::$pk} = $_GET['id'];
                    return $object->delete();
                }
                break;
        }

    }


    private function set_headers(){
        $status_message = self::$status[$this->_code] ? self::$status[$this->_code] : self::$status[500];
        header("HTTP/1.1 ".$this->_code." ".$status_message);
        header("Content-Type:".$this->_content_type);
    }

    public static function toJson($data){
        if(is_array($data) || is_object($data)){
            return json_encode($data);
        } else {
            return $data;
        }
    }

    public function sendResponse(){
        $this->set_headers();
        echo Request::toJson($this->returnedData);
        exit;
    }
}

?>