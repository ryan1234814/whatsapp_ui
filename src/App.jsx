import React, { useState } from 'react';
import { MessageCircle, Key, Phone, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import './App.css';

function App() {
  const [phoneId, setPhoneId] = useState('');
  const [token, setToken] = useState('');
  const [targetPhone, setTargetPhone] = useState('');
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!phoneId || !token || !targetPhone) {
      setStatus({ type: 'error', message: 'Please fill in all fields to send a message.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: targetPhone,
          type: 'text',
          text: { body: 'Hi' }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to send message');
      }

      setStatus({ type: 'success', message: 'Message "Hi" sent successfully!' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <div className="header">
          <MessageCircle className="header-icon" />
          <h1 className="title">WhatsApp Sandbox</h1>
          <p className="subtitle">Send test messages via Meta Graph API</p>
        </div>

        <div className="form-group">
          <label className="label">Access Token</label>
          <div className="input-container">
            <Key className="input-icon" />
            <input 
              type="text" 
              className="input" 
              placeholder="EAAI..." 
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="label">Phone Number ID</label>
          <div className="input-container">
            <Phone className="input-icon" />
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. 10123456789" 
              value={phoneId}
              onChange={(e) => setPhoneId(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="label">Target Phone Number</label>
          <div className="input-container">
            <Phone className="input-icon" />
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. 15551234567" 
              value={targetPhone}
              onChange={(e) => setTargetPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="button-container">
          <button 
            className="btn-send"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" />
                Sending...
              </>
            ) : (
              <>
                <Send size={20} />
                Say "Hi"
              </>
            )}
          </button>
        </div>

        {status && (
          <div className={`status-message status-${status.type}`}>
            {status.type === 'success' ? <CheckCircle2 size={20} className="flex-shrink-0" /> : <AlertCircle size={20} className="flex-shrink-0" />}
            <div>{status.message}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
