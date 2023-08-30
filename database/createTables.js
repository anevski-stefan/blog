const client = require("./database.js");

async function createTables() {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS category (
        id SERIAL PRIMARY KEY UNIQUE,
        name VARCHAR(255) NOT NULL UNIQUE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS bloguser (
        id SERIAL PRIMARY KEY UNIQUE,
        firstname VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS blog (
        id SERIAL UNIQUE PRIMARY KEY,
        title VARCHAR(255) UNIQUE NOT NULL,
        content TEXT,
        category_id INT REFERENCES category(id) ON DELETE CASCADE,
        user_id INT REFERENCES bloguser(id) ON DELETE CASCADE,
        createdat TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_like (
        id_like SERIAL PRIMARY KEY UNIQUE,
        id_blog INT REFERENCES blog(id) ON DELETE CASCADE,
        id_user INT REFERENCES bloguser(id) ON DELETE CASCADE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_dislike (
        id_dislike SERIAL PRIMARY KEY UNIQUE,
        id_blog INT REFERENCES blog(id) ON DELETE CASCADE,
        id_user INT REFERENCES bloguser(id) ON DELETE CASCADE
      );
    `);

    await client.query(`CREATE TABLE IF NOT EXISTS blog_comment (
      id SERIAL PRIMARY KEY UNIQUE,
      content TEXT not null,
      id_blog INT REFERENCES blog(id) ON DELETE CASCADE,
      id_user INT REFERENCES bloguser(id) ON DELETE CASCADE,
      createdAt TIMESTAMP DEFAULT NOW());`);

    await client.query(`CREATE TABLE IF NOT EXISTS blog_blockedUsers(
        id_blockingUser INT REFERENCES bloguser(id) ON DELETE CASCADE,
        id_blockedUser INT REFERENCES bloguser(id) ON DELETE CASCADE
      )`);

    await client.query(`CREATE TABLE IF NOT EXISTS blog_followedUsers(
        id INT unique primary key serial,
        id_followingUser INT REFERENCES bloguser(id) ON DELETE CASCADE,
        id_followedUser INT REFERENCES bloguser(id) ON DELETE CASCADE
      )`);

    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    client.end();
  }
}

createTables();
