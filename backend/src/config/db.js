const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'tutorias.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con SQLite:', err.message);
    } else {
        console.log('Conectado a la base de datos de Tutorías SQLite.');
        crearTablas();
    }
});

function crearTablas() {
    db.serialize(() => {
        // 1. Tabla de Tutores
        db.run(`
            CREATE TABLE IF NOT EXISTS tutores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                especialidad TEXT,
                foto TEXT,
                descripcion TEXT
            )
        `);

        // 2. Tabla de Lenguajes que domina el tutor
        db.run(`
            CREATE TABLE IF NOT EXISTS tutor_lenguajes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tutor_id INTEGER,
                lenguaje TEXT NOT NULL,
                FOREIGN KEY(tutor_id) REFERENCES tutores(id)
            )
        `);

        // 3. Tabla de Citas/Agendamientos
        db.run(`
            CREATE TABLE IF NOT EXISTS citas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tutor_id INTEGER,
                estudiante_nombre TEXT NOT NULL,
                fecha TEXT NOT NULL,
                hora TEXT NOT NULL,
                estado TEXT DEFAULT 'PENDIENTE',
                FOREIGN KEY(tutor_id) REFERENCES tutores(id)
            )
        `);

        // 4. Tabla de Calificaciones y Comentarios
        db.run(`
            CREATE TABLE IF NOT EXISTS reseñas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tutor_id INTEGER,
                estudiante_nombre TEXT NOT NULL,
                calificacion INTEGER CHECK(calificacion >= 1 AND calificacion <= 5),
                comentario TEXT,
                FOREIGN KEY(tutor_id) REFERENCES tutores(id)
            )
        `);

        // 5. Tabla de Roles (requerida por la FK role_id de "user")
        db.run(`
            CREATE TABLE IF NOT EXISTS role (
                id TEXT PRIMARY KEY,
                name TEXT UNIQUE NOT NULL,
                description TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 6. Tabla de Usuarios (cuentas para login: register/login vienen en la Fase 3)
        // Espejo del diseño de PostgreSQL: PK = id_number (cédula), no autoincrement.
        db.run(`
            CREATE TABLE IF NOT EXISTS "user" (
                id_number TEXT PRIMARY KEY,
                id TEXT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                phone TEXT,
                photo TEXT,
                active INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                role_id TEXT NOT NULL,
                assigned_by_id TEXT,
                FOREIGN KEY (role_id) REFERENCES role(id),
                FOREIGN KEY (assigned_by_id) REFERENCES "user"(id_number)
            )
        `);

        // Regla de negocio: el rol "admin" solo puede ser otorgado por un "superadmin".
        // NOTA: a diferencia de Postgres, un trigger BEFORE de SQLite no puede reescribir
        // NEW (no existe el "NEW.campo := valor" de plpgsql), así que solo podemos VALIDAR
        // y abortar el INSERT/UPDATE si se viola la regla. Que assigned_by_id quede en NULL
        // cuando el rol no es admin es responsabilidad del controller (Fase 3/4). En Postgres
        // (producción) el trigger original de mentorship_schema.sql sí cubre ambos casos.
        db.run(`
            CREATE TRIGGER IF NOT EXISTS trg_validate_admin_insert
            BEFORE INSERT ON "user"
            FOR EACH ROW
            WHEN (SELECT name FROM role WHERE id = NEW.role_id) = 'admin'
            BEGIN
                SELECT CASE
                    WHEN NEW.assigned_by_id IS NULL THEN
                        RAISE(ABORT, 'El rol admin solo puede ser otorgado por un superadmin (assigned_by_id faltante)')
                    WHEN NOT EXISTS (
                        SELECT 1 FROM "user" u JOIN role r ON u.role_id = r.id
                        WHERE u.id_number = NEW.assigned_by_id AND r.name = 'superadmin'
                    ) THEN
                        RAISE(ABORT, 'Solo un usuario con rol superadmin puede otorgar el rol admin')
                END;
            END
        `);

        db.run(`
            CREATE TRIGGER IF NOT EXISTS trg_validate_admin_update
            BEFORE UPDATE ON "user"
            FOR EACH ROW
            WHEN (SELECT name FROM role WHERE id = NEW.role_id) = 'admin'
            BEGIN
                SELECT CASE
                    WHEN NEW.assigned_by_id IS NULL THEN
                        RAISE(ABORT, 'El rol admin solo puede ser otorgado por un superadmin (assigned_by_id faltante)')
                    WHEN NOT EXISTS (
                        SELECT 1 FROM "user" u JOIN role r ON u.role_id = r.id
                        WHERE u.id_number = NEW.assigned_by_id AND r.name = 'superadmin'
                    ) THEN
                        RAISE(ABORT, 'Solo un usuario con rol superadmin puede otorgar el rol admin')
                END;
            END
        `);

        // Trigger para mantener updated_at al día en cada UPDATE (equivalente al
        // set_updated_at que mencionaste como pendiente para Postgres)
        db.run(`
            CREATE TRIGGER IF NOT EXISTS trg_user_updated_at
            AFTER UPDATE ON "user"
            FOR EACH ROW
            BEGIN
                UPDATE "user" SET updated_at = CURRENT_TIMESTAMP WHERE id_number = NEW.id_number;
            END
        `);

        // Sembrar los 4 roles base si la tabla está vacía
        db.get("SELECT COUNT(*) AS count FROM role", [], (err, row) => {
            if (row && row.count === 0) {
                const { randomUUID } = require('crypto');
                const roles = [
                    ['user', 'Estudiante/aprendiz de la plataforma'],
                    ['tutor', 'Dicta tutorías'],
                    ['admin', 'Administrador, otorgado únicamente por un superadmin'],
                    ['superadmin', 'Control total, puede otorgar el rol admin']
                ];
                const stmt = db.prepare('INSERT INTO role (id, name, description) VALUES (?, ?, ?)');
                roles.forEach(([name, description]) => stmt.run(randomUUID(), name, description));
                stmt.finalize();
            }
        });
        
        // Insertar datos de prueba base para que la SPA no inicie vacía
        db.get("SELECT COUNT(*) AS count FROM tutores", [], (err, row) => {
            if (row && row.count === 0) {
                db.run("INSERT INTO tutores (nombre, especialidad, descripcion) VALUES ('Edgardo Pacheco', 'Fullstack Developer', 'Especialista en arquitecturas limpias y Vanilla JS')");
                db.run("INSERT INTO tutor_lenguajes (tutor_id, lenguaje) VALUES (1, 'JavaScript'), (1, 'Python'), (1, 'SQL')");
            }
        });
    });
}

// Helper para usar promesas en los controladores de forma limpia
const dbQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Helper para queries que devuelven una sola fila (o undefined si no hay match)
const dbGet = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const dbRun = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
};

module.exports = { db, dbQuery, dbGet, dbRun };