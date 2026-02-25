import "./globals.css";
import AppProviders from "components/AppProviders";

export const metadata = {
  title: "Task Manager",
  description: "Task Manager frontend",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}