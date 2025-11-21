import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UserButton() {
  return (
    <Button variant="outline" size="icon" aria-label="User login">
      <User />
    </Button>
  );
}
