import PropTypes from 'prop-types';
import Navbar from "./Navbar";
import ScrollToTop from "../ui/ScrollToTop";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-neo-yellow">
      <Navbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
      <ScrollToTop />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default Layout;
