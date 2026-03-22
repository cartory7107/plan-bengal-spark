import { supabase } from "@/integrations/supabase/client";

type MessageRole = "assistant" | "user";

interface AssistantMessage {
  role: MessageRole;
  text: string;
}

export const getAssistantChatReply = async (message: string, history: AssistantMessage[]) => {
  const { data, error } = await supabase.functions.invoke("ai-assistant-chat", {
    body: {
      message,
      history,
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to get assistant response");
  }

  if (!data?.reply || typeof data.reply !== "string") {
    throw new Error(data?.error || "Assistant returned an invalid response");
  }

  return data.reply;
};
