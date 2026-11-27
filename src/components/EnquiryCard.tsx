import Link from 'next/link';

// The invitation in the contact area. Every new client or recruiter starts here.
const EnquiryCard = () => (
  <div className="grid gap-3 rounded-2xl border border-line bg-base p-[18px] text-primary md:p-6">
    <h3 className="font-head text-xl font-semibold">Work with me</h3>
    <p className="text-sm text-secondary">
      Hiring or have an offer? Book a free call. Want a consultation? Tell me who you are and what you need.
    </p>
    <Link href="/enquire" className="btn btn-fill w-full">
      Start here
    </Link>
  </div>
);

export default EnquiryCard;
