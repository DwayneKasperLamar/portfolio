import Link from 'next/link';

// The invitation in the contact area. Every new client starts at the enquiry form.
const EnquiryCard = () => (
  <div className="grid gap-3 rounded-2xl border border-line bg-base p-[18px] text-primary md:p-6">
    <h3 className="font-head text-xl font-semibold">Work with me</h3>
    <p className="text-sm text-secondary">
      Tell me who you are, where you are and what you need. If it is a fit, you get a link to book a paid session.
    </p>
    <Link href="/enquire" className="btn btn-fill w-full">
      Start an enquiry
    </Link>
  </div>
);

export default EnquiryCard;
