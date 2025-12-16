const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'leads.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

db.serialize(() => {
  // Leads table
  db.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'booked', 'no_interest')),
      added_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Templates table (for D+1, D+3, D+7)
  db.run(`
    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      day INTEGER NOT NULL CHECK (day IN (1, 3, 7)),
      subject TEXT NOT NULL,
      body TEXT NOT NULL
    )
  `);

  // Email schedules table to track what emails are scheduled for each lead
  db.run(`
    CREATE TABLE IF NOT EXISTS email_schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER NOT NULL,
      day INTEGER NOT NULL CHECK (day IN (1, 3, 7)),
      scheduled_date DATETIME NOT NULL,
      sent BOOLEAN DEFAULT 0,
      FOREIGN KEY (lead_id) REFERENCES leads(id)
    )
  `);

  // Settings table for SMTP config
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      smtp_host TEXT,
      smtp_port INTEGER,
      smtp_user TEXT,
      smtp_pass TEXT,
      from_email TEXT
    )
  `);

  // Insert default templates if not exist - apenas 1 de cada tipo
  db.get('SELECT COUNT(*) as count FROM templates', (err, row) => {
    if (err || row.count > 0) return; // Só insere se não houver templates

    const stmt = db.prepare(`
      INSERT INTO templates (name, day, subject, body)
      VALUES (?, ?, ?, ?)
    `);

    // D+1 - Primeiro contato
    stmt.run('Follow-up Inicial', 1,
      'Obrigado pelo seu interesse, [Nome]!',
      'Olá [Nome],\n\nObrigado por demonstrar interesse! Ficamos felizes em saber que está à procura de soluções.\n\nEstamos à disposição para responder qualquer dúvida que possa ter. Que tal agendarmos uma conversa?\n\nAtenciosamente,\nSua Equipe'
    );

    // D+3 - Lembrete com valor agregado
    stmt.run('Follow-up D+3', 3,
      '[Nome], temos recursos úteis para você',
      'Olá [Nome],\n\nEsperamos que esteja tendo uma excelente semana! Sabemos que está avaliando as opções, por isso preparamos alguns recursos que podem ajudar.\n\nTem alguma questão específica? Estamos aqui para ajudar.\n\nAtenciosamente,\nSua Equipe'
    );

    // D+7 - Última oportunidade
    stmt.run('Follow-up Final D+7', 7,
      'Última oportunidade, [Nome]',
      'Olá [Nome],\n\nEsperamos que esteja tudo bem. Este é nosso último contato sobre este assunto.\n\nSe ainda estiver interessado, ficaremos felizes em conversar. Basta responder a este email.\n\nAtenciosamente,\nSua Equipe'
    );

    stmt.finalize();
  });
});

module.exports = db;
