import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Bot, MessageCircle, Send, Sparkles, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAssistantChatReply } from "@/lib/assistantApi";
import { cn } from "@/lib/utils";

type MessageRole = "assistant" | "user";

interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
}

const introMessage: ChatMessage = {
  id: "intro",
  role: "assistant",
  text:
    "Hi! I'm your AI Bubble Assistant 🤖 You can ask me travel questions or any general question.",
};

const fallbackReply =
  "I hit a temporary issue while generating a reply. Please try again in a moment.";

const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([introMessage]);
  const [isTyping, setIsTyping] = useState(false);
  const [animatedAssistantText, setAnimatedAssistantText] = useState(introMessage.text);
  const scrollViewportRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

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
    if (!isOpen || !scrollViewportRef.current || !bottomRef.current) {
      return;
    }

    bottomRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping, animatedAssistantText, isOpen]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = value.trim();
    if (!trimmed || isTyping) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
    };

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setValue("");
    setIsTyping(true);

    try {
      const reply = await getAssistantChatReply(
        trimmed,
        nextMessages.map(({ role, text }) => ({ role, text })),
      );

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Assistant reply failed:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: fallbackReply,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
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

              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="border-t border-white/50 p-3">
            <div className="flex items-center gap-2">
              <Input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="Ask anything... travel, coding, life, etc."
                className="border-white/60 bg-white/70"
              />
              <Button type="submit" size="icon" className="shrink-0" disabled={isTyping}>
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
