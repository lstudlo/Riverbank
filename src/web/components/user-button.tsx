import { UserFillIcon } from "raster-react";
import { Button } from "@/components/ui/button";

export function UserButton() {
  return (
    <Button variant="outline" size="icon" aria-label="User login">
      <UserFillIcon size={32} className="size-8" />
    </Button>
  );
}
