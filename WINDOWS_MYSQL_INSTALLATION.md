# MySQL Installation Guide for Windows

## Download MySQL

### Option 1: MySQL Community Server (Recommended)
1. Go to [mysql.com/downloads](https://www.mysql.com/downloads/)
2. Click "MySQL Community Server"
3. Download "MySQL Installer for Windows (MSI Installer)" - the larger .msi file
4. Choose the version: **MySQL 8.0** (latest stable)

### Option 2: From Microsoft Store
1. Open Microsoft Store
2. Search for "MySQL"
3. Click "MySQL" by Oracle Corporation
4. Click "Install"
5. Once installed, MySQL runs as a Windows service automatically

---

## Installation Steps (MSI Installer)

### Step 1: Run Installer
1. Double-click `mysql-installer-web-community-*.msi`
2. Windows may ask "Do you want to allow this app?" → Click **Yes**

### Step 2: License Agreement
1. Read and agree to the license
2. Click **Next**

### Step 3: Setup Type
1. Select **Developer Default** (includes MySQL Server + tools)
2. Click **Next**

### Step 4: Check Requirements
1. The installer checks for required software
2. If any are missing, it will show a list
3. Click **Execute** to install missing requirements
4. Click **Next**

### Step 5: Installation
1. Review the list of products to install
2. MySQL Server should be included
3. Click **Execute** to start installation
4. Wait for installation to complete
5. Click **Next**

### Step 6: Product Configuration
1. Click **Next** on the Configuration overview

### Step 7: MySQL Server Configuration
1. **Config Type**: Select **Development Machine** (for local development)
2. **MySQL Port**: Keep **3306** (default port)
3. Click **Next**

### Step 8: MySQL Server User Configuration
1. **Root Password**: Set a strong password (you'll need this!)
   - Example: `MySecure!Pass123`
   - Write it down safely
2. Confirm password
3. You can add other MySQL users (optional for now)
4. Click **Next**

### Step 9: Windows Service Configuration
1. **Configure MySQL Server as a Windows Service**: Leave **CHECKED**
2. **Service Name**: Keep **MySQL80** (or MySQL57 depending on version)
3. **Start MySQL Server at System Startup**: **CHECKED** (recommended)
4. Click **Next**

### Step 10: Apply Configuration
1. Click **Execute** to apply settings
2. Wait for configuration to complete
3. Click **Finish** → **Next** → **Finish**

---

## Verify Installation

### Method 1: Command Prompt
```bash
# Test MySQL installation
mysql --version
# Should show: mysql  Ver 8.0.xx

# Test MySQL connection
mysql -u root -p
# Enter the password you set during installation
# If successful, you'll see: mysql>

# Exit MySQL
EXIT;
```

### Method 2: MySQL Workbench
1. Open MySQL Workbench (installed with MySQL)
2. Click on "Local instance MySQL80"
3. Enter root password
4. If successful, you're connected!

### Method 3: Services (Windows)
1. Press `Win + R`
2. Type `services.msc`
3. Look for "MySQL80" or "MySQL57"
4. Status should be "Running"
5. If not running, right-click → Start

---

## Create FoodDash Database

### Using Command Prompt
```bash
# Connect as root
mysql -u root -p
# Enter password at prompt

# Inside MySQL terminal, create database:
CREATE DATABASE fooddash;

# Verify creation
SHOW DATABASES;
# Should show: fooddash in the list

# Exit MySQL
EXIT;
```

### Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to local instance (MySQL80)
3. Click "+" next to "Schemas" on the left
4. Name: `fooddash`
5. Click "Apply"
6. Confirm the SQL
7. Database is created!

---

## Common Issues & Solutions

### Issue: "mysql: command not found" or "'mysql' is not recognized"
**Cause**: MySQL is not in your system PATH

**Solution**:
1. Find MySQL installation path: Usually `C:\Program Files\MySQL\MySQL Server 8.0\bin`
2. Method A: Add to PATH
   - Right-click "This PC" → Properties
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", click "Path" → Edit
   - Click "New" → Add: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
   - Click OK, restart Command Prompt
3. Method B: Use full path
   - `"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql" -u root -p`

### Issue: "Access denied for user 'root'@'localhost'"
**Cause**: Wrong password or blank password not set correctly

**Solution**:
1. If you forgot the password:
   - Stop MySQL service
   - Use MySQL Configuration Wizard to reset password
   - Or: Right-click MySQL in Services → Stop
   - Then reinstall with new password

### Issue: "Can't connect to MySQL server"
**Cause**: MySQL service is not running

**Solution**:
1. Check if MySQL is running:
   - Right-click taskbar → Task Manager
   - Look for MySQL process
2. Start MySQL service:
   - Services.msc → Find MySQL80 → Right-click → Start
3. Or restart the service:
   - `net stop MySQL80` (Command Prompt as Administrator)
   - `net start MySQL80`

### Issue: Port 3306 already in use
**Cause**: Another application is using MySQL's port

**Solution**:
1. Find what's using the port:
   - Command Prompt (Admin): `netstat -ano | findstr :3306`
2. Kill the process (if not needed):
   - `taskkill /PID <process_id> /F`
3. Or change MySQL port:
   - MySQL Workbench → MySQL80 → Edit → Port: 3307

---

## Configuration Best Practices

### Data Location (Optional)
By default, MySQL stores data in:
```
C:\ProgramData\MySQL\MySQL Server 8.0\Data
```

This is fine for development.

### Character Set
Make sure MySQL uses UTF-8:
```bash
mysql -u root -p
SHOW VARIABLES LIKE 'character_set%';
# Should show utf8mb4
```

### Max Connections
For development, default max_connections (151) is fine.

---

## Next Steps

After MySQL installation:
1. Create `.env` file in `backend/` folder
2. Set `DB_PASSWORD` to your root password
3. Run database migrations: `npm run db:migrate`
4. Start backend: `npm run dev`

---

## Uninstall MySQL (If Needed)

### Method 1: Control Panel
1. Settings → Apps → Installed apps
2. Search "MySQL"
3. Click MySQL Server → Uninstall
4. Follow the wizard

### Method 2: Installer
1. Run `mysql-installer-web-community-*.msi` again
2. Select "Remove" for products you want to uninstall
3. Click Next and follow the wizard

### Clean Up (Optional)
```bash
# Remove MySQL service completely
sc delete MySQL80
```

---

## Useful Windows Commands

```bash
# Start MySQL service
net start MySQL80

# Stop MySQL service
net stop MySQL80

# Check service status
sc query MySQL80

# Connect to MySQL
mysql -u root -p

# Create database
mysql -u root -p -e "CREATE DATABASE fooddash;"

# Import SQL file
mysql -u root -p fooddash < database/migrations/001_create_fooddash_schema.sql

# Export database
mysqldump -u root -p fooddash > fooddash_backup.sql
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Connect to MySQL | `mysql -u root -p` |
| Show databases | `SHOW DATABASES;` |
| Create database | `CREATE DATABASE fooddash;` |
| Use database | `USE fooddash;` |
| Show tables | `SHOW TABLES;` |
| Exit MySQL | `EXIT;` |
| Start MySQL service | `net start MySQL80` |
| Stop MySQL service | `net stop MySQL80` |

---

**Last Updated**: April 25, 2026  
**Tested on**: Windows 10, Windows 11  
**MySQL Versions**: 5.7, 8.0
