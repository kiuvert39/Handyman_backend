# Database Setup for Handyman Project

## Prerequisites

1. **PostgreSQL Installation:** Ensure PostgreSQL is installed on your local machine. You can download it from the [PostgreSQL official website](https://www.postgresql.org/download/).

2. **Access Permissions:** You should have the necessary permissions to create databases and users on your PostgreSQL server.

## Steps to Set Up the PostgreSQL Database

### 1. Access PostgreSQL Command Line

Open your terminal and access the PostgreSQL command line tool. If you’re not logged in as the `postgres` user, use the following command:

```bash
sudo -u postgres psql
```

### 2. Create the Database

Run the following SQL command to create a database named handyman:

```
CREATE DATABASE handyman;
```

### 3. Create a Database User

Create a user with a username of your choice and a secure password. Replace handyman_user and your_password with your preferred username and password:

```
CREATE USER handyman_user WITH PASSWORD 'your_password';
```

### 4. Grant Privileges to the User

Grant the new user access to the handyman database:

```
GRANT ALL PRIVILEGES ON DATABASE handyman TO handyman_user;
```

### 5. Exit the PostgreSQL Command Line

Exit the PostgreSQL command line tool by typing:

```
\q
```

### 6 Create and Update .env File

- Copy .env.example to .env:

* In the root directory of your project, create a .env file by copying the .env.example file

```
cp .env.example .env
```

- Update the .env File:

* Open the newly created .env file in a text editor and replace the placeholder values with the actual values from the database setup:

```
# PostgreSQL Database Configuration
DB_TYPE=postgres
DB_USERNAME=handyman_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_DATABASE=handyman
DB_ENTITIES=dist/**/*.entity{.ts,.js}
DB_MIGRATIONS=dist/db/migrations/*{.ts,.js}
DB_SSL=false
```

### 7. Test the Connection

Make sure your application is properly connecting to the database. Start your NestJS application in development mode:

```
npm run start:dev
```
