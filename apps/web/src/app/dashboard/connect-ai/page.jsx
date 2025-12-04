"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Copy, Check, ExternalLink, Bot } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";

export default function ConnectAIPage() {
  const [user, setUser] = useState(null);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("therraUser");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const webhookUrl = `https://therra-bot.up.railway.app/webhook`;
  const botToken = user?.id
    ? `THERRA_${user.id}_${Date.now().toString(36)}`
    : "Loading...";

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "webhook") {
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    } else {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const whatsappScript = `# WhatsApp Bot Setup

## 1. Install Dependencies
npm install whatsapp-web.js qrcode-terminal

## 2. Create bot.js
\`\`\`javascript
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
  console.log('Scan QR Code:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WhatsApp Bot Ready!');
});

client.on('message', async (msg) => {
  try {
    const response = await fetch('${webhookUrl}', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Bot-Token': '${botToken}'
      },
      body: JSON.stringify({
        channel: 'whatsapp',
        customerName: msg.from,
        customerPhone: msg.from,
        message: msg.body
      })
    });

    const data = await response.json();
    await msg.reply(data.response);

    // Log ke database
    await fetch('${webhookUrl}/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Bot-Token': '${botToken}'
      },
      body: JSON.stringify({
        channel: 'whatsapp',
        customerName: msg.from,
        customerMessage: msg.body,
        botResponse: data.response,
        intent: data.intent || 'general'
      })
    });
  } catch (error) {
    console.error('Error:', error);
    await msg.reply('Maaf, terjadi kesalahan. Silakan coba lagi.');
  }
});

client.initialize();
\`\`\`

## 3. Run Bot
node bot.js

## 4. Scan QR Code
Scan dengan WhatsApp Business di HP Anda
`;

  const telegramScript = `# Telegram Bot Setup

## 1. Create Bot via @BotFather
- Chat /newbot di @BotFather
- Ikuti instruksi
- Simpan Bot Token

## 2. Install Dependencies
npm install node-telegram-bot-api

## 3. Create bot.js
\`\`\`javascript
const TelegramBot = require('node-telegram-bot-api');

const TELEGRAM_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  try {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || msg.from.username;

    const response = await fetch('${webhookUrl}', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Bot-Token': '${botToken}'
      },
      body: JSON.stringify({
        channel: 'telegram',
        customerName: userName,
        customerPhone: chatId.toString(),
        message: msg.text
      })
    });

    const data = await response.json();
    await bot.sendMessage(chatId, data.response);

    // Log ke database
    await fetch('${webhookUrl}/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Bot-Token': '${botToken}'
      },
      body: JSON.stringify({
        channel: 'telegram',
        customerName: userName,
        customerMessage: msg.text,
        botResponse: data.response,
        intent: data.intent || 'general'
      })
    });
  } catch (error) {
    console.error('Error:', error);
    await bot.sendMessage(msg.chat.id, 'Maaf, terjadi kesalahan. Silakan coba lagi.');
  }
});

console.log('Telegram Bot Running!');
\`\`\`

## 4. Run Bot
node bot.js
`;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardHeader />
        <div className="p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-gradient-to-b from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center">
                  <Bot size={24} className="text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white font-inter">
                  Connect AI Bot
                </h1>
              </div>
              <p className="text-[#6E6E6E] dark:text-[#888888] font-inter">
                Hubungkan bot AI Therra ke WhatsApp atau Telegram untuk melayani
                customer Anda 24/7
              </p>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6E6E6] dark:border-[#333333] p-6 mb-6">
              <h2 className="text-lg font-bold text-black dark:text-white mb-4 font-inter">
                Bot Configuration
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#2B2B2B] dark:text-[#CCCCCC] font-inter">
                    Webhook URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={webhookUrl}
                      readOnly
                      className="flex-1 h-10 px-4 rounded-lg bg-[#F9F9F9] dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#404040] text-black dark:text-white font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(webhookUrl, "webhook")}
                      className="px-4 py-2 bg-gradient-to-b from-[#34D058] to-[#22C55E] text-white rounded-lg hover:from-[#2EC750] hover:to-[#1FB34D] transition-all duration-150 active:scale-95"
                    >
                      {copiedWebhook ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[#2B2B2B] dark:text-[#CCCCCC] font-inter">
                    Bot Token (Authentication)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={botToken}
                      readOnly
                      className="flex-1 h-10 px-4 rounded-lg bg-[#F9F9F9] dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#404040] text-black dark:text-white font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(botToken, "token")}
                      className="px-4 py-2 bg-gradient-to-b from-[#34D058] to-[#22C55E] text-white rounded-lg hover:from-[#2EC750] hover:to-[#1FB34D] transition-all duration-150 active:scale-95"
                    >
                      {copiedToken ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-inter">
                  💡 <strong>Catatan:</strong> Bot backend sudah di-host di
                  Railway. Gunakan webhook URL dan token di atas untuk
                  menghubungkan bot WhatsApp/Telegram Anda.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6E6E6] dark:border-[#333333] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare size={24} className="text-[#25D366]" />
                  <h3 className="text-lg font-bold text-black dark:text-white font-inter">
                    WhatsApp Bot
                  </h3>
                </div>

                <pre className="bg-[#F9F9F9] dark:bg-[#262626] p-4 rounded-lg overflow-x-auto text-xs font-mono text-black dark:text-white border border-[#E5E5E5] dark:border-[#404040] mb-4 max-h-[400px] overflow-y-auto">
                  {whatsappScript}
                </pre>

                <a
                  href="https://github.com/pedroslopez/whatsapp-web.js"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#1EBE56] transition-all duration-150 active:scale-95 justify-center font-inter text-sm"
                >
                  <ExternalLink size={16} />
                  WhatsApp Web.js Docs
                </a>
              </div>

              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6E6E6] dark:border-[#333333] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare size={24} className="text-[#0088CC]" />
                  <h3 className="text-lg font-bold text-black dark:text-white font-inter">
                    Telegram Bot
                  </h3>
                </div>

                <pre className="bg-[#F9F9F9] dark:bg-[#262626] p-4 rounded-lg overflow-x-auto text-xs font-mono text-black dark:text-white border border-[#E5E5E5] dark:border-[#404040] mb-4 max-h-[400px] overflow-y-auto">
                  {telegramScript}
                </pre>

                <a
                  href="https://core.telegram.org/bots"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#0088CC] text-white rounded-lg hover:bg-[#0077B3] transition-all duration-150 active:scale-95 justify-center font-inter text-sm"
                >
                  <ExternalLink size={16} />
                  Telegram Bot API Docs
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
