"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  X,
  MessageSquare,
  Book,
  Church,
  Heart,
  HelpCircle,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Dear brother/sister, peace be with you! I'm your TSEDK AI assistant, here to help with questions about Ethiopian Orthodox traditions, scripture, donations, church activities, and platform guidance. How may I serve you today?",
      timestamp: new Date(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = getAIResponse(newUserMessage.content);
      const newAIMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newAIMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("donation") || lowerMessage.includes("donate")) {
      return "Donations are a blessed way to support our church community. You can make donations through the Campaigns section. Each campaign shows its progress and specific needs. Would you like guidance on which campaigns are currently active?";
    }

    if (lowerMessage.includes("aserat") || lowerMessage.includes("tithe")) {
      return "Aserat (tithing) is a sacred practice in our Orthodox tradition. You can manage your tithes in the Aserat section, where you can view your giving history and set up planned contributions. The platform calculates your progress toward spiritual commitments.";
    }

    if (lowerMessage.includes("selet") || lowerMessage.includes("vow")) {
      return "Selet (spiritual vows) are personal commitments to God. In the Selet section, you can track your vows, set reminders, and mark progress. Each vow can have specific prayer commitments, fasting periods, or charitable acts.";
    }

    if (
      lowerMessage.includes("gbir") ||
      lowerMessage.includes("contribution")
    ) {
      return "Gbir refers to annual contributions that support church operations and community needs. You can register for annual giving programs and track your contributions in the Gbir section. This helps ensure our church community's sustainability.";
    }

    if (lowerMessage.includes("church") || lowerMessage.includes("orthodox")) {
      return "Our Ethiopian Orthodox Tewahedo Church has rich traditions spanning centuries. Each church community on TSEDK maintains its unique character while sharing our common faith. You can explore different church activities and connect with your spiritual family.";
    }

    if (lowerMessage.includes("prayer") || lowerMessage.includes("fast")) {
      return "Prayer and fasting are pillars of our Orthodox spiritual life. The platform can send you reminders for fasting periods, prayer times, and special feast days. Would you like me to help you set up spiritual reminders?";
    }

    if (lowerMessage.includes("help") || lowerMessage.includes("how")) {
      return "I'm here to guide you through TSEDK! You can navigate between sections using the sidebar: Dashboard for overview, Campaigns for donations, Aserat for tithes, Selet for vows, Gbir for annual contributions, and Notifications for updates. What specific area would you like help with?";
    }

    if (lowerMessage.includes("profile") || lowerMessage.includes("account")) {
      return "Your profile contains your church membership information and preferences. You can update your home church, language settings, and notification preferences. Keeping your profile current helps you receive relevant updates from your church community.";
    }

    return "Thank you for your question. As your spiritual assistant, I can help with donations, tithes (Aserat), vows (Selet), annual contributions (Gbir), church activities, and Orthodox traditions. Could you please rephrase your question or let me know which area you'd like guidance on?";
  };

  const quickActions = [
    {
      icon: Heart,
      label: "Donation Guide",
      action: () => setInputMessage("How do I make a donation?"),
    },
    {
      icon: Church,
      label: "Church Activities",
      action: () => setInputMessage("What church activities are available?"),
    },
    {
      icon: Book,
      label: "Orthodox Traditions",
      action: () => setInputMessage("Tell me about Orthodox traditions"),
    },
    {
      icon: HelpCircle,
      label: "Platform Help",
      action: () => setInputMessage("How do I use this platform?"),
    },
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex">
      <Sidebar />

      <main className="flex-1 ml-72 flex flex-col">
        <div className="p-8 border-b border-[var(--color-border)]">
          <PageHeader title="AI Assistant" />
          <p className="text-[var(--color-text-muted)] font-body mt-2">
            Your spiritual guide for Ethiopian Orthodox traditions and platform
            assistance
          </p>
        </div>

        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Quick Actions */}
          <div className="p-6 border-b border-[var(--color-border)]">
            <h3 className="font-display text-sm font-semibold text-[var(--color-text)] mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={action.action}
                  className="flex items-center gap-2 justify-start">
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                {message.type === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-[var(--color-primary)]" />
                  </div>
                )}

                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    message.type === "user"
                      ? "bg-[var(--color-primary)] text-white rounded-br-md"
                      : "bg-white border border-[var(--color-border)] rounded-bl-md"
                  }`}>
                  <p className="font-body text-sm leading-relaxed">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      message.type === "user"
                        ? "text-white/70"
                        : "text-[var(--color-text-muted)]"
                    }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>

                {message.type === "user" && (
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[var(--color-primary)]" />
                </div>
                <div className="bg-white border border-[var(--color-border)] p-4 rounded-2xl rounded-bl-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[var(--color-text-muted)] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[var(--color-text-muted)] rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-[var(--color-text-muted)] rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="p-6 border-t border-[var(--color-border)] bg-white">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about donations, vows, church traditions, or platform help..."
                  className="w-full px-4 py-3 pr-12 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                  disabled={isLoading}
                />
                <Sparkles className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4" />
              </div>
              <Button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="rounded-full px-6">
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-xs text-[var(--color-text-muted)] text-center mt-2">
              AI responses are for guidance only. For official church matters,
              please contact your spiritual father.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIAssistantPage;
