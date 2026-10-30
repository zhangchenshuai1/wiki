import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') })

async function init() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        charset: 'utf8mb4',
    })

    await conn.query('DROP DATABASE IF EXISTS wiki_system')
    await conn.query('CREATE DATABASE wiki_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci')
    await conn.query('USE wiki_system')

    await conn.query(`CREATE TABLE users (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin','user') NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`)

    await conn.query(`CREATE TABLE categories (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL UNIQUE,
        slug VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`)

    await conn.query(`CREATE TABLE articles (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(200) NOT NULL,
        content MEDIUMTEXT NOT NULL,
        summary VARCHAR(500) NULL,
        cover_image VARCHAR(255) NULL,
        category_id INT UNSIGNED NULL,
        author_id INT UNSIGNED NOT NULL,
        is_pinned TINYINT(1) NOT NULL DEFAULT 0,
        is_hidden TINYINT(1) NOT NULL DEFAULT 0,
        view_count INT UNSIGNED NOT NULL DEFAULT 0,
        status ENUM('draft','published') NOT NULL DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        FOREIGN KEY (author_id) REFERENCES users(id)
    )`)

    await conn.query(`CREATE TABLE comments (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        article_id INT UNSIGNED NOT NULL,
        author_name VARCHAR(50) NOT NULL,
        author_email VARCHAR(100) NULL,
        content TEXT NOT NULL,
        parent_id INT UNSIGNED NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
    )`)

    const bcrypt = require('bcryptjs')
    const hash = bcrypt.hashSync('admin123', 10)
    await conn.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', hash, 'admin'])
    await conn.query("INSERT INTO categories (name, slug) VALUES ('技术','tech'),('设计','design'),('生活','life'),('教程','tutorial')")

    console.log('Database initialized successfully.')
    console.log('Admin account: admin / admin123')
    await conn.end()
}

init().catch(err => { console.error(err); process.exit(1) })
