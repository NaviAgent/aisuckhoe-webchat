import ProfileIdClientPage from './page.client';
import { getProfileById } from '@/lib/prisma/profile.service'; // Assuming this service exists
// import { getChatSessionsByUserId } from '@/lib/prisma/chat-session.service'; // Assuming this service exists

interface ProfilePageProps {
  params: { id: string };
}

// TODO: Add error handling if profile not found
// TODO: Implement getChatSessionsByUserId and pass sessions

export default async function ProfileIdPage({ params }: ProfilePageProps) {
  const profileId = params.id;
  // Fetch profile data based on the ID
  // Note: Add proper authentication/authorization checks here
  const profile = await getProfileById(profileId);
  // const chatSessions = await getChatSessionsByUserId(profileId); // Fetch associated chat sessions

  if (!profile) {
    // Handle profile not found case, maybe redirect or show a 404 page
    return <div>Profile not found.</div>;
  }

  return <ProfileIdClientPage profile={profile} /* chatSessions={chatSessions} */ />;
}
