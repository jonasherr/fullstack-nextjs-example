"use client";

import { getFormProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConformField, ConformInput } from "@/components/ui/conform-form";
import { signIn } from "@/lib/auth-client";

const loginFormSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z
    .string("Password is required")
    .min(1)
    .min(8, "Password must be at least 8 characters"),
});

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, fields] = useForm({
    constraint: getZodConstraint(loginFormSchema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginFormSchema });
    },
    async onSubmit(event, { formData }) {
      event.preventDefault();
      const submission = parseWithZod(formData, { schema: loginFormSchema });

      if (submission.status === "success") {
        await handleLogin(submission.value);
      }
    },
  });

  async function handleLogin(data: { email: string; password: string }) {
    setIsSubmitting(true);
    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        toast.error("Login failed", {
          description: result.error.message || "Invalid email or password",
        });
        return;
      }

      toast.success("Welcome back!", {
        description: "You have successfully logged in.",
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" {...getFormProps(form)}>
          <ConformField field={fields.email} label="Email">
            <ConformInput
              field={fields.email}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </ConformField>

          <ConformField field={fields.password} label="Password">
            <ConformInput
              field={fields.password}
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </ConformField>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-center text-sm">
        <p className="text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
