import BlogSidebar from "./BlogSidebar";
import WishProduct from "./WishProduct";

export default function WishlistPage() {
  return (
    <div className="py-5">
      <div className="container">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <WishProduct />
          </div>
          <div className="lg:col-span-4">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
