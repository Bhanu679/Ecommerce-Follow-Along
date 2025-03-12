import Product from "./auth/Product";
import Navbar from "./Navbar";
const Home = () => {
  // Example list of products
  return(
    <div className="flex flex-col gap-2 bg-yellow-400">
      <div>
    <Navbar/>
    </div>
    <div className="mt-15">
    
    </div>
    <Product />
    
    </div>
  )
}
export default Home;