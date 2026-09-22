"use client";

import { useState } from "react";
import type { ContactFormData } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const INITIAL_FORM: ContactFormData = { name: "", email: "", subject: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>(INITIAL_FORM);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(form);
    setForm(INITIAL_FORM);
    e.currentTarget.reset();
  };

  return (
    <Card className="m-auto w-full max-w-2xl bg-white p-8">
      <h3 className="text-xl font-semibold">Get in Touch</h3>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">Your Name</label>
          <Input id="name" name="name" type="text" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">Your Email</label>
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="subject" className="mb-1 block text-sm font-medium">Subject</label>
          <Input id="subject" name="subject" type="text" value={form.subject} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-medium">Your Message</label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            style={{ height: "150px" }}
            required
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <Button type="submit" variant="outline" className="font-semibold">
          SEND
        </Button>
      </form>
    </Card>
  );
}
