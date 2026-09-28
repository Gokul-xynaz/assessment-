import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { TasksProvider } from "@/hooks/useTasks";
import { Toast } from "@/components/ui/Toast";
import { Confetti } from "@/components/ui/Confetti";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });

export const metadata = {
  title: "Stacks - Task Board",
  description: "A beautiful, animated task board built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${bricolage.variable} font-sans`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('stacks-theme') === 'dark' || (!('stacks-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
        <TasksProvider>
          {children}
          <Toast />
          <Confetti />
        </TasksProvider>
      </body>
    </html>
  );
}
