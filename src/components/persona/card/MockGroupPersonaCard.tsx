import { GroupPersonaCard } from './GroupPersonaCard';

export const MockGroupPersonaCard = () => {
  const mockGroup = {
    id: 'mock-group-1',
    name: 'Dreamaker Collective',
    description: 'A diverse group of creative personas collaborating on innovative musical projects and exploring new sonic territories.',
    avatar_urls: [
      '/lovable-uploads/4ae2356f-5155-4bf0-81b7-259f38368f76.png',
      '/lovable-uploads/575fd81c-f265-44d2-895d-f14d48f641be.png',
      '/lovable-uploads/6402c060-ac87-482b-af99-e8eeb9005022.png'
    ],
    member_personas: ['persona1', 'persona2', 'persona3', 'persona4'],
    is_public: true,
    video_url: '/Videos/DREAMAKER_01.mp4',
    banner_url: '/dreamaker-hero.png'
  };

  const handleEdit = () => {
    console.log('Edit clicked');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Group Persona Card Preview</h2>
      <GroupPersonaCard group={mockGroup} onEdit={handleEdit} />
    </div>
  );
};