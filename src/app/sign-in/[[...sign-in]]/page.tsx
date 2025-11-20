"use client"

import { SignIn } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center -mt-16">
      <SignIn
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: "#0ea5e9",
            colorText: "#ffffff",
            colorBackground: "#020817",
            colorInputBackground: "#1e293b",
            colorInputText: "#ffffff",
            borderRadius: "0.5rem",
          },
          elements: {
            card: {
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              border: "1px solid #1e293b",
              width: "400px",
            },
            rootBox: {
              margin: "0",
              padding: "0",
            },
            formButtonPrimary: {
              backgroundColor: "#0ea5e9",
              fontSize: "14px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#0284c7",
              },
            },
            footerAction: {
              display: "none",
            },
            dividerRow: {
              display: "none",
            },
            socialButtons: {
              display: "none",
            },
            footer: {
              display: "none",
            },
          },
        }}
      />
    </div>
  )
}
