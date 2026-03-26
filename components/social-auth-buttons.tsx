"use client";

import { createClient } from "@/lib/supabase/client";
import { SocialAuthButton } from "./social-auth-button";
import { FacebookIcon, GithubIcon, GoogleIcon } from "@/lib/Icons";

const providers = [
  {
    name: "github",
    label: "Continue with GitHub",
    icon: GithubIcon,
  },
  {
    name: "google",
    label: "Continue with Google",
    icon: GoogleIcon,
  },
  {
    name: "facebook",
    label: "Continue with Facebook",
    icon: FacebookIcon,
  },
];

const SocialAuthButtons = () => {
  const handleOAuthLogin = async (provider: string) => {
    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("OAuth Error:", error.message);
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
    }
  };

  return (
    <div className="space-y-2 mt-3">
      {providers.map((item) => {
        const Icon = item.icon;

        return (
          <SocialAuthButton
            key={item.name}
            action={() => handleOAuthLogin(item.name)}
          >
            <Icon />
            {item.label}
          </SocialAuthButton>
        );
      })}
    </div>
  );
};

export default SocialAuthButtons;
