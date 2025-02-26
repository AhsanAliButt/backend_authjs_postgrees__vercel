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
import React, { useTransition } from "react";
import { Button } from "../../components/ui/button";
import Link from "next/link";
// import Login from "@/app/actions/login";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authenticate } from "@/lib/actions/user";
interface Props {
  callbackUrl?: string;
}
const formSchema = z.object({
  email: z.string().min(1, "email is required").email(`invalid email address`),
  password: z
    .string()
    .min(1, "password is required")
    .min(6, "password must be at least 6 characters"),
});
const SignInForm = (props: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
 
const onSubmit = async (values: z.infer<typeof formSchema>) => {
  startTransition(async () => {
    try {
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false, 
      });

      if (response?.error) {
        toast.error(response.error);
        if (response.error === "Error: User not found") {
          form.setError("email", { type: "manual", message: "User not found" });
        }
        if (response.error === "Error: Incorrect password") {
          form.setError("password", { type: "manual", message: "Incorrect password" });
        }
        if (response.error === "Error: Verification Email sent... Please Verify") {
          router.push(`/verify-user`);
          return;
        }
        if (response.error === "Error: OTP sent. Please check your email.") {
          router.push(`/verify-otp/${values.email}`);
          return;
        }
      }

      // If successful
      if (response?.ok) {
        toast.success("Login successful!"); 
        router.push(props.callbackUrl ? props.callbackUrl : "/");
      }
    } catch (err: any) {
      console.error("Error during sign in", err);
      toast.error("Failed to login: " + (err.message || "An unexpected error occurred."));
    }
  });
};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between w-full items-center">
                <FormLabel>Email</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder="Enter your email"
                  {...field}
                  type="email"
                />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between w-full items-center">
                <FormLabel className=" font-extrabold">Password</FormLabel>
                <FormMessage  className=" font-extrabold" />
              </div>

              <FormControl>
                <Input
                  placeholder="Enter your password"
                  {...field}
                  type="password"
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                <div className="flex justify-between w-full">
                  <Link href="/signup" className="hover:text-blue-900">
                    Done have account ? SignUp
                  </Link>
                  <div>forgot Passord ?</div>
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

export default SignInForm;
