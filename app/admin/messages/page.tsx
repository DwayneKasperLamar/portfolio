import { redirect } from 'next/navigation';

// Messages now live on the Enquiries screen.
export default function AdminMessagesPage() {
  redirect('/admin/enquiries#earlier');
}
