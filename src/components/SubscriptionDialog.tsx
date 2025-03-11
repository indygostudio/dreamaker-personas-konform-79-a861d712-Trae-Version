import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
interface SubscriptionDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export const SubscriptionDialog = ({
  open,
  onOpenChange
}: SubscriptionDialogProps = {}) => {
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const validateEmail = (email: string) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Thank you for subscribing! We'll keep you updated.");
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border bg-[#0EA5E9]/10 text-white border-[#0EA5E9]/20 shadow-[0_4px_20px_rgba(14,165,233,0.3)] transform -translate-y-0.5 hover:bg-[#0EA5E9]/20" size="lg">JOIN WAITLIST</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md glass-morphism border-blue-500/20">
        <DialogHeader>
          <DialogTitle className="text-xl">Join Our Waitlist</DialogTitle>
          <DialogDescription>
            Sign up to be notified when our product launches.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubscribe} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Input id="email" type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} className="bg-black/50 border-blue-500/20 focus:border-blue-500/40" required />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border bg-[#0EA5E9]/10 text-white border-[#0EA5E9]/20 shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:bg-[#0EA5E9]/20" disabled={isSubmitting}>
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>;
};