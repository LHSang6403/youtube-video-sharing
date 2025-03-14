"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { REGISTER_MUTATION } from "@/graphql/operations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", password: "", name: "" });
  const router = useRouter();
  const [register, { error }] = useMutation(REGISTER_MUTATION);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const response = await register({ variables: { registerInput: form } });
        if (response.data?.register.id) {
          router.push("/login");
        }
      } catch (err) {
        console.error(err);
      }
    },
    [form, register, router]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <Input
          name="name"
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />
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
        <Button type="submit">Register</Button>
      </form>
      {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
    </div>
  );
}
