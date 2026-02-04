<?php
// backend/config/Database.php

class Database {
    private $host;
    private $db_name;
    private $user;
    private $password;
    private $port;
    private $conn;

    public function connect() {
        $this->host = getenv('DB_HOST') ?: 'localhost';
        $this->port = getenv('DB_PORT') ?: 5432;
        $this->db_name = getenv('DB_NAME') ?: 'paqueteria';
        $this->user = getenv('DB_USER') ?: 'postgres';
        $this->password = getenv('DB_PASSWORD') ?: 'password';

        try {
            $dsn = "pgsql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name;
            
            $this->conn = new PDO(
                $dsn,
                $this->user,
                $this->password,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );

            return $this->conn;
        } catch (PDOException $e) {
            die('Error de conexión: ' . $e->getMessage());
        }
    }

    public function getConnection() {
        return $this->conn;
    }
}
?>
