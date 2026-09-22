import TitleBorder from "./TitleBorder";

interface SectionHeadingProps {
  title: string;
  align?: "center" | "left";
}

export default function SectionHeading({ title, align = "center" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <h2 className="pb-[15px] text-[35px] font-medium text-[#2c2a2a]">{title}</h2>
      <TitleBorder className={align === "left" ? "m-0 mb-[35px]" : undefined} />
    </div>
  );
}
