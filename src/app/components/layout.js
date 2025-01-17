import Header from "./header"
import Footer from "./footer"

export default function Layout({ children, memberData }) {
  return (
    <div className="bg-primary">
      <Header memberData={memberData} />
      <div className="main-content">
        {children}
      </div>
      <Footer />
    </div>
  );
}
