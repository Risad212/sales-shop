import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Banner() {
  return (
    <section className="flex h-[420px] w-full items-center bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 bg-cover bg-center md:h-[560px]">
      <div className="container">
        <div className="max-w-[50%] text-white">
          <h2 className="mb-0 text-3xl font-semibold md:text-[45px] md:leading-tight">
            Life is more than sunglasses and hit movies.
          </h2>
          <h5 className="mt-[15px] text-[18px] text-neutral-200">
            Casual line with short design in 100% suede T-shirt
          </h5>
          <Button asChild variant="brand" size="lg" className="mt-[25px] tracking-[2px]">
            <Link href="/shop">Shop Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
