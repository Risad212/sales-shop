import { Globe2, Shirt, Gift, Lock } from "lucide-react";

const FEATURES = [
  { icon: Globe2, title: "Worldwide Shipping", text: "It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." },
  { icon: Shirt, title: "Best Quality", text: "It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." },
  { icon: Gift, title: "Best Offers", text: "It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." },
  { icon: Lock, title: "Secure Payments", text: "It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." },
];

export default function ProductFeature() {
  return (
    <section className="my-[60px]">
      <div className="container">
        <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <Icon className="mx-auto mb-[20px] h-10 w-10 text-[#6BB42F]" />
              <h3 className="mb-[10px] text-[18px] font-semibold text-black">{title}</h3>
              <p className="text-sm text-neutral-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
