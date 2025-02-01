import { Nunito } from "next/font/google";
import "./globals.css";

// Import the Nunito font
const nunito = Nunito({
  variable: "--font-nunito", // Define a CSS variable for Nunito
  subsets: ["latin"], // Specify subsets
  weight: ["400", "600", "700"], // Include desired weights
});

export const metadata = {
  title: "WasteNot",
  description: "Waste management app for individuals looking to make a difference through sustainability.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${nunito.variable}`}>
        {children}
      </body>
    </html>
  );
}
