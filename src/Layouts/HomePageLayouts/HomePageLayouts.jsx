import Header from '../header/Header';
import Footer from '../Footer/Footer';
import { Outlet } from 'react-router-dom';

const HomePageLayouts = () => {
    return (
        <>
         <Header />
          <main>
              <Outlet /> 
          </main>
         <Footer />
        </>
    )
}
export default HomePageLayouts;