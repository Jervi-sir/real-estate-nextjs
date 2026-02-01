"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactAgent } from "@/lib/actions";

export function ContactAgentForm({ propertyId }: { propertyId: number }) {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);

    async function onSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await contactAgent(formData);
            if (result.success) {
                setSuccess(true);
            } else {
                alert("Failed to send message: " + (result.error || "Unknown error"));
            }
        });
    }

    if (success) {
        return (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-6 rounded-xl border border-green-200 dark:border-green-900">
                <h3 className="font-semibold mb-2">Message Sent!</h3>
                <p>The agent has been notified and will contact you shortly.</p>
                <Button variant="outline" className="mt-4" onClick={() => setSuccess(false)}>
                    Send Another
                </Button>
            </div>
        );
    }

    return (
        <form action={onSubmit} className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-xl font-semibold">Contact Agent</h3>
            <input type="hidden" name="propertyId" value={propertyId} />

            <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" name="name" required placeholder="John Doe" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Your Email</Label>
                <Input id="email" name="email" type="email" required placeholder="john@example.com" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                    id="message"
                    name="message"
                    required
                    placeholder="I am interested in this property..."
                    rows={4}
                />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Sending..." : "Send Message"}
            </Button>
        </form>
    );
}
