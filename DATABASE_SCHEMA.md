# Skema Database Adopsi Hewan - Supabase PostgreSQL

## Panduan Setup Database

### 1. Tabel Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'user', -- user, admin_shelter, super_admin
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Tabel Roles
```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Tabel Shelters
```sql
CREATE TABLE shelters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city VARCHAR(100),
  province VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  logo_url TEXT,
  operating_hours JSONB,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Tabel Categories
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug) VALUES
  ('Kucing', 'kucing'),
  ('Anjing', 'anjing'),
  ('Burung', 'burung'),
  ('Kelinci', 'kelinci'),
  ('Hamster', 'hamster'),
  ('Ikan', 'ikan'),
  ('Reptil', 'reptil'),
  ('Hewan Eksotis', 'eksotis'),
  ('Hewan Langka', 'langka'),
  ('Hewan Dilindungi', 'dilindungi'),
  ('Hewan Laut', 'laut'),
  ('Hewan Ternak', 'ternak'),
  ('Satwa Konservasi', 'konservasi');
```

### 5. Tabel Animals
```sql
CREATE TABLE animals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shelter_id UUID REFERENCES shelters(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id),
  name VARCHAR(255) NOT NULL,
  breed VARCHAR(255),
  age INTEGER,
  weight DECIMAL(10, 2),
  height DECIMAL(10, 2),
  color VARCHAR(100),
  gender VARCHAR(20),
  description TEXT,
  health_status VARCHAR(255),
  vaccinated BOOLEAN,
  vaccination_date TIMESTAMP,
  disease_history TEXT,
  status VARCHAR(50) DEFAULT 'available', -- available, adopted, reserved
  qr_code VARCHAR(255),
  views_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_animals_shelter_id ON animals(shelter_id);
CREATE INDEX idx_animals_category_id ON animals(category_id);
CREATE INDEX idx_animals_status ON animals(status);
```

### 6. Tabel Animal Images
```sql
CREATE TABLE animal_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption VARCHAR(255),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_animal_images_animal_id ON animal_images(animal_id);
```

### 7. Tabel Animal Videos
```sql
CREATE TABLE animal_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  title VARCHAR(255),
  duration INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_animal_videos_animal_id ON animal_videos(animal_id);
```

### 8. Tabel Favorites
```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, animal_id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_animal_id ON favorites(animal_id);
```

### 9. Tabel Adoptions
```sql
CREATE TABLE adoptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  animal_id UUID REFERENCES animals(id),
  shelter_id UUID REFERENCES shelters(id),
  status VARCHAR(50) DEFAULT 'pending', -- pending, survey, approved, rejected, completed
  occupation VARCHAR(255),
  income VARCHAR(100),
  pet_experience TEXT,
  adoption_reason TEXT,
  num_pets INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_adoptions_user_id ON adoptions(user_id);
CREATE INDEX idx_adoptions_shelter_id ON adoptions(shelter_id);
CREATE INDEX idx_adoptions_status ON adoptions(status);
```

### 10. Tabel Reviews
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shelter_id UUID REFERENCES shelters(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_shelter_id ON reviews(shelter_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
```

### 11. Tabel Ratings
```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, animal_id)
);

CREATE INDEX idx_ratings_animal_id ON ratings(animal_id);
```

### 12. Tabel Articles
```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  category VARCHAR(100),
  content TEXT,
  excerpt TEXT,
  thumbnail_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_published ON articles(published);
```

### 13. Tabel Comments
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_article_id ON comments(article_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
```

### 14. Tabel Notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100),
  title VARCHAR(255),
  message TEXT,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
```

### 15. Tabel Chat Rooms
```sql
CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shelter_id UUID REFERENCES shelters(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, shelter_id)
);

CREATE INDEX idx_chat_rooms_user_id ON chat_rooms(user_id);
CREATE INDEX idx_chat_rooms_shelter_id ON chat_rooms(shelter_id);
```

### 16. Tabel Chat Messages
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  file_url TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);
```

### 17. Tabel Analytics
```sql
CREATE TABLE analytics (
  id SERIAL PRIMARY KEY,
  date DATE DEFAULT CURRENT_DATE,
  total_users INTEGER DEFAULT 0,
  total_adoptions INTEGER DEFAULT 0,
  total_animals INTEGER DEFAULT 0,
  total_shelters INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_date ON analytics(date);
```

### 18. Tabel Settings
```sql
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Row Level Security (RLS)

Aktifkan RLS di Supabase untuk keamanan data:

```sql
-- Users RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Animals RLS
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view animals"
ON animals FOR SELECT
USING (true);

-- Favorites RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their favorites"
ON favorites
USING (auth.uid() = user_id);
```

## Storage Buckets

Buat bucket di Supabase Storage:
- `animal-images` - Foto hewan
- `animal-videos` - Video hewan
- `user-avatars` - Avatar user
- `shelter-logos` - Logo shelter
- `article-thumbnails` - Thumbnail artikel
