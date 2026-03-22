import { supabase } from "@/integrations/supabase/client";

interface AIHistoryMessage {
  role: "assistant" | "user";
  content: string;
}

export async function getAIAssistantReply(message: string, history: AIHistoryMessage[] = []) {
  const { data, error } = await supabase.functions.invoke("ai-chat-assistant", {
    body: {
      message,
      history,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data?.reply as string;
}
