import { supabase } from '@/integrations/supabase/client';

interface VerifiedArtist {
  username: string;
  user_bio: string;
  role: string;
  genre: string[];
}

const verifiedArtists: VerifiedArtist[] = [
  {
    username: "Maor Applebaum",
    user_bio: "Grammy-winning mastering engineer with extensive experience in various music genres.",
    role: "Mastering Engineer",
    genre: ["All Genres"]
  },
  {
    username: "Adam Ayan",
    user_bio: "Multi-Grammy Award winning mastering engineer known for his work with major artists.",
    role: "Mastering Engineer",
    genre: ["All Genres"]
  },
  {
    username: "Kenny Lamb",
    user_bio: "Award-winning songwriter and lyricist with multiple chart-topping hits.",
    role: "Lyricist",
    genre: ["Pop", "Country", "R&B"]
  },
  {
    username: "Mark Needham",
    user_bio: "Renowned mix engineer known for his work with rock and alternative artists.",
    role: "Mix Engineer",
    genre: ["Rock", "Alternative", "Pop"]
  },
  {
    username: "Sylvia Massey",
    user_bio: "Innovative mix engineer known for unconventional recording techniques.",
    role: "Mix Engineer",
    genre: ["Rock", "Alternative", "Experimental"]
  },
  {
    username: "Gregg Bissonette",
    user_bio: "Versatile drummer who has performed with numerous high-profile artists.",
    role: "Drummer",
    genre: ["Rock", "Jazz", "Pop"]
  },
  {
    username: "Mike Daws",
    user_bio: "Accomplished acoustic guitarist specializing in fingerstyle techniques.",
    role: "Acoustic Guitarist",
    genre: ["Folk", "Acoustic", "Contemporary"]
  },
  {
    username: "Alex Acuna",
    user_bio: "Legendary percussionist known for his work in jazz and Latin music.",
    role: "Percussionist",
    genre: ["Jazz", "Latin", "World Music"]
  },
  {
    username: "Phil Keaggy",
    user_bio: "Virtuoso acoustic guitarist known for his innovative playing style.",
    role: "Acoustic Guitarist",
    genre: ["Christian", "Folk", "Rock"]
  },
  {
    username: "Dave Weckl",
    user_bio: "Influential drummer known for his technical precision and versatility.",
    role: "Drummer",
    genre: ["Jazz", "Fusion", "Rock"]
  },
  {
    username: "Colt Capperune",
    user_bio: "Professional mix engineer specializing in modern production techniques.",
    role: "Mixer",
    genre: ["Pop", "Hip Hop", "Electronic"]
  },
  {
    username: "Ryan Curtis",
    user_bio: "Experienced songwriter and content creator.",
    role: "Writer",
    genre: ["Pop", "Rock", "Country"]
  },
  {
    username: "Tae Lewis",
    user_bio: "Soulful vocalist with a dynamic range and powerful delivery.",
    role: "Vocalist",
    genre: ["R&B", "Soul", "Gospel"]
  },
  {
    username: "Cianna Pelekia",
    user_bio: "Versatile vocalist specializing in contemporary styles.",
    role: "Vocalist",
    genre: ["Pop", "R&B", "Jazz"]
  },
  {
    username: "Jake Hertzog",
    user_bio: "Innovative guitarist blending jazz and contemporary styles.",
    role: "Guitarist",
    genre: ["Jazz", "Fusion", "Contemporary"]
  },
  {
    username: "Sierra Carson",
    user_bio: "Dynamic vocalist with a passion for contemporary music.",
    role: "Vocalist",
    genre: ["Pop", "Rock", "Alternative"]
  },
  {
    username: "Abby Stahlschimidt",
    user_bio: "Classical violinist with expertise in multiple genres.",
    role: "Violinist",
    genre: ["Classical", "Contemporary", "Folk"]
  },
  {
    username: "Myah Marie",
    user_bio: "Multi-talented artist excelling in both vocals and songwriting.",
    role: "Vocalist, Writer",
    genre: ["Pop", "Electronic", "R&B"]
  },
  {
    username: "Khya Carson",
    user_bio: "Emerging vocalist with a unique contemporary style.",
    role: "Vocalist",
    genre: ["Pop", "R&B", "Soul"]
  },
  {
    username: "Billie Decker",
    user_bio: "Professional mix engineer with expertise in modern production.",
    role: "Mixer",
    genre: ["Pop", "Rock", "Electronic"]
  },
  {
    username: "Chris Rowe",
    user_bio: "Experienced mix engineer known for country and pop productions.",
    role: "Mixer",
    genre: ["Country", "Pop", "Rock"]
  }
];

export const createVerifiedArtists = async () => {
  for (const artist of verifiedArtists) {
    const { data: existingArtist } = await supabase
      .from('artist_profiles')
      .select('id')
      .eq('username', artist.username)
      .single();

    if (!existingArtist) {
      const { error } = await supabase
        .from('artist_profiles')
        .insert([
          {
            username: artist.username,
            user_bio: artist.user_bio,
            role: artist.role,
            genre: artist.genre,
            is_verified: true,
            verified_date: new Date().toISOString(),
            is_public: true,
            persona_count: 0,
            persona_ids: [],
            has_3d_model: false,
            animation_preset: 'default',
            banner_position: { x: 50, y: 50 }
          }
        ]);

      if (error) {
        console.error(`Error creating profile for ${artist.username}:`, error);
      }
    }
  }
};