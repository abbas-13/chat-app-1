import { useContext, useEffect, useState } from "react";
import { SendHorizonal } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Navbar } from "./navbar";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { ConversationContext } from "@/context/conversationContext";
import { AuthContext } from "@/context/authContext";

interface TSendMessage {
  message: string;
}

interface TMessage {
  _id: string;
  text: string;
  senderId: {
    _id: string;
    email: string;
    name: string;
    displayName: string;
  };
  readBy: [];
  conversationId: string;
  createdAt: string;
}

export const Dashboard = () => {
  const { handleSubmit, register, reset } = useForm<TSendMessage>();
  const { user } = useContext(AuthContext);
  const isMobile = useIsMobile();
  const { selectedConversation } = useContext(ConversationContext);
  const [messages, setMessages] = useState<TMessage[]>([]);

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

    if (selectedConversation.recipientId.length > 0) {
      fetchMessages();
    }
  }, [selectedConversation.recipientId]);

  return (
    <>
      {!isMobile && <Navbar />}
      <div className="w-full h-[calc(100%-54px)] bg-background flex flex-col">
        <div className="h-[calc(100%-54px)] w-full flex flex-col p-2">
          {messages.length > 0 &&
            messages.map((item: TMessage) => (
              <div
                key={item._id}
                className={`min-h-[36px]  max-w-1/2 rounded-xl mb-2 p-2 px-4 ${user._id === item.senderId._id ? "self-end bg-foreground text-[#e6e6ff]" : "self-start bg-[#e6e6ff] text-foreground"}`}
              >
                {item.text}
              </div>
            ))}
        </div>
        <form
          onSubmit={handleSubmit(sendMessage)}
          className="w-full bg-[#e6e6ff] px-2 border-t-2 border-foreground h-[54px] flex justify-center items-center"
        >
          <InputGroup className="rounded-full border-foreground bg-background">
            <InputGroupInput
              {...register("message")}
              placeholder="send message"
              name="message"
            />
            <InputGroupAddon className="cursor-pointer" align="inline-end">
              <SendHorizonal color="#292966" />
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    </>
  );
};
