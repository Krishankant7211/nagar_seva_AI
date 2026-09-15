import React, { useState } from 'react';
import { Send, Image, MapPin, CheckCheck, Bot, Sparkles, Smartphone, Phone, Video, MoreVertical } from 'lucide-react';
import { analyzeCivicReport } from '../services/aiEngine';

export default function WhatsAppSimulator({ onSubmitReport }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '👋 Namaste! Welcome to MyCity AI WhatsApp Civic Assistance. You can report potholes, water leaks, garbage or streetlights by sending a photo or text message.',
      time: '10:00 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [pendingDraft, setPendingDraft] = useState(null);

  const QUICK_PROMPTS = [
    { label: '📸 Photo of Pothole (Sector 15)', text: 'Pothole near Sector 15 school', type: 'pothole', image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80' },
    { label: '📸 Photo of Water Burst (Sector 22)', text: 'Underground water pipe burst', type: 'water', image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80' },
    { label: '📸 Photo of Trash Pile (Ward 12)', text: 'Garbage dumping on sidewalk', type: 'garbage', image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80' }
  ];

  const handleSend = (textToSend = inputText, imageToSend = null) => {
    if (!textToSend.trim() && !imageToSend) return;

    const userMsgTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Push User Message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      image: imageToSend,
      time: userMsgTime
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Check if user is confirming a pending draft ("yes" / "confirm")
    if (pendingDraft && /yes|correct|confirm|yep|ha/i.test(textToSend)) {
      setTimeout(() => {
        const compId = `MYC-${Math.floor(1000 + Math.random() * 9000)}`;
        const report = {
          title: pendingDraft.aiResult.title,
          category: pendingDraft.aiResult.category,
          categoryName: pendingDraft.aiResult.categoryName,
          department: pendingDraft.aiResult.department,
          description: pendingDraft.text,
          severity: pendingDraft.aiResult.severity,
          imageUrl: pendingDraft.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
          location: {
            address: 'Sector 15, WhatsApp Auto-Captured GPS',
            zone: 'North Ward Zone A',
            lat: 28.6145,
            lng: 77.2095
          }
        };

        onSubmitReport(report);
        setPendingDraft(null);

        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: `✅ *Complaint Registered!*\n\n*Complaint ID:* ${compId}\n*Status:* Routed to ${report.department}\n*Priority Score:* AI High Priority\n\nYou will receive real-time updates right here on WhatsApp!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 700);
      return;
    }

    // Otherwise perform AI Multimodal Analysis
    setTimeout(() => {
      const aiRes = analyzeCivicReport(imageToSend || '', textToSend);
      setPendingDraft({ text: textToSend, image: imageToSend, aiResult: aiRes });

      const botReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: `🤖 *MyCity AI Detected:* ${aiRes.title}\n\n📍 *Location:* Sector 15 (Auto GPS)\n⚡ *Severity:* ${aiRes.severity.toUpperCase()}\n🏛️ *Target Dept:* ${aiRes.department}\n\nReply *YES* to register this complaint now.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botReply]);
    }, 800);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>WhatsApp AI Bot Channel</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          Zero App Installation Required — Citizens can report city problems directly via WhatsApp.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: WhatsApp Smartphone Shell */}
        <div style={{
          background: '#0b141a',
          borderRadius: '32px',
          border: '12px solid #1f2c34',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '620px',
          position: 'relative'
        }}>
          {/* WhatsApp Top Header */}
          <div style={{
            background: '#202c33',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#00a884',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700
              }}>
                <Bot size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e9edef' }}>MyCity AI Bot</div>
                <div style={{ fontSize: '0.75rem', color: '#8696a0' }}>Official Municipal Service</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', color: '#aebac1' }}>
              <Phone size={18} />
              <Video size={18} />
              <MoreVertical size={18} />
            </div>
          </div>

          {/* WhatsApp Chat Log Area */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundImage: 'radial-gradient(#111b21 1px, transparent 0)',
            backgroundSize: '16px 16px'
          }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  background: msg.sender === 'user' ? '#005c4b' : '#202c33',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  color: '#e9edef',
                  fontSize: '0.85rem',
                  lineHeight: '1.4',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}
              >
                {msg.image && (
                  <img 
                    src={msg.image} 
                    alt="Uploaded attachment"
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '6px' }}
                  />
                )}
                <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                <div style={{
                  fontSize: '0.65rem',
                  color: '#8696a0',
                  textAlign: 'right',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '4px'
                }}>
                  {msg.time}
                  {msg.sender === 'user' && <CheckCheck size={12} color="#53bdeb" />}
                </div>
              </div>
            ))}
          </div>

          {/* Input Footer */}
          <div style={{
            background: '#202c33',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <input
              type="text"
              placeholder="Type message or reply YES..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1,
                background: '#2a3942',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#e9edef',
                outline: 'none',
                fontSize: '0.85rem'
              }}
            />
            <button
              onClick={() => handleSend()}
              style={{
                background: '#00a884',
                border: 'none',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Right Column: Demo Simulator Instructions */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="#10b981" /> Test WhatsApp Simulator
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>
              Tap any quick prompt below to simulate a citizen sending a WhatsApp photo message to the MyCity AI bot:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {QUICK_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.text, p.image)}
                  style={{
                    background: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    color: 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{p.label}</span>
                  <Send size={14} color="#10b981" />
                </button>
              ))}
            </div>

            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '0.8rem',
              color: '#6ee7b7'
            }}>
              <strong>Key Solution Feature:</strong> Anyone with WhatsApp can report issues instantly without downloading an app. The AI bot processes the image, classifies severity, registers GPS location, and pushes it directly to the Authority Dashboard!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
