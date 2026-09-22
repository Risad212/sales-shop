import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="mb-[80px]">
      <div className="container">
        <div className="relative flex h-[350px] w-full flex-col items-center justify-center overflow-hidden rounded-[15px] bg-neutral-900 bg-cover bg-center text-center">
          <div className="absolute inset-0 bg-black/40" />
          <h3 className="relative px-4 text-[22px] font-semibold text-white md:text-[30px]">
            SALE UP TO 70% OFF FOR ALL FASHION ITEMS, ON ALL BRANDS.
          </h3>
          <Button asChild variant="brand" size="lg" className="relative mt-[40px]">
            <Link href="/contact">Call To Action</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
