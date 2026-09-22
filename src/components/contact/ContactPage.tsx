import ContactForm from "./ContactForm";
import SectionHeading from "@/components/common/SectionHeading";

export default function ContactPage() {
  return (
    <div className="container py-10">
      <SectionHeading title="Contact Us" />
      <ContactForm />
    </div>
  );
}
