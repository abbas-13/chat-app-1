import { useContext, useEffect, useRef } from "react";
import { SendHorizonal } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Navbar } from "./navbar";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { ConversationContext } from "@/context/conversationContext";
import { AuthContext } from "@/context/authContext";
import type { TMessage } from "@/assets/types";
import { Button } from "./ui/button";

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
        console.log(prev);
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
                className={`min-h-[36px]  max-w-1/2 rounded-full flex items-center mb-2 p-2 px-4 ${user._id === item.senderId._id ? "self-end bg-foreground text-[#e6e6ff]" : "self-start bg-[#e6e6ff] text-foreground"}`}
              >
                {item.text}
              </div>
            ))}
        </div>
        <form
          onSubmit={handleSubmit(sendMessage)}
          className="w-full bg-[#e6e6ff] px-2 border-t-2 border-foreground max-h-[58px] h-[58px] flex justify-center items-center"
        >
          <InputGroup className="rounded-full border-foreground bg-background">
            <InputGroupInput
              {...register("message")}
              placeholder="send message"
              name="message"
            />
            <InputGroupAddon align="inline-end">
              <Button
                type="submit"
                className="bg-transparent hover:bg-transparent p-0"
              >
                <SendHorizonal size={24} color="#292966" />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    </>
  );
};
