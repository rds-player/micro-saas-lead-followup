import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001/api';

function App() {
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [settings, setSettings] = useState({});
  const [error, setError] = useState(null);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTemplateDay, setNewTemplateDay] = useState(null);

  useEffect(() => {
    fetchLeads();
    fetchTemplates();
    fetchSettings();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${API_BASE}/leads`);
      setLeads(res.data || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar leads:', err);
      setError('Erro ao carregar leads. Verifique se o servidor está rodando.');
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${API_BASE}/templates`);
      setTemplates(res.data || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar templates:', err);
      setError('Erro ao carregar templates.');
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/settings`);
      setSettings(res.data || {});
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar configurações:', err);
      setError('Erro ao carregar configurações.');
    }
  };

  const addLead = async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      await axios.post(`${API_BASE}/leads`, { name: form.name.value, email: form.email.value });
      form.reset();
      fetchLeads();
      setError(null);
    } catch (err) {
      console.error('Erro ao adicionar lead:', err);
      setError('Erro ao adicionar lead. Tente novamente.');
    }
  };

  const updateLeadStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE}/leads/${id}`, { status });
      fetchLeads();
      setError(null);
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      setError('Erro ao atualizar status do lead.');
    }
  };

  const updateTemplate = async (id, subject, body) => {
    try {
      await axios.put(`${API_BASE}/templates/${id}`, { subject, body });
      fetchTemplates();
      setError(null);
    } catch (err) {
      console.error('Erro ao atualizar template:', err);
      setError('Erro ao atualizar template.');
    }
  };

  const openAddModal = (day) => {
    setNewTemplateDay(day);
    setShowAddModal(true);
  };

  const addTemplate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const subject = form.subject.value;
    const body = form.body.value;

    try {
      await axios.post(`${API_BASE}/templates`, { name, day: newTemplateDay, subject, body });
      fetchTemplates();
      setShowAddModal(false);
      form.reset();
      setError(null);
    } catch (err) {
      console.error('Erro ao adicionar template:', err);
      setError('Erro ao adicionar template.');
    }
  };

  const deleteTemplate = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este template?')) return;

    try {
      await axios.delete(`${API_BASE}/templates/${id}`);
      fetchTemplates();
      setSelectedTemplates([]);
      setError(null);
    } catch (err) {
      console.error('Erro ao deletar template:', err);
      setError('Erro ao deletar template.');
    }
  };

  const toggleTemplateSelection = (id) => {
    setSelectedTemplates(prev =>
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTemplates.length === templates.length) {
      setSelectedTemplates([]);
    } else {
      setSelectedTemplates(templates.map(t => t.id));
    }
  };

  const deleteSelectedTemplates = async () => {
    if (selectedTemplates.length === 0) {
      alert('Selecione pelo menos um template para deletar');
      return;
    }

    if (!window.confirm(`Tem certeza que deseja deletar ${selectedTemplates.length} template(s)?`)) return;

    try {
      await Promise.all(selectedTemplates.map(id => axios.delete(`${API_BASE}/templates/${id}`)));
      fetchTemplates();
      setSelectedTemplates([]);
      setError(null);
    } catch (err) {
      console.error('Erro ao deletar templates:', err);
      setError('Erro ao deletar templates.');
    }
  };

  const updateSettings = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      smtp_host: form.smtp_host.value,
      smtp_port: form.smtp_port.value,
      smtp_user: form.smtp_user.value,
      smtp_pass: form.smtp_pass.value,
      from_email: form.from_email.value
    };
    try {
      await axios.put(`${API_BASE}/settings`, data);
      alert('Configurações atualizadas com sucesso!');
      setError(null);
    } catch (err) {
      console.error('Erro ao atualizar configurações:', err);
      setError('Erro ao atualizar configurações.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Floating background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl animate-pulse delay-75"></div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header com design moderno */}
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-3xl blur-2xl opacity-40 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-3xl shadow-2xl p-8 md:p-12 transform hover:scale-[1.02] transition-all duration-500">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-[250px]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                      <span className="text-6xl">🍂</span>
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                        Micro-SaaS
                      </h1>
                      <h2 className="text-xl md:text-2xl font-bold text-amber-100">
                        Follow-up de Leads
                      </h2>
                    </div>
                  </div>
                  <p className="text-amber-50 text-base md:text-lg font-medium leading-relaxed">
                    Automatize seu follow-up e converta mais leads em clientes com sequências inteligentes de emails
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="flex gap-4 flex-wrap">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg hover:bg-white/20 transition-all">
                    <div className="text-3xl font-bold text-white">{leads.length}</div>
                    <div className="text-xs text-amber-100 uppercase tracking-wide">Total Leads</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg hover:bg-white/20 transition-all">
                    <div className="text-3xl font-bold text-white">{templates.length}</div>
                    <div className="text-xs text-amber-100 uppercase tracking-wide">Templates</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-amber-100/50 overflow-hidden">
            <div className="p-8">
              {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-600 text-red-800 px-6 py-4 rounded-lg shadow-md">
              <strong className="font-bold flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                Erro:
              </strong>
              <span className="block mt-1">{error}</span>
            </div>
          )}

          {/* Tabs com tema de outono */}
          <div className="flex gap-4 mb-8 bg-gradient-to-r from-amber-100 to-orange-100 p-2 rounded-xl shadow-inner">
            <button
              onClick={() => setActiveTab('leads')}
              className={`flex-1 px-6 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'leads'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white text-amber-800 hover:bg-amber-50 shadow'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-xl">👥</span>
                Leads
              </span>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 px-6 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'templates'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white text-amber-800 hover:bg-amber-50 shadow'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-xl">📧</span>
                Templates
              </span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-6 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white text-amber-800 hover:bg-amber-50 shadow'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-xl">⚙️</span>
                Configurações
              </span>
            </button>
          </div>

          {activeTab === 'leads' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700 flex items-center gap-3">
                <span className="text-4xl">🎯</span>
                Gerenciar Leads
              </h2>

              {/* Formulário com tema de outono */}
              <form onSubmit={addLead} className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-xl shadow-lg border-2 border-amber-200 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <span>👤</span> Nome:
                  </label>
                  <input
                    name="name"
                    required
                    className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-4 focus:ring-amber-400 focus:border-amber-500 transition-all shadow-sm bg-white"
                    placeholder="Digite o nome do lead..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <span>📧</span> Email:
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-4 focus:ring-amber-400 focus:border-amber-500 transition-all shadow-sm bg-white"
                    placeholder="exemplo@email.com"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <span className="text-xl">➕</span>
                  Adicionar Lead
                </button>
              </form>
              {/* Tabela de Leads com tema de outono */}
              <div className="bg-white border-2 border-amber-200 rounded-xl overflow-hidden shadow-xl">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-amber-100 to-orange-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-amber-900 uppercase tracking-wider">
                        👤 Nome
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-amber-900 uppercase tracking-wider">
                        📧 Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-amber-900 uppercase tracking-wider">
                        📊 Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-amber-900 uppercase tracking-wider">
                        ⚡ Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y-2 divide-amber-100">
                    {leads.map((lead, index) => (
                      <tr key={lead.id} className={`hover:bg-amber-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-amber-50/30'}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {lead.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {lead.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-full shadow-md ${
                              lead.status === 'booked'
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                : lead.status === 'no_interest'
                                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
                                : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                            }`}
                          >
                            {lead.status === 'booked' ? '✅ Marcado' : lead.status === 'no_interest' ? '❌ Sem Interesse' : '⏳ Pendente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <select
                            value={lead.status}
                            onChange={e => updateLeadStatus(lead.id, e.target.value)}
                            className="border-2 border-amber-300 rounded-lg px-4 py-2 focus:ring-4 focus:ring-amber-400 focus:border-amber-500 font-medium text-amber-900 bg-white shadow-sm hover:bg-amber-50 transition-all"
                          >
                            <option value="pending">⏳ Pendente</option>
                            <option value="booked">✅ Marcado</option>
                            <option value="no_interest">❌ Sem Interesse</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700 flex items-center gap-3">
                  <span className="text-4xl">📝</span>
                  Gerenciar Templates
                </h2>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={toggleSelectAll}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                  >
                    <span>{selectedTemplates.length === templates.length && templates.length > 0 ? '☑️' : '☐'}</span>
                    {selectedTemplates.length === templates.length && templates.length > 0 ? 'Desmarcar Todos' : 'Selecionar Todos'}
                  </button>
                  {selectedTemplates.length > 0 && (
                    <button
                      onClick={deleteSelectedTemplates}
                      className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                    >
                      <span>🗑️</span> Deletar Selecionados ({selectedTemplates.length})
                    </button>
                  )}
                  <button
                    onClick={() => openAddModal(1)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                  >
                    <span>➕</span> D+1
                  </button>
                  <button
                    onClick={() => openAddModal(3)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                  >
                    <span>➕</span> D+3
                  </button>
                  <button
                    onClick={() => openAddModal(7)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                  >
                    <span>➕</span> D+7
                  </button>
                </div>
              </div>
              {templates.map((template) => (
                <div key={template.id} className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-xl shadow-lg border-2 border-amber-200 space-y-6 transform transition-all hover:scale-[1.02]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedTemplates.includes(template.id)}
                        onChange={() => toggleTemplateSelection(template.id)}
                        className="w-6 h-6 text-amber-600 bg-white border-2 border-amber-300 rounded focus:ring-4 focus:ring-amber-400 cursor-pointer"
                      />
                      <h3 className="text-2xl font-bold text-amber-900 flex items-center gap-2 bg-gradient-to-r from-amber-200 to-orange-200 px-4 py-2 rounded-lg">
                        <span className="text-3xl">📅</span>
                        D+{template.day} - {template.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                    >
                      <span>🗑️</span> Deletar
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                      <span>✉️</span> Assunto do Email:
                    </label>
                    <input
                      type="text"
                      defaultValue={template.subject}
                      onBlur={e => updateTemplate(template.id, e.target.value, template.body)}
                      className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-4 focus:ring-amber-400 focus:border-amber-500 transition-all shadow-sm bg-white font-medium"
                      placeholder="Digite o assunto..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                      <span>📄</span> Corpo da Mensagem:
                    </label>
                    <textarea
                      defaultValue={template.body}
                      onBlur={e => updateTemplate(template.id, template.subject, e.target.value)}
                      className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-4 focus:ring-amber-400 focus:border-amber-500 transition-all shadow-sm bg-white h-40 font-medium resize-none"
                      placeholder="Digite o corpo do email... Use [Nome] para personalizar."
                    ></textarea>
                    <p className="text-xs text-amber-700 mt-2 flex items-center gap-1">
                      <span>💡</span> <strong>Dica:</strong> Use <code className="bg-amber-200 px-2 py-1 rounded">[Nome]</code> para inserir o nome do lead automaticamente.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700 flex items-center gap-3">
                <span className="text-4xl">⚙️</span>
                Configurações SMTP
              </h2>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                <p className="text-blue-800 flex items-start gap-3">
                  <span className="text-2xl">ℹ️</span>
                  <span>
                    <strong className="block mb-1">Configure seu servidor SMTP</strong>
                    <span className="text-sm">Estas configurações são necessárias para enviar emails automáticos aos seus leads. Use as credenciais do seu provedor de email (Gmail, Outlook, etc.).</span>
                  </span>
                </p>
              </div>

              <form onSubmit={updateSettings} className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-xl shadow-lg border-2 border-amber-200 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                      <span>🌐</span> SMTP Host:
                    </label>
                    <input
                      name="smtp_host"
                      defaultValue={settings.smtp_host || ''}
                      className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-4 focus:ring-amber-400 focus:border-amber-500 transition-all shadow-sm bg-white font-medium"
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                      <span>🔌</span> SMTP Port:
                    </label>
                    <input
                      name="smtp_port"
                      type="number"
                      defaultValue={settings.smtp_port || ''}
                      className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-4 focus:ring-amber-400 focus:border-amber-500 transition-all shadow-sm bg-white font-medium"
                      placeholder="587"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <span>👤</span> SMTP User (Username):
                  </label>
                  <input
                    name="smtp_user"
                    defaultValue={settings.smtp_user || ''}
                    className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-4 focus:ring-amber-400 focus:border-amber-500 transition-all shadow-sm bg-white font-medium"
                    placeholder="seu-email@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <span>🔒</span> SMTP Password:
                  </label>
                  <input
                    name="smtp_pass"
                    type="password"
                    defaultValue={settings.smtp_pass || ''}
                    className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-4 focus:ring-amber-400 focus:border-amber-500 transition-all shadow-sm bg-white font-medium"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <span>📧</span> FROM Email (Remetente):
                  </label>
                  <input
                    name="from_email"
                    defaultValue={settings.from_email || ''}
                    className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-4 focus:ring-amber-400 focus:border-amber-500 transition-all shadow-sm bg-white font-medium"
                    placeholder="seu-email@gmail.com"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                >
                  <span className="text-xl">💾</span>
                  Salvar Configurações
                </button>
              </form>
            </div>
          )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para adicionar template */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-3xl">📝</span>
                  Novo Template D+{newTemplateDay}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>
            </div>

            <form onSubmit={addTemplate} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <span>🏷️</span> Nome do Template:
                </label>
                <input
                  name="name"
                  required
                  className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-4 focus:ring-amber-400 focus:border-amber-500 transition-all shadow-sm bg-white font-medium"
                  placeholder="Ex: Follow-up Inicial"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <span>✉️</span> Assunto do Email:
                </label>
                <input
                  name="subject"
                  required
                  className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-4 focus:ring-amber-400 focus:border-amber-500 transition-all shadow-sm bg-white font-medium"
                  placeholder="Ex: Obrigado pelo seu interesse, [Nome]!"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <span>📄</span> Corpo da Mensagem:
                </label>
                <textarea
                  name="body"
                  required
                  rows="8"
                  className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-4 focus:ring-amber-400 focus:border-amber-500 transition-all shadow-sm bg-white font-medium resize-none"
                  placeholder="Olá [Nome],&#10;&#10;Digite a mensagem do email aqui...&#10;&#10;Use [Nome] para personalizar com o nome do lead."
                ></textarea>
                <p className="text-xs text-amber-700 mt-2 flex items-center gap-1">
                  <span>💡</span> <strong>Dica:</strong> Use <code className="bg-amber-200 px-2 py-1 rounded">[Nome]</code> para inserir o nome do lead automaticamente.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <span>➕</span>
                  Criar Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
