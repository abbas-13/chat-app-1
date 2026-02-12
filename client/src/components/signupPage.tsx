import { useForm, type SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { useNavigate } from "react-router";
import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { toast } from "sonner";

interface TSignUpForm {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export const SignUp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TSignUpForm>();
  const [showPassword, setShowPassword] = useState({
    pwd: false,
    confirmPwd: false,
  });

  const onSubmit: SubmitHandler<TSignUpForm> = async (data) => {
    try {
      const response = await fetch("/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      navigate("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unkown error occurred";
      if (errorMessage === "User already exists") {
        toast.error(errorMessage, {
          position: "top-center",
          action: {
            label: "Login",
            onClick: () => navigate("/login"),
          },
        });
      }
      console.error("Sign up failed", errorMessage);
    }
  };

  return (
    <div className="h-screen bg-background flex justify-center items-center">
      <Card className="items-center w-[300px] flex flex-col gap-0 bg-secondary! dark:bg-[#1a202c]">
        <div className="flex gap-2 items-center">
          <img src="/social-ly-logo.svg" width={40} />
          <h1 className="bg-gradient-to-r from-[#5C5C99] to-[#292966] bg-clip-text text-transparent text-transparent text-[42px] text-balance font-extrabold">
            social.ly
          </h1>
        </div>
        <div className="w-full">
          <div className="border w-full border-gray-200"></div>
          <h2 className="scroll-m-20 p-4 text-sm font-[400] text-ring tracking-tight first:mt-0">
            Please sign up to continue
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 items-center px-6 mb-2"
          >
            <div className="flex flex-col w-full">
              <label className="text-left pl-2 text-foreground text-[14px]">
                Email
              </label>
              <Input
                {...register("email", {
                  required: "Please enter email",
                })}
                type="text"
                name="email"
                placeholder="enter your email"
                className="dark:bg-gray-200 mt-2"
              />
              <ErrorMessage
                errors={errors}
                name="email"
                render={({ message }) => (
                  <p className="text-xs text-red-500 mt-1 text-center">
                    {message}
                  </p>
                )}
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-left pl-2 text-foreground text-[14px]">
                Name
              </label>
              <Input
                {...register("name", {
                  required: "Please enter your name",
                })}
                type="text"
                name="name"
                placeholder="enter your name"
                className="dark:bg-gray-200 mt-2"
              />
              <ErrorMessage
                errors={errors}
                name="name"
                render={({ message }) => (
                  <p className="text-xs text-red-500 mt-1 text-center">
                    {message}
                  </p>
                )}
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-left pl-2 text-foreground text-[14px]">
                Password
              </label>
              <InputGroup className="gap-2 mt-2">
                <InputGroupInput
                  className="dark:bg-gray-200"
                  {...register("password", {
                    required:
                      "Please enter a password of at least 8 characters",
                    minLength: 8,
                  })}
                  placeholder="enter a password"
                  type={showPassword.pwd ? "text" : "password"}
                  name="password"
                />
                <InputGroupAddon
                  align="inline-end"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      pwd: !prev.pwd,
                    }))
                  }
                >
                  {showPassword.pwd ? (
                    <EyeIcon className="cursor-pointer" />
                  ) : (
                    <EyeOffIcon className="cursor-pointer" />
                  )}
                </InputGroupAddon>
              </InputGroup>
              <ErrorMessage
                errors={errors}
                name="password"
                render={({ message }) => (
                  <p className="text-xs text-red-500 mt-1 text-center">
                    {message}
                  </p>
                )}
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-left pl-2 text-foreground text-[14px]">
                Confirm Password
              </label>
              <InputGroup className="gap-2 mt-2">
                <InputGroupInput
                  {...register("confirmPassword", {
                    required: "Please confirm password",
                    validate: (val: string) => {
                      if (watch("password") != val) {
                        return "Passwords do no match";
                      }
                    },
                  })}
                  placeholder="confirm your password"
                  type={showPassword.confirmPwd ? "text" : "password"}
                  name="confirmPassword"
                  className="dark:bg-gray-200"
                />
                <InputGroupAddon
                  align="inline-end"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      confirmPwd: !prev.confirmPwd,
                    }))
                  }
                >
                  {showPassword.pwd ? (
                    <EyeIcon className="cursor-pointer" />
                  ) : (
                    <EyeOffIcon className="cursor-pointer" />
                  )}
                </InputGroupAddon>
              </InputGroup>
              <ErrorMessage
                errors={errors}
                name="confirmPassword"
                render={({ message }) => (
                  <p className="text-xs text-red-500 mt-1 text-center">
                    {message}
                  </p>
                )}
              />
            </div>

            <Button
              className="bg-[#2097f3] w-5/6 mt-2 h-[36px] text-[15px] cursor-pointer hover:bg-[#FFFFFF] hover:border-2 hover:border-[#2097f3] active:bg-[#2097f3] active:text-white hover:text-black active:outline-2 active:outline-[#85C7F8] hover:shadow-lg active:shadow-none active:border-1 active:border-white text-white"
              variant="outline"
              type="submit"
            >
              Sign Up
            </Button>
          </form>
          <a
            href={"/login"}
            className="text-[12px] underline mt-4 font-[400] cursor-pointer underline-offset-2 text-blue-600 dark:text-blue-300 tracking-tight first:mt-0"
          >
            Already have an account? Sign in here
          </a>
        </div>
      </Card>
    </div>
  );
};
