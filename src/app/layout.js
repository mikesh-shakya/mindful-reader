import FooterRotating from "../components/Footer";
import NavBar from "../components/Navbar";
import UserProvider from "../contexts/UserProvider";
import "../styles/globals.css";

export const metadata = {
  title: "mindful reader",
  description: "Read with Intention",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <NavBar />
          {children}
          <FooterRotating />
        </UserProvider>
      </body>
    </html>
  );
}
