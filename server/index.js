const express = require('express');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const db = require('./database');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(require('cors')({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : 'http://localhost:3000',
  credentials: true
}));

// Global variables for transporter, updated when settings change
let transporter;

const updateTransporter = () => {
  db.get('SELECT * FROM settings WHERE id = 1', (err, row) => {
    if (err) return console.error('Settings load error:', err);
    if (!row || !row.smtp_host) {
      transporter = null;
      return;
    }

    const auth = row.smtp_user ? { user: row.smtp_user, pass: row.smtp_pass } : undefined;
    transporter = nodemailer.createTransport({
      host: row.smtp_host,
      port: row.smtp_port || 587,
      secure: Number(row.smtp_port) === 465,
      auth,
    });
  });
};

// Send email function
const sendEmail = (to, subject, text, callback) => {
  if (!transporter) return callback('SMTP not configured');

  db.get('SELECT from_email FROM settings WHERE id=1', (err, row) => {
    if (err) return callback(err);
    if (!row) return callback('Settings not found');

    transporter.sendMail({
      from: row.from_email,
      to,
      subject,
      text,
    }, callback);
  });
};

// API Routes

// Leads
app.get('/api/leads', (req, res) => {
  db.all('SELECT * FROM leads ORDER BY added_date DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/leads', (req, res) => {
  const { name, email } = req.body;

  // Validação de input
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
  if (typeof name !== 'string' || typeof email !== 'string') {
    return res.status(400).json({ error: 'Invalid data type' });
  }
  if (name.trim().length === 0 || email.trim().length === 0) {
    return res.status(400).json({ error: 'Name and email cannot be empty' });
  }

  // Validação de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Insert lead
  db.run('INSERT INTO leads (name, email) VALUES (?, ?)', [name.trim(), email.trim()], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    const leadId = this.lastID;

    const addedDate = new Date();
    const schedules = [
      { day: 1, date: new Date(addedDate.getTime() + 24 * 60 * 60 * 1000) },
      { day: 3, date: new Date(addedDate.getTime() + 3 * 24 * 60 * 60 * 1000) },
      { day: 7, date: new Date(addedDate.getTime() + 7 * 24 * 60 * 60 * 1000) },
    ];

    // Insert schedules
    schedules.forEach(s => {
      db.run('INSERT INTO email_schedules (lead_id, day, scheduled_date) VALUES (?, ?, ?)',
        [leadId, s.day, s.date.toISOString()],
        function(err2) {
          if (err2) console.error('Insert schedule error:', err2);
        });
    });

    res.json({ id: leadId });
  });
});

app.put('/api/leads/:id', (req, res) => {
  const { status } = req.body;
  if (!['pending', 'booked', 'no_interest'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.run('UPDATE leads SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json({ message: 'Updated' });
  });
});

// Templates
app.get('/api/templates', (req, res) => {
  db.all('SELECT * FROM templates ORDER BY day, id', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/templates', (req, res) => {
  const { name, day, subject, body } = req.body;

  // Validação de input
  if (!name || !day || !subject || !body) {
    return res.status(400).json({ error: 'Name, day, subject and body required' });
  }
  if (![1, 3, 7].includes(Number(day))) {
    return res.status(400).json({ error: 'Day must be 1, 3, or 7' });
  }

  db.run(
    'INSERT INTO templates (name, day, subject, body) VALUES (?, ?, ?, ?)',
    [name, day, subject, body],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Template created' });
    }
  );
});

app.put('/api/templates/:id', (req, res) => {
  const { subject, body } = req.body;

  // Validação de input
  if (!subject || !body) {
    return res.status(400).json({ error: 'Subject and body required' });
  }
  if (typeof subject !== 'string' || typeof body !== 'string') {
    return res.status(400).json({ error: 'Invalid data type' });
  }

  db.run('UPDATE templates SET subject = ?, body = ? WHERE id = ?', [subject, body, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Template not found' });
    res.json({ message: 'Updated' });
  });
});

app.delete('/api/templates/:id', (req, res) => {
  db.run('DELETE FROM templates WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Template not found' });
    res.json({ message: 'Template deleted' });
  });
});

// Reset templates (recreate with new content)
app.post('/api/templates/reset', (req, res) => {
  db.run('DELETE FROM templates', (err) => {
    if (err) return res.status(500).json({ error: err.message });

    const stmt = db.prepare(`
      INSERT INTO templates (name, day, subject, body)
      VALUES (?, ?, ?, ?)
    `);

    // D+1 - Primeiro contato
    stmt.run('Follow-up Inicial', 1,
      'Obrigado pelo seu interesse, [Nome]!',
      'Olá [Nome],\n\nObrigado por demonstrar interesse nos nossos serviços! Ficamos felizes em saber que está à procura de soluções que podem fazer a diferença.\n\nEstamos à disposição para responder qualquer dúvida que possa ter. Que tal agendarmos uma conversa rápida?\n\nCordialmente,\nEquipa de Atendimento'
    );

    // D+3 - Lembrete com valor agregado
    stmt.run('Partilha de Recursos Úteis', 3,
      '[Nome], preparámos algo especial para si',
      'Olá [Nome],\n\nEsperamos que esteja a ter uma excelente semana! Sabemos que está a avaliar as suas opções, por isso preparámos alguns recursos que podem ajudar na sua decisão.\n\nTem alguma questão específica sobre como podemos ajudar? Estamos aqui para esclarecer.\n\nMelhores cumprimentos,\nEquipa de Atendimento'
    );

    // D+7 - Última oportunidade com urgência
    stmt.run('Última Oportunidade', 7,
      'Última oportunidade, [Nome]',
      'Olá [Nome],\n\nNão queríamos que perdesse esta oportunidade! Este é o nosso último contacto antes de fecharmos a lista de novos clientes para este mês.\n\nSe ainda está interessado, adoraríamos conversar consigo. Basta responder a este email ou agendar uma chamada.\n\nÀ sua disposição,\nEquipa de Atendimento'
    );

    stmt.finalize((err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Templates reset successfully' });
    });
  });
});

// Settings
app.get('/api/settings', (req, res) => {
  db.get('SELECT * FROM settings WHERE id = 1', (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row || {});
  });
});

app.put('/api/settings', (req, res) => {
  const { smtp_host, smtp_port, smtp_user, smtp_pass, from_email } = req.body;

  // Validação de input
  if (!smtp_host || !smtp_port || !from_email) {
    return res.status(400).json({ error: 'SMTP host, port, and from_email are required' });
  }

  // Validação de tipos
  if (typeof smtp_host !== 'string' || typeof from_email !== 'string') {
    return res.status(400).json({ error: 'Invalid data type for host or email' });
  }

  // Validação de porta
  const port = Number(smtp_port);
  if (isNaN(port) || port < 1 || port > 65535) {
    return res.status(400).json({ error: 'Invalid port number' });
  }

  // Validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(from_email)) {
    return res.status(400).json({ error: 'Invalid from_email format' });
  }

  db.run(`
    INSERT OR REPLACE INTO settings (id, smtp_host, smtp_port, smtp_user, smtp_pass, from_email)
    VALUES (1, ?, ?, ?, ?, ?)
  `, [smtp_host, port, smtp_user, smtp_pass, from_email], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    updateTransporter();
    res.json({ message: 'Updated' });
  });
});

// Cron job to send scheduled emails
cron.schedule('* * * * *', () => { // every minute for demo, in prod use daily
  const now = new Date().toISOString();
  db.all(`
    SELECT es.*, l.name, l.email, t.subject, t.body
    FROM email_schedules es
    JOIN leads l ON es.lead_id = l.id
    JOIN templates t ON t.day = es.day
    WHERE es.sent = 0 AND es.scheduled_date <= ?
  `, [now], (err, rows) => {
    if (err) {
      console.error('Cron error:', err);
      return;
    }
    if (!rows || rows.length === 0) return;

    rows.forEach(row => {
      const body = row.body.replace(/\[Nome\]/g, row.name);
      sendEmail(row.email, row.subject, body, (err) => {
        if (err) console.error('Send email error:', err);
        else {
          db.run('UPDATE email_schedules SET sent = 1 WHERE id = ?', [row.id]);
        }
      });
    });
  });
});

// Start server after db init
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  updateTransporter();
});
