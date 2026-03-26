"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface SocialAuthButtonProps {
  action: () => void;
  children: ReactNode;
}

export function SocialAuthButton({
  action,
  children,
}: SocialAuthButtonProps) {
  return <Button onClick={action} variant={"outline"} className="w-full">{children}</Button>;
}