import Link from "next/link";
import { categoryData } from "@/fakeData/fake-data";
import SectionHeading from "@/components/common/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProductCategory() {
  return (
    <section className="my-[80px]">
      <div className="container">
        <SectionHeading title="Product Category" />
        <div className="mt-[25px] grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categoryData.map((category) => (
            <Card key={category.category} className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={category.img} alt={category.title} className="h-48 w-full object-cover" loading="lazy" />
              <CardContent className="p-4">
                <h4 className="mb-[20px] mt-[15px] text-[20px]">{category.title}</h4>
                <Button asChild variant="brand" size="sm">
                  <Link href={`/category/${category.category}`}>See collection</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
