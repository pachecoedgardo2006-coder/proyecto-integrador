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

const dbRun = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
};

module.exports = { db, dbQuery, dbRun };