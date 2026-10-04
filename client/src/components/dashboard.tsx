import { useContext, useEffect, useRef } from "react";
import { SendHorizonal } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Check, CheckCheck } from "lucide-react";

import { Navbar } from "./navbar";
import { ConversationContext } from "@/context/conversationContext";
import { AuthContext } from "@/context/authContext";
import type { TMessage } from "@/assets/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface TSendMessage {
  message: string;
}

const readReceiptUserId = (userId: string | { _id: string }) =>
  typeof userId === "string" ? userId : userId._id;

export const Dashboard = () => {
  const { handleSubmit, register, reset } = useForm<TSendMessage>();
  const { user, socket } = useContext(AuthContext);
  const {
    selectedConversation,
    messages,
    setMessages,
    subscribeToMessage,
    unsubscribeFromMessages,
  } = useContext(ConversationContext);
  const scrollRef = useRef<HTMLDivElement>(null);
  const emittedReadIds = useRef<Set<string>>(new Set());

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
        throw new Error(
          errorData?.error ?? `Request failed: ${response.status}`,
        );
      }

      const { message } = await response.json();

      setMessages((prev) => [...prev, message]);
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

        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
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

    return () => {
      if (socket) unsubscribeFromMessages(socket);
      setMessages([]);
    };
  }, [selectedConversation.recipientId, socket]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Update messages when the other participant reads them.
  useEffect(() => {
    if (!socket) return;

    const handleMessagesRead = (data: {
      conversationId: string;
      readerId: string;
      messageIds: string[];
      readAt: string;
    }) => {
      setMessages((prev) =>
        prev.map((message) =>
          data.messageIds.includes(message._id)
            ? {
                ...message,
                readBy: [
                  ...(message.readBy ?? []).filter(
                    (receipt) =>
                      readReceiptUserId(receipt.userId) !== data.readerId,
                  ),
                  { userId: data.readerId, readAt: data.readAt },
                ],
              }
            : message,
        ),
      );
    };

    socket.on("messagesRead", handleMessagesRead);
    return () => {
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [socket, setMessages]);

  // Mark messages as read once they scroll into view.
  useEffect(() => {
    if (!socket) return;

    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;
          const messageId = element.dataset.messageId;
          if (!messageId || emittedReadIds.current.has(messageId)) {
            observer.unobserve(element);
            return;
          }

          emittedReadIds.current.add(messageId);
          observer.unobserve(element);
          element.dataset.read = "true";

          socket.emit("mark-message-read", { messageId }, (response) => {
            if (!response?.success) {
              emittedReadIds.current.delete(messageId); // allow retry
              console.warn("Failed to mark read:", response?.error);
              return;
            }
            setMessages((prev) =>
              prev.map((m) =>
                m._id === messageId
                  ? {
                      ...m,
                      readBy: [
                        ...(m.readBy ?? []).filter(
                          (r) => readReceiptUserId(r.userId) !== user._id,
                        ),
                        { userId: user._id, readAt: new Date().toISOString() },
                      ],
                    }
                  : m,
              ),
            );
          });
        });
      },
      { root: container, threshold: 0.5 },
    );

    container
      .querySelectorAll<HTMLElement>(
        "[data-message-id][data-mine='false'][data-read='false']",
      )
      .forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [socket, messages, setMessages, user._id]);

  return (
    <>
      <Navbar />
      {selectedConversation.recipientId.length > 0 ? (
        <div className="w-full bg-secondary h-[calc(100%-58px)] flex flex-col">
          <div
            id="messages-container"
            className="w-full flex flex-1 flex-col p-2 px-3 overflow-y-auto max-h-[calc(100vh-116px)]"
            ref={scrollRef}
          >
            {messages?.length > 0 &&
              messages.map((item: TMessage) => (
                <div
                  key={item._id}
                  data-message-id={item._id}
                  data-mine={user._id === item.senderId._id}
                  data-read={
                    item.readBy?.some(
                      (receipt) =>
                        readReceiptUserId(receipt.userId) === user._id,
                    ) ?? false
                  }
                  className={`max-w-[60%] w-fit flex flex-col mb-2 rounded-[18px] p-2 px-4 flex flex-col gap-[2px] ${
                    user._id === item.senderId._id
                      ? "bg-primary dark:bg-background! text-background dark:text-foreground self-end items-end"
                      : "bg-card text-foreground border-border/60 self-start items-start"
                  }`}
                >
                  <p className="text-[14px] text-left break-words whitespace-pre-wrap [word-break:break-word] max-w-full">
                    {item.text}
                  </p>
                  <div className="flex gap-2">
                    <span
                      className={`w-full text-[8px] ${
                        user._id === item.senderId._id
                          ? "text-end text-gray-400"
                          : "text-start text-gray-600 dark:text-black"
                      }`}
                    >
                      {new Date(item.createdAt).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                    {user._id === item.senderId._id &&
                      (item.readBy?.some(
                        (receipt) =>
                          readReceiptUserId(receipt.userId) !== user._id,
                      ) ? (
                        <CheckCheck size={14} />
                      ) : (
                        <Check size={14} />
                      ))}
                  </div>
                </div>
              ))}
          </div>
          <form
            onSubmit={handleSubmit(sendMessage)}
            className="w-full bg-background px-2 border-t-2 border-foreground max-h-[58px] h-[58px] flex gap-2 justify-center items-center"
          >
            <Input
              {...register("message")}
              placeholder="send message"
              name="message"
              className="shadow-none border-2 rounded-[24px] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              autoComplete="off"
            />
            <Button
              type="submit"
              className="bg-background border-2! text-foreground rounded-full hover:bg-white focus-visible:border-none! focus-visible:ring-none! focus-visible:ring-0! active:bg-background border border-input active:border-foreground"
            >
              <SendHorizonal size={28} />
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col bg-secondary gap-[0.6rem] max-h-[calc(100%-58px)] justify-center h-full w-full items-center">
          <img className="w-[150px]" src="/social-ly-logo.svg" />
          <h1 className="bg-gradient-to-r from-[#5C5C99] to-[#292966] bg-clip-text text-transparent text-[72px] font-semibold">
            social.ly
          </h1>
        </div>
      )}
    </>
  );
};
