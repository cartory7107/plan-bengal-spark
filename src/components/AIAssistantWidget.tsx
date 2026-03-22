import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Bot, MessageCircle, Send, Sparkles, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type MessageRole = "assistant" | "user";

interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
}

const cannedReplies: Array<{ triggers: string[]; reply: string }> = [
  {
    triggers: ["budget", "cheap", "save", "money"],
    reply:
      "Totally! Share your destination + trip length, and I'll give a budget-friendly daily plan with transport, food, and stay ideas.",
  },
  {
    triggers: ["romantic", "couple", "honeymoon"],
    reply:
      "Love that vibe ✨ I can build a romantic itinerary with sunset spots, cozy dinners, and memorable experiences.",
  },
  {
    triggers: ["solo", "alone"],
    reply:
      "Solo trips are amazing. I can suggest safe neighborhoods, social activities, and a flexible day-by-day solo route.",
  },
  {
    triggers: ["family", "kids", "child"],
    reply:
      "Great choice! I can focus on family-friendly attractions, slower pacing, and kid-safe food/activity options.",
  },
  {
    triggers: ["hi", "hello", "hey"],
    reply:
      "Hey! I'm your travel assistant. Ask me for destination ideas, budget tips, or a full day-by-day travel game plan.",
  },
];

const defaultReply =
  "I can help with destinations, budget breakdowns, best travel months, and personalized trip plans. Tell me where you want to go 🌍";

const introMessage: ChatMessage = {
  id: "intro",
  role: "assistant",
  text:
    "Hi! I'm your AI Bubble Assistant 🤖 Ask me anything about your trip and I'll help you plan fast.",
};

const getAssistantReply = (message: string) => {
  const text = message.toLowerCase();
  const matched = cannedReplies.find(({ triggers }) =>
    triggers.some((trigger) => text.includes(trigger)),
  );

  return matched?.reply ?? defaultReply;
};

const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([introMessage]);
  const [isTyping, setIsTyping] = useState(false);
  const [animatedAssistantText, setAnimatedAssistantText] = useState(introMessage.text);
  const scrollViewportRef = useRef<HTMLDivElement | null>(null);

  const latestAssistantMessage = useMemo(
    () => [...messages].reverse().find((message) => message.role === "assistant"),
    [messages],
  );

  useEffect(() => {
    if (!latestAssistantMessage) {
      return;
    }

    let index = 0;
    setAnimatedAssistantText("");

    const interval = window.setInterval(() => {
      index += 1;
      setAnimatedAssistantText(latestAssistantMessage.text.slice(0, index));

      if (index >= latestAssistantMessage.text.length) {
        window.clearInterval(interval);
      }
    }, 18);

    return () => window.clearInterval(interval);
  }, [latestAssistantMessage]);

  useEffect(() => {
    if (!scrollViewportRef.current) {
      return;
    }

    scrollViewportRef.current.scrollTo({
      top: scrollViewportRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setValue("");
    setIsTyping(true);

    const reply = getAssistantReply(trimmed);

    window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="chatbox-glow reveal h-[560px] w-[min(92vw,370px)] overflow-hidden rounded-2xl border border-white/40 bg-white/80 shadow-2xl backdrop-blur-2xl">
          <div className="chatbox-header flex items-center justify-between border-b border-white/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="chat-avatar-pulse flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal-500 text-white shadow-lg">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Bubble AI Assistant</p>
                <p className="text-xs text-muted-foreground">Online now</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-[420px] px-4 py-4" viewportRef={scrollViewportRef}>
            <div className="space-y-3">
              {messages.map((message) => {
                const isAssistant = message.role === "assistant";
                const isLatestAssistant =
                  isAssistant && latestAssistantMessage && latestAssistantMessage.id === message.id;

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-end gap-2",
                      isAssistant ? "justify-start" : "justify-end",
                    )}
                  >
                    {isAssistant && (
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Sparkles className="h-3.5 w-3.5" />
                      </span>
                    )}

                    <div
                      className={cn(
                        "max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm",
                        isAssistant
                          ? "bg-emerald-100/80 text-emerald-900"
                          : "bg-primary text-primary-foreground",
                      )}
                    >
                      {isLatestAssistant ? animatedAssistantText : message.text}
                    </div>

                    {!isAssistant && (
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <User className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <span className="typing-dots rounded-full bg-secondary px-3 py-2">Assistant is typing</span>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="border-t border-white/50 p-3">
            <div className="flex items-center gap-2">
              <Input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="Ask about destination, budget, food..."
                className="border-white/60 bg-white/70"
              />
              <Button type="submit" size="icon" className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className="chat-bubble-float h-14 rounded-full px-5 text-sm font-semibold shadow-xl"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Chat with AI
        </Button>
      )}
    </div>
  );
};

export default AIAssistantWidget;
