# 📧 Micro SaaS - Automated Lead Follow-up System

Complete lead management and automated follow-up system with sequential email campaigns (D+1, D+3, D+7).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node](https://img.shields.io/badge/Node.js-Backend-green)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3.2-blue)

## ✨ Features

- 🎯 **Lead Management**: Add, edit, and track your leads
- 📧 **Customizable Templates**: Create email templates for D+1, D+3, and D+7
- ⚡ **Automatic Sending**: Emails are sent automatically on scheduled days
- 🎨 **Modern Interface**: Beautiful autumn-themed design using Tailwind CSS
- ✅ **Lead Status**: Mark leads as "Pending", "Booked", or "Not Interested"
- 📝 **Personalization**: Use `[Name]` in templates to personalize emails
- 🔄 **Synchronization**: Frontend and backend running together with a single command

## 🚀 Technologies

### Frontend
- React 18.2.0
- Tailwind CSS 3.3.2
- Axios for HTTP requests
- Responsive and modern design

### Backend
- Node.js with Express
- SQLite (lightweight database)
- Node-cron for scheduling
- Nodemailer for email sending
- CORS enabled

## 📋 Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Email account with SMTP (Gmail, Outlook, etc.)

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/micro-saas.git
cd micro-saas
```

2. **Install dependencies**
```bash
# Install root project dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Return to root
cd ..
```

3. **Configure environment variables**

Create a `.env` file in the `server` folder:
```env
ALLOWED_ORIGINS=http://localhost:3000
```

Create a `.env` file in the `client` folder:
```env
REACT_APP_API_BASE=http://localhost:3001/api
```

4. **Start the project**
```bash
# In the project root folder
npm start
```

This will automatically start:
- **Backend** at `http://localhost:3001`
- **Frontend** at `http://localhost:3000`

## ⚙️ SMTP Configuration

1. Access the **Settings** tab in the application
2. Fill in your SMTP server details:
   - **SMTP Host**: Ex: `smtp.gmail.com`
   - **SMTP Port**: Ex: `587` (TLS) or `465` (SSL)
   - **SMTP User**: Your email
   - **SMTP Password**: App password or email password
   - **FROM Email**: Sender email

### Gmail
To use Gmail, you need to:
1. Enable "2-Step Verification"
2. Generate an "App Password" at https://myaccount.google.com/apppasswords
3. Use this password in the SMTP Password field

## 📖 How to Use

### 1. Add Leads
- Go to the **Leads** tab
- Fill in the lead's name and email
- Click **Add Lead**

### 2. Manage Templates
- Go to the **Templates** tab
- Click **➕ D+1**, **➕ D+3**, or **➕ D+7** to create new templates
- Edit existing templates directly in the fields
- Use `[Name]` in the subject or body to personalize with the lead's name

### 3. Track Status
- In the leads table, change the status as needed:
  - **⏳ Pending**: Lead awaiting response
  - **✅ Booked**: Lead scheduled meeting/purchase
  - **❌ Not Interested**: Lead showed no interest

### 4. Automatic Emails
Emails are sent automatically:
- **D+1**: 1 day after adding the lead
- **D+3**: 3 days after adding the lead
- **D+7**: 7 days after adding the lead

## 🗂️ Project Structure

```
micro-saas/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js         # Main component
│   │   ├── index.js       # Entry point
│   │   └── index.css      # Tailwind styles
│   ├── tailwind.config.js # Tailwind configuration
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Express server
│   ├── database.js        # SQLite configuration
│   └── package.json
├── package.json           # Project scripts
└── README.md
```

## 🎨 Customization

### Theme Colors
The project uses an autumn theme. To change it, edit `client/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      // Add your custom colors here
    }
  }
}
```

### Default Templates
Initial templates are in `server/database.js`. You can change them before the first run.

## 🐛 Troubleshooting

### Port 3000 is already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Emails are not being sent
1. Check SMTP settings
2. Make sure the app password is correct (Gmail)
3. Check if the firewall is not blocking the SMTP port

### Tailwind is not working
```bash
cd client
rm -rf node_modules/.cache build
npm start
```

## 📝 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💡 Ideas for Improvements

- [ ] User authentication
- [ ] Dashboard with statistics
- [ ] Report export in PDF/CSV
- [ ] CRM integration
- [ ] Multiple sales funnels
- [ ] A/B testing for templates
- [ ] Webhooks for integrations
- [ ] Dark mode

## 📞 Support

If you encounter any issues or have suggestions, please open an [issue](https://github.com/your-username/micro-saas/issues).

---

Developed with ❤️ using React, Node.js, and Tailwind CSS
