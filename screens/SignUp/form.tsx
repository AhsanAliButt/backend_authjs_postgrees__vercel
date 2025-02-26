"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { startTransition, useTransition } from "react";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { register } from "@/lib/actions/user";
const formSchema = z
  .object({
    firstname: z.string().min(1, "firstname is required"),
    email: z
      .string()
      .min(1, "email is required")
      .email(`invalid email address`),
    password: z
      .string()
      .min(1, "password is required")
      .min(6, "password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Password confirm is required"),
  })
  .refine(
    (data: { password: any; confirmPassword: any }) =>
      data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Password do not match",
    }
  );
const SignUpForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const response = await fetch(
          `/api/auth/signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Set the content type
            },
            body: JSON.stringify({
              firstname: values.firstname,
              email: values.email,
              password: values.password,
            }),
          }
        );
        const data = await response.json(); // Parse the JSON response
        if (response.status === 409) {
          form.setError("email", {
            type: "manual",
            message: data.message, // Use the message from the response
          });
          toast.error(data.message)
        } else if (!response.ok) {
          // Handle other possible errors
          throw new Error(data.message || "Signup failed");
        } else {
          // Successful signup
          toast.success("Welcome! " + data.message); // Display success toast
          router.push("/verify-user"); // Redirect after successful signup
        }
      } catch (error) {
        toast.error("Signup failed: " + error); // Display error toast
      }
    });
  };1

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between w-full items-center">
                <FormLabel>Fullname</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input
                  placeholder="Enter your Firstname"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }: { field: any }) => (
            <FormItem>
              <div className="flex justify-between w-full items-center">
                <FormLabel>Email</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  {...field}
                  type="email"
                  disabled={isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }: { field: any }) => (
            <FormItem>
              <div className="flex justify-between w-full items-center">
                <FormLabel>Password</FormLabel>
                <FormMessage />
              </div>

              <FormControl>
                <Input
                  placeholder="Enter your password"
                  {...field}
                  type="password"
                  disabled={isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }: { field: any }) => (
            <FormItem>
              <div className="flex justify-between w-full items-center">
                <FormLabel>Password</FormLabel>
                <FormMessage />
              </div>

              <FormControl>
                <Input
                  placeholder="Re-Enter your password"
                  {...field}
                  type="password"
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                <div className="flex justify-between w-full">
                  <div></div>
                  <Link href="/signin" className="hover:text-blue-900">
                    Already Have an Account ? SignIn
                  </Link>
                </div>
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="flex items-center justify-center flex-col">
          <Button type="submit" className="w-full" disabled={isPending}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
