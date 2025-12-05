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
import { signUp } from "@/lib/auth-client";

const signupFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    email: z
      .email("Please enter a valid email address")
      .min(1, "Email is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function SignupForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, fields] = useForm({
    constraint: getZodConstraint(signupFormSchema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signupFormSchema });
    },
    async onSubmit(event, { formData }) {
      event.preventDefault();
      const submission = parseWithZod(formData, { schema: signupFormSchema });

      if (submission.status === "success") {
        await handleSignup(submission.value);
      }
    },
  });

  async function handleSignup(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    setIsSubmitting(true);
    try {
      const result = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (result.error) {
        toast.error("Sign up failed", {
          description: result.error.message || "Unable to create account",
        });
        return;
      }

      toast.success("Account created!", {
        description:
          "Welcome to BeeBnB. Your account has been created successfully.",
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
        <CardTitle>Sign up</CardTitle>
        <CardDescription>Create your account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" {...getFormProps(form)}>
          <ConformField field={fields.name} label="Full Name">
            <ConformInput
              field={fields.name}
              placeholder="John Doe"
              autoComplete="name"
            />
          </ConformField>

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
              placeholder="Create a strong password"
              autoComplete="new-password"
            />
          </ConformField>

          <ConformField field={fields.confirmPassword} label="Confirm Password">
            <ConformInput
              field={fields.confirmPassword}
              type="password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
            />
          </ConformField>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
