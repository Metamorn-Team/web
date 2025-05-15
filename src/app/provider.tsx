"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId="643620098305-m4javmkthiki8jciimaloh1hj14g18ap.apps.googleusercontent.com">
        {children}
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
};

export default Providers;
