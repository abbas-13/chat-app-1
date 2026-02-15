import { useContext, useEffect, useRef } from "react";
import { SendHorizonal } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Navbar } from "./navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ConversationContext } from "@/context/conversationContext";
import { AuthContext } from "@/context/authContext";
import type { TMessage } from "@/assets/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface TSendMessage {
  message: string;
}

export const Dashboard = () => {
  const { handleSubmit, register, reset } = useForm<TSendMessage>();
  const { user, socket } = useContext(AuthContext);
  const isMobile = useIsMobile();
  const {
    selectedConversation,
    messages,
    setMessages,
    subscribeToMessage,
    unsubscribeFromMessages,
  } = useContext(ConversationContext);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage: SubmitHandler<TSendMessage> = async (data) => {
    try {
      if (!data.message.trim()) return;

      const body = {
        text: data.message,
        recipientId: selectedConversation.recipientId,
      };

      const response = await fetch("/api/messages", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
      }

      const { message } = await response.json();

      setMessages((prev) => {
        return [...prev, message];
      });
      reset();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err
          : "Could not send message, unknown error occurred";
      console.log(errorMessage);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/messages/${selectedConversation.recipientId}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const { messages } = await response.json();
        setMessages(messages);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err
            : "Could not send message, unknown error occurred";
        console.log(errorMessage);
      }
    };

    if (selectedConversation.recipientId.length > 0 && socket) {
      fetchMessages();
      subscribeToMessage(selectedConversation.recipientId, socket);
    }

    return () => unsubscribeFromMessages(socket!);
  }, [selectedConversation.recipientId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {!isMobile && <Navbar />}
      <div className="w-full bg-background h-[calc(100%-58px)] flex flex-col">
        <div
          id="messages-container"
          className="w-full flex flex-1 flex-col p-2 overflow-y-auto max-h-[calc(100vh-116px)]"
          ref={scrollRef}
        >
          {messages.length > 0 &&
            messages.map((item: TMessage) => (
              <div
                key={item._id}
                className={`max-w-[60%] w-fit rounded-[24px] flex items-center mb-2 p-2 px-4 ${
                  user._id === item.senderId._id
                    ? "self-end bg-foreground text-[#e6e6ff]"
                    : "self-start bg-[#e6e6ff] text-foreground"
                }`}
              >
                <p className="text-left break-words whitespace-pre-wrap [word-break:break-word] max-w-full">
                  {item.text}
                </p>
              </div>
            ))}
        </div>
        <form
          onSubmit={handleSubmit(sendMessage)}
          className="w-full bg-[#e6e6ff] px-2 border-t-2 border-foreground max-h-[58px] h-[58px] flex gap-2 justify-center items-center"
        >
          <Input
            {...register("message")}
            placeholder="send message"
            name="message"
            className="bg-background shadow-none rounded-[24px] active:border active:border-foreground focus-visible:border-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            autoComplete="off"
          />
          <Button
            type="submit"
            className="bg-background rounded-full hover:bg-white focus-visible:border-none! focus-visible:ring-none! focus-visible:ring-0! active:bg-background border border-input active:border-foreground"
          >
            <SendHorizonal size={28} color="#292966" />
          </Button>
        </form>
      </div>
    </>
  );
};
