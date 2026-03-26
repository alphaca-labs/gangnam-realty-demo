"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { chatScenarios, fraudPreventionGuide, transactionReportGuide } from "@/data/chat-scenarios";
import { transactions } from "@/data/mock-transactions";
import { formatPrice, formatDate } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Message {
  role: "user" | "ai";
  text: string;
  cardType?: "chart" | "table" | "guide" | "calculator" | "text";
  suggestions?: string[];
}

function ChatContent() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      handleSend(q);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function matchScenario(query: string) {
    const lower = query.toLowerCase();
    for (const scenario of chatScenarios) {
      if (scenario.keywords.length === 0) continue;
      if (scenario.keywords.some((kw) => lower.includes(kw))) {
        return scenario;
      }
    }
    return chatScenarios[chatScenarios.length - 1]; // fallback
  }

  async function handleSend(text?: string) {
    const q = text ?? input.trim();
    if (!q || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1500));

    const scenario = matchScenario(q);
    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: scenario.response,
        cardType: scenario.cardType,
        suggestions: scenario.suggestions,
      },
    ]);
    setLoading(false);
  }

  const apTransactions = transactions
    .filter((t) => t.dong === "압구정동" && t.type === "매매")
    .sort((a, b) => a.contractDate.localeCompare(b.contractDate));

  const chartData = apTransactions.map((t) => ({
    date: formatDate(t.contractDate),
    price: t.price / 10000,
    name: t.complexName,
  }));

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-3.5rem-4rem)] md:h-[calc(100vh-3.5rem)]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="w-12 h-12 text-gangnam-primary mb-3" />
            <h2 className="text-lg font-bold text-gangnam-text mb-2">강남부동산톡 AI</h2>
            <p className="text-gangnam-sub text-sm mb-6">부동산 관련 무엇이든 물어보세요!</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["압구정동 실거래가", "중개수수료 얼마?", "전세사기 예방", "거래신고 방법"].map((ex) => (
                <button
                  key={ex}
                  onClick={() => handleSend(ex)}
                  className="text-sm px-4 py-2 bg-white border border-border rounded-full hover:bg-gangnam-primary/5 hover:border-gangnam-primary/30 transition-colors text-gangnam-text"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {msg.role === "user" ? (
                <div className="flex justify-end">
                  <div className="flex items-start gap-2 max-w-[85%]">
                    <div className="bg-gangnam-primary text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm">
                      {msg.text}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gangnam-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-gangnam-primary" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-[90%]">
                    <div className="w-8 h-8 rounded-full bg-gangnam-primary flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-sm text-sm text-gangnam-text">
                        {msg.text}
                      </div>

                      {msg.cardType === "chart" && (
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold text-sm text-gangnam-text">📊 압구정동 실거래가 추이</h3>
                              <Badge variant="secondary" className="text-xs">매매</Badge>
                            </div>
                            <div className="h-48 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#64748B" />
                                  <YAxis tick={{ fontSize: 11 }} stroke="#64748B" unit="억" />
                                  <Tooltip
                                    formatter={(val) => [`${val}억`, "거래가"]}
                                    labelFormatter={(l) => `계약일: ${l}`}
                                  />
                                  <Line type="monotone" dataKey="price" stroke="#1B4D8E" strokeWidth={2} dot={{ r: 4 }} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="mt-3 space-y-1.5">
                              <h4 className="font-medium text-sm text-gangnam-text">📋 최근 거래 내역</h4>
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="border-b text-gangnam-sub">
                                      <th className="text-left py-1.5 pr-2">단지명</th>
                                      <th className="text-right py-1.5 px-2">면적</th>
                                      <th className="text-right py-1.5 px-2">금액</th>
                                      <th className="text-right py-1.5 pl-2">계약일</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {apTransactions.slice(-5).reverse().map((t) => (
                                      <tr key={t.id} className="border-b border-border/50">
                                        <td className="py-1.5 pr-2 text-gangnam-text">{t.complexName}</td>
                                        <td className="py-1.5 px-2 text-right">{t.area}㎡</td>
                                        <td className="py-1.5 px-2 text-right font-medium text-gangnam-primary">{formatPrice(t.price)}</td>
                                        <td className="py-1.5 pl-2 text-right text-gangnam-sub">{formatDate(t.contractDate)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {msg.cardType === "calculator" && (
                        <Card>
                          <CardContent className="p-4 text-center">
                            <p className="text-sm text-gangnam-text mb-3">아래 버튼을 눌러 계산기로 이동하세요.</p>
                            <a
                              href="/calculator"
                              className="inline-block bg-gangnam-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gangnam-primary/90 transition-colors"
                            >
                              🧮 수수료 계산기 열기
                            </a>
                          </CardContent>
                        </Card>
                      )}

                      {msg.cardType === "guide" && (
                        <Card>
                          <CardContent className="p-4">
                            {msg.text.includes("전세사기") ? (
                              <>
                                <h3 className="font-semibold text-sm mb-3">🛡️ {fraudPreventionGuide.title}</h3>
                                <div className="space-y-2">
                                  {fraudPreventionGuide.steps.map((s) => (
                                    <div key={s.step} className="flex gap-3">
                                      <div className="w-6 h-6 rounded-full bg-gangnam-primary text-white text-xs flex items-center justify-center shrink-0 mt-0.5">
                                        {s.step}
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm text-gangnam-text">{s.title}</p>
                                        <p className="text-xs text-gangnam-sub">{s.desc}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <>
                                <h3 className="font-semibold text-sm mb-3">📋 {transactionReportGuide.title}</h3>
                                <div className="space-y-2">
                                  {transactionReportGuide.steps.map((s) => (
                                    <div key={s.step} className="flex gap-3">
                                      <div className="w-6 h-6 rounded-full bg-gangnam-primary text-white text-xs flex items-center justify-center shrink-0 mt-0.5">
                                        {s.step}
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm text-gangnam-text">{s.title}</p>
                                        <p className="text-xs text-gangnam-sub">{s.desc}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <p className="mt-3 text-xs text-gangnam-accent font-medium bg-amber-50 px-3 py-2 rounded-lg">
                                  ⚠️ {transactionReportGuide.notice}
                                </p>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {msg.suggestions && (
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestions.map((s) => (
                            <button
                              key={s}
                              onClick={() => handleSend(s)}
                              className="text-xs px-3 py-1.5 bg-white border border-border rounded-full hover:bg-gangnam-primary/5 hover:border-gangnam-primary/30 transition-colors text-gangnam-sub"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-gangnam-primary flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
              <Loader2 className="w-5 h-5 text-gangnam-primary animate-spin" />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-white px-4 py-3">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="궁금한 것을 물어보세요..."
            className="flex-1 px-4 py-3 bg-gangnam-bg border border-border rounded-xl text-sm outline-none focus:border-gangnam-primary transition-colors"
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="w-11 h-11 flex items-center justify-center bg-gangnam-primary text-white rounded-xl hover:bg-gangnam-primary/90 disabled:opacity-50 transition-colors shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatContent />
    </Suspense>
  );
}
