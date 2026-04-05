import { raw } from "hono/html";
import type { Child } from "hono/jsx";

interface LayoutProps {
  title?: string;
  children: Child;
}

export function Layout({ title = "Wastepaperbasket", children }: LayoutProps) {
  return (
    <>
      {raw("<!DOCTYPE html>")}
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />
          <title>{title}</title>
          <link rel="icon" type="image/png" href="/favicon.png" />
          <link rel="stylesheet" href="/styles.css" />
        </head>
        <body class="bg-black text-white min-h-screen font-sans">
          <header class="fixed top-0 left-0 z-50 p-6">
            <a
              href="/images"
              class="flex items-start gap-2 no-underline text-white/80 hover:text-white transition-colors"
            >
              <img
                src="/wpb_logo_100.png"
                alt="wastepaperbasket"
                class="w-5 h-5"
              />
              <span class="text-sm font-medium tracking-wide [writing-mode:vertical-lr]">
                wastepaperbasket
              </span>
            </a>
          </header>
          <main>{children}</main>
          <script src="/js/app.js" defer />
        </body>
      </html>
    </>
  );
}
