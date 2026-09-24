import React, { useState } from 'react';
import { MessageCircle, Check, X, Link2 } from 'lucide-react';
import { apiService } from '../../services/api';

/**
 * WhatsAppLinkModal — Optional onboarding step after identity verification.
 * Allows citizen to link their WhatsApp number for receiving complaint updates
 * and to file complaints via WhatsApp AI agent.
 */
export function WhatsAppLinkModal({ user, onLinked, onSkip }) {
  const [whatsappNumber, setWhatsappNumber] = useState(user?.phone_number || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLink = async (e) => {
    e.preventDefault();
    setError('');
    const cleaned = whatsappNumber.replace(/\s/g, '');
    if (!cleaned || cleaned.length < 10) {
      setError('Enter a valid WhatsApp number (with country code).'); return;
    }

    setLoading(true);
    try {
      const updatedUser = await apiService.linkWhatsApp(user.id, cleaned);
      setSuccess(true);
      setTimeout(() => onLinked(updatedUser), 1400);
    } catch (err) {
      setError(err.message || 'WhatsApp linking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl border border-slate-200">
        {success ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7" />
            </div>
            <p className="font-bold text-slate-800 text-sm">WhatsApp Linked!</p>
            <p className="text-xs text-slate-500">You'll now receive complaint updates on WhatsApp.</p>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Link WhatsApp</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Get complaint updates and file reports via WhatsApp AI Agent
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleLink} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">WhatsApp Number</label>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={e => setWhatsappNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-green-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <Link2 className="w-4 h-4" />
                {loading ? 'Linking...' : 'Link WhatsApp Number'}
              </button>

              <button
                type="button"
                onClick={onSkip}
                className="w-full text-xs text-slate-500 hover:text-slate-700 font-medium py-1"
              >
                Skip for now — link later in settings
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
