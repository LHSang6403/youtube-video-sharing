"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "@/graphql/operations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [login, { error }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const response = await login({ variables: { loginInput: form } });
        if (response.data?.login.accessToken) {
          localStorage.setItem("token", response.data.login.accessToken);
          router.push("/");
        }
      } catch (err) {
        console.error(err);
      }
    },
    [form, login, router]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleRegister = useCallback(() => {
    router.push("/register");
  }, [router]);

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <Input
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <Button type="submit">Login</Button>
      </form>

      {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}

      <div className="mt-6 flex flex-col items-center space-y-2">
        <p>Dont have an account?</p>
        <Button variant="secondary" onClick={handleRegister}>
          Register
        </Button>
      </div>
    </div>
  );
}
